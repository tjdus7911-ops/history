const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const root = path.resolve('dist');
const output = path.resolve(process.env.QA_OUTPUT || 'artifacts/learning-missions-qa');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = http.createServer((request, response) => {
  const pathname = decodeURI(request.url.split('?')[0]);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { response.writeHead(403); return response.end(); }
  fs.readFile(file, (error, body) => {
    response.statusCode = error ? 404 : 200;
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    response.end(error ? '' : body);
  });
});

(async () => {
  let browser;
  try {
    fs.mkdirSync(output, { recursive: true });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
    const widths = (process.env.MISSION_TEST_WIDTHS || '360,390,430').split(',').map(Number).filter(Number.isFinite);
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const baseUrl = 'http://127.0.0.1:' + server.address().port;
      await page.goto(baseUrl);
      await page.waitForFunction(() => globalThis.CORE_APP_READY && globalThis.HOME_V6_API && globalThis.LEARNING_MISSIONS);
      await page.locator('.lm-card').waitFor();

      const placement = await page.evaluate(() => {
        const status = document.querySelector('.hv-status').getBoundingClientRect();
        const card = document.querySelector('.lm-card').getBoundingClientRect();
        return { afterStatus: card.top >= status.bottom, right: card.right, pageWidth: document.documentElement.scrollWidth };
      });
      assert(placement.afterStatus, 'mission card follows study status at ' + width + 'px');
      assert(placement.right <= width + 1 && placement.pageWidth <= width + 1, 'home card does not overflow ' + width + 'px');
      assert.equal(await page.locator('.lm-row').count(), 2, 'home shows only two missions initially');
      await page.locator('[data-mission-expand]').click();
      assert.equal(await page.locator('.lm-row').count(), 4, '전체 보기 expands all enabled missions');
      assert.equal(await page.locator('[data-mission-expand]').innerText(), '접기');
      await page.locator('[data-mission-expand]').click();
      assert.equal(await page.locator('.lm-row').count(), 2, '접기 restores the compact list');
      await page.evaluate(() => {
        const card = document.querySelector('.lm-card').getBoundingClientRect();
        const fabTop = document.querySelector('.jk-fab')?.getBoundingClientRect().top ?? Infinity;
        const navTop = document.querySelector('nav.app-navigation')?.getBoundingClientRect().top ?? Infinity;
        window.scrollTo(0, Math.max(0, card.bottom + window.scrollY - Math.min(fabTop, navTop)));
      });
      const cardClearance = await page.evaluate(() => ({
        cardBottom: document.querySelector('.lm-card').getBoundingClientRect().bottom,
        fabTop: document.querySelector('.jk-fab')?.getBoundingClientRect().top ?? Infinity,
        navTop: document.querySelector('nav.app-navigation')?.getBoundingClientRect().top ?? Infinity,
      }));
      assert(cardClearance.cardBottom <= cardClearance.fabTop + 1 && cardClearance.cardBottom <= cardClearance.navTop + 1, 'mission card can be fully brought above the fixed FAB and bottom navigation');
      await page.evaluate(() => window.scrollTo(0, 0));

      await page.locator('.lm-settings-link').click();
      await page.locator('.lm-settings').waitFor();
      assert.equal(await page.locator('#lm-settings-title').innerText(), '목표 설정하기');
      assert.equal(await page.locator('.lm-setting-card').count(), 4);
      assert.equal(await page.locator('.lm-target-control').nth(0).locator('strong').innerText(), '1회');
      await page.locator('[data-mission-adjust="exam"][data-direction="1"]').click();
      await page.locator('[data-mission-adjust="exam"][data-direction="1"]').click();
      assert.equal(await page.locator('.lm-target-control').nth(0).locator('strong').innerText(), '3회');
      assert.equal(await page.locator('[data-mission-adjust="exam"][data-direction="1"]').isDisabled(), true, 'goal controls stop at the configured maximum');
      await page.locator('[data-mission-adjust="exam"][data-direction="-1"]').click();
      assert.equal(await page.locator('.lm-target-control').nth(0).locator('strong').innerText(), '2회');
      await page.locator('[data-mission-adjust="ox"][data-direction="-1"]').click();
      assert.equal(await page.locator('.lm-target-control').nth(2).locator('strong').innerText(), '5문제');
      assert.equal(await page.locator('[data-mission-adjust="ox"][data-direction="-1"]').isDisabled(), true, 'goal controls stop at the configured minimum');
      await page.locator('label[for="lm-enabled-exam"]').click();
      await page.locator('label[for="lm-enabled-story"]').click();
      await page.locator('label[for="lm-enabled-jokbo"]').click();

      const settingsGeometry = await page.evaluate(() => {
        const rect = (selector) => { const element = document.querySelector(selector); if (!element) return null; const value = element.getBoundingClientRect(); return { top: value.top, bottom: value.bottom, left: value.left, right: value.right }; };
        return { save: rect('.lm-save'), nav: rect('nav.app-navigation'), fab: rect('.jk-fab'), width: document.documentElement.scrollWidth };
      });
      assert(settingsGeometry.width <= width + 1, 'settings do not overflow ' + width + 'px');
      assert.equal(settingsGeometry.fab, null, 'the existing Jokbo FAB is not shown over the settings action');
      assert.equal(await page.locator('nav.app-navigation [data-nav="home"]').getAttribute('aria-current'), 'page', 'home navigation remains selected');
      assert(settingsGeometry.save.right <= width && settingsGeometry.save.left >= 0, 'save button fits ' + width + 'px');
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const saveClearance = await page.evaluate(() => ({
        saveBottom: document.querySelector('.lm-save').getBoundingClientRect().bottom,
        navTop: document.querySelector('nav.app-navigation').getBoundingClientRect().top,
        fab: Boolean(document.querySelector('.jk-fab')),
      }));
      assert(saveClearance.saveBottom <= saveClearance.navTop + 1, 'goal save action remains above the bottom navigation');
      assert.equal(saveClearance.fab, false, 'goal settings remain clear of the Jokbo FAB');
      await page.evaluate(() => window.scrollTo(0, 0));

      await page.locator('[data-mission-save]').click();
      await page.locator('.lm-row').waitFor();
      assert.equal(await page.locator('.lm-row').count(), 1, 'only the selected OX mission appears on home');
      assert((await page.locator('.lm-row').innerText()).includes('OX 퀴즈 풀기'));
      assert.equal(await page.evaluate(() => LEARNING_MISSIONS.state().settings.ox.target), 5);
      assert.equal(await page.evaluate(() => LEARNING_MISSIONS.state().settings.exam.enabled), false);

      await page.reload();
      await page.waitForFunction(() => globalThis.CORE_APP_READY && globalThis.LEARNING_MISSIONS);
      assert.equal(await page.evaluate(() => LEARNING_MISSIONS.state().settings.ox.target), 5, 'goal target survives reload');
      assert.equal(await page.locator('.lm-row').count(), 1, 'enabled selection survives reload');

      await page.locator('.lm-settings-link').click();
      await page.locator('label[for="lm-enabled-ox"]').click();
      await page.locator('[data-mission-save]').click();
      await page.locator('.lm-empty').waitFor();
      assert.equal(await page.locator('.lm-empty p').innerText(), '오늘 실천할 미션을 선택해 주세요.');
      await page.locator('.lm-empty [data-mission-settings]').click();
      await page.locator('label[for="lm-enabled-ox"]').click();
      await page.locator('[data-mission-save]').click();

      await page.locator('.lm-row[data-mission-go="ox"]').click();
      await page.locator('.r7-ox-home').waitFor();
      await page.locator('[data-ox-start="all"]').click();
      for (let index = 0; index < 5; index += 1) {
        await page.locator('[data-ox-answer]').first().click();
        try { await page.locator('.r7-ox-feedback').waitFor({ timeout: 5000 }); }
        catch (error) {
          console.error('OX answer debug', await page.evaluate(() => ({ screen, route: APP_ROUTE.current(), view: OX_QUIZ_API.snapshot().view, active: OX_QUIZ_API.snapshot().meta.activeSession, answerCount: document.querySelectorAll('[data-ox-answer]').length, card: document.querySelector('[data-r7-ox-card]')?.innerHTML.slice(0, 1200) })));
          throw error;
        }
        if (index < 4) await page.locator('[data-ox-next]').click();
      }
      assert.equal(await page.evaluate(() => LEARNING_MISSIONS.snapshot().counts.ox), 5, 'real OX answers update the mission count regardless of correctness');
      await page.locator('.r7-ox-play [data-ox-back="home"]').click();
      await page.locator('nav.app-navigation [data-nav="home"]').click();
      await page.locator('.lm-card').waitFor();
      assert((await page.locator('.lm-row').innerText()).includes('5 / 5문제'));
      assert((await page.locator('.lm-card').innerText()).includes('오늘의 목표 달성!'));
      await page.reload();
      await page.waitForFunction(() => globalThis.CORE_APP_READY && globalThis.LEARNING_MISSIONS);
      assert.equal(await page.evaluate(() => LEARNING_MISSIONS.snapshot().counts.ox), 5, 'answer progress remains after reload');

      if (width === widths[0]) {
        await page.locator('.lm-settings-link').click();
        await page.locator('label[for="lm-enabled-exam"]').click();
        await page.locator('label[for="lm-enabled-jokbo"]').click();
        await page.locator('[data-mission-save]').click();

        await page.locator('.lm-row[data-mission-go="exam"]').click();
        const questionId = await page.evaluate(() => OFFICIAL_EXAM_CATALOG[0]?.canonicalQuestionId);
        assert(questionId, 'an official exam question is available for the submission flow');
        for (let attempt = 1; attempt <= 2; attempt += 1) {
          await page.evaluate((id) => OFFICIAL_EXAM_UI.startExam([id], { timed: false, startImmediately: true, scope: 'selection' }), questionId);
          await page.locator('[data-official-request-submit]').click();
          await page.locator('[data-official-submit-confirm]').click();
          await page.waitForFunction((count) => LEARNING_MISSIONS.snapshot().counts.exam === count, attempt);
        }
        assert.equal(await page.evaluate(() => LEARNING_MISSIONS.snapshot().counts.exam), 2, 'separately submitted exam attempts each count once');

        await page.locator('nav.app-navigation [data-nav="home"]').click();
        await page.locator('[data-mission-expand]').click();
        await page.locator('.lm-row[data-mission-go="jokbo"]').click();
        await page.locator('[data-jk-search]').click();
        const searchTerm = await page.evaluate(() => JOKBO_DATA.keywords[0]?.value);
        assert(searchTerm, 'a Jokbo search keyword is available');
        await page.locator('[data-jk-query]').fill(searchTerm);
        await page.locator('[data-jk-search-result]').first().click();
        assert.equal(await page.evaluate(() => LEARNING_MISSIONS.snapshot().counts.jokbo), 1, 'opening a Jokbo detail from search counts one keyword');
        const detailRoute = await page.evaluate(() => APP_ROUTE.current());
        await page.evaluate((route) => APP_ROUTE.apply(route), detailRoute);
        assert.equal(await page.evaluate(() => LEARNING_MISSIONS.snapshot().counts.jokbo), 1, 'reopening the same detail does not count twice');
        await page.evaluate(() => APP_ROUTE.apply('home'));
      }

      const rowWidths = await page.locator('.lm-row-copy').evaluateAll((nodes) => nodes.map((node) => ({ width: node.clientWidth, scrollWidth: node.scrollWidth })));
      assert(rowWidths.every((row) => row.scrollWidth <= row.width + 1), 'mission labels are not clipped at ' + width + 'px');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'document has no horizontal overflow at ' + width + 'px');
      await page.screenshot({ path: path.join(output, 'home-' + width + '.png'), fullPage: true, animations: 'disabled' });
      assert.deepEqual(errors, [], 'no browser errors at ' + width + 'px');
      await context.close();
    }
    console.log('PASS: 360/390/430px layout, settings, persistence, real OX answers, submitted exam retakes and unique Jokbo search-detail aggregation.');
  } finally {
    await browser?.close();
    server.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });

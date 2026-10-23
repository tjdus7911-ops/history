const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve('dist');
const output = path.resolve(process.env.QA_OUTPUT || '../../outputs/mobile-tabs-bg-qa');
const baseline = process.env.QA_BASELINE === '1';
const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];
  if (baseline && requestPath === '/mobile-design-system.css') {
    const css = execFileSync('git', ['show', 'HEAD:dist/mobile-design-system.css']);
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
    return res.end(css);
  }
  const file = path.resolve(root, '.' + (requestPath === '/' ? '/index.html' : requestPath));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (error, contents) => {
    if (error && requestPath.startsWith('/assets/')) {
      const origin = JSON.parse(fs.readFileSync('config/deployment-asset-origin.json', 'utf8'));
      res.writeHead(302, { Location: encodeURI(`https://raw.githubusercontent.com/${origin.repository}/${origin.commit}/${origin.sourcePath}${requestPath.slice(7)}`) });
      return res.end();
    }
    res.statusCode = error ? 404 : 200;
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' })[path.extname(file)] || 'application/octet-stream');
    res.end(error ? '' : contents);
  });
});

const waitReady = page => page.waitForFunction(() => typeof inputLockedUntil === 'undefined' || Date.now() >= inputLockedUntil);
const check = (condition, message) => { if (!baseline) assert(condition, message); };

(async () => {
  let browser;
  const results = [];
  try {
    fs.mkdirSync(output, { recursive: true });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ headless: true, ...(process.env.QA_BROWSER_CHANNEL ? { channel: process.env.QA_BROWSER_CHANNEL } : {}) });
    for (const [width, height] of [[360, 800], [390, 844], [412, 915]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      await page.locator('.hv-era-title').first().waitFor();
      const captured = [];
      const capture = async name => {
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(180);
        const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert(dimensions.width <= dimensions.viewport + 1, `${name} horizontal overflow at ${width}px`);
        await page.screenshot({ animations: 'disabled', path: path.join(output, `${name}-${width}.png`) });
        captured.push(name);
      };
      const story = await page.locator('.hv-era-title').first().evaluate(element => ({ color: getComputedStyle(element).color, art: element.closest('.hv-era').querySelector('.hv-card-art')?.getAttribute('src') || '' }));
      check(story.color === 'rgb(255, 255, 255)', `story heading color at ${width}px`);
      await capture('home');

      await page.locator('nav [data-nav="exam-library"]').click(); await waitReady(page);
      const tabState = await page.locator('.r7-page.r7-exam-home .r7-tabs button').first().evaluate(element => {
        const style = getComputedStyle(element), rect = element.getBoundingClientRect();
        return { height: rect.height, color: style.color, background: style.backgroundColor, underline: style.borderBottomColor, selected: element.getAttribute('aria-selected') };
      });
      check(tabState.height >= 48, `exam tab touch height at ${width}px`);
      check(tabState.background === 'rgba(0, 0, 0, 0)', `exam tab transparent at ${width}px`);
      check(tabState.color === 'rgb(233, 81, 59)', `active exam tab coral at ${width}px`);
      const filterState = await page.locator('.r7-exam-levels button').first().evaluate(element => {
        const style = getComputedStyle(element), rect = element.getBoundingClientRect();
        return { height: rect.height, radius: style.borderRadius, color: style.color, background: style.backgroundColor };
      });
      check(filterState.height === 36, `exam filter height at ${width}px`);
      check(filterState.radius === '999px', `exam filter pill at ${width}px`);
      check(filterState.background === 'rgb(233, 81, 59)', `exam filter active color at ${width}px`);
      await capture('exam-library');
      await page.locator('.r7-exam-levels [data-r7-exam-level="기본"]').click(); await waitReady(page);
      assert.equal(await page.locator('.r7-exam-levels [data-r7-exam-level="기본"]').getAttribute('aria-pressed'), 'true');
      await page.locator('.r7-tabs [data-official-tab="era"]').click(); await waitReady(page);
      await page.locator('.r7-tabs [data-official-tab="round"]').click(); await waitReady(page);
      assert.equal(await page.locator('.r7-exam-levels [data-r7-exam-level="기본"]').getAttribute('aria-pressed'), 'true', 'exam level remains selected while switching tabs');

      await page.locator('nav [data-nav="study"]').click(); await waitReady(page);
      await page.locator('.r7-page.r7-wrong .r7-tabs').waitFor();
      await capture('wrong-note');
      const wrongTab = await page.locator('.r7-page.r7-wrong .r7-tabs button').first().evaluate(element => ({ height: element.getBoundingClientRect().height, background: getComputedStyle(element).backgroundColor, color: getComputedStyle(element).color }));
      check(wrongTab.height >= 48 && wrongTab.background === 'rgba(0, 0, 0, 0)' && wrongTab.color === 'rgb(233, 81, 59)', `wrong-note underline tab at ${width}px`);

      await page.locator('nav [data-nav="ox"]').click(); await waitReady(page);
      await page.locator('.r7-ox-row[data-ox-start="all"]').click(); await waitReady(page);
      const oxSurfaces = await page.locator('.r7-ox-swipe').evaluate(element => ({ page: getComputedStyle(element).backgroundColor, head: getComputedStyle(element.querySelector('.r7-quiz-head')).backgroundColor, tally: getComputedStyle(element.querySelector('.r7-ox-tally')).backgroundColor, card: getComputedStyle(element.querySelector('.r7-ox-card')).backgroundColor }));
      check(oxSurfaces.page === 'rgb(250, 251, 252)', `page background at ${width}px`);
      check(oxSurfaces.head === oxSurfaces.page, `OX header joins page at ${width}px`);
      check(oxSurfaces.tally === oxSurfaces.page, `OX score tally joins page at ${width}px`);
      check(oxSurfaces.card === 'rgb(255, 255, 255)', `OX question remains a white card at ${width}px`);
      await capture('ox-question');
      await page.locator('[data-ox-back="home"]').click(); await waitReady(page);
      await page.locator('.jk-fab-dock [data-jk-open]').click(); await waitReady(page);
      await page.locator('.jk-page .jk-filterbar .jk-segment').waitFor();
      const jokboTab = await page.locator('.jk-filterbar .jk-segment button').first().evaluate(element => ({ height: element.getBoundingClientRect().height, background: getComputedStyle(element).backgroundColor, color: getComputedStyle(element).color }));
      check(jokboTab.height >= 48 && jokboTab.background === 'rgba(0, 0, 0, 0)' && jokboTab.color === 'rgb(233, 81, 59)', `Jokbo underline tab at ${width}px`);
      await capture('jokbo');
      await page.locator('.jk-heading-back').click(); await waitReady(page);

      const examId = await page.evaluate(() => REV7_EXAM_VIEWS.entriesForRound(79, '심화')[0].canonicalQuestionId);
      await page.evaluate(id => OFFICIAL_EXAM_UI.startExam([id], { examTab: 'round', examRound: 79, examLevel: '심화', timed: false }), examId);
      await page.locator('[data-official-pick]').first().waitFor();
      const answer = await page.evaluate(id => REV7_EXAM_VIEWS.question(id).answer, examId);
      await page.locator(`[data-official-pick="${answer}"]`).click(); await waitReady(page);
      await page.locator('[data-official-request-submit]').click(); await waitReady(page);
      await page.locator('[data-official-submit-confirm]').click(); await waitReady(page);
      await page.locator('[data-r7-result-tab="summary"]').waitFor();
      const resultTab = await page.locator('[data-r7-result-tab="summary"]').evaluate(element => ({ height: element.getBoundingClientRect().height, background: getComputedStyle(element).backgroundColor, color: getComputedStyle(element).color }));
      check(resultTab.height >= 48 && resultTab.background === 'rgba(0, 0, 0, 0)' && resultTab.color === 'rgb(233, 81, 59)', `result underline tab at ${width}px`);
      await capture('exam-result');
      await page.locator('.r7-tabs [data-r7-result-tab="era"]').click(); await waitReady(page);
      await page.locator('.r7-tabs [data-r7-result-tab="questions"]').click(); await waitReady(page);
      assert.equal(await page.locator('.r7-tabs [data-r7-result-tab="questions"]').getAttribute('aria-selected'), 'true');
      assert.deepEqual(pageErrors, [], `browser errors at ${width}px`);
      results.push({ width, height, pass: true, screenshots: captured, story, tabState, filterState, oxSurfaces, jokboTab, resultTab });
      await context.close();
    }
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(`PASS mobile UI checks at 360x800, 390x844, 412x915 (${baseline ? 'baseline' : 'updated'})`);
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { await browser?.close(); server.close(); }
})();

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve('dist');
const output = path.resolve(process.env.QA_OUTPUT || '../../outputs/mobile-ui-followups-20261023/after');
const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const waitForRender = page => page.waitForFunction(() => typeof inputLockedUntil === 'undefined' || Date.now() >= inputLockedUntil);
const noOverflow = async (page, width, screen) => {
  const size = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
  assert(size.document <= size.viewport + 1, screen + ' horizontal overflow at ' + width + 'px: ' + JSON.stringify(size));
};
(async () => {
  let browser;
  const results = [];
  try {
    fs.mkdirSync(output, { recursive: true });
    browser = await chromium.launch({ headless: true, ...(process.env.QA_BROWSER_CHANNEL ? { channel: process.env.QA_BROWSER_CHANNEL } : {}) });
    for (const [width, height] of [[360, 800], [390, 844], [412, 915]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
      const page = await context.newPage(), errors = [], screenshots = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'history.test') return route.abort();
        const pathname = decodeURIComponent(url.pathname);
        const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
        if (!file.startsWith(root + path.sep)) return route.fulfill({ status: 403, body: '' });
        try { return route.fulfill({ status: 200, contentType: contentTypes[path.extname(file)] || 'application/octet-stream', body: await fs.promises.readFile(file) }); }
        catch { return route.fulfill({ status: 404, body: '' }); }
      });
      await page.goto('http://history.test/');
      await page.locator('.hv-era-title').first().waitFor();
      const navBackgrounds = await page.locator('nav').first().evaluate(el => [getComputedStyle(el).backgroundColor, getComputedStyle(el.parentElement).backgroundColor, getComputedStyle(el.parentElement.parentElement).backgroundColor]);
      assert(navBackgrounds.includes('rgb(255, 255, 255)'), 'bottom navigation is not white: ' + JSON.stringify(navBackgrounds));
      const capture = async (name, scrollSelector = null) => {
        await page.evaluate(selector => {
          const target = selector && document.querySelector(selector);
          scrollTo(0, target ? target.getBoundingClientRect().top + scrollY - 12 : 0);
        }, scrollSelector);
        await page.waitForTimeout(120);
        await noOverflow(page, width, name);
        const filename = name + '-' + width + '.png';
        await page.screenshot({ animations: 'disabled', path: path.join(output, filename) });
        screenshots.push(filename);
      };
      const shortcutCards = await page.locator('.hv-shortcuts .hv-shortcut').evaluateAll(items => items.map(item => {
        const icon = item.querySelector('.hv-ico'), title = item.querySelector('b'), copy = item.querySelector('small');
        const rect = item.getBoundingClientRect(), iconRect = icon.getBoundingClientRect();
        return { title: title?.textContent.trim(), copy: copy?.textContent.trim(), height: rect.height, width: rect.width, iconWidth: iconRect.width, iconHeight: iconRect.height, textFits: title.scrollWidth <= title.clientWidth && copy.scrollWidth <= copy.clientWidth, textActionCount: item.querySelectorAll('.hv-pill,.hv-chev,.hv-shortcut-action').length };
      }));
      assert.deepEqual(shortcutCards.map(({ title, copy }) => [title, copy]), [
        ['스토리', '시대별 이야기'], ['기출문제', '실전 시험 대비'], ['OX 퀴즈', '핵심 개념 점검'], ['오답노트', '틀린 문제 복습']
      ]);
      assert(shortcutCards.every(card => card.height >= 100 && card.iconWidth === 44 && card.iconHeight === 44 && card.textFits && card.textActionCount === 0));
      assert(shortcutCards.every(card => Math.abs(card.height - shortcutCards[0].height) < 1));
      const banner = page.locator('.hv-jokbo-banner');
      const bannerStyle = await banner.evaluate(el => {
        const rect = el.getBoundingClientRect(), copy = el.querySelector('.hv-jokbo-copy');
        return { height: rect.height, width: rect.width, radius: getComputedStyle(el).borderRadius, text: copy.innerText.trim(), art: !!el.querySelector('.hv-jokbo-art'), arrow: !!el.querySelector('.hv-jokbo-arrow') };
      });
      assert(bannerStyle.height >= 110 && bannerStyle.height <= 124 && bannerStyle.width <= width && bannerStyle.radius === '20px' && bannerStyle.art && bannerStyle.arrow);
      assert.equal(bannerStyle.text, '헷갈리는 개념은\n족보로 한 번에 정리!');
      assert.equal(await page.locator('.hv-shortcut-story').getAttribute('data-era-open') !== null || await page.locator('.hv-shortcut-story').getAttribute('data-r7-story-resume') !== null, true);
      assert.equal(await page.locator('.hv-shortcut-exam').getAttribute('data-nav') === 'exam-library' || await page.locator('.hv-shortcut-exam').getAttribute('data-r7-exam-open') !== null, true);
      assert.equal(await page.locator('.hv-shortcut-ox').getAttribute('data-nav'), 'ox');
      assert.equal(await page.locator('.hv-shortcut-wrong').getAttribute('data-nav') === 'study' || await page.locator('.hv-shortcut-wrong').getAttribute('data-review') !== null, true);
      await capture('home-shortcuts-jokbo', '.hv-shortcuts-section');
      await banner.click();
      await page.locator('.jk-page').waitFor();
      await page.evaluate(() => { location.hash = '#home'; });
      await page.reload();
      await page.locator('.hv-jokbo-banner').waitFor();
      await waitForRender(page);
      if (width === 360) {
        const returnHome = async () => {
          await page.evaluate(() => { location.hash = '#home'; });
          await page.reload();
          await page.locator('.hv-shortcuts-section').waitFor();
          await waitForRender(page);
        };
        await page.locator('.hv-shortcut-story').click();
        await page.locator('.main.ed-era').waitFor();
        await returnHome();
        await page.locator('.hv-shortcut-exam').click();
        await page.locator('.r7-page.r7-exam-home').waitFor();
        await returnHome();
        await page.locator('.hv-shortcut-ox').click();
        await page.locator('.r7-page.r7-ox-home').waitFor();
        await returnHome();
        await page.locator('.hv-shortcut-wrong').click();
        await page.locator('.r7-page.r7-wrong').waitFor();
        await returnHome();
      }
      await page.locator('nav [data-nav="exam-library"]').click();
      await waitForRender(page);
      const modeStyles = await page.locator('.r7-exam-modes > button').evaluateAll(items => items.map(item => {
        const style = getComputedStyle(item), rect = item.getBoundingClientRect();
        return { selected: item.getAttribute('aria-pressed'), height: rect.height, width: rect.width, radius: style.borderRadius, color: style.color, background: style.backgroundColor };
      }));
      assert.equal(modeStyles.length, 2);
      assert(modeStyles.every(item => item.height === 44 && item.radius === '999px'));
      assert(Math.abs(modeStyles[0].width - modeStyles[1].width) < 1);
      assert.equal(modeStyles[0].background, 'rgb(233, 81, 59)');
      assert.equal(modeStyles[0].color, 'rgb(255, 255, 255)');
      assert.equal(modeStyles[1].background, 'rgb(255, 255, 255)');
      assert.equal(modeStyles[1].color, 'rgb(102, 113, 125)');
      await page.locator('[data-r7-exam-mode="learn"]').click();
      assert.equal(await page.locator('[data-r7-exam-mode="learn"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-r7-exam-mode="exam"]').click();
      assert.equal(await page.locator('.main.ed-exam-library').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(250, 251, 252)');
      await capture('exam-library');
      const ids = await page.evaluate(() => REV7_EXAM_VIEWS.entriesForRound(79, '심화').map(entry => entry.canonicalQuestionId));
      assert(ids.length > 0, 'round 79 심화 fixture exists');
      await page.evaluate(ids => OFFICIAL_EXAM_UI.startExam(ids, { examTab: 'round', examRound: 79, examLevel: '심화', timed: false }), ids);
      await page.locator('.r7-exam-practice').waitFor();
      await page.locator('[data-r7-exam-pause-exit]').click();
      await page.locator('[data-r7-exam-save-exit]').click();
      await waitForRender(page);
      const resume = page.locator('.r7-page.r7-exam-home > .r7-resume');
      await resume.waitFor();
      assert((await resume.innerText()).includes('0 / ' + ids.length + '문항'));
      assert.equal(await resume.locator('.r7-resume-progress > i').evaluate(el => el.style.width), '0%');
      const resumeStyle = await resume.evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, radius: getComputedStyle(el).borderRadius, label: el.querySelector('small').textContent.trim() }));
      assert.deepEqual(resumeStyle, { bg: 'rgb(255, 255, 255)', radius: '16px', label: '이어서 풀기' });
      await capture('resume-card');
      await resume.click();
      await page.locator('[data-r7-exam-continue]').click();
      await page.locator('.r7-exam-practice').waitFor();
      assert.equal(await page.evaluate(() => OFFICIAL_EXAM_UI.snapshot().questionIds.length), ids.length);
      await page.evaluate(() => { location.hash = '#ox'; });
      await page.reload();
      await waitForRender(page);
      await page.locator('.r7-page.r7-ox-home > .r7-ox-row').first().waitFor();
      const oxCards = await page.locator('.r7-page.r7-ox-home > .r7-ox-row').evaluateAll(cards => cards.map(card => {
        const style = getComputedStyle(card), rect = card.getBoundingClientRect();
        const label = card.querySelector('em'), icon = card.querySelector('.r7-icon');
        return { height: rect.height, bg: style.backgroundColor, radius: style.borderRadius, count: /전체\s+\d+문제/.test(card.innerText), status: !!label, arrow: !!icon, statusRight: label && icon && label.getBoundingClientRect().right <= icon.getBoundingClientRect().left };
      }));
      assert(oxCards.length >= 5);
      assert(oxCards.every(card => card.bg === 'rgb(255, 255, 255)' && card.radius === '16px' && card.height >= 92 && card.count && card.status && card.arrow && card.statusRight));
      assert.equal(await page.locator('.main.ed-ox').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(250, 251, 252)');
      await capture('ox-list');
      await page.locator('.r7-page.r7-ox-home > .r7-ox-row').first().click();
      await page.locator('.r7-ox-swipe').waitFor();
      await page.locator('[data-ox-back="home"]').click();
      await page.locator('.r7-page.r7-ox-home').waitFor();
      await page.locator('.jk-fab-dock [data-jk-open]').click();
      await waitForRender(page);
      await page.locator('.jk-page .jk-filterbar .jk-segment').waitFor();
      await page.locator('.jk-era-tabs [data-jk-era="three"]').click();
      await waitForRender(page);
      await page.locator('.jk-country-chips').waitFor();
      const filters = await page.evaluate(() => {
        const bar = document.querySelector('.jk-filterbar'), segment = bar.querySelector('.jk-segment'), era = bar.querySelector('.jk-era-tabs'), country = bar.querySelector('.jk-country-chips'), summary = document.querySelector('.jk-era-pager');
        const top = el => el.getBoundingClientRect().top;
        const box = el => { const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; };
        return { position: getComputedStyle(bar).position, segment: box(segment), era: box(era), country: box(country), summary: box(summary), ordered: top(segment) < top(era) && top(era) < top(country) && top(country) < top(summary), eraOverflow: getComputedStyle(era).overflowX, countryOverflow: getComputedStyle(country).overflowX };
      });
      assert.equal(filters.position, 'static');
      assert(filters.ordered, 'Jokbo top controls overlap/reorder: ' + JSON.stringify(filters));
      assert.equal(filters.eraOverflow, 'auto');
      assert.equal(filters.countryOverflow, 'auto');
      await capture('jokbo-era-selection');
      await page.locator('.jk-group-detail[data-jk-group]').first().click();
      await page.locator('.jk-page.jk-group-page').waitFor();
      const cards = await page.locator('.jk-group-keyword-card').evaluateAll(items => items.map(item => {
        const style = getComputedStyle(item), rect = item.getBoundingClientRect();
        return { width: rect.width, bg: style.backgroundColor, radius: style.borderRadius, padding: style.padding };
      }));
      assert(cards.length > 0);
      assert(cards.every(card => card.bg === 'rgb(255, 255, 255)' && card.radius === '16px' && card.padding === '16px' && card.width <= width - 24));
      await capture('jokbo-detail-grid');
      await page.locator('[data-jk-back="jokbo"]').click();
      await waitForRender(page);
      await page.locator('[data-jk-mode="saved"]').click();
      await waitForRender(page);
      const empty = page.locator('.jk-saved-empty');
      await empty.waitFor();
      assert.equal((await empty.locator('h2').innerText()).trim(), '아직 저장한 키워드가 없어요');
      assert.equal((await empty.locator('p').innerText()).trim(), '중요한 키워드를 저장하면\n이곳에서 모아볼 수 있어요.');
      assert.equal(await empty.locator('svg').count(), 1);
      assert((await empty.locator('svg path').getAttribute('d')).includes('l-6.25-3.9'));
      await capture('jokbo-saved-empty');
      await empty.locator('[data-jk-mode="all"]').click();
      await waitForRender(page);
      assert.equal(await page.locator('[data-jk-mode="all"]').getAttribute('aria-selected'), 'true');
      assert.deepEqual(errors, [], 'browser page errors: ' + errors.join('; '));
      results.push({ width, height, pass: true, screenshots, navBackgrounds, homeShortcutCards: shortcutCards, jokboBanner: bannerStyle, modeStyles, resumeStyle, oxCards: oxCards.length, filters, detailCards: cards.length });
      await context.close();
    }
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log('PASS mobile follow-up UI at 360x800, 390x844, 412x915');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { await browser?.close(); }
})();

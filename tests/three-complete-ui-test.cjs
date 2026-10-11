/* Real Chromium smoke test for the production entry. Browser failures are failures, never skips. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '../dist');
const shots = path.resolve(__dirname, '../tmp/three-complete-ui');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]);
  const file = path.resolve(root, '.' + (relative === '/' ? '/index.html' : relative));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, buffer) => {
    if (error) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(buffer);
  });
});

async function tap(page) {
  await page.evaluate(() => { inputLockedUntil = 0; finishOpeningTyping(); });
  await page.locator('.three-complete-game button.advance-dialogue').click();
}
async function setScene(page, id, phase = 'main') {
  await page.evaluate(({id, phase}) => {
    const source = STORIES[id];
    state.run = INITIAL_RUN(source.chapterId);
    state.run.started = true;
    state.run.storyId = id;
    screen = 'game'; modal = null;
    THREE_COMPLETE_ACTIONS.switchPhase(source, phase);
    finishOpeningTyping();
  }, {id, phase});
}
async function decodedImages(page, selector) {
  for (const img of await page.locator(selector).all()) {
    await img.evaluate(async node => { await node.decode(); if (!node.naturalWidth) throw Error('Image did not decode: ' + node.src); });
  }
}
async function fits(page, label) {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label + ': horizontal overflow');
  for (const button of await page.locator('.three-dialogue-choices button, .three-number-options button, button.advance-dialogue').all()) {
    const box = await button.boundingBox();
    assert(box && box.width >= 44 && box.height >= 44, label + ': small tap target');
  }
}

(async () => {
  let browser;
  try {
    fs.mkdirSync(shots, {recursive:true});
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({headless:true, ...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});
    for (const width of [390, 1280]) {
      const context = await browser.newContext({viewport:{width,height:width === 390 ? 844 : 900}, isMobile:width === 390, hasTouch:width === 390, serviceWorkers:'block'});
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/`);
      await page.waitForFunction(() => globalThis.THREE_STORY_UI_READY === true);
      await page.evaluate(() => { localStorage.clear(); resumeEra('three-kingdoms'); });
      assert.equal(await page.locator('.three-complete-game').getAttribute('data-three-scene'), 'THR-PRO-S01');
      assert.equal(await page.locator('.three-genealogy-leaf').count(), 3);
      await decodedImages(page, '.three-genealogy-leaf');
      const initial = await page.evaluate(() => [run().storyId, run().dialogueCursor]);
      await page.waitForTimeout(1100);
      assert.deepEqual(await page.evaluate(() => [run().storyId, run().dialogueCursor]), initial, 'prologue advanced without a tap');
      await fits(page, 'prologue');
      await page.screenshot({path:path.join(shots, `prologue-book-${width}.png`), fullPage:true});
      for (let n = 0; n < 30 && await page.evaluate(() => run().storyId !== 'THR-PRO-S03'); n++) await tap(page);
      assert.equal(await page.locator('.three-complete-game').getAttribute('data-three-scene'), 'THR-PRO-S03');
      assert(await page.locator('.three-complete-game').evaluate(node => node.classList.contains('three-prologue-cut')), 'missing explicit transition cut');
      await page.waitForTimeout(200);
      await page.evaluate(() => render());
      assert.equal(await page.locator('.three-prologue-cut').count(), 0, 'cut replayed on render');
      await fits(page, 'awakening');
      await page.screenshot({path:path.join(shots, `awakening-${width}.png`), fullPage:true});

      await setScene(page, 'THR-C01-S01', 'choice');
      assert.equal(await page.locator('.three-dialogue-choices button').count(), 2);
      await fits(page, 'spoken choices');
      await page.evaluate(() => { inputLockedUntil = 0; });
      await page.locator('.three-dialogue-choices button[data-choice="1"]').click();
      await page.evaluate(() => finishOpeningTyping());
      const chosen = await page.evaluate(() => STORIES['THR-C01-S01'].choices[1].label);
      assert.equal(await page.locator('.three-bubble p').textContent(), chosen);
      assert.equal(await page.locator('.three-complete-game').getAttribute('data-three-phase'), 'branch');
      await tap(page);
      const saved = await page.evaluate(() => { save(); return [run().storyId,run().dialogueCursor,THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource())]; });
      await page.reload();
      await page.waitForFunction(() => globalThis.THREE_STORY_UI_READY === true);
      await page.evaluate(() => resumeEra('three-kingdoms'));
      assert.deepEqual(await page.evaluate(() => [run().storyId,run().dialogueCursor,THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource())]), saved);
      await fits(page, 'resumed branch');
      await page.screenshot({path:path.join(shots, `branch-resume-${width}.png`), fullPage:true});

      const atlasScene = await page.evaluate(() => { const scene = Object.values(STORIES).find(s => s.threeStoryVersion === 3 && s.dialogues.some(d => PORTRAITS[resolvedPortraitId(d)]?.sprite?.sourceRect)); return scene && {id:scene.sceneId,cursor:scene.dialogues.findIndex(d => PORTRAITS[resolvedPortraitId(d)]?.sprite?.sourceRect)+1}; });
      assert(atlasScene, 'no atlas scene available');
      await setScene(page, atlasScene.id);
      await page.evaluate(cursor => { run().dialogueCursor=cursor; render(); finishOpeningTyping(); }, atlasScene.cursor);
      assert(await page.locator('.three-atlas-character .three-atlas-image').count());
      await fits(page, 'atlas character');
      await page.screenshot({path:path.join(shots, `atlas-character-${width}.png`), fullPage:true});

      for (const optionCount of [4, 5]) {
        await page.evaluate(count => {
          const q = QUESTIONS.find(item => item.threeStoryVersion === 3 && item.choices.length === count);
          state.run = INITIAL_RUN('THR-C01'); state.run.started = true;
          state.run.activeQuestionId = q.questionId; state.run.questionAnswer = null;
          quizMode = 'story'; screen = 'quiz'; modal = null; render();
        }, optionCount);
        assert.equal(await page.locator('[data-three-answer]').count(), optionCount);
        await decodedImages(page, '.official-source-question img');
        await fits(page, optionCount + '-option quiz');
        await page.locator('[data-three-answer="0"]').click();
        await page.locator('[data-action="three-submit"]').click();
        await page.locator('.feedback').waitFor({state:'visible'});
        await page.screenshot({path:path.join(shots, `quiz-${optionCount}-${width}.png`), fullPage:true});
      }
      assert.deepEqual(errors, [], 'browser JavaScript errors');
      await context.close();
    }
    console.log('PASS: actual index.html in Chromium at 390/1280px; tap-only prologue, source photos, one-shot cut, spoken choice and branch reload, atlas rendering, 4/5-option original quizzes.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

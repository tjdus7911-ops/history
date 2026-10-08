const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert'),{chromium}=require('playwright');
const root=path.resolve('dist');
const server=http.createServer((req,res)=>{
 const pathname=req.url.split('?')[0],file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep))return res.end();
 fs.readFile(file,(error,body)=>{if(error){res.statusCode=404;return res.end()}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(body)});
});

(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 for(const width of [360,390,412]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port);
  assert.equal(await page.locator('[data-nav="association"]').count(),0);assert.equal(await page.locator('[data-nav="ox"]').count(),1);
  await page.locator('[data-nav="ox"]').click();
  const homeText=await page.locator('#app').innerText();
  assert(homeText.includes('OX 퀴즈')&&homeText.includes('한능검 심화 핵심 개념을 빠르게 확인해요.'));
  assert(!homeText.includes('오늘의 심화 핵심 개념')&&!homeText.includes('빠른 OX 퀴즈'));
  assert.equal(await page.locator('[data-ox-start="quick"], [data-ox-start="daily"]').count(),0);
  assert.equal(await page.locator('[data-ox-era]').count(),7);
  assert.equal(await page.locator('[data-ox-analysis]').count(),1);assert.equal(await page.locator('[data-ox-review]').count(),1);
  assert(await page.locator('text=누적 풀이').isVisible());assert(await page.locator('text=아직 학습 전').first().isVisible());
  const eraHeights=await page.locator('[data-ox-era]').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().height));
  assert(eraHeights.every(height=>height>=44&&height<=132),`era cards must be compact, tappable rows at ${width}px: ${eraHeights}`);
  const navLayout=await page.locator('.editorial-shell .nav').evaluate(nav=>{const boxes=[...nav.querySelectorAll('button')].map(button=>button.getBoundingClientRect()),main=document.querySelector('.main'),sidebar=document.querySelector('.sidebar');return {count:boxes.length,tops:boxes.map(box=>Math.round(box.top)),heights:boxes.map(box=>box.height),navHeight:sidebar.getBoundingClientRect().height,mainPaddingBottom:parseFloat(getComputedStyle(main).paddingBottom)}});
  assert.equal(navLayout.count,5);assert.equal(new Set(navLayout.tops).size,1,`five-item mobile nav wrapped at ${width}px: ${navLayout.tops}`);
  assert(navLayout.heights.every(height=>height>=44)&&navLayout.mainPaddingBottom>=navLayout.navHeight,`mobile nav overlaps content at ${width}px: ${JSON.stringify(navLayout)}`);
  assert((await page.locator('[data-ox-home-review-era]').boundingBox()).height>=44,'home review select touch target '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'home horizontal overflow '+width);
  fs.mkdirSync('tmp/ox-mobile',{recursive:true});await page.screenshot({path:`tmp/ox-mobile/era-home-${width}.png`,fullPage:true});

  await page.locator('[data-ox-era="goryeo"]').click();
  assert.equal(await page.evaluate(()=>meta().oxQuiz.activeSession.questionIds.length),20,'era session size '+width);
  assert.equal(await page.evaluate(()=>new Set(meta().oxQuiz.activeSession.questionIds).size),20,'era session duplicates '+width);
  assert((await page.locator('.ox-progress-label').innerText()).includes('전체 20문제'));
  assert.equal(await page.locator('.ox-question-meta small').innerText(),'한능검 심화 핵심 개념','answer-bearing topic leaked before choice '+width);
  assert((await page.locator('[data-ox-back]').boundingBox()).height>=44,'quiz back target too small '+width);
  const sizes=await page.locator('.ox-answer').evaluateAll(items=>items.map(item=>{const box=item.getBoundingClientRect();return {width:box.width,height:box.height}}));
  assert(sizes.every(size=>size.width>=120&&size.height>=72),'OX touch targets too small '+width);
  const correctAnswer=await page.evaluate(()=>{const session=meta().oxQuiz.activeSession;return OX_QUESTIONS.find(question=>question.id===session.questionIds[session.index]).answer});
  await page.locator(`[data-ox-answer="${String(!correctAnswer)}"]`).click();assert(await page.locator('.ox-feedback').isVisible());assert(await page.locator('[data-ox-next]').isVisible());
  assert.notEqual(await page.locator('.ox-question-meta small').innerText(),'한능검 심화 핵심 개념','topic label should be revealed after choice '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'quiz horizontal overflow '+width);
  await page.screenshot({path:`tmp/ox-mobile/answer-${width}.png`,fullPage:true});
  await page.reload();assert(await page.locator('.ox-feedback').isVisible(),'session feedback did not restore '+width);assert((await page.locator('.ox-progress-label').innerText()).includes('현재 1번'));

  await page.locator('[data-ox-back]').click();await page.locator('[data-ox-analysis]').click();
  assert(await page.locator('text=시대별 취약점 분석').first().isVisible());assert(await page.locator('text=데이터 부족').first().isVisible());
  assert((await page.locator('.ox-analysis-row.ox-weakness-row').count())>=7,'seven era analysis rows required '+width);
  assert((await page.locator('.ox-analysis-bar.ox-weakness-meter').count())>=7,'seven horizontal accuracy bars required '+width);
  const sortHeights=await page.locator('[data-ox-analysis-sort]').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().height));assert(sortHeights.every(height=>height>=44),'analysis sort touch target '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'analysis horizontal overflow '+width);
  await page.screenshot({path:`tmp/ox-mobile/analysis-${width}.png`,fullPage:true});

  await page.locator('[data-nav="study"]').click();await page.locator('[data-wrong-filter="ox"]').click();
  assert((await page.locator('[data-ox-review-filter]').boundingBox()).height>=44,'wrong-review select touch target '+width);
  assert((await page.locator('[data-ox-review-one]').first().boundingBox()).height>=44,'wrong-review button touch target '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'review horizontal overflow '+width);

  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: era-first OX home, 20-question play/feedback/reload, weakness analysis, compact touch UI, and no horizontal overflow at 360/390/412px.');
}finally{if(browser)await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});

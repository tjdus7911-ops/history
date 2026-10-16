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
  assert.equal(await page.locator('[data-nav="association"]').count(),0);assert.equal(await page.locator('nav.nav [data-nav="ox"]').count(),1);
  await page.locator('nav.nav [data-nav="ox"]').click();
  const homeText=await page.locator('#app').innerText();
  assert(homeText.includes('OX 퀴즈')&&homeText.includes('한능검 심화 핵심 개념을 빠르게 확인해요.'));
  assert(homeText.includes('최대 20문제'),'dynamic session cap label missing '+width);
  assert(!homeText.includes('오늘의 심화 핵심 개념')&&!homeText.includes('빠른 OX 퀴즈'));
  assert.equal(await page.locator('[data-ox-start="quick"], [data-ox-start="daily"]').count(),0);
  assert.equal(await page.locator('[data-ox-era]').count(),7);
  assert.equal(await page.locator('[data-ox-analysis]').count(),0,'analysis entry was removed from OX home '+width);assert.equal(await page.locator('[data-ox-review]').count(),1);
  assert.equal(await page.locator('[data-ox-home-analysis]').count(),0,'OX weakness summary must not render '+width);
  assert.equal(await page.locator('.ox-learning-summary').count(),0,'obsolete duplicated learning summary remains '+width);
  const homeOrder=await page.locator('.ox-home').evaluate(home=>[...home.querySelectorAll(':scope > .ox-main-section')].map(section=>section.matches('[data-ox-home-analysis]')?'analysis':section.innerText.includes('시대별 OX 퀴즈')?'eras':section.innerText.includes('틀린 OX 다시 풀기')?'review':'other'));
  assert.deepEqual(homeOrder.slice(0,2),['eras','review'],'home hierarchy mismatch '+width);
  const eraHeights=await page.locator('[data-ox-era]').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().height));
  assert(eraHeights.every(height=>height>=44&&height<=132),`era cards must be compact, tappable rows at ${width}px: ${eraHeights}`);
  const navLayout=await page.locator('.editorial-shell .nav').evaluate(nav=>{const boxes=[...nav.querySelectorAll('button')].map(button=>button.getBoundingClientRect()),main=document.querySelector('.main'),sidebar=document.querySelector('.sidebar');return {count:boxes.length,tops:boxes.map(box=>Math.round(box.top)),heights:boxes.map(box=>box.height),navHeight:sidebar.getBoundingClientRect().height,mainPaddingBottom:parseFloat(getComputedStyle(main).paddingBottom)}});
  assert.equal(navLayout.count,5);assert.equal(new Set(navLayout.tops).size,1,`five-item mobile nav wrapped at ${width}px: ${navLayout.tops}`);
  assert(navLayout.heights.every(height=>height>=44)&&navLayout.mainPaddingBottom>=navLayout.navHeight,`mobile nav overlaps content at ${width}px: ${JSON.stringify(navLayout)}`);
  assert((await page.locator('[data-ox-home-review-era]').boundingBox()).height>=44,'home review select touch target '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'home horizontal overflow '+width);
  fs.mkdirSync('tmp/ox-mobile',{recursive:true});await page.screenshot({path:`tmp/ox-mobile/analysis-empty-home-${width}.png`,fullPage:true});
  await page.evaluate(()=>{location.hash='#ox/analysis'});await page.reload();assert.equal(await page.locator('.ox-analysis, [data-ox-analysis-summary]').count(),0,'removed analysis view must not render '+width);assert.equal(await page.locator('[data-ox-era]').count(),7,'removed analysis route must fall back to OX main '+width);await page.evaluate(()=>{location.hash='#ox'});await page.reload();

  const sessionSize=await page.evaluate(()=>Math.min(20,OX_QUESTIONS.filter(question=>question.eraId==='goryeo').length));
  await page.locator('[data-ox-era="goryeo"]').click();
  assert.equal(await page.evaluate(()=>meta().oxQuiz.activeSession.questionIds.length),sessionSize,'era session size '+width);
  assert.equal(await page.evaluate(()=>new Set(meta().oxQuiz.activeSession.questionIds).size),sessionSize,'era session duplicates '+width);
  assert((await page.locator('.ox-progress-label').innerText()).includes(`전체 ${sessionSize}문제`));
  assert.equal(await page.locator('.ox-question-meta small').innerText(),'한능검 심화 핵심 개념','answer-bearing topic leaked before choice '+width);
  assert.equal(await page.locator('.ox-feedback').count(),0,'answer feedback leaked before choice '+width);
  assert.equal(await page.locator('[data-ox-next]').count(),0,'next action leaked before choice '+width);
  assert((await page.locator('[data-ox-back]').boundingBox()).height>=44,'quiz back target too small '+width);
  const sizes=await page.locator('.ox-answer').evaluateAll(items=>items.map(item=>{const box=item.getBoundingClientRect();return {width:box.width,height:box.height}}));
  assert(sizes.every(size=>size.width>=120&&size.height>=72),'OX touch targets too small '+width);
  const correctAnswer=await page.evaluate(()=>{const session=meta().oxQuiz.activeSession;return OX_QUESTIONS.find(question=>question.id===session.questionIds[session.index]).answer});
  await page.locator(`[data-ox-answer="${String(!correctAnswer)}"]`).click();assert(await page.locator('.ox-feedback').isVisible());assert(await page.locator('[data-ox-next]').isVisible());
  assert((await page.locator('.ox-feedback strong').innerText()).includes(`정답은 ${correctAnswer?'O':'X'}`),'correct answer label missing after choice '+width);
  assert((await page.locator('.ox-feedback p').innerText()).split(/(?<=[.!?])\s+/).length>=2,'learning explanation must add context after choice '+width);
  assert.notEqual(await page.locator('.ox-question-meta small').innerText(),'한능검 심화 핵심 개념','topic label should be revealed after choice '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'quiz horizontal overflow '+width);
  await page.screenshot({path:`tmp/ox-mobile/answer-${width}.png`,fullPage:true});
  await page.reload();assert(await page.locator('.ox-feedback').isVisible(),'session feedback did not restore '+width);assert((await page.locator('.ox-progress-label').innerText()).includes('현재 1번'));
  const firstQuestion=await page.locator('.ox-question-card h2').innerText();
  await page.locator('[data-ox-next]').click();
  if(sessionSize>1){
   assert((await page.locator('.ox-progress-label').innerText()).includes('현재 2번'),'next button did not advance quiz '+width);
   assert.notEqual(await page.locator('.ox-question-card h2').innerText(),firstQuestion,'next button repeated the same question '+width);
   assert.equal(await page.locator('.ox-feedback').count(),0,'next question must hide feedback until a choice '+width);
  }else assert.equal(await page.locator('.ox-result').count(),1,'a one-question era must finish safely '+width);

  await page.locator('[data-ox-back]').click();
  assert.equal(new URL(page.url()).hash,'#ox','quiz back must return to OX main '+width);
  assert.equal(await page.locator('[data-ox-home-analysis], .ox-weakness-donut').count(),0,'learned home must not show the removed weakness analysis '+width);
  assert.equal(await page.locator('[data-ox-era]').count(),7,'era quiz list disappeared after learning '+width);
  assert.equal(await page.locator('[data-ox-review]').count(),1,'wrong-answer retry disappeared after learning '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'learned home horizontal overflow '+width);
  await page.screenshot({path:`tmp/ox-mobile/analysis-summary-home-${width}.png`,fullPage:true});


  await page.locator('nav.nav [data-nav="study"]').click();await page.locator('[data-wrong-filter="ox"]').click();
  assert((await page.locator('[data-ox-review-filter]').boundingBox()).height>=44,'wrong-review select touch target '+width);
  assert((await page.locator('[data-ox-wrong-open]').first().boundingBox()).height>=44,'wrong-review card touch target '+width);
  await page.locator('[data-ox-wrong-open]').first().click();
  assert((await page.locator('[data-ox-review-one]').first().boundingBox()).height>=44,'wrong-review button touch target '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'review horizontal overflow '+width);

  for(const route of ['home','exam-library','ox','study','records']){
   await page.waitForTimeout(260);
   await page.locator(`nav.nav [data-nav="${route}"]`).click();
   assert.equal(await page.evaluate(()=>screen),route,`navigation did not enter ${route} at ${width}px`);
   assert.equal(new URL(page.url()).hash,`#${route}`,`URL did not synchronize ${route} at ${width}px`);
   await page.reload();
   assert.equal(await page.evaluate(()=>screen),route,`refresh did not preserve ${route} at ${width}px`);
   assert(await page.locator(`nav.nav [data-nav="${route}"][aria-current="page"]`).isVisible(),`active tab did not restore ${route} at ${width}px`);
   if(route==='ox'){assert(await page.locator('[data-ox-resume]').isVisible(),`OX main must offer resume at ${width}px`);assert.equal(await page.locator('.ox-play').count(),0,`OX main refresh auto-entered quiz at ${width}px`)}
  }

  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: URL-preserving refresh, era-first OX resume, removed weakness-analysis guard, compact touch UI, and no horizontal overflow at 360/390/412px.');
}finally{if(browser)await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});

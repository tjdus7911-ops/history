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
  assert.equal(await page.locator('[data-ox-home-analysis]').count(),1,'home analysis summary missing '+width);
  assert.equal(await page.locator('.ox-learning-summary').count(),0,'obsolete duplicated learning summary remains '+width);
  assert.equal((await page.locator('[data-ox-home-analysis] .ox-analysis-empty').innerText()).replace(/\s+/g,' ').trim(),'아직 분석할 학습 기록이 없어요. OX 퀴즈를 풀면 시대별 취약점을 확인할 수 있어요.','no-history message mismatch '+width);
  assert.equal(await page.locator('[data-ox-home-analysis] .ox-weakness-donut').count(),0,'no-history home must not paint a donut '+width);
  const homeOrder=await page.locator('.ox-home').evaluate(home=>[...home.querySelectorAll(':scope > .ox-main-section')].map(section=>section.matches('[data-ox-home-analysis]')?'analysis':section.innerText.includes('시대별 OX 퀴즈')?'eras':section.innerText.includes('틀린 OX 다시 풀기')?'review':'other'));
  assert.deepEqual(homeOrder.slice(0,3),['analysis','eras','review'],'home hierarchy mismatch '+width);
  assert((await page.locator('[data-ox-analysis]').boundingBox()).height>=44,'analysis detail touch target '+width);
  const eraHeights=await page.locator('[data-ox-era]').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().height));
  assert(eraHeights.every(height=>height>=44&&height<=132),`era cards must be compact, tappable rows at ${width}px: ${eraHeights}`);
  const navLayout=await page.locator('.editorial-shell .nav').evaluate(nav=>{const boxes=[...nav.querySelectorAll('button')].map(button=>button.getBoundingClientRect()),main=document.querySelector('.main'),sidebar=document.querySelector('.sidebar');return {count:boxes.length,tops:boxes.map(box=>Math.round(box.top)),heights:boxes.map(box=>box.height),navHeight:sidebar.getBoundingClientRect().height,mainPaddingBottom:parseFloat(getComputedStyle(main).paddingBottom)}});
  assert.equal(navLayout.count,5);assert.equal(new Set(navLayout.tops).size,1,`five-item mobile nav wrapped at ${width}px: ${navLayout.tops}`);
  assert(navLayout.heights.every(height=>height>=44)&&navLayout.mainPaddingBottom>=navLayout.navHeight,`mobile nav overlaps content at ${width}px: ${JSON.stringify(navLayout)}`);
  assert((await page.locator('[data-ox-home-review-era]').boundingBox()).height>=44,'home review select touch target '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'home horizontal overflow '+width);
  fs.mkdirSync('tmp/ox-mobile',{recursive:true});await page.screenshot({path:`tmp/ox-mobile/analysis-empty-home-${width}.png`,fullPage:true});

  await page.locator('[data-ox-analysis]').click();
  assert.equal(new URL(page.url()).hash,'#ox/analysis','detail route missing before learning '+width);
  assert.equal(await page.locator('[data-ox-analysis-summary] > div').count(),4,'detail summary must have four metrics '+width);
  assert.equal((await page.locator('.ox-detail-donut .ox-analysis-empty').innerText()).replace(/\s+/g,' ').trim(),'아직 분석할 학습 기록이 없어요. OX 퀴즈를 풀면 시대별 취약점을 확인할 수 있어요.','detail no-history message mismatch '+width);
  assert.equal(await page.locator('.ox-detail-donut .ox-weakness-donut').count(),0,'no-history detail must not paint a donut '+width);
  assert.equal(await page.locator('.ox-analysis-row.ox-weakness-row').count(),7,'detail must retain all seven era cards '+width);
  assert.equal(await page.locator('.ox-focus-review').count(),1,'focus review section missing '+width);
  await page.locator('.ox-top [data-ox-back]').click();
  await page.waitForURL(/#ox$/);assert(await page.locator('[data-ox-home-analysis]').isVisible(),'detail header back did not return to OX home '+width);

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

  await page.locator('[data-ox-back]').click();
  assert.equal(new URL(page.url()).hash,'#ox','quiz back must return to OX main '+width);
  assert.equal(await page.locator('[data-ox-home-analysis] .ox-weakness-donut.compact').count(),1,'learned home must show one compact donut '+width);
  const compactDonut=await page.locator('[data-ox-home-analysis] .ox-weakness-donut.compact').evaluate(element=>{const box=element.getBoundingClientRect(),style=getComputedStyle(element);return {width:box.width,height:box.height,background:style.backgroundImage,label:element.getAttribute('aria-label')}});
  assert(Math.abs(compactDonut.width-compactDonut.height)<=1&&compactDonut.width>=104&&compactDonut.width<=132,`compact donut size invalid at ${width}px: ${JSON.stringify(compactDonut)}`);
  assert(compactDonut.background.includes('conic-gradient')&&compactDonut.label.includes('고유 오답 총 1문제')&&compactDonut.label.includes('고려 1문제 100%'),`compact donut data/paint missing at ${width}px: ${JSON.stringify(compactDonut)}`);
  assert((await page.locator('[data-ox-home-analysis]').innerText()).includes('가장 취약한 시대')&&(await page.locator('[data-ox-home-analysis]').innerText()).includes('고려 오답 비중'),'compact summary missing weakness labels '+width);
  assert.equal(await page.locator('[data-ox-era]').count(),7,'era quiz list disappeared after learning '+width);
  assert.equal(await page.locator('[data-ox-review]').count(),1,'wrong-answer retry disappeared after learning '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'learned home horizontal overflow '+width);
  await page.screenshot({path:`tmp/ox-mobile/analysis-summary-home-${width}.png`,fullPage:true});

  /* Exercise the densest compact state: all seven era colors and legend labels. */
  const compactSnapshot=await page.evaluate(()=>JSON.stringify(meta().oxQuiz));
  await page.evaluate(()=>{const ox=meta().oxQuiz,records={},ids=[];for(const era of OX_ERAS){const question=OX_QUESTIONS.find(item=>item.eraId===era.id);ids.push(question.id);records[question.id]={attempts:1,correctCount:0,wrongCount:1,lastCorrect:false,lastAnswer:!question.answer,lastAnsweredAt:'2026-10-08T00:00:00.000Z'}}ox.records=records;ox.history=[];ox.wrongIds=ids;oxView='home';screen='ox';render()});
  assert.equal(await page.locator('.ox-home-donut-legend li').count(),7,'dense compact legend must retain all seven eras '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'seven-era compact chart overflow '+width);
  await page.screenshot({path:`tmp/ox-mobile/analysis-summary-seven-eras-${width}.png`,fullPage:true});
  await page.evaluate(snapshot=>{meta().oxQuiz=JSON.parse(snapshot);oxMetaCache=null;oxView='home';screen='ox';render()},compactSnapshot);

  await page.locator('[data-ox-analysis]').click();
  assert.equal(new URL(page.url()).hash,'#ox/analysis','detail view must use independent route '+width);
  assert(await page.locator('.ox-analysis .ox-top h1').getByText('시대별 취약점 분석',{exact:true}).isVisible());
  assert.equal(await page.locator('[data-ox-analysis-summary] > div').count(),4,'detail summary must have four cells '+width);
  const detailLabels=await page.locator('[data-ox-analysis-summary] span').allInnerTexts();
  assert.deepEqual(detailLabels,['누적 풀이 수','전체 정답률','고유 오답 문제 수','가장 취약한 시대'],'detail summary labels mismatch '+width);
  assert.equal(await page.locator('.ox-analysis-row.ox-weakness-row').count(),7,'seven era analysis rows required '+width);
  assert.equal(await page.locator('.ox-detail-donut .ox-weakness-donut:not(.compact)').count(),1,'one full detail donut required '+width);
  assert.equal(await page.locator('.ox-donut-legend li').count(),7,'seven labeled donut legend rows required '+width);
  assert.equal(await page.locator('.ox-weakness-meter').count(),0,'replaced horizontal weakness bars remain '+width);
  const donut=await page.locator('.ox-detail-donut .ox-weakness-donut').evaluate(element=>{const box=element.getBoundingClientRect(),style=getComputedStyle(element);return {width:box.width,height:box.height,background:style.backgroundImage,label:element.getAttribute('aria-label')}});
  assert(Math.abs(donut.width-donut.height)<=1&&donut.width>=150&&donut.width<=200,`donut size invalid at ${width}px: ${JSON.stringify(donut)}`);
  assert(donut.background.includes('conic-gradient')&&donut.label.includes('고유 오답 총 1문제'),`donut data/paint missing at ${width}px: ${JSON.stringify(donut)}`);
  const goryeoShare=await page.locator('.ox-donut-legend [data-era="goryeo"]').evaluate(element=>({wrong:element.dataset.wrong,share:element.dataset.share,text:element.innerText}));
  assert.equal(goryeoShare.wrong,'1');assert.equal(goryeoShare.share,'100');assert(goryeoShare.text.includes('1문제')&&goryeoShare.text.includes('100%'),'single-era share must be exact '+width);
  const sortHeights=await page.locator('[data-ox-analysis-sort]').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().height));assert(sortHeights.every(height=>height>=44),'analysis sort touch target '+width);
  assert.equal(await page.locator('.ox-focus-review').count(),1,'focus review section missing '+width);
  assert((await page.locator('[data-ox-analysis-review-era]').boundingBox()).height>=44,'focus review select touch target '+width);
  const focusReview=page.locator('.ox-focus-review [data-ox-analysis-review-start]');
  assert.equal(await focusReview.getAttribute('data-ox-analysis-review-start'),'goryeo','focus review must target the era with the largest historical wrong share '+width);
  assert(await focusReview.isEnabled(),'focus review action must be connected to available wrong answers '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'analysis horizontal overflow '+width);
  await page.screenshot({path:`tmp/ox-mobile/analysis-${width}.png`,fullPage:true});

  await page.reload();
  assert.equal(new URL(page.url()).hash,'#ox/analysis','detail refresh lost its URL '+width);
  assert.equal(await page.evaluate(()=>screen),'ox','detail refresh did not restore the OX screen '+width);
  assert(await page.locator('.ox-analysis').isVisible(),'detail refresh did not restore the analysis view '+width);
  assert.equal(await page.locator('.ox-play').count(),0,'detail refresh auto-entered the active quiz '+width);
  await page.goBack();await page.waitForURL(/#ox$/);
  assert(await page.locator('[data-ox-home-analysis]').isVisible(),'browser back did not restore OX main '+width);
  await page.goForward();await page.waitForURL(/#ox\/analysis$/);
  assert(await page.locator('.ox-analysis').isVisible(),'browser forward did not restore detail '+width);
  await page.locator('.ox-top [data-ox-back]').click();await page.waitForURL(/#ox$/);
  assert(await page.locator('[data-ox-home-analysis]').isVisible(),'detail header back did not restore OX main '+width);

  await page.locator('[data-nav="study"]').click();await page.locator('[data-wrong-filter="ox"]').click();
  assert((await page.locator('[data-ox-review-filter]').boundingBox()).height>=44,'wrong-review select touch target '+width);
  assert((await page.locator('[data-ox-review-one]').first().boundingBox()).height>=44,'wrong-review button touch target '+width);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'review horizontal overflow '+width);

  for(const route of ['home','exam-library','ox','study','records']){
   await page.waitForTimeout(260);
   await page.locator(`[data-nav="${route}"]`).click();
   assert.equal(await page.evaluate(()=>screen),route,`navigation did not enter ${route} at ${width}px`);
   assert.equal(new URL(page.url()).hash,`#${route}`,`URL did not synchronize ${route} at ${width}px`);
   await page.reload();
   assert.equal(await page.evaluate(()=>screen),route,`refresh did not preserve ${route} at ${width}px`);
   assert(await page.locator(`[data-nav="${route}"][aria-current="page"]`).isVisible(),`active tab did not restore ${route} at ${width}px`);
   if(route==='ox'){assert(await page.locator('[data-ox-resume]').isVisible(),`OX main must offer resume at ${width}px`);assert.equal(await page.locator('.ox-play').count(),0,`OX main refresh auto-entered quiz at ${width}px`)}
  }

  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: URL-preserving refresh, era-first OX resume, donut weakness analysis, compact touch UI, and no horizontal overflow at 360/390/412px.');
}finally{if(browser)await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});

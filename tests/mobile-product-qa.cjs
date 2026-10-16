const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const phase=process.env.QA_PHASE||'after',out=path.resolve(process.env.QA_OUTPUT||'tmp/mobile-product',phase);
const root=path.resolve('dist');
const origin=JSON.parse(fs.readFileSync('config/deployment-asset-origin.json','utf8'));
const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,data)=>{if(error){if(name.startsWith('/assets/')){res.writeHead(302,{Location:encodeURI('https://raw.githubusercontent.com/'+origin.repository+'/'+origin.commit+'/'+origin.sourcePath+name.slice(7))});return res.end()}res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data)})});
let browser;
async function main(){
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({headless:true,...(process.env.QA_BROWSER?{executablePath:process.env.QA_BROWSER}:{})});
 for(const width of [360,375,390,430]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);const homeBackground=await page.evaluate(()=>getComputedStyle(document.body).backgroundColor);await page.locator('.rev4-navigation [data-nav="exam-library"]').click();if(phase==='after')assert.equal(await page.locator('.ed-exam-library').evaluate(n=>getComputedStyle(n).backgroundColor),homeBackground,'exam surface must match home');
  const capture=async name=>{
   await page.evaluate(()=>scrollTo(0,0));
   await page.waitForFunction(()=>[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0).every(i=>i.complete&&i.naturalWidth>0),null,{timeout:60000});
   await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.complete&&i.naturalWidth).map(i=>i.decode()));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
   const paper=page.locator('.official-paper img').first();
   if(await paper.count()){
    const {PNG}=require('pngjs');let painted=false;
    for(let retry=0;retry<5;retry++){const png=PNG.sync.read(await paper.screenshot());let ink=0;for(let i=0;i<png.data.length;i+=4)if(png.data[i]<230||png.data[i+1]<230||png.data[i+2]<230)ink++;if(ink/(png.width*png.height)>.02){painted=true;break}await page.waitForTimeout(600)}
    assert(painted,'question image pixels must be visible: '+width+' '+name);
   }
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(300);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+' '+name+' overflow');
   await page.screenshot({path:path.join(out,name+'-'+width+'.png')});
   if(name==='result')await page.screenshot({path:path.join(out,name+'-full-'+width+'.png'),fullPage:true});
  };
  await capture('main');if(phase==='after'){const buttons=await page.locator('.official-exams button').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().height>0).map(n=>({text:n.textContent,height:n.getBoundingClientRect().height})));assert(buttons.every(b=>b.height>=44),JSON.stringify(buttons));}await page.locator('[data-official-round="79"]').click();await capture('detail');await page.locator('[data-official-start="exam"]').click();await page.locator('[data-official-cover-start]').click();await capture('exam');if(phase==='after'){assert.equal(await page.locator('.official-exam-bottom-actions [data-official-question-list]').count(),0);assert.equal(await page.locator('[data-official-question-list]').count(),1);assert(await page.locator('[data-official-timer-value]').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)>=18));}
  await page.evaluate(()=>gradeOfficialSession('MANUAL'));await capture('result');
  if(phase==='after'){
   assert.equal(await page.locator('.official-era-detail-section').count(),0);assert.equal(await page.locator('.official-donut').count(),1);assert.equal(await page.locator('.official-top-weak').count(),0);assert.equal(await page.locator('.official-result-review').count(),0);assert.equal(await page.locator('[data-official-retake]').innerText(),'재시험 보기');
   const order=await page.evaluate(()=>{const criteria=document.querySelector('.official-grade-criteria'),actions=document.querySelector('.official-result-actions');return criteria.nextElementSibling===actions});assert(order,'actions immediately follow grade criteria');assert(await page.locator('.official-result-hero').evaluate(n=>n.getBoundingClientRect().height<=120));
   const old=await page.evaluate(()=>OFFICIAL_EXAM_UI.results());await page.locator('[data-official-retake]').click();await capture('retake');await page.locator('[data-official-retake-confirm]').click();
   const state=await page.evaluate(()=>OFFICIAL_EXAM_UI.snapshot());assert.equal(state.index,0);assert.equal(state.answered,0);assert.deepEqual(await page.evaluate(()=>OFFICIAL_EXAM_UI.results()),old);
   await verifyTouches(page,width,capture);
   await verifyRevision(page,capture);
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log(`PASS ${phase}: four screens at 360/375/390/430px, no horizontal overflow${phase==='after'?', result analysis and retake preservation':''}.`);
}
async function verifyTouches(page,width,capture){
 const snap=()=>page.evaluate(()=>OFFICIAL_EXAM_UI.snapshot());
 const ids=(await snap()).questionIds.slice(0,3);
 const start=mode=>page.evaluate(([ids,mode])=>OFFICIAL_EXAM_UI[mode==='exam'?'startExam':'startLearning'](ids,{examTab:'round',examRound:70,examLevel:'심화',timed:false,startImmediately:true}),[ids,mode]);
 const cdp=await page.context().newCDPSession(page);
 const drag=async(selector,dx,dy=0)=>{
  const loc=page.locator(selector).first();await loc.scrollIntoViewIfNeeded();const b=await loc.boundingBox();
  const x=Math.min(width-40,Math.max(40,b.x+b.width/2));let y=Math.min(680,Math.max(120,b.y+Math.min(b.height/2,120)));
  if(selector==='.official-choice-grid'){const first=await page.locator('[data-official-pick]').first().boundingBox(),second=await page.locator('[data-official-pick]').nth(1).boundingBox();y=(first.y+first.height+second.y)/2;assert(y>first.y+first.height&&y<second.y,'drag starts in the gap between choices')}
  const endX=dx<0?Math.max(28,x+dx):Math.min(width-28,x+dx);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+(endX-x)*i/6,y:y+dy*i/6}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(300);
 };
 await start('exam');await drag('.official-content-image',-140);assert.equal((await snap()).index,1,'image swipe');
 await drag('[data-official-pick]',-140);assert.equal((await snap()).index,2,'choice swipe');assert.equal((await snap()).answered,0,'drag must not pick an answer');
 await drag('[data-official-pick]',-140);assert.equal((await snap()).index,2,'last boundary');assert.equal(await page.locator('.official-submit-modal').count(),0);
 await drag('[data-official-pick]',140);assert.equal((await snap()).index,1,'return without answering');
 await drag('.official-choice-grid',-140);assert.equal((await snap()).index,2,'shared choice area swipe');
 await start('exam');await drag('.official-question-kicker',140);assert.equal((await snap()).index,0,'first boundary');
 await drag('.official-content-image',4,-160);assert.equal((await snap()).index,0,'vertical scroll does not navigate');assert(await page.evaluate(()=>scrollY>0),'vertical touch scroll must work');
 await page.locator('[data-official-pick]').first().tap();await page.waitForTimeout(450);assert.equal((await snap()).index,1,'tap auto advance');assert.equal((await snap()).answers[ids[0]],0);
 await drag('[data-official-pick]',140);assert.equal((await snap()).index,0);assert.equal(await page.locator('[data-official-pick="0"][aria-checked="true"]').count(),1,'answer retained');
 await drag('[data-official-pick]',-140);assert.equal((await snap()).index,1,'no reselection needed');
 await page.locator('[data-official-question-list]').first().tap();const mapIndex=(await snap()).index;await drag('.official-question-number',-140);assert.equal((await snap()).index,mapIndex,'sheet cannot navigate practice');await page.locator('[data-official-question-list-close="button"]').tap();
 await page.locator('.official-content-image').tap();assert.equal(await page.locator('.official-image-modal').count(),1);await page.locator('[data-official-image-zoom]').tap();assert.equal(await page.locator('.official-image-scroll.zoomed').count(),1);await drag('.official-image-modal img',-140);assert.equal((await snap()).index,mapIndex,'zoom modal cannot navigate practice');await page.keyboard.press('Escape');
 if(await page.locator('.official-image-modal').count())await page.locator('[data-official-image-close]').first().click();
 await start('learn');await capture('learning');await drag('[data-official-pick]',-140);assert.equal((await snap()).index,1,'learning choice swipe');await drag('[data-official-pick]',140);assert.equal((await snap()).index,0);
 await page.locator('[data-official-pick]').first().tap();assert.equal((await snap()).answers[ids[0]],0);await page.locator('[data-official-submit]').tap();assert.equal(await page.locator('.official-feedback').count(),1,'learning feedback preserved');
 const ledger=JSON.parse(fs.readFileSync('docs/official-exams/question-choice-media.json','utf8'));
 for(const presentation of ['image','mixed']){
  const id=ledger.records.find(r=>r.presentation===presentation).officialQuestionId;
  await page.evaluate(([id,next])=>OFFICIAL_EXAM_UI.startExam([id,next],{examTab:'round',examRound:57,examLevel:'심화',timed:false,startImmediately:true}),[id,ids[1]]);
  await capture('choices-'+presentation);assert(await page.locator('.official-choice-media img').count()>0);
  await drag('[data-official-pick]',-140);assert.equal((await snap()).index,1,presentation+' choices swipe');assert.equal((await snap()).answered,0);
  await drag('[data-official-pick]',140);await page.locator('[data-official-pick]').first().tap();await page.waitForTimeout(450);assert.equal((await snap()).index,1,presentation+' choices tap');
 }
 await cdp.detach();console.log('PASS touch gestures and learning/exam behavior at '+width+'px');
}
async function verifyRevision(page,capture){
 const ids=await page.evaluate(()=>OFFICIAL_EXAM_UI.snapshot().questionIds);
 assert.equal(await page.evaluate(()=>typeof window.history.pushState),'function','app renderers must not shadow native browser history');
 await page.locator('.rev4-navigation [data-nav="ox"]').click();assert.equal(await page.locator('[data-ox-home-analysis],.ox-weakness-donut').count(),0);await capture('ox-home');
 await page.evaluate(()=>{
  globalThis.oxDebugEvents=[];
  document.addEventListener('click',e=>{const button=e.target.closest('button');if(button)oxDebugEvents.push({type:'click',data:{...button.dataset},text:button.textContent})},true);
  for(const type of ['hashchange','popstate'])window.addEventListener(type,()=>oxDebugEvents.push({type,url:location.href}));
 });
 await page.evaluate(()=>OX_QUIZ_API.startSession('era','goryeo',{count:2}));
 assert.equal(await page.evaluate(()=>OX_QUIZ_API.snapshot().meta.activeSession.questionIds.length),2);
 await page.locator('[data-ox-answer="true"]').tap();await page.locator('.ox-feedback').waitFor();await page.waitForTimeout(350);await page.locator('[data-ox-next]').tap();
 await page.waitForFunction(()=>OX_QUIZ_API.snapshot().meta.activeSession.index===1);
 await page.locator('[data-ox-answer="false"]').tap();await page.locator('.ox-feedback').waitFor();await page.waitForTimeout(350);await page.locator('[data-ox-next]').tap();
 await page.waitForTimeout(500);
 console.log('OX transition',JSON.stringify(await page.evaluate(()=>({view:OX_QUIZ_API.snapshot().view,events:oxDebugEvents,url:location.href}))));
 await page.screenshot({path:path.join(out,'ox-transition-'+page.viewportSize().width+'.png')});
 await page.locator('.ox-result').waitFor();
 assert.equal(await page.locator('.ox-result').count(),1,'OX result still works');
 await page.locator('[data-ox-home]').tap();await page.evaluate(()=>APP_ROUTE.apply('ox/analysis'));assert.equal(await page.locator('.ox-home').count(),1,'legacy analysis links safely redirect');
 // Install the accelerated clock only after testing ordinary quiz navigation.
 await page.clock.install();
 await page.evaluate(ids=>OFFICIAL_EXAM_UI.startExam(ids,{examTab:'round',examRound:79,examLevel:'심화',timed:true,startImmediately:true}),ids);
 await page.clock.fastForward(7200001);
 assert.equal(await page.locator('.official-results').count(),1,'timer expiry automatically submits');
 assert.equal(await page.locator('.official-timeout-notice').count(),1,'timeout notice retained');
 await capture('timeout-result');
 await page.locator('[data-official-result-home]').click();await page.locator('[data-official-round="79"]').click();
 assert.equal(await page.locator('.official-previous-results').count(),0,'recent-result button removed even with prior attempts');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});



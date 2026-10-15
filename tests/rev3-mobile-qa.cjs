const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const phase=process.env.QA_PHASE||'after',out=path.resolve(process.env.QA_OUTPUT||'tmp/rev3',phase);
const root=path.resolve('dist');
const origin=JSON.parse(fs.readFileSync('config/deployment-asset-origin.json','utf8'));
const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,data)=>{if(error){if(name.startsWith('/assets/')){res.writeHead(302,{Location:encodeURI('https://raw.githubusercontent.com/'+origin.repository+'/'+origin.commit+'/'+origin.sourcePath+name.slice(7))});return res.end()}res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data)})});
let browser,activePage,lastCapture;

async function main(){
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({headless:true});
 for(const width of [360,375,390,412,430]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  activePage=page;
  page.on('pageerror',e=>{errors.push(e.message);console.log('BROWSER_ERROR',e.message)});
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForTimeout(300);
  const capture=async name=>{
   lastCapture=name+'-'+width;
   await page.evaluate(()=>scrollTo(0,0));
   await page.waitForFunction(()=>[...document.images].filter(i=>!i.closest('details:not([open])')&&i.getBoundingClientRect().width>0&&i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0).every(i=>i.complete&&i.naturalWidth>0),null,{timeout:90000}).catch(async error=>{await page.screenshot({path:path.join(out,name+'-failed-'+width+'.png')});console.log('Image diagnostics',await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>({src:i.src,complete:i.complete,naturalWidth:i.naturalWidth}))));throw error;});
   await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.complete&&i.naturalWidth).map(i=>i.decode()));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
   await page.waitForTimeout(250);
   const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('main button,main h1,main h2')].filter(n=>{const b=n.getBoundingClientRect();return b.width&& (b.left<-1||b.right>innerWidth+1)&&!n.closest('.r3-era-covers')}).map(n=>({tag:n.tagName,text:n.textContent.slice(0,60),box:n.getBoundingClientRect().toJSON()}))}));
   assert(overflow.scroll<=width+1,name+' '+width+' overflow '+JSON.stringify(overflow));
   if(phase==='after')assert.equal(overflow.offenders.length,0,name+' offscreen '+JSON.stringify(overflow.offenders));
   await page.screenshot({path:path.join(out,name+'-'+width+'.png')});
   fs.writeFileSync(path.join(out,name+'-'+width+'.json'),JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('main .r3-play,main .r3-era-back,main .r3-play-header,main .r3-score')].map(n=>({class:n.className,rect:n.getBoundingClientRect().toJSON(),color:getComputedStyle(n).color,display:getComputedStyle(n).display}))),null,2));
   if(width===390)await page.screenshot({path:path.join(out,name+'-full-'+width+'.png'),fullPage:true});
  };
  await capture('A1-home');
  await page.locator('.nav [data-nav="records"]').click();await capture('K4-empty-records');
  await page.locator('.nav [data-nav="home"]').click();
  if(phase==='after'){
   assert.equal(await page.evaluate(()=>REV3_UI.version),3);
   assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(255, 255, 255)');
   assert((await page.locator('main').evaluate(n=>getComputedStyle(n).fontFamily)).includes('Malgun Gothic'));
   await page.locator('.r3-era-covers [data-era-open="goryeo"]').click();await capture('B2-era');
   await page.locator('[data-action="restart-episode"]').click();await capture('J5-restart');await page.locator('[data-action="close"]').click();
   await page.waitForTimeout(350);await page.locator('[data-chapter]').first().click();await page.locator('.chapter-sheet').waitFor();await capture('J4-chapter-sheet');
   await page.locator('[data-action="close"]').first().click();
   await page.waitForTimeout(350);await page.locator('[data-chapter]').first().click();
   const starter=page.locator('[data-action="start-chapter"],[data-action="continue-chapter"]').first();
   if(await starter.count()){await page.waitForFunction(()=>Date.now()>=inputLockedUntil);await starter.click();await page.locator('.game').waitFor();await page.waitForTimeout(300);await capture('story-goryeo');const advance=page.locator('[data-action="advance-dialogue"],[data-action="next"],[data-action="result-next"]').first();await page.waitForFunction(()=>Date.now()>=inputLockedUntil);if(await advance.count())await advance.click();else await page.locator('.conversation-game').tap();assert(await page.locator('.game').count());}
   await page.locator('.nav [data-nav="home"]').click({force:true}).catch(async()=>{await page.evaluate(()=>navigate('home'))});
  }
  if(phase==='after'){await page.evaluate(()=>{resultChapterId='ch01';screen='complete';render()});await capture('J7-chapter-complete');await page.evaluate(()=>{resultChapterId=null;navigate('home')});}
  await page.locator('.nav [data-nav="exam-library"]').click();await capture('E1-main');
  await page.locator('[data-official-round="79"]').first().click();await capture('E2-detail');
  const ids=await page.evaluate(()=>OFFICIAL_ENTRIES_FOR_ROUND(79,'심화').map(e=>e.canonicalQuestionId));
  if(phase==='after'){await page.locator('[data-r3-begin]').click();}
  else await page.evaluate(ids=>OFFICIAL_EXAM_UI.startExam(ids,{examTab:'round',examRound:79,examLevel:'심화',timed:true,startImmediately:true}),ids);
  await capture('E3-exam');
  if(phase==='after'){
   assert.equal(await page.locator('[data-official-question-list]').count(),1);
   await page.locator('[data-official-pick]').first().tap();await page.waitForTimeout(450);assert.equal(await page.evaluate(()=>OFFICIAL_EXAM_UI.snapshot().index),1);
   await page.locator('[data-official-question-list]').tap();await capture('E4-question-sheet');await page.locator('[data-r3-sheet-submit]').tap();await capture('E5-submit');
   await page.locator('[data-official-submit-cancel]').tap();
   await page.locator('[data-official-timer-pause]').tap();await capture('T6-pause');await page.locator('.modal [data-official-timer-start]').tap();
  }
  await page.evaluate(()=>{if(globalThis.EXAM_PRESENTATION){const p=EXAM_PRESENTATION;for(const [i,e]of p.session.entries.entries())p.session.answers[e.canonicalQuestionId]=i%7===0?(p.functions.officialQuestion(e.canonicalQuestionId).answer+1)%5:p.functions.officialQuestion(e.canonicalQuestionId).answer;}gradeOfficialSession('MANUAL');});
  await capture('E6-result');
  if(phase==='after'){
   const scoreStyle=await page.locator('.r3-score h1').evaluate(n=>({color:getComputedStyle(n).color,size:parseFloat(getComputedStyle(n).fontSize),height:n.parentElement.getBoundingClientRect().height}));
   assert.equal(scoreStyle.color,'rgb(21, 25, 43)','legacy score color must not override Rev.3');assert(scoreStyle.size>=72&&scoreStyle.height<=110,'Rev.3 score typography and compact hero');
   assert.equal(await page.locator('[data-official-retake]').count(),1);
   const old=await page.evaluate(()=>OFFICIAL_EXAM_UI.results()),runState=await page.evaluate(()=>JSON.stringify({run:state.run,main:state.mainRun}));
   await page.locator('[data-official-review]').first().click();await capture('E7-explanation');await page.locator('[data-official-review-back]').click();
   await page.locator('[data-official-retake]').click();await capture('retake-dialog');await page.locator('[data-official-retake-confirm]').click();
   assert.equal(await page.evaluate(()=>OFFICIAL_EXAM_UI.snapshot().index),0);assert.equal(await page.evaluate(()=>OFFICIAL_EXAM_UI.snapshot().answered),0);
   assert.deepEqual(await page.evaluate(()=>OFFICIAL_EXAM_UI.results()),old);
   await page.evaluate(()=>{const p=EXAM_PRESENTATION;for(const [i,e]of p.session.entries.entries())p.session.answers[e.canonicalQuestionId]=i%11===0?(p.functions.officialQuestion(e.canonicalQuestionId).answer+1)%5:p.functions.officialQuestion(e.canonicalQuestionId).answer;gradeOfficialSession('MANUAL');REV3_UI.views.comparison();});await capture('E9-comparison');
   await page.locator('[data-r3-aux-back]').click();await page.locator('[data-official-retry]').click();await capture('E8-wrong-learning');await page.locator('[data-official-pick]').first().tap();await page.locator('[data-official-submit]').tap();await capture('learning-feedback');assert.equal(await page.locator('.official-feedback').count(),1);
   assert.equal(await page.evaluate(()=>JSON.stringify({run:state.run,main:state.mainRun})),runState,'exam UI cannot mutate story progress');
   await page.evaluate(()=>REV3_UI.views.analysis());await capture('E10-analysis');await page.locator('[data-r3-aux-back]').click();
   await page.locator('[data-r3-leave]').click();await page.locator('[data-official-tab="era"]').click();await capture('E11-era');assert.equal(await page.locator('[data-official-era]').count(),7,'Rev.3 has seven era rows');
   await page.locator('.nav [data-nav="records"]').click();await capture('K1-records');await page.locator('.r3-link[data-official-results-list]').click();await capture('K2-history');await page.locator('[data-official-result-open]').first().click();await capture('K3-record-detail');
   await page.locator('.nav [data-nav="exam-library"]').click({force:true}).catch(async()=>{await page.evaluate(()=>navigate('exam-library'))});
   await page.evaluate(()=>{EXAM_PRESENTATION.view='home';render()});await page.locator('[data-official-tab="round"]').click();await page.locator('[data-r3-filter]').click();await capture('T7-filter');await page.locator('[data-r3-filter-apply]').click();
   await page.evaluate(()=>REV3_UI.views.search());await page.locator('[data-r3-search-input]').fill('no-such-history-987654');await page.waitForTimeout(250);await capture('T3-search-empty');await page.locator('[data-r3-aux-back]').click();
   await page.evaluate(()=>REV3_UI.states.loading());await capture('T1-loading');await page.evaluate(()=>REV3_UI.states.network());await capture('T2-network');await page.locator('[data-r3-reconnect]').click();
   await page.locator('.nav [data-nav="ox"]').click();await capture('Q1-ox-home');
   assert.equal(await page.locator('.ox-weakness-donut,[data-ox-home-analysis]').count(),0);
   await page.evaluate(()=>OX_QUIZ_API.startSession('era','goryeo',{count:2}));
   await capture('Q2-ox-question');
   await page.evaluate(()=>{const q=OX_PRESENTATION.functions.activeOXQuestion();document.querySelector('[data-ox-answer="'+q.answer+'"]').click()});await capture('Q3-ox-correct');await page.locator('[data-ox-next]').tap();
   await page.evaluate(()=>{const q=OX_PRESENTATION.functions.activeOXQuestion();document.querySelector('[data-ox-answer="'+(!q.answer)+'"]').click()});await capture('Q4-ox-wrong');await page.locator('[data-ox-next]').tap();await capture('Q5-ox-result');assert.equal(await page.locator('.ox-result').count(),1);
   await page.locator('[data-ox-retry-wrong]').tap();assert.equal(await page.evaluate(()=>OX_QUIZ_API.snapshot().meta.activeSession.questionIds.length),1);
   await page.evaluate(()=>{toast('틀린 3문제를 복습에 담았어요.');});await page.screenshot({path:path.join(out,'T4-toast-'+width+'.png')});
   await page.evaluate(ids=>OFFICIAL_EXAM_UI.startExam(ids,{examTab:'round',examRound:79,examLevel:'심화',timed:false,startImmediately:true}),ids);
   await verifyTouches(page,width,capture);
   await page.clock.install();await page.evaluate(ids=>OFFICIAL_EXAM_UI.startExam(ids,{examTab:'round',examRound:79,examLevel:'심화',timed:true,startImmediately:true}),ids);
   await page.clock.fastForward(4800001);assert.equal(await page.locator('.official-results').count(),1);assert.equal(await page.locator('.official-timeout-notice').count(),1);await capture('T5-timeout');await page.locator('[data-r3-timeout-close]').tap();
   console.log('PASS Rev.3 views, touch, timer, retake, records, OX and story isolation at '+width+'px');
  }
  assert.deepEqual(errors,[]);await context.close();
 }
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

main().catch(async e=>{console.error(e);if(activePage&&!activePage.isClosed())await activePage.screenshot({path:path.join(out,'failure-'+lastCapture+'.png'),fullPage:true}).catch(()=>{});process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});


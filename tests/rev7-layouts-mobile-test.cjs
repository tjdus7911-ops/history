const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve('dist'),output=path.resolve(process.env.QA_OUTPUT||'../../outputs/rev7-qa');
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(e,b)=>{res.statusCode=e?404:200;res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(e?'':b)})});
(async()=>{let browser;try{
 fs.mkdirSync(output,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=process.env.QA_CDP?await chromium.connectOverCDP(process.env.QA_CDP):await chromium.launch({headless:true,...(process.env.QA_BROWSER_CHANNEL?{channel:process.env.QA_BROWSER_CHANNEL}:{})});
 const results=[];
 for(const width of [360,390,412]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('.hv').waitFor();
  const capture=async name=>{await page.evaluate(()=>scrollTo(0,0));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow '+width);await page.screenshot({path:path.join(output,name+'-'+width+'.png')});};
  await page.locator('nav [data-nav="records"]').click();assert.equal(await page.locator('[data-figma-frame="M-09"]').count(),1);await capture('M-09');
  const fixture=await page.evaluate(()=>{
   const entries=REV7_EXAM_VIEWS.catalog.filter(e=>REV7_EXAM_VIEWS.question(e.canonicalQuestionId)&&REV7_EXAM_VIEWS.record(e.canonicalQuestionId).attempts===0).slice(0,2);
   entries.forEach((entry,i)=>{const q=REV7_EXAM_VIEWS.question(entry.canonicalQuestionId),id=q.questionId;meta().questionRecords[id]={attempts:2,correctCount:i,wrongCount:2-i,lastCorrect:Boolean(i),lastAnswer:(q.answer+1)%5,lastAttempt:new Date().toISOString()};meta().wrongQuestionIds.push(id);meta().learningEvents.push({questionId:id,answer:(q.answer+1)%5,correct:false,answeredAt:new Date().toISOString()})});save();render();return entries.map(e=>e.canonicalQuestionId);
  });
  const protectedBefore=await page.evaluate(()=>JSON.stringify({records:meta().questionRecords,events:meta().learningEvents,wrong:meta().wrongQuestionIds,results:meta().officialExamResults}));
  assert.equal(await page.locator('[data-figma-frame="M-01"]').count(),1);await capture('M-01');
  await page.locator('[data-r7-record-learning]').click();assert.equal(await page.locator('.r7-chart').count(),1);await capture('M-02');
  await page.locator('.r7-chips [data-record-period="all"]').click();await page.locator('.r7-era-chips [data-record-era="goryeo"]').click();await page.locator('.r7-era-chips [data-record-era="all"]').click();
  await page.goBack();assert.equal(await page.locator('[data-figma-frame="M-01"]').count(),1);await page.goForward();assert.equal(await page.locator('[data-figma-frame="M-02"]').count(),1);
  await page.locator('[data-r7-record-home]').click();await page.locator('.r7-my-links [data-nav="study"]').click();await capture('W-01');
  assert.equal(await page.locator('.r7-wrong-row').count(),1);await page.locator('[data-r7-wrong-status="completed"]').click();assert.equal(await page.locator('.r7-wrong-row').count(),1);
  await page.locator('[data-r7-wrong-status="needed"]').click();await page.locator('[data-r7-filter-open]').click();await capture('W-02');
  await page.locator('[data-r7-filter-era="joseon"]').click();await page.getByRole('button',{name:'닫기',exact:true}).click();assert.equal(await page.locator('.r7-wrong-row').count(),1,'cancel preserves filter');
  await page.locator('[data-r7-filter-open]').click();await page.locator('[data-r7-filter-era="joseon"]').click();await page.locator('[data-r7-filter-apply]').click();await capture('W-03');
  await page.locator('[data-r7-filter-open]').click();await page.keyboard.press('Escape');assert.equal(await page.locator('[role=dialog]').count(),0);
  await page.locator('[data-r7-filter-open]').click();await page.locator('[data-r7-filter-era="all"]').click();await page.locator('[data-r7-filter-apply]').click();
  assert.equal(await page.evaluate(()=>JSON.stringify({records:meta().questionRecords,events:meta().learningEvents,wrong:meta().wrongQuestionIds,results:meta().officialExamResults})),protectedBefore,'navigation and filters preserve records');
  await page.locator('[data-r7-wrong-bulk]').click();assert.equal(await page.locator('.official-practice').count(),1);assert.deepEqual(await page.evaluate(()=>OFFICIAL_EXAM_UI.snapshot().questionIds),fixture.slice(0,1));
  await page.locator('[data-r7-review-stop]').click();await page.locator('[role=dialog] [data-nav="study"]').click();await page.locator('nav [data-nav="ox"]').click();await capture('O-01');assert.equal(await page.locator('.r7-ox-row').count(),8);await page.locator('.r7-ox-row[data-ox-start="all"]').click();assert.equal(await page.locator('.r7-ox-play').count(),1);
  await page.locator('nav [data-nav="ox"]').click();await capture('O-01-resume');assert.equal(await page.locator('.r7-resume').count(),1);
  assert.deepEqual(errors,[]);results.push({width,pass:true,screens:['M-01','M-02','M-09','W-01','W-02','W-03','O-01'],checks:['no horizontal overflow','back/forward','filter apply/cancel/escape','bulk canonical IDs','records preserved','all era OX start/resume']});await context.close();
 }
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));console.log('PASS Rev.7 priority layouts at 360/390/412px');
}catch(e){console.error(e);process.exitCode=1}finally{await browser?.close();server.close()}})();

const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,"../dist");
let browser;
async function main(){
 browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:"block"}),page=await context.newPage(),errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.goto("file:///"+root.replace(/\\/g,"/")+"/index.html");
 await page.locator("[data-nav=exam-library]").click();
 assert.equal(await page.locator(".official-home-header").count(),1);
 await page.evaluate(()=>{const entries=OFFICIAL_EXAM_CATALOG.filter(entry=>entry.sourceRecord.examRound===79&&entry.sourceRecord.examLevel==="심화").sort((a,b)=>a.sourceRecord.questionNumber-b.sourceRecord.questionNumber);startOfficialSession(entries,"exam",{examTab:"round",examRound:79,examLevel:"심화",timed:false});gradeOfficialSession("MANUAL")});
 assert.equal(await page.locator(".official-results").count(),1);
 assert.equal(await page.locator(".official-certification.fail").count(),1);
 assert((await page.locator(".official-result-hero").innerText()).includes("0점"));
 assert.equal(await page.locator(".official-result-summary>div").count(),3);
 assert.equal(await page.locator(".official-result-actions button").count(),3);
 assert.equal(await page.locator("[data-official-retake]").innerText(),"재시험 보기");
 assert.equal(await page.locator(".official-analysis-scopes").count(),0);
 assert.equal((await page.locator(".official-result-analysis").innerText()).includes("누적 학습"),false);
 const analysis=await page.evaluate(()=>OFFICIAL_RESULT_ANALYSIS.current("attempt"));
 assert.equal(analysis.total,50);
 assert.equal(analysis.wrongTotal,50);
 assert.equal(analysis.rows.reduce((sum,row)=>sum+row.total,0),50);
 assert(Math.abs(analysis.rows.reduce((sum,row)=>sum+row.wrongShare,0)-100)<0.2);
 const widths=[360,375,390,430,1280];
 fs.mkdirSync("tmp/official-exam-redesign-qa",{recursive:true});
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  const layout=await page.evaluate(()=>{
   const hero=document.querySelector(".official-result-hero").getBoundingClientRect(),grade=document.querySelector(".official-certification").getBoundingClientRect(),summary=document.querySelector(".official-result-summary").getBoundingClientRect(),actions=document.querySelector(".official-result-actions"),actionBox=actions.getBoundingClientRect(),buttons=[...actions.querySelectorAll("button")].map(node=>({box:node.getBoundingClientRect(),height:node.getBoundingClientRect().height,scrollHeight:node.scrollHeight,clientHeight:node.clientHeight})),criteria=document.querySelector(".official-grade-criteria"),analysis=document.querySelector(".official-result-analysis"),ordered=[document.querySelector(".official-result-hero"),document.querySelector(".official-result-summary"),actions,criteria,analysis].filter(Boolean);
   const follows=(a,b)=>Boolean(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);
   return {overflow:document.documentElement.scrollWidth>innerWidth+1,hero:{width:hero.width,height:hero.height,left:hero.left,right:hero.right,top:hero.top,bottom:hero.bottom},grade:{width:grade.width,height:grade.height,left:grade.left,right:grade.right,top:grade.top,bottom:grade.bottom},gradeFill:Math.abs(grade.height-(hero.height-2))<=2&&Math.abs(grade.right-(hero.right-1))<=2,actionOrder:follows(ordered[0],ordered[1])&&follows(ordered[1],ordered[2])&&(!criteria||follows(actions,criteria))&&follows(actions,analysis),buttons,actionBox,rows:document.querySelectorAll(".official-era-detail-row").length};
  });
  assert.equal(layout.overflow,false,width+"px result overflow");
  assert.equal(layout.gradeFill,true,width+"px grade background does not fill its panel: "+JSON.stringify({hero:layout.hero,grade:layout.grade}));
  assert.equal(layout.actionOrder,true,width+"px result sections are out of order");
  assert.equal(layout.buttons.length,3);
  assert(Math.abs(layout.buttons[0].box.y-layout.buttons[1].box.y)<2,width+"px first two actions should share a row");
  assert(layout.buttons[2].box.y>layout.buttons[0].box.y,width+"px retake should be on row two");
  assert(Math.abs(layout.buttons[2].box.width-layout.actionBox.width)<2,width+"px retake should span both columns");
  assert(layout.buttons.every(item=>item.height>=48&&item.scrollHeight<=item.clientHeight+2),width+"px action is too small or wraps");
  if(width<=430||width===1280)await page.screenshot({path:"tmp/official-exam-redesign-qa/result-"+width+".png",fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator("[data-official-result-home]").click();
 assert.equal(await page.locator(".official-edition-status.complete").first().innerText(),"응시 완료");
 assert.equal(await page.locator("[data-official-result-open]").count()>=1,true);
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  const layout=await page.evaluate(()=>{
   const cards=[...document.querySelectorAll(".official-round-row")],intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
   const safe=cards.every(card=>{const title=card.querySelector(".official-round-title").getBoundingClientRect(),badge=card.querySelector(".official-edition-status").getBoundingClientRect(),head=card.querySelector(".official-round-overview").getBoundingClientRect(),date=card.querySelector(".official-round-meta time").getBoundingClientRect(),button=card.querySelector(".official-round-action").getBoundingClientRect(),box=card.getBoundingClientRect();return !intersects(title,badge)&&head.bottom<=date.top+1&&date.bottom<=button.top+1&&button.right<=box.right+1&&button.bottom<=box.bottom+1});
   return {overflow:document.documentElement.scrollWidth>innerWidth+1,safe,cards:cards.length};
  });
  assert.equal(layout.overflow,false,width+"px exam home overflow");
  assert.equal(layout.safe,true,width+"px round card contents overlap or escape");
  assert.equal(layout.cards,23);
  await page.screenshot({path:"tmp/official-exam-redesign-qa/home-"+width+".png",fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator("[data-nav=records]").click();
 assert.equal(await page.locator(".official-records").count(),1);
 const recordsText=await page.locator(".official-records").innerText();
 assert(recordsText.includes("시험 기록")&&recordsText.includes("최종 점수")&&recordsText.includes("등급 판정"));
 assert.equal(recordsText.includes("학습 캘린더"),false);
 assert.equal(recordsText.includes("이야기와 수집 기록"),false);
 assert.equal(await page.locator(".official-record-learning-empty").count(),0);
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  const layout=await page.evaluate(()=>{const root=document.querySelector(".official-records").getBoundingClientRect(),overview=document.querySelector(".official-record-overview").getBoundingClientRect(),latest=document.querySelector(".official-latest-result").getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth+1,inside:root.left>=-1&&root.right<=innerWidth+1&&overview.right<=root.right+1&&latest.right<=root.right+1}});
  assert.equal(layout.overflow,false,width+"px records overflow");
  assert.equal(layout.inside,true,width+"px records content escapes its column");
  await page.screenshot({path:"tmp/official-exam-redesign-qa/records-"+width+".png",fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator(".official-record-exams [data-official-results-list]").click();
 assert.equal(await page.locator(".official-exam-history-row").count(),1);
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  const row=await page.locator(".official-exam-history-row").first().evaluate(node=>{const card=node.getBoundingClientRect(),button=node.querySelector("button").getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth+1,inside:card.left>=-1&&card.right<=innerWidth+1&&button.right<=card.right+1&&button.height>=48,buttonWidth:button.width,cardWidth:card.width}});
  assert.equal(row.overflow,false,width+"px history overflow");
  assert.equal(row.inside,true,width+"px result button alignment or touch target");
  if(width<=560)assert(row.buttonWidth>=row.cardWidth-36,width+"px result button should fill the card content width");
  await page.screenshot({path:"tmp/official-exam-redesign-qa/history-"+width+".png",fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator("[data-official-result-open]").first().click();
 assert.equal(await page.locator(".official-results").count(),1);
 const emptyContext=await browser.newContext({viewport:{width:360,height:844},isMobile:true,hasTouch:true,serviceWorkers:"block"}),emptyPage=await emptyContext.newPage(),emptyErrors=[];
 emptyPage.on("pageerror",error=>emptyErrors.push(error.message));
 await emptyPage.goto("file:///"+root.replace(/\\/g,"/")+"/index.html");
 await emptyPage.locator(".nav [data-nav=records]").click();
 assert.equal(await emptyPage.locator(".official-record-learning-empty").count(),1);
 assert.equal(await emptyPage.locator(".official-record-empty").count(),1);
 const emptyRecordsText=await emptyPage.locator(".official-records").innerText();
 assert.equal(emptyRecordsText.includes("학습 캘린더"),false);
 assert.equal(emptyRecordsText.includes("이야기와 수집 기록"),false);
 for(const width of [360,375,390,430,1280]){
  await emptyPage.setViewportSize({width,height:900});
  assert.equal(await emptyPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,width+"px empty records overflow");
  await emptyPage.screenshot({path:"tmp/official-exam-redesign-qa/records-empty-"+width+".png",fullPage:true});
 }
 await emptyPage.locator(".nav [data-nav=exam-library]").click();
 await emptyPage.locator(".official-home-service [data-official-results-list]").click();
 assert.equal(await emptyPage.locator(".official-history-empty").count(),1);
 assert.deepEqual(emptyErrors,[]);
 await emptyContext.close();
 assert.deepEqual(errors,[]);
 await context.close();
 console.log("PASS: exam home, result, records, and history rendered at 360/375/390/430/1280px; grade fill, section/action order, badge alignment, touch targets, empty-state removals, and saved-result navigation verified.");
}
main().then(async()=>{await browser.close()}).catch(async error=>{console.error(error);if(browser)await browser.close();process.exitCode=1});

const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist');
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]);
 const file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data)});
});

const startQuestion=(page,id,mode='learn')=>page.evaluate(({questionId,sessionMode})=>{
 const entry=OFFICIAL_EXAM_CATALOG.find(item=>item.canonicalQuestionId===questionId||item.sourceRecord?.officialQuestionId===questionId);
 if(!entry)throw new Error(`missing official question: ${questionId}`);
 startOfficialSession([entry],sessionMode,sessionMode==='exam'?{startImmediately:true}:{});
},{questionId:id,sessionMode:mode});

let browser;
async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 for(const width of [360,390,412]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await startQuestion(page,'official-79-advanced-06');
  await page.locator('.official-choice-media img').first().waitFor();
  const imageLayout=await page.locator('.official-choice-grid').evaluate(grid=>{
   const cards=[...grid.querySelectorAll('button')],boxes=cards.map(card=>card.getBoundingClientRect()),images=[...grid.querySelectorAll('.official-choice-media img')];
   return {columns:getComputedStyle(grid).gridTemplateColumns,cards:boxes.map(box=>({x:box.x,y:box.y,width:box.width,height:box.height})),imageObjectFits:images.map(image=>getComputedStyle(image).objectFit),imageHeights:images.map(image=>image.getBoundingClientRect().height),visibleLabels:grid.querySelectorAll('.official-choice-label').length,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.equal(imageLayout.cards.length,5);assert.equal(imageLayout.visibleLabels,0,'pure image choices exposed explanatory identity prose');assert.equal(imageLayout.imageObjectFits.every(value=>value==='contain'),true);assert.equal(imageLayout.overflow,false);
  assert(imageLayout.columns.split(' ').length===2,`${width}px image choices are not a two-column grid: ${imageLayout.columns}`);
  assert(Math.abs(imageLayout.cards[0].y-imageLayout.cards[1].y)<=1&&Math.abs(imageLayout.cards[2].y-imageLayout.cards[3].y)<=1,'paired image cards lost row alignment');
  assert(imageLayout.cards.every(card=>card.width<width*0.55&&card.height>=44),`${width}px image card sizing is not mobile-safe`);
  assert(imageLayout.imageHeights.every(height=>height<=146&&height>=120),`${width}px image height escaped the mobile bounds`);
  const last=imageLayout.cards[4];assert(Math.abs(last.x+last.width/2-width/2)<=2,'the fifth image choice is not centered');
  await page.locator('[data-official-pick="0"]').click();await page.locator('[data-official-pick="1"]').click();assert.equal(await page.locator('[data-official-pick][aria-checked="true"]').count(),1);

  await startQuestion(page,'official-79-advanced-17');
  const labels=await page.locator('.official-choice-label').allInnerTexts();assert.deepEqual(labels,['(가)','(나)','(다)','(라)','(마)']);
  const preGrade=await page.locator('.official-choice-panel').innerText();for(const hint of ['최충헌 집권','강화도 천도','제1차 일본 원정','쌍성총관부 탈환','과전법 제정'])assert(!preGrade.includes(hint),`pre-grade hint leaked: ${hint}`);
  await startQuestion(page,'official-79-advanced-17','exam');
  assert.deepEqual(await page.locator('.official-choice-label').allInnerTexts(),['(가)','(나)','(다)','(라)','(마)']);assert.equal(await page.locator('.official-choice-explanations').count(),0);await page.locator('[data-official-pick="0"]').click();assert.equal(await page.locator('.official-choice-explanations').count(),0,'exam mode revealed explanations before final submission');
  await startQuestion(page,'official-79-advanced-17');
  assert.equal(await page.locator('.official-choice-explanations').count(),0);await page.locator('[data-official-pick="0"]').click();await page.locator('[data-official-submit]').click();await page.locator('.official-choice-explanations').waitFor();
  const postGrade=await page.locator('.official-choice-explanations').innerText();assert(/최충헌|강화도|일본 원정|쌍성총관부|과전법/.test(postGrade),'historical explanation did not move behind grading');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: exact source choices stay hint-free before grading and image choices remain compact at 360/390/412px.');
}
main().then(async()=>{await browser.close();server.close()}).catch(async error=>{console.error(error);if(browser)await browser.close();server.close();process.exitCode=1});

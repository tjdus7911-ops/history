const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const phase=process.env.QA_PHASE||'after',out=path.resolve(process.env.QA_OUTPUT||'tmp/mobile-product',phase);
const root=path.resolve('dist');
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+(req.url.split('?')[0]==='/'?'/index.html':decodeURIComponent(req.url.split('?')[0])));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data)})});
let browser;
async function main(){
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({headless:true,...(process.env.QA_BROWSER?{executablePath:process.env.QA_BROWSER}:{})});
 for(const width of [360,390,412]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);await page.locator('[data-nav="exam-library"]').click();
  const capture=async name=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} ${name} overflow`);await page.screenshot({path:path.join(out,`${name}-${width}.png`),fullPage:true})};
  await capture('main');await page.locator('[data-official-round="70"]').click();await capture('detail');await page.locator('[data-official-start="exam"]').click();await page.locator('[data-official-cover-start]').click();await capture('exam');
  await page.evaluate(()=>gradeOfficialSession('MANUAL'));await capture('result');
  if(phase==='after'){
   assert.equal(await page.locator('.official-era-detail-section').count(),0);assert.equal(await page.locator('.official-donut').count(),1);assert.equal(await page.locator('.official-top-weak li').count(),3);assert.equal(await page.locator('[data-official-retake]').innerText(),'재시험 보기');
   const old=await page.evaluate(()=>OFFICIAL_EXAM_UI.results());await page.locator('[data-official-retake]').click();await capture('retake');await page.locator('[data-official-retake-confirm]').click();
   const state=await page.evaluate(()=>OFFICIAL_EXAM_UI.snapshot());assert.equal(state.index,0);assert.equal(state.answered,0);assert.deepEqual(await page.evaluate(()=>OFFICIAL_EXAM_UI.results()),old);
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log(`PASS ${phase}: four screens at 360/390/412px, no horizontal overflow${phase==='after'?', result analysis and retake preservation':''}.`);
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});


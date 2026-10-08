const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert'),{chromium}=require('playwright');
const root=path.resolve('dist'),server=http.createServer((req,res)=>{const pathname=req.url.split('?')[0],file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))return res.end();fs.readFile(file,(error,body)=>{if(error){res.statusCode=404;return res.end()}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(body)})});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 for(const width of [360,390,412]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port);assert.equal(await page.locator('[data-nav="association"]').count(),0);assert.equal(await page.locator('[data-nav="ox"]').count(),1);await page.locator('[data-nav="ox"]').click();
  assert.equal(await page.locator('[data-ox-era]').count(),7);assert(await page.locator('text=오늘의 심화 핵심 개념').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'home horizontal overflow '+width);
  fs.mkdirSync('tmp/ox-mobile',{recursive:true});await page.screenshot({path:`tmp/ox-mobile/home-${width}.png`,fullPage:true});
  await page.locator('[data-ox-start="quick"][data-count="10"]').click();assert(await page.locator('.ox-question-card h2').isVisible());const sizes=await page.locator('.ox-answer').evaluateAll(items=>items.map(item=>{const box=item.getBoundingClientRect();return {width:box.width,height:box.height}}));assert(sizes.every(size=>size.width>=120&&size.height>=100),'OX touch targets too small '+width);
  await page.locator('[data-ox-answer="true"]').click();assert(await page.locator('.ox-feedback').isVisible());assert(await page.locator('[data-ox-next]').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'quiz horizontal overflow '+width);await page.screenshot({path:`tmp/ox-mobile/answer-${width}.png`,fullPage:true});
  await page.reload();assert(await page.locator('.ox-feedback').isVisible(),'session feedback did not restore '+width);assert((await page.locator('.ox-progress-label').innerText()).includes('현재 1번'));assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: OX home/play/feedback/reload at 360/390/412px, accessible touch targets, no horizontal overflow, mnemonic navigation hidden.');
}finally{if(browser)await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});

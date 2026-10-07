const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert'),{chromium}=require('playwright');
const root=path.resolve('dist'),server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+(req.url==='/'?'/index.html':req.url.split('?')[0]));if(!file.startsWith(root+path.sep))return res.end();fs.readFile(file,(err,b)=>{if(err){res.statusCode=404;return res.end()}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(b)})});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 for(const width of [320,390,430]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('[data-nav="association"]').click();
  const search=page.locator('[data-association-search]');await search.pressSequentially('abc');assert.equal(await search.inputValue(),'abc');assert(await search.evaluate(e=>document.activeElement===e),'search focus lost');
  await search.fill('경운궁');assert.equal(await page.locator('[data-association-open]').count(),1);
  await search.fill('');await page.locator('[data-association-era]').selectOption('joseon');assert(await page.locator('[data-association-open="memory-palaces"]').count());
  await page.locator('[data-association-open="memory-palaces"]').click();assert.equal(await page.locator('[aria-expanded="false"]').count(),5);
  await page.locator('[data-association-step="0"]').click();await page.locator('[data-association-step="1"]').click();assert.equal(await page.locator('[aria-expanded="true"]').count(),2);
  await page.locator('[data-association-recall]').click();assert.equal(await page.locator('.association-mnemonic').count(),0);assert(!(await page.locator('#app').innerText()).includes('복덕(방)'));
  await page.locator('[data-association-answer="창덕궁"]').click();assert((await page.locator('#app').innerText()).includes('복덕(방)'));assert((await page.locator('#app').innerText()).includes('덕 → 창덕궁'));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow '+width);assert.deepEqual(errors,[]);
  fs.mkdirSync('tmp/mnemonic-mobile',{recursive:true});await page.screenshot({path:'tmp/mnemonic-mobile/recall-'+width+'.png',fullPage:true});await context.close();
 }
 console.log('PASS: mnemonic mobile QA at 320/390/430px, continuous typing, fact search, era filter, independent accordions, hidden/revealed Recall and no horizontal overflow.');
}finally{if(browser)await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});

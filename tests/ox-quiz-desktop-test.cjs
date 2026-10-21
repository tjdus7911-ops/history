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
 const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.locator('nav.nav [data-nav="ox"]').click();
 assert.equal(await page.locator('[data-ox-era]').count(),7,'desktop must show all seven era choices');
 await page.locator('[data-ox-era="joseon"]').click();
 assert.equal(await page.locator('.r7-ox-feedback').count(),0,'answer and explanation must stay hidden before selection');
 assert.equal(await page.locator('[data-ox-next]').count(),0,'next button must stay hidden before selection');
 const current=await page.evaluate(()=>{const session=meta().oxQuiz.activeSession;return OX_QUESTIONS.find(question=>question.id===session.questionIds[session.index])});
 await page.locator(`[data-ox-answer="${String(!current.answer)}"]`).click();
 assert((await page.locator('.r7-ox-feedback span').innerText()).includes(`정답 ${current.answer?'O':'X'}`),'feedback must reveal the verified answer after selection');
 assert((await page.locator('.r7-ox-explain p').innerText()).split(/(?<=[.!?])\s+/).length>=2,'feedback must contain a multi-sentence learning explanation');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'desktop quiz must not overflow horizontally');
 fs.mkdirSync('tmp/ox-desktop',{recursive:true});await page.screenshot({path:'tmp/ox-desktop/answer-1440.png',fullPage:true});
 const first=await page.locator('.r7-ox-statement').innerText();await page.locator('[data-ox-next]').click();
 assert.notEqual(await page.locator('.r7-ox-statement').innerText(),first,'next button must advance to another question');
 assert.equal(await page.locator('.r7-ox-feedback').count(),0,'new question must hide feedback until selection');
 assert.deepEqual(errors,[]);await context.close();
 console.log('PASS: desktop OX selection gating, verified answer/explanation reveal, next navigation, and 1440px layout.');
}finally{if(browser)await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});

const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');

const root=path.resolve('dist'),shots=path.resolve('tmp/ox-mobile');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((request,response)=>{
  const pathname=decodeURIComponent(request.url.split('?')[0]),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){response.writeHead(403);return response.end();}
  fs.readFile(file,(error,buffer)=>{if(error){response.writeHead(404);return response.end();}response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');response.end(buffer);});
});

(async()=>{let browser;try{
  fs.mkdirSync(shots,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const width of [360,390,412]){
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'domcontentloaded'});

    const initialNavCount=await page.locator('.rev4-navigation [data-nav]').count();
    assert.equal(initialNavCount,5,`${width}: five-tab navigation missing; ${JSON.stringify({errors,text:(await page.locator('#app').innerText()).slice(0,240)})}`);
    await page.locator('.rev4-navigation [data-nav="ox"]').click();
    const homeText=await page.locator('#app').innerText();
    assert(homeText.includes('OX 퀴즈')&&homeText.includes('한능검 심화 핵심 개념을 빠르게 확인해요.'),`${width}: OX home copy missing`);
    assert(homeText.includes('최대 20문제'),`${width}: session cap label missing`);
    assert.equal(await page.locator('[data-ox-era]').count(),7,`${width}: seven era rows required`);
    assert.equal(await page.locator('[data-ox-review]').count(),1,`${width}: wrong-answer review action missing`);
    assert.equal(await page.locator('[data-ox-analysis],[data-ox-home-analysis]').count(),0,`${width}: out-of-scope analysis UI returned to Rev.4 O-01`);
    assert((await page.locator('[data-ox-home-review-era]').boundingBox()).height>=44,`${width}: review select touch target`);
    const eraHeights=await page.locator('[data-ox-era]').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().height));
    assert(eraHeights.every(height=>height>=44&&height<=132),`${width}: compact era rows ${eraHeights}`);
    const navLayout=await page.locator('.rev4-navigation .nav').evaluate(nav=>{const boxes=[...nav.querySelectorAll('button')].map(button=>button.getBoundingClientRect()),main=document.querySelector('.main'),sidebar=document.querySelector('.sidebar');return {tops:boxes.map(box=>Math.round(box.top)),heights:boxes.map(box=>box.height),navHeight:sidebar.getBoundingClientRect().height,mainPaddingBottom:parseFloat(getComputedStyle(main).paddingBottom)}});
    assert.equal(new Set(navLayout.tops).size,1,`${width}: navigation wrapped`);
    assert(navLayout.heights.every(height=>height>=44)&&navLayout.mainPaddingBottom>=navLayout.navHeight,`${width}: navigation overlap ${JSON.stringify(navLayout)}`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: home horizontal overflow`);
    if(width===390)await page.screenshot({path:path.join(shots,'rev4-o01-home-390.png'),fullPage:true});

    const sessionSize=await page.evaluate(()=>Math.min(20,OX_QUESTIONS.filter(question=>question.eraId==='goryeo').length));
    await page.locator('[data-ox-era="goryeo"]').click();
    assert.equal(new URL(page.url()).hash,'#ox/quiz',`${width}: quiz route missing`);
    assert.equal(await page.evaluate(()=>meta().oxQuiz.activeSession.questionIds.length),sessionSize,`${width}: session size`);
    assert.equal(await page.locator('.ox-feedback').count(),0,`${width}: answer leaked before choice`);
    assert.equal(await page.locator('[data-ox-next]').count(),0,`${width}: next action leaked before choice`);
    const sizes=await page.locator('.ox-answer').evaluateAll(items=>items.map(item=>{const box=item.getBoundingClientRect();return {width:box.width,height:box.height}}));
    assert(sizes.every(size=>size.width>=112&&size.height>=108),`${width}: OX answer targets too small ${JSON.stringify(sizes)}`);
    const correct=await page.evaluate(()=>{const session=meta().oxQuiz.activeSession;return OX_QUESTIONS.find(question=>question.id===session.questionIds[session.index]).answer});
    await page.locator(`[data-ox-answer="${String(!correct)}"]`).click();
    assert(await page.locator('.ox-feedback').isVisible(),`${width}: feedback missing`);
    assert(await page.locator('[data-ox-next]').isVisible(),`${width}: next action missing`);
    assert((await page.locator('.ox-feedback strong').innerText()).includes(`정답은 ${correct?'O':'X'}`),`${width}: correct answer label missing`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: quiz horizontal overflow`);
    if(width===390)await page.screenshot({path:path.join(shots,'rev4-o02-feedback-390.png'),fullPage:true});

    await page.reload();
    assert(await page.locator('.ox-feedback').isVisible(),`${width}: answered session did not restore`);
    await page.locator('[data-ox-back]').click();
    assert.equal(new URL(page.url()).hash,'#ox',`${width}: quiz back route`);
    assert(await page.locator('[data-ox-resume]').isVisible(),`${width}: resume card missing`);
    await page.locator('.rev4-navigation [data-nav="study"]').click();
    await page.locator('[data-wrong-filter="ox"]').click();
    assert((await page.locator('[data-ox-review-filter]').boundingBox()).height>=44,`${width}: wrong-note filter touch target`);
    assert.equal(await page.locator('[data-ox-wrong-open]').count(),1,`${width}: saved OX wrong answer missing`);
    await page.locator('[data-ox-wrong-open]').click();
    assert((await page.locator('[data-ox-review-one]').boundingBox()).height>=44,`${width}: retry touch target`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: wrong-note overflow`);

    for(const route of ['home','exam-library','ox','study','records']){
      await page.waitForTimeout(240);
      await page.locator(`.rev4-navigation [data-nav="${route}"]`).click();
      assert.equal(await page.evaluate(()=>screen),route,`${width}: navigation did not enter ${route}`);
      assert.equal(new URL(page.url()).hash,`#${route}`,`${width}: URL did not synchronize ${route}`);
      assert(await page.locator(`.rev4-navigation [data-nav="${route}"][aria-current="page"]`).isVisible(),`${width}: active tab missing for ${route}`);
    }
    assert.deepEqual(errors,[],`${width}: runtime page errors`);
    await context.close();
  }
  console.log('PASS: Rev.4 OX home, era quiz, feedback, resume, wrong-note persistence, five-tab navigation, and 360/390/412px overflow checks.');
}finally{if(browser)await browser.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1;});

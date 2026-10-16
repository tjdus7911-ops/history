const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');

const root=path.resolve('dist'),shots=path.resolve('tmp/rev4-mobile');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer((request,response)=>{
  const pathname=decodeURIComponent(request.url.split('?')[0]),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){response.writeHead(403);return response.end();}
  fs.readFile(file,(error,buffer)=>{if(error){response.writeHead(404);return response.end();}response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');response.end(buffer);});
});

(async()=>{let browser;try{
  fs.mkdirSync(shots,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const width of [360,390,430]){
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'domcontentloaded'});

    assert(await page.locator('html.rev4-active').isVisible(),`${width}: Rev.4 enhancer not active`);
    assert.equal(await page.locator('.rev4-navigation [data-nav]').count(),5,`${width}: bottom navigation count`);
    assert(await page.getByText('박물관에서 눈을 감았다.',{exact:false}).isVisible(),`${width}: H-02 welcome hero missing`);
    assert.equal(await page.locator('.rev4-how li').count(),3,`${width}: H-02 onboarding steps`);
    assert((await page.locator('.rev4-era-tile').count())>=7,`${width}: H-02 era scroller missing`);
    assert.equal(await page.locator('.rev4-first-shortcuts>button').count(),2,`${width}: H-02 shortcuts`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: H-02 horizontal overflow`);
    if(width===390)await page.screenshot({path:path.join(shots,'h02-first-visit-390.png'),fullPage:true});

    await page.locator('[data-rev4-search-open]').click();
    assert(await page.locator('.rev4-search[role="dialog"]').isVisible(),`${width}: search dialog missing`);
    await page.locator('[data-rev4-search-input]').fill('고려');
    assert((await page.locator('.rev4-search-results>button').count())>0,`${width}: connected search results missing`);
    await page.locator('[data-rev4-search-input]').fill('존재하지않는검색어');
    assert(await page.getByText('검색 결과가 없어요',{exact:true}).isVisible(),`${width}: C-07 search empty state missing`);
    await page.locator('[data-rev4-search-close]').click();

    const nav=route=>page.locator(`.rev4-navigation [data-nav="${route}"]`);
    await page.waitForTimeout(240);
    await nav('exam-library').click();
    assert((await page.locator('.official-round-row').count())>0,`${width}: E-01/E-02 exam home missing; ${JSON.stringify({screen:await page.evaluate(()=>screen),text:(await page.locator('#app').innerText()).slice(0,260)})}`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: exam home overflow`);
    if(width===390)await page.screenshot({path:path.join(shots,'e01-exam-home-390.png'),fullPage:true});

    await page.waitForTimeout(240);await nav('ox').click();
    assert.equal(await page.locator('[data-ox-era]').count(),7,`${width}: O-01 era list missing`);
    await page.waitForTimeout(240);await nav('study').click();
    assert((await page.locator('.rev4-wrong-index').count())===1,`${width}: W-01 wrong-note shell missing`);
    assert((await page.locator('.rev4-wrong-summary>div').count())===4,`${width}: W-01 summary missing`);
    await page.locator('.rev4-filter-trigger').click();
    assert(await page.locator('.rev4-filter-sheet.open').isVisible(),`${width}: W-02 filter sheet missing`);
    await page.locator('.rev4-filter-sheet [data-rev4-filter-toggle]').click();
    if(width===390)await page.screenshot({path:path.join(shots,'w01-wrong-note-390.png'),fullPage:true});

    await page.waitForTimeout(240);await nav('records').click();
    assert((await page.locator('.rev4-records,.official-records').count())===1,`${width}: R-01 records shell missing; ${JSON.stringify({screen:await page.evaluate(()=>screen),text:(await page.locator('#app').innerText()).slice(0,200)})}`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: records overflow`);
    if(width===390)await page.screenshot({path:path.join(shots,'r01-records-390.png'),fullPage:true});

    await page.evaluate(()=>{state.run=INITIAL();state.run.started=true;state.run.storyId='prologue';state.run.dialogueSceneId='prologue';state.run.dialogueCursor=1;state.mainRun=null;state.meta.rev4QAMarker='preserve-existing-user-data';save();navigate('home');});
    assert(await page.locator('.rev4-home.returning').isVisible(),`${width}: H-01 returning home missing`);
    assert.equal(await page.locator('.rev4-metric-card>div').count(),4,`${width}: H-01 metrics`);
    await page.reload();
    assert.equal(await page.evaluate(()=>meta().rev4QAMarker),'preserve-existing-user-data',`${width}: saved learning marker changed on reload`);
    assert(await page.locator('.rev4-home.returning').isVisible(),`${width}: H-01 did not restore`);
    if(width===390)await page.screenshot({path:path.join(shots,'h01-returning-390.png'),fullPage:true});
    assert.deepEqual(errors,[],`${width}: browser runtime errors`);
    await context.close();
  }
  console.log('PASS: Rev.4 H-01/H-02, connected search/empty state, exam/OX/wrong-note/records shells, filters, persistence, and 360/390/430px overflow checks.');
}finally{if(browser)await browser.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1;});

const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve('dist'),output=path.resolve(process.env.QA_OUTPUT||'artifacts/home-v6-qa');
const server=http.createServer((req,res)=>{
  const pathname=decodeURI(req.url.split('?')[0]),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  fs.readFile(file,(error,body)=>{res.statusCode=error?404:200;res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(error?'':body);});
});

(async()=>{let browser;try{
  fs.mkdirSync(output,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined});
  for(const width of [360,390,430]){
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>globalThis.CORE_APP_READY&&globalThis.HOME_V6_API);
    await page.evaluate(()=>{
      const now=new Date(),today=new Date(now.getTime()-1000),yesterday=new Date(now);yesterday.setDate(yesterday.getDate()-1);yesterday.setHours(12,0,0,0);
      const first={questionId:'home-v6-today',answer:0,correct:true,answeredAt:today.toISOString()};
      meta().learningEvents=[first,{...first},{questionId:'home-v6-yesterday',answer:1,correct:false,answeredAt:yesterday.toISOString()}];
      const ox=REV7_OX_VIEWS.meta();ox.history.push({questionId:'home-v6-ox',selectedAnswer:true,isCorrect:true,correct:true,answeredAt:today.toISOString(),sessionId:'home-v6-session',attemptNumber:1});
      const target=new Date(now.getFullYear(),now.getMonth(),now.getDate()+14);meta().examTargetDate=[target.getFullYear(),String(target.getMonth()+1).padStart(2,'0'),String(target.getDate()).padStart(2,'0')].join('-');
      save();render();scrollTo(0,0);
    });
    await page.locator('.hv').waitFor();await page.evaluate(()=>document.fonts.ready);
    const wordmark=await page.locator('.hv-brand').evaluate(el=>({text:el.innerText,navy:getComputedStyle(el.querySelector('span')).color,coral:getComputedStyle(el.querySelector('em')).color,family:getComputedStyle(el).fontFamily}));
    assert.equal(wordmark.text.replace(/\s/g,''),'눈떠보니한국사');assert.equal(wordmark.coral,'rgb(233, 81, 59)');assert(wordmark.navy!=='rgb(233, 81, 59)');assert(wordmark.family.toLowerCase().includes('pretendard'));
    assert.equal(await page.locator('.hv-date').count(),0,'legacy date is removed');
    const metrics=page.locator('.hv-metric');assert.equal(await metrics.count(),4,'four status cards');
    const boxes=await metrics.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width}}));
    assert(boxes.every((box,index)=>box.left>=0&&box.right<=width&&Math.abs(box.top-boxes[0].top)<1&&Math.abs(box.bottom-boxes[0].bottom)<1),`status row fits ${width}: ${JSON.stringify(boxes)}`);
    assert.equal(await page.locator('.hv-metric-exam b').innerText(),'D-14');assert.equal(await page.locator('.hv-metric-streak b').innerText(),'2일');assert.equal(await page.locator('.hv-metric-today b').innerText(),'2문항');assert.equal(await page.locator('.hv-metric-accuracy b').innerText(),'67%');
    const nextDate=await page.evaluate(()=>{const d=new Date();d.setDate(d.getDate()+15);return[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')});
    await page.locator('[data-hv-exam-date]').fill(nextDate);await page.waitForFunction(value=>meta().examTargetDate===value,nextDate);assert.equal(await page.locator('.hv-metric-exam b').innerText(),'D-15');await page.locator('.toast').waitFor({state:'detached'});
    const banner=page.locator('.hv-cheer-banner');assert.equal(await banner.locator('p').innerText(),'오늘도 한 장면, 한 문제씩 이어가요.');assert((await banner.boundingBox()).height<=80);assert.equal(await banner.locator('img').count(),0,'encouragement banner is text-only');
    const metricIcon=await page.locator('.hv-metric-art').first().boundingBox();assert(metricIcon.width<=30&&metricIcon.height<=30,`status icons stay compact at ${width}`);
    assert.equal(await page.locator('.hv-list .hv-row').count(),3,'three practical learning cards');assert.equal(await page.locator('.hv-list .hv-row-text b').allInnerTexts().then(rows=>rows.join('|')),'기출문제|OX 퀴즈|오답노트');
    const clipped=await page.locator('.hv-brand,.hv-metric,.hv-row-text,.hv-cheer-banner p').evaluateAll(nodes=>nodes.filter(node=>node.scrollWidth>node.clientWidth+1).map(node=>node.textContent.trim()));assert.deepEqual(clipped,[],`home text is not horizontally clipped at ${width}`);
    const nav=page.locator('nav.app-navigation');assert.equal(await nav.locator('button').count(),5);const fab=page.locator('.jk-fab');await fab.waitFor();const fabGeometry=await page.evaluate(()=>{const fab=document.querySelector('.jk-fab').getBoundingClientRect(),nav=document.querySelector('nav.app-navigation').getBoundingClientRect();return{right:innerWidth-fab.right,bottom:innerHeight-fab.bottom,clearance:nav.top-fab.bottom}});assert(fabGeometry.right>=15&&fabGeometry.clearance>=8,`FAB clears bottom nav ${width}`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`no document overflow ${width}`);
    await page.screenshot({path:path.join(output,`home-${width}.png`),fullPage:true,animations:'disabled'});
    await page.locator('.hv-era-hit').first().click();await page.locator('.r7-era-view').waitFor();await page.waitForFunction(()=>Date.now()>=inputLockedUntil);await page.locator('nav [data-nav="home"]').click();await page.locator('.hv').waitFor();
    await page.waitForFunction(()=>Date.now()>=inputLockedUntil);await page.locator('.hv-row-exam').click();await page.locator('.r7-exam-home').waitFor();await page.waitForFunction(()=>Date.now()>=inputLockedUntil);await page.locator('nav [data-nav="home"]').click();await page.locator('.hv').waitFor();
    await page.waitForFunction(()=>Date.now()>=inputLockedUntil);await page.locator('.jk-fab').click();await page.locator('.jk-fullscreen-shell').waitFor();await page.locator('[data-jk-back="origin"]').click();await page.locator('.hv').waitFor();
    assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: home v6 data, 4-up status row, story/practice/FAB navigation, banner and responsive layout at 360/390/430px.');
}finally{await browser?.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1});

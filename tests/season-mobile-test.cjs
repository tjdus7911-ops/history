const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert'),{chromium}=require('playwright');
const root=path.resolve('dist'),server=http.createServer((req,res)=>{const pathname=req.url.split('?')[0],file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))return res.end();fs.readFile(file,(error,body)=>{if(error){res.statusCode=404;return res.end()}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream');res.end(body)})});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 for(const width of [360,390,412]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();
  const errors=[],requests=[];page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>requests.push(request.url()));
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForTimeout(150);
  /* --- rail structure: seven era cards, current era first, next card peeks --- */
  assert.equal(await page.locator('.hv-rail .hv-rail-item').count(),7,`seven era cards ${width}`);assert.equal(await page.locator('.hv-dots i').count(),7,`seven pagination dots ${width}`);
  assert.equal(await page.locator('.hv-rail-item:first-child .hv-era.is-current').count(),1,'current era leads the rail');assert.equal(await page.locator('.hv-dots i.on').count(),1);assert.equal(await page.locator('.hv-dots i').first().getAttribute('class'),'on');
  assert.equal(await page.locator('.hv-card-art[fetchpriority="high"]').count(),1,'only the leading card art is high priority');assert.equal(await page.locator('.hv-card-art[loading="lazy"]').count()>=1,true,'remaining card art must be lazy');
  const geometry=await page.evaluate(()=>{const items=[...document.querySelectorAll('.hv-rail-item')].map(i=>i.getBoundingClientRect());return {firstLeft:items[0].left,firstRight:items[0].right,secondLeft:items[1].left,secondRight:items[1].right,width:items[0].width,height:items[0].height,innerWidth}});
  assert(geometry.firstLeft>=0&&geometry.firstRight<=geometry.innerWidth,`first card fits ${width}: ${JSON.stringify(geometry)}`);assert(geometry.secondLeft<geometry.innerWidth&&geometry.secondRight>geometry.innerWidth,`next card must peek to hint horizontal swipe ${width}: ${JSON.stringify(geometry)}`);assert(geometry.height>=280,`portrait card keeps about one and a half illustrations of height ${width}`);
  /* --- per-card state: playable eras carry an action, unfinished eras are disabled --- */
  const cards=await page.evaluate(()=>[...document.querySelectorAll('.hv-rail-item .hv-era')].map(card=>({title:card.querySelector('.hv-era-title').textContent,soon:card.classList.contains('is-soon'),disabled:card.querySelector('.hv-era-btn').disabled,open:card.querySelector('[data-era-open]')?.dataset.eraOpen||null,resume:card.querySelector('[data-era-resume]')?.dataset.eraResume||null})));
  assert.equal(cards.length,7);assert(cards.every(card=>card.title.startsWith('눈떠보니 ')));assert(cards.every(card=>card.soon===card.disabled&&card.disabled===!(card.open||card.resume)),`only playable cards expose an action ${JSON.stringify(cards)}`);
  for(const id of ['proto-kingdoms','goryeo','joseon'])assert.equal(cards.filter(card=>card.open===id||card.resume===id).length,1,`${id} card must exist exactly once`);
  /* --- horizontal swipe with real touch events moves the rail and the dots --- */
  const cdp=await context.newCDPSession(page),railBox=await page.locator('.hv-rail').boundingBox(),y=railBox.y+150;
  const touch=(type,x)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
  await touch('touchStart',width-40);for(const x of [width-90,width-150,width-210,width-260])await touch('touchMove',x);await touch('touchEnd');await page.waitForTimeout(600);
  assert((await page.locator('.hv-rail').evaluate(rail=>rail.scrollLeft))>40,`swipe must scroll the rail ${width}`);assert.equal(await page.locator('.hv-dots i').first().getAttribute('class'),'',`first dot released after swipe ${width}`);assert.equal(await page.locator('.hv-dots i.on').count(),1);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`swiping must not scroll the whole page ${width}`);
  await page.locator('.hv-rail').evaluate(rail=>rail.scrollTo({left:rail.scrollWidth,behavior:'instant'}));await page.waitForTimeout(400);assert.equal(await page.locator('.hv-dots i').last().getAttribute('class'),'on','last dot follows the last card');
  await page.locator('.hv-rail').evaluate(rail=>rail.scrollTo({left:0,behavior:'instant'}));await page.waitForTimeout(400);assert.equal(await page.locator('.hv-dots i').first().getAttribute('class'),'on','dots return to the first card');
  /* --- button actions open each playable era and the back button returns home --- */
  fs.mkdirSync('tmp/season-mobile',{recursive:true});await page.screenshot({path:`tmp/season-mobile/home-rail-${width}.png`});
  const expected={'proto-kingdoms':{rows:5,art:'media/proto-v4/proto-thumbnail-back-view-v1.jpg'},goryeo:{rows:12,art:'heroes/goryeo.webp'},joseon:{rows:23,art:'heroes/joseon.webp'}};
  for(const [id,info] of Object.entries(expected)){
   const button=page.locator(`.hv-era-btn[data-era-open="${id}"],.hv-era-btn[data-era-resume="${id}"]`);assert.equal(await button.count(),1,`${id} button`);
   await button.scrollIntoViewIfNeeded();await page.locator('.hv-rail').evaluate((rail,eraId)=>{const target=rail.querySelector(`[data-era-open="${eraId}"],[data-era-resume="${eraId}"]`).closest('.hv-rail-item');rail.scrollTo({left:target.offsetLeft-20,behavior:'instant'})},id);await page.waitForTimeout(300);
   assert((await button.boundingBox()).height>=36,`${id} action target is at least 36px tall`);await button.click();
   assert.equal(await page.locator('.ed-chapter-row').count(),info.rows,`${id} chapter list ${width}`);assert.equal(await page.locator(`.era-detail-hero img[src*="${info.art}"]`).count(),1,`${id} hero art`);
   await page.locator('.era-back').click();await page.waitForTimeout(150);assert.equal(await page.locator('.hv-rail').count(),1,`${id} back returns to the home rail`);
  }
  /* --- "시대 전체" sheet lists all seasons and closes --- */
  await page.locator('[data-hv-sheet="seasons"]').click();assert.equal(await page.locator('.hv-sheet .hv-season').count(),7,'season sheet lists seven seasons');assert.equal(await page.locator('.hv-sheet .hv-season:disabled').count()>=1,true,'unavailable seasons are disabled');await page.screenshot({path:`tmp/season-mobile/season-sheet-${width}.png`});await page.locator('.hv-x').click();assert.equal(await page.locator('.hv-sheet').count(),0,'sheet closes');
  /* --- no eager expression-asset loading, no overflow, no errors --- */
  assert(!requests.some(url=>url.includes('/assets/joseon/protagonist/')),'home/detail must not eagerly load Joseon expression assets');assert(!requests.some(url=>url.includes('/assets/characters/player_goryeo_')),'season browsing must not eagerly load Goryeo expression assets');assert(!requests.some(url=>url.includes('/assets/ancient/characters/')),'season browsing must not eagerly load ancient expression assets');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`horizontal overflow ${width}`);assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: seven-card era rail (peeking next card, swipe + dots, lazy art), per-era actions and detail screens, season sheet, intact Goryeo/Joseon/ancient detail and lazy character assets fit 360/390/412px.');
}finally{if(browser)await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});

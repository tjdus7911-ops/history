const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');

const root=path.resolve('dist'),shots=path.resolve('tmp/proto-character-layout');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((request,response)=>{
  const pathname=decodeURIComponent(request.url.split('?')[0]),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){response.writeHead(403);return response.end();}
  fs.readFile(file,(error,buffer)=>{if(error){response.writeHead(404);return response.end();}response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');response.end(buffer);});
});

async function render(page,cursor){
  await page.evaluate(value=>{
    state.run=INITIAL_RUN('proto-ch01');state.run.started=true;state.run.storyId='proto_ch01_s1';state.run.dialogueSceneId='proto_ch01_s1';state.run.dialogueCursor=value;screen='game';render();
  },cursor);
  await page.locator('.stage-character').first().waitFor({state:'visible'});
  await page.locator('.stage-character').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
}

async function portraitMetrics(page){
  return page.locator('.stage-character').evaluateAll(images=>images.map(image=>{
    const rect=image.getBoundingClientRect(),style=getComputedStyle(image);
    return{id:image.dataset.characterId,position:image.dataset.position,facing:image.dataset.characterFacing,scale:style.getPropertyValue('--character-scale'),rect:{top:rect.top,left:rect.left,width:rect.width,height:rect.height}};
  }));
}

(async()=>{let browser;try{
  fs.mkdirSync(shots,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const [width,height] of [[390,844],[412,915]]){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'domcontentloaded'});

    await render(page,3);
    assert.deepEqual(await page.locator('.stage-character').evaluateAll(images=>images.map(image=>image.dataset.characterId)),['proto_modern'],`${width}: first visible monologue is not protagonist-only`);
    let metrics=await portraitMetrics(page);
    assert.equal(metrics[0].position,'right');assert.equal(metrics[0].facing,'left');assert.equal(metrics[0].scale,'1');
    assert(metrics[0].rect.height>=455&&metrics[0].rect.height<=457,`${width}: Rev.4 portrait container height ${metrics[0].rect.height}`);
    assert(await page.locator('.conversation-game').evaluate(element=>getComputedStyle(element).overflowX!=='visible'||document.documentElement.scrollWidth<=innerWidth+1));
    await render(page,4);
    assert.equal(await page.locator('.stage-character').count(),1,`${width}: left character returned before the NPC entrance`);
    await page.screenshot({path:path.join(shots,`opening-solo-${width}.png`),fullPage:true});
    await render(page,5);
    metrics=await portraitMetrics(page);
    assert.deepEqual(metrics.map(item=>[item.id,item.position,item.facing]),[['proto_naru','left','right'],['proto_modern','right','left']],`${width}: first conversation staging`);
    assert(metrics.every(item=>item.scale==='1'),'Proto cast does not share the Rev.4 portrait scale');
    assert(Math.max(...metrics.map(item=>item.rect.height))-Math.min(...metrics.map(item=>item.rect.height))<1,'Proto cast heights vary in the same scene');
    const faceBottom=Math.max(...metrics.map(item=>item.rect.top+item.rect.height*.3)),bubbleTop=await page.locator('.speech-bubble:visible').evaluateAll(elements=>Math.min(...elements.map(element=>element.getBoundingClientRect().top)));
    assert(bubbleTop>faceBottom,`${width}: dialogue overlaps the portrait face zone (${bubbleTop}/${faceBottom})`);
    const layers=await page.evaluate(()=>({stage:Number(getComputedStyle(document.querySelector('.character-stage')).zIndex),panel:Number(getComputedStyle(document.querySelector('.conversation-panel')).zIndex),overflow:document.documentElement.scrollWidth-innerWidth}));
    assert(layers.panel>layers.stage,`${width}: dialogue/buttons do not remain above the portrait layer`);assert(layers.overflow<=1,`${width}: horizontal overflow ${layers.overflow}`);
    const dialogueOverflow=await page.locator('.dialogue-log').evaluate(element=>({overflowX:getComputedStyle(element).overflowX,scrollWidth:element.scrollWidth,clientWidth:element.clientWidth}));
    assert.equal(dialogueOverflow.overflowX,'hidden',`${width}: dialogue log can expose a horizontal scrollbar`);
    assert(dialogueOverflow.scrollWidth<=dialogueOverflow.clientWidth+1,`${width}: dialogue content exceeds its padded viewport ${JSON.stringify(dialogueOverflow)}`);
    await page.screenshot({path:path.join(shots,`first-npc-${width}.png`),fullPage:true});
    if(width===390){
      await page.evaluate(()=>{state=INITIAL();state.run.started=true;state.run.currentChapter='ch01';state.run.storyId='house';state.run.dialogueSceneId='house';state.run.dialogueCursor=2;screen='game';render();});
      await page.locator('.stage-character').first().waitFor({state:'visible'});await page.locator('.stage-character').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
      const goryeoHeight=Math.max(...(await portraitMetrics(page)).map(item=>item.rect.height)),protoHeight=metrics[0].rect.height;
      assert(Math.abs(protoHeight-goryeoHeight)<=12,`Proto ${protoHeight}px and Goryeo ${goryeoHeight}px visible portrait heights diverge`);
      await page.screenshot({path:path.join(shots,'goryeo-reference-390.png'),fullPage:true});
    }
    assert.deepEqual(errors,[]);await context.close();
  }
  console.log('PASS: Proto and Goryeo share the 250x456 Rev.4 portrait rule; the opening monologue is protagonist-only and Naru enters on the first NPC line at 390/412px.');
}finally{if(browser)await browser.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1;});

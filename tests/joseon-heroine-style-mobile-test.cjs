const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const{chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist'),shots=path.resolve(__dirname,'../tmp/joseon-heroine-style');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{const relative=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,buffer)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(buffer)})});
let browser;

async function main(){
  fs.mkdirSync(shots,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const profile=await browser.newContext({viewport:{width:390,height:910},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await profile.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(`http://127.0.0.1:${server.address().port}/`);assert.equal(await page.evaluate(()=>devicePixelRatio),3);
  const expressions=['neutral','smile','laugh','surprised','shock','worried','fear','sad','crying','angry','determined','thinking','confused','relieved','tired'];
  const measurements=[];
  for(const expression of expressions){
    await page.evaluate(expression=>{
      const source=STORIES.joseon_ch00_s3,line=source.dialogues[1];source.dialogues[1]=dialogueLine('joseon_player',expression,line.dialogue,'player');
      state.run=INITIAL_RUN('joseon-ch00');state.run.started=true;state.run.storyId=source.sceneId;state.run.dialogueSceneId=source.sceneId;state.run.dialogueCursor=2;screen='game';render();
    },expression);
    const image=page.locator('.stage-character[data-character-id="joseon_player"]');await image.waitFor({state:'visible'});await image.evaluate(element=>element.decode());
    const result=await image.evaluate(element=>{const rect=element.getBoundingClientRect(),style=getComputedStyle(element),canvas=document.createElement('canvas');canvas.width=element.naturalWidth;canvas.height=element.naturalHeight;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(element,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data,cornerAlpha=[pixels[3],pixels[(canvas.width-1)*4+3],pixels[((canvas.height-1)*canvas.width)*4+3],pixels[(canvas.width*canvas.height-1)*4+3]];return{src:element.getAttribute('src'),natural:[element.naturalWidth,element.naturalHeight],rendered:[rect.width,rect.height],scale:style.getPropertyValue('--character-scale'),anchorX:style.getPropertyValue('--character-anchor-x'),anchorY:style.getPropertyValue('--character-anchor-y'),framing:element.dataset.characterFraming,cornerAlpha}});
    assert(result.src.includes(expression==='neutral'?'joseon-neutral.webp':`/${expression}.webp`),`${expression} mapped portrait`);assert.deepEqual(result.natural,[1280,1920],`${expression} high-resolution source`);assert.equal(result.scale,'1.73');assert.equal(result.anchorX,'6%');assert.equal(result.anchorY,'17%');assert.equal(result.framing,'upper-body');assert(result.natural[0]/result.rendered[0]>=2,`${expression} DPR coverage`);assert(result.cornerAlpha.every(value=>value===0),`${expression} true transparent corners`);
    measurements.push({expression,...result});await page.screenshot({path:path.join(shots,`joseon-${expression}-390-dpr3.png`),fullPage:true});
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(shots,'qa.json'),JSON.stringify(measurements,null,2));await profile.close();
  console.log(`PASS: Joseon heroine ${expressions.length} expressions rendered in Story at 390x910 DPR 3; fixed scale/anchors, transparent alpha and >=2x source coverage. Screenshots: ${shots}`);
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});

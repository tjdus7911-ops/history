/* Real browser QA, isolated profile; run after browser execution is allowed. */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist');
const server=http.createServer((req,res)=>{const relative=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,buffer)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webmanifest':'application/manifest+json'})[path.extname(file)]||'application/octet-stream');res.end(buffer)})});
let browser;
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const width of [375,390,430]){
    const profile=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await profile.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.evaluate(()=>{state=INITIAL();finishChapter(state);startChapter(state,'ch02');finishChapter(state);startChapter(state,'ch03');play()});
    const tap=async selector=>{await page.evaluate(()=>{inputLockedUntil=0});await page.locator(selector).first().click()};
    let guard=0,spokenFrames=0;
    const partners=new Set();
    while(!(await page.evaluate(()=>run().completed))){
      if(++guard>500)throw Error('CH.03 mobile guard');
      const current=await page.evaluate(()=>{const r=run(),source=STORIES[r.pending?.sourceSceneId||r.storyId],entries=conversationEntries(source,r.pending),prefix=entries.slice(0,r.dialogueCursor||1);return{screen,id:source.sceneId,line:prefix.at(-1),hasPartner:entries.some(l=>l.speakerType==='npc')||Boolean(r.pending&&source.dialogues.some(l=>l.speakerType==='npc')),cinematic:source.sceneEffect==='blackout',questionId:r.activeQuestionId,pending:Boolean(r.pending),cast:playerPartnerCast(prefix,source,r.pending).map(e=>e.characterId)}});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow: ${width}, ${current.id}`);
      if(current.screen==='quiz'){const answer=await page.evaluate(()=>activeQuestion().answer);await tap(`[data-answer="${answer}"]`);await tap('[data-action="quiz-next"]');continue}
      const stage=page.locator('.stage-character');
      if(!current.cinematic&&current.cast.length){
        const hasPartner=current.cast.length===2,hasActive=current.cast.includes(current.line.characterId);assert.equal(await stage.count(),current.cast.length,`${current.id}: exactly two slots`);
        assert(current.cast.every(id=>['player','doyun','hyunwoo'].includes(id)));
        if(current.cast.includes('player'))assert.equal(await page.locator('[data-character-id="player"][data-position="right"]').count(),1);
        else{assert.equal(await page.locator('[data-character-id="doyun"][data-position="left"]').count(),1);assert.equal(await page.locator('[data-character-id="hyunwoo"][data-position="right"]').count(),1);}
        assert.equal(await page.locator('.stage-left:not([data-character-id="player"])').count(),hasPartner?1:0);
        assert.equal(await page.locator('.stage-character.active').count(),hasActive?1:0);
        assert.equal(await page.locator(`.stage-character.active[data-character-id="${current.line.characterId}"]`).count(),hasActive?1:0);
        assert.equal(await page.locator('.stage-character.listening').count(),current.cast.length-(hasActive?1:0));
        await stage.first().evaluate(()=>Promise.all([...document.querySelectorAll('.stage-character')].map(img=>img.decode())));
        assert(await stage.evaluateAll(images=>images.every(img=>img.naturalWidth>0&&img.naturalHeight>0)));
        if(hasActive)assert.equal(await page.locator('.stage-character.active').evaluate(el=>getComputedStyle(el).opacity),'1');
        if(await page.locator('.stage-character.listening').count())assert(Number(await page.locator('.stage-character.listening').first().evaluate(el=>getComputedStyle(el).opacity))<1);
        if(hasPartner)partners.add(await page.locator('.stage-left').getAttribute('data-character-id'));spokenFrames++;
        if(process.env.TEST_ARTIFACT_DIR&&width===390&&['ch02_trust','ch02_three_way','ch02_dispute','ch02_exam_eve'].includes(current.id)){fs.mkdirSync(process.env.TEST_ARTIFACT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.TEST_ARTIFACT_DIR,`ch03-${current.id}-${spokenFrames}.png`),fullPage:true})}
      }else assert.equal(await stage.count(),0);
      if(await page.locator('[data-action="advance-dialogue"]').count())await tap('[data-action="advance-dialogue"]');
      else if(current.cinematic&&await page.locator('.cinematic-wait').count())await page.waitForTimeout(100);
      else if(current.pending)await tap('[data-action="result-next"]');
      else if(await page.locator('[data-choice]').count())await tap('[data-choice="0"]');
      else await tap('[data-action="next"]');
    }
    assert(partners.has('doyun')&&[...partners].every(id=>['doyun','hyunwoo'].includes(id)));
    assert.equal(await page.evaluate(()=>Object.keys(run().questionResults).length),17);
    await tap('[data-nav="teaser"]');assert(await page.getByText('CH.04 시작하기',{exact:true}).count());
    assert.deepEqual(errors,[]);console.log(`PASS: CH.03 ${width}px full play, ${spokenFrames} spoken frames, two slots, emphasis, image decode, no overflow and CH.04 unlock.`);await profile.close();
  }
}
main().then(async()=>{await browser.close();server.close()}).catch(async error=>{console.error(error);if(browser)await browser.close();server.close();process.exitCode=1});

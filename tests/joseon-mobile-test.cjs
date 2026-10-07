const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const{chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist'),shots=path.resolve(__dirname,'../tmp/joseon-mobile');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{const relative=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,buffer)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(buffer)})});
let browser;

async function main(){
  fs.mkdirSync(shots,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const profile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await profile.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const fit=async label=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`horizontal overflow: ${label}`);
  const tap=async selector=>{const target=page.locator(selector).first();await target.waitFor({state:'attached'});await target.evaluate(element=>element.click());await page.evaluate(()=>{inputLockedUntil=0})};

  const qaPage=await profile.newPage();await qaPage.setViewportSize({width:390,height:910});await qaPage.goto(`http://127.0.0.1:${server.address().port}/`);
  const showQaScene=async(chapter,story,cursor,file)=>{
    await qaPage.evaluate(({chapter,story,cursor})=>{state.run=INITIAL_RUN(chapter);state.run.started=true;state.run.storyId=story;state.run.dialogueCursor=cursor;screen='game';render()},{chapter,story,cursor});
    await qaPage.locator('.stage-character').first().waitFor({state:'visible',timeout:5000});await Promise.all((await qaPage.locator('.stage-character').all()).map(item=>item.evaluate(image=>image.decode())));
    const result=await qaPage.locator('.stage-character').evaluateAll(images=>images.map(image=>{const rect=image.getBoundingClientRect(),stageRect=image.parentElement.getBoundingClientRect(),style=getComputedStyle(image),canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;let minX=canvas.width,minY=canvas.height,maxX=0,maxY=0;for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>16){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}const visual={left:rect.left+minX/canvas.width*rect.width,top:rect.top+minY/canvas.height*rect.height,right:rect.left+(maxX+1)/canvas.width*rect.width,bottom:rect.top+(maxY+1)/canvas.height*rect.height};visual.width=visual.right-visual.left;visual.height=visual.bottom-visual.top;const visible={left:Math.max(visual.left,stageRect.left),top:Math.max(visual.top,stageRect.top),right:Math.min(visual.right,stageRect.right),bottom:Math.min(visual.bottom,stageRect.bottom)};visible.width=Math.max(0,visible.right-visible.left);visible.height=Math.max(0,visible.bottom-visible.top);return{id:image.dataset.characterId,position:image.dataset.position,framing:image.dataset.characterFraming,active:image.classList.contains('active'),scale:style.getPropertyValue('--character-scale'),activeScale:style.getPropertyValue('--character-scale-active'),listeningScale:style.getPropertyValue('--character-scale-listening'),rect:{left:rect.left,right:rect.right,top:rect.top,height:rect.height,bottom:rect.bottom},stage:{top:stageRect.top,bottom:stageRect.bottom},visual,visible,sourceVisibleRatio:visible.height/visual.height,bottom:style.bottom,objectFit:style.objectFit,objectPosition:style.objectPosition,transformOrigin:style.transformOrigin,opacity:Number(style.opacity)}}));
    const panelTop=await qaPage.locator('.conversation-panel').evaluate(element=>element.getBoundingClientRect().top);await qaPage.screenshot({path:path.join(shots,file),fullPage:true});return{characters:result,panelTop};
  };
  const goryeoQa=await showQaScene('ch01','house',1,'goryeo-character-reference-390.png');
  const joseonQa=await showQaScene('joseon-ch00','joseon_ch00_s3',2,'joseon-character-normalized-390.png');
  const goryeoDoyun=goryeoQa.characters.find(character=>character.id==='doyun'),goryeoPlayer=goryeoQa.characters.find(character=>character.id==='player'),joseonPlayer=joseonQa.characters.find(character=>character.id==='joseon_player'),minjun=joseonQa.characters.find(character=>character.id==='minjun_j');
  const originY=character=>Number(character.transformOrigin.split(' ')[1].replace('px',''));
  assert.equal(goryeoDoyun.scale,'1');assert.equal(goryeoDoyun.activeScale,'1.025');assert.equal(goryeoDoyun.listeningScale,'0.98');assert.equal(goryeoDoyun.framing,'full-body');assert(Math.abs(originY(goryeoDoyun)-goryeoDoyun.rect.height/Number(goryeoDoyun.activeScale))<1);assert.equal(goryeoDoyun.objectPosition,'50% 100%');
  assert.equal(joseonPlayer.scale,'1.5');assert.equal(minjun.scale,'1.55');for(const character of joseonQa.characters){assert.equal(character.activeScale,character.scale);assert.equal(character.listeningScale,character.scale);assert.equal(character.framing,'upper-body');assert(originY(character)<1);assert.equal(character.objectPosition,'50% 0%')}
  assert.equal(joseonPlayer.position,'right');assert.equal(minjun.position,'left');assert(joseonPlayer.active);assert(!minjun.active);assert(joseonPlayer.opacity>minjun.opacity);
  assert.equal(joseonPlayer.bottom,'0px');assert.equal(minjun.bottom,'0px');
  assert.equal(joseonPlayer.objectFit,'contain');
  assert(Math.abs(joseonPlayer.visual.top-goryeoPlayer.visual.top)<35,'heroine head line must track Goryeo player');assert(Math.abs(minjun.visual.top-goryeoDoyun.visual.top)<35,'Minjun head line must track Goryeo NPC');
  for(const character of joseonQa.characters){assert(character.visual.top>=-1,`${character.id} head clipping`);assert(character.visual.bottom>character.stage.bottom+100,`${character.id} lower body must extend into crop`);assert(character.visible.bottom<=character.stage.bottom+1,`${character.id} lower-body crop boundary`);assert(character.sourceVisibleRatio>.55&&character.sourceVisibleRatio<.8,`${character.id} source-visible ratio ${character.sourceVisibleRatio}`);assert(character.visual.top<joseonQa.panelTop-90,`${character.id} face must remain above dialogue panel`)}
  const expectedProfileScales={joseon_player:1.5,minjun_j:1.55,minjun_elder_j:1.48,joseon_scholar:1.52,joseon_soldier:1.38,joseon_naval:1.32,joseon_woman:1.45};
  const profiles=await qaPage.evaluate(()=>Object.fromEntries(Object.keys(JOSEON_CHARACTER_RENDER_PROFILES).map(id=>{const profile=characterRenderProfile({characterId:id},id==='joseon_player'?'joseon_player_neutral':`${id}_neutral`);return[id,{scale:profile.scale,anchorY:profile.anchorY,framing:profile.framing,lockStateScale:profile.lockStateScale}]})));for(const [id,scale] of Object.entries(expectedProfileScales)){assert.equal(profiles[id].scale,scale,`${id} mobile profile`);assert.equal(profiles[id].framing,'upper-body');assert(profiles[id].lockStateScale)}
  const heroineExpressionProfiles=await qaPage.evaluate(()=>Object.fromEntries(ERA_PROTAGONISTS.protagonist_joseon.expressions.map(expression=>{const profile=characterRenderProfile({characterId:'joseon_player'},`joseon_player_${expression}`);return[expression,{scale:profile.scale,anchorY:profile.anchorY,framing:profile.framing,lockStateScale:profile.lockStateScale}]})));for(const profile of Object.values(heroineExpressionProfiles))assert.deepEqual(profile,{scale:1.5,anchorY:-4,framing:'upper-body',lockStateScale:true});
  await qaPage.close();

  await tap('[data-era-open="joseon"]');
  assert.equal(await page.locator('.ed-chapter-row').count(),23);
  await fit('Joseon chapter list');
  await page.screenshot({path:path.join(shots,'chapter-list-390.png'),fullPage:true});
  await tap('[data-era-resume="joseon"]');
  assert.equal(await page.evaluate(()=>run().currentChapter),'joseon-ch00');

  const completed=[],seen=new Set();let guard=0,reloaded=false,decodedImages=0,wrongId=null;
  while(completed.length<23){
    assert(++guard<5000,`mobile guard ${JSON.stringify(await page.evaluate(()=>({screen,chapter:run().currentChapter,story:run().storyId,question:run().activeQuestionId,cursor:run().dialogueCursor})))}`);
    const now=await page.evaluate(()=>({screen,chapter:run().currentChapter,story:run().storyId,pending:Boolean(run().pending),cursor:run().dialogueCursor,length:run().pending?conversationEntries(STORIES[run().pending.sourceSceneId],run().pending).length:conversationEntries(STORIES[run().storyId],run().pending).length,answer:run().questionAnswer}));
    const screenKey=`${now.screen}:${now.story}`;
    if(!seen.has(screenKey)){seen.add(screenKey);await fit(screenKey)}
    if(now.screen==='game'){
      if(now.story==='joseon_ch00_s1'&&!seen.has('shot-opening')){seen.add('shot-opening');await page.screenshot({path:path.join(shots,'ch00-opening-390.png'),fullPage:true})}
      if(now.story==='joseon_ch20_s1'&&!seen.has('shot-invasion')){seen.add('shot-invasion');await page.screenshot({path:path.join(shots,'ch20-invasion-390.png'),fullPage:true})}
      if(now.cursor<now.length){await tap('[data-action="advance-dialogue"]');continue}
      if(now.pending){await tap('[data-action="result-next"]');continue}
      if(await page.locator('[data-choice]').count()){await tap('[data-choice="0"]');continue}
      await tap('[data-action="next"]');continue;
    }
    if(now.screen==='quiz'){
      if(now.answer===null){
        const question=await page.evaluate(()=>{const item=activeQuestion();return{id:item.questionId,answer:item.answer,isOfficial:item.isOfficial,chapter:item.chapterId,image:item.sourceQuestionImage,officialQuestionId:item.officialQuestionId}});
        if(question.isOfficial){
          assert.equal(question.id,question.officialQuestionId);
          const image=page.locator('.official-source-question img');assert.equal(await image.count(),1);await image.evaluate(element=>element.decode());assert(await image.evaluate(element=>element.naturalWidth>0&&element.getBoundingClientRect().width<=innerWidth));decodedImages++;
        }
        const shouldMiss=!wrongId&&question.isOfficial&&question.chapter==='joseon-ch12',answer=shouldMiss?(question.answer+1)%5:question.answer;
        if(await page.locator('[data-pick-answer]').count()){await tap(`[data-pick-answer="${answer}"]`);await tap('[data-submit-answer]')}else await tap(`[data-answer="${answer}"]`);
        if(shouldMiss)wrongId=question.id;
        assert(await page.locator('.feedback').count());continue;
      }
      await tap('[data-action="quiz-next"]');
      if(!reloaded&&now.chapter==='joseon-ch12'){
        const before=await page.evaluate(()=>({chapter:run().currentChapter,story:run().storyId,records:Object.keys(meta().questionRecords).length}));
        reloaded=true;await page.reload();await page.evaluate(()=>playMain());
        const after=await page.evaluate(()=>({chapter:run().currentChapter,story:run().storyId,records:Object.keys(meta().questionRecords).length}));assert.deepEqual(after,before);
      }
      continue;
    }
    if(now.screen==='complete'){
      if(!completed.includes(now.chapter))completed.push(now.chapter);
      if(now.chapter==='joseon-ch22'){assert(await page.getByText('새로운 시대가 다가오고 있습니다.',{exact:false}).count());await page.screenshot({path:path.join(shots,'ch22-complete-390.png'),fullPage:true});break}
      await tap('[data-nav="teaser"]');await tap('[data-action="start-chapter"]');continue;
    }
    throw Error(`unexpected screen ${now.screen}`);
  }

  assert.deepEqual(completed,Array.from({length:23},(_,index)=>`joseon-ch${String(index).padStart(2,'0')}`));
  assert.equal(decodedImages,65);assert(reloaded);assert(wrongId);
  assert.equal(await page.evaluate(()=>meta().completedChapters.filter(id=>chapterEra(id)==='joseon').length),23);
  assert.equal(await page.evaluate(()=>meta().eraProgress.joseon.completed),true);
  assert.equal(await page.evaluate(()=>libraryStatus('joseon')),'UNLOCKED');
  assert.equal(await page.evaluate(id=>meta().wrongAnswers.find(item=>item.questionId===id)?.questionId,wrongId),wrongId);
  for(const width of [375,390,430]){await page.setViewportSize({width,height:844});await fit(`complete-${width}`)}
  assert.deepEqual(errors,[]);
  console.log(`PASS: Joseon CH.00–22 mobile full play, waist-up source-visible ratios heroine ${joseonPlayer.sourceVisibleRatio.toFixed(3)} / Minjun ${minjun.sourceVisibleRatio.toFixed(3)}, 15 expression framing locks, 65 decoded official images, reload/resume, wrong-note linkage, unlock and widths 375–430. Screenshots: ${shots}`);
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});

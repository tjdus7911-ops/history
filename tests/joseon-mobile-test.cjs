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
    await qaPage.locator('.stage-character').first().waitFor({state:'visible',timeout:5000}).catch(error=>{throw Error(`${file} (${chapter}/${story}/${cursor}): ${error.message}`)});await Promise.all((await qaPage.locator('.stage-character').all()).map(item=>item.evaluate(image=>image.decode())));
    const result=await qaPage.locator('.stage-character').evaluateAll(images=>images.map(image=>{
      const rect=image.getBoundingClientRect(),stageRect=image.parentElement.getBoundingClientRect(),style=getComputedStyle(image),canvas=document.createElement('canvas'),width=image.naturalWidth,height=image.naturalHeight;
      canvas.width=width;canvas.height=height;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);const pixels=context.getImageData(0,0,width,height).data;
      let minX=width,minY=height,maxX=0,maxY=0;for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(pixels[(y*width+x)*4+3]>16){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}
      const headRatio=image.dataset.characterFraming==='upper-body'?.2:.3,headEnd=Math.ceil(minY+(maxY-minY)*headRatio);let headMinX=width,headMinY=height,headMaxX=0,headMaxY=0;for(let y=minY;y<=headEnd;y++)for(let x=minX;x<=maxX;x++)if(pixels[(y*width+x)*4+3]>16){headMinX=Math.min(headMinX,x);headMinY=Math.min(headMinY,y);headMaxX=Math.max(headMaxX,x);headMaxY=Math.max(headMaxY,y)}
      const fit=Math.min(rect.width/width,rect.height/height),fitWidth=width*fit,fitHeight=height*fit,offsetX=rect.left+(rect.width-fitWidth)/2,offsetY=style.objectPosition.endsWith('100%')?rect.bottom-fitHeight:rect.top,project=box=>{const result={left:offsetX+box.left*fit,top:offsetY+box.top*fit,right:offsetX+box.right*fit,bottom:offsetY+box.bottom*fit};result.width=result.right-result.left;result.height=result.bottom-result.top;result.centerX=(result.left+result.right)/2;result.centerY=(result.top+result.bottom)/2;return result};
      const visual=project({left:minX,top:minY,right:maxX+1,bottom:maxY+1}),visible={left:Math.max(visual.left,stageRect.left),top:Math.max(visual.top,stageRect.top),right:Math.min(visual.right,stageRect.right),bottom:Math.min(visual.bottom,stageRect.bottom)};visible.width=Math.max(0,visible.right-visible.left);visible.height=Math.max(0,visible.bottom-visible.top);
      return{id:image.dataset.characterId,position:image.dataset.position,framing:image.dataset.characterFraming,active:image.classList.contains('active'),scale:style.getPropertyValue('--character-scale'),activeScale:style.getPropertyValue('--character-scale-active'),listeningScale:style.getPropertyValue('--character-scale-listening'),natural:{width,height},rect:{left:rect.left,right:rect.right,top:rect.top,height:rect.height,bottom:rect.bottom},stage:{top:stageRect.top,bottom:stageRect.bottom},visual,visible,head:project({left:headMinX,top:headMinY,right:headMaxX+1,bottom:headMaxY+1}),sourceVisibleRatio:visible.height/visual.height,bottom:style.bottom,objectFit:style.objectFit,objectPosition:style.objectPosition,transformOrigin:style.transformOrigin,opacity:Number(style.opacity)}
    }));
    const panelTop=await qaPage.locator('.conversation-panel').evaluate(element=>element.getBoundingClientRect().top);await qaPage.screenshot({path:path.join(shots,file),fullPage:true});return{characters:result,panelTop};
  };
  const goryeoQa=await showQaScene('ch01','house',1,'goryeo-character-reference-390.png');
  const joseonQa=await showQaScene('joseon-ch00','joseon_ch00_s3',2,'joseon-goryeo-matched-390.png');
  const goryeoDoyun=goryeoQa.characters.find(character=>character.id==='doyun'),goryeoPlayer=goryeoQa.characters.find(character=>character.id==='player'),joseonPlayer=joseonQa.characters.find(character=>character.id==='joseon_player'),minjun=joseonQa.characters.find(character=>character.id==='minjun_j');
  const originY=character=>Number(character.transformOrigin.split(' ')[1].replace('px',''));
  assert.equal(goryeoDoyun.scale,'1');assert.equal(goryeoDoyun.activeScale,'1.025');assert.equal(goryeoDoyun.listeningScale,'0.98');assert.equal(goryeoDoyun.framing,'full-body');assert(Math.abs(originY(goryeoDoyun)-goryeoDoyun.rect.height/Number(goryeoDoyun.activeScale))<1);assert.equal(goryeoDoyun.objectPosition,'50% 100%');
  assert.equal(joseonPlayer.scale,'1.73');assert.equal(minjun.scale,'1.92');for(const character of joseonQa.characters){assert.equal(character.activeScale,character.scale);assert.equal(character.listeningScale,character.scale);assert.equal(character.framing,'upper-body');assert(originY(character)<1);assert.equal(character.objectPosition,'50% 0%')}
  assert.equal(joseonPlayer.position,'right');assert.equal(minjun.position,'left');assert(joseonPlayer.active);assert(!minjun.active);assert(joseonPlayer.opacity>minjun.opacity);
  assert.equal(joseonPlayer.bottom,'0px');assert.equal(minjun.bottom,'0px');
  assert.equal(joseonPlayer.objectFit,'contain');
  const heroineHeadLift=goryeoPlayer.head.top-joseonPlayer.head.top,minjunHeadLift=goryeoDoyun.head.top-minjun.head.top;
  assert(heroineHeadLift>10&&heroineHeadLift<22,`heroine head lift ${heroineHeadLift}`);assert(minjunHeadLift>10&&minjunHeadLift<22,`Minjun head lift ${minjunHeadLift}`);
  assert(Math.abs(joseonPlayer.head.width/goryeoPlayer.head.width-1)<.2,'heroine head size must match Goryeo player');assert(Math.abs(minjun.head.width/goryeoDoyun.head.width-1)<.2,'Minjun head size must match Goryeo NPC');
  assert(Math.abs(joseonPlayer.head.centerX-goryeoPlayer.head.centerX)<15,'heroine head center must match Goryeo player');assert(Math.abs(minjun.head.centerX-goryeoDoyun.head.centerX)<15,'Minjun head center must match Goryeo NPC');
  const goryeoHeadGap=goryeoPlayer.head.left-goryeoDoyun.head.right,joseonHeadGap=joseonPlayer.head.left-minjun.head.right;assert(Math.abs(joseonHeadGap-goryeoHeadGap)<20,`head gap ${joseonHeadGap} vs ${goryeoHeadGap}`);
  assert(joseonPlayer.visual.width/goryeoPlayer.visual.width>1.3&&joseonPlayer.visual.width/goryeoPlayer.visual.width<1.5,'heroine full-body asset width calibration');assert(minjun.visual.width/goryeoDoyun.visual.width>1.2&&minjun.visual.width/goryeoDoyun.visual.width<1.4,'Minjun full-body asset width calibration');
  assert(Math.abs(joseonPlayer.visible.height/goryeoPlayer.visible.height-1)<.08,'heroine visible body range must match Goryeo player');assert(Math.abs(minjun.visible.height/goryeoDoyun.visible.height-1)<.08,'Minjun visible body range must match Goryeo NPC');
  const goryeoGap=goryeoPlayer.visual.left-goryeoDoyun.visual.right,joseonGap=joseonPlayer.visual.left-minjun.visual.right;assert(Math.abs(joseonGap-goryeoGap)<70,`character gap ${joseonGap} vs ${goryeoGap}`);
  for(const character of joseonQa.characters){assert(character.visual.top>=character.stage.top,`${character.id} head clipping`);assert(character.visual.bottom>character.stage.bottom+80,`${character.id} lower body must extend beyond the portrait viewport`);assert(character.visible.bottom<=character.stage.bottom+1,`${character.id} lower-body crop boundary`);assert(character.visual.top<joseonQa.panelTop-90,`${character.id} face must remain above dialogue panel`)}
  const expectedProfileScales={joseon_player:1.73,minjun_j:1.92,minjun_elder_j:1.82,joseon_scholar:1.87,joseon_soldier:1.7,joseon_naval:1.62,joseon_woman:1.79};
  const profiles=await qaPage.evaluate(()=>Object.fromEntries(Object.keys(JOSEON_CHARACTER_RENDER_PROFILES).map(id=>{const profile=characterRenderProfile({characterId:id},id==='joseon_player'?'joseon_player_neutral':`${id}_neutral`);return[id,{scale:profile.scale,anchorX:profile.anchorX,anchorY:profile.anchorY,framing:profile.framing,lockStateScale:profile.lockStateScale}]})));for(const [id,scale] of Object.entries(expectedProfileScales)){assert.equal(profiles[id].scale,scale,`${id} mobile profile`);assert.equal(profiles[id].anchorX,id==='joseon_player'?6:0,`${id} horizontal profile`);assert.equal(profiles[id].anchorY,id==='joseon_player'?17:14,`${id} vertical profile`);assert.equal(profiles[id].framing,'upper-body');assert(profiles[id].lockStateScale)}
  const heroineExpressionProfiles=await qaPage.evaluate(()=>Object.fromEntries(ERA_PROTAGONISTS.protagonist_joseon.expressions.map(expression=>{const profile=characterRenderProfile({characterId:'joseon_player'},`joseon_player_${expression}`);return[expression,{scale:profile.scale,anchorX:profile.anchorX,anchorY:profile.anchorY,framing:profile.framing,lockStateScale:profile.lockStateScale}]})));for(const profile of Object.values(heroineExpressionProfiles))assert.deepEqual(profile,{scale:1.73,anchorX:6,anchorY:17,framing:'upper-body',lockStateScale:true});
  const npcIds=['minjun_j','minjun_elder_j','joseon_scholar','joseon_soldier','joseon_naval','joseon_woman'];
  const npcScenes=await qaPage.evaluate(ids=>Object.fromEntries(ids.map(id=>{const story=Object.values(STORIES).find(item=>item.eraId==='joseon'&&item.sceneEffect!=='blackout'&&item.dialogues?.at(-1)?.speakerType==='player'&&item.dialogues.some(line=>line.characterId===id));return[id,{chapter:story.chapterId,story:story.sceneId,cursor:story.dialogues.length}]})),npcIds);
  for(const id of npcIds){const sample=npcScenes[id],qa=await showQaScene(sample.chapter,sample.story,sample.cursor,`goryeo-distance-${id}-390.png`),character=qa.characters.find(item=>item.id===id);assert(character,`${id} representative portrait`);assert.equal(character.bottom,'0px');assert.equal(character.framing,'upper-body');assert(character.visual.top>270&&character.visual.top<340,`${id} head zone ${character.visual.top}`);assert(character.visible.height>370&&character.visible.height<460,`${id} visible body range ${character.visible.height}`);assert(character.visual.bottom>character.stage.bottom+70,`${id} lower body outside viewport`);assert(character.visible.width>140,`${id} body presence`)}
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
  console.log(`PASS: Joseon CH.00–22 mobile full play; Goryeo/Joseon LEFT head top ${goryeoDoyun.head.top.toFixed(1)}/${minjun.head.top.toFixed(1)}, width ${goryeoDoyun.head.width.toFixed(1)}/${minjun.head.width.toFixed(1)}, centerX ${goryeoDoyun.head.centerX.toFixed(1)}/${minjun.head.centerX.toFixed(1)}; RIGHT top ${goryeoPlayer.head.top.toFixed(1)}/${joseonPlayer.head.top.toFixed(1)}, width ${goryeoPlayer.head.width.toFixed(1)}/${joseonPlayer.head.width.toFixed(1)}, centerX ${goryeoPlayer.head.centerX.toFixed(1)}/${joseonPlayer.head.centerX.toFixed(1)}; head gap ${goryeoHeadGap.toFixed(1)}/${joseonHeadGap.toFixed(1)}; 15 expression framing locks, 65 decoded official images, reload/resume, wrong-note linkage, unlock and widths 375–430. Screenshots: ${shots}`);
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});

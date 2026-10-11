'use strict';
// Specific staging risks through the production entry, renderer, click handlers
// and real save/reload. Exhaustive dialogue and pixel QA live in other tests.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {load}=require('./proto-revision-harness.cjs');
const canonical=JSON.parse(fs.readFileSync('dist/three-story-script.json','utf8'));
const sources=new Map([...canonical.prologue.scenes,...canonical.chapters.flatMap(chapter=>chapter.scenes)].map(source=>[source.sceneId,source]));
const fixtureCode=fs.readFileSync('tests/browser-review/fixtures.js','utf8');
const q=JSON.stringify;
let h=load(),scenario='',frames=0,reloads=0;
assert.equal(h.run('typeof THREE_STAGING.layers'),'function','production entry loads staging');

const decode=value=>value.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match=>[match[1],decode(match[2])]));
const dataset=tag=>Object.fromEntries(Object.entries(attrs(tag)).filter(([key])=>key.startsWith('data-')).map(([key,value])=>[key.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase()),value]));
const phase=()=>h.run('THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource()).phase');
const entries=()=>h.copy('THREE_COMPLETE_ACTIONS.phaseEntries(THREE_COMPLETE_ACTIONS.currentSource())');
const continuation=()=>h.copy('({chapter:run().currentChapter,scene:run().storyId,cursor:run().dialogueCursor,dialogueSceneId:run().dialogueSceneId,pending:run().pending,scenes:run().threeStoryState.scenes,queue:run().questionQueue,queueIndex:run().questionQueueIndex,activeQuestionId:run().activeQuestionId,answer:run().questionAnswer,book:meta().threeCompleteBook})');
function sourceDigest(){
  return crypto.createHash('sha256').update(h.run('JSON.stringify({script:THREE_STORY_SCRIPT,dialogue:[...THREE_STORY_RUNTIME.sources.keys()].map(id=>({id,main:STORIES[id].dialogues,join:STORIES[id].threeCommon,choices:STORIES[id].choices}))})')).digest('hex');
}
const originalSourceDigest=sourceDigest();
function attachFixtureEnvironment(){
  Object.assign(h.context,{URLSearchParams,location:{search:'?case='+scenario,origin:'https://review.invalid'},innerWidth:390,innerHeight:844,parent:{postMessage(){}},MutationObserver:class{observe(){}}});
  h.context.window.addEventListener=()=>{};
  h.context.document.documentElement={scrollWidth:390};
}
function fixture(name){
  scenario=name;attachFixtureEnvironment();h.storage.delete('review-initialized');
  h.run("meta().threeCompleteBook=THREE_SAVE_V3.emptyBook();delete meta().eraProgress['three-kingdoms-v3'];");
  h.run(fixtureCode);
}
function cursor(value){h.run('run().dialogueCursor='+value+';save();render()');}
function progress(){
  const controls=[...h.html().matchAll(/<button\b[^>]*>/g)].map(match=>match[0]).filter(tag=>['advance-dialogue','next','result-next'].includes(attrs(tag)['data-action']));
  assert.equal(controls.length,1,'one actual progress button');h.click(dataset(controls[0]));
}
function choose(index){
  assert.equal(phase(),'choice');
  const button=[...h.html().matchAll(/<button\b[^>]*>/g)].map(match=>match[0]).find(tag=>attrs(tag)['data-choice']===String(index));
  assert(button,'authored choice button');h.click(dataset(button));
  assert.equal(phase(),'branch');assert.equal(h.run('run().dialogueCursor'),1,'choice starts with its spoken line');
}
function photosIn(html){
  return [...html.matchAll(/<img\b[^>]*data-source-photo="[^"]*"[^>]*>/g)].map(match=>{
    const photo=attrs(match[0]);return {number:photo['data-source-photo'],src:photo.src,style:photo.style||''};
  });
}
function visuals(){
  const html=h.html(),game=attrs(html.match(/<section class="game conversation-game three-complete-game[^>]*>/)[0]);
  const actors=[...html.matchAll(/<div\b([^>]*class="stage-character [^"]*"[^>]*)>([\s\S]*?)<\/div>/g)].map(match=>{
    const actor=attrs(match[1]),image=match[2].match(/<span\b[^>]*class="three-portrait-image[^"]*"[^>]*>/);
    return {id:actor['data-character-id'],name:actor['aria-label'],position:actor['data-position'],style:actor.style,imageStyle:image?attrs(image[0]).style:'',photos:photosIn(match[2])};
  });
  const props=[...html.matchAll(/<span\b[^>]*data-three-prop="[^"]*"[^>]*>/g)].map(match=>{const prop=attrs(match[0]);return {id:prop['data-three-prop'],label:prop['data-prop-label']};});
  return {background:game.style,record:game.class.split(/\s+/).includes('three-record-context'),actors,props,
    bookState:html.match(/data-book-state="([^"]*)"/)?.[1]||'',groundBook:html.includes('data-book-location="ground"'),photos:photosIn(html)};
}
function actor(name){const found=visuals().actors.filter(value=>value.name===name);assert.equal(found.length,1,'standing '+name);return found[0];}
function hasProp(id){return visuals().props.some(prop=>prop.id===id);}
function frame(label){
  assert.equal(h.run('screen'),'game',label+' game');
  const current=continuation(),source=sources.get(current.scene),mode=phase(),list=entries(),index=current.scenes[current.scene].choiceIndex;
  const selected=source.choices[index];
  const authored=mode==='branch'?[selected.spokenLine,...selected.reply]:mode==='join'?source.join:source.main;
  assert.deepEqual(list.map(line=>({lineId:line.lineId,text:line.dialogue})),authored.map(line=>({lineId:line.lineId,text:line.text})),label+' entire phase retains authored lines');
  assert(current.cursor>=1&&current.cursor<=list.length,label+' cursor range');
  const limit=mode==='choice'?2:3,visible=list.slice(0,current.cursor).slice(-limit),html=h.html();
  assert.deepEqual([...html.matchAll(/data-line-id="([^"]*)"/g)].map(match=>match[1]),visible.map(line=>line.lineId),label+' ordered complete visible lines');
  const shared=html.replace(/\sdata-(?:line-id|character-id|position|presentation-context)="[^"]*"/g,'');
  visible.forEach((line,index)=>assert(shared.includes(h.run('dialogueBubble('+q(line)+','+(current.cursor-visible.length+index)+')')),label+' exact common bubble '+line.lineId));
  assert(h.run('THREE_SAVE_V3.validRun(run())'),label+' valid save');
  h.run('render();render()');
  assert.deepEqual(continuation(),current,label+' render leaves cursor, branch and learning unchanged');
  assert.equal(h.html(),html,label+' repeated render is stable');
  frames++;
  return visuals();
}
function reload(label){
  h.run('save()');const saved=continuation(),view=visuals(),storage=Object.fromEntries(h.storage);
  h=load(storage);attachFixtureEnvironment();h.run(fixtureCode);
  assert.deepEqual(continuation(),saved,label+' actual fresh-VM save restore');
  assert.deepEqual(visuals(),view,label+' restored staging HTML');
  assert.equal(sourceDigest(),originalSourceDigest,label+' full manuscript and runtime dialogue unchanged');
  reloads++;frame(label+'/reload');
}
function toJoin(label){
  for(let guard=0;phase()==='branch';guard++){assert(guard<10,label+' finite branch');progress();frame(label+'/branch-or-join');}
  assert.equal(phase(),'join',label+' common join');assert.equal(h.run('run().dialogueCursor'),1);
}
function toScene(sceneId,label){
  for(let guard=0;h.run('run().storyId')!==sceneId;guard++){
    assert(guard<100,label+' next scene reached');
    if(h.run('screen')==='quiz'){
      if(h.run('run().questionAnswer')===null){const answer=h.run('activeQuestion().answer');h.click({threeAnswer:String(answer)});h.click({action:'three-submit'});}
      else h.click({action:'quiz-next'});
    }else{assert.equal(h.run('screen'),'game');progress();}
  }
  assert.equal(h.run('run().dialogueCursor'),1,label+' next scene begins at first authored line');frame(label);
}

// The approved prologue has exactly six taps/lines here. The book travels from
// its existing Seoa poses without displaying archived reference photographs.
// Yeonwoo's visual-only support pose adds no spoken line.
fixture('three-stage-grandmother-before');
const originalPhotos=h.copy('THREE_COMPLETE_ART.sourcePhotos').map(photo=>({number:String(photo.photoNumber),src:photo.src}));
const originalPrologueBackground=h.run('assetStyle(THREE_COMPLETE_ACTIONS.currentSource().illustrationId)');
assert.equal(originalPhotos.length,3);
let liftingImage='',heldImage='';
for(let number=1;number<=6;number++){
  const label='PRO3 L0'+number,view=frame(label),seoa=actor('서아');
  assert.equal(h.run('run().storyId'),'THR-PRO-S03');
  assert.equal(phase(),'main');assert.equal(h.run('run().dialogueCursor'),number,label+' exact authored cursor');
  assert.equal(entries().length,6,label+' no extra staging dialogue');
  assert.equal(view.bookState,number<=2?'ground':number===3?'lifting':'held');
  assert.equal(view.groundBook,false,label+' no reference-photo book overlay');
  if(number<6)assert.equal(view.background,originalPrologueBackground,label+' approved background before support pair');
  else assert(view.background.includes('goguryeo-spring-queue-mother-in-pair-v1.png'),label+' background excludes the mother now carried in the foreground');
  assert.deepEqual(view.photos.map(({number,src})=>({number,src})),[],label+' reference photos are not story artwork');
  assert.equal(seoa.position,'right');assert.equal(seoa.id,'three_v3_seoa');
  assert.deepEqual(seoa.photos.map(({number,src})=>({number,src})),[],label+' no reference photos inside Seoa portrait');
  assert.equal(seoa.imageStyle.includes('seoa-book-actions-v1.png'),number>=3);
  if(number===3)liftingImage=seoa.imageStyle;
  if(number===4){heldImage=seoa.imageStyle;assert.notEqual(heldImage,liftingImage,'lifting and held render different approved crops');}
  if(number>=4)assert.equal(seoa.imageStyle,heldImage,label+' held pose continuity');
  assert.equal(view.actors.length,number===6?2:1,label+' only authored visual cast');
  if(number===6){
    const yeonwoo=actor('연우');
    assert.equal(yeonwoo.id,'civilian-c01-0e375c4533--initial','same Yeonwoo identity');
    assert.equal(yeonwoo.position,'left');assert(yeonwoo.imageStyle.includes('yeonwoo-mother-support-pair-v1.png'));
    assert.equal(yeonwoo.photos.length,0,'source photos remain with Seoa');
    assert.equal(new Set(view.actors.map(value=>value.id)).size,2,'visual cast has no duplicate actor');
    assert.equal(new Set(view.actors.map(value=>value.position)).size,2,'one actor per side');
  }
  if([2,3,4,6].includes(number))reload(label);
  const before=h.run('run().dialogueCursor');progress();
  if(number<6){
    assert.equal(h.run('run().storyId'),'THR-PRO-S03');
    assert.equal(h.run('run().dialogueCursor'),before+1,label+' one actual click advances one line');
  }
}
assert.equal(h.run('run().storyId'),'THR-C01-S01','last prologue tap hands off directly');
assert.equal(h.run('run().dialogueCursor'),1,'handoff does not consume the next scene first line');
const arrival=frame('PRO3 continuous handoff');
assert.equal(arrival.groundBook,false);assert.equal(arrival.photos.length,0,'prologue photo overlay does not leak into next scene');
assert(arrival.actors.every(value=>!value.imageStyle.includes('yeonwoo-mother-support-pair-v1.png')&&!value.imageStyle.includes('seoa-book-actions-v1.png')),'prologue pose overrides end at the authored handoff');
assert(arrival.background.includes('goguryeo-spring-queue-after-collapse.png'),'C01 uses the authored collapsed state after the support pair');
assert(!arrival.background.includes('goguryeo-spring-queue-mother-in-pair-v1.png'),'support-pair background ends at the handoff');

// Two unchanged authored lines are presented as records. Their choice menu
// returns to the people while still showing both complete recent bubbles.
fixture('three-record-line');cursor(9);
for(const number of [9,10]){
  const view=frame('C16 record M'+number);assert(view.record);assert.equal(view.actors.length,0);assert(hasProp('record-book'));
  assert.equal(h.run('run().dialogueCursor'),number);if(number===9)progress();
}
reload('C16 record M10');progress();assert.equal(phase(),'choice');
const people=frame('C16 response menu');assert.equal(people.record,false);
assert.deepEqual(people.actors.map(value=>[value.name,value.position]),[['수인','left'],['서아','right']]);
assert.equal([...h.html().matchAll(/data-choice="\d+"/g)].length,2);
choose(0);frame('C16 selected spoken line');assert.equal(visuals().record,false);

// Haein's box disappears only after B1's reply. B2 retains it through the
// common join and a fresh VM restored from the actual independent/shared saves.
for(const [name,kept] of [['three-stage-tools-lost',false],['three-stage-tools-kept',true]]){
  fixture(name);cursor(1);frame(name+'/spoken');assert(hasProp('toolbox'));
  progress();frame(name+'/first reply');assert.equal(hasProp('toolbox'),kept);
  if(kept){progress();frame(name+'/box recovered');assert(hasProp('toolbox'));}
  reload(name+'/branch');toJoin(name);assert.equal(hasProp('toolbox'),kept);
  reload(name+'/join');assert.equal(hasProp('toolbox'),kept);
}

// Only the delivered-letter replies visit the relay post. Both branches return
// to the original scene background when their common dialogue begins.
for(const [name,delivered] of [['three-stage-letter-delivered',true],['three-stage-letter-wait',false]]){
  fixture(name);cursor(1);const waiting=frame(name+'/spoken').background;
  assert(!waiting.includes('baekje-letter-relay-post.png'));
  progress();const reply=frame(name+'/first reply');
  assert.equal(reply.background.includes('baekje-letter-relay-post.png'),delivered);
  if(!delivered)assert.equal(reply.background,waiting);
  reload(name+'/reply');toJoin(name);assert.equal(visuals().background,waiting,name+' returns to waiting place');
  reload(name+'/join');assert.equal(visuals().background,waiting);
}

// B1 binds the hand during R03; B2 only brings the cloth then. The shared join
// binds it in both paths, so the next scene keeps that portrait and its history.
let hiddenImage='',bandagedImage='';
for(const index of [0,1]){
  let wrappedDuringReply='';
  fixture('three-stage-hand-hidden');frame('C17 hidden hand');
  hiddenImage=actor('해명').imageStyle;assert(hiddenImage.includes('haemyeong-acting-v1.png'));
  cursor(entries().length);progress();choose(index);frame('C17 B'+(index+1)+' spoken');
  progress();frame('C17 B'+(index+1)+' R01');assert.equal(actor('해명').imageStyle,hiddenImage);
  progress();frame('C17 B'+(index+1)+' R02');assert.equal(entries()[h.run('run().dialogueCursor')-1].characterName,'동료 석공');
  progress();frame('C17 B'+(index+1)+' R03');assert(hasProp('bandage'));
  assert(visuals().props.some(prop=>prop.label===(index===0?'손을 감싼 흰 천':'처치를 위해 가져온 천')),'cloth follows the selected authored action');
  // During B1-R03 the actual wrapping must show Haemyeong, even though the
  // preceding colleague would ordinarily remain Seoa's nearest NPC peer.
  if(index===0){
    assert.equal(entries()[h.run('run().dialogueCursor')-1].lineId,'THR-C17-S04-B1-R03');
    const wrapped=actor('해명');
    assert.equal(wrapped.id,'civilian-c17-439b052a1f--initial');
    assert.equal(wrapped.position,'left','B1-R03 shows the recipient of the bandage');
    assert(wrapped.imageStyle.includes('haemyeong-acting-v1.png'));
    // Original sheet 1536x1024, bandaged crop x901/y10/494x993.
    assert(wrapped.imageStyle.includes('background-size:310.93117% 103.12185%;background-position:86.46833% 32.25806%'),'B1-R03 renders the bandaged source crop');
    assert.notEqual(wrapped.imageStyle,hiddenImage,'B1-R03 has already wrapped the hand');
    wrappedDuringReply=wrapped.imageStyle;
    reload('C17 B1 R03 recipient and bandage');
    assert.equal(actor('해명').imageStyle,wrappedDuringReply);
  }else{
    assert(!visuals().actors.some(value=>value.id==='civilian-c17-439b052a1f--initial'),'B1 visual-only recipient does not leak into B2-R03');
  }
  toJoin('C17 B'+(index+1));
  if(index===0){bandagedImage=actor('해명').imageStyle;assert.notEqual(bandagedImage,hiddenImage);assert(bandagedImage.includes('haemyeong-acting-v1.png'));assert.equal(bandagedImage,wrappedDuringReply,'B1-R03 wrapped pose continues into the common join');}
  else assert.equal(actor('해명').imageStyle,bandagedImage);
  reload('C17 B'+(index+1)+' join');
  toScene('THR-C17-S05','C17 B'+(index+1)+' next scene');
  assert.equal(h.run("meta().threeCompleteBook.choiceBySceneId['THR-C17-S04']"),index);
  assert.equal(actor('해명').imageStyle,bandagedImage);assert(hasProp('bandage'));
  reload('C17 B'+(index+1)+' next scene');
}

// The same Yeoul changes to her authored empty-hand image, then retains that
// exact image/crop in the common join and after storage recovery.
fixture('three-stage-hammer-down');cursor(1);frame('C15 B1 spoken');
assert(!actor('여울').imageStyle.includes('yeoul-c15-empty-hands-v1.png'));
progress();frame('C15 hammer lowered');const emptyHands=actor('여울').imageStyle;
assert(emptyHands.includes('yeoul-c15-empty-hands-v1.png'));
reload('C15 hammer lowered');toJoin('C15 B1');assert.equal(actor('여울').imageStyle,emptyHands);
reload('C15 B1 join');assert.equal(actor('여울').imageStyle,emptyHands);

// This small pair exercises the actual book-index -> authored-choice-ID hook;
// C17's common bandage alone cannot prove that past decisions were forwarded.
for(const [name,expected] of [['three-stage-reunion-names',['contact-sheet']],['three-stage-reunion-tools',['route-note','needle-case']]]){
  fixture(name);frame(name);assert.deepEqual(visuals().props.map(prop=>prop.id).sort(),expected.slice().sort());
  reload(name);assert.deepEqual(visuals().props.map(prop=>prop.id).sort(),expected.slice().sort());
}
assert.equal(sourceDigest(),originalSourceDigest,'staging never changes any authored or converted dialogue');
assert.equal(h.run('JSON.stringify(THREE_STORY_SCRIPT)'),JSON.stringify(canonical),'entire approved manuscript remains exact');
console.log('PASS Three staging integration: '+frames+' actual HTML frames, '+reloads+' fresh-VM restores; prologue poses without reference-photo layers and support pair/background handoff, record-to-choice actor return, branch props/backgrounds, hand and hammer continuity, past-choice evidence, unchanged complete dialogue and cursors.');

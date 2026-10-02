const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=['data','ch02-data','ch03-data','exam-data','ch01-expansion','chapter-split','late-goryeo','official-late-exams'].map(x=>fs.readFileSync(`dist/${x}.js`,'utf8')).join('\n');
let saved=null,html='';
const context=vm.createContext({Date,navigator:{},window:{scrollTo(){}},document:{querySelector:s=>s==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},setTimeout:()=>1,clearTimeout(){}});
vm.runInContext(data+'\n'+fs.readFileSync('dist/app.js','utf8'),context);
const evaluate=code=>vm.runInContext(code,context);
const scenes=evaluate('Object.values(STORIES).filter(s=>s.chapterId==="ch01"&&s.storyActive!==false)');
let oldTaps=0,newTaps=0;
for(const scene of scenes){
  const frames=evaluate(`readingFrames(STORIES[${JSON.stringify(scene.sceneId)}],STORIES[${JSON.stringify(scene.sceneId)}].dialogues)`);
  assert.deepEqual(Array.from(frames).flatMap(f=>Array.from({length:f.end-f.start},(_,i)=>i+f.start)),Array.from(scene.dialogues,(_,i)=>i),'every original line must be shown');
  if(scene.readingMode==='narration-blocks')for(const frame of frames)assert(scene.dialogues.slice(frame.start,frame.end).filter(l=>!['thought','narration'].includes(l.speakerType)).length<=1,'important spoken turns must remain separate');
  oldTaps+=scene.dialogues.length-1;newTaps+=frames.length-1;
  if(!['prologue','sleep'].includes(scene.sceneId))for(const line of scene.dialogues.filter(l=>l.speakerType==='player')){
    assert(!/(하오|겠소|이시오|하겠네|배웠네|좋았네|그러하군)[.!?]?$/u.test(line.dialogue),line.dialogue);
    assert(/(요|까요|습니다|세요)[.!?…]*$/u.test(line.dialogue),`${scene.sceneId}: modern polite reply required: ${line.dialogue}`);
  }
}
assert(newTaps<oldTaps*0.8,`advance taps must decrease substantially: ${oldTaps} -> ${newTaps}`);
const preservedThoughts={foundation:['왕건. 고려. 잠깐, 918년.','방금 들은 장면부터 기억해 보자.'],ch01_jump_927:['하루만 버티려 했는데, 이제 나는 도윤과 내일 들어올 물건을 걱정하고 있었다.'],ch01_gongsan:['공산 전투와 신숭겸. 외운 이름이 여기서는 누군가의 죽음이었다.'],ch01_gochang:['927년 공산은 패배, 930년 고창은 승리.'],ch01_belonging:['돌아갈 곳만 찾던 내가, 어느새 이곳의 승리를 우리라고 듣고 있었다.']};
for(const[id,lines]of Object.entries(preservedThoughts))assert.deepEqual(Array.from(evaluate(`STORIES.${id}.dialogues.filter(l=>l.speakerType==='thought').map(l=>l.dialogue)`)),lines);
for(const id of ['foundation','ch01_jump_927','ch01_clear_930']){
  evaluate(`state=INITIAL();state.run.started=true;state.run.storyId='${id}';state.run.dialogueSceneId='${id}';state.run.dialogueCursor=1;screen='game';enterStory();render()`);
  assert(!html.includes('data-action="advance-dialogue"'),id);
  assert(!html.includes('class="monologue"')&&!html.includes('<span>속마음</span>'));
  const source=evaluate(`STORIES.${id}`);for(const line of source.dialogues)assert(html.includes(line.dialogue),`missing narrative: ${line.dialogue}`);
  const before=JSON.parse(saved);evaluate('state=migrateSave(JSON.parse(localStorage.getItem(KEY)));enterStory();render()');assert.deepEqual(JSON.parse(saved).run.stats,before.run.stats);assert.equal(JSON.parse(saved).run.dialogueCursor,source.dialogues.length);
}
assert(html.includes('신숭겸 전사')&&html.includes('930 · 고창 전투')&&html.includes('CHAPTER CLEAR')&&html.includes('챕터 결과 보기'));
const transition=evaluate('STORIES.ch01_jump_935.dialogues.map(l=>l.dialogue)');
assert(transition.findIndex(l=>l.includes('편하게 말해도 될까요'))<transition.findIndex(l=>l==='아직도 날 초보 취급하는 거야?'));
assert(transition.some(l=>l.includes('이제 편히 말하시오')));
evaluate('state=INITIAL();state.run.started=true;state.run.currentChapter="ch02";state.run.storyId="ch01_jump_935";state.run.dialogueSceneId="ch01_jump_935";state.run.dialogueCursor=2;state.run.stats.wealth=77;state=migrateSave(state)');
assert.equal(evaluate('state.run.dialogueCursor'),5);
assert.equal(evaluate('state.run.stats.wealth'),77);
evaluate('state=migrateSave(state)');assert.equal(evaluate('state.run.dialogueCursor'),5,'speech migration is idempotent');
evaluate('state=INITIAL();state.run.started=true;state.run.storyId="ch01_trade_start";state.run.dialogueSceneId="ch01_trade_start";state.run.dialogueCursor=3;screen="game";enterStory();render()');
assert(html.includes('data-character-id="doyun"')&&html.includes('data-character-id="player"'),'both characters remain visible during conversation');
assert.equal(evaluate('CHAPTERS.ch01.questionCount'),9);
assert.equal(evaluate('CH01_HISTORY_CARDS.filter(c=>c.chapterId==="ch01").length'),3);
console.log(`PASS: CH.01 advance taps ${oldTaps} -> ${newTaps}, every line retained, polite voice, narrative grouping, reload, timeline, 9 questions and CH.02 speech agreement.`);

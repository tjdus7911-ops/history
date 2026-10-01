const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const data=['data','ch02-data','ch03-data','exam-data','ch01-expansion'].map(file=>fs.readFileSync(`dist/${file}.js`,'utf8')).join('\n');
const app=fs.readFileSync('dist/app.js','utf8'),hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const ctx=vm.createContext({Date});
vm.runInContext(data+';this.api={STORIES,QUESTIONS,ASSETS,CHAPTERS,CH01_HISTORY_CARDS,CH01_STORY_QUESTION_IDS,CH01_REVIEW_IDS,INITIAL,migrateSave};',ctx);
const {STORIES,QUESTIONS,CHAPTERS,CH01_HISTORY_CARDS,CH01_STORY_QUESTION_IDS,CH01_REVIEW_IDS,INITIAL,migrateSave}=ctx.api;
const protectedData=JSON.parse(fs.readFileSync('tests/fixtures/ch01-protected.json','utf8'));
for(const [id,digest] of Object.entries(protectedData.scenes))assert.equal(hash(STORIES[id]),digest,`protected prologue: ${id}`);
for(const [id,digest] of Object.entries(protectedData.earlyDialogues))assert.equal(hash(STORIES[id].dialogues),digest,`existing early dialogue: ${id}`);
for(const [id,digest] of Object.entries(protectedData.chapters))assert.equal(hash({stories:Object.values(STORIES).filter(s=>s.chapterId===id),questions:QUESTIONS.filter(q=>q.chapterId===id)}),digest,`protected ${id} data`);
assert.equal(CH01_STORY_QUESTION_IDS.length,10);assert(CH01_REVIEW_IDS.length>=10);assert.equal(CHAPTERS.ch01.questionCount,10);
assert.equal(CH01_HISTORY_CARDS.length,12);
const activeCh01=QUESTIONS.filter(q=>q.chapterId==='ch01'&&!q.retired);
assert(activeCh01.length>=20);assert(activeCh01.every(q=>!q.isOfficial&&q.sourceVerified===false));
for(const q of activeCh01){assert(q.examType.includes('기출 유형'));assert.equal(q.choiceExplanations.length,q.choices.length);assert(q.concepts.length)}
const sourceCode=fs.readFileSync('dist/ch01-expansion.js','utf8');
assert(!sourceCode.includes('불로불사'));assert(!sourceCode.includes('시간여행의 부작용'));
assert(STORIES.ch01_guild_seed.dialogues.some(line=>line.dialogue==='그래도 기억은 해두겠소.'));

function harness(seed=null){
  let saved=seed?JSON.stringify(seed):null,html='',context,handler;
  const document={querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(event,fn)=>{if(event==='click')handler=fn},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}};
  const boot=()=>{context=vm.createContext({document,localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},Date,setTimeout:()=>1,clearTimeout(){}});vm.runInContext(data+'\n'+app,context)};
  const evalCode=code=>vm.runInContext(code,context),click=dataset=>{evalCode('inputLockedUntil=0');handler({target:{closest:()=>({dataset,disabled:false})},stopPropagation(){}})};
  boot();return {boot,click,action:name=>click({action:name}),current:()=>JSON.parse(saved),html:()=>html,evalCode};
}
function play(warChoice){
  const h=harness(),qids=[],visited=[],years=[];h.action('play');let guard=0;
  while(!h.current().run.completed){
    const r=h.current().run,s=STORIES[r.storyId];assert(s,`scene ${r.storyId}`);
    if(!r.pending&&!visited.includes(s.sceneId)){visited.push(s.sceneId);if(s.year<1000)years.push(s.year)}
    if(r.activeQuestionId){const q=QUESTIONS.find(q=>q.questionId===r.activeQuestionId);qids.push(q.questionId);h.click({answer:String(q.questionId==='ch01-story-gongsan'?(q.answer+1)%q.choices.length:q.answer)});assert(h.html().includes('feedback'));h.action('quiz-next')}
    else if(h.html().includes('data-action="advance-dialogue"'))h.action('advance-dialogue');
    else if(r.pending)h.action('result-next');
    else if(s.choices)h.click({choice:String(s.sceneId==='ch01_war_choice'?warChoice:0)});
    else h.action('next');
    if(++guard>500)throw new Error('story exceeded guard');
  }
  assert.deepEqual(qids,Array.from(CH01_STORY_QUESTION_IDS));
  for(const year of [918,927,930,935,936,943])assert(years.includes(year));
  assert(years.every((year,i)=>!i||year>=years[i-1]),'story chronology goes backwards');
  assert(visited.includes(['ch01_war_supply','ch01_war_news','ch01_war_refugees'][warChoice]));
  assert(visited.includes('ch01_unity'));assert(visited.includes('ch01_guild_seed'));
  const r=h.current().run;assert.equal(r.characterStates.doyun.characterAge,49);assert.equal(r.characterStates.doyun.ageVariant,'middle_943');assert.equal(r.characterStates.player.characterAge,23);assert.equal(r.playerOutfit,'goryeo_commoner');assert.equal(r.doyunLegacy.merchantGuild,false);assert.equal(r.doyunLegacy.plannedName,'도윤상단');
  assert.equal(h.current().meta.chapterRecords.ch01.latestRun.questionScore.correct,9);assert.equal(h.current().meta.chapterRecords.ch01.latestRun.questionScore.total,10);
  for(const card of CH01_HISTORY_CARDS)assert(h.current().meta.cards.includes(card.id),card.id);
  assert(h.current().meta.confusedConcepts.includes('공산전투_고창전투'));
  return h;
}
const h=play(0);play(1);play(2);
const runBeforeReview=h.current().run,recordBeforeReview=h.current().meta.chapterRecords.ch01;
h.action('start-ch01-review');assert(h.html().includes('CH.01 실전 복습 · 1 / 13'));
for(let index=0;index<CH01_REVIEW_IDS.length;index++){
  const id=CH01_REVIEW_IDS[index],q=QUESTIONS.find(item=>item.questionId===id);
  const selected=index===0?(q.answer+1)%q.choices.length:q.answer;
  h.click({answer:String(selected)});assert(h.html().includes('ch01-answer-details'));assert(h.html().includes('기출 유형'));
  if(index===3){h.boot();h.action('start-ch01-review');assert(h.html().includes('4 / 13'));assert(h.html().includes('feedback'))}
  h.action('quiz-next');
}
assert.equal(h.current().meta.ch01ReviewAttempts.length,1);assert.equal(h.current().meta.ch01ReviewAttempts[0].correct,12);assert.equal(h.current().meta.ch01ReviewAttempts[0].total,13);
assert.deepEqual(h.current().run,runBeforeReview,'independent review mutated the story run');assert.deepEqual(h.current().meta.chapterRecords.ch01,recordBeforeReview,'review changed story score/history');
assert(h.html().includes('최근 복습 12 / 13'));assert(h.html().includes('공산전투 · 고창전투'));
h.click({concept:'공산전투_고창전투'});assert(h.html().includes('공산'));h.click({answer:'0'});h.action('quiz-next');assert(!h.current().meta.confusedConcepts.includes('공산전투_고창전투'));
h.click({historyCard:'ch01-sasimgwan'});assert(h.html().includes('김부'));assert(h.html().includes('창작'));assert(h.html().includes('국사편찬위원회'));
h.action('start-ch02');assert.equal(h.current().run.currentChapter,'ch02');assert.equal(h.current().run.characterStates.doyun.characterAge,57);assert.equal(h.current().run.characterStates.doyun.ageVariant,'middle_aged_949');
const ch02Run=h.current().run;
h.action('start-ch01-review');const q=QUESTIONS.find(q=>q.questionId===CH01_REVIEW_IDS[0]);h.click({answer:String(q.answer)});h.action('quiz-next');assert.deepEqual(h.current().run,ch02Run,'CH.01 review changed CH.02 progress');
h.boot();h.action('play');assert.equal(h.current().run.currentChapter,'ch02');assert.equal(h.current().run.storyId,'ch02_transition');

// Old unfinished end-of-chapter saves enter the expansion without losing records.
const legacy=JSON.parse(JSON.stringify(INITIAL()));legacy.run.started=true;legacy.run.storyId='future_flow';legacy.run.stats.wealth=22;legacy.meta.wrongQuestionIds.push('ch01-test-01');
let migrated=migrateSave(legacy);assert.equal(migrated.run.storyId,'ch01_trade_start');assert.equal(migrated.run.stats.wealth,22);assert(migrated.meta.wrongQuestionIds.includes('ch01-test-01'));assert.equal(migrateSave(migrated).run.storyId,'ch01_trade_start');
legacy.run.activeQuestionId='ch01-boss';migrated=migrateSave(legacy);assert.equal(migrated.run.activeQuestionId,'ch01-boss');assert.equal(migrated.run.resumeAfterLegacyQuiz,'ch01_trade_start');
const resumed=harness(legacy);resumed.action('play');resumed.click({answer:'3'});resumed.action('quiz-next');assert.equal(resumed.current().run.storyId,'ch01_trade_start');
legacy.run.completed=true;legacy.run.activeQuestionId=null;legacy.run.storyId='complete';migrated=migrateSave(legacy);assert.equal(migrated.run.completed,true);assert.equal(migrated.run.storyId,'complete');
for(const year of [918,927,930,935,936,943]){
  const id=Object.values(STORIES).find(s=>s.year===year&&s.enterCharacterStates)?.sceneId;if(!id)continue;
  const saved=JSON.parse(JSON.stringify(INITIAL()));saved.run.started=true;saved.run.storyId=id;saved.run.ch01ExpansionVersion=1;
  const restored=harness(saved);restored.action('play');assert.equal(restored.current().run.characterStates.doyun.characterAge,24+year-918);restored.boot();restored.action('play');assert.equal(restored.current().run.storyId,id);assert.equal(restored.current().run.characterStates.doyun.characterAge,24+year-918);
}
console.log('PASS: protected prologue and CH.02/03, three war paths, ten chronological story questions, twelve cards, thirteen independent reviews, targeted retry, age/outfit, legacy and current saves, CH.02 entry.');

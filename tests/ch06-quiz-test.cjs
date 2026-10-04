const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['app.js','pwa.js','v2-app.js','v2-learning.js','v2-exam-restoration.js','v2-exam-additions.js','v2-art.js','v2-backgrounds.js'].includes(n));
const base=scripts.filter(n=>n!=='ch06-quiz-refinement.js').map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n');
const c=vm.createContext({Date}),run=s=>vm.runInContext(s,c),copy=x=>JSON.parse(JSON.stringify(x));
run(base);
const names=['STORIES','QUESTIONS','QUESTION_SETS','QUESTION_POOLS','CHAPTERS','ASSETS','CHARACTERS','PORTRAITS','CHARACTER_ASSET_MAP','SPLIT_STORY_QUESTION_IDS','SPLIT_REVIEW_IDS','SAVE_VERSION'];
const before=Object.fromEntries(names.map(n=>[n,copy(run(n))]));
run(fs.readFileSync('dist/ch06-quiz-refinement.js','utf8'));
const after=Object.fromEntries(names.map(n=>[n,copy(run(n))]));
const connections=['questionSetId','questionSetStatus','questionSetResumeStoryId','linkedQuestionIds','linkedOfficialQuestions','linkedPracticeQuestionIds','questionSequenceMode','officialQuestionSlot','practiceQuestionSlot','afterChoiceQuestionSetId'];
for(const [id,s]of Object.entries(before.STORIES)){
 const current=copy(after.STORIES[id]);
 if(s.chapterId==='ch06')for(const k of connections){delete current[k];}
 const old=copy(s);if(s.chapterId==='ch06')for(const k of connections)delete old[k];
 assert.deepEqual(current,old,id+': story, dialogue, choices, background, order and character preserved');
}
for(const q of before.QUESTIONS){
 const current=copy(after.QUESTIONS.find(n=>n.questionId===q.questionId)),old=copy(q);
 if(q.chapterId==='ch06')for(const k of ['relatedIllustrationId','resumeStoryId',...(q.isOfficial?['relatedSceneId','memoryPrompt']:[])]){delete current[k];delete old[k];}
 assert.deepEqual(current,old,q.questionId+': original learning content preserved');
}
for(const n of ['ASSETS','CHARACTERS','PORTRAITS','CHARACTER_ASSET_MAP','SAVE_VERSION'])assert.deepEqual(after[n],before[n],n+' entirely preserved');
for(const n of ['QUESTION_SETS','QUESTION_POOLS','CHAPTERS','SPLIT_STORY_QUESTION_IDS','SPLIT_REVIEW_IDS'])for(const [id,value]of Object.entries(before[n]))if((value.chapterId||id)!=='ch06')assert.deepEqual(after[n][id],value,n+'/'+id+': other chapters preserved');
const active=after.QUESTIONS.filter(q=>q.chapterId==='ch06'&&!q.retired&&!q.reviewOnly),official=active.filter(q=>q.isOfficial),practice=active.filter(q=>!q.isOfficial);
assert.equal(active.length,22);assert.equal(official.length,8);assert.equal(practice.length,14);
assert.equal(after.CHAPTERS.ch06.questionCount,22);assert.equal(after.CHAPTERS.ch06.questionSetCount,13);
assert.equal(new Set(active.map(q=>q.questionId)).size,22);
for(const q of after.QUESTIONS.filter(q=>q.chapterId==='ch06'))assert.equal(q.relatedIllustrationId,after.STORIES[q.relatedSceneId].illustrationId,q.questionId+': exact story recall');
const sources=JSON.parse(fs.readFileSync('tests/fixtures/ch06-official-exam-sources.json','utf8')).sources;
for(const source of sources){
 const q=official.find(q=>q.examRound===source.examRound&&q.questionNumber===source.questionNumber);
 for(const k of ['sourceFile','answerFile','sourcePage','examRound','examLevel','examYear','questionNumber','sourceQuestionImage','sourceImageHash','question','choices','answer'])assert.deepEqual(q[k],source[k],q.questionId+'/'+k);
}
for(const q of official){
 assert(q.isOfficial&&q.sourceVerified&&q.sourceImageVerified&&q.sourceAnswerVerified);assert.equal(q.sourceImageStatus,'verified');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync('dist/'+q.sourceQuestionImage)).digest('hex'),q.sourceImageHash,q.questionId+' original crop hash');
 assert(q.sourceImageWidth>=450&&q.sourceImageWidth<=800);assert(q.sourceImageHeight>100);assert(/^[a-f0-9]{64}$/.test(q.sourcePdfHash));assert(/^[a-f0-9]{64}$/.test(q.answerPdfHash));
}
let saved=null,html='',handlers={};
Object.assign(c,{document:{querySelector:s=>s==='#app'?{set innerHTML(s){html=s}}:null,querySelectorAll:()=>[],addEventListener:(n,h)=>handlers[n]=h},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
run(fs.readFileSync('dist/app.js','utf8'));
const click=dataset=>{run('inputLockedUntil=0');handlers.click({target:{closest:()=>({dataset,disabled:false})}})};
const start=()=>run('state=INITIAL();state.meta.completedChapters=["ch01","ch02","ch03","ch04","ch05"];state.run=INITIAL_RUN("ch05");state.run.started=true;state.run.completed=true;startAvailableChapter("ch06")');
function play(wrong=false){
 const seen=new Set(),flow=[];let guard=0;
 while(!run('run().completed')){
  assert(++guard<300,'CH06 full-play guard');
  if(run('screen')==='game'){
   const s=run('STORIES[run().pending?.sourceSceneId||run().storyId]'),p=run('run().pending'),entries=run('conversationEntries(STORIES[run().storyId],run().pending)'),cursor=run('run().dialogueCursor');seen.add(s.sceneId);
   if(cursor<entries.length)click({action:'advance-dialogue'});else if(p)click({action:'result-next'});else if(s.choices?.length)click({choice:wrong?'1':'0'});else click({action:'next'});
  }else if(run('screen')==='quiz'){
   const q=copy(run('activeQuestion()')),source=after.STORIES[q.relatedSceneId];
   assert(seen.has(q.relatedSceneId),q.questionId+': recall comes from a scene actually played');
   assert(html.includes(after.ASSETS[source.illustrationId].src),q.questionId+': actual recall asset rendered');
   const isOfficial=q.isOfficial;
   assert(html.includes(isOfficial?'[실제 기출]':'[심화 연습]'));
   if(isOfficial){assert(html.includes('official-source-question'));assert(html.includes(q.sourceQuestionImage));assert.equal((html.match(/data-answer="/g)||[]).length,q.sourceChoices.length);}
   flow.push({sceneId:run('QUESTION_SETS[run().activeQuestionSetId].afterSceneId'),questionId:q.questionId,relatedSceneId:q.relatedSceneId,recallAsset:after.ASSETS[source.illustrationId].src,type:isOfficial?'실제 기출':'심화 연습',examRound:q.examRound,examLevel:q.examLevel,questionNumber:q.questionNumber,image:q.sourceQuestionImage});
   click({answer:String(wrong?(q.answer+1)%q.choices.length:q.answer)});
   assert(html.includes(wrong?'오답':'정답'));assert(html.includes('역사 해설'));assert(html.includes('data-action="quiz-next"'));assert.equal(run('run().questionResults['+JSON.stringify(q.questionId)+']'),!wrong);
   const migrated=run('migrateSave(JSON.parse('+JSON.stringify(saved)+'))');assert.equal(migrated.run.activeQuestionId,q.questionId);assert.equal(migrated.run.questionAnswer,wrong?(q.answer+1)%q.choices.length:q.answer);
   click({action:'quiz-next'});
  }else throw Error(run('screen'));
 }
 assert.equal(seen.size,14);assert.equal(flow.length,22);assert.equal(new Set(flow.map(q=>q.questionId)).size,22);assert.equal(flow.filter(q=>q.type==='실제 기출').length,8);assert.equal(flow[0].type,'실제 기출');
 assert.equal(run('Object.keys(run().questionResults).filter(id=>!QUESTIONS.find(q=>q.questionId===id)?.retired).length'),22);
 click({nav:'teaser'});assert(html.includes('CH.07 시작하기'));click({action:'start-chapter',chapter:'ch07'});assert.equal(run('run().currentChapter'),'ch07');
 return flow;
}
start();const flow=play();start();run('for(const q of QUESTIONS.filter(q=>q.chapterId==="ch06"&&q.isOfficial))meta().questionRecords[q.questionId]={attempts:100}');assert.deepEqual(play(true),flow,'attempt history cannot push officials to the end');
// Old saves can contain the retired culture practice in their persisted queue. Keep that queue and answers.
start();run('run().storyId="ch06_rebuild";run().dialogueCursor=STORIES.ch06_rebuild.dialogues.length;run().questionQueue=["ch06-practice-culture-01","ch06-practice-culture-02","ch06-practice-culture-03"];run().questionQueueIndex=0;run().questionQueueResumeStoryId="ch06_woodblocks";run().activeQuestionSetId="ch06-culture";run().activeQuestionId=run().questionQueue[0];run().questionAnswer=null;save();');
const legacy=run('migrateSave(JSON.parse('+JSON.stringify(saved)+'))');assert.deepEqual(copy(legacy.run.questionQueue),['ch06-practice-culture-01','ch06-practice-culture-02','ch06-practice-culture-03']);
run('state=migrateSave(JSON.parse('+JSON.stringify(saved)+'));screen="quiz";quizMode="story";render()');
for(let i=0;i<3;i++){const q=run('activeQuestion()');assert.equal(q.questionId,legacy.run.questionQueue[i]);click({answer:String(q.answer)});click({action:'quiz-next'});}
assert.equal(run('run().storyId'),'ch06_woodblocks');run('run().dialogueCursor=conversationEntries(STORIES.ch06_woodblocks).length;render()');click({action:'next'});
assert.deepEqual(copy(run('run().questionQueue')),['ch06-official-77-advanced-11','ch06-official-79-advanced-13'],'saved culture queue now reaches both image-backed officials without repeating answered practice');
for(let i=0;i<2;i++){const q=run('activeQuestion()');assert(html.includes(q.sourceQuestionImage));click({answer:String(q.answer)});click({action:'quiz-next'});}
assert.equal(run('run().storyId'),'ch06_memory');
// An anchor whose questions were all answered in a legacy queue must fall through to the next story.
run('run().storyId="ch06_gangjo";for(const id of STORIES.ch06_gangjo.linkedQuestionIds)run().questionResults[id]=true;run().dialogueCursor=conversationEntries(STORIES.ch06_gangjo).length;render()');click({action:'next'});assert.equal(run('run().storyId'),'ch06_gaegyeong');
if(process.env.CH06_FLOW_REPORT)fs.writeFileSync(process.env.CH06_FLOW_REPORT,JSON.stringify(flow,null,2)+'\n');
console.log('PASS: CH06 22 questions/8 verified officials/14 practices/8 source images; all recall assets match witnessed scenes; full play correct and wrong, stable order despite attempts, legacy queue, no duplicates, save/resume, CH07 transition, all other content preserved.');

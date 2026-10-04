const fs=require('fs'),vm=require('vm'),assert=require('assert');
const files=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(f=>!['app.js','pwa.js','v2-app.js','v2-learning.js','v2-exam-restoration.js','v2-exam-additions.js','v2-art.js','v2-backgrounds.js','ch06-backgrounds.js','ch06-quiz-refinement.js'].includes(f));
const c=vm.createContext({Date}),run=s=>vm.runInContext(s,c),copy=x=>JSON.parse(JSON.stringify(x));
run(files.map(f=>fs.readFileSync('dist/'+f,'utf8')).join('\n'));
const protectedNames=['QUESTIONS','QUESTION_SETS','QUESTION_POOLS','CHAPTERS','CHARACTERS','PORTRAITS','CHARACTER_ASSET_MAP','SAVE_VERSION'];
const before=copy(run('STORIES')),assets=copy(run('ASSETS')),protectedData=Object.fromEntries(protectedNames.map(n=>[n,JSON.stringify(run(n))]));
run(fs.readFileSync('dist/ch06-backgrounds.js','utf8'));
const after=copy(run('STORIES')),mapped=Object.values(after).filter(s=>s.chapterId==='ch06');
assert.equal(mapped.length,14);assert.equal(new Set(mapped.map(s=>s.illustrationId)).size,13);
for(const [id,old]of Object.entries(before)){
 const current=copy(after[id]);
 if(old.chapterId==='ch06'){
  assert.notEqual(current.illustrationId,old.illustrationId,id+' old art replaced');
  const art=run('ASSETS['+JSON.stringify(current.illustrationId)+']');
  assert.equal(current.backgroundImage,art.src);assert(art.src.startsWith('assets/scenes/ch06-'));
  assert(fs.existsSync('dist/'+art.src),id+' ready image');assert.equal(art.embeddedCharacters,false);
  current.illustrationId=old.illustrationId;current.backgroundImage=old.backgroundImage;
  for(let i=0;i<(current.choices||[]).length;i++){
   assert.equal(after[id].choices[i].resultIllustrationId,after[id].illustrationId);
   current.choices[i].resultIllustrationId=old.choices[i].resultIllustrationId;
  }
 }
 assert.deepEqual(current,old,id+' non-background data preserved');
}
for(const [id,asset]of Object.entries(assets))assert.deepEqual(copy(run('ASSETS['+JSON.stringify(id)+']')),asset,id+' existing asset preserved');
for(const n of protectedNames)assert.equal(JSON.stringify(run(n)),protectedData[n],n+' preserved');
let saved=null,html='',handlers={};
Object.assign(c,{document:{querySelector:s=>s==='#app'?{set innerHTML(s){html=s}}:null,querySelectorAll:()=>[],addEventListener:(n,h)=>handlers[n]=h},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
run(fs.readFileSync('dist/ch06-quiz-refinement.js','utf8'));
run(fs.readFileSync('dist/app.js','utf8'));
const click=dataset=>{run('inputLockedUntil=0');handlers.click({target:{closest:()=>({dataset,disabled:false})}})};
for(const branch of [0,1]){
 run('state.meta.completedChapters=["ch01","ch02","ch03","ch04","ch05"];state.run=INITIAL_RUN("ch05");state.run.started=true;state.run.completed=true;startAvailableChapter("ch06")');
 const seen=new Set(),questions=new Set();let guard=0,reloaded=false;
 while(!run('run().completed')){
  assert(++guard<250,'CH06 full-play guard');
  if(run('screen')==='game'){
   const s=run('STORIES[run().pending?.sourceSceneId||run().storyId]'),p=run('run().pending'),entries=run('conversationEntries(STORIES[run().storyId],run().pending)'),cursor=run('run().dialogueCursor');
   seen.add(s.sceneId);assert(html.includes('data-illustration="'+s.illustrationId+'"'));assert(html.includes(s.backgroundImage));
   if(['narration','thought'].includes(entries[cursor-1]?.speakerType))assert(!html.includes('character-stage'));
   if(cursor<entries.length)click({action:'advance-dialogue'});else if(p)click({action:'result-next'});else if(s.choices?.length)click({choice:String(branch)});else click({action:'next'});
  }else if(run('screen')==='quiz'){
   const q=run('activeQuestion()');questions.add(q.questionId);
   click({answer:String((q.answer+1)%q.choices.length)});assert(html.includes('오답'));assert(html.includes('역사 해설'));
   run('run().questionAnswer=null;delete run().questionResults['+JSON.stringify(q.questionId)+'];render()');click({answer:String(q.answer)});assert(html.includes('정답'));click({action:'quiz-next'});
   if(!reloaded){assert.equal(run('migrateSave(JSON.parse('+JSON.stringify(saved)+')).run.currentChapter'),'ch06');reloaded=true;}
  }else throw Error(run('screen'));
 }
 assert.equal(seen.size,14);assert.equal(questions.size,22);assert(reloaded);
 click({nav:'teaser'});assert(html.includes('CH.07 시작하기'));click({action:'start-chapter',chapter:'ch07'});assert.equal(run('run().currentChapter'),'ch07');
}
console.log('PASS: CH06 14 scenes/13 backgrounds, both choice branches, all 22 quizzes correct/wrong/explanation/return, save migration, CH07 transition; every other story/quiz/character/asset unchanged.');

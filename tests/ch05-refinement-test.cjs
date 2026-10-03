const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const files=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(x=>x[1]).filter(x=>!['app.js','pwa.js'].includes(x));
const baseline=files.filter(x=>x!=='ch05-refinement.js').map(x=>fs.readFileSync('dist/'+x,'utf8')).join('\n');
const context=vm.createContext({Date});const run=s=>vm.runInContext(s,context);
run(baseline+';this.before={stories:JSON.parse(JSON.stringify(STORIES)),questions:JSON.parse(JSON.stringify(QUESTIONS)),characters:JSON.stringify(CHARACTERS),maps:JSON.stringify(CHARACTER_ASSET_MAP),version:SAVE_VERSION};');
const before=context.before;run(fs.readFileSync('dist/ch05-refinement.js','utf8'));
for(const [id,s] of Object.entries(before.stories)){const after=run('STORIES['+JSON.stringify(id)+']');if(s.chapterId!=='ch05')assert.equal(JSON.stringify(after),JSON.stringify(s),id+' protected');else{const allowed=new Set(['ch05_border','ch05_withdraw','ch05_builders','ch05_people']);if(!allowed.has(id))assert.deepEqual(JSON.parse(JSON.stringify(after.dialogues)),s.dialogues);else{for(const d of s.dialogues.filter(d=>d.speakerType==='narration'||d.speakerType==='thought'))assert(after.dialogues.some(n=>JSON.stringify(n)===JSON.stringify(d)),id+' historical narration preserved');}assert.equal(after.nextStoryId,s.nextStoryId);assert.equal(after.sceneId,s.sceneId);assert.equal(after.year,s.year);for(let i=0;i<(s.choices||[]).length;i++)if(id!=='ch05_border')assert.equal(JSON.stringify(after.choices[i].resultDialogues),JSON.stringify(s.choices[i].resultDialogues));else{assert.equal(after.choices[i].resultDialogues.at(-1).dialogue,s.choices[i].resultDialogues.at(-1).dialogue);for(const k of Object.keys(s.choices[i]).filter(k=>!['resultDialogues','resultIllustrationId'].includes(k)))assert.deepEqual(JSON.parse(JSON.stringify(after.choices[i][k])),s.choices[i][k]);}}}
for(const q of before.questions){const after=run('QUESTIONS.find(q=>q.questionId==='+JSON.stringify(q.questionId)+')');const old={...q},now=JSON.parse(JSON.stringify(after));if(q.chapterId==='ch05'){delete old.relatedIllustrationId;delete now.relatedIllustrationId;}assert.deepEqual(now,old,q.questionId+' content/save compatibility');}
assert.equal(run('JSON.stringify(CHARACTERS)'),before.characters);assert.equal(run('JSON.stringify(CHARACTER_ASSET_MAP)'),before.maps);assert.equal(run('SAVE_VERSION'),before.version);
assert.equal(run('QUESTIONS.filter(q=>q.chapterId==="ch05"&&q.isOfficial).length'),3);assert.equal(run('QUESTIONS.filter(q=>q.chapterId==="ch05"&&!q.isOfficial).length'),9);
const sources=run('CH05_PDF_SOURCES');for(const source of sources){assert.equal(crypto.createHash('sha256').update(fs.readFileSync('dist/'+source.sourceQuestionImage)).digest('hex'),source.sourceImageHash);assert(source.sourcePage>=3);assert.equal(source.examLevel,'기본');}
assert.equal(run('CHAPTERS.ch05.startStoryId'),'ch05_prologue');assert.equal(run('STORIES.ch05_prologue.nextStoryId'),'ch05_border');assert.equal(run('STORIES.ch05_prologue.characterStageMode'),'hidden');for(const e of ['neutral','smile','worried','serious','surprised'])assert(fs.existsSync(run('PORTRAITS.ch05_yeon_'+e+'.src').replace(/^/,'dist/')));
let saved=null,html='',handlers={};const document={querySelector:s=>s==='#app'?{set innerHTML(s){html=s}}:null,querySelectorAll:()=>[],addEventListener:(n,h)=>handlers[n]=h};Object.assign(context,{document,localStorage:{getItem:()=>saved,setItem:(k,s)=>saved=s},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});run(fs.readFileSync('dist/app.js','utf8'));
const click=dataset=>{run('inputLockedUntil=0');handlers.click({target:{closest:()=>({dataset,disabled:false})}})};
run('state.meta.completedChapters=["ch01","ch02","ch03","ch04"];state.run=INITIAL_RUN("ch04");state.run.started=true;state.run.completed=true;startAvailableChapter("ch05");');
assert.equal(run('readingFrames(STORIES.ch05_prologue,STORIES.ch05_prologue.dialogues).length'),1);assert(!html.includes('character-stage'));assert(!html.includes('탭하여 계속'));const oldPosition=run('JSON.parse(JSON.stringify(state))');oldPosition.run.storyId='ch05_council';assert.equal(run('migrateSave('+JSON.stringify(oldPosition)+').run.storyId'),'ch05_council');
let scenes=new Set(),questions=new Set(),frames=0,guard=0;
while(!run('run().completed')){
 assert(++guard<300);const screen=run('screen');
 if(screen==='game'){
  const s=run('STORIES[run().storyId]'),p=run('run().pending'),entries=run('conversationEntries(STORIES[run().storyId],run().pending)'),cursor=run('run().dialogueCursor'),entry=entries[cursor-1];scenes.add(s.sceneId);frames++;
  if(['thought','narration'].includes(entry?.speakerType))assert(!html.includes('character-stage'));
  else if(entry?.speakerType==='npc'||entry?.speakerType==='player'){assert(html.includes('stage-left'));assert(html.includes('stage-right'));if(html.includes('data-character-id="yeon"'))assert(/ch05-yeon-(neutral|smile|worried|serious|surprised)-v2.webp/.test(html));assert(!html.includes('hyunwoo_'));}
  if(cursor<entries.length)click({action:'advance-dialogue'});else if(p)click({action:'result-next'});else if(s.choices?.length)click({choice:'0'});else click({action:'next'});
 }else if(screen==='quiz'){
  const q=run('activeQuestion()');questions.add(q.questionId);assert(html.includes(q.isOfficial?'[실제 기출]':'[심화 연습] · 한능검 심화 대비'));if(q.isOfficial)assert(html.includes(q.sourceQuestionImage));
  click({answer:String((q.answer+1)%q.choices.length)});assert(html.includes('오답'));assert(html.includes('역사 해설'));run('run().questionAnswer=null;render()');click({answer:String(q.answer)});assert(html.includes('정답'));click({action:'quiz-next'});
 }else throw Error(screen);
}
assert.equal(scenes.size,13);assert.equal(questions.size,12);assert.equal(run('migrateSave(JSON.parse('+JSON.stringify(saved)+')).run.currentChapter'),'ch05');
run('state.run.currentChapter="ch06"');assert(run('resolvedPortraitId(dialogueLine("yeon","neutral",""))').startsWith('yeon'));
console.log('PASS: CH.05 13 scenes/12 questions (3 verified + 9 preserved), every frame, portraits, correct/wrong, return/save, all other chapters and historical/quiz content unchanged.');

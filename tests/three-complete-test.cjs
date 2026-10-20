/* Content, chronology, choices, official quizzes, and reload continuity through the real entry scripts. */
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { assertSha256IfLocal } = require('./deployment-asset-test-helper.cjs');
// Exercise preserved Three Kingdoms content below the production release gate.
// Public entry blocking is verified in the dedicated access-policy harnesses.
const scripts = [...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(f=>!['pwa.js','story-release-policy.js'].includes(f));
const manuscript = JSON.parse(fs.readFileSync('dist/three-story-script.json'));
const exams = JSON.parse(fs.readFileSync('dist/three-exam-data.json'));
let store = {}, html = '', context, listeners;
function boot(reset=false) {
  if (reset) store = {};
  listeners = [];
  const root = {set innerHTML(value){html=value},get innerHTML(){return html}};
  context = vm.createContext({Date,console,URL,Map,Set,document:{querySelector:s=>s==='#app'?root:null,querySelectorAll:()=>[],addEventListener:(type,fn,opts)=>{if(type==='click')listeners.push({fn,capture:opts===true})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:key=>store[key]||null,setItem:(key,value)=>{store[key]=value},removeItem:key=>{delete store[key]}},window:{scrollTo(){},addEventListener(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){}});
  for (const file of scripts) vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
}
const run = source=>vm.runInContext(source,context), copy = source=>JSON.parse(run('JSON.stringify('+source+')'));
function click(dataset) {
  run('inputLockedUntil=0'); let stopped=false;
  const button={dataset,disabled:false};
  const event={target:{closest:selector=>selector==='button'?button:null},stopImmediatePropagation(){stopped=true},stopPropagation(){},preventDefault(){}};
  for (const entry of [...listeners.filter(v=>v.capture),...listeners.filter(v=>!v.capture)]) { entry.fn(event);if(stopped)break; }
}
const action=name=>click({action:name});
function snapshot() {return copy('({screen,chapter:run().currentChapter,story:run().storyId,pending:run().pending,phase:THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource()),cursor:run().dialogueCursor,question:run().activeQuestionId,answer:run().questionAnswer,queue:run().questionQueue,index:run().questionQueueIndex,book:THREE_COMPLETE_ACTIONS.book()})')}
function reloadAtSameMoment() {
  run('save()');const before=snapshot();boot();run("resumeEra('three-kingdoms')");const after=snapshot();
  for(const key of ['chapter','story','pending','phase','cursor','question','answer','queue','index','book'])assert.deepEqual(after[key],before[key],'reload '+key);
}
boot(true);
assert.equal(run('THREE_STORY_RUNTIME.version'),3);
assert.equal(run("eraChapters('three-kingdoms').length"),23);
assert.equal(run('THREE_STORY_RUNTIME.sources.size'),218);
assert.equal(run('THREE_STORY_RUNTIME.questionByOfficialId.size'),99);
assert.equal(run("QUESTIONS.filter(q=>q.threeStoryVersion===3&&!q.reviewOnly).length"),98);
assert.equal(manuscript.authoredUtteranceCount,2777);
assert.equal(manuscript.chapters.flatMap(c=>c.scenes).length,215);
assert.equal(manuscript.chapters.flatMap(c=>c.scenes.flatMap(s=>s.choices)).length,142);
const mainScenes=manuscript.chapters.flatMap(c=>c.scenes), allScenes=[...manuscript.prologue.scenes,...mainScenes];
let utterances=0;
for(const scene of allScenes) {
  const stored=copy('STORIES['+JSON.stringify(scene.sceneId)+']');
  assert.deepEqual(stored.dialogues.map(v=>[v.lineId,v.characterName,v.dialogue]),scene.main.map(v=>[v.lineId,v.speaker,v.text]));
  assert.deepEqual(stored.threeCommon.map(v=>[v.lineId,v.characterName,v.dialogue]),scene.join.map(v=>[v.lineId,v.speaker,v.text]));
  utterances+=scene.main.length+scene.join.length;
  for(let i=0;i<scene.choices.length;i++) {
    const branch=scene.choices[i], result=stored.choices[i];
    assert.deepEqual(result.resultDialogues.map(v=>[v.lineId,v.characterName,v.dialogue]),[branch.spokenLine,...branch.reply].map(v=>[v.lineId,v.speaker,v.text]));
    assert.equal(result.label,branch.label);assert.deepEqual(result.statChanges,{});assert.deepEqual(result.relationshipChanges,{});
    assert.equal(result.resultDialogues.filter(v=>v.lineId===branch.lineId).length,1);
    utterances+=1+branch.reply.length;
  }
}
assert.equal(utterances,2777);
assert.equal(new Set(allScenes.flatMap(s=>[...s.main,...s.join,...s.choices.flatMap(c=>[c.spokenLine,...c.reply])]).map(l=>l.lineId)).size,2777);
for(const q of exams.questions) {
  const installed=copy('THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(q.officialQuestionId)+')');
  assert.equal(installed.answer,q.answer);assert.equal(installed.answer,q.answerNumber-1);
  assert.equal(installed.choices.length,q.examLevel==='기본'?4:5);
  assert(run('isVerifiedOfficialQuestion(THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(q.officialQuestionId)+'))'));
  assertSha256IfLocal('dist/'+q.questionImage,q.sourceImageSha256,q.officialQuestionId);
}
console.log('PASS: exact 2,777 lines, 142 spoken branches, 91 source-image hashes and answer bases, official entry registration.');

// The 120ms black cut belongs only to the explicit PRO-S02 -> PRO-S03 tap.
// A DOM re-render or saved resume at the same first line must never replay it.
boot(true);run("resumeEra('three-kingdoms')");
assert(!html.includes('three-prologue-cut'));
run("run().storyId='THR-PRO-S02';THREE_COMPLETE_ACTIONS.switchPhase(STORIES['THR-PRO-S02'],'main');run().dialogueCursor=STORIES['THR-PRO-S02'].dialogues.length;render()");
assert(!html.includes('three-prologue-cut'));
action('next');
assert.equal(run('run().storyId'),'THR-PRO-S03');
assert.equal(run('run().dialogueCursor'),1);
assert(html.includes('three-prologue-cut'),'the final PRO-S02 tap requests the black cut');
run('render()');assert(!html.includes('three-prologue-cut'),'a re-render does not flash again');
assert.equal(run('run().dialogueCursor'),1,'the transition does not advance dialogue');
reloadAtSameMoment();assert(!html.includes('three-prologue-cut'),'resume does not flash');
action('advance-dialogue');assert(!html.includes('three-prologue-cut'),'later lines do not flash');
assert.equal(run('run().dialogueCursor'),2);
console.log('PASS: prologue black cut only on the final PRO-S02 tap; no repeat on render, later lines or reload.');

function fullPlay(choiceIndex,wrong=false) {
  boot(true);run("resumeEra('three-kingdoms')");
  assert.equal(run('run().storyId'),'THR-PRO-S01');
  const seen=[],firstQuestions=[],chosen=[],statesSeen=new Set();
  let guard=0;
  while(!run("run().completed && run().currentChapter==='THR-C23'")) {
    assert(++guard<6500,'story dead end '+JSON.stringify(snapshot()));
    const s=snapshot();
    if(s.screen==='game') {
      const source=allScenes.find(v=>v.sceneId===s.story), entries=copy('THREE_COMPLETE_ACTIONS.phaseEntries(THREE_COMPLETE_ACTIONS.currentSource())');
      assert(source,'known scene '+s.story);statesSeen.add(s.phase.phase);
      if(s.phase.phase==='choice') {
        const priorStats=copy('run().stats'); click({choice:String(choiceIndex)});
        assert.deepEqual(copy('run().stats'),priorStats,'dialogue choice is unscored');
        assert.equal(run('THREE_COMPLETE_ACTIONS.phaseState(THREE_COMPLETE_ACTIONS.currentSource()).phase'),'branch');
        assert.equal(run('run().dialogueCursor'),1);
        chosen.push(source.sceneId); continue;
      }
      const line=entries[s.cursor-1];assert(line,'readable current line');
      if(s.phase.phase!=='hints')seen.push(line.lineId);
      if((source.sceneId==='THR-PRO-S03'&&s.cursor===2)||(source.sceneId==='THR-C01-S01'&&s.phase.phase==='branch'&&s.cursor===2)||(source.sceneId==='THR-C01-S06'&&s.phase.phase==='join'&&s.cursor===1))reloadAtSameMoment();
      const currentBefore=copy('THREE_COMPLETE_ACTIONS.book().readSceneIds');
      if(s.phase.phase!=='hints' && s.phase.phase!=='finished')assert(!currentBefore.includes(source.sceneId),'scene unlocked before final common line');
      action(s.phase.phase==='branch'&&s.cursor===entries.length?'result-next':s.cursor===entries.length?'next':'advance-dialogue');
      continue;
    }
    if(s.screen==='quiz') {
      const q=copy('activeQuestion()'), row=copy('THREE_COMPLETE_ACTIONS.currentSchedule()');
      assert(s.book.readSceneIds.includes(row.quizAfterSceneId),'quiz after fully read anchor');
      if(s.answer===null) {
        firstQuestions.push(q.officialQuestionId);
        assert.equal(s.phase.phase,'quiz');
        assert(!html.includes(q.threeExam.clue),'answer clue not a pre-answer title');
        if(q.officialQuestionId==='official-79-advanced-09') {
          const explanation=run('THREE_COMPLETE_ACTIONS.safeExplanation(activeQuestion())');
          for(const word of ['신숭겸','김부','일리천'])assert(!explanation.includes(word),'future explanation leaked: '+word);
        }
        if(s.index===1)reloadAtSameMoment();
        click({threeAnswer:String(wrong?(q.answer+1)%q.choices.length:q.answer)});action('three-submit');
        assert(Number.isInteger(run('run().questionAnswer')));assert(html.includes('three-safe-explanation'));
      } else action('quiz-next');
      continue;
    }
    if(s.screen==='complete') {
      const next=Number(s.chapter.slice(-2))+1;run('startAvailableChapter('+JSON.stringify('THR-C'+String(next).padStart(2,'0'))+')');continue;
    }
    throw Error('Unexpected screen '+s.screen);
  }
  const expected=allScenes.flatMap(scene=>[...scene.main,...(scene.choices.length?[scene.choices[choiceIndex].spokenLine,...scene.choices[choiceIndex].reply]:[]),...scene.join].map(line=>line.lineId));
  assert.deepEqual(seen,expected,'every line in approved order, exactly once on the selected path');
  assert.equal(chosen.length,71);assert.equal(firstQuestions.length,98);assert.equal(new Set(firstQuestions).size,98);
  assert.equal(run('THREE_COMPLETE_ACTIONS.book().readSceneIds.length'),218);
  assert.equal(run('THREE_COMPLETE_ACTIONS.book().answeredQuestionIds.length'),98);
  assert.equal(run('THREE_COMPLETE_ACTIONS.book().unlockedQuestionIds.length'),99);
  assert.equal(run("meta().completedChapters.filter(id=>id.startsWith('THR-C')).length"),23);
  assert.equal(run("meta().eraProgress['three-kingdoms-v3'].progress"),100);
  assert.deepEqual([...statesSeen].sort(),['branch','choice','hints','join','main'].sort());
  assert.equal(run('THREE_RECORD_BOOK.questionRows().length'),99);
  assert.equal(run('THREE_STORY_SCRIPT.mnemonics.filter(m=>m.sceneIds.every(id=>THREE_COMPLETE_ACTIONS.book().readSceneIds.includes(id))).length'),23);
  assert(run("THREE_COMPLETE_ACTIONS.safeExplanation(THREE_STORY_RUNTIME.questionByOfficialId.get('official-79-advanced-09')).includes('일리천')"));
  console.log('PASS: complete 218-scene '+(choiceIndex?'B':'A')+' path, 71 choices, 98 first quizzes, '+(wrong?'wrong':'correct')+' answers, 99 unlocked questions, saved phase/queue continuity.');
}
if(!process.argv.includes('--optional-only')){fullPlay(0,false); fullPlay(1,true);}

// An additional review restores the interrupted branch without replaying its spoken choice.
boot(true);run("resumeEra('three-kingdoms')");
run("THREE_COMPLETE_ACTIONS.book().readSceneIds.push('THR-C03-S02'); run().storyId='THR-C01-S01';run().dialogueSceneId='THR-C01-S01';THREE_COMPLETE_ACTIONS.switchPhase(STORIES['THR-C01-S01'],'choice');THREE_COMPLETE_ACTIONS.choose(1);run().dialogueCursor=2;save()");
const before=snapshot();
assert(run("THREE_COMPLETE_ACTIONS.startReview('official-73-basic-05')"));
while(run('screen')==='game')action('next');
const optional=copy('activeQuestion()');click({threeAnswer:String(optional.answer)});action('three-submit');reloadAtSameMoment();action('quiz-next');
const after=snapshot();
for(const key of ['story','phase','cursor','pending'])assert.deepEqual(after[key],before[key],'review restores '+key);
assert.equal(after.book.answeredQuestionIds.filter(id=>id===optional.officialQuestionId).length,1);
assert.equal(run('run().activeQuestionId'),null);
console.log('PASS: optional additional review survives reload and returns to the exact interrupted branch.');

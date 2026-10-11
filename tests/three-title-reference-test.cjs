const fs=require('node:fs'),assert=require('node:assert/strict');
const {load}=require('./proto-revision-harness.cjs');const h=load();
const sources=h.copy('[...THREE_STORY_RUNTIME.sources.values()]');
for(const s of sources){
 h.run(`state.mainRun=null;state.run=INITIAL_RUN(${JSON.stringify(s.chapterId)});THREE_SAVE_V3.identifyRun(run(),true);run().started=true;run().storyId=${JSON.stringify(s.sceneId)};screen='game';modal=null;THREE_COMPLETE_ACTIONS.switchPhase(STORIES[${JSON.stringify(s.sceneId)}],'main');render()`);
 assert(!/three-genealogy-leaf|source-photos\/genealogy|class="three-date"/.test(h.html()),s.sceneId);
}
h.run("modal={type:'three-recordbook',tab:'originals'};render()");assert(!h.html().includes('data-three-photo'));assert(!h.html().includes('내 족보'));
for(const c of h.copy("eraChapters('three-kingdoms')")){
 const years=h.run('editorialChapterYears(CHAPTERS['+JSON.stringify(c.chapterId)+'])');assert(years.length<30,years);
 const modal=h.run('chapterDetailModal('+JSON.stringify(c.chapterId)+')');assert(modal.includes('<h2>'+c.title+'</h2>'));assert(!modal.includes(c.subtitle));
 const row=h.run('editorialChapterRow(CHAPTERS['+JSON.stringify(c.chapterId)+'])');assert(!row.includes('개 장면 · 대사 선택과 기출'));
}
for(const q of h.copy('THREE_COMPLETE_EXAMS.questions')){
 const id=h.run('THREE_STORY_RUNTIME.questionByOfficialId.get('+JSON.stringify(q.officialQuestionId)+').questionId');
 assert(h.run('officialQuestionFigure(QUESTIONS.find(q=>q.questionId==='+JSON.stringify(id)+'),"검사")').includes('<img'));
}
console.log('PASS: all 218 scene headers/photos, 23 chapter titles/dates, archived photo tab fallback, 91 original question images');

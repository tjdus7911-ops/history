/* Stable scene/question/event IDs; chapter ownership and save schema change once. */
const CHAPTER_SPLIT_VERSION=1;
const CHAPTER_ID_MIGRATION=Object.fromEntries(Array.from({length:10},(_,i)=>['ch'+String(i+2).padStart(2,'0'),'ch'+String(i+3).padStart(2,'0')]));
const CH02_MOVED_SCENE_IDS=Object.values(STORIES).filter(s=>s.chapterId==='ch01'&&s.year>=935&&s.year<1000).map(s=>s.sceneId);
for(const id of CH02_MOVED_SCENE_IDS)STORIES[id].chapterId='ch02';
Object.assign(CHAPTERS.ch01,{title:'새로운 나라',subtitle:'918–930, 이곳에서 살아가기 시작했다',years:'918 — 930',completeStoryId:'ch01_clear_930'});
CHAPTERS.ch02={chapterId:'ch02',episode:'goryeo',number:'02',title:'하나가 된 나라',subtitle:'935–943, 전쟁 끝에 하나가 된 고려',years:'935 — 943',thumbnail:ASSETS['future-flow'].src,startStoryId:'ch02_open_935',completeStoryId:'ch01_farewell',implemented:true};
const SPLIT_CHAPTER_ORDER=Object.values(CHAPTERS).sort((a,b)=>Number(a.number)-Number(b.number));
SPLIT_CHAPTER_ORDER.forEach((info,index)=>Object.assign(info,{order:index+1,previousChapterId:SPLIT_CHAPTER_ORDER[index-1]?.chapterId||null,nextChapterId:SPLIT_CHAPTER_ORDER[index+1]?.chapterId||null}));

STORIES.ch01_belonging.nextStoryId='ch01_ending_930';
STORIES.ch01_ending_930=ch01Scene('ch01_ending_930',930,'고려 사람','route-songak',[
  ['player','thinking','고려 사람.','thought'],
  ['player','thinking','처음 이곳에 떨어졌을 때만 해도 돌아갈 생각밖에 없었는데.','thought'],
  ['player','thinking','어느새 나는 이곳의 승리를 우리라고 부르는 사람과 함께 살고 있었다.','thought']
],{nextStoryId:'ch01_clear_930',visibleCharacters:[]});
STORIES.ch01_clear_930=ch01Scene('ch01_clear_930',930,'새로운 나라','future-flow',[
  ['narrator','neutral','CH.01 새로운 나라 · 918 — 930','narration'],
  ['narrator','neutral','고려라는 나라가 태어났고','narration'],
  ['narrator','neutral','우리도 이곳에서 살아가기 시작했다.','narration']
],{sceneEffect:'blackout',cinematicSub:'열두 해의 이야기를 기록합니다.',continueLabel:'CHAPTER CLEAR',completeChapter:true,visibleCharacters:[]});
STORIES.ch02_open_935=ch01Scene('ch02_open_935',935,'그로부터 5년','future-flow',[
  ['narrator','neutral','그로부터 5년.','narration'],['narrator','neutral','935년','narration']
],{chapterId:'ch02',sceneEffect:'blackout',cinematicSub:'CH.02 하나가 된 나라',continueLabel:'이야기 시작',nextStoryId:'ch01_jump_935',visibleCharacters:[]});
STORIES.ch02_news_935=ch01Scene('ch02_news_935',935,'고려의 문을 두드린 사람','ch02-doyun-shop-interior-949',[
  ['narrator','neutral','장부를 맞추던 중, 한 상인이 숨을 몰아쉬며 뛰어들었다.','narration'],
  ['merchant','surprised','견훤이 고려로 왔답니다!'],['doyun','surprised','……누가 왔다고?'],
  ['merchant','surprised','견훤 말입니다!'],['player','surprised','잠깐. 후백제를 세운 그 견훤?']
],{chapterId:'ch02',nextStoryId:'ch01_gyeonhwon'});
STORIES.ch01_jump_935.nextStoryId='ch02_news_935';
STORIES.ch01_farewell.title='하나가 된 나라';
STORIES.ch01_farewell.dialogues=ch01Lines([
  ['narrator','neutral','CH.02 하나가 된 나라 · 935 — 943','narration'],
  ['narrator','neutral','전쟁이 끝났고','narration'],['narrator','neutral','고려는 하나의 나라가 되었다.','narration']
]);
STORIES.ch01_farewell.cinematicSub='하나가 된 나라의 이야기를 기록합니다.';

// Restore the original market illustration added in a1d58d8; no new image.
ASSETS['market-later-three-kingdoms'].src='assets/scenes/market-later-three-kingdoms.png';
ASSETS['market-later-three-kingdoms'].embeddedCharacters=true;
STORIES.market.backgroundImage=ASSETS['market-later-three-kingdoms'].src;
const PROTECTED_OPENING_SCENES=new Set(['prologue','sleep','voice','house','outfit_question','outfit_gift']);
const BACKGROUND_ONLY_SCENE_IDS=[];
for(const s of Object.values(STORIES)){
  if(PROTECTED_OPENING_SCENES.has(s.sceneId))continue;
  const spoken=(s.dialogues||[]).filter(line=>['npc','player'].includes(line.speakerType));
  s.visibleCharacters=[...new Set(spoken.map(line=>line.characterId).filter(Boolean))];
  s.sceneType=spoken.length?'dialogue':s.dialogues?.some(line=>line.speakerType==='thought')?'thought':'narration';
  if(!s.visibleCharacters.length)BACKGROUND_ONLY_SCENE_IDS.push(s.sceneId);
}
for(const q of QUESTIONS.filter(q=>q.chapterId==='ch01')){
  // Mixed-period legacy questions belong with the latest historical event they test.
  const late=['ch01-boss','ch01-test-03','ch01-test-04'].includes(q.questionId)||q.year>=935||STORIES[q.relatedSceneId]?.chapterId==='ch02';
  if(late)q.chapterId='ch02';
  if(q.questionId==='ch01-test-03')q.year=936;
  if(q.questionId==='ch01-test-04')q.year=937;
  if(q.retired)q.year=STORIES[q.relatedSceneId]?.year||q.year;
  if(q.questionId==='ch01-official-76-advanced-10')q.resumeStoryId='ch01_integration';
  if(q.reviewOnly)q.resumeStoryId=CHAPTERS[q.chapterId].completeStoryId;
}
for(const card of CH01_HISTORY_CARDS)card.chapterId=typeof card.year==='number'&&card.year<=930?'ch01':'ch02';
const SPLIT_STORY_QUESTION_IDS={ch01:CH01_STORY_QUESTION_IDS.filter(id=>QUESTIONS.find(q=>q.questionId===id).chapterId==='ch01'),ch02:CH01_STORY_QUESTION_IDS.filter(id=>QUESTIONS.find(q=>q.questionId===id).chapterId==='ch02')};
const SPLIT_REVIEW_IDS={ch01:CH01_REVIEW_IDS.filter(id=>QUESTIONS.find(q=>q.questionId===id).chapterId==='ch01'),ch02:CH01_REVIEW_IDS.filter(id=>QUESTIONS.find(q=>q.questionId===id).chapterId==='ch02')};
for(const id of ['ch01','ch02'])Object.assign(CHAPTERS[id],{questionCount:SPLIT_STORY_QUESTION_IDS[id].length,reviewQuestionCount:SPLIT_REVIEW_IDS[id].length});
const prepareBeforeChapterSplit=prepareChapterCarry;
prepareChapterCarry=function(run,id){if(id==='ch02'){ensureGoryeoOutfit(run);run.characterStates={...run.characterStates,doyun:{...run.characterStates?.doyun,...ch01Age(935)},player:{...run.characterStates?.player,characterAge:23,characterEraVariant:'unchanged'}};return run}return prepareBeforeChapterSplit(run,id)};
const finishBeforeChapterSplit=finishChapter;
finishChapter=function(state){const id=state.run.currentChapter,result=finishBeforeChapterSplit(state);if(id==='ch02'){
  // The original fallback award was for the first chapter. Keep new awards distinct.
  if(!state.meta.achievements.includes('ch02-unified-country'))state.meta.achievements.push('ch02-unified-country');
  if(!state.meta.endings.includes('ch02-unified-country'))state.meta.endings.push('ch02-unified-country');
}return result};

function splitSnapshot(snapshot,id){
  const s=cloneRun(snapshot||{});s.currentChapter=id;s.replayChapterId=s.mode==='replay'?id:null;
  s.questionResults=Object.fromEntries(Object.entries(s.questionResults||{}).filter(([qid])=>QUESTIONS.find(q=>q.questionId===qid)?.chapterId===id));
  s.choices=(s.choices||[]).filter(c=>STORIES[c.scene]?.chapterId===id).map(c=>({...c,chapterId:id}));
  s.visited=(s.visited||[]).filter(sceneId=>STORIES[sceneId]?.chapterId===id);
  if(id==='ch01'){s.storyId='ch01_clear_930';s.characterStates={...s.characterStates,doyun:{...s.characterStates?.doyun,...ch01Age(930)}};s.doyunLegacy={...s.doyunLegacy,merchantGuild:false};delete s.doyunLegacy.plannedName;s.sharedEvents=(s.sharedEvents||[]).filter(event=>!['doyun_guild_name_seed'].includes(event))}
  else s.storyId='ch01_farewell';
  return s;
}
function splitRunRecord(record,id){const r=cloneRun(record);r.chapterId=id;r.finalRun=splitSnapshot({...r.finalRun,choices:r.choices||r.finalRun?.choices||[],questionResults:r.questionResults||r.finalRun?.questionResults||{}},id);r.choices=r.finalRun.choices;r.questionResults={...r.finalRun.questionResults};r.questionScore=questionScore(id,r.questionResults);r.migratedFromCombinedChapter=true;return r}
function splitChapterRecord(record,id){const r=cloneRun(record);Object.assign(r,splitRunRecord({...r,finalRun:r.finalRun||r.latestRun?.finalRun||r.firstRun?.finalRun||{}},id));for(const key of ['firstRun','latestRun'])if(r[key])r[key]=splitRunRecord(r[key],id);r.bestQuestionScore=Math.max(r.firstRun?.questionScore.correct||0,r.latestRun?.questionScore.correct||0,r.questionScore.correct);return r}
const migrateBeforeChapterSplit=migrateSave;
migrateSave=function(raw){
  if(!raw||raw.chapterSplitVersion===CHAPTER_SPLIT_VERSION){const s=migrateBeforeChapterSplit(raw);for(const key of ['currentMainProgress','currentProgress'])if(raw?.[key])s[key]=cloneRun(raw[key]);s.version=SAVE_VERSION;s.chapterSplitVersion=CHAPTER_SPLIT_VERSION;return s}
  const input=cloneRun(raw),oldMeta=cloneRun(input.meta||{}),oldRun=cloneRun(input.run||{});
  const lateRun=r=>Boolean(r&&((r.storyId==='complete'||r.storyId==='future_flow')&&!r.ch01ExpansionVersion&&!r.sharedEvents?.includes('doyun_guild_name_seed')?false:(STORIES[r.pending?.sourceSceneId||r.storyId]?.chapterId==='ch02'||QUESTIONS.find(q=>q.questionId===r.activeQuestionId)?.chapterId==='ch02'||(r.completed&&(r.ch01ExpansionVersion||r.sharedEvents?.includes('doyun_guild_name_seed'))))));
  const hadLater=(oldMeta.completedChapters||[]).some(id=>id!=='ch01')||[input.run,input.mainRun].some(r=>r&&r.currentChapter!=='ch01');
  const combinedComplete=(oldMeta.completedChapters||[]).includes('ch01');
  const grantSecond=hadLater||(combinedComplete&&(oldMeta.chapterRecords?.ch01?.finalRun?.ch01ExpansionVersion||oldMeta.chapterRecords?.ch01?.finalRun?.sharedEvents?.includes('doyun_guild_name_seed')||oldRun.ch01ExpansionVersion));
  const inSecond=[input.run,input.mainRun].some(r=>r?.currentChapter==='ch01'&&lateRun(r));
  if(combinedComplete&&!oldMeta.chapterRecords?.ch01&&oldRun.currentChapter==='ch01'&&oldRun.completed){oldMeta.chapterRecords={...oldMeta.chapterRecords,ch01:{chapterId:'ch01',completed:true,finalRun:oldRun,questionResults:oldRun.questionResults||{},choices:oldRun.choices||[]}};oldMeta.chapterRuns={...oldMeta.chapterRuns,ch01:[{...oldMeta.chapterRecords.ch01,runId:1,mode:'main'}]}}
  const remapRun=r=>{if(!r)return;const old=r.currentChapter||(String(r.storyId).startsWith('ch03_')?'ch03':String(r.storyId).startsWith('ch02_')?'ch02':'ch01');r.currentChapter=old==='ch01'?(lateRun(r)?'ch02':'ch01'):(CHAPTER_ID_MIGRATION[old]||old);if(r.replayChapterId)r.replayChapterId=r.replayChapterId==='ch01'?r.currentChapter:(CHAPTER_ID_MIGRATION[r.replayChapterId]||r.replayChapterId);r.choices=(r.choices||[]).map(c=>({...c,chapterId:STORIES[c.scene]?.chapterId||CHAPTER_ID_MIGRATION[c.chapterId]||c.chapterId}));if(r.chapterStart)remapRun(r.chapterStart);if(r.currentChapter==='ch02'&&r.completed)r.storyId='ch01_farewell';if(r.currentChapter==='ch01'&&r.completed)r.storyId='ch01_clear_930';return r};
  remapRun(input.run);remapRun(input.mainRun);
  const m=input.meta||(input.meta={});
  m.chapterSplitArchive={version:raw.version,chapterRecords:oldMeta.chapterRecords||{},chapterRuns:oldMeta.chapterRuns||{},playthroughs:oldMeta.playthroughs||[],reviewSession:oldMeta.ch01ReviewSession||null,reviewAttempts:oldMeta.ch01ReviewAttempts||[]};
  for(const key of ['chapterRecords','chapterRuns']){m[key]={};for(const [id,value] of Object.entries(oldMeta[key]||{})){if(id==='ch01'){m[key].ch01=key==='chapterRuns'?value.map(r=>splitRunRecord(r,'ch01')):splitChapterRecord(value,'ch01');if(grantSecond)m[key].ch02=key==='chapterRuns'?value.map(r=>splitRunRecord(r,'ch02')):splitChapterRecord(value,'ch02')}else{const newId=CHAPTER_ID_MIGRATION[id]||id;const mapRecord=r=>{r=cloneRun(r);r.chapterId=newId;remapRun(r.finalRun);if(r.finalRun)r.finalRun.currentChapter=newId;for(const k of ['firstRun','latestRun'])if(r[k])r[k]=mapRecord(r[k]);r.choices=(r.choices||[]).map(c=>({...c,chapterId:STORIES[c.scene]?.chapterId||newId}));return r};m[key][newId]=key==='chapterRuns'?value.map(mapRecord):mapRecord(value)}}}
  m.completedChapters=[...new Set((oldMeta.completedChapters||[]).map(id=>CHAPTER_ID_MIGRATION[id]||id))];
  if(inSecond&&!m.completedChapters.includes('ch01'))m.completedChapters.push('ch01');
  if(grantSecond&&!m.completedChapters.includes('ch02'))m.completedChapters.push('ch02');
  m.completedChapters.sort((a,b)=>Number(CHAPTERS[a]?.number||0)-Number(CHAPTERS[b]?.number||0));
  if(inSecond&&!m.chapterRecords.ch01){const snapshot=splitSnapshot(input.mainRun?.currentChapter==='ch02'?input.mainRun:input.run,'ch01'),record=splitRunRecord({runId:1,mode:'main',completed:true,finalRun:snapshot,questionResults:snapshot.questionResults,choices:snapshot.choices,completedAt:new Date(0).toISOString()},'ch01');m.chapterRuns.ch01=[record];m.chapterRecords.ch01={...record,firstRun:record,latestRun:record,bestQuestionScore:record.questionScore.correct,runsCount:1}}
  m.playthroughs=(oldMeta.playthroughs||[]).flatMap(r=>r.chapterId==='ch01'?(grantSecond?['ch01','ch02']:['ch01']).map(id=>({...r,chapterId:id,questionScore:questionScore(id,oldMeta.chapterRecords?.ch01?.questionResults||{}),migratedFromCombinedChapter:true})):[{...r,chapterId:CHAPTER_ID_MIGRATION[r.chapterId]||r.chapterId}]);
  for(const id of ['ch01','ch02'])if(m.chapterRecords[id]){const runs=m.chapterRuns[id]||[];m.chapterRecords[id].bestQuestionScore=Math.max(m.chapterRecords[id].bestQuestionScore||0,...runs.map(r=>r.questionScore.correct));m.chapterRecords[id].runsCount=runs.length||m.chapterRecords[id].runsCount||1}
  for(const [qid,record] of Object.entries(m.questionRecords||{}))record.chapterId=QUESTIONS.find(q=>q.questionId===qid)?.chapterId||CHAPTER_ID_MIGRATION[record.chapterId]||record.chapterId;
  for(const container of [input,m])for(const key of ['currentMainProgress','currentProgress','currentChapter','replayChapterId','nextChapter','previousChapter'])if(container[key]){if(typeof container[key]==='string')container[key]=CHAPTER_ID_MIGRATION[container[key]]||container[key];else for(const field of ['chapterId','currentChapter','replayChapterId','nextChapter','previousChapter'])if(container[key][field])container[key][field]=CHAPTER_ID_MIGRATION[container[key][field]]||container[key][field]}
  // Old combined review attempts are archived, never mislabelled as a shorter exam.
  delete m.ch01ReviewSession;delete m.ch01ReviewAttempts;
  input.chapterSplitVersion=CHAPTER_SPLIT_VERSION;
  if(input.version===9)input.version=10;
  const s=migrateBeforeChapterSplit(input);s.version=10;s.chapterSplitVersion=CHAPTER_SPLIT_VERSION;
  for(const key of ['currentMainProgress','currentProgress'])if(input[key])s[key]=cloneRun(input[key]);
  if(!raw.run&&s.run.completed&&s.run.currentChapter==='ch01')s.run.storyId='ch01_clear_930';
  return s;
};

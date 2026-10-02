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

// Anonymous residents and merchants live inside complete scene illustrations, not standing layers.
ASSETS['village-rumor'].src='assets/scenes/village-residents-rumor-918.png';
ASSETS['village-rumor'].embeddedCharacters=true;
ASSETS['market-later-three-kingdoms'].src='assets/scenes/market-rumors-918.png';
ASSETS['market-later-three-kingdoms'].embeddedCharacters=true;
STORIES.market.backgroundImage=ASSETS['market-later-three-kingdoms'].src;
const PROTECTED_OPENING_SCENES=new Set(['prologue','sleep','voice','house','outfit_question','outfit_gift']);
const BACKGROUND_ONLY_SCENE_IDS=[];
for(const s of Object.values(STORIES)){
  if(PROTECTED_OPENING_SCENES.has(s.sceneId))continue;
  const spoken=(s.dialogues||[]).filter(line=>['npc','player'].includes(line.speakerType));
  const ambientScene=s.sceneType==='ambient-rumor';
  s.visibleCharacters=ambientScene?[]:[...new Set(spoken.map(line=>line.characterId).filter(id=>id&&CHARACTERS[id]?.presentation!=='ambient'&&CHARACTERS[id]?.show!==false))];
  s.sceneType=ambientScene?'ambient-rumor':spoken.length?'dialogue':s.dialogues?.some(line=>line.speakerType==='thought')?'thought':'narration';
  if(!s.visibleCharacters.length)BACKGROUND_ONLY_SCENE_IDS.push(s.sceneId);
}
for(const q of QUESTIONS.filter(q=>q.chapterId==='ch01')){
  q.year??=STORIES[q.relatedSceneId]?.year;
  // Mixed-period legacy questions belong with the latest historical event they test.
  const late=['ch01-boss','ch01-test-03','ch01-test-04'].includes(q.questionId)||q.year>=935||STORIES[q.relatedSceneId]?.chapterId==='ch02';
  if(late)q.chapterId='ch02';
  if(q.questionId==='ch01-test-03')q.year=936;
  if(q.questionId==='ch01-test-04')q.year=937;
  if(q.questionId==='ch01-official-76-advanced-10')q.resumeStoryId='ch01_integration';
  if(q.reviewOnly)q.resumeStoryId=CHAPTERS[q.chapterId].completeStoryId;
}
for(const card of CH01_HISTORY_CARDS)card.chapterId=typeof card.year==='number'&&card.year<=930?'ch01':'ch02';
const CH03_HISTORY_CARDS=[
  {id:'nobi-inspection',chapterId:'ch03',year:956,title:'노비안검법',body:'광종은 억울하게 노비가 된 사람의 신분을 조사해 양인으로 회복시켰다. 호족의 기반을 줄이고 왕권을 강화하는 효과가 있었다.',keywords:['956','양인 회복','호족 견제'],source:CH01_SOURCES.policy},
  {id:'gwageo-exam',chapterId:'ch03',year:958,title:'과거제와 쌍기',body:'광종은 후주 출신 쌍기의 건의를 받아 과거제를 시행해 새로운 관료를 선발했다.',keywords:['958','쌍기','과거제'],source:CH01_SOURCES.policy},
  {id:'gwangjong-official-robes',chapterId:'ch03',year:960,title:'공복 제정',body:'광종은 관리의 품계에 따라 공복의 색을 구분해 관료 질서를 눈에 보이게 했다.',keywords:['광종','공복','품계'],source:CH01_SOURCES.policy},
  {id:'gwangjong-gwangdeok',chapterId:'ch03',year:'광종 재위',title:'광덕',body:'광덕은 광종이 사용한 독자적 연호이다.',keywords:['광덕','광종','독자적 연호'],source:CH01_SOURCES.policy},
  {id:'gwangjong-reign-titles',chapterId:'ch03',year:960,title:'광덕에서 준풍으로',body:'광종은 광덕에 이어 준풍이라는 연호를 사용해 왕의 권위를 드러냈다.',keywords:['광덕 → 준풍','광종','왕의 권위'],source:CH01_SOURCES.policy},
  {id:'gwangjong-authority',chapterId:'ch03',year:'광종 재위',title:'광종의 왕권 강화',body:'노비안검법·과거제·공복·독자적 연호와 호족 견제는 왕권 강화라는 공통 방향으로 이어졌다.',keywords:['호족 견제','새 관료','왕권 강화'],source:CH01_SOURCES.policy}
];
CH01_HISTORY_CARDS.push(...CH03_HISTORY_CARDS);
const SCENE_LEARNING_CONCEPTS={
  rumor:['궁예_왕건','후고구려','고려건국','918_936'],foundation:['918_936'],ch01_missing_traders:['927_전쟁상황','후삼국_사건순서'],ch01_gongsan:['공산전투_고창전투','신숭겸'],ch01_gochang:['공산전투_고창전투','고창전투'],
  ch01_gyeonhwon:['견훤_신검','금산사'],ch01_silla:['견훤귀순_경순왕귀순'],ch01_victory:['일리천_후삼국통일'],ch01_unity:['일리천_후삼국통일'],future_flow:['후삼국_사건순서'],ch01_sasimgwan:['사심관_기인','사심관'],ch01_giin:['사심관_기인'],ch01_refugee_family:['발해유민','서경_북진'],ch01_north:['서경_북진'],ch01_welfare:['취민유도'],ch01_hunyo:['훈요10조_시무28조']
};
for(const [sceneId,learningConceptIds] of Object.entries(SCENE_LEARNING_CONCEPTS))STORIES[sceneId].learningConceptIds=learningConceptIds;
const SPLIT_STORY_QUESTION_IDS={
  ch01:CH01_STORY_QUESTION_IDS.filter(id=>QUESTIONS.find(q=>q.questionId===id).chapterId==='ch01'),
  ch02:CH01_STORY_QUESTION_IDS.filter(id=>QUESTIONS.find(q=>q.questionId===id).chapterId==='ch02'),
  ch03:['ch02-test-01','ch02-official-69-advanced-10','ch02-test-02','ch02-official-74-advanced-11','ch02-test-robes','ch02-test-03','ch02-official-76-advanced-50','ch02-test-04','ch02-official-77-advanced-14','ch02-test-05','ch02-official-78-advanced-11','ch02-test-06']
};
const SPLIT_REVIEW_IDS={
  ch01:CH01_REVIEW_IDS.filter(id=>QUESTIONS.find(q=>q.questionId===id).chapterId==='ch01'),
  ch02:['ch01-official-70-advanced-10','ch01-official-73-basic-10','ch01-official-74-advanced-10','ch01-official-76-advanced-10','ch01-review-10'],
  ch03:[...CH03_REVIEW_IDS]
};
// Story scenes link to concepts and an ordered question pool. Queue mode is used
// where one historical experience now produces one or two immediate questions.
const SCENE_QUESTION_LINKS={
  rumor:['ch01-test-01','ch01-test-02'],
  ch01_missing_traders:['ch01-story-war-context'],
  ch01_gongsan:['ch01-story-gongsan','ch01-story-gongsan-battle'],
  ch01_gochang:['ch01-story-gochang-name','ch01-story-gochang'],
  ch01_gyeonhwon:['ch01-story-gyeonhwon','ch02-story-geumsansa'],
  ch01_silla:['ch01-story-silla'],
  ch01_unity:['ch02-story-illyecheon'],
  future_flow:['ch01-boss'],
  ch01_sasimgwan:['ch02-story-sasimgwan'],
  ch01_giin:['ch01-story-integration'],
  ch01_refugee_family:['ch02-story-balhae-refugees'],
  ch01_north:['ch01-story-north'],
  ch01_welfare:['ch02-story-welfare'],
  ch01_hunyo:['ch01-story-hunyo']
};
for(const [sceneId,linkedQuestionIds] of Object.entries(SCENE_QUESTION_LINKS)){
  const s=STORIES[sceneId];
  if(!s)continue;
  s.linkedQuestionIds=[...linkedQuestionIds];
  s.questionSequenceMode='queue';
  s.quizId=linkedQuestionIds[0];
}
const LEGACY_CHAIN_SCENE_QUESTION_LINKS={
  ch02_policy_memory:['ch02-test-01','ch02-official-69-advanced-10'],
  ch02_ssanggi:['ch02-test-02','ch02-official-74-advanced-11'],
  ch02_hyunwoo_official:['ch02-test-robes'],
  ch02_reign_titles:['ch02-test-03','ch02-official-76-advanced-50'],
  ch02_reign_followup:['ch02-test-04','ch02-official-77-advanced-14'],
  ch02_night_discussion:['ch02-test-05','ch02-official-78-advanced-11'],
  ch02_memory_retrieval:['ch02-test-06']
};
for(const [sceneId,linkedQuestionIds] of Object.entries(LEGACY_CHAIN_SCENE_QUESTION_LINKS))if(STORIES[sceneId])STORIES[sceneId].linkedQuestionIds=[...linkedQuestionIds];
const CONCEPT_QUESTION_INDEX={};
for(const q of QUESTIONS.filter(item=>!item.retired))for(const conceptId of q.conceptIds||[])(CONCEPT_QUESTION_INDEX[conceptId]||(CONCEPT_QUESTION_INDEX[conceptId]=[])).push(q.questionId);
for(const id of ['ch01','ch02','ch03'])Object.assign(CHAPTERS[id],{questionCount:SPLIT_STORY_QUESTION_IDS[id].length,reviewQuestionCount:SPLIT_REVIEW_IDS[id].length});
Object.assign(CHAPTERS.ch03,{years:'949 — 960',completeStoryId:'ch02_chapter_clear'});
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
  const s=migrateBeforeChapterSplit(input);s.version=SAVE_VERSION;s.chapterSplitVersion=CHAPTER_SPLIT_VERSION;
  for(const key of ['currentMainProgress','currentProgress'])if(input[key])s[key]=cloneRun(input[key]);
  if(!raw.run&&s.run.completed&&s.run.currentChapter==='ch01')s.run.storyId='ch01_clear_930';
  return s;
};

const CH03_STORY_VERSION=2;
const migrateBeforeCh03Completion=migrateSave;
migrateSave=function(raw){
  const migrated=migrateBeforeCh03Completion(raw),previousVersion=Number(raw?.version||0);
  const legacyLateScenes=new Set(['ch02_reign_titles','ch02_reign_followup','ch02_purge','ch02_complete','ch02_night_reflection','ch02_mystery']);
  const legacyLateQuestions=new Set(['ch02-test-03','ch02-test-04','ch02-test-05','ch02-official-76-advanced-50','ch02-official-77-advanced-14','ch02-official-78-advanced-11']);
  const redirect=(run,source)=>{
    if(!run||run.currentChapter!=='ch03'||run.completed||previousVersion>=11)return;
    if(!legacyLateScenes.has(source?.storyId)&&!legacyLateQuestions.has(source?.activeQuestionId))return;
    run.storyId='ch02_official_robes_walk';run.pending=null;run.activeQuestionId=null;run.questionAnswer=null;run.dialogueSceneId=null;run.dialogueCursor=1;
    run.entryEffectsApplied=(run.entryEffectsApplied||[]).filter(id=>id!=='ch02_official_robes_walk');
  };
  redirect(migrated.run,raw?.run);redirect(migrated.mainRun,raw?.mainRun);
  migrated.version=SAVE_VERSION;migrated.chapterSplitVersion=CHAPTER_SPLIT_VERSION;migrated.ch03StoryVersion=CH03_STORY_VERSION;
  return migrated;
};

/* CH.01–04 learning-block audit: verified official pools, three-question sets, and story pacing. */
const STORY_AUDIT_VERSION=1;
const verifiedStoryQuestion=data=>question({
  isOfficial:true,sourceVerified:true,sourceType:'official_exam',sourceStatus:'verified_from_attached_pdf',
  questionAuditStatus:'VERIFIED_OFFICIAL',exactTranscription:true,reviewOnly:false,retired:false,
  examType:`제${data.examRound}회 한국사능력검정시험 ${data.examLevel} 실제 기출`,
  source:`국사편찬위원회 한국사능력검정시험 제${data.examRound}회 ${data.examLevel} · 사용자 제공 문제지·정답표 기반 모바일 전사`,
  rewardKnowledge:3,...data
});

const q65a10=verifiedStoryQuestion({
  questionId:'ch02-official-65-advanced-10',chapterId:'ch02',year:937,era:'고려 초기',king:'태조',chapterCandidate:'ch02',
  historicalEventIds:['taejo-integration','heukchang','yeokbunjeon'],conceptIds:['taejo','local-integration','heukchang','yeokbunjeon'],
  relatedSceneId:'ch01_sasimgwan',relatedHistoricalEventId:'taejo-integration',historicalEvent:'태조의 안정과 통합 정책',relatedIllustrationId:'ch02-trade-room-935',
  questionType:'왕의 업적 판단형',formatLabel:'실제 기출 · 태조 통합 정책',difficulty:'중',
  passage:'<탐구 활동 보고서>\n1. 주제: (가), 안정과 통합을 꾀하다\n2. 방법: 『고려사』 사료 검색 및 분석\n3. 사료 내용과 분석\n○ 명주의 순식이 투항하자 왕씨 성을 내리다. — 지방 호족 포섭\n○ 「정계」와 「계백료서」를 지어 반포하다. — 관리의 규범 제시\n○ 흑창을 두어 가난한 백성에게 곡식을 빌려주다. — 민생 안정',
  question:'(가) 왕의 재위 시기에 있었던 사실로 옳은 것은?',
  choices:['개국 공신에게 역분전을 지급하였다.','외침에 대비하여 광군을 조직하였다.','광덕, 준풍 등의 독자적 연호를 사용하였다.','관학 진흥을 목적으로 양현고를 운영하였다.','주전도감을 설치하여 해동통보를 발행하였다.'],answer:0,
  explanation:'자료의 왕은 고려 태조입니다. 태조는 후삼국 통일 뒤 개국 공신에게 역분전을 지급했습니다. 광군은 정종, 광덕·준풍은 광종, 양현고는 예종, 주전도감과 해동통보는 숙종 때의 사실입니다.',
  choiceExplanations:['태조는 개국 공신에게 역분전을 지급했습니다.','광군은 정종 때 조직되었습니다.','광덕과 준풍은 광종의 연호입니다.','양현고는 예종 때 설치되었습니다.','주전도감과 해동통보는 숙종 때입니다.'],
  examKeywords:['태조','호족 포섭','흑창','역분전','정계','계백료서'],
  gameMemory:'김부를 경주의 사심관으로 삼고 호족의 자제를 기인으로 둔 장면처럼, 태조는 사람을 포섭해 나라를 묶었습니다. 같은 왕이 개국 공신에게 역분전을 지급했으므로 정답은 ①입니다.',storyConnection:'김부·사심관·기인과 태조의 통합 정책을 연결합니다.',
  resumeStoryId:'ch01_refugee_family',examRound:65,examYear:2023,examLevel:'심화',questionNumber:10,sourcePage:3,
  sourceFile:'제65회 한국사능력검정시험 심화 문제지.pdf',answerFile:'제65회 한국사능력검정시험 심화 정답표.pdf'
});
const q65a11=verifiedStoryQuestion({
  questionId:'ch04-official-65-advanced-11',chapterId:'ch04',year:983,era:'고려 초기',king:'성종',chapterCandidate:'ch04',
  historicalEventIds:['seongjong-twelve-mok'],conceptIds:['seongjong','twelve-mok','local-officials','chronology'],
  relatedSceneId:'ch03_gukjagam',relatedHistoricalEventId:'seongjong-twelve-mok',historicalEvent:'성종의 12목 설치 시기',relatedIllustrationId:'ch03-returning-merchant',
  questionType:'연표 시기 판단형',formatLabel:'실제 기출 · 12목 연표',difficulty:'상',
  passage:'처음으로 12목을 설치하고 조서를 내려 말하기를, “부지런히 정사를 돌보면서 매번 신하들의 충고를 구하고 있다. 낮은 곳의 이야기를 듣고 멀리 보고자 어질고 현명한 이들의 힘을 빌리려고 한다. 이에 수령들의 공로에 의지해 백성들의 바람에 부합하고자 한다. 『우서』의 12목 제도를 본받아 시행하니, 주나라가 8백 년간 지속하였듯이 우리의 국운도 길이 이어질 것이다.”라고 하였다.\n연표: 918 고려 건국 — 945 왕규의 난 — 1009 강조의 정변 — 1196 최충헌 집권 — 1270 개경 환도 — 1351 공민왕 즉위',
  question:'다음 상황이 나타난 시기를 연표에서 옳게 고른 것은?',choices:['(가)','(나)','(다)','(라)','(마)'],answer:1,
  explanation:'성종이 12목을 설치하고 지방관을 파견한 것은 983년입니다. 945년 왕규의 난과 1009년 강조의 정변 사이인 (나)에 해당합니다.',
  choiceExplanations:['918~945년 사이가 아닙니다.','983년은 945년과 1009년 사이입니다.','1009~1196년 사이가 아닙니다.','1196~1270년 사이가 아닙니다.','1270~1351년 사이가 아닙니다.'],
  examKeywords:['성종','983년','12목','지방관','연표'],
  gameMemory:'도윤상단의 교역로에 중앙에서 내려온 관리가 도착한다는 소식이 바로 12목 지방관 파견이었습니다. 성종 때인 983년을 연표에 놓으면 정답은 ②입니다.',storyConnection:'상단의 교역로와 12목 지방관 파견을 연결합니다.',
  resumeStoryId:'ch03_policy_effect',examRound:65,examYear:2023,examLevel:'심화',questionNumber:11,sourcePage:3,
  sourceFile:'제65회 한국사능력검정시험 심화 문제지.pdf',answerFile:'제65회 한국사능력검정시험 심화 정답표.pdf'
});
const q66a09=verifiedStoryQuestion({
  questionId:'ch02-official-66-advanced-09',chapterId:'ch02',year:935,era:'후삼국',king:'견훤',chapterCandidate:'ch02',
  historicalEventIds:['gyeon-hwon-geumsansa','later-three-kingdoms'],conceptIds:['gyeon-hwon','geumsansa','singgeom','later-three-kingdoms'],
  relatedSceneId:'ch01_gyeonhwon',relatedHistoricalEventId:'gyeon-hwon-geumsansa',historicalEvent:'견훤의 금산사 탈출과 고려 귀순',relatedIllustrationId:'ch02-trade-room-935',
  questionType:'인물 업적형',formatLabel:'실제 기출 · 견훤',difficulty:'중',
  passage:'금산사는 삼국 시대에 창건된 유서 깊은 사찰입니다. 완산주를 도읍으로 국가를 세운 인물이 아들 신검 등에 의해 유폐되었다가 탈출한 곳으로 잘 알려져 있습니다. 이 사찰은 국보인 미륵전을 비롯하여 여러 점의 국가 지정 문화재를 보유하고 있습니다.',
  question:"밑줄 그은 '인물'에 대한 설명으로 옳은 것은?",choices:['독서삼품과를 실시하였다.','동진으로부터 불교를 수용하였다.','후당과 오월에 사신을 파견하였다.','광평성 등의 정치 기구를 마련하였다.','화랑도를 국가적인 조직으로 개편하였다.'],answer:2,
  explanation:'인물은 후백제를 세운 견훤입니다. 견훤은 중국의 후당과 오월에 사신을 파견했습니다. 독서삼품과와 화랑도 정비는 신라, 동진의 불교 수용은 백제 침류왕, 광평성은 궁예와 관련됩니다.',
  choiceExplanations:['독서삼품과는 신라 원성왕 때입니다.','동진에서 불교를 수용한 것은 백제 침류왕 때입니다.','견훤은 후당과 오월에 사신을 파견했습니다.','광평성은 궁예가 마련했습니다.','화랑도를 국가 조직으로 정비한 것은 신라 진흥왕입니다.'],
  examKeywords:['견훤','금산사','신검','완산주','후당','오월'],
  gameMemory:'935년 나이 든 거래 상인이 “견훤이 신검에게 금산사에 갇혔다가 탈출해 고려로 왔다”고 전했습니다. 완산주에 후백제를 세운 견훤의 대외 활동은 후당·오월 사신 파견이므로 정답은 ③입니다.',storyConnection:'상인이 전한 견훤·금산사·신검 소식을 연결합니다.',
  resumeStoryId:'ch01_silla',examRound:66,examYear:2023,examLevel:'심화',questionNumber:9,sourcePage:3,
  sourceFile:'66회 한국사_문제지(심화).pdf',answerFile:'66회 한국사_정답표(심화).pdf'
});
const q67b10=verifiedStoryQuestion({
  questionId:'ch02-official-67-basic-10',chapterId:'ch02',year:937,era:'고려 초기',king:'태조',chapterCandidate:'ch02',
  historicalEventIds:['late-silla-hojok','taejo-integration'],conceptIds:['hojok','local-power','castle-lord','general'],
  relatedSceneId:'ch01_sasimgwan',relatedHistoricalEventId:'taejo-integration',historicalEvent:'호족의 성장과 지방 지배',relatedIllustrationId:'ch02-trade-room-935',
  questionType:'역사 용어 판단형',formatLabel:'실제 기출 · 호족',difficulty:'하',
  passage:'<역사 학습 내용 정리>\n(가)\n1. 신라 말 지방에서 독자적인 세력을 형성하며 성장함\n2. 일정한 지역에서 정치·군사·경제적 지배권을 장악함\n3. 스스로 성주 또는 장군이라고 칭하기도 함',
  question:'(가)에 들어갈 내용으로 적절한 것은?',choices:['성골','호족','권문세족','신진 사대부'],answer:1,
  explanation:'신라 말 지방에서 독자적인 세력을 형성하고 성주 또는 장군이라 칭한 세력은 호족입니다.',
  choiceExplanations:['성골은 신라의 최고 골품입니다.','호족은 신라 말 지방에서 성장한 세력입니다.','권문세족은 고려 후기의 지배 세력입니다.','신진 사대부는 고려 후기에 성장했습니다.'],
  examKeywords:['호족','신라 말','지방 세력','성주','장군'],
  gameMemory:'김부를 사심관으로 삼고 호족의 자제를 기인으로 둔 장면은 지방 호족의 힘을 포섭하고 견제하려는 태조의 선택이었습니다. 정답은 ② 호족입니다.',storyConnection:'김부·사심관·기인 장면과 호족을 연결합니다.',
  resumeStoryId:'ch01_refugee_family',examRound:67,examYear:2023,examLevel:'기본',questionNumber:10,sourcePage:3,
  sourceFile:'67회 한국사_문제지(기본).pdf',answerFile:'67회 한국사_정답표(기본).pdf'
});
const q67b11=verifiedStoryQuestion({
  questionId:'ch02-official-67-basic-11',chapterId:'ch02',year:938,era:'고려 초기',king:'태조',chapterCandidate:'ch02',
  historicalEventIds:['balhae-refugees','taejo-welfare'],conceptIds:['taejo','balhae-refugees','gyeon-hwon','heukchang'],
  relatedSceneId:'ch01_refugee_family',relatedHistoricalEventId:'balhae-refugees',historicalEvent:'태조의 민족 통합과 흑창',relatedIllustrationId:'ch02-trade-room-935',
  questionType:'왕의 업적 판단형',formatLabel:'실제 기출 · 태조',difficulty:'중',
  passage:'○ 고려 (가)이/가 민족 통합을 위해 노력한 점에 대해 이야기 나눠볼까요?\n○ 발해 유민을 받아들였고, 조상의 제사를 지낼 수 있도록 배려해 주었죠.\n○ 오랜 기간 적대 관계였던 견훤까지 포용한 일도 빼놓을 수 없지요.',
  question:'(가) 왕의 업적으로 옳은 것은?',choices:['흑창을 두었다.','강화도로 천도하였다.','과거제를 처음 실시하였다.','전민변정도감을 설치하였다.'],answer:0,
  explanation:'발해 유민을 받아들이고 견훤을 포용한 왕은 태조입니다. 태조는 빈민 구제를 위해 흑창을 설치했습니다.',
  choiceExplanations:['태조는 빈민 구제 기관인 흑창을 설치했습니다.','강화 천도는 고종 때입니다.','과거제는 광종 때 처음 실시했습니다.','전민변정도감은 공민왕 때 설치되었습니다.'],
  examKeywords:['태조','발해 유민','견훤 포용','흑창'],
  gameMemory:'도윤의 장사 공간에 발해계 가족이 찾아왔고, 전쟁 뒤 시장의 빈 바구니를 보며 백성의 삶을 살폈습니다. 발해 유민을 받아들인 태조가 둔 빈민 구제 기관은 흑창이므로 정답은 ①입니다.',storyConnection:'북쪽 손님과 전쟁 뒤 민생 장면을 흑창에 연결합니다.',
  resumeStoryId:'ch01_welfare',examRound:67,examYear:2023,examLevel:'기본',questionNumber:11,sourcePage:3,
  sourceFile:'67회 한국사_문제지(기본).pdf',answerFile:'67회 한국사_정답표(기본).pdf'
});
const q68a09=verifiedStoryQuestion({
  questionId:'ch04-official-68-advanced-09',chapterId:'ch04',year:983,era:'고려 초기',king:'성종',chapterCandidate:'ch04',
  historicalEventIds:['seongjong-twelve-mok','seongjong-gukjagam'],conceptIds:['seongjong','twelve-mok','gukjagam','sangpyeongchang'],
  relatedSceneId:'ch03_gukjagam',relatedHistoricalEventId:'seongjong-state-system',historicalEvent:'성종의 제도 정비',relatedIllustrationId:'ch03-gukjagam',
  questionType:'시대 상황 판단형',formatLabel:'실제 기출 · 성종',difficulty:'중상',
  passage:'상평창을 양경(兩京)과 12목에 설치하고 교서를 내렸다. “『한서』 식화지에 그해가 풍년인지 흉년인지에 따라 곡식을 풀거나 거두어들이는 것을 행한다.”라고 하였다. …… 경시에 맡겨 곡식을 풀거나 거두어들이도록 하라.',
  question:"밑줄 그은 '교서'를 내린 왕의 재위 기간에 볼 수 있는 모습으로 가장 적절한 것은?",choices:['서적포에서 책을 인쇄하는 관리','국자감 학생들을 가르치는 박사','양현고의 재정을 관리하는 관원','9재 학당에서 유교 경전을 읽는 학생','청연각의 소장 도서를 분류하는 학사'],answer:1,
  explanation:'상평창을 양경과 12목에 설치한 왕은 성종입니다. 성종 때 국자감을 설치했으므로 국자감 박사의 모습을 볼 수 있습니다. 나머지는 주로 고려 중기 이후의 사실입니다.',
  choiceExplanations:['서적포는 숙종 때 설치되었습니다.','성종은 국자감을 설치했습니다.','양현고는 예종 때 설치되었습니다.','9재 학당은 최충의 문헌공도입니다.','청연각은 예종 때 설치되었습니다.'],
  examKeywords:['성종','상평창','12목','국자감'],
  gameMemory:'현우가 주인공을 국자감으로 데려가 “사람을 뽑는 것만으로는 부족하고 가르칠 곳도 필요하다”고 했습니다. 성종 재위의 모습은 국자감 박사이므로 정답은 ②입니다.',storyConnection:'현우와 방문한 국자감 장면을 성종 시기 판단에 연결합니다.',
  resumeStoryId:'ch03_policy_effect',examRound:68,examYear:2023,examLevel:'심화',questionNumber:9,sourcePage:2,
  sourceFile:'68회 한국사_문제지(심화).pdf',answerFile:'68회 한국사_정답표(심화).pdf'
});
const q68a11=verifiedStoryQuestion({
  questionId:'ch03-official-68-advanced-11',chapterId:'ch03',year:960,era:'고려 초기',king:'광종',chapterCandidate:'ch03',
  historicalEventIds:['gwangjong-authority','gwangjong-naturalized-officials'],conceptIds:['gwangjong','nobi-inspection','naturalized-officials','gwangdeok','junpung'],
  relatedSceneId:'ch02_night_discussion',relatedHistoricalEventId:'gwangjong-authority',historicalEvent:'광종의 왕권 강화 정책',relatedIllustrationId:'ch02-complete',
  questionType:'왕의 업적 판단형',formatLabel:'실제 기출 · 광종',difficulty:'중',
  passage:'○ 공은 대송(大宋) 강남 천주 출신이다. …… 예빈성 낭중에 임명하고 집 한 채를 내려주었다.\n○ 이것은 고려에 귀화한 채인범의 묘지명으로 현존하는 고려 시대 묘지명 중 가장 오래된 것입니다. 노비안검법을 실시한 (가)은/는 채인범, 쌍기 등의 귀화인들을 적극 등용하였습니다.',
  question:'(가) 왕의 재위 시기에 있었던 사실로 옳은 것은?',choices:['최승로가 시무 28조를 건의하였다.','경기에 한하여 과전법이 실시되었다.','신돈이 전민변정도감의 판사가 되었다.','빈민 구제 기관인 흑창이 처음 설치되었다.','광덕, 준풍 등의 독자적 연호가 사용되었다.'],answer:4,
  explanation:'노비안검법을 실시하고 쌍기를 등용한 왕은 광종입니다. 광종은 광덕과 준풍이라는 독자적 연호를 사용했습니다.',
  choiceExplanations:['시무 28조는 성종 때입니다.','과전법은 고려 말 공양왕 때입니다.','신돈과 전민변정도감은 공민왕 때입니다.','흑창은 태조 때 설치되었습니다.','광덕과 준풍은 광종의 독자적 연호입니다.'],
  examKeywords:['광종','노비안검법','쌍기','귀화인','광덕','준풍'],
  gameMemory:'길상이 양인으로 돌아온 노비안검법, 현우의 과거를 건의한 쌍기, 시장에서 들은 광덕과 준풍이 모두 광종의 장면이었습니다. 정답은 ⑤입니다.',storyConnection:'길상·현우·시장 연호 장면을 하나의 광종 개혁으로 연결합니다.',
  resumeStoryId:'ch02_complete',examRound:68,examYear:2023,examLevel:'심화',questionNumber:11,sourcePage:3,
  sourceFile:'68회 한국사_문제지(심화).pdf',answerFile:'68회 한국사_정답표(심화).pdf'
});
QUESTIONS.push(q65a10,q65a11,q66a09,q67b10,q67b11,q68a09,q68a11);

const OFFICIAL_CLASSIFICATION={
  'ch01-official-69-basic-10':{era:'후삼국',king:'궁예',year:918,chapterCandidate:'ch01',historicalEventIds:['taebong','goryeo-foundation-918'],conceptIds:['gungye','taebong','goryeo-foundation-918']},
  'ch01-official-79-advanced-09':{era:'후삼국',king:'궁예',year:918,chapterCandidate:'ch01',historicalEventIds:['taebong'],conceptIds:['gungye','taebong']},
  'ch01-official-70-advanced-10':{era:'후삼국',king:'태조',year:936,chapterCandidate:'ch02',historicalEventIds:['gongsan-battle','gochang-battle','illyecheon'],conceptIds:['later-three-kingdoms-chronology','kim-bu','illyecheon']},
  'ch01-official-73-basic-10':{era:'후삼국',king:'견훤',year:935,chapterCandidate:'ch02',historicalEventIds:['gyeon-hwon-geumsansa'],conceptIds:['gyeon-hwon','geumsansa','singgeom']},
  'ch01-official-74-advanced-10':{era:'후삼국',king:'태조',year:936,chapterCandidate:'ch02',historicalEventIds:['silla-surrender','illyecheon'],conceptIds:['kim-bu','silla-surrender','illyecheon']},
  'ch01-official-76-advanced-10':{era:'후삼국',king:'태조',year:936,chapterCandidate:'ch02',historicalEventIds:['illyecheon'],conceptIds:['gyeon-hwon','singgeom','illyecheon']},
  'ch03-official-75-basic-12':{era:'고려 초기',king:'태조',year:937,chapterCandidate:'ch02',historicalEventIds:['taejo-integration'],conceptIds:['taejo','sasimgwan','local-control']},
  'ch02-official-69-advanced-10':{era:'고려 초기',king:'태조',year:943,chapterCandidate:'ch02',historicalEventIds:['taejo-policy','hunyo-ten-injunctions'],conceptIds:['taejo','hunyo-ten-injunctions']},
  'ch02-official-74-advanced-11':{era:'고려 초기',king:'광종',year:956,chapterCandidate:'ch03',historicalEventIds:['gwangjong-authority'],conceptIds:['gwangjong','nobi-inspection','gwangdeok','junpung']},
  'ch02-official-76-advanced-50':{era:'고려 초기',king:'광종',year:960,chapterCandidate:'ch03',historicalEventIds:['gwangjong-reign-titles'],conceptIds:['gwangjong','nobi-inspection','gwangdeok']},
  'ch02-official-77-advanced-14':{era:'고려 초기',king:'광종',year:960,chapterCandidate:'ch03',historicalEventIds:['gwangjong-reign-titles'],conceptIds:['gwangjong','junpung','imperial-style']},
  'ch02-official-78-advanced-11':{era:'고려 초기',king:'광종',year:958,chapterCandidate:'ch03',historicalEventIds:['gwangjong-958-gwageo'],conceptIds:['gwangjong','ssanggi','gwageo']},
  'ch03-official-75-basic-10':{era:'고려 초기',king:'성종',year:983,chapterCandidate:'ch04',historicalEventIds:['seongjong-state-system'],conceptIds:['seongjong','choe-seungro','simu-28','gukjagam','twelve-mok']}
};
for(const [id,data] of Object.entries(OFFICIAL_CLASSIFICATION)){const q=QUESTIONS.find(item=>item.questionId===id);if(q)Object.assign(q,data,{sourceType:'official_exam',sourceVerified:true,sourceStatus:'verified_from_attached_pdf',questionAuditStatus:'VERIFIED_OFFICIAL'})}

const QUESTION_POOLS={
  'pool-ch01-foundation':{questionPoolId:'pool-ch01-foundation',chapterId:'ch01',conceptIds:['gungye','wang-geon','goryeo-foundation-918'],questionIds:['ch01-official-69-basic-10','ch01-official-79-advanced-09']},
  'pool-ch01-gongsan':{questionPoolId:'pool-ch01-gongsan',chapterId:'ch01',conceptIds:['gongsan-battle','shin-sung-gyeom','wang-geon','gyeon-hwon'],questionIds:[]},
  'pool-ch01-gochang':{questionPoolId:'pool-ch01-gochang',chapterId:'ch01',conceptIds:['gochang-battle','gongsan-battle','chronology'],questionIds:[]},
  'pool-ch02-gyeonhwon':{questionPoolId:'pool-ch02-gyeonhwon',chapterId:'ch02',conceptIds:['gyeon-hwon','geumsansa','singgeom'],questionIds:['ch01-official-73-basic-10','ch02-official-66-advanced-09']},
  'pool-ch02-silla':{questionPoolId:'pool-ch02-silla',chapterId:'ch02',conceptIds:['kim-bu','silla-surrender','taejo-integration'],questionIds:[]},
  'pool-ch02-illyecheon':{questionPoolId:'pool-ch02-illyecheon',chapterId:'ch02',conceptIds:['illyecheon','singgeom','later-three-kingdoms-chronology'],questionIds:['ch01-official-76-advanced-10','ch01-official-74-advanced-10','ch01-official-70-advanced-10']},
  'pool-ch02-integration':{questionPoolId:'pool-ch02-integration',chapterId:'ch02',conceptIds:['hojok','sasimgwan','giin','taejo-integration'],questionIds:['ch02-official-67-basic-10','ch03-official-75-basic-12','ch02-official-65-advanced-10']},
  'pool-ch02-north-welfare':{questionPoolId:'pool-ch02-north-welfare',chapterId:'ch02',conceptIds:['balhae-refugees','northern-expansion','seogyeong','heukchang'],questionIds:['ch02-official-67-basic-11']},
  'pool-ch02-hunyo':{questionPoolId:'pool-ch02-hunyo',chapterId:'ch02',conceptIds:['hunyo-ten-injunctions','taejo'],questionIds:['ch02-official-69-advanced-10']},
  'pool-ch03-nobi':{questionPoolId:'pool-ch03-nobi',chapterId:'ch03',conceptIds:['gwangjong','nobi-inspection','authority'],questionIds:['ch02-official-74-advanced-11','ch03-official-68-advanced-11']},
  'pool-ch03-gwageo':{questionPoolId:'pool-ch03-gwageo',chapterId:'ch03',conceptIds:['gwangjong','ssanggi','gwageo'],questionIds:['ch02-official-78-advanced-11']},
  'pool-ch03-synthesis':{questionPoolId:'pool-ch03-synthesis',chapterId:'ch03',conceptIds:['nobi-inspection','gwageo','ssanggi','gwangdeok','junpung','authority'],questionIds:['ch02-official-74-advanced-11','ch03-official-68-advanced-11','ch02-official-78-advanced-11']},
  'pool-ch03-symbols':{questionPoolId:'pool-ch03-symbols',chapterId:'ch03',conceptIds:['official-robes','gwangdeok','junpung','imperial-style'],questionIds:['ch02-official-76-advanced-50','ch02-official-77-advanced-14']},
  'pool-ch04-seongjong':{questionPoolId:'pool-ch04-seongjong',chapterId:'ch04',conceptIds:['seongjong','choe-seungro','simu-28','twelve-mok','gukjagam'],questionIds:['ch03-official-75-basic-10','ch04-official-68-advanced-09','ch04-official-65-advanced-11']}
};
const buildQuestionSet=data=>{const pool=QUESTION_POOLS[data.questionPoolId],officialQuestionIds=(pool?.questionIds||[]).filter(id=>{const q=QUESTIONS.find(item=>item.questionId===id);return q?.isOfficial&&q.sourceVerified&&!q.retired}),requiredCount=data.requiredCount||3,verifiedCount=officialQuestionIds.length;return{...data,requiredCount,officialQuestionIds,verifiedCount,missingQuestionCount:Math.max(0,requiredCount-verifiedCount),status:verifiedCount>=requiredCount?'ready':'waiting_for_source'}};
const QUESTION_SETS=Object.fromEntries([
  buildQuestionSet({questionSetId:'ch01-foundation',chapterId:'ch01',afterSceneId:'foundation',resumeStoryId:'ch01_trade_start',questionPoolId:'pool-ch01-foundation',conceptIds:['gungye','wang-geon','goryeo-foundation-918']}),
  buildQuestionSet({questionSetId:'ch01-gongsan',chapterId:'ch01',afterSceneId:'ch01_gongsan',resumeStoryId:'ch01_conflict',questionPoolId:'pool-ch01-gongsan',conceptIds:['gongsan-battle','shin-sung-gyeom']}),
  buildQuestionSet({questionSetId:'ch01-gochang',chapterId:'ch01',afterSceneId:'ch01_gochang',resumeStoryId:'ch01_belonging',questionPoolId:'pool-ch01-gochang',conceptIds:['gochang-battle','gongsan-battle']}),
  buildQuestionSet({questionSetId:'ch02-gyeonhwon',chapterId:'ch02',afterSceneId:'ch01_gyeonhwon',resumeStoryId:'ch01_silla',questionPoolId:'pool-ch02-gyeonhwon',conceptIds:['gyeon-hwon','geumsansa','singgeom']}),
  buildQuestionSet({questionSetId:'ch02-silla-surrender',chapterId:'ch02',afterSceneId:'ch01_silla',resumeStoryId:'ch01_jump_936',questionPoolId:'pool-ch02-silla',conceptIds:['kim-bu','silla-surrender']}),
  buildQuestionSet({questionSetId:'ch02-illyecheon',chapterId:'ch02',afterSceneId:'future_flow',resumeStoryId:'ch01_integration',questionPoolId:'pool-ch02-illyecheon',conceptIds:['illyecheon','later-three-kingdoms-chronology']}),
  buildQuestionSet({questionSetId:'ch02-taejo-integration',chapterId:'ch02',afterSceneId:'ch01_sasimgwan',resumeStoryId:'ch01_refugee_family',questionPoolId:'pool-ch02-integration',conceptIds:['hojok','sasimgwan','giin']}),
  buildQuestionSet({questionSetId:'ch02-north-welfare',chapterId:'ch02',afterSceneId:'ch01_refugee_family',resumeStoryId:'ch01_welfare',questionPoolId:'pool-ch02-north-welfare',conceptIds:['balhae-refugees','northern-expansion','heukchang']}),
  buildQuestionSet({questionSetId:'ch02-hunyo',chapterId:'ch02',afterSceneId:'ch01_hunyo',resumeStoryId:'ch01_guild_seed',questionPoolId:'pool-ch02-hunyo',conceptIds:['hunyo-ten-injunctions','taejo']}),
  buildQuestionSet({questionSetId:'ch03-nobi-inspection',chapterId:'ch03',afterSceneId:'ch02_policy_memory',resumeStoryId:'ch02_noble_night',questionPoolId:'pool-ch03-nobi',conceptIds:['nobi-inspection','authority']}),
  buildQuestionSet({questionSetId:'ch03-gwageo',chapterId:'ch03',afterSceneId:'ch02_ssanggi',resumeStoryId:'ch02_exam_eve',questionPoolId:'pool-ch03-gwageo',conceptIds:['ssanggi','gwageo']}),
  buildQuestionSet({questionSetId:'ch03-gwangjong-synthesis',chapterId:'ch03',afterSceneId:'ch02_night_discussion',resumeStoryId:'ch02_complete',questionPoolId:'pool-ch03-synthesis',conceptIds:['nobi-inspection','gwageo','gwangdeok','junpung','authority']}),
  buildQuestionSet({questionSetId:'ch03-imperial-symbols',chapterId:'ch03',afterSceneId:'ch02_reign_followup',resumeStoryId:'ch02_purge',questionPoolId:'pool-ch03-symbols',conceptIds:['official-robes','gwangdeok','junpung','imperial-style']}),
  buildQuestionSet({questionSetId:'ch04-seongjong-system',chapterId:'ch04',afterSceneId:'ch03_gukjagam',resumeStoryId:'ch03_policy_effect',questionPoolId:'pool-ch04-seongjong',conceptIds:['seongjong','choe-seungro','simu-28','twelve-mok','gukjagam']})
].map(set=>[set.questionSetId,set]));

for(const q of QUESTIONS.filter(item=>['ch01','ch02','ch03','ch04'].includes(item.chapterId)&&!item.isOfficial))Object.assign(q,{retired:true,reviewOnly:true,sourceStatus:'retired_self_authored_main_story',questionAuditStatus:'SELF_AUTHORED'});
const MAIN_QUESTION_IDS={
  ch01:[],
  ch02:['ch01-official-76-advanced-10','ch01-official-74-advanced-10','ch01-official-70-advanced-10','ch02-official-67-basic-10','ch03-official-75-basic-12','ch02-official-65-advanced-10'],
  ch03:['ch02-official-74-advanced-11','ch03-official-68-advanced-11','ch02-official-78-advanced-11'],
  ch04:['ch03-official-75-basic-10','ch04-official-68-advanced-09','ch04-official-65-advanced-11']
};
const REVIEW_QUESTION_IDS={
  ch01:['ch01-official-69-basic-10','ch01-official-79-advanced-09'],
  ch02:['ch01-official-73-basic-10','ch02-official-66-advanced-09','ch01-official-74-advanced-10','ch01-official-76-advanced-10','ch01-official-70-advanced-10','ch02-official-67-basic-10','ch03-official-75-basic-12','ch02-official-65-advanced-10','ch02-official-67-basic-11','ch02-official-69-advanced-10'],
  ch03:['ch02-official-74-advanced-11','ch03-official-68-advanced-11','ch02-official-78-advanced-11','ch02-official-76-advanced-50','ch02-official-77-advanced-14'],
  ch04:['ch03-official-75-basic-10','ch04-official-68-advanced-09','ch04-official-65-advanced-11']
};
for(const q of QUESTIONS.filter(item=>item.isOfficial&&!item.retired))q.reviewOnly=!MAIN_QUESTION_IDS[q.chapterId]?.includes(q.questionId);
for(const chapterId of ['ch01','ch02','ch03','ch04']){
  SPLIT_STORY_QUESTION_IDS[chapterId]=[...MAIN_QUESTION_IDS[chapterId]];
  SPLIT_REVIEW_IDS[chapterId]=[...REVIEW_QUESTION_IDS[chapterId]];
  Object.assign(CHAPTERS[chapterId],{questionCount:MAIN_QUESTION_IDS[chapterId].length,reviewQuestionCount:REVIEW_QUESTION_IDS[chapterId].length});
}

const auditedSceneIds=new Set(Object.values(QUESTION_SETS).map(set=>set.afterSceneId));
for(const s of Object.values(STORIES).filter(scene=>['ch01','ch02','ch03','ch04'].includes(scene.chapterId))){
  delete s.quizId;delete s.linkedQuestionIds;delete s.linkedOfficialQuestions;delete s.questionSequenceMode;delete s.questionSetId;delete s.questionSetStatus;delete s.officialQuestionSlot;
}
const attachQuestionSet=(setId)=>{const set=QUESTION_SETS[setId],s=STORIES[set.afterSceneId];s.questionSetId=setId;s.questionSetStatus=set.status;s.questionSetResumeStoryId=set.resumeStoryId;s.officialQuestionSlot={conceptIds:[...set.conceptIds],linkedOfficialQuestions:[...set.officialQuestionIds],requiredCount:set.requiredCount,verifiedCount:set.verifiedCount,missingQuestionCount:set.missingQuestionCount,officialQuestionStatus:set.status};if(set.status==='ready'){s.linkedQuestionIds=[...set.officialQuestionIds];s.linkedOfficialQuestions=[...set.officialQuestionIds];s.questionSequenceMode='queue'}};
Object.keys(QUESTION_SETS).forEach(attachQuestionSet);

// CH.01 keeps emotion and avoids spoilers; all three learning blocks wait for enough verified sources.
Object.assign(STORIES.rumor,{sceneType:'ambient-rumor',visibleCharacters:[],dialogues:ch01Lines([
  ['resident_a','serious','궁예가 그렇게 쫓겨날 줄 누가 알았겠소.','npc','주민 A'],
  ['resident_b','surprised','왕건 장군이 새 왕이 되고, 나라 이름은 고려라 한다더군.','npc','주민 B'],
  ['player','surprised','……궁예가 쫓겨났다고?'],
  ['doyun','suspicious','자네 정말 아무것도 모르는군.']
])});
Object.assign(STORIES.ch01_jump_930,{dialogues:ch01Lines([
  ['narrator','neutral','공산의 패배 뒤에도 우리는 장사를 다시 시작했다.','narration'],
  ['doyun','serious','이번에는 물건을 한 수레에 전부 싣지 맙시다.'],
  ['player','neutral','927년에 배웠네.'],
  ['doyun','tired','비싼 수업료였소.'],
  ['narrator','neutral','세 해 뒤, 막혔던 남쪽 길에서 다른 소식이 올라왔다.','narration']
])});

// CH.03 removes self-authored interruptions. The verified synthesis set runs after all lived reforms.
Object.assign(STORIES.ch02_policy_memory,{nextStoryId:'ch02_noble_night'});
Object.assign(STORIES.ch02_ssanggi,{nextStoryId:'ch02_exam_eve'});
Object.assign(STORIES.ch02_hyunwoo_official,{nextStoryId:'ch02_reign_titles'});
Object.assign(STORIES.ch02_reign_titles,{nextStoryId:'ch02_reign_followup'});
Object.assign(STORIES.ch02_reign_followup,{nextStoryId:'ch02_purge'});
Object.assign(STORIES.ch02_night_discussion,{nextStoryId:'ch02_complete'});
Object.assign(STORIES.ch02_memory_retrieval,{nextStoryId:'ch02_chapter_clear',dialogues:[
  dialogueLine('player','thinking','길상과 노비안검법, 현우와 과거제·쌍기, 관청 거리의 공복, 시장의 광덕과 준풍이 차례로 떠올랐다.','thought'),
  dialogueLine('player','serious','법과 시험, 관리의 옷과 왕의 연호. 서로 다른 장면이 광종의 왕권 강화라는 한 방향으로 이어졌다.','thought')
]});
Object.assign(STORIES.ch02_realization,{storyActive:false,nextStoryId:'ch02_chapter_clear'});

// CH.04 finishes all history questions before the friendship and farewell arc.
const CH04_REMOVED_WRAPPERS={
  ch03_exam_75:'ch03_policy_effect',ch03_trade_practice:'ch03_three_friends',ch03_exam_practice_05:'ch03_three_friends',
  ch03_choe_practice:'ch03_history_reflection',ch03_exam_practice_06:'ch03_history_reflection',ch03_exam_practice_07:'ch03_history_reflection',
  ch03_timeline_practice:'ch03_courtyard',ch03_exam_practice_08:'ch03_courtyard',ch03_exam_practice_09:'ch03_courtyard'
};
for(const [sceneId,nextStoryId] of Object.entries(CH04_REMOVED_WRAPPERS)){if(!STORIES[sceneId])continue;Object.assign(STORIES[sceneId],{storyActive:false,nextStoryId});delete STORIES[sceneId].quizId;delete STORIES[sceneId].linkedQuestionIds;delete STORIES[sceneId].questionSequenceMode;delete STORIES[sceneId].questionSetId}
Object.assign(STORIES.ch03_gukjagam,{nextStoryId:'ch03_policy_effect'});
Object.assign(STORIES.ch03_policy_effect,{nextStoryId:'ch03_three_friends'});
Object.assign(STORIES.ch03_three_friends,{nextStoryId:'ch03_history_reflection'});
Object.assign(STORIES.ch03_history_reflection,{nextStoryId:'ch03_courtyard'});
STORIES.ch03_doyun_soliloquy=scene({
  sceneId:'ch03_doyun_soliloquy',chapterId:'ch04',historicalEventId:'seongjong-state-system',year:982,
  location:'도윤상단 · 안채',title:'나쁘지 않은 장사',illustrationId:'ch03-doyun-guild-interior',timeOfDay:'late-night',
  enterCharacterStates:{doyun:{characterAge:88,ageState:'elder_982',ageVariant:'elder_982',outfit:'guild_master',healthState:'frail',isAlive:true}},
  dialogues:[
    dialogueLine('narrator','neutral','주인공이 잠시 밖으로 나가자, 도윤은 혼자 상단의 불빛을 바라보았다.','narration'),
    dialogueLine('doyun','tired','가게 하나면 된다고 생각했는데.'),
    dialogueLine('narrator','neutral','마당 너머로 장부를 덮고 짐을 정리하는 사람들의 소리가 희미하게 들렸다.','narration'),
    dialogueLine('doyun','weak_smile','참 멀리도 왔군.'),
    dialogueLine('doyun','weak_smile','……나쁘지 않은 장사였소.')
  ],nextStoryId:'ch03_death'
});
Object.assign(STORIES.ch03_farewell,{nextStoryId:'ch03_doyun_soliloquy',dialogues:[
  dialogueLine('doyun','tired','처음 봤을 때는 이상한 옷을 입고 쓰러져 있더니…….'),dialogueLine('player','worried','또 그 얘기야?'),
  dialogueLine('doyun','weak_smile','이제는 마지막일지도 모르는데 들어주시오.'),dialogueLine('narrator','neutral','주인공은 아무 말도 하지 않았다.','narration'),
  dialogueLine('doyun','sad','결국 내가 먼저 가는군.'),dialogueLine('player','sad','…….'),dialogueLine('doyun','serious','그 표정 하지 마시오. 나는 충분히 살았소.'),
  dialogueLine('doyun','weak_smile','가게도 만들었고. 상단도 만들었고. 먹고 싶은 것도 많이 먹었고. 좋은 사람들도 만났고.'),
  dialogueLine('player','sad','그게 마지막에 할 말이냐.'),dialogueLine('doyun','laugh','중요한 일이오.'),
  dialogueLine('doyun','sad','그런데 자네는……. 얼마나 더 살아야 하는 거요?'),dialogueLine('player','worried','…….')
]});

for(const key of Object.keys(CONCEPT_QUESTION_INDEX))delete CONCEPT_QUESTION_INDEX[key];
for(const q of QUESTIONS.filter(item=>!item.retired))for(const conceptId of q.conceptIds||[])(CONCEPT_QUESTION_INDEX[conceptId]||(CONCEPT_QUESTION_INDEX[conceptId]=[])).push(q.questionId);

const migrateBeforeStoryAudit=migrateSave;
migrateSave=function(raw){
  const migrated=migrateBeforeStoryAudit(raw),meta=migrated.meta||(migrated.meta=INITIAL_META());
  if(meta.storyAuditVersion!==STORY_AUDIT_VERSION){
    const repairRun=run=>{
      if(!run)return;
      const redirect={...CH04_REMOVED_WRAPPERS,ch02_realization:'ch02_chapter_clear'};
      if(redirect[run.storyId]){run.storyId=redirect[run.storyId];run.pending=null;run.dialogueSceneId=null;run.dialogueCursor=1}
      if(run.pending?.nextStoryId&&redirect[run.pending.nextStoryId])run.pending.nextStoryId=redirect[run.pending.nextStoryId];
      const active=QUESTIONS.find(q=>q.questionId===run.activeQuestionId);
      if(active&&(active.retired||active.reviewOnly)){const resume=active.resumeStoryId||run.storyId;run.storyId=redirect[resume]||resume;run.activeQuestionId=null;run.questionAnswer=null;run.questionQueue=[];run.questionQueueIndex=0;run.questionQueueResumeStoryId=null;run.activeQuestionSetId=null;run.dialogueSceneId=null;run.dialogueCursor=1}
      run.questionQueue=(run.questionQueue||[]).filter(id=>{const q=QUESTIONS.find(item=>item.questionId===id);return q&&!q.retired&&!q.reviewOnly});
      if(run.activeQuestionSetId&&!QUESTION_SETS[run.activeQuestionSetId])run.activeQuestionSetId=null;
      run.storyAuditVersion=STORY_AUDIT_VERSION;
    };
    repairRun(migrated.run);repairRun(migrated.mainRun);meta.storyAuditVersion=STORY_AUDIT_VERSION;
  }
  migrated.version=SAVE_VERSION;
  return migrated;
};

/* CH.01 re-edit: 2026 prologue -> 918 foundation -> 927 Gongsan -> 930 Gochang. */
const CH01_REEDIT_VERSION=1;
const CH01_VERIFIED_OFFICIAL_IDS=['ch01-official-69-basic-10','ch01-official-79-advanced-09','ch01-official-70-advanced-10'];
const ch01Official=id=>QUESTIONS.find(question=>question.questionId===id);

ASSETS['ch01-gochang-open-road']={...ASSETS['route-caravan'],label:'고창 승리 뒤 다시 열린 남쪽 거래길',embeddedCharacters:true,embeddedCharacterIds:[]};

delete STORIES.house.choices;
Object.assign(STORIES.house,{nextStoryId:'outfit_gift',dialogues:ch01Lines([
  ['doyun','worried','정신이 드시오?',null],
  ['player','surprised','……여기가 어디예요?'],
  ['doyun','neutral','송악으로 가는 길목이오.'],
  ['player','surprised','……송악?']
])});
STORIES.house.dialogues[0].characterName='낯선 청년';

Object.assign(STORIES.outfit_gift,{
  title:'갈 곳부터 정합시다',nextStoryId:'rumor',outfitChange:{dialogueIndex:8,to:'goryeo_commoner',source:'doyun'},dialogues:ch01Lines([
    ['doyun','suspicious','그런데 그 이상한 옷은 대체 뭐요?'],
    ['player','embarrassed','이게 왜 이상해?'],
    ['doyun','surprised','안 이상해 보이시오?'],
    ['player','embarrassed','……그건 아니네.'],
    ['doyun','neutral','갈 곳은 있소?'],
    ['player','worried','……없어.'],
    ['doyun','serious','그럼 이것부터 입으시오. 계속 그 꼴로 다니면 온 동네 사람이 자네만 볼 거요.'],
    ['narrator','neutral','도윤이 내민 낡은 평민복으로 갈아입었다. 현대의 옷은 접어 품 안에 넣었다.','narration'],
    ['doyun','neutral','나도 작은 장사를 시작하려던 참이오. 갈 곳도 없다면서. 그럼 밥값이라도 하시오.'],
    ['player','neutral','장사는 잘해?'],
    ['doyun','smile','나도 제대로 해본 적 없소.'],
    ['player','smile','왜 그 말을 그렇게 자신 있게 해?']
  ])
});

Object.assign(STORIES.rumor,{title:'왕건이 왕이 되었다',nextStoryId:'foundation',sceneType:'ambient-rumor',visibleCharacters:[],dialogues:ch01Lines([
  ['resident_a','serious','궁예가 쫓겨났대.',null],
  ['resident_b','surprised','그럼 누가 왕이 되었대?',null],
  ['resident_a','serious','왕건 장군. 새 나라 이름은 고려라더군.',null],
  ['player','surprised','……왕건?','thought']
])});
delete STORIES.rumor.quizId;delete STORIES.rumor.linkedQuestionIds;delete STORIES.rumor.questionSequenceMode;

Object.assign(STORIES.foundation,{title:'918년 · 고려 건국',nextStoryId:'ch01_trade_start',sceneType:'thought',visibleCharacters:[],dialogues:ch01Lines([
  ['player','thinking','왕건. 고려.','thought'],
  ['player','thinking','잠깐. 918년. 고려 건국.','thought'],
  ['narrator','neutral','918년','narration'],
  ['narrator','neutral','고려 건국 · 눈떠보니 고려','narration'],
  ['player','thinking','이거, 분명 시험에서 봤어.','thought']
])});

Object.assign(STORIES.ch01_trade_start,{title:'둘이 장사꾼이 되어 가는 동안',nextStoryId:'ch01_jump_927',dialogues:ch01Lines([
  ['narrator','neutral','처음에는 자루 하나를 함께 나르는 일부터 시작했다.','narration'],
  ['doyun','serious','그 천은 두 냥 아래로 팔면 안 되오.'],
  ['player','smile','한 냥 반이면 오늘 다 팔 수 있는데?'],
  ['doyun','surprised','자네가 손님보다 더 무섭군.'],
  ['narrator','neutral','작은 좌판이 생기고, 비 오는 날에는 둘이 수레를 밀었다.','narration'],
  ['player','worried','그때 천 세 필, 너무 싸게 팔았지?'],
  ['doyun','smile','아홉 해 동안 기억했으면 이제 장부에 적으시오.'],
  ['narrator','neutral','실수 뒤에는 같은 밥을 먹고 웃었다. 빈 좌판에는 조금씩 더 많은 물건이 놓였다.','narration']
])});

Object.assign(STORIES.ch01_jump_927,{title:'아홉 해가 쌓인 뒤',nextStoryId:'ch01_gongsan',dialogues:ch01Lines([
  ['narrator','neutral','첫 짐, 첫 좌판, 비에 젖은 수레, 함께 먹은 수많은 저녁이 지나갔다.','narration'],
  ['player','thinking','하루만 버티려 했는데, 이제 나는 도윤과 내일 들어올 물건을 걱정하고 있었다.','thought'],
  ['narrator','neutral','927년','narration']
])});

Object.assign(STORIES.ch01_gongsan,{title:'남쪽으로 가지 마시오',nextStoryId:'ch01_conflict',visibleCharacters:['doyun','player','injured_merchant'],sceneType:'dialogue',dialogues:ch01Lines([
  ['doyun','worried','이상하군.'],
  ['player','neutral','뭐가?'],
  ['doyun','serious','남쪽에서 오는 물건이 오늘 들어오기로 했소. 사람도 수레도 보이지 않소.'],
  ['narrator','neutral','잠시 뒤, 멀리서 누군가 빈 수레를 붙든 채 비틀거리며 왔다.','narration'],
  ['doyun','worried','……저 사람.'],
  ['doyun','serious','이게 대체 무슨 꼴이오?'],
  ['injured_merchant','serious','남쪽으로 가지 마시오.'],
  ['injured_merchant','worried','길이 막혔소. 사람들이…….'],
  ['injured_merchant','serious','죽고 있소.'],
  ['doyun','worried','무슨 일이 있었소?'],
  ['injured_merchant','serious','후백제군이 신라 왕경을 공격했소. 경애왕도 죽었다 하오.'],
  ['injured_merchant','serious','왕건 임금이 신라를 도우러 갔지만 공산에서 크게 패했소. 신숭겸 장군도 전사했소.'],
  ['doyun','worried','우리와 함께 간 사람들은?'],
  ['injured_merchant','worried','흩어졌소. 나도 누가 돌아올지 모르오.'],
  ['player','thinking','신숭겸.','thought'],
  ['player','thinking','공산 전투.','thought'],
  ['player','thinking','분명 외웠던 이름인데.','thought'],
  ['player','thinking','여기서는…….','thought'],
  ['player','thinking','누군가의 죽음이었다.','thought'],
  ['narrator','neutral','길이 끊기자 물건도 외상값도 사라졌다. 도윤은 돌아오지 않은 사람들의 이름이 적힌 장부를 덮지 못했다.','narration'],
  ['player','thinking','잠깐. 이 이름들, 분명 시험에서 봤어.','thought']
])});

Object.assign(STORIES.ch01_conflict,{nextStoryId:'ch01_reconcile',dialogues:ch01Lines([
  ['player','worried','다시 하면 되잖아.'],
  ['doyun','serious','말은 쉽소.'],
  ['player','serious','돈 좀 잃었다고 끝난 건 아니잖아.'],
  ['doyun','serious','자네는 잃을 것이 없으니 그런 말을 하는 것이오.'],
  ['narrator','neutral','정적. 함께 쌓은 아홉 해까지 부정당한 것처럼 아팠다.','narration'],
  ['player','worried','……잠깐 나갔다 올게.']
])});

Object.assign(STORIES.ch01_reconcile,{nextStoryId:'ch01_jump_930',dialogues:ch01Lines([
  ['narrator','neutral','하루가 지나서야 두 사람은 다시 같은 장부 앞에 앉았다.','narration'],
  ['doyun','worried','어제는 내가 심했소.'],
  ['player','worried','나도.'],
  ['doyun','smile','그런데 돈을 잃은 건 정말 자네 때문이오.'],
  ['player','surprised','야.'],
  ['doyun','smile','농담이오.'],
  ['narrator','neutral','둘은 남은 물건부터 다시 세었다.','narration']
])});

Object.assign(STORIES.ch01_jump_930,{title:'다시 수레를 채우다',nextStoryId:'ch01_gochang',dialogues:ch01Lines([
  ['narrator','neutral','두 사람은 먼 길 하나보다 돌아올 수 있는 짧은 길 여러 개를 골랐다. 수레에는 다시 물건이 쌓였다.','narration'],
  ['narrator','neutral','930년','narration'],
  ['doyun','worried','또 전쟁이오. 고창 쪽 거래가 걸려 있소.'],
  ['player','serious','이번에는 다를 수도 있어.'],
  ['doyun','surprised','어떻게 아시오?'],
  ['player','embarrassed','……그냥 느낌.'],
  ['doyun','suspicious','자네는 가끔 이상한 소리를 아무렇지도 않게 하는군.'],
  ['player','thinking','외운 기억은 있어도, 결과를 기다리는 시간까지 아는 건 아니었다.','thought']
])});

Object.assign(STORIES.ch01_gochang,{title:'다시 열린 길',illustrationId:'ch01-gochang-open-road',backgroundImage:ASSETS['ch01-gochang-open-road'].src,nextStoryId:'ch01_belonging',visibleCharacters:[],sceneType:'ambient-rumor',dialogues:ch01Lines([
  ['narrator','neutral','막혔던 남쪽 길로 수레가 돌아왔다. 장터에는 곡식 자루와 사람들의 목소리가 다시 쌓였다.','narration'],
  ['merchant','surprised','고창에서 왕건 임금의 군대가 후백제군을 크게 이겼소! 길도 다시 열렸소!',null],
  ['narrator','neutral','927년 공산의 빈 수레와 달리, 930년 고창 뒤의 수레에는 물건과 안도한 얼굴이 함께 실려 있었다.','narration'],
  ['player','thinking','공산은 패배. 고창은 승리. 비슷하게 외웠던 이름이 이제는 정반대의 표정으로 남았다.','thought'],
  ['player','thinking','잠깐. 이 다음 순서도 시험에서 봤어.','thought']
])});

Object.assign(STORIES.ch01_belonging,{nextStoryId:'ch01_clear_930',dialogues:ch01Lines([
  ['doyun','suspicious','……자네. 정말 그냥 느낌이었소?'],
  ['player','embarrassed','운이 좋았네.'],
  ['doyun','suspicious','…….'],
  ['doyun','smile','이번에는 우리가 이겼군.'],
  ['player','surprised','우리가?'],
  ['doyun','neutral','십 년 가까이 여기 살았으면 고려 사람 아니오?'],
  ['player','thinking','돌아갈 곳만 찾던 내가, 어느새 이곳의 승리를 우리라고 듣고 있었다.','thought']
])});

Object.assign(STORIES.ch01_clear_930,{title:'새로운 나라',dialogues:ch01Lines([
  ['narrator','neutral','CH.01 · 새로운 나라','narration'],
  ['narrator','neutral','918 · 왕건, 고려 건국','narration'],
  ['narrator','neutral','927 · 공산 전투, 왕건 패배, 신숭겸 전사','narration'],
  ['narrator','neutral','930 · 고창 전투, 왕건 승리','narration'],
  ['narrator','neutral','CHAPTER CLEAR','narration']
]),cinematicSub:'역사가 우리의 삶을 바꾼 열두 해를 기록합니다.'});

const CH01_MERGED_SCENE_REDIRECTS={outfit_question:'outfit_gift',market:'ch01_trade_start',ch01_missing_traders:'ch01_gongsan',ch01_conflict_night:'ch01_reconcile',ch01_ending_930:'ch01_clear_930'};
for(const [sceneId,nextStoryId] of Object.entries(CH01_MERGED_SCENE_REDIRECTS)){Object.assign(STORIES[sceneId],{storyActive:false,nextStoryId});delete STORIES[sceneId].quizId;delete STORIES[sceneId].linkedQuestionIds;delete STORIES[sceneId].questionSequenceMode}
for(const id of ['ch01_exam_69_basic_10','ch01_exam_79_09'])STORIES[id].storyActive=false;

const q69=ch01Official('ch01-official-69-basic-10');
Object.assign(q69,{chapterId:'ch01',year:918,reviewOnly:false,relatedSceneId:'foundation',relatedIllustrationId:'title-foundation',resumeStoryId:'ch01_trade_start',questionType:'인물·국가 판단형',formatLabel:'실제 기출 · 인물 판단',
  passage:'[속보: 철원, 도읍지로 결정]\n(가)이/가 수도를 송악에서 철원으로 옮긴다고 밝혔습니다. 광평성 등 관서를 새로 설치한 데 이은 통치 체제 정비의 일환으로 보입니다.',
  question:'(가) 인물에 대한 설명으로 옳은 것은?',choices:['우산국을 복속하였다.','백제 계승을 내세웠다.','국호를 태봉으로 바꾸었다.','중앙군으로 9서당을 설치하였다.'],answer:2,
  explanation:'자료의 인물은 궁예입니다. 궁예는 송악에서 철원으로 도읍을 옮기고 광평성을 설치했으며, 국호를 태봉으로 바꾸었습니다.',
  gameMemory:'918년 거리에서 “궁예가 쫓겨나고 왕건이 왕이 되었다”는 소문을 들었습니다. 왕건 이전 철원·광평성·태봉의 주인공은 궁예이므로 정답은 ③입니다.',
  examKeywords:['궁예','철원','광평성','태봉'],conceptIds:['gungye','taebong','goryeo-foundation-918'],memoryPrompt:'기억을 더듬는다',wrongFeedback:'……아니다. 기억이 섞였어.',exactTranscription:true,sourceVerified:true,sourceStatus:'verified_from_attached_pdf'});

const q79=ch01Official('ch01-official-79-advanced-09');
Object.assign(q79,{chapterId:'ch01',year:927,reviewOnly:false,relatedSceneId:'ch01_gongsan',relatedIllustrationId:'thief-aftermath',resumeStoryId:'ch01_conflict',questionType:'인물 업적형',formatLabel:'실제 기출 · 인물 업적',
  passage:'○ 북원의 반란 세력 우두머리 양길이 부하 (가)을/를 보내 기병 1백여 명을 거느리고 북원 동쪽 마을과 명주 관내의 주천 등 10여 군현을 습격하였다.\n○ 그때 신라가 쇠퇴하여 도적떼가 다투어 일어났다. (가)은/는 고구려의 땅에 의지해 철원에 도읍하고 나라 이름을 태봉이라 하였다.',
  question:'(가) 인물에 대한 설명으로 옳은 것은?',choices:['공산 전투에서 전사하였다.','경주의 사심관으로 임명되었다.','후당과 오월에 사신을 파견하였다.','일리천에서 신검의 군대를 물리쳤다.','광평성 등의 정치 기구를 설치하였다.'],answer:4,
  explanation:'자료의 인물은 궁예입니다. 궁예는 철원을 도읍으로 태봉을 세우고 광평성 등의 정치 기구를 설치했습니다. 공산 전투에서 전사한 인물은 신숭겸입니다.',
  gameMemory:'부상당한 상인에게 들은 공산 전사의 이름은 신숭겸이었습니다. 918년 장면의 철원·태봉·궁예 기억과 구분하면 정답은 ⑤입니다.',
  examKeywords:['궁예','양길','철원','태봉','광평성','신숭겸'],conceptIds:['gungye','taebong','gongsan-battle','shin-sung-gyeom'],memoryPrompt:'신숭겸…… 잠깐. 분명 시험에서 봤어.',wrongFeedback:'……아니다. 기억이 섞였어.',exactTranscription:true,sourceVerified:true,sourceStatus:'verified_from_attached_pdf'});

const q70=ch01Official('ch01-official-70-advanced-10');
Object.assign(q70,{chapterId:'ch01',year:930,reviewOnly:false,relatedSceneId:'ch01_gochang',relatedIllustrationId:'ch01-gochang-open-road',resumeStoryId:'ch01_belonging',questionType:'사건 순서형',formatLabel:'실제 기출 · 후삼국 순서',
  passage:'[한국사 동영상 제작 계획안: 다시 하나로, 민족의 재통일을 이루다]\n#1 신숭겸, 공산 전투에서 전사하다\n#2 왕건, 고창 전투에서 후백제군을 물리치다\n#3 견훤, 금산사에서 탈출하여 고려에 귀순하다\n#4 (가)\n#5 왕건, 일리천에서 신검의 군대에 승리하다',
  question:'(가)에 들어갈 내용으로 적절한 것은?',choices:['안승, 보덕국왕으로 책봉되다','궁예, 국호를 태봉으로 바꾸다','경순왕 김부, 경주의 사심관이 되다','윤충, 대야성을 공격하여 함락시키다','흑치상지, 임존성에서 부흥군을 이끌다'],answer:2,
  explanation:'공산(927)과 고창(930), 견훤의 고려 귀순(935) 뒤 신라 경순왕 김부가 고려에 항복하고 경주의 사심관이 되었습니다. 그 뒤 일리천 전투(936)로 후삼국 통일이 완성되었습니다.',
  gameMemory:'게임에서 직접 겪은 #1 공산의 패배와 #2 고창의 승리가 문제 앞부분입니다. #4의 김부·사심관은 다음 챕터에서 이어질 실제 역사이며, 아직 경험한 창작 장면처럼 설명하지 않습니다.',
  examKeywords:['공산 전투','고창 전투','견훤 귀순','경순왕 김부','사심관','일리천 전투'],conceptIds:['gongsan-battle','gochang-battle','later-three-kingdoms-chronology'],memoryPrompt:'공산과 고창 뒤의 순서를 더듬는다',wrongFeedback:'……아니다. 순서가 섞였어.',exactTranscription:true,sourceVerified:true,sourceStatus:'verified_from_attached_pdf'});

for(const q of QUESTIONS){
  q.questionAuditStatus=q.isOfficial?(q.sourceVerified?'VERIFIED_OFFICIAL':'UNKNOWN'):'SELF_AUTHORED';
  if(q.chapterId!=='ch01'&&!q.wrongFeedback)q.wrongFeedback='기억이 흐릿하다.';
}
for(const q of QUESTIONS.filter(question=>question.chapterId==='ch01'&&!question.isOfficial))Object.assign(q,{retired:true,reviewOnly:true,sourceStatus:'retired_self_authored_ch01_reedit',questionAuditStatus:'SELF_AUTHORED'});

for(const id of ['foundation','ch01_gongsan','ch01_gochang']){delete STORIES[id].quizId;delete STORIES[id].linkedQuestionIds;delete STORIES[id].questionSequenceMode}
Object.assign(STORIES.foundation,{linkedQuestionIds:[q69.questionId],linkedOfficialQuestions:[q69.questionId],questionSequenceMode:'queue',quizId:q69.questionId,officialQuestionStatus:'verified',officialQuestionSlot:{conceptIds:['goryeo-foundation-918','gungye','taebong'],linkedOfficialQuestions:[q69.questionId],officialQuestionStatus:'verified'}});
Object.assign(STORIES.ch01_gongsan,{linkedQuestionIds:[q79.questionId],linkedOfficialQuestions:[q79.questionId],questionSequenceMode:'queue',quizId:q79.questionId,officialQuestionStatus:'contextual_verified',officialQuestionSlot:{conceptIds:['gongsan-battle','shin-sung-gyeom','wang-geon'],linkedOfficialQuestions:[],contextualOfficialQuestions:[q79.questionId,q70.questionId],officialQuestionStatus:'source_required'}});
Object.assign(STORIES.ch01_gochang,{linkedQuestionIds:[q70.questionId],linkedOfficialQuestions:[q70.questionId],questionSequenceMode:'queue',quizId:q70.questionId,officialQuestionStatus:'verified',officialQuestionSlot:{conceptIds:['gongsan-battle','gochang-battle','wang-geon'],linkedOfficialQuestions:[q70.questionId],officialQuestionStatus:'verified'}});

SPLIT_STORY_QUESTION_IDS.ch01.splice(0,SPLIT_STORY_QUESTION_IDS.ch01.length,...CH01_VERIFIED_OFFICIAL_IDS);
SPLIT_REVIEW_IDS.ch01.splice(0,SPLIT_REVIEW_IDS.ch01.length,...CH01_VERIFIED_OFFICIAL_IDS);
SPLIT_REVIEW_IDS.ch02=SPLIT_REVIEW_IDS.ch02.filter(id=>id!==q70.questionId);
Object.assign(CHAPTERS.ch01,{questionCount:CH01_VERIFIED_OFFICIAL_IDS.length,reviewQuestionCount:CH01_VERIFIED_OFFICIAL_IDS.length});
CHAPTERS.ch02.reviewQuestionCount=SPLIT_REVIEW_IDS.ch02.length;
HISTORY.relatedQuestions=[...CH01_VERIFIED_OFFICIAL_IDS];

for(const key of Object.keys(CONCEPT_QUESTION_INDEX))delete CONCEPT_QUESTION_INDEX[key];
for(const q of QUESTIONS.filter(question=>!question.retired))for(const conceptId of q.conceptIds||[])(CONCEPT_QUESTION_INDEX[conceptId]||(CONCEPT_QUESTION_INDEX[conceptId]=[])).push(q.questionId);

const migrateBeforeCh01Reedit=migrateSave;
migrateSave=function(raw){
  const migrated=migrateBeforeCh01Reedit(raw),meta=migrated.meta||(migrated.meta=INITIAL_META());
  if(meta.ch01ReeditVersion!==CH01_REEDIT_VERSION){
    const retiredStoryQuestionIds=new Set(QUESTIONS.filter(q=>q.chapterId==='ch01'&&q.retired).map(q=>q.questionId));
    const questionRedirect={
      'ch01-test-01':'foundation','ch01-test-02':'foundation','ch01-story-war-context':'ch01_gongsan','ch01-story-gongsan':'ch01_gongsan','ch01-story-gongsan-battle':'ch01_gongsan','ch01-story-gochang-name':'ch01_gochang','ch01-story-gochang':'ch01_gochang'
    };
    const repairRun=run=>{
      if(!run||run.currentChapter!=='ch01'||run.completed)return;
      if(run.pending?.nextStoryId&&CH01_MERGED_SCENE_REDIRECTS[run.pending.nextStoryId])run.pending.nextStoryId=CH01_MERGED_SCENE_REDIRECTS[run.pending.nextStoryId];
      if(CH01_MERGED_SCENE_REDIRECTS[run.storyId]){run.storyId=CH01_MERGED_SCENE_REDIRECTS[run.storyId];run.pending=null;run.dialogueSceneId=null;run.dialogueCursor=1}
      if(retiredStoryQuestionIds.has(run.activeQuestionId)){run.storyId=questionRedirect[run.activeQuestionId]||'foundation';run.activeQuestionId=null;run.questionAnswer=null;run.questionQueue=[];run.questionQueueIndex=0;run.questionQueueResumeStoryId=null;run.dialogueSceneId=null;run.dialogueCursor=1}
      run.questionQueue=(run.questionQueue||[]).filter(id=>!retiredStoryQuestionIds.has(id));
      run.ch01ReeditVersion=CH01_REEDIT_VERSION;
    };
    repairRun(migrated.run);repairRun(migrated.mainRun);
    const wrongAnswers=meta.wrongAnswers||(meta.wrongAnswers=[]);
    for(const questionId of meta.wrongQuestionIds||[]){if(wrongAnswers.some(item=>item.questionId===questionId))continue;const q=QUESTIONS.find(item=>item.questionId===questionId),record=meta.questionRecords?.[questionId];wrongAnswers.push({questionId,examRound:q?.examRound??null,examLevel:q?.examLevel??null,questionNumber:q?.questionNumber??null,conceptIds:[...(q?.conceptIds||[])],chapterId:q?.chapterId??null,historicalEventId:q?.relatedHistoricalEventId??null,userAnswer:record?.lastAnswer??null,correctAnswer:q?.answer??null,answeredAt:null,migrated:true})}
    const normalizeSession=session=>{if(!session?.chapterId||!SPLIT_REVIEW_IDS[session.chapterId])return session;const ids=SPLIT_REVIEW_IDS[session.chapterId],answers=Object.fromEntries(Object.entries(session.answers||{}).filter(([id])=>ids.includes(id))),results=Object.fromEntries(Object.entries(session.results||{}).filter(([id])=>ids.includes(id))),cursor=Math.max(0,ids.findIndex(id=>answers[id]===undefined));return {...session,answers,results,cursor:cursor<0?ids.length:cursor,completed:ids.length>0&&ids.every(id=>answers[id]!==undefined)}};
    if(meta.ch01ReviewSession)meta.ch01ReviewSession=normalizeSession(meta.ch01ReviewSession);
    if(meta.chapterReviewSessions)for(const id of Object.keys(meta.chapterReviewSessions))meta.chapterReviewSessions[id]=normalizeSession(meta.chapterReviewSessions[id]);
    meta.ch01ReeditVersion=CH01_REEDIT_VERSION;
  }
  migrated.version=SAVE_VERSION;
  return migrated;
};

/* CH.02 935–943 re-edit: official-exam flow, age continuity, recurring merchant. */
const CH02_REEDIT_VERSION=1;
const HUMAN_AGING_RULES={
  player:{agingMode:'nearly-static',baselineYear:918,baselineAge:23,mysteryKey:'unknown-aging'},
  doyun:{agingMode:'calendar',birthYear:894,states:{918:'young',935:'adult_935',943:'mature_943',949:'middle_aged_949',956:'elder_956',982:'elder_982'}},
  merchant_01:{agingMode:'calendar',birthYear:872,states:{918:'adult_918',927:'mature_927',935:'older_935'}},
  hyunwoo:{agingMode:'calendar',birthYear:935,states:{958:'young',982:'middle_982'}},
  freed_man:{agingMode:'calendar',note:'Create a new age state if this named NPC returns after a substantial time gap.'}
};
const ageState=(characterId,year,ageVariant,extra={})=>({characterAge:characterId==='player'?23:year-HUMAN_AGING_RULES[characterId].birthYear,ageState:ageVariant,ageVariant,variant:'normal',pose:'standing',...extra});
const CH02_ALL_EXPRESSIONS=['neutral','smile','surprised','suspicious','serious','worried','angry','sad','thinking'];
const onePortrait=id=>Object.fromEntries(CH02_ALL_EXPRESSIONS.map(expression=>[expression,id]));

Object.assign(PORTRAITS,{
  merchant_01_neutral:portrait('merchant_01','neutral','평범한 거래 상인 · 수다스러운 기본 표정',['#67513d','#ad8a63'],'assets/characters/merchant_01.png','plain_merchant'),
  merchant_01_smile:portrait('merchant_01','smile','평범한 거래 상인 · 친근한 미소',['#67513d','#b38e65'],'assets/characters/merchant_01.png','plain_merchant'),
  merchant_01_surprised:portrait('merchant_01','surprised','평범한 거래 상인 · 급한 소식',['#67513d','#ad805d'],'assets/characters/merchant_01.png','plain_merchant'),
  merchant_01_serious:portrait('merchant_01','serious','평범한 거래 상인 · 장사 이야기를 하는 표정',['#5a4939','#997759'],'assets/characters/merchant_01.png','plain_merchant'),
  merchant_01_worried:portrait('merchant_01','worried','평범한 거래 상인 · 걱정스러운 표정',['#54483c','#8a7059'],'assets/characters/merchant_01.png','plain_merchant'),
  merchant_01_injured_927:portrait('merchant_01','worried','평범한 거래 상인 · 927년 부상 상태',['#514238','#866b55'],'assets/characters/injured_merchant_01.png','plain_merchant'),
  merchant_01_older_935:portrait('merchant_01','neutral','평범한 거래 상인 · 935년 나이 든 모습',['#62503f','#a78361'],'assets/characters/merchant_01_935.png','plain_merchant'),
  doyun_935:portrait('doyun','neutral','도윤 · 935년 41세 모습',['#3e352f','#80654f'],'assets/characters/doyun_935.png','commoner'),
  doyun_943:portrait('doyun','neutral','도윤 · 943년 49세 모습',['#3b3430','#745f50'],'assets/characters/doyun_943.png','commoner')
});
const MERCHANT_918_PORTRAITS=onePortrait('merchant_01_neutral');
MERCHANT_918_PORTRAITS.smile='merchant_01_smile';MERCHANT_918_PORTRAITS.surprised='merchant_01_surprised';MERCHANT_918_PORTRAITS.serious='merchant_01_serious';MERCHANT_918_PORTRAITS.worried='merchant_01_worried';
const MERCHANT_927_PORTRAITS=onePortrait('merchant_01_injured_927');
const MERCHANT_935_PORTRAITS=onePortrait('merchant_01_older_935');
const DOYUN_935_PORTRAITS=onePortrait('doyun_935');
const DOYUN_943_PORTRAITS=onePortrait('doyun_943');
CHARACTER_ASSET_MAP.merchant_01={canonicalId:'MERCHANT_01_CANONICAL',defaultAge:'adult_918',ages:{
  adult_918:{defaultVariant:'normal',variants:{normal:{defaultOutfit:'plain_merchant',outfits:{plain_merchant:MERCHANT_918_PORTRAITS}}}},
  mature_927:{defaultVariant:'injured',variants:{injured:{defaultOutfit:'plain_merchant',outfits:{plain_merchant:MERCHANT_927_PORTRAITS}}}},
  older_935:{defaultVariant:'normal',variants:{normal:{defaultOutfit:'plain_merchant',outfits:{plain_merchant:MERCHANT_935_PORTRAITS}}}}
}};
CHARACTER_ASSET_MAP.doyun.ages.adult_935={defaultOutfit:'commoner',outfits:{commoner:DOYUN_935_PORTRAITS}};
CHARACTER_ASSET_MAP.doyun.ages.mature_943={defaultOutfit:'commoner',outfits:{commoner:DOYUN_943_PORTRAITS}};
CHARACTERS.merchant_01={characterId:'merchant_01',canonicalId:'MERCHANT_01_CANONICAL',characterName:'상인',speakerType:'npc',position:'left',show:true,presentation:'standing',portraitPrefix:'merchant_01',characterAge:46,ageState:'adult_918',ageVariant:'adult_918',variant:'normal',pose:'standing',outfit:'plain_merchant'};
Object.assign(CHARACTERS.injured_merchant,{show:false,presentation:'legacy',deprecated:true,replacedBy:'merchant_01'});

ASSETS['ch02-trade-room-935']=sceneArt('ch02-trade-room-935','935–943년 도윤과 주인공이 빌려 쓰는 소박한 창고방',['#40342c','#897058'],false,'goryeo-house-empty');

const ch02NamedLine=(who,expression,text,name=null,type=null)=>dialogueLine(who,expression,text,type,name);
const refreshCh02Stage=sceneId=>{const s=STORIES[sceneId],spoken=(s.dialogues||[]).filter(line=>['npc','player'].includes(line.speakerType));s.visibleCharacters=[...new Set(spoken.map(line=>line.characterId).filter(id=>CHARACTERS[id]?.show!==false&&CHARACTERS[id]?.presentation!=='ambient'))];s.sceneType=spoken.length?'dialogue':s.dialogues?.some(line=>line.speakerType==='thought')?'thought':'narration';s.backgroundImage=ASSETS[s.illustrationId]?.src||null};
const setCh02Questions=(sceneId,questionIds)=>{const s=STORIES[sceneId];delete s.quizId;delete s.linkedQuestionIds;delete s.questionSequenceMode;if(questionIds.length){s.linkedQuestionIds=[...questionIds];s.linkedOfficialQuestions=[...questionIds];s.questionSequenceMode='queue';s.quizId=questionIds[0];s.officialQuestionStatus='verified';s.officialQuestionSlot={conceptIds:[...(s.learningConceptIds||[])],linkedOfficialQuestions:[...questionIds],officialQuestionStatus:'verified'}}};

// The normal 918 and injured 927 appearances use one identity and unchanged dialogue text.
STORIES.ch01_trade_start.dialogues=STORIES.ch01_trade_start.dialogues.map((line,index)=>index===1?ch02NamedLine('merchant_01','serious',line.dialogue,'상인'):line);
STORIES.ch01_trade_start.enterCharacterStates={...STORIES.ch01_trade_start.enterCharacterStates,merchant_01:ageState('merchant_01',918,'adult_918',{variant:'normal',outfit:'plain_merchant',pose:'relaxed'})};
STORIES.ch01_gongsan.dialogues=STORIES.ch01_gongsan.dialogues.map(line=>line.characterId==='injured_merchant'?ch02NamedLine('merchant_01',line.expression,line.dialogue,'부상당한 상인'):line);
STORIES.ch01_gongsan.enterCharacterStates={...STORIES.ch01_gongsan.enterCharacterStates,merchant_01:ageState('merchant_01',927,'mature_927',{variant:'injured',outfit:'plain_merchant',pose:'hunched'})};
refreshCh02Stage('ch01_trade_start');refreshCh02Stage('ch01_gongsan');

// Act 1 — Gyeon Hwon escapes Geumsansa and defects to Goryeo.
Object.assign(STORIES.ch01_jump_935,{illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src,nextStoryId:'ch02_news_935'});
Object.assign(STORIES.ch02_news_935,{illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src,nextStoryId:'ch01_gyeonhwon',enterCharacterStates:{...STORIES.ch02_news_935.enterCharacterStates,doyun:ch01Age(935),player:ageState('player',935,'unchanged',{outfit:'goryeo_commoner'}),merchant_01:ageState('merchant_01',935,'older_935',{variant:'normal',outfit:'plain_merchant',pose:'slightly-stooped'})},dialogues:[
  ch02NamedLine('narrator','neutral','장부를 맞추던 중, 낯익은 상인이 숨을 몰아쉬며 뛰어들었다.',null,'narration'),
  ch02NamedLine('merchant_01','surprised','견훤이 고려로 왔답니다!','상인'),
  ch02NamedLine('doyun','surprised','……누가 왔다고?'),
  ch02NamedLine('merchant_01','surprised','견훤 말입니다!','상인'),
  ch02NamedLine('player','surprised','잠깐. 후백제를 세운 그 견훤?')
]});
Object.assign(STORIES.ch01_gyeonhwon,{illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src,nextStoryId:'ch01_silla',enterCharacterStates:{...STORIES.ch01_gyeonhwon.enterCharacterStates,doyun:ch01Age(935),merchant_01:ageState('merchant_01',935,'older_935',{variant:'normal',outfit:'plain_merchant',pose:'slightly-stooped'})},dialogues:[
  ch02NamedLine('merchant_01','serious','아들 신검에게 밀려 금산사에 갇혔다가 탈출했다 하오. 왕건 임금에게 귀순했답니다.','상인'),
  ch02NamedLine('player','serious','자기가 만든 나라를 공격하게 생겼네.'),
  ch02NamedLine('doyun','neutral','인생이라는 게 참 모르는 일이오.'),
  ch02NamedLine('player','thinking','견훤은 고려로. 후백제에는 신검. 이제 둘을 같은 편으로 기억하면 안 돼.',null,'thought')
]});

// Act 2 — the last Silla king chooses surrender instead of another ruinous war.
Object.assign(STORIES.ch01_silla,{illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src,nextStoryId:'ch01_jump_936',dialogues:[
  ch02NamedLine('narrator','neutral','그해 늦가을, 신라 출신 거래 상인이 찾아왔다.',null,'narration'),
  ch02NamedLine('merchant','serious','……우리 왕께서 나라를 고려에 넘기기로 하셨소. 경순왕 김부께서 말이오.','신라 출신 상인'),
  ch02NamedLine('player','surprised','싸워서 빼앗긴 게 아니라……?'),
  ch02NamedLine('merchant','serious','더 싸우면 백성만 다친다 하셨소. 왕건 임금은 우리 왕을 우대하고 경주의 일을 맡긴다 하오.','신라 출신 상인'),
  ch02NamedLine('merchant','serious','내일부터 나는 어느 나라 사람이 되는 것이오?','신라 출신 상인'),
  ch02NamedLine('doyun','neutral','오늘 묵을 곳은 있소? 거래 이야기는 내일 합시다.'),
  ch02NamedLine('player','thinking','사람을 죽이는 대신 자기편으로 만드는 선택. 신라의 마지막이 한 사람의 목소리로 남았다.',null,'thought')
]});

// Act 3 — brief personal choices, Illicheon, and the cumulative official question.
Object.assign(STORIES.ch01_victory,{nextStoryId:'ch01_unity',dialogues:[
  ch02NamedLine('merchant','surprised','일리천에서 왕건 임금이 신검의 군대를 이겼습니다! 후백제군이 무너졌습니다!','전령'),
  ch02NamedLine('merchant','surprised','신검이 항복했습니다!','전령'),
  ch02NamedLine('doyun','surprised','그러면…….'),
  ch02NamedLine('player','neutral','끝난 거야.'),
  ch02NamedLine('player','thinking','견훤이 고려에 오고, 신라가 나라를 넘기고, 마지막으로 신검의 후백제가 무너졌다.',null,'thought'),
  ch02NamedLine('narrator','neutral','우리는 전쟁의 영웅이 아니었다. 서로의 이름을 부를 사람이 남아 있다는 것이 먼저 기뻤다.',null,'narration')
]});
Object.assign(STORIES.ch01_unity,{nextStoryId:'future_flow',dialogues:[ch02NamedLine('narrator','neutral','936년',null,'narration'),ch02NamedLine('narrator','neutral','후삼국 통일',null,'narration')],cinematicSub:'전쟁이 끝났다. 우리가 살아갈 날은 계속된다.',continueLabel:'살아온 순서를 떠올린다'});
Object.assign(STORIES.future_flow,{chapterId:'ch02',year:936,title:'우리가 지나온 다섯 장면',illustrationId:'future-flow',backgroundImage:ASSETS['future-flow'].src,nextStoryId:'ch01_integration',dialogues:[
  ch02NamedLine('narrator','neutral','927 · 공산에서 왕건이 패하고 신숭겸이 전사했다.',null,'narration'),
  ch02NamedLine('narrator','neutral','930 · 고창에서 왕건이 승리했다.',null,'narration'),
  ch02NamedLine('narrator','neutral','935 · 견훤이 귀순하고 신라가 고려에 들어왔다.',null,'narration'),
  ch02NamedLine('narrator','neutral','936 · 일리천에서 신검이 패하고 후삼국이 하나가 되었다.',null,'narration'),
  ch02NamedLine('player','thinking','외운 순서가 아니라, 우리가 지나온 길이다.',null,'thought')
]});

// Act 4 — three lived policy bundles, then 943 and the guild seed.
Object.assign(STORIES.ch01_integration,{year:937,title:'나라가 하나 된 다음',illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src,nextStoryId:'ch01_sasimgwan',dialogues:[
  ch02NamedLine('player','smile','이제 전쟁도 끝났으니까 좀 조용해지겠네.'),
  ch02NamedLine('doyun','serious','나라가 하나 됐다고 사람들의 힘까지 하나가 된 건 아니오.'),
  ch02NamedLine('narrator','neutral','왕은 지방의 유력자들과 손을 잡되, 그 힘을 지켜볼 방법도 필요했다.',null,'narration')
]});
Object.assign(STORIES.ch01_sasimgwan,{year:937,title:'김부가 맡은 고장, 개경에 머문 아들',illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src,nextStoryId:'ch01_refugee_family',dialogues:[
  ch02NamedLine('merchant','neutral','신라 왕이던 김부 대감이 경주의 일을 살핀다 하오. 고장 사람들도 그의 말을 듣고요.','경주 상인'),
  ch02NamedLine('doyun','neutral','출신 고장을 맡겨 따르게 하는군. 왕은 경주 사정을 듣고.'),
  ch02NamedLine('merchant','serious','우리 고장 호족의 아들은 개경에 머물라는 명을 받았소. 자문이라지만 집안에서는 마음이 놓이지 않지요.','지방 상인'),
  ch02NamedLine('player','thinking','김부가 자기 고장을 살피는 사심관. 호족의 자제를 수도에 두는 기인. 사람을 쓰면서 지방을 묶는 두 방법이구나.',null,'thought')
],historyDiscovery:{people:['경순왕 김부'],cards:['ch01-sasimgwan','ch01-giin'],historicalEvents:['ch01-sasimgwan','ch01-giin']}});
Object.assign(STORIES.ch01_giin,{storyActive:false,nextStoryId:'ch01_refugee_family'});delete STORIES.ch01_giin.quizId;delete STORIES.ch01_giin.linkedQuestionIds;delete STORIES.ch01_giin.questionSequenceMode;
Object.assign(STORIES.ch01_refugee_family,{year:938,title:'북쪽에서 온 손님',illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src,nextStoryId:'ch01_welfare',dialogues:[
  ch02NamedLine('merchant','serious','발해에서 왔소. 나라가 거란에게 무너진 뒤 남은 가족을 데리고 내려왔소.','발해계 손님'),
  ch02NamedLine('player','worried','머물 곳은 구했어요?'),
  ch02NamedLine('merchant','neutral','왕께서 우리를 멀리하지 않고 같은 뿌리의 사람처럼 받아들였다 하오. 서경 쪽에도 자리가 있다더군.','발해계 손님'),
  ch02NamedLine('doyun','neutral','서경으로 보낼 물건이 늘었소. 북쪽 길을 다시 살피는 사람도 많고.'),
  ch02NamedLine('player','thinking','고구려를 이은 나라라는 말이 피난 온 사람을 받아들이고, 서경을 중시하며 북쪽으로 향하는 선택으로 이어졌다.',null,'thought')
],historyDiscovery:{people:[],cards:['ch01-north'],historicalEvents:['ch01-north']}});
Object.assign(STORIES.ch01_north,{storyActive:false,nextStoryId:'ch01_welfare'});delete STORIES.ch01_north.quizId;delete STORIES.ch01_north.linkedQuestionIds;delete STORIES.ch01_north.questionSequenceMode;
Object.assign(STORIES.ch01_welfare,{year:941,title:'비어 가는 장바구니',nextStoryId:'ch01_jump_943',dialogues:[
  ch02NamedLine('merchant','serious','거두어 가는 몫이 너무 크면 씨앗곡식까지 내놓아야 하오. 장에 팔 물건도 남지 않습니다.','장터 상인'),
  ch02NamedLine('doyun','serious','백성이 다시 장사하고 농사지을 만큼은 남겨야 나라에도 다음해가 있지.'),
  ch02NamedLine('player','thinking','백성에게 거둘 때 사정을 살핀다. 취민유도. 시장의 빈 바구니를 보면 뜻이 기억난다.',null,'thought')
]});
Object.assign(STORIES.ch01_hunyo,{illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src,nextStoryId:'ch01_guild_seed',dialogues:[
  ch02NamedLine('doyun','serious','태조께서 다음 왕들에게 지켜야 할 일을 열 가지로 남기셨다 하오.'),
  ch02NamedLine('player','thinking','훈요 10조.',null,'thought'),
  ch02NamedLine('doyun','neutral','불교와 나라의 의례를 소중히 하고, 서경을 중히 여기며, 백성을 함부로 다루지 말라는 당부라더군.'),
  ch02NamedLine('player','thinking','제도를 새로 만드는 명령보다, 나라가 잊지 말아야 할 방향을 남긴 말이구나.',null,'thought')
]});
Object.assign(STORIES.ch01_guild_seed,{illustrationId:'ch02-trade-room-935',backgroundImage:ASSETS['ch02-trade-room-935'].src});
Object.assign(STORIES.ch01_farewell,{dialogues:[
  ch02NamedLine('narrator','neutral','CH.02 · 하나가 된 나라',null,'narration'),
  ch02NamedLine('narrator','neutral','935 · 견훤 귀순 · 신라 항복',null,'narration'),
  ch02NamedLine('narrator','neutral','936 · 일리천 승리 · 후삼국 통일',null,'narration'),
  ch02NamedLine('narrator','neutral','통합 · 사심관과 기인 · 발해 유민과 북진 · 취민유도',null,'narration'),
  ch02NamedLine('narrator','neutral','943 · 태조의 죽음 · 훈요 10조 · 도윤상단의 씨앗',null,'narration'),
  ch02NamedLine('narrator','neutral','모두가 나이를 먹는 동안, 나는 여전히 같은 얼굴이었다.',null,'narration')
]});

for(const id of ['ch02_news_935','ch01_gyeonhwon','ch01_silla','ch01_victory','ch01_unity','future_flow','ch01_integration','ch01_sasimgwan','ch01_refugee_family','ch01_welfare','ch01_hunyo','ch01_guild_seed','ch01_farewell'])refreshCh02Stage(id);

const ch02Q73=QUESTIONS.find(q=>q.questionId==='ch01-official-73-basic-10');
const ch02Q74=QUESTIONS.find(q=>q.questionId==='ch01-official-74-advanced-10');
const ch02Q76=QUESTIONS.find(q=>q.questionId==='ch01-official-76-advanced-10');
const ch02Q75=QUESTIONS.find(q=>q.questionId==='ch03-official-75-basic-12');
Object.assign(q70,{chapterId:'ch02',year:936,reviewOnly:false,relatedSceneId:'future_flow',relatedIllustrationId:'future-flow',resumeStoryId:'ch01_integration',gameMemory:'공산의 패배, 고창의 승리, 견훤의 귀순, 김부와 신라의 항복, 일리천 승리를 직접 지나왔습니다. 김부가 경주의 사심관이 된 장면이 들어갈 차례이므로 정답은 ③입니다.'});
Object.assign(ch02Q73,{chapterId:'ch02',year:935,reviewOnly:false,relatedSceneId:'ch01_gyeonhwon',relatedIllustrationId:'ch02-trade-room-935',resumeStoryId:'ch01_silla',gameMemory:'918년 장터의 평범한 거래 상인이 나이 든 모습으로 다시 찾아와 “견훤이 금산사를 탈출해 고려로 왔다”고 전했습니다. 후백제를 세운 인물은 견훤이므로 정답은 ③입니다.'});
Object.assign(ch02Q74,{chapterId:'ch02',year:935,reviewOnly:false,relatedSceneId:'ch01_silla',relatedIllustrationId:'ch02-trade-room-935',resumeStoryId:'ch01_jump_936',gameMemory:'신라 상인이 “내일부터 나는 어느 나라 사람이 되는가”라고 물었습니다. 경순왕 김부가 신라를 고려에 넘긴 뒤의 사건을 고르면 정답은 ④입니다.'});
Object.assign(ch02Q76,{chapterId:'ch02',year:936,reviewOnly:false,relatedSceneId:'ch01_victory',relatedIllustrationId:'route-songak',resumeStoryId:'ch01_unity',gameMemory:'견훤은 고려 편에 섰고 후백제는 신검이 이끌었습니다. 일리천에서 왕건이 신검의 군대를 물리친 장면이므로 정답은 ②입니다.'});
Object.assign(ch02Q75,{chapterId:'ch02',year:937,reviewOnly:false,relatedSceneId:'ch01_sasimgwan',relatedHistoricalEventId:'ch01-sasimgwan',historicalEvent:'태조의 지방 통치',relatedIllustrationId:'ch02-trade-room-935',resumeStoryId:'ch01_refugee_family',conceptIds:['taejo','sasimgwan','local-control'],gameMemory:'김부가 경주의 일을 살피고 지방 호족의 자제가 개경에 머무는 장면을 겪었습니다. 태조가 실시한 정책은 사심관 제도이므로 정답은 ③입니다.'});
for(const q of [q70,ch02Q73,ch02Q74,ch02Q75,ch02Q76])Object.assign(q,{retired:false,isOfficial:true,sourceVerified:true,sourceType:'official_exam',questionAuditStatus:'VERIFIED_OFFICIAL',sourceStatus:'verified_from_attached_pdf'});
for(const q of QUESTIONS.filter(question=>question.chapterId==='ch02'&&!question.isOfficial))Object.assign(q,{retired:true,reviewOnly:true,sourceStatus:'retired_self_authored_ch02_reedit',questionAuditStatus:'SELF_AUTHORED'});

const ch04Q75Anchor=QUESTIONS.find(q=>q.questionId==='ch03-official-75-basic-10');
if(ch04Q75Anchor)ch04Q75Anchor.resumeStoryId=ch04Q75Anchor.originalResumeStoryId||'ch03_policy_effect';
Object.assign(STORIES.ch03_exam_75_12,{storyActive:false,nextStoryId:'ch03_policy_effect'});delete STORIES.ch03_exam_75_12.quizId;

const CH02_OFFICIAL_STORY_IDS=[ch02Q73.questionId,ch02Q74.questionId,ch02Q76.questionId,q70.questionId,ch02Q75.questionId];
SPLIT_STORY_QUESTION_IDS.ch01.splice(0,SPLIT_STORY_QUESTION_IDS.ch01.length,...SPLIT_STORY_QUESTION_IDS.ch01.filter(id=>id!==q70.questionId));
SPLIT_REVIEW_IDS.ch01.splice(0,SPLIT_REVIEW_IDS.ch01.length,...SPLIT_REVIEW_IDS.ch01.filter(id=>id!==q70.questionId));
SPLIT_STORY_QUESTION_IDS.ch02.splice(0,SPLIT_STORY_QUESTION_IDS.ch02.length,...CH02_OFFICIAL_STORY_IDS);
SPLIT_REVIEW_IDS.ch02.splice(0,SPLIT_REVIEW_IDS.ch02.length,...CH02_OFFICIAL_STORY_IDS);
Object.assign(CHAPTERS.ch01,{questionCount:SPLIT_STORY_QUESTION_IDS.ch01.length,reviewQuestionCount:SPLIT_REVIEW_IDS.ch01.length});
Object.assign(CHAPTERS.ch02,{questionCount:CH02_OFFICIAL_STORY_IDS.length,reviewQuestionCount:CH02_OFFICIAL_STORY_IDS.length});
CHAPTERS.ch04.questionCount=QUESTIONS.filter(q=>q.chapterId==='ch04'&&!q.reviewOnly&&!q.retired).length;
HISTORY.relatedQuestions=[...SPLIT_STORY_QUESTION_IDS.ch01,...CH02_OFFICIAL_STORY_IDS];

for(const id of ['ch01_gochang','ch01_gyeonhwon','ch01_silla','ch01_victory','ch01_unity','future_flow','ch01_sasimgwan','ch01_refugee_family','ch01_welfare','ch01_hunyo'])setCh02Questions(id,[]);
setCh02Questions('ch01_gyeonhwon',[ch02Q73.questionId]);
setCh02Questions('ch01_silla',[ch02Q74.questionId]);
setCh02Questions('ch01_victory',[ch02Q76.questionId]);
setCh02Questions('future_flow',[q70.questionId]);
setCh02Questions('ch01_sasimgwan',[ch02Q75.questionId]);
for(const id of ['ch01_integration','ch01_refugee_family','ch01_welfare','ch01_hunyo'])STORIES[id].officialQuestionSlot={conceptIds:[...(STORIES[id].learningConceptIds||[])],linkedOfficialQuestions:[],officialQuestionStatus:'source_required'};

// Calendar ages remain internally consistent beyond CH.02; the player stays 23 by design.
Object.assign(STORIES.ch02_transition.enterCharacterStates.doyun,{characterAge:55,ageState:'middle_aged_949'});
Object.assign(STORIES.ch02_jump_956.enterCharacterStates.doyun,{characterAge:62,ageState:'elder_956'});
Object.assign(STORIES.ch02_jump_958.enterCharacterStates.doyun,{characterAge:64,ageState:'elder_956'});
Object.assign(STORIES.ch02_official_robes_walk.enterCharacterStates.doyun,{characterAge:66,ageState:'elder_956'});
Object.assign(STORIES.ch03_transition.enterCharacterStates.doyun,{characterAge:88,ageState:'elder_982'});

for(const key of Object.keys(CONCEPT_QUESTION_INDEX))delete CONCEPT_QUESTION_INDEX[key];
for(const q of QUESTIONS.filter(question=>!question.retired))for(const conceptId of q.conceptIds||[])(CONCEPT_QUESTION_INDEX[conceptId]||(CONCEPT_QUESTION_INDEX[conceptId]=[])).push(q.questionId);

const migrateBeforeCh02Reedit=migrateSave;
migrateSave=function(raw){
  const migrated=migrateBeforeCh02Reedit(raw),meta=migrated.meta||(migrated.meta=INITIAL_META());
  if(meta.ch02ReeditVersion!==CH02_REEDIT_VERSION){
    const retiredIds=new Set(QUESTIONS.filter(q=>q.chapterId==='ch02'&&q.retired).map(q=>q.questionId));
    const skippedScenes={ch01_giin:'ch01_refugee_family',ch01_north:'ch01_welfare',ch03_exam_75_12:'ch03_policy_effect'};
    const questionResume={
      'ch01-story-gyeonhwon':'ch01_gyeonhwon','ch02-story-geumsansa':'ch01_gyeonhwon','ch01-story-silla':'ch01_silla','ch02-story-illyecheon':'ch01_victory','ch01-boss':'future_flow','ch02-story-sasimgwan':'ch01_sasimgwan','ch01-story-integration':'ch01_sasimgwan','ch02-story-balhae-refugees':'ch01_refugee_family','ch01-story-north':'ch01_refugee_family','ch02-story-welfare':'ch01_welfare','ch01-story-hunyo':'ch01_hunyo'
    };
    const repairRun=run=>{
      if(!run)return;
      if(skippedScenes[run.storyId]){run.storyId=skippedScenes[run.storyId];run.pending=null;run.dialogueSceneId=null;run.dialogueCursor=1}
      if(retiredIds.has(run.activeQuestionId)){run.storyId=questionResume[run.activeQuestionId]||'ch02_open_935';run.activeQuestionId=null;run.questionAnswer=null;run.questionQueue=[];run.questionQueueIndex=0;run.questionQueueResumeStoryId=null;run.dialogueSceneId=null;run.dialogueCursor=1}
      run.questionQueue=(run.questionQueue||[]).filter(id=>!retiredIds.has(id));
      const year=Number(STORIES[run.storyId]?.year||0);
      if(run.currentChapter==='ch02'&&year){run.characterStates={...(run.characterStates||{}),player:{...(run.characterStates?.player||{}),...ageState('player',year,'unchanged',{outfit:'goryeo_commoner'})},doyun:{...(run.characterStates?.doyun||{}),...ch01Age(year)}};if(['ch02_news_935','ch01_gyeonhwon'].includes(run.storyId))run.characterStates.merchant_01={...(run.characterStates.merchant_01||{}),...ageState('merchant_01',935,'older_935',{variant:'normal',outfit:'plain_merchant',pose:'slightly-stooped'})}}
      run.ch02ReeditVersion=CH02_REEDIT_VERSION;
    };
    repairRun(migrated.run);repairRun(migrated.mainRun);
    const normalizeSession=session=>{if(!session?.chapterId||!SPLIT_REVIEW_IDS[session.chapterId])return session;const ids=SPLIT_REVIEW_IDS[session.chapterId],answers=Object.fromEntries(Object.entries(session.answers||{}).filter(([id])=>ids.includes(id))),results=Object.fromEntries(Object.entries(session.results||{}).filter(([id])=>ids.includes(id))),cursor=Math.max(0,ids.findIndex(id=>answers[id]===undefined));return {...session,answers,results,cursor:cursor<0?ids.length:cursor,completed:ids.length>0&&ids.every(id=>answers[id]!==undefined)}};
    if(meta.ch01ReviewSession)meta.ch01ReviewSession=normalizeSession(meta.ch01ReviewSession);
    if(meta.chapterReviewSessions)for(const id of Object.keys(meta.chapterReviewSessions))meta.chapterReviewSessions[id]=normalizeSession(meta.chapterReviewSessions[id]);
    meta.ch02ReeditVersion=CH02_REEDIT_VERSION;
  }
  migrated.version=SAVE_VERSION;
  return migrated;
};

// Re-apply the audited runtime after the older CH.01/CH.02 compatibility overrides above.
for(const [id,data] of Object.entries(OFFICIAL_CLASSIFICATION)){const q=QUESTIONS.find(item=>item.questionId===id);if(q)Object.assign(q,data,{sourceType:'official_exam',sourceVerified:true,sourceStatus:'verified_from_attached_pdf',questionAuditStatus:'VERIFIED_OFFICIAL'})}
for(const q of QUESTIONS.filter(item=>['ch01','ch02','ch03','ch04'].includes(item.chapterId)&&!item.isOfficial))Object.assign(q,{retired:true,reviewOnly:true,sourceStatus:'retired_self_authored_main_story',questionAuditStatus:'SELF_AUTHORED'});
for(const q of QUESTIONS.filter(item=>item.isOfficial&&!item.retired))q.reviewOnly=!MAIN_QUESTION_IDS[q.chapterId]?.includes(q.questionId);
for(const chapterId of ['ch01','ch02','ch03','ch04']){
  SPLIT_STORY_QUESTION_IDS[chapterId]=[...MAIN_QUESTION_IDS[chapterId]];
  SPLIT_REVIEW_IDS[chapterId]=[...REVIEW_QUESTION_IDS[chapterId]];
  Object.assign(CHAPTERS[chapterId],{questionCount:MAIN_QUESTION_IDS[chapterId].length,reviewQuestionCount:REVIEW_QUESTION_IDS[chapterId].length});
}
for(const s of Object.values(STORIES).filter(scene=>['ch01','ch02','ch03','ch04'].includes(scene.chapterId))){delete s.quizId;delete s.linkedQuestionIds;delete s.linkedOfficialQuestions;delete s.questionSequenceMode;delete s.questionSetId;delete s.questionSetStatus;delete s.officialQuestionSlot}
Object.keys(QUESTION_SETS).forEach(attachQuestionSet);
Object.assign(STORIES.rumor,{sceneType:'ambient-rumor',visibleCharacters:[],dialogues:ch01Lines([
  ['resident_a','serious','궁예가 그렇게 쫓겨날 줄 누가 알았겠소.','npc','주민 A'],
  ['resident_b','surprised','왕건 장군이 새 왕이 되고, 나라 이름은 고려라 한다더군.','npc','주민 B'],
  ['player','surprised','……궁예가 쫓겨났다고?'],['doyun','suspicious','자네 정말 아무것도 모르는군.']
])});
Object.assign(STORIES.ch01_jump_930,{dialogues:ch01Lines([
  ['narrator','neutral','공산의 패배 뒤에도 우리는 장사를 다시 시작했다.','narration'],['doyun','serious','이번에는 물건을 한 수레에 전부 싣지 맙시다.'],
  ['player','neutral','927년에 배웠네.'],['doyun','tired','비싼 수업료였소.'],['narrator','neutral','세 해 뒤, 막혔던 남쪽 길에서 다른 소식이 올라왔다.','narration']
])});
Object.assign(STORIES.ch02_policy_memory,{nextStoryId:'ch02_noble_night'});
Object.assign(STORIES.ch02_ssanggi,{nextStoryId:'ch02_exam_eve'});
Object.assign(STORIES.ch02_hyunwoo_official,{nextStoryId:'ch02_reign_titles'});
Object.assign(STORIES.ch02_reign_titles,{nextStoryId:'ch02_reign_followup'});
Object.assign(STORIES.ch02_reign_followup,{nextStoryId:'ch02_purge'});
Object.assign(STORIES.ch02_night_discussion,{nextStoryId:'ch02_complete'});
Object.assign(STORIES.ch02_memory_retrieval,{nextStoryId:'ch02_chapter_clear',dialogues:[dialogueLine('player','thinking','길상과 노비안검법, 현우와 과거제·쌍기, 관청 거리의 공복, 시장의 광덕과 준풍이 차례로 떠올랐다.','thought'),dialogueLine('player','serious','법과 시험, 관리의 옷과 왕의 연호. 서로 다른 장면이 광종의 왕권 강화라는 한 방향으로 이어졌다.','thought')]});
Object.assign(STORIES.ch02_realization,{storyActive:false,nextStoryId:'ch02_chapter_clear'});
for(const [sceneId,nextStoryId] of Object.entries(CH04_REMOVED_WRAPPERS)){if(!STORIES[sceneId])continue;Object.assign(STORIES[sceneId],{storyActive:false,nextStoryId});delete STORIES[sceneId].quizId;delete STORIES[sceneId].linkedQuestionIds;delete STORIES[sceneId].questionSequenceMode;delete STORIES[sceneId].questionSetId}
Object.assign(STORIES.ch03_gukjagam,{nextStoryId:'ch03_policy_effect'});
Object.assign(STORIES.ch03_policy_effect,{nextStoryId:'ch03_three_friends'});
Object.assign(STORIES.ch03_three_friends,{nextStoryId:'ch03_history_reflection'});
Object.assign(STORIES.ch03_history_reflection,{nextStoryId:'ch03_courtyard'});
Object.assign(STORIES.ch03_farewell,{nextStoryId:'ch03_doyun_soliloquy'});
for(const key of Object.keys(CONCEPT_QUESTION_INDEX))delete CONCEPT_QUESTION_INDEX[key];
for(const q of QUESTIONS.filter(question=>!question.retired))for(const conceptId of q.conceptIds||[])(CONCEPT_QUESTION_INDEX[conceptId]||(CONCEPT_QUESTION_INDEX[conceptId]=[])).push(q.questionId);

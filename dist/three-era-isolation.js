/* Opt-in content boundary. Never read or write the published legacy save key. */
if(globalThis.THREE_PREVIEW_RUNTIME){
  const eraId='three-kingdoms',progressKey='three-kingdoms-v2',storageKey='lived-history-three-kingdoms-v2';
  const copy=value=>JSON.parse(JSON.stringify(value));
  const ownsChapter=id=>CHAPTERS[id]?.threeStoryVersion===2;
  const ownsQuestion=id=>QUESTIONS.some(q=>q.questionId===id&&q.threeStoryVersion===2);
  const validResume=value=>!!value&&ownsChapter(value.run?.currentChapter)&&
    STORIES[value.run.pending?.sourceSceneId||value.run.storyId]?.threeStoryVersion===2&&
    (!value.mainRun||ownsChapter(value.mainRun.currentChapter));
  for(const registry of [HISTORY_SEASONS,LEARNING_ERAS]){
    const info=registry.find(item=>item.id===eraId);
    Object.assign(info,{progressKey,protagonistId:'three_v2_seoa',protagonistLabel:'삼국편 여성 주인공 · 서아',
      years:'삼국 성장 — 후삼국',description:'서아의 기록책을 따라 삼국·통일신라·발해·후삼국의 30개 이야기를 살아갑니다.',
      chapterIds:eraChapters(eraId).map(chapter=>chapter.chapterId),
      characterIds:['three_v2_seoa',...runtimeCharacterIds()]});
  }
  function runtimeCharacterIds(){return [...globalThis.THREE_PREVIEW_RUNTIME.sources.values()].map(source=>source.npcId);}
  function identifyThreeRun(value){
    if(!value||!ownsChapter(value.currentChapter))return;
    value.contentEra=eraId;value.contentVersion=2;value.protagonistId='three_v2_seoa';
    value.playerOutfit='three_traveler';
    for(const key of ['receivedGoryeoClothesFromDoyun','wearingModernClothes'])delete value.flags[key];
    value.flags.threeRecordbook=true;
    for(const key of ['doyun','hyunwoo']){delete value.relations?.[key];delete value.trust?.[key];}
    delete value.doyunLegacy;
    value.characterStates={...Object.fromEntries(Object.entries(value.characterStates||{}).filter(([key])=>key.startsWith('three_v2_'))),
      player:{characterId:'three_v2_seoa',characterAge:23,pose:'standing',outfit:'three_traveler'}};
    value.inventory=(value.inventory||[]).filter(item=>!['modern-clothes','goryeo-commoner-clothes'].includes(item.id));
    value.sharedEvents=(value.sharedEvents||[]).filter(event=>!['met_doyun_ch01','received_clothes_from_doyun'].includes(event));
    if(!value.inventory.some(item=>item.id==='three-v2-recordbook'))value.inventory.push({id:'three-v2-recordbook',status:'carried',source:'three-v2-prologue'});
  }
  function scopedMeta(){
    const m=meta(),filterKeys=(value,predicate)=>Object.fromEntries(Object.entries(value||{}).filter(([id])=>predicate(id)));
    return {completedChapters:(m.completedChapters||[]).filter(ownsChapter),
      chapterRecords:filterKeys(m.chapterRecords,ownsChapter),chapterRuns:filterKeys(m.chapterRuns,ownsChapter),
      questionRecords:filterKeys(m.questionRecords,ownsQuestion),
      wrongQuestionIds:(m.wrongQuestionIds||[]).filter(ownsQuestion),
      wrongAnswers:(m.wrongAnswers||[]).filter(item=>ownsQuestion(item.questionId)),
      reviewedQuestionIds:(m.reviewedQuestionIds||[]).filter(ownsQuestion)};
  }
  function persistIndependentResume(){
    const progress=meta().eraProgress?.[progressKey];
    if(!validResume(progress?.resume))return;
    localStorage.setItem(storageKey,JSON.stringify({schemaVersion:1,eraId,contentVersion:2,progress:copy(progress),meta:scopedMeta()}));
  }
  // The main save retains its existing structure; this era also has a self-contained recovery record.
  const beforeSave=save;
  save=function(){identifyThreeRun(run());identifyThreeRun(state.mainRun);beforeSave();persistIndependentResume();};
  // Legacy completion code writes eraId directly. Redirect only this content version.
  const beforeFinish=finishChapter;
  finishChapter=function(target){
    if(!ownsChapter(target.run.currentChapter))return beforeFinish(target);
    target.meta.eraProgress||={};
    const existed=Object.hasOwn(target.meta.eraProgress,eraId),legacy=existed?copy(target.meta.eraProgress[eraId]):null;
    delete target.meta.eraProgress[eraId];
    const result=beforeFinish(target),completed=target.meta.eraProgress[eraId];
    const own=target.meta.eraProgress[progressKey]||{};
    target.meta.eraProgress[progressKey]={...own,completed:!!completed?.completed,progress:completed?.progress||0,
      ...(completed?.completedAt?{completedAt:completed.completedAt}:{})};
    if(existed)target.meta.eraProgress[eraId]=legacy;else delete target.meta.eraProgress[eraId];
    return result;
  };
  function recoverIndependentResume(){
    if(validResume(meta().eraProgress?.[progressKey]?.resume))return;
    let stored;try{stored=JSON.parse(localStorage.getItem(storageKey)||'null');}catch{return;}
    if(stored?.schemaVersion!==1||stored.eraId!==eraId||stored.contentVersion!==2||!validResume(stored.progress?.resume))return;
    meta().eraProgress||={};meta().eraProgress[progressKey]=copy(stored.progress);
    for(const name of ['chapterRecords','chapterRuns','questionRecords']){
      const predicate=name==='questionRecords'?ownsQuestion:ownsChapter;
      const records=Object.fromEntries(Object.entries(stored.meta?.[name]||{}).filter(([id])=>predicate(id)));
      meta()[name]={...meta()[name],...copy(records)};
    }
    for(const name of ['completedChapters','wrongQuestionIds','reviewedQuestionIds']){
      const predicate=name==='completedChapters'?ownsChapter:ownsQuestion;
      meta()[name]=[...new Set([...(meta()[name]||[]),...(stored.meta?.[name]||[]).filter(predicate)])];
    }
    const recovered=(stored.meta?.wrongAnswers||[]).filter(item=>ownsQuestion(item.questionId));
    const known=new Set((meta().wrongAnswers||[]).map(item=>item.questionId));
    meta().wrongAnswers=[...(meta().wrongAnswers||[]),...copy(recovered.filter(item=>!known.has(item.questionId)))];
  }
  const beforeResume=resumeEra;
  resumeEra=function(id){
    if(id!==eraId)return beforeResume(id);
    recoverIndependentResume();
    const saved=meta().eraProgress?.[progressKey]?.resume;
    if(saved&&!validResume(saved))delete meta().eraProgress[progressKey];
    return beforeResume(id);
  };
  globalThis.THREE_ERA_ISOLATION={eraId,progressKey,storageKey,validResume,recoverIndependentResume};
}

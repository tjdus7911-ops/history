/* Install the approved era namespace before editorial UI remembers any save. */
if (globalThis.THREE_STORY_RUNTIME?.version === 3) {
  const runtime = globalThis.THREE_STORY_RUNTIME;
  const art = globalThis.THREE_COMPLETE_ART?.protagonist;
  const fallback = ERA_PROTAGONISTS.protagonist_three_kingdoms || {};
  const protagonist = runtime.protagonist;
  const active = {...fallback,id:protagonist,displayName:'서아',
    assetPaths:{...fallback.assetPaths,...Object.fromEntries((art?.files || []).map(file => [file.expression,file.src])),
      ...(art?.modernSrc?{modern:art.modernSrc}:{}),
      ...(art?.cover?.src?{hero:art.cover.src}:{})}};
  // One active protagonist per era, in the established season order. Old IDs
  // remain directly addressable for archived data without becoming a new era.
  const entries = Object.entries(ERA_PROTAGONISTS);
  for (const [id] of entries) delete ERA_PROTAGONISTS[id];
  for (const [id, value] of entries) {
    if (id === 'protagonist_three_kingdoms') ERA_PROTAGONISTS[protagonist] = active;
    else ERA_PROTAGONISTS[id] = value;
  }
  ERA_PROTAGONISTS[protagonist] = active;
  Object.defineProperty(ERA_PROTAGONISTS,'protagonist_three_kingdoms',
    {value:fallback,enumerable:false,configurable:true,writable:true});
  ERA_VISUALS['three-kingdoms'] = {...ERA_VISUALS['three-kingdoms'],protagonistId:protagonist};
  const info = HISTORY_SEASONS.find(item => item.id === 'three-kingdoms');
  if (info) Object.assign(info,{progressKey:'three-kingdoms-v3',protagonistId:protagonist,
    protagonistLabel:'삼국편 여성 주인공 · 서아',bannerAsset:art?.cover?.src || info.bannerAsset,
    years:'삼국 성장 — 후삼국',
    description:'서아의 기록책을 따라 고구려·백제·신라·가야·통일신라·발해·후삼국의 23개 이야기를 살아갑니다.',
    chapterIds:Object.values(CHAPTERS).filter(chapter => chapter.threeStoryVersion === 3).map(chapter => chapter.chapterId),
    characterIds:[...new Set([protagonist,...runtime.people.keys()])],
    contentVersion:3,contentRevision:runtime.contentVersion,prologueSceneCount:3,mainSceneCount:215});
}

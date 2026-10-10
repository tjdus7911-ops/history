/* Install the new era's namespace before editorial UI reads or remembers saves. */
if(globalThis.THREE_PREVIEW_RUNTIME){
  const art=globalThis.THREE_ART_MANIFEST.protagonist;
  ERA_PROTAGONISTS.three_v2_seoa={...ERA_PROTAGONISTS.protagonist_three_kingdoms,id:'three_v2_seoa',displayName:'서아',
    assetPaths:{...Object.fromEntries(art.files.map(file=>[file.expression,file.src])),hero:art.cover.src}};
  ERA_VISUALS['three-kingdoms']={...ERA_VISUALS['three-kingdoms'],protagonistId:'three_v2_seoa'};
  const info=HISTORY_SEASONS.find(item=>item.id==='three-kingdoms');
  Object.assign(info,{progressKey:'three-kingdoms-v2',protagonistId:'three_v2_seoa',
    protagonistLabel:'삼국편 여성 주인공 · 서아',bannerAsset:art.cover.src,years:'삼국 성장 — 후삼국',
    description:'서아의 기록책을 따라 삼국·통일신라·발해·후삼국의 30개 이야기를 살아갑니다.',
    chapterIds:historySeasonChapterIds('three-kingdoms'),
    characterIds:['three_v2_seoa',...[...globalThis.THREE_PREVIEW_RUNTIME.sources.values()].map(source=>source.npcId)]});
}

/* Visual wiring only. Preserve scene IDs, dialogue, choices and timing cues. */
const PROTO_BACKGROUND_ART={
 'proto-story-wagon':'wagon',
 'proto-story-jumong-birth':'jumong-birth',
 'proto-story-jolbon':'jolbon',
 'proto-story-camp':'forest-camp',
 'proto-story-crossroads':'forest-crossroads',
 'proto-story-map':'trade-map',
 'proto-story-workshop':'byeonhan-workshop',
 'proto-story-village':'okjeo-house',
 'proto-story-grave':'okjeo-family-tomb',
 'proto-story-sodo':'samhan-sodo',
 'proto-story-ritual':'buyeo-yeonggo'
};
for(const [id,name] of Object.entries(PROTO_BACKGROUND_ART)){
 if(!ASSETS[id])continue;
 Object.assign(ASSETS[id],{src:`assets/ancient/backgrounds/rebuild-${name}.webp`,label:`원삼국 ${name} 배경 일러스트`,imageKind:'story-background',embeddedCharacters:false,status:'ready'});
}
const PROTO_SCENE_BACKGROUND_ART={
 proto_ch02_s1:'buyeo-market',proto_ch02_s2:'buyeo-council',
 proto_ch03_s10:'goguryeo-seook',proto_ch03_s11:'goguryeo-dongmaeng',
 proto_ch05_s5:'dongye-wedding',proto_ch05_s6:'dongye-mucheon-market',proto_ch05_s7:'dongye-mucheon-market'
};
for(const [sceneId,name] of Object.entries(PROTO_SCENE_BACKGROUND_ART)){
 const source=STORIES[sceneId];if(!source)continue;
 const id=`proto-raster-${name}`;
 ASSETS[id]={id,label:`원삼국 ${name} 배경 일러스트`,src:`assets/ancient/backgrounds/rebuild-${name}.webp`,imageKind:'story-background',embeddedCharacters:false,status:'ready'};
 source.illustrationId=id;
 for(const c of source.choices||[])if(c.resultIllustrationId)c.resultIllustrationId=id;
}
for(const chapter of Object.values(CHAPTERS)){
 if(chapter.eraId!=='proto-kingdoms')continue;
 const source=STORIES[chapter.startStoryId],asset=source&&ASSETS[source.illustrationId];
 if(asset)chapter.thumbnail=asset.src;
}

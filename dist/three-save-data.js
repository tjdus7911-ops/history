/* Preserve complete v2 runs across legacy migrations that repair Goryeo outfits. */
if(globalThis.THREE_PREVIEW_RUNTIME){
  const beforeMigration=migrateSave,copy=value=>JSON.parse(JSON.stringify(value));
  const own=id=>CHAPTERS[id]?.threeStoryVersion===2;
  migrateSave=function(raw){
    const preserved=raw&&copy(raw),result=beforeMigration(raw);
    if(!preserved?.run||!preserved.meta)return result;
    if(own(preserved.run.currentChapter))result.run=copy(preserved.run);
    if(own(preserved.mainRun?.currentChapter))result.mainRun=copy(preserved.mainRun);
    for(const collection of ['chapterRecords','chapterRuns']){
      for(const [id,value] of Object.entries(preserved.meta[collection]||{}))if(own(id))result.meta[collection][id]=copy(value);
    }
    return result;
  };
}

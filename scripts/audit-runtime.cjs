const fs=require('fs');
const vm=require('vm');
const files=['data.js','ch02-data.js','ch03-data.js','exam-data.js','ch01-expansion.js','chapter-split.js','late-goryeo.js'];
const context={console};
vm.createContext(context);
for(const file of files){
  const path=`dist/${file}`;
  if(fs.existsSync(path))vm.runInContext(fs.readFileSync(path,'utf8'),context,{filename:file});
}
vm.runInContext(`
  for(const chapterId of Object.keys(CHAPTERS)){
    const scenes=Object.values(STORIES).filter(scene=>(scene.chapterId||'ch01')===chapterId&&scene.storyActive!==false);
    const dialogueCount=scenes.reduce((total,scene)=>total+(scene.dialogues?.length||0),0);
    const questions=QUESTIONS.filter(question=>question.chapterId===chapterId&&!question.reviewOnly&&!question.retired);
    console.log(chapterId, JSON.stringify({scenes:scenes.length,dialogues:dialogueCount,questions:questions.length,implemented:CHAPTERS[chapterId].implemented}));
  }
  if(typeof LATE_GORYEO_REPORT!=='undefined')console.log('late-total',JSON.stringify(LATE_GORYEO_REPORT));
`,context);

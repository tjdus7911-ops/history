const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const story=read('dist/three-story-script.json'),art=read('dist/three-art-manifest.json');
const reviews=read('docs/THREE_OFFICIAL_REVIEW_61.json').records;
const scenes=story.chapters.flatMap(chapter=>chapter.scenes);
const verified=new Set(reviews.filter(record=>record.visualQuestionReview&&record.visualAnswerReview&&record.catalogImageReview).map(record=>record.officialQuestionId));
const files=[...Object.values(art.backgrounds).map(item=>item.src),...Object.values(art.characters).map(item=>item.neutral)];
const missingAssetFiles=files.filter(file=>!fs.existsSync(path.join(root,'dist',file)));
const baseline=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const changedFiles=baseline.protectedFiles.filter(item=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist',item.path))).digest('hex')!==item.sha256).map(item=>item.path);
const shellAllowlist=new Set(['index.html','editorial-ui.js','sw.js']);
const changedProtectedFiles=changedFiles.filter(file=>!shellAllowlist.has(file));
const rows=scenes.map(scene=>({sceneId:scene.sceneId,chapterId:scene.chapterId,title:scene.title,
  expandedDialogue:scene.production.dialogue==='expanded-needs-editorial-review',
  backgroundFileReviewed:!!art.backgrounds[scene.sceneId]?.visualFileReview,
  npcFileReviewed:!!art.characters[scene.npcId]?.visualFileReview,
  verifiedQuestionPlacements:scene.learningCheckpoint.verifiedQuestionIds.filter(id=>verified.has(id)).length,
  unverifiedQuestionPlacements:scene.learningCheckpoint.verifiedQuestionIds.filter(id=>!verified.has(id)),
  desktopQA:false,mobileQA:false}));
const report={status:'SERVICE_CONNECTED_CONTENT_INCOMPLETE',completedSceneCount:0,incompleteSceneCount:scenes.length,chapterDraftCount:story.chapters.length,sceneDraftCount:scenes.length,
  choiceDraftCount:scenes.reduce((sum,scene)=>sum+scene.choices.length,0),
  expandedDialogueSceneCount:rows.filter(row=>row.expandedDialogue).length,
  uniqueVerifiedOfficialQuestionCount:verified.size,
  verifiedQuestionPlacementCount:rows.reduce((sum,row)=>sum+row.verifiedQuestionPlacements,0),
  unverifiedAssignedQuestionCount:rows.reduce((sum,row)=>sum+row.unverifiedQuestionPlacements.length,0),
  missingMinimumQuestionPlacements:rows.reduce((sum,row)=>sum+Math.max(0,2-row.verifiedQuestionPlacements),0),
  scenesWithoutQuestions:rows.filter(row=>!row.verifiedQuestionPlacements).length,
  backgroundSceneCount:rows.filter(row=>row.backgroundFileReviewed).length,
  npcSceneCount:rows.filter(row=>row.npcFileReviewed).length,newAssetFileCount:new Set(files).size,
  reusedProtagonistAssetFileCount:(art.protagonist?.files?.length||0)+(art.protagonist?.cover?1:0),
  missingAssetFiles,changedProtectedFiles,changedShellFiles:changedFiles.filter(file=>shellAllowlist.has(file)),
  genealogyImageCoverage:null,genealogyImageStatus:'Three source images unavailable; coverage cannot be measured',
  desktopVisualQA:'BLOCKED: computer-use kernel assets path initialization failure',
  mobileVisualQA:'BLOCKED: computer-use kernel assets path initialization failure',
  publicationEntryChanged:fs.readFileSync(path.join(root,'dist/index.html'),'utf8').includes('three-story-data.js'),
  scenes:rows};
fs.writeFileSync(path.join(root,'docs/THREE_READINESS.json'),JSON.stringify(report,null,2)+'\n');
if(missingAssetFiles.length||changedProtectedFiles.length||report.unverifiedAssignedQuestionCount)throw Error('Integrity check failed; inspect THREE_READINESS.json');
console.log(JSON.stringify({...report,scenes:undefined},null,2));

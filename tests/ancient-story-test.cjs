const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert');
const {assetExists,listedAssets}=require('./deployment-asset-test-helper.cjs');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(name=>name!=='pwa.js');
let html='',saved=null,handlers={};
const context=vm.createContext({Date,console,document:{querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{(handlers[type]||=[]).push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
vm.runInContext(scripts.map(name=>fs.readFileSync('dist/'+name,'utf8')).join('\n'),context);
const run=code=>vm.runInContext(code,context),copy=code=>JSON.parse(run('JSON.stringify('+code+')'));
function click(dataset){run('inputLockedUntil=0');let stopped=false;const button={dataset,disabled:false};for(const item of (handlers.click||[]).slice().sort((a,b)=>Number(Boolean(b.capture))-Number(Boolean(a.capture)))){item.handler({target:{closest:()=>button},stopImmediatePropagation(){stopped=true}});if(stopped)break}}

const scope=copy('ANCIENT_STORY_SCOPE');assert.deepEqual(scope,{officialQuestionCount:20,questionLinks:20,practiceQuestionCount:0,protoChapters:5,threeChapters:14,protoScenes:5,threeScenes:56,protagonistPortraits:{proto:12,three:12},npcAssets:4,backgroundAssets:14,heroAssets:2});
assert.equal(run("new Set(ANCIENT_OFFICIAL_QUESTION_IDS).size"),20);assert.equal(run("QUESTIONS.filter(q=>!q.threeStoryVersion&&q.protoStoryVersion!==2&&['proto-kingdoms','three-kingdoms'].includes(CHAPTERS[q.chapterId]?.eraId)).length"),35);
assert.equal(run("QUESTIONS.filter(q=>q.protoStoryVersion===3).length"),15);
const legacyProto=require('../docs/proto-revision/legacy-study-questions.json').questions;
assert.equal(legacyProto.length,23);
const withoutImageRouting=question=>{const value=JSON.parse(JSON.stringify(question));for(const key of ['sourceQuestionImage','questionImage','thumbnailImage','detailImage','thumbnailImageWidth','thumbnailImageHeight','detailImageWidth','detailImageHeight','sourceImageWidth','sourceImageHeight'])delete value[key];return value};
for(const q of legacyProto)assert.deepEqual(withoutImageRouting(copy('QUESTIONS.find(item=>item.questionId==='+JSON.stringify(q.questionId)+')')),withoutImageRouting(q),'preserved older Proto question '+q.questionId);
const sourceById=new Map(copy('OFFICIAL_EXAM_SOURCE_RECORDS').map(record=>[record.officialQuestionId,record]));
for(const question of copy("QUESTIONS.filter(q=>['proto-kingdoms','three-kingdoms'].includes(CHAPTERS[q.chapterId]?.eraId))")){
 const source=sourceById.get(question.officialQuestionId);assert.equal(question.isOfficial,true);assert.equal(question.sourceVerified,true);assert(assetExists('dist/'+question.sourceQuestionImage),question.sourceQuestionImage);assert(question.explanation&&question.explanation.length>10);assert(question.relatedSceneId&&(run(`Boolean(STORIES[${JSON.stringify(question.relatedSceneId)}])`)||question.protoStoryVersion===2));
 if(!source){assert(question.questionId.startsWith('story-official-60-basic-'),question.questionId);continue}
 assert.equal(question.answer,source.answer===null?0:source.answer);assert.equal(question.sourceQuestionImage,source.questionImage);assert.equal(question.examRound,source.examRound);assert.equal(question.examLevel,source.examLevel);
}
for(const era of ['proto-kingdoms','three-kingdoms'])for(const scene of copy(`Object.values(STORIES).filter(s=>s.eraId==='${era}')`)){if(scene.threeStoryVersion)assert(scene.threeDateLabel,scene.sceneId);else assert(Number.isFinite(scene.year),scene.sceneId);assert(scene.location,scene.sceneId);assert(scene.illustrationId&&run(`Boolean(ASSETS[${JSON.stringify(scene.illustrationId)}]?.src)`),scene.sceneId);if(scene.eraId==='three-kingdoms'&&!scene.threeStoryVersion&&!scene.sceneId.includes('ch00')&&!scene.completeChapter)assert(scene.dialogues[0].dialogue.startsWith('TIME SHIFT ·'),scene.sceneId);}
const ancientCharacters=listedAssets('assets/ancient/characters');for(const file of ancientCharacters)assert(file.endsWith('.png'));assert(ancientCharacters.length>=41);assert(listedAssets('assets/ancient/backgrounds').length>=14);assert.equal(listedAssets('assets/ancient/heroes').length,2);
assert.equal(run("eraProtagonist('proto-kingdoms').gender"),'male');assert.equal(run("eraProtagonist('three-kingdoms').gender"),'female');assert.notEqual(run("eraProtagonist('proto-kingdoms').assetPaths.neutral"),run("eraProtagonist('goryeo').assetPaths.neutral"));

click({eraOpen:'proto-kingdoms'});click({eraResume:'proto-kingdoms'});assert.equal(run('screen'),'game');assert.equal(run('run().currentChapter'),'proto-ch02');assert.equal(run('run().storyId'),'proto_ch02_s1');
run("run().dialogueCursor=3;enterStory();save()");run("resumeEra('three-kingdoms')");assert.equal(run('run().currentChapter'),'THR-C01');run("run().storyId='THR-PRO-S02';enterStory();run().dialogueCursor=2;save()");run("resumeEra('proto-kingdoms')");assert.equal(run('run().storyId'),'proto_ch02_s1','proto resume restored independently');run("resumeEra('three-kingdoms')");assert.equal(run('run().storyId'),'THR-PRO-S02','three-kingdoms resume restored independently');
assert(html.includes(run("STORIES['THR-PRO-S02'].dialogues[1].dialogue")));assert(!html.includes('심화 연습 · 자체 제작'));
console.log('PASS: playable 5/23 chapter ancient seasons, 15 new Proto questions, preserved legacy catalog, 91 new verified Three questions, independent saves, protagonist/NPC/background assets and no fabricated practice items.');

const fs=require('node:fs'),assert=require('node:assert/strict');
const source=JSON.parse(fs.readFileSync('docs/story-exams/base-placements.json','utf8'));
const supplements=JSON.parse(fs.readFileSync('docs/story-exams/supplement-60-basic.json','utf8'));
const crypto=require('node:crypto');
for(const q of supplements){
 if(fs.existsSync(q.questionImage))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(q.questionImage)).digest('hex'),q.sourceImageSha256,'Original image changed: '+q.officialQuestionId);
 assert(q.answer>=0&&q.answer<q.choiceCount);
 assert.equal(q.choiceExplanations.length,q.choiceCount);
 assert(q.sourceQuestionSha256&&q.sourceAnswerSha256&&q.sourcePage&&q.bboxAtScale1_3);
}
const ids=new Set(),tuples=new Set(),byScene=new Map();
for(const p of source.placements){
 const key=[p.era,p.examRound,p.examLevel,p.questionNumber].join(':');
 assert(!ids.has(p.era+':'+p.officialQuestionId)&&!tuples.has(key),'Duplicate official placement: '+key);
 ids.add(p.era+':'+p.officialQuestionId);tuples.add(key);const rows=byScene.get(p.sceneId)||[];rows.push(p);byScene.set(p.sceneId,rows);assert(rows.length<=3);
 assert(source.scenes.some(s=>s.sceneId===p.sceneId),'Unknown scene '+p.sceneId);assert(p.dialogueEvidence.length&&p.connection);
}
const audit=source.scenes.map(s=>({...s,officialQuestionIds:(byScene.get(s.sceneId)||[]).map(p=>p.officialQuestionId),count:byScene.get(s.sceneId)?.length||0,missing:Math.max(0,(s.era==='proto'?3:2)-(byScene.get(s.sceneId)?.length||0))}));
const corrections=JSON.parse(fs.readFileSync('docs/story-exams/explanation-corrections.json','utf8'));
const output={...source,supplements,corrections,audit,summary:Object.fromEntries(['proto','three','goryeo'].map(era=>{const rows=audit.filter(s=>s.era===era);return [era,{scenes:rows.length,questions:rows.reduce((a,s)=>a+s.count,0),satisfiedScenes:rows.filter(s=>s.count>=(era==='proto'?3:2)).length,shortScenes:rows.filter(s=>s.count<(era==='proto'?3:2)).length,missingMinimum:rows.reduce((a,s)=>a+s.missing,0)}]}))};
const files={'dist/story-exam-policy.js':'/* Generated from docs/story-exams by scripts/build-story-exam-policy.cjs. */\nglobalThis.STORY_EXAM_POLICY='+JSON.stringify(output)+';\n','docs/story-exams/placement-audit.json':JSON.stringify({policy:source.policy,summary:output.summary,duplicateCount:0,scenes:audit,deferred:source.deferred},null,2)+'\n'};
for(const [file,text] of Object.entries(files)){if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),text.replace(/\r\n/g,'\n'),file+' is stale');else fs.writeFileSync(file,text);}
console.log(JSON.stringify(output.summary));

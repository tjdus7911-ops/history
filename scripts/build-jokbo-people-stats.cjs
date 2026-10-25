#!/usr/bin/env node
/* 족보 인물별 관련 기출을 실제 기출(문제·자료 해설·선지·선지 해설)에서 찾아 dist/jokbo-people-stats.js로 만든다.
 * 사용: node scripts/build-jokbo-people-stats.cjs [--check] */
'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist/jokbo-people-stats.js');
globalThis.globalThis=globalThis;
require(path.join(root,'dist/official-exam-catalog.js'));
require(path.join(root,'dist/jokbo-people.js'));
const sources=new Map(globalThis.OFFICIAL_EXAM_SOURCE_RECORDS.map(r=>[r.officialQuestionId,r]));
const records=require(path.join(root,'dist/official-exam-explanations.json')).records;
const eraSource={prehistoric:'ancient',three:'ancient','north-south':'ancient',goryeo:'goryeo',joseon:'joseon',opening:'empire',colonial:'occupation',modern:'republic'};
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const textOf=r=>[r.question,r.clue,r.correctChoice,r.explanation,...(r.choices||[]).map(c=>typeof c==='string'?c:c?.text||'')].filter(Boolean).join('\n');
const texts=records.map(r=>({id:r.officialQuestionId,source:sources.get(r.officialQuestionId),text:textOf(r)})).filter(r=>r.source);
const exams=new Set(texts.map(r=>r.source.examRound+'-'+r.source.examLevel));
const people={};
for(const p of globalThis.JOKBO_PEOPLE.people){
 const scope=p.scope||[eraSource[p.eraId]];
 const body=p.pattern||p.names.map(escape).join('|');
 const re=new RegExp('(^|[^가-힣])(?:'+body+')');
 const ids=texts.filter(r=>{if(!scope.includes(r.source.primaryEra))return false;const t=p.exclude?r.text.replace(new RegExp(p.exclude.source,'g'),' '):r.text;return re.test(t)&&(!p.need||p.need.test(t));})
  .sort((a,b)=>b.source.examRound-a.source.examRound||(a.source.examLevel<b.source.examLevel?-1:1)||a.source.questionNumber-b.source.questionNumber).map(r=>r.id);
 people[p.id]=ids;
}
const file='/* 자동 생성: node scripts/build-jokbo-people-stats.cjs — 직접 고치지 마세요. */\nglobalThis.JOKBO_PEOPLE_STATS=Object.freeze('+JSON.stringify({examTotal:exams.size,people})+');\n';
if(process.argv.includes('--check')){
 const current=fs.existsSync(out)?fs.readFileSync(out,'utf8'):'';
 if(current!==file){console.error('jokbo-people-stats.js가 최신이 아닙니다. node scripts/build-jokbo-people-stats.cjs 를 실행하세요.');process.exit(1);}
 console.log('jokbo-people-stats.js 최신');
}else{fs.writeFileSync(out,file);console.log('wrote',path.relative(root,out),Object.keys(people).length,'people,',exams.size,'exams');}

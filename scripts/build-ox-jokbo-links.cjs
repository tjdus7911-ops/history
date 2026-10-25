#!/usr/bin/env node
/* OX 문항마다 가장 가까운 족보 키워드를 찾아 dist/ox-jokbo-links.js로 만든다(해설 아래 '족보에서 개념 보기').
 * 같은 시대의 족보 키워드 중 문장·해설과 겹치는 대표 단서(examTerms)·키워드 값·표 항목이 가장 많은 것을 고른다.
 * 사용: node scripts/build-ox-jokbo-links.cjs [--check] */
'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist/ox-jokbo-links.js');
globalThis.globalThis=globalThis;
require(path.join(root,'dist/jokbo-data.js'));
require(path.join(root,'dist/ox-quiz-curation.js'));
require(path.join(root,'dist/ox-quiz-data.js'));
const D=globalThis.JOKBO_DATA,Q=globalThis.OX_QUESTIONS;
const ERA={prehistoric:['prehistoric','proto'],kingdoms:['proto','three','north-south'],goryeo:['goryeo'],joseon:['joseon'],empire:['opening'],occupation:['colonial'],republic:['modern']};
const squash=s=>String(s||'').replace(/\s+/g,'');
// 나라·시대·분야 이름만 겹치는 것은 근거가 약해 점수에서 뺀다.
const GENERIC=new Set(['고조선','부여','고구려','옥저','동예','삼한','백제','신라','가야','발해','고려','조선','정치','경제','사회','문화','생활','제천','특산물','건국','왕','통일신라','후삼국','신석기','청동기','구석기','철기','대한제국','일제','현대']);
const parts=s=>String(s||'').split(/\s*[·→,()]\s*/).map(x=>x.trim()).filter(x=>[...squash(x)].length>=2);
function terms(k){
 const list=[];
 for(const t of k.examTerms||[])list.push([t,5]);
 for(const t of parts(k.value))list.push([t,4]);
 for(const r of k.summaryRows||[]){list.push([r.label,3]);for(const t of parts(r.value))list.push([t,3]);}
 list.push([k.label,2]);
 return list.filter(([t])=>[...squash(t)].length>=2&&!GENERIC.has(squash(t)));
}
const links={};let linked=0;
for(const q of Q){
 const text=squash(q.statement),more=squash(q.explanation);
 let best=null;
 for(const k of D.keywords.filter(k=>ERA[q.eraId].includes(k.eraId))){
  let score=0;const seen=new Set();
  for(const [t,w] of terms(k)){const s=squash(t);if(seen.has(s))continue;seen.add(s);if(text.includes(s))score+=w*2+Math.min(4,s.length/2);else if(more.includes(s))score+=w;}
  if(score&&(!best||score>best.score))best={id:k.id,score};
 }
 if(best&&best.score>=8){links[q.id]=best.id;linked++;}
}
const file='/* 자동 생성: node scripts/build-ox-jokbo-links.cjs — 직접 고치지 마세요. OX 문항 → 족보 키워드 */\nglobalThis.OX_JOKBO_LINKS=Object.freeze('+JSON.stringify(links)+');\n';
if(process.argv.includes('--check')){
 const current=fs.existsSync(out)?fs.readFileSync(out,'utf8'):'';
 if(current!==file){console.error('ox-jokbo-links.js가 최신이 아닙니다. node scripts/build-ox-jokbo-links.cjs 를 실행하세요.');process.exit(1);}
 console.log('ox-jokbo-links.js 최신');
}else{fs.writeFileSync(out,file);console.log('linked',linked,'/',Q.length);}

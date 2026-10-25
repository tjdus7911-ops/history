#!/usr/bin/env node
/* 족보 '기출 선지로 보는 활동'·'헷갈리는 선지'를 실제 기출 해설에서 만든다.
 * - 자료 해설(clue)이 "(가)는 한인 애국단이다"처럼 문제의 주인공을 밝히면, 그 문제의 정답 선지
 *   (‘옳지 않은 것’을 묻는 문제는 오답 선지)를 주인공의 활동으로 모은다.
 * - 나머지 선지는 선지 해설(meaning)이 밝힌 실제 주인("105인 사건으로 해체된 단체는 신민회이다")의 활동으로 모으고,
 *   주인공 쪽에는 '헷갈리는 선지(실제 주인)'로 남긴다.
 * - 시기·순서를 묻는 문제는 주인공의 활동이 아니므로 뺀다. 이름은 원본 기출의 시대(primaryEra) 안에서만 찾는다.
 * 사용: node scripts/build-jokbo-choice-facts.cjs [--check] */
'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist/jokbo-choice-facts.js');
globalThis.globalThis=globalThis;
require(path.join(root,'dist/official-exam-catalog.js'));
require(path.join(root,'dist/jokbo-data.js'));
require(path.join(root,'dist/jokbo-people.js'));
const D=globalThis.JOKBO_DATA,P=globalThis.JOKBO_PEOPLE;
const sources=new Map(globalThis.OFFICIAL_EXAM_SOURCE_RECORDS.map(r=>[r.officialQuestionId,r]));
const records=require(path.join(root,'dist/official-exam-explanations.json')).records.filter(r=>sources.has(r.officialQuestionId));
const eraSource={prehistoric:'ancient',proto:'ancient',three:'ancient','north-south':'ancient',goryeo:'goryeo',joseon:'joseon',opening:'empire',colonial:'occupation',modern:'republic'};
const squash=s=>String(s||'').replace(/\s+/g,'');
const NEG=/아니|무관|관련이 없|관계가 없|관련 없|다르|않|틀리|오답|해당하지/;
const PERIOD=/사이|순서|배열|시기|이전|이후|무렵|다음 상황|연표|시대순|때의 모습/;

// 대상: 인물(족보 인물 + 역대 왕)과 단체만. 키는 '띄어쓰기 뺀 이름|시대'.
const entities=new Map();
function addEntity(name,scope,{aliases=[],kind}={}){
 name=String(name||'').trim();const base=squash(name);if([...base].length<2)return;
 const key=base+'|'+scope;const cur=entities.get(key)||{key,name,scope,aliases:new Set([base]),kind};
 for(const a of aliases){const s=squash(a);if([...s].length>=2)cur.aliases.add(s);}
 if(kind==='person')cur.kind='person';entities.set(key,cur);
}
const KINGS={
 ancient:'고국천왕 미천왕 소수림왕 광개토대왕 장수왕 영양왕 영류왕 보장왕 고이왕 근초고왕 침류왕 비유왕 개로왕 문주왕 동성왕 무령왕 의자왕 눌지마립간 소지마립간 지증왕 법흥왕 진흥왕 진평왕 선덕여왕 진덕여왕 문무왕 신문왕 성덕왕 경덕왕 혜공왕 원성왕 헌덕왕 흥덕왕 진성여왕 경순왕 대조영',
 goryeo:'혜종 광종 경종 성종 목종 현종 덕종 문종 순종 헌종 숙종 예종 인종 의종 명종 신종 희종 강종 고종 원종 충렬왕 충선왕 충숙왕 충혜왕 충목왕 공민왕 우왕 창왕 공양왕',
 joseon:'태조 정종 태종 세종 문종 단종 세조 예종 성종 연산군 중종 인종 명종 선조 광해군 인조 효종 현종 숙종 경종 영조 정조 순조 헌종 철종',
 empire:'고종 순종'
};
for(const [scope,list] of Object.entries(KINGS))for(const n of list.split(' '))addEntity(n,scope,{kind:'person'});
for(const p of P.people){
 const base=p.name.replace(/ (정부|내각)$/,'');const scopes=p.scope||[eraSource[p.eraId]];
 for(const scope of scopes)addEntity(base,scope,{aliases:p.names,kind:'person'});
}
// 기관·건물·시기 이름은 활동 주체가 아니다.
const NOT_ORG=/\d|년대$|시대$|하대$|회군$|^(만권당|의정부|도평의사사|비변사|집현전|규장각|홍문관|중추원|성균관|국자감|정당|학당|서당|향교|서원)$/;
const ORG=/(회|단|당|군|대|정부|결사|연맹|학회|동맹|협회|의군부|총독부|군정서|국민회|위원회|강습소|형평사)$/;
for(const k of D.keywords){
 const scope=eraSource[k.eraId];
 for(const t of [...(k.examTerms||[]),...(k.summaryRows||[]).map(r=>r.label),k.label])if(ORG.test(squash(t))&&!NOT_ORG.test(squash(t))&&!/[·→,()]/.test(t)&&[...squash(t)].length>=3)addEntity(t,scope,{kind:'org'});
}
for(const name of ['신한 청년당','대한 자강회','보안회','헌정 연구회','대조선 국민 군단','대한인 국민회','권업회','경학사','조선 의용대','한국 독립군','조선 혁명군','북로 군정서','대한 독립군','서로 군정서','조선어 학회','조선어 연구회','진단 학회','근우회','형평사','천도교 소년회','국민 대표 회의','독립 의군부','대한 광복회','신민회','의열단','한인 애국단','신간회','독립 협회','대한민국 임시 정부','한국 광복군','조선 건국 동맹','민족 혁명당','조선 민족 전선 연맹','흥사단','대한 광복군 정부','신흥 강습소','조선 건국 준비 위원회'])
 for(const scope of ['empire','occupation','republic'])addEntity(name,scope,{kind:'org',aliases:name==='대한민국 임시 정부'?['임시 정부','임시정부']:[]});
// 고대 나라도 "(가) 나라에 대한 설명으로 옳은 것은?"처럼 자주 묻는 주인공이다.
for(const name of ['고조선','부여','고구려','옥저','동예','삼한','백제','신라','가야','금관가야','대가야','발해','후백제','태봉'])addEntity(name,'ancient',{kind:'country'});
// 불교 '선종'처럼 왕 이름과 겹치는 말, 같은 시대 안에서 이름이 겹치는 왕(백제·발해 무왕 등)은 뺀다.
for(const key of ['선종|goryeo','무왕|ancient','문왕|ancient','선왕|ancient','성왕|ancient'])entities.delete(key);
const entityList=[...entities.values()];
let baekjeContext=false;
function findAll(text,scope,{owners=false}={}){
 const s=squash(text),hits=[];
 for(const e of entityList){
  if(e.scope!==scope)continue;
  for(const a of e.aliases){
   let at=s.indexOf(a),hit=null;
   while(at>=0){
    const before=s[at-1],after=s[at+a.length];
    // 인물 이름 앞에 다른 한글이 붙으면 다른 낱말, 주인을 찾을 때 '박정희의 …'처럼 소유격은 주인이 아니다.
    const okBefore=e.kind==='org'||!before||!/[가-힣]/.test(before);
    if(e.kind==='country'&&after&&/[씨풍성왕]/.test(after)){at=s.indexOf(a,at+1);continue;}
    // 충남 부여(백제 사비 도읍)는 나라 부여가 아니다.
    if(e.key==='부여|ancient'&&(baekjeContext||/백제|사비|정림사|능산리|부소산|궁남지|낙화암/.test(s))){at=-1;break;}
    // 주인을 찾을 때: 인물은 바로 뒤가 조사(은·는·이·가·께·와·과·때)나 '정부'일 때만, 단체는 목적어·소유격(을·를·의)이 아닐 때만.
    const okAfter=!owners||!after||!/[가-힣]/.test(after)||(e.kind==='person'?/[은는이가께와과때정]/.test(after):!/[을를의]/.test(after));
    if(okBefore&&okAfter){hit={e,at,len:a.length};break;}
    at=s.indexOf(a,at+1);
   }
   if(hit){hits.push(hit);break;}
  }
 }
 hits.sort((x,y)=>x.at-y.at||y.len-x.len);
 return hits.filter(h=>!hits.some(o=>o!==h&&o.at<=h.at&&o.at+o.len>=h.at+h.len&&o.len>h.len)).map(h=>h.e);
}
const cleanChoice=t=>String(t||'').replace(/^\s*[㉠-㉦ㄱ-ㅎ]\s*[-–:]\s*/,'').replace(/^\((가|나|다|라|마)\)\s*[-–:]\s*/,'').trim();
const sentences=t=>String(t||'').split(/(?<=[.。])\s+/).filter(Boolean);
function topicSplit(sentence){const m=[...sentence.matchAll(/[은는]\s/g)];const cut=m.length?m[m.length-1].index+1:0;return [sentence.slice(0,cut),sentence.slice(cut)];}
// 선지 해설의 주인: 여러 선지를 한 문장으로 설명한 경우("우산국 복속은 지증왕, 건원 연호는 법흥왕, …")가 있어
// 쉼표로 나눈 조각 중 선지와 낱말이 가장 많이 겹치는 조각에서 찾는다. 그 조각에서는
// "…한 단체는 신민회이다"(뒤쪽)를 먼저, 없으면 "의열단은 …"(앞쪽, 한 대상일 때만)을 주인으로 본다.
const words=t=>(String(t).match(/[가-힣A-Za-z0-9]{2,}/g)||[]).map(w=>w.replace(/(을|를|이|가|은|는|의|에|에서|와|과|로|으로|하였다|되었다|이다|였다)$/,'')).filter(w=>w.length>=2);
function segmentOwner(segment,scope,exclude){
 const [head,tail]=topicSplit(segment);
 const t=findAll(tail,scope,{owners:true}).filter(e=>e.key!==exclude);if(t.length)return t[0];
 const h=findAll(head,scope,{owners:true}).filter(e=>e.key!==exclude);return h.length===1?h[0]:null;
}
function meaningOwner(meaning,scope,exclude,choiceText){
 // 해설이 문제의 주인공을 다시 언급하면("한인 애국단은 1931년 조직되었다") 그 선지가 왜 틀렸는지 설명하는 것이라 주인으로 쓰지 않는다.
 if(exclude){const e=entities.get(exclude);if(e&&[...e.aliases].some(a=>squash(meaning).includes(a)))return null;}
 const cw=new Set(words(choiceText));
 const segs=[];for(const s of sentences(meaning)){if(NEG.test(s))continue;for(const seg of s.split(/,\s*|;\s*/))segs.push(seg);}
 if(!segs.length)return null;
 if(segs.length===1)return segmentOwner(segs[0],scope,exclude);
 const scored=segs.map(seg=>({seg,score:words(seg).filter(w=>[...cw].some(c=>c.includes(w)||w.includes(c))).length})).sort((a,b)=>b.score-a.score);
 if(!scored[0].score)return null;
 return segmentOwner(scored[0].seg,scope,exclude);
}
function subjectOf(record,scope){
 const last=sentences(record.clue).pop();if(!last||NEG.test(last))return null;
 const [,tail]=topicSplit(last);return findAll(tail,scope)[0]||null;
}
const isFactText=(text,e)=>{const s=squash(text).replace(/[.。]$/,'');if([...s].length<7)return false;if(/\s-\s|\?|^\(?[가-마]\)/.test(text))return false;if(/살펴본다|알아본다|조사한다|분석한다|파악한다|검색한다|찾아본다/.test(text))return false;if(!/(다|함|음|됨|임|요|함|옴|움|짐|봄|냄|룸|킴|김|침|힘)$/.test(s))return false;return ![...e.aliases].includes(s);};
const facts=new Map(),confusers=new Map();
const push=(map,key,item)=>{if(!map.has(key))map.set(key,[]);map.get(key).push(item);};
for(const r of records){
 const scope=sources.get(r.officialQuestionId).primaryEra;
 baekjeContext=/백제|사비|정림사|능산리|부소산|궁남지|낙화암|성왕/.test([r.question,r.clue,r.correctChoice,r.explanation].join(' '));
 const choices=(r.choiceExplanations||[]).map(c=>({text:cleanChoice(c.choiceText),correct:!!c.isCorrect,meaning:c.meaning}));
 if(!choices.length)continue;
 const negative=/않은|아닌|틀린|옳지/.test(r.question||''),period=PERIOD.test(r.question||'');
 const subj=period?null:subjectOf(r,scope);
 for(const c of choices){
  if(!c.text)continue;
  const bySubject=Boolean(subj)&&(c.correct!==negative);
  const owner=bySubject?subj:meaningOwner(c.meaning,scope,subj?.key,c.text);
  if(!owner||!isFactText(c.text,owner))continue;
  // 단체 이름이 선지에 직접 들어 있으면(“의열단 창설을 주도함”) 단체가 아니라 인물의 활동이다.
  if(owner.kind==='org'&&[...owner.aliases].some(a=>squash(c.text).includes(a)))continue;
  push(facts,owner.key,{text:c.text,id:r.officialQuestionId});
  if(subj&&!bySubject&&owner.key!==subj.key)push(confusers,subj.key,{text:c.text,owner:owner.name,id:r.officialQuestionId});
 }
}
const order=id=>{const s=sources.get(id);return Number(s.examRound)*2+(s.examLevel==='advanced'?1:0);};
const newest=(a,b)=>order(b)-order(a);
// 같은 내용을 다르게 쓴 선지(“탕평비를 건립하였다”·“붕당의 폐해를 경계하기 위해 탕평비가 건립되었다”)는 하나로 묶고
// 가장 자주 나온 표현(같으면 짧은 표현)을 보여 준다.
const STOP=new Set(['하였다','되었다','위해','위한','통해','실시','설치','편찬','건립','설립','조직','시행','하기','있다','이다']);
const stems=t=>new Set(words(t).map(w=>w.replace(/(하였|되었|하여|하기|하고|되어|하는|되는|한|된|함|하다|되다)$/,'')).filter(w=>w.length>=2&&!STOP.has(w)));
const similar=(a,b)=>{if(!a.size||!b.size)return false;let n=0;for(const x of a)for(const y of b)if(x===y||(x.length>=3&&y.includes(x))||(y.length>=3&&x.includes(y))){n++;break;}return n/Math.min(a.size,b.size)>=0.75&&n>=1&&(n>=2||Math.min(a.size,b.size)===1);};
function merge(list,withOwner){
 const groups=[];
 for(const item of list){
  const st=stems(item.text);
  let g=groups.find(g=>(!withOwner||g.owner===item.owner)&&similar(g.stems,st));
  if(!g){g={stems:st,texts:new Map(),owner:item.owner,ids:[]};groups.push(g);}
  const t=item.text.replace(/\s+/g,' ');g.texts.set(t,(g.texts.get(t)||0)+1);
  if(!g.ids.includes(item.id))g.ids.push(item.id);
 }
 return groups.map(g=>{const t=[...g.texts].sort((a,b)=>b[1]-a[1]||a[0].length-b[0].length)[0][0];return {t,...(withOwner?{o:g.owner}:{}),q:g.ids.sort(newest)};}).sort((a,b)=>b.q.length-a.q.length||order(b.q[0])-order(a.q[0]));
}
const result={};
for(const e of entities.values()){
 const f=merge(facts.get(e.key)||[],false),c=merge(confusers.get(e.key)||[],true);
 if(!f.length)continue;
 result[e.key]={name:e.name,facts:f.slice(0,12),confusers:c.slice(0,8)};
}
const file='/* 자동 생성: node scripts/build-jokbo-choice-facts.cjs — 직접 고치지 마세요.\n * 키: 띄어쓰기를 뺀 이름|시대. facts: 그 대상의 활동으로 실제 출제된 선지(t)와 문항(q, 최신순).\n * confusers: 그 대상이 주인공인 문제에 함께 나온 다른 대상(o)의 선지. */\nglobalThis.JOKBO_CHOICE_FACTS=Object.freeze('+JSON.stringify(result)+');\n';
if(process.argv.includes('--check')){
 const current=fs.existsSync(out)?fs.readFileSync(out,'utf8'):'';
 if(current!==file){console.error('jokbo-choice-facts.js가 최신이 아닙니다. node scripts/build-jokbo-choice-facts.cjs 를 실행하세요.');process.exit(1);}
 console.log('jokbo-choice-facts.js 최신');
}else{fs.writeFileSync(out,file);console.log('wrote',Object.keys(result).length,'entities',Buffer.byteLength(file),'bytes');}

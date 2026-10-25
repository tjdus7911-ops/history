/* 족보 인물 모아보기: 데이터 형식, 출제 통계 최신 여부, 시대별 탭 이름, 화면 경로를 확인한다. */
'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
execFileSync(process.execPath,[path.join(root,'scripts/build-jokbo-people-stats.cjs'),'--check'],{stdio:'inherit'});
require(path.join(root,'dist/jokbo-data.js'));require(path.join(root,'dist/jokbo-people.js'));require(path.join(root,'dist/jokbo-people-stats.js'));
const P=globalThis.JOKBO_PEOPLE,S=globalThis.JOKBO_PEOPLE_STATS,eras=globalThis.JOKBO_DATA.eras.map(e=>e.id);
assert.equal(S.examTotal,36,'기출 36회');
assert.deepEqual(P.labels,{prehistoric:'인물',three:'왕·인물','north-south':'왕·인물',goryeo:'왕·인물',joseon:'왕·인물',opening:'인물',colonial:'인물',modern:'정부별'});
assert(!P.labels.proto,'원삼국은 인물 탭 없음');
const ids=new Set();
for(const p of P.people){
 assert(!ids.has(p.id),'중복 '+p.id);ids.add(p.id);
 assert(eras.includes(p.eraId)&&p.eraId!=='proto',p.id+' 시대');
 assert(P.categories[p.eraId].includes(p.category),p.id+' 분류 '+p.category);
 assert(p.chips.length>=1&&p.chips.length<=3,p.id+' 칩');
 assert(p.timeline.length>=1&&p.timeline.every(r=>r.year&&r.text),p.id+' 연표');
 assert(Array.isArray(S.people[p.id])&&S.people[p.id].length>0,p.id+' 관련 기출 없음');
}
const count=e=>P.people.filter(p=>p.eraId===e).length;
for(const e of Object.keys(P.labels))assert(count(e)>=4,e+' 인물 수');
// 같은 이름 구분: 백제 무왕·발해 무왕, 고려 성종·조선 성종이 서로 다른 문항으로 잡힌다.
const overlap=(a,b)=>S.people[a].filter(id=>S.people[b].includes(id)).length;
assert(overlap('seongjong-goryeo','seongjong-joseon')===0,'고려·조선 성종 분리');
assert(S.people['gyebaek'].every(id=>id),'계백');
const ui=fs.readFileSync(path.join(root,'dist/jokbo-ui.js'),'utf8');
for(const t of ["routes.addRoute('jokbo/person/'","data-jk-mode=\"people\"","data-jk-person-exams","screen==='jokbo-person'"])assert(ui.includes(t),'UI '+t);
console.log('jokbo-people-test ok',P.people.length,'people');

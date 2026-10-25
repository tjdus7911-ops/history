/* OX 개선: 족보 연결 파일 최신·유효, 화면 모듈 연결, 오늘의 10문제·스피드 모드·결과 저장 표시 확인. */
'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
execFileSync(process.execPath,[path.join(root,'scripts/build-ox-jokbo-links.cjs'),'--check'],{stdio:'inherit'});
require(path.join(root,'dist/jokbo-data.js'));require(path.join(root,'dist/ox-quiz-curation.js'));require(path.join(root,'dist/ox-quiz-data.js'));require(path.join(root,'dist/ox-jokbo-links.js'));
const keywords=new Set(globalThis.JOKBO_DATA.keywords.map(k=>k.id)),ox=new Set(globalThis.OX_QUESTIONS.map(q=>q.id)),links=globalThis.OX_JOKBO_LINKS;
for(const [q,k] of Object.entries(links)){assert(ox.has(q),'OX '+q);assert(keywords.has(k),'족보 '+k);}
assert(Object.keys(links).length>=230,'연결 수 '+Object.keys(links).length);
const index=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'dist/sw.js'),'utf8');
for(const f of ['ox-jokbo-links.js','ox-enhance.js']){assert(index.includes(f),f+' index');assert(sw.includes('/'+f),f+' sw');}
assert(index.indexOf('jokbo-ui.js')<index.indexOf('ox-enhance.js'),'족보 다음에 OX 개선 로드');
const ui=fs.readFileSync(path.join(root,'dist/ox-enhance.js'),'utf8');
for(const t of ['data-ox-today','data-ox-speed','data-ox-jokbo','data-ox-save-jokbo','ox-big-stamp','시간 초과','연속 정답',"startSession('daily'"])assert(ui.includes(t),'UI '+t);
const jk=fs.readFileSync(path.join(root,'dist/jokbo-ui.js'),'utf8');assert(jk.includes('openDetail:')&&jk.includes('toggleSave:'),'족보 API');
console.log('ox-enhance-test ok',Object.keys(links).length,'links');

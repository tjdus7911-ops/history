const fs=require('fs'),vm=require('vm'),assert=require('assert');
const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>!['pwa.js','editorial-ui.js'].includes(n));
let html='',saved=null;const handlers={};
const context=vm.createContext({Date,console,document:{querySelector:s=>s==='#app'?{set innerHTML(v){html=v}}:null,querySelectorAll:()=>[],addEventListener:(name,fn)=>{(handlers[name]||=[]).push(fn)},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},window:{scrollTo(){}},navigator:{},setTimeout(){return 1},clearTimeout(){}});
const run=code=>vm.runInContext(code,context);run(scripts.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n'));
assert(html.includes('今日')===false);assert(html.includes('오늘의 학습'));assert(html.includes('학습</span>'));assert(html.includes('오답노트</span>'));
const empty=run('learningSummary(state.meta)');assert.equal(empty.attempts,0);assert.equal(empty.todayAccuracy,null);assert.equal(empty.streak,0);
run("state.meta.questionRecords={'ch06-official-79-advanced-13':{attempts:3,correctCount:1,lastCorrect:false}}; state.meta.wrongQuestionIds=['ch06-official-79-advanced-13'];");
let stats=run('learningSummary(state.meta)');assert.equal(stats.attempts,3);assert.equal(stats.correct,1);assert.equal(stats.officialAttempts,3);assert.equal(stats.todayAttempts,0);assert.equal(stats.todayAccuracy,null);assert.equal(stats.weak[0].wrong,2);
run("recordQuestion(state,'ch06-official-79-advanced-13',QUESTIONS.find(q=>q.questionId==='ch06-official-79-advanced-13').answer)");stats=run('learningSummary(state.meta)');assert.equal(stats.attempts,4);assert.equal(stats.todayAttempts,1);assert.equal(stats.todayAccuracy,100);assert.equal(stats.streak,1);
run("state.meta.learningEvents.push({questionId:'ch06-official-79-advanced-13',correct:false});");assert.equal(run('learningSummary(state.meta).todayAttempts'),1);run('state.meta.learningEvents.pop()');
const before=run('JSON.stringify(state.run)');run("modal={type:'v2-memory',questionId:'ch06-official-79-advanced-13'};render()");assert(html.includes('관련 스토리 다시 보기'));assert(html.includes('assets/scenes/ch06-tripitaka-workshop.webp'));assert.equal(run('JSON.stringify(state.run)'),before);
run("modal=null;screen='study';studyTab='review';wrongFilter='official';render()");assert(html.includes('최근 틀린 문제'));assert(html.includes('제79회'));run("wrongChapter='ch01';render()");assert(html.includes('선택한 조건에 맞는 오답이 없습니다'));
run("screen='era';render()");assert(html.includes('고려 · 챕터 선택'));assert.equal((html.match(/class="v2-era-card coming"/g)||[]).length,4);
run("screen='records';render()");assert(html.includes('학습 캘린더'));assert(html.includes('누적 문제 정답률'));assert(html.includes('날짜별 기록은 V2 이후'));
for(const q of run('QUESTIONS')){const s=run('STORIES['+JSON.stringify(q.relatedSceneId)+']');if(s?.illustrationId)assert.equal(q.relatedIllustrationId,s.illustrationId,q.questionId+' exact recall')}
run('save()');const migrated=run('migrateSave('+JSON.stringify(JSON.parse(saved))+')');assert.equal(migrated.meta.learningEvents.length,1);assert.equal(migrated.meta.questionRecords['ch06-official-79-advanced-13'].attempts,4);
console.log('PASS: V2 real metrics, unknown-date legacy records, official-only filters, empty filters, safe story revisit, era readiness, calendar, recall mapping and save continuity.');

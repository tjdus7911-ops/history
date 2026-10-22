const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');

const root=path.resolve('dist'),output=path.resolve('tmp/ox-flashcard-refresh');
const server=http.createServer((req,res)=>{
  const pathname=req.url.split('?')[0],file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.statusCode=403;return res.end();}
  fs.readFile(file,(error,body)=>{
    if(error){res.statusCode=404;return res.end();}
    res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');
    res.end(body);
  });
});

async function drag(page,context,{dx,dy=2}){
  const card=page.locator('[data-r7-ox-card]');
  await card.scrollIntoViewIfNeeded();
  const box=await card.boundingBox();assert(box,'OX card must have a box');
  const x=dx<0?box.x+box.width*.78:box.x+box.width*.22,y=Math.max(box.y+28,Math.min(box.y+box.height*.5,700));
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/6,y:y+dy*i/6}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await cdp.detach();
}

async function longPress(page,selector,duration=620){
  const target=page.locator(selector),box=await target.boundingBox();assert(box,selector+' must have a box');
  const point={pointerId:71,pointerType:'touch',isPrimary:true,button:0,clientX:box.x+box.width/2,clientY:box.y+box.height/2,bubbles:true};
  await target.dispatchEvent('pointerdown',point);await page.waitForTimeout(duration);await target.dispatchEvent('pointerup',point);
}

const currentQuestion=page=>page.evaluate(()=>{
  const session=meta().oxQuiz.activeSession,id=session.questionIds[session.index],question=OX_QUESTIONS.find(item=>item.id===id);
  return {id,answer:question.answer,statement:question.statement,explanation:question.explanation};
});
const snapshot=page=>page.evaluate(()=>{const session=meta().oxQuiz.activeSession;return session&&{index:session.index,answers:{...session.answers},results:{...session.results},history:meta().oxQuiz.history.length,wrongIds:[...meta().oxQuiz.wrongIds]};});
const position=page=>page.locator('.r7-ox-count').innerText().then(text=>text.replace(/\s/g,''));
const tally=page=>page.locator('.r7-ox-tally').evaluate(node=>({right:Number(node.querySelector('.is-right b').textContent),wrong:Number(node.querySelector('.is-wrong b').textContent)}));

(async()=>{let browser;try{
  fs.mkdirSync(output,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const width of [360,390,430]){
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/#ox`);
    const fixture=await page.evaluate(()=>{
      const yes=OX_QUESTIONS.filter(question=>question.answer===true).slice(0,2),no=OX_QUESTIONS.filter(question=>question.answer===false).slice(0,2);
      if(yes.length<2||no.length<2)throw new Error('OX fixture requires two O answers and two X answers');
      const questionIds=[yes[0].id,no[0].id,yes[1].id,no[1].id];
      const protectedState=JSON.stringify({run:state.run,mainRun:state.mainRun,officialResults:meta().officialExamResults||[],questionRecords:meta().questionRecords,wrongQuestionIds:meta().wrongQuestionIds,wrongAnswers:meta().wrongAnswers});
      OX_QUIZ_API.startSession('era',null,{count:4,questionIds});
      return {questionIds,protectedState};
    });

    assert.equal(await position(page),'1/4');assert.deepEqual(await tally(page),{right:0,wrong:0});
    const geometry=await page.locator('[data-r7-ox-card]').evaluate(card=>{const r=card.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth};});
    assert(geometry.left>=0&&geometry.right<=geometry.viewport+1&&geometry.width>=280,`card clipped at ${width}: ${JSON.stringify(geometry)}`);
    assert(geometry.height>=260&&geometry.scrollWidth<=geometry.viewport+1,`card overflow at ${width}: ${JSON.stringify(geometry)}`);
    const buttons=await page.locator('[data-ox-answer]').evaluateAll(items=>items.map(item=>{const r=item.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height};}));
    assert.equal(buttons.length,2);assert(buttons.every(button=>button.left>=0&&button.right<=width+1&&button.width>=44&&button.height>=44),`answer buttons clipped at ${width}`);
    await page.screenshot({path:path.join(output,`card-${width}.png`),animations:'disabled'});

    await page.locator('[data-ox-back]').focus();await page.keyboard.press('ArrowRight');
    assert.equal(Object.keys((await snapshot(page)).answers).length,0,`a shortcut fired outside the focused card at ${width}`);
    await page.locator('[data-r7-ox-card]').evaluate(card=>{card.focus();card.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',repeat:true,bubbles:true}));});
    assert.equal(Object.keys((await snapshot(page)).answers).length,0,`a repeated shortcut answered at ${width}`);
    await page.locator('[data-r7-ox-card]').tap();assert.equal(Object.keys((await snapshot(page)).answers).length,0,`a tap advanced before answering at ${width}`);
    await drag(page,context,{dx:4,dy:-150});
    assert.equal(Object.keys((await snapshot(page)).answers).length,0,`vertical drag answered at ${width}`);
    let question=await currentQuestion(page);assert.equal(question.answer,true);
    await drag(page,context,{dx:-Math.min(220,width*.56)});
    await page.waitForFunction(id=>meta().oxQuiz.activeSession.answers[id]===false,question.id);
    let state=await snapshot(page);assert.equal(state.index,0,'answer gesture must wait for explicit next');assert.equal(state.results[question.id],false);assert.deepEqual(await tally(page),{right:0,wrong:1});
    assert((await page.locator('.r7-ox-explain').innerText()).includes(question.explanation));
    assert.equal(await page.locator('.jk-fab').count(),0,'answered OX screen must not expose the Jokbo FAB');

    const locked=await snapshot(page);
    await drag(page,context,{dx:4,dy:-150});await page.waitForTimeout(200);
    state=await snapshot(page);assert.equal(state.index,0,'answer feedback scroll must not advance');assert.equal(state.history,locked.history);
    await drag(page,context,{dx:-Math.min(220,width*.56)});await page.waitForTimeout(250);
    state=await snapshot(page);assert.equal(state.index,0,'answered card swipe must not skip the explanation');assert.equal(state.history,locked.history);assert.equal(state.answers[question.id],false);
    await longPress(page,'[data-r7-ox-card]');await page.waitForTimeout(100);assert.equal((await snapshot(page)).index,0,'long press must not advance');
    await page.locator('[data-ox-back]').tap();assert.equal((await snapshot(page)).index,0,'close must not advance');await page.evaluate(()=>REV7_OX_VIEWS.resume());await page.locator('[data-r7-ox-card][data-answered="true"]').waitFor();
    await page.locator('[data-r7-ox-card]').tap();await page.waitForFunction(()=>meta().oxQuiz.activeSession.index===1);await page.locator('[data-r7-ox-card]').tap();await page.waitForTimeout(100);assert.equal((await snapshot(page)).index,1,'rapid repeated tap must advance only one question');assert.equal(await position(page),'2/4');

    question=await currentQuestion(page);assert.equal(question.answer,false);
    await drag(page,context,{dx:Math.min(220,width*.56)});
    await page.waitForFunction(id=>meta().oxQuiz.activeSession.answers[id]===true,question.id);
    assert.deepEqual(await tally(page),{right:0,wrong:2});await page.locator('.r7-ox-tally').tap();await page.waitForFunction(()=>meta().oxQuiz.activeSession.index===2);assert.equal(await position(page),'3/4');

    question=await currentQuestion(page);assert.equal(question.answer,true);
    await page.locator('[data-ox-answer="true"]').click();assert.deepEqual(await tally(page),{right:1,wrong:2});
    assert((await page.locator('[data-ox-next]').innerText()).includes('다음'));
    await page.locator('[data-ox-next]').click();assert.equal(await position(page),'4/4');

    question=await currentQuestion(page);assert.equal(question.answer,false);
    await page.locator('[data-ox-answer="false"]').click();assert.deepEqual(await tally(page),{right:2,wrong:2});
    assert((await page.locator('[data-ox-next]').innerText()).includes('결과'));
    await page.screenshot({path:path.join(output,`feedback-${width}.png`),animations:'disabled'});
    await page.locator('[data-r7-ox-card]').tap();await page.locator('.ox-result').waitFor();

    const summary=await page.evaluate(()=>meta().oxQuiz.lastSession.summary);assert.deepEqual(summary,{...summary,total:4,correct:2,wrong:2,accuracy:50});
    const persistence=await page.evaluate(ids=>({answers:ids.map(id=>meta().oxQuiz.lastSession.answers[id]),results:ids.map(id=>meta().oxQuiz.lastSession.results[id]),wrong:ids.slice(0,2).every(id=>meta().oxQuiz.wrongIds.includes(id))}),fixture.questionIds);
    assert.deepEqual(persistence,{answers:[false,true,true,false],results:[false,false,true,true],wrong:true});
    assert.equal(await page.evaluate(()=>JSON.stringify({run:state.run,mainRun:state.mainRun,officialResults:meta().officialExamResults||[],questionRecords:meta().questionRecords,wrongQuestionIds:meta().wrongQuestionIds,wrongAnswers:meta().wrongAnswers})),fixture.protectedState,'OX cards must not mutate non-OX records');

    await page.reload();assert(await page.evaluate(ids=>ids.slice(0,2).every(id=>meta().oxQuiz.wrongIds.includes(id)),fixture.questionIds));
    await page.locator('nav [data-nav="study"]').click();await page.locator('.r7-tabs [data-wrong-filter="ox"]').click();
    const notebook=await page.locator('#app').innerText(),statements=await page.evaluate(ids=>ids.slice(0,2).map(id=>OX_QUESTIONS.find(q=>q.id===id).statement),fixture.questionIds);
    assert(statements.every(statement=>notebook.includes(statement)),'wrong OX questions missing from notebook');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
    await context.close();
  }
  console.log('PASS: OX tap-to-next gating, scroll/long-press/control exclusions, duplicate lock, buttons, result persistence and 360/390/430 fit.');
}finally{await browser?.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1;});

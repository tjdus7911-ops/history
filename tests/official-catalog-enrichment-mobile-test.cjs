const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist');
const cropLedger=require('../docs/official-exams/question-content-crops.json');
const cropById=new Map(cropLedger.records.map(record=>[record.officialQuestionId,record]));
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data)});
});

let browser;
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const desktopContext=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'}),desktopPage=await desktopContext.newPage();
  await desktopPage.goto(`http://127.0.0.1:${server.address().port}/`);await desktopPage.locator('[data-nav="exam-library"]').click();assert.equal(await desktopPage.locator('[data-official-tab="round"][aria-selected="true"]').count(),1);assert.equal(await desktopPage.locator('[data-official-round-level="all"][aria-selected="true"]').count(),1);assert.equal(await desktopPage.locator('.official-card.round').count(),36);await desktopPage.locator('[data-official-round-level="심화"]').click();
  const desktopCards=desktopPage.locator('.official-card.round'),desktopBadges=desktopPage.locator('.official-card.round .official-pass-rate-badge');assert.equal(await desktopCards.count(),23);assert((await desktopBadges.count())>0&&(await desktopBadges.count())<(await desktopCards.count()),'desktop cards must omit the badge when a verified rate is unavailable');
  const desktopLayout=await desktopCards.filter({has:desktopPage.locator('.official-pass-rate-badge')}).first().evaluate(card=>{const badge=card.querySelector('.official-pass-rate-badge'),title=card.querySelector('h2'),button=card.querySelector('.official-card-open'),cardBox=card.getBoundingClientRect(),badgeBox=badge.getBoundingClientRect(),buttonBox=button.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(title);const titleTextBox=range.getBoundingClientRect();return {badgeText:badge.textContent.trim(),badgeInside:badgeBox.left>=cardBox.left&&badgeBox.right<=cardBox.right&&badgeBox.top>=cardBox.top&&badgeBox.bottom<=cardBox.bottom,titleClear:titleTextBox.right<=badgeBox.left||titleTextBox.bottom<=badgeBox.top,bottomGap:Math.abs(cardBox.bottom-buttonBox.bottom),cardText:card.innerText}});assert(/^합격률 \d+\.\d%$/.test(desktopLayout.badgeText),'desktop badge copy changed');assert(desktopLayout.badgeInside&&desktopLayout.titleClear,'desktop title and rate badge overlap or escape the card');assert(desktopLayout.bottomGap<=1,'retired bottom rate box left card space behind');assert(!/공식 합격률|발표일|출처|OPEN/.test(desktopLayout.cardText),'desktop card still exposes retired pass-rate metadata');assert.equal(await desktopPage.locator('.official-pass-rate.card').count(),0);await desktopContext.close();
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const cropSamples=['official-57-basic-08','official-57-basic-43','official-58-basic-10','official-58-advanced-14','official-59-advanced-31','official-61-advanced-42','official-63-basic-36','official-65-advanced-17','official-67-basic-05','official-67-advanced-30','official-71-basic-17','official-73-basic-11','official-74-advanced-19','official-77-advanced-08','official-77-advanced-29','official-78-advanced-14','official-79-basic-05','official-79-basic-16','official-79-advanced-11'];
  for(const id of cropSamples){
    const expected=cropById.get(id);assert(expected,`missing crop QA fixture: ${id}`);
    await page.evaluate(questionId=>{const entry=OFFICIAL_EXAM_CATALOG.find(item=>item.canonicalQuestionId===questionId||item.sourceRecord?.officialQuestionId===questionId);if(!entry)throw new Error(`missing browser crop sample: ${questionId}`);startOfficialSession([entry],'learn')},id);
    const image=page.locator('.official-content-image img');await image.waitFor();await image.evaluate(node=>node.decode());
    const layout=await page.locator('.official-content-image').evaluate(node=>{const image=node.querySelector('img'),panel=document.querySelector('.official-choice-panel'),choices=panel.querySelector('.official-choice-grid'),box=node.closest('.official-paper').getBoundingClientRect(),imageBox=image.getBoundingClientRect(),panelBox=panel.getBoundingClientRect(),cropBox=node.getBoundingClientRect(),styles=getComputedStyle(node);return {pixelBoundary:Number(styles.getPropertyValue('--official-content-height')),cropHeight:cropBox.height,imageHeight:imageBox.height,gap:panelBox.top-box.bottom,choiceCount:choices.querySelectorAll('button').length,overflow:document.documentElement.scrollWidth>innerWidth}});
    assert.equal(layout.pixelBoundary,expected.contentCropY,`${id} did not use its exact reviewed pixel boundary`);assert(layout.imageHeight>layout.cropHeight,`${id} did not clip source choices`);assert(layout.gap>=14&&layout.gap<=32,`${id} image/choice spacing is not mobile-safe: ${layout.gap}`);assert.equal(layout.choiceCount,id.includes('-basic-')?4:5);assert.equal(layout.overflow,false,`${id} caused mobile horizontal overflow`);
  }
  await page.locator('[data-nav="exam-library"]').click();
  assert.equal(await page.locator('[data-official-tab="round"][aria-selected="true"]').count(),1);
  assert.equal(await page.locator('[data-official-round-level="all"][aria-selected="true"]').count(),1);
  assert.equal(await page.locator('.official-card.round').count(),36);
  const landing=await page.locator('.official-grid').evaluate(grid=>({rounds:[...grid.querySelectorAll('[data-official-round]')].map(button=>Number(button.dataset.officialRound)),firstDate:grid.querySelector('.official-card-date time')?.getAttribute('datetime'),hasQuestionCount:/50문항/.test(grid.querySelector('.official-card')?.innerText||''),overflow:document.documentElement.scrollWidth>innerWidth}));assert(landing.rounds.every((round,index,items)=>index===0||items[index-1]>=round),'mobile round list must be newest first');assert.equal(landing.firstDate,'2026-08-09');assert.equal(landing.hasQuestionCount,true);assert.equal(landing.overflow,false);
  await page.locator('[data-official-round-level="심화"]').click();
  await page.locator('[data-official-round="79"]').click();
  await page.locator('[data-official-start="exam"]').click();assert.equal(await page.locator('.official-exam-cover').count(),1);assert.equal(await page.evaluate(()=>meta().officialExamActiveSession),undefined);assert.equal(await page.locator('[data-official-timer]').count(),0);await page.reload();assert.equal(await page.locator('.official-exam-cover').count(),1);await page.locator('[data-official-cover-start]').click();
  const stableState=()=>page.evaluate(()=>{const snapshot=OFFICIAL_EXAM_TIMER.snapshot();return {index:snapshot.index,answers:snapshot.answers,timerState:snapshot.timerState,endTimeMs:snapshot.endTimeMs,stored:meta().officialExamActiveSession}});
  const before=await stableState();
  await page.locator('.official-paper-open').click();
  const modal=page.locator('.official-image-modal');assert.equal(await modal.count(),1);
  const box=await modal.boundingBox();assert(box&&box.x===0&&box.y===0&&Math.round(box.width)===390&&Math.round(box.height)===844,'modal must cover the mobile viewport');
  assert.deepEqual(await stableState(),before,'opening the image changed the active exam');
  const scroller=page.locator('.official-image-scroll');
  const cropLayout=await page.locator('.official-modal-content-crop').evaluate(node=>{const image=node.querySelector('img'),box=node.getBoundingClientRect(),imageBox=image.getBoundingClientRect();return {cropHeight:box.height,imageHeight:imageBox.height,copy:node.closest('.official-image-modal').innerText}});
  assert(cropLayout.imageHeight>cropLayout.cropHeight,'modal must clip the original answer-choice pixels');
  assert(cropLayout.copy.includes('원본 선지는 제외'),'modal must explain that choices moved to text buttons');
  await page.locator('[data-official-image-zoom]').click();
  assert.equal(await page.locator('.official-image-scroll.zoomed').count(),1);assert.deepEqual(await stableState(),before,'zoom changed the active exam');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'modal caused document-level horizontal overflow');
  await page.locator('[data-official-image-close]').click();assert.equal(await modal.count(),0);assert.deepEqual(await stableState(),before,'closing the image changed the active exam');
  const choiceButtons=page.locator('.official-choice-grid button'),lastChoice=choiceButtons.last();assert.equal(await choiceButtons.count(),5);const choiceText=await choiceButtons.first().locator('.official-choice-label').innerText();assert(choiceText.trim().length>1&&!/^[①②③④⑤]$/.test(choiceText.trim()),'choices must render reviewed text, not image-only numbers');const touchBox=await choiceButtons.first().boundingBox();assert(touchBox&&touchBox.height>=64&&touchBox.width>300,`choice touch target is too small: ${JSON.stringify(touchBox)}`);await choiceButtons.first().click();assert.equal(await page.locator('[data-official-pick][aria-checked="true"]').count(),1);await choiceButtons.first().click();assert.equal(await page.locator('[data-official-pick][aria-checked="true"]').count(),0,'tapping the selected choice must clear it');await choiceButtons.nth(1).click();assert.equal(await page.locator('[data-official-pick][aria-checked="true"]').count(),1,'reselection must remain single-choice');await lastChoice.scrollIntoViewIfNeeded();await page.evaluate(()=>window.scrollBy(0,100));const choiceBox=await lastChoice.boundingBox();assert(choiceBox&&choiceBox.y>=0&&choiceBox.y+choiceBox.height<=772,`text choices must scroll above mobile navigation: ${JSON.stringify(choiceBox)}`);

  await page.evaluate(()=>{const entries=OFFICIAL_EXAM_CATALOG.filter(item=>item.sourceRecord.examRound===79&&item.sourceRecord.examLevel==='심화'&&item.sourceRecord.questionNumber<=3).sort((a,b)=>a.sourceRecord.questionNumber-b.sourceRecord.questionNumber);startOfficialSession(entries,'learn')});
  const advancedAnswer=await page.evaluate(()=>QUESTIONS.find(question=>question.questionId===officialSessionQuestion().canonicalQuestionId).acceptedAnswers[0]);
  await page.locator(`[data-official-pick="${advancedAnswer}"]`).click();
  await page.locator('[data-official-submit]').click();
  const advancedChoices=page.locator('.official-choice-explanations li');
  await advancedChoices.first().waitFor({timeout:30000});
  assert.equal(await advancedChoices.count(),5,'advanced review must expose all five official choices');
  assert.equal(await page.locator('.official-choice-badge.answer').count()>=1,true,'answer state needs a text badge');
  assert.equal(await page.locator('.official-choice-badge.selected').count()>=1,true,'selected state needs a text badge');
  const attemptsBeforeScroll=await page.evaluate(()=>meta().questionRecords[officialSessionQuestion().canonicalQuestionId].attempts);
  await advancedChoices.last().scrollIntoViewIfNeeded();await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  const explanationBox=await advancedChoices.last().boundingBox();
  assert(explanationBox&&explanationBox.y<772&&explanationBox.y+explanationBox.height<=774,`last explanation must scroll above mobile navigation: ${JSON.stringify(explanationBox)}`);
  assert.equal(await page.evaluate(()=>meta().questionRecords[officialSessionQuestion().canonicalQuestionId].attempts),attemptsBeforeScroll,'reading explanations duplicated the attempt record');
  assert.equal((await page.locator('[data-official-next]').innerText()).trim(),'다음 문제');await page.locator('[data-official-next]').click();assert.equal(await page.locator('.official-feedback').count(),0);assert.equal(await page.locator('[data-official-submit]').count(),1);assert.equal(await page.locator('[data-official-pick][aria-checked="true"]').count(),0);await page.locator('[data-official-previous]').click();assert.equal(await page.locator('.official-feedback').count(),1);assert.equal(await page.evaluate(()=>meta().questionRecords[officialSessionQuestion().canonicalQuestionId].attempts),attemptsBeforeScroll,'same-session revisit duplicated the attempt record');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'learning navigation caused mobile overflow');

  await page.evaluate(()=>{const entry=OFFICIAL_EXAM_CATALOG.find(item=>item.sourceRecord.examRound===79&&item.sourceRecord.examLevel==='기본'&&item.sourceRecord.questionNumber===1);startOfficialSession([entry],'learn')});
  const basicAnswer=await page.evaluate(()=>QUESTIONS.find(question=>question.questionId===officialSessionQuestion().canonicalQuestionId).acceptedAnswers[0]);
  await page.locator(`[data-official-pick="${basicAnswer}"]`).click();await page.locator('[data-official-submit]').click();
  await page.locator('.official-choice-explanations li').first().waitFor({timeout:30000});
  assert.equal(await page.locator('.official-choice-explanations li').count(),4,'basic review must preserve four official choices');
  for(const width of [390,1280]){
    await page.setViewportSize({width,height:900});
    const responsiveCrop=await page.locator('.official-content-image').evaluate(node=>{const image=node.querySelector('img'),box=node.getBoundingClientRect(),imageBox=image.getBoundingClientRect();return {cropHeight:box.height,imageHeight:imageBox.height,right:box.right,overflow:document.documentElement.scrollWidth>innerWidth}});assert(responsiveCrop.imageHeight>responsiveCrop.cropHeight,`${width}px official image stopped clipping original choices`);assert(responsiveCrop.right<=width+1,`${width}px official image escaped the viewport`);assert.equal(responsiveCrop.overflow,false);
    const layout=await page.locator('.official-choice-explanations').evaluate(node=>{const reason=node.querySelector('.official-choice-reason'),card=reason.closest('li');return {summaries:node.querySelectorAll('.official-choice-meaning').length,reasons:node.querySelectorAll('.official-choice-reason').length,retiredHeading:/판단 이유|판단 근거/.test(node.innerText),display:getComputedStyle(reason).display,ratio:reason.getBoundingClientRect().width/card.getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth}});
    assert.equal(layout.summaries,4);assert.equal(layout.reasons,4);assert.equal(layout.retiredHeading,false);assert.equal(layout.display,'block');assert(layout.ratio>0.8,'reason collapsed into the retired label column');assert.equal(layout.overflow,false);
  }
  assert.deepEqual(errors,[]);await context.close();
  console.log('PASS: 1280px round-card badges and 390x844 fullscreen/continuous-learning layouts preserve data, state, and responsive boundaries.');
}
main().then(async()=>{await browser.close();server.close()}).catch(async error=>{console.error(error);if(browser)await browser.close();server.close();process.exitCode=1});

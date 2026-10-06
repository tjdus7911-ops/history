const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const{chromium}=require('playwright');
const root=path.resolve(__dirname,'../dist'),shots=path.resolve(__dirname,'../tmp/joseon-mobile');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{const relative=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(file,(error,buffer)=>{if(error){res.writeHead(404);return res.end()}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(buffer)})});
let browser;

async function main(){
  fs.mkdirSync(shots,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const profile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),page=await profile.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const fit=async label=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`horizontal overflow: ${label}`);
  const tap=async selector=>{const target=page.locator(selector).first();await target.waitFor({state:'attached'});await target.evaluate(element=>element.click());await page.evaluate(()=>{inputLockedUntil=0})};

  await tap('[data-era-open="joseon"]');
  assert.equal(await page.locator('.ed-chapter-row').count(),23);
  await fit('Joseon chapter list');
  await page.screenshot({path:path.join(shots,'chapter-list-390.png'),fullPage:true});
  await tap('[data-era-resume="joseon"]');
  assert.equal(await page.evaluate(()=>run().currentChapter),'joseon-ch00');

  const completed=[],seen=new Set();let guard=0,reloaded=false,decodedImages=0,wrongId=null;
  while(completed.length<23){
    assert(++guard<5000,`mobile guard ${JSON.stringify(await page.evaluate(()=>({screen,chapter:run().currentChapter,story:run().storyId,question:run().activeQuestionId,cursor:run().dialogueCursor})))}`);
    const now=await page.evaluate(()=>({screen,chapter:run().currentChapter,story:run().storyId,pending:Boolean(run().pending),cursor:run().dialogueCursor,length:run().pending?conversationEntries(STORIES[run().pending.sourceSceneId],run().pending).length:conversationEntries(STORIES[run().storyId],run().pending).length,answer:run().questionAnswer}));
    const screenKey=`${now.screen}:${now.story}`;
    if(!seen.has(screenKey)){seen.add(screenKey);await fit(screenKey)}
    if(now.screen==='game'){
      if(now.story==='joseon_ch00_s1'&&!seen.has('shot-opening')){seen.add('shot-opening');await page.screenshot({path:path.join(shots,'ch00-opening-390.png'),fullPage:true})}
      if(now.story==='joseon_ch20_s1'&&!seen.has('shot-invasion')){seen.add('shot-invasion');await page.screenshot({path:path.join(shots,'ch20-invasion-390.png'),fullPage:true})}
      if(now.cursor<now.length){await tap('[data-action="advance-dialogue"]');continue}
      if(now.pending){await tap('[data-action="result-next"]');continue}
      if(await page.locator('[data-choice]').count()){await tap('[data-choice="0"]');continue}
      await tap('[data-action="next"]');continue;
    }
    if(now.screen==='quiz'){
      if(now.answer===null){
        const question=await page.evaluate(()=>{const item=activeQuestion();return{id:item.questionId,answer:item.answer,isOfficial:item.isOfficial,chapter:item.chapterId,image:item.sourceQuestionImage,officialQuestionId:item.officialQuestionId}});
        if(question.isOfficial){
          assert.equal(question.id,question.officialQuestionId);
          const image=page.locator('.official-source-question img');assert.equal(await image.count(),1);await image.evaluate(element=>element.decode());assert(await image.evaluate(element=>element.naturalWidth>0&&element.getBoundingClientRect().width<=innerWidth));decodedImages++;
        }
        const shouldMiss=!wrongId&&question.isOfficial&&question.chapter==='joseon-ch12',answer=shouldMiss?(question.answer+1)%5:question.answer;
        if(await page.locator('[data-pick-answer]').count()){await tap(`[data-pick-answer="${answer}"]`);await tap('[data-submit-answer]')}else await tap(`[data-answer="${answer}"]`);
        if(shouldMiss)wrongId=question.id;
        assert(await page.locator('.feedback').count());continue;
      }
      await tap('[data-action="quiz-next"]');
      if(!reloaded&&now.chapter==='joseon-ch12'){
        const before=await page.evaluate(()=>({chapter:run().currentChapter,story:run().storyId,records:Object.keys(meta().questionRecords).length}));
        reloaded=true;await page.reload();await page.evaluate(()=>playMain());
        const after=await page.evaluate(()=>({chapter:run().currentChapter,story:run().storyId,records:Object.keys(meta().questionRecords).length}));assert.deepEqual(after,before);
      }
      continue;
    }
    if(now.screen==='complete'){
      if(!completed.includes(now.chapter))completed.push(now.chapter);
      if(now.chapter==='joseon-ch22'){assert(await page.getByText('새로운 시대가 다가오고 있습니다.',{exact:false}).count());await page.screenshot({path:path.join(shots,'ch22-complete-390.png'),fullPage:true});break}
      await tap('[data-nav="teaser"]');await tap('[data-action="start-chapter"]');continue;
    }
    throw Error(`unexpected screen ${now.screen}`);
  }

  assert.deepEqual(completed,Array.from({length:23},(_,index)=>`joseon-ch${String(index).padStart(2,'0')}`));
  assert.equal(decodedImages,65);assert(reloaded);assert(wrongId);
  assert.equal(await page.evaluate(()=>meta().completedChapters.filter(id=>chapterEra(id)==='joseon').length),23);
  assert.equal(await page.evaluate(()=>meta().eraProgress.joseon.completed),true);
  assert.equal(await page.evaluate(()=>libraryStatus('joseon')),'UNLOCKED');
  assert.equal(await page.evaluate(id=>meta().wrongAnswers.find(item=>item.questionId===id)?.questionId,wrongId),wrongId);
  for(const width of [375,390,430]){await page.setViewportSize({width,height:844});await fit(`complete-${width}`)}
  assert.deepEqual(errors,[]);
  console.log(`PASS: Joseon CH.00–22 mobile full play, 65 decoded official images, reload/resume, wrong-note linkage, unlock and widths 375–430. Screenshots: ${shots}`);
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close()});

const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),{_android:android}=require('playwright');
const {runFlow,output}=require('./story-mobile-qa-browser.cjs');
const app='com.nuntteoboni.history',adb=(...args)=>execFileSync('adb',args,{encoding:'utf8',timeout:30000});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let device;
async function connect(){let lastError;device||=(await android.devices({omitDriverInstall:true}))[0];assert(device,'Android emulator must be connected');for(let i=0;i<10;i++){try{const view=await device.webView({pkg:app,timeout:10000}),page=await view.page();await page.waitForFunction(()=>globalThis.CORE_APP_READY&&globalThis.HISTORY_NATIVE_RUNTIME?.isNative,null,{timeout:10000});return page;}catch(e){lastError=e;if(i===0)console.log('Waiting for native WebView:',e.message);await delay(1000);}}throw Error('Android WebView unavailable: '+lastError?.message);}
const launch=()=>adb('shell','am','start','-W','-n',app+'/.MainActivity');
(async()=>{
 fs.mkdirSync(output,{recursive:true});adb('shell','wm','size','780x1688');adb('shell','wm','density','320');adb('install','-r','android/app/build/outputs/apk/debug/app-debug.apk');adb('shell','pm','clear',app);launch();const page=await connect();assert(await page.evaluate(()=>HISTORY_NATIVE_RUNTIME.isNative));
 fs.writeFileSync(path.join(output,'android-home.png'),execFileSync('adb',['exec-out','screencap','-p']));adb('shell','uiautomator','dump','/sdcard/story-qa-window.xml');const nativeTree=adb('shell','cat','/sdcard/story-qa-window.xml');assert(!nativeTree.includes('action_bar_container'),'native title bar must not overlap the Rev.7 header');
 const info=await page.evaluate(()=>fetch('android-build-info.json').then(r=>r.json()));assert.equal(info.uiRelease,'2026-10-20-story-mobile-qa');assert.equal(info.sourceRevision,process.env.HISTORY_SOURCE_REVISION);
 const width=await page.evaluate(()=>innerWidth),result=await runFlow(page,{native:true,width,relaunch:async currentPage=>{
  assert.equal(await currentPage.evaluate(()=>JSON.parse(localStorage.getItem(KEY)).run.dialogueCursor),await currentPage.evaluate(()=>run().dialogueCursor),'latest dialogue is serialized before leaving');
  // Reproduce closing from Android home/recents: allow the pause lifecycle and
  // WebView's asynchronous disk write before killing the background process.
  adb('shell','input','keyevent','3');
  // Inspect Android activity state instead of evaluating a paused WebView.
  let background=false;for(let i=0;i<30;i++){const resumed=adb('shell','dumpsys','activity','activities').split('\n').filter(line=>/topResumedActivity|mResumedActivity/.test(line));background=resumed.length>0&&resumed.every(line=>!line.includes(app));if(background)break;await delay(100);}
  assert(background,'Android confirms app is in the background');await delay(1200);
  adb('shell','am','force-stop',app);launch();return connect();
 },screenshot:async file=>fs.writeFileSync(file,execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}))});
 const finalPage=await connect(),click=async selector=>{await finalPage.waitForFunction(()=>Date.now()>=inputLockedUntil);await finalPage.locator(selector).filter({visible:true}).first().click();};
 adb('shell','input','keyevent','4');await finalPage.locator('[data-figma-frame="M-01"]').waitFor();
  await click('nav [data-nav="home"]');await click('[data-r7-story-resume="proto-kingdoms"]');await click('[data-r7-story-continue="proto-kingdoms"]');await finalPage.locator('.r7-story-play').waitFor();
 const beforeBack=await finalPage.evaluate(()=>JSON.stringify({chapter:run().currentChapter,story:run().storyId,cursor:run().dialogueCursor,pending:run().pending}));
 await click('[data-r7-story-menu]');await click('[data-action="restart-current"]');await finalPage.locator('.r7-restart-confirm').waitFor();adb('shell','input','keyevent','4');await finalPage.locator('.r7-restart-confirm').waitFor({state:'detached'});
 assert.equal(await finalPage.evaluate(()=>JSON.stringify({chapter:run().currentChapter,story:run().storyId,cursor:run().dialogueCursor,pending:run().pending})),beforeBack,'Android Back cancels restart without data changes');
 result.checks.push('Android hardware Back routes and cancels restart');fs.writeFileSync(path.join(output,'android-back.png'),execFileSync('adb',['exec-out','screencap','-p']));
 fs.writeFileSync(path.join(output,'android-results.json'),JSON.stringify({...result,buildInfo:info},null,2));console.log('PASS real Android emulator WebView, restart/cancel/force-stop/records/hardware Back');process.exit(0);
})().catch(e=>{try{fs.writeFileSync(path.join(output,'android-failure.png'),execFileSync('adb',['exec-out','screencap','-p']));fs.writeFileSync(path.join(output,'android-logcat.txt'),adb('logcat','-d','-t','500'));}catch{}console.error(e);process.exit(1);});

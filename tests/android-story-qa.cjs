const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const {runFlow,output}=require('./story-mobile-qa-browser.cjs');
const app='com.nuntteoboni.history',adb=(...args)=>execFileSync('adb',args,{encoding:'utf8',timeout:30000});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function connect(){for(let i=0;i<60;i++){try{const pid=adb('shell','pidof',app).trim().split(/\s+/)[0];assert(pid);adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid);const browser=await chromium.connectOverCDP('http://127.0.0.1:9222',{timeout:1500});const page=browser.contexts()[0]?.pages()[0];if(page){await page.waitForFunction(()=>globalThis.CORE_APP_READY&&globalThis.HISTORY_NATIVE_RUNTIME?.isNative,null,{timeout:5000});return page;}}catch{}await delay(1000);}throw Error('Android WebView CDP unavailable');}
const launch=()=>adb('shell','am','start','-W','-n',app+'/.MainActivity');
(async()=>{
 fs.mkdirSync(output,{recursive:true});adb('shell','wm','size','780x1688');adb('shell','wm','density','320');adb('install','-r','android/app/build/outputs/apk/debug/app-debug.apk');adb('shell','pm','clear',app);launch();const page=await connect();assert(await page.evaluate(()=>HISTORY_NATIVE_RUNTIME.isNative));
 const info=await page.evaluate(()=>fetch('android-build-info.json').then(r=>r.json()));assert.equal(info.uiRelease,'2026-10-20-story-mobile-qa');assert.equal(info.sourceRevision,process.env.HISTORY_SOURCE_REVISION);
 const width=await page.evaluate(()=>innerWidth),result=await runFlow(page,{native:true,width,relaunch:async()=>{adb('shell','am','force-stop',app);launch();return connect();},screenshot:async file=>fs.writeFileSync(file,execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:20*1024*1024}))});
 fs.writeFileSync(path.join(output,'android-results.json'),JSON.stringify({...result,buildInfo:info},null,2));console.log('PASS real Android emulator WebView, restart/cancel/force-stop/records');process.exit(0);
})().catch(e=>{try{fs.writeFileSync(path.join(output,'android-failure.png'),execFileSync('adb',['exec-out','screencap','-p']));fs.writeFileSync(path.join(output,'android-logcat.txt'),adb('logcat','-d','-t','500'));}catch{}console.error(e);process.exit(1);});

/* 공개 정책: 스토리는 원삼국만 공개한다.
 * 대본·에셋·진행 기록은 그대로 보존하고, 모든 진입 함수와 직접 라우트에서만 차단한다. */
(function(){
 'use strict';
 if(typeof LEARNING_ERAS==='undefined'||!globalThis.CHAPTER_ACCESS||!globalThis.REV7_OX_VIEWS)return;
 const PUBLIC_ERA='proto-kingdoms';
 const allowedEra=id=>id===PUBLIC_ERA;
 const eraForChapter=id=>typeof chapterEra==='function'?chapterEra(id):CHAPTERS[id]?.eraId;
 for(const era of LEARNING_ERAS){era.available=allowedEra(era.id);era.status=era.available?'AVAILABLE':'COMING_SOON';}
 for(const era of globalThis.HISTORY_SEASONS||[]){era.status=allowedEra(era.id)?'AVAILABLE':'COMING_SOON';}
 function coming(id){
  const era=LEARNING_ERAS.find(row=>row.id===id)||LEARNING_ERAS.find(row=>row.id==='goryeo');
  selectedEra=era.id;eraTab='chapters';modal=null;screen='era';
  globalThis.REV7_OX_VIEWS.writeRoute('era/'+encodeURIComponent(era.id),true);render();window.scrollTo(0,0);
  toast('스토리 준비 중');return false;
 }
 const resumeBefore=resumeEra;
 resumeEra=function(id){return allowedEra(id)?resumeBefore(id):coming(id);};
 const startBefore=startAvailableChapter;
 startAvailableChapter=function(id){return allowedEra(eraForChapter(id))?startBefore(id):coming(eraForChapter(id));};
 const beginBefore=globalThis.CHAPTER_ACCESS.begin,availableBefore=globalThis.CHAPTER_ACCESS.available;
 globalThis.CHAPTER_ACCESS.begin=function(id,...args){return allowedEra(eraForChapter(id))?beginBefore(id,...args):coming(eraForChapter(id));};
 globalThis.CHAPTER_ACCESS.available=function(id){return allowedEra(eraForChapter(id))&&availableBefore(id);};
 const routes=globalThis.REV7_OX_VIEWS,applyBefore=routes.applyRoute;
 routes.setApplyRoute(function(route=routes.readRoute()){
  if(route?.startsWith('chapter-scenes/')){
   const id=decodeURIComponent(route.slice(15)),era=eraForChapter(id);
   if(!allowedEra(era))return coming(era);
  }
  if(route?.startsWith('era/')){
   const era=decodeURIComponent(route.slice(4).split('/')[0]);
   if(!allowedEra(era)){selectedEra=era;screen='era';modal=null;render();window.scrollTo(0,0);return route;}
  }
  return applyBefore(route);
 });
 const homeBefore=home;
 home=function(){return homeBefore().replaceAll('준비 중','스토리 준비 중');};
 const contentBefore=renderContent;
 renderContent=function(){
  let html=contentBefore();
  if(screen==='seasons')html=html.replaceAll('>준비 중<','>스토리 준비 중<');
  if(screen==='era'&&!allowedEra(selectedEra))html=html.replace('아직 준비 중인 시즌이에요','스토리 준비 중').replaceAll('>준비 중<','>스토리 준비 중<');
  return html;
 };
 globalThis.STORY_RELEASE_POLICY=Object.freeze({publicEra:PUBLIC_ERA,isAvailable:allowedEra,availableEraIds:[PUBLIC_ERA]});
 const raw=(globalThis.location?.hash||'').replace(/^#/,'');if(raw.startsWith('chapter-scenes/')||raw.startsWith('era/'))routes.applyRoute(raw);else render();
})();

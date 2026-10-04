// CH.06 art-only overlay. Existing scene IDs, content, quizzes and saves stay intact.
// Different events get different settings; the two rescue scenes share one retreat route.
const CH06_BACKGROUND_MAP={
  ch06_coup:['palace-coup','1009년 정변으로 긴장한 개경 궁성'],
  ch06_march:['khitan-crossing','1010년 겨울 국경을 넘어오는 거란군'],
  ch06_gangjo:['tongju-defeat','1010년 통주 패전 뒤의 전장'],
  ch06_gaegyeong:['gaegyeong-fire','1011년 불타는 개경'],
  ch06_burned_market:['burned-market','1011년 새벽 불탄 개경 장터와 남은 사람들'],
  ch06_flight:['naju-flight','1011년 나주로 향하는 겨울 피난 행렬'],
  ch06_yanggyu:['yanggyu-rescue','1011년 흥화진 인근 퇴로에서 돌아오는 백성들'],
  ch06_rescue:['yanggyu-rescue','1011년 흥화진 인근 퇴로에서 돌아오는 백성들'],
  ch06_loss:['aejeon-loss','1011년 애전 전투 뒤의 쓸쓸한 전장'],
  ch06_rebuild:['city-reconstruction','1012년 불탄 터전에서 다시 세우는 개경'],
  ch06_woodblocks:['tripitaka-workshop','1012년 초조대장경 목판을 새기는 사찰 작업장'],
  ch06_memory:['restored-gate','1012년 전쟁의 흔적이 남은 복구된 성문'],
  ch06_warning:['northern-beacon','1018년 다시 불이 오른 북방 봉수대'],
  ch06_after:['heunghwajin-dam','1018년 새벽 흥화진 성곽 앞 물길 작전 준비']
};
for(const [sceneId,[name,label]] of Object.entries(CH06_BACKGROUND_MAP)){
  const s=STORIES[sceneId];
  if(!s||s.chapterId!=='ch06')throw new Error('Invalid CH.06 art mapping: '+sceneId);
  const artId='ch06-'+name,src='assets/scenes/'+artId+'.webp';
  if(!ASSETS[artId])lateDedicatedArt(artId,src,label);
  s.illustrationId=artId;
  s.backgroundImage=src;
  // Choice results stay in the same burning-capital setting, rather than restoring old art.
  for(const choice of s.choices||[])choice.resultIllustrationId=artId;
}

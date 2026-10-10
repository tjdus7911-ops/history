const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const imported = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const eventRows = fs.readFileSync(path.join(__dirname, 'three-scene-events.tsv'), 'utf8')
  .split(/\r?\n/).filter(line => line && !line.startsWith('#')).map(line => line.split('|'));
if (eventRows.length !== 90 || eventRows.some(row => row.length !== 10)) throw Error('Expected 90 complete authored events');
const events = new Map(eventRows.map(row => [row[0], row.slice(1)]));
const polished = Object.assign({},...['three-dialogue-polish.json','three-dialogue-polish-ch02.json'].map(file=>JSON.parse(fs.readFileSync(path.join(__dirname,file),'utf8'))));
if (events.size !== 90) throw Error('Duplicate authored scene');
const line = (speaker, text, expression='neutral') => ({speaker, text, expression});
const emotional = text => /죽|전사|멸망|피란|울|두려|상처|굶/.test(text) ? 'sad' : /놀|낯선|처음|흔들/.test(text) ? 'surprised' : 'neutral';
const questionLinks = {
  '5.1': [4], '5.2': [4], '6.1': [6], '6.2': [6], '8.1': [3],
  '9.2': [6], '19.3': [7], '20.1': [7], '20.2': [7], '25.1': [8],
  '26.1': [5], '27.2': [10], '30.1': [11]
};
const chapters = imported.chapters.map(chapter => ({number: chapter.number, title: chapter.title, country: chapter.country,
  scenes: chapter.scenes.map(source => {
    const key = `${chapter.number}.${source.number}`;
    const [opening, player, npc, ...branches] = events.get(key) || [];
    if (!opening || branches.length !== 6) throw Error(`Missing event ${key}`);
    const npcName = source.cast.split(',')[1].trim();
    const sceneId = `three_v2_ch${String(chapter.number).padStart(2,'0')}_s${source.number}`;
    const chapterId = `three-v2-ch${String(chapter.number).padStart(2,'0')}`;
    const historicalDates={'1.1':'194년 봄','1.2':'194년 10월','1.3':'195년 가을'};
    const dateLabel=historicalDates[key]||source.dateLabel;
    const previous = source.number > 1 ? chapter.scenes[source.number-2] : null;
    const previousLabel=previous?(historicalDates[`${chapter.number}.${previous.number}`]||previous.dateLabel):null;
    const shift = !previous || previousLabel !== dateLabel;
    const transition = chapter.number===1 && source.number===1
      ? '현대의 책상. 서아가 낡은 역사 기록책을 펼치자 빈 곡식 자루가 그려진 장이 빛났다. 손끝의 종이 감촉이 차가운 바람으로 바뀌었다.'
      : shift ? `기록책의 장이 넘어갔다. ${dateLabel} · ${chapter.country}. 앞 장의 사람들은 자신의 시대에 남고, 서아만 새 장의 현장에 도착했다.`
      : `같은 ${dateLabel}의 다음 현장으로 길이 이어졌다.`;
    const authored=polished[key];
    const expand=entries=>entries.map(([speaker,text,expression='neutral'])=>line(speaker,text,expression));
    return {number: source.number, sceneId, chapterId, title: source.title, dateLabel, sourceDateLabel:source.dateLabel,
      country: chapter.country, sourceLine: source.sourceLine, originalTopic: source.learningTopic, topicTag: source.topicTag,
      npcName, npcId: `${sceneId}_npc`, backgroundBrief: source.background,
      dialogues: authored?expand(authored.dialogues):[line('나레이션', transition), line('나레이션', opening), line('서아', player, emotional(player)), line(npcName, npc, emotional(npc))],
      choices: [0,1,2].map(index => ({label: branches[index*2],
        dialogues: authored?expand(authored.branches[index]):[line('나레이션', `서아는 선택한 행동을 실행했다. ${branches[index*2]}`), line('나레이션', branches[index*2+1])],
        action: branches[index*2], reaction: branches[index*2+1],
        flags: {[`threeChoice_${chapter.number}_${source.number}`]: index},
        directions: ['서아가 선택한 행동을 실행한다.', 'NPC는 선택 결과에 적힌 행동과 감정으로 반응한다.']})),
      learningCheckpoint: {topic: source.learningTopic, tag: source.topicTag, targetQuestionCount: 2,
        verifiedQuestionIds: (questionLinks[key] || []).map(number => `official-61-advanced-${String(number).padStart(2,'0')}`)},
      common: authored?expand(authored.common):chapter.number===30 && source.number===3
        ? [line('나레이션','마지막 기록이 끝나자 서아는 기록책을 덮었다. 다시 현대의 책상 앞이었다. 지도 속 나라 이름은 예전과 같았지만, 이제 그 이름 곁에서 살아온 사람들의 얼굴이 떠올랐다.'),line('서아','이름만 기억하는 게 아니야. 그 이름을 부르던 사람들도 기억할게.','smile')]
        : [line('나레이션', `서아는 방금 만난 사람의 말과 행동을 기록책에 남겼다. 책의 가장자리에 ‘${source.topicTag}’라는 단서가 떠올랐다.`)],
      production: {dialogue: authored?'expanded-needs-editorial-review':'event-draft-needs-dialogue-expansion', background: 'pending-scene-art-review', npc: 'pending-character-art',
        questions: (questionLinks[key] || []).length >= 2 ? 'assigned-needs-topic-review' : 'insufficient-verified-questions',
        desktopQA: 'not-run', mobileQA: 'not-run'}};
  })}));
const output = {schemaVersion: 2, status: 'development-preview-not-release-ready',
  source: imported.source, chapterCount: 30, sceneCount: 90, choiceCount: 270,
  fictionNotice: '서아와 현장 인물의 대화·개인적 사건은 역사 학습을 위한 창작입니다. 역사적 결과는 선택으로 바뀌지 않습니다.',
  chapters};
const json = JSON.stringify(output, null, 2)+'\n';
fs.writeFileSync(path.join(root,'dist/three-story-script.json'), json);
fs.writeFileSync(path.join(root,'dist/three-story-script.js'), 'globalThis.THREE_STORY_SCRIPT='+json.trim()+';\n');
const reviewed = JSON.parse(fs.readFileSync(path.join(root,'docs/THREE_OFFICIAL_REVIEW_61.json'),'utf8'));
fs.writeFileSync(path.join(root,'dist/three-official-review.js'),'globalThis.THREE_VERIFIED_REVIEW_RECORDS='+JSON.stringify(reviewed.records)+';\n');
const artManifest=JSON.parse(fs.readFileSync(path.join(root,'dist/three-art-manifest.json'),'utf8'));
const protagonistDir=path.join(root,'dist/assets/ancient/three-v2/characters');
fs.mkdirSync(protagonistDir,{recursive:true});
const expressions=['neutral','smile','surprised','embarrassed','suspicious','angry','sad','determined','fear','worried','relieved'];
const reusedProtagonistFiles=expressions.map(expression=>{
  const source=`assets/ancient/characters/three-player-${expression}.png`,target=`assets/ancient/three-v2/characters/seoa-${expression}.png`;
  fs.copyFileSync(path.join(root,'dist',source),path.join(root,'dist',target));
  return {expression,source,src:target};
});
const coverSource='assets/ancient/heroes/three-kingdoms.jpg',coverTarget='assets/ancient/three-v2/heroes/seoa-cover.jpg';
fs.mkdirSync(path.join(root,'dist/assets/ancient/three-v2/heroes'),{recursive:true});
fs.copyFileSync(path.join(root,'dist',coverSource),path.join(root,'dist',coverTarget));
artManifest.protagonist={characterId:'three_v2_seoa',sourceKind:'existing-three-heroine-reused-in-independent-directory',files:reusedProtagonistFiles,cover:{source:coverSource,src:coverTarget},desktopRenderReview:false,mobileRenderReview:false};
fs.writeFileSync(path.join(root,'dist/three-art-manifest.json'),JSON.stringify(artManifest,null,2)+'\n');
fs.writeFileSync(path.join(root,'dist/three-art-manifest.js'),'globalThis.THREE_ART_MANIFEST='+JSON.stringify(artManifest)+';\n');
// The official entry owns the module order; the optional preview only changes its save key.
let html = fs.readFileSync(path.join(root,'dist/index.html'),'utf8')
  .replace('<script src="three-content-config.js"></script>', '<script>globalThis.THREE_ENABLE_DEVELOPMENT_PREVIEW=true;</script>\n  <script src="three-content-config.js"></script>')
  .replace('<script src="app.js"></script>', '<script src="three-preview-app.js"></script>')
  .replace('<script src="editorial-ui.js"></script>', '<script src="three-preview-editorial-ui.js"></script>')
  .replace('<script src="pwa.js"></script>','');
fs.writeFileSync(path.join(root,'dist/three-preview.html'), html);
const app = fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
if(!app.includes("KEY='lived-history-v1'"))throw Error('Preview storage-key contract changed');
fs.writeFileSync(path.join(root,'dist/three-preview-app.js'),app.replace("KEY='lived-history-v1'","KEY='lived-history-three-development-v2'"));
const editorial=fs.readFileSync(path.join(root,'dist/editorial-ui.js'),'utf8');
fs.writeFileSync(path.join(root,'dist/three-preview-editorial-ui.js'),editorial);
console.log('Built development manuscript: 30 chapters, 90 authored events, 270 distinct actions and outcomes.');

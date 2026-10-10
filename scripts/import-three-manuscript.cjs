/* Import the supplied manuscript without installing unfinished content in the game. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const source = process.argv[2];
const destination = process.argv[3];
if (!source || !destination) throw Error('Usage: node scripts/import-three-manuscript.cjs SOURCE.md OUTPUT.json');
const bytes = fs.readFileSync(source);
const text = bytes.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const chapterMatches = [...text.matchAll(/^## CH\.(\d+) — (.+) \((.+)\)$/gm)];
const lineNumber = offset => text.slice(0, offset).split('\n').length;
function dialogueLines(section) {
  return section.split('\n').flatMap(line => {
    const match = line.match(/^(?:- )?([^:*]+): "(.*)"$/);
    return match ? [{speaker: match[1].trim(), text: match[2]}] : [];
  });
}
function section(body, start, end) {
  const offset = body.indexOf(start);
  if (offset < 0) throw Error(`Missing manuscript section: ${start}`);
  const from = offset + start.length;
  const until = end ? body.indexOf(end, from) : -1;
  return body.slice(from, until < 0 ? undefined : until).trim();
}
const chapters = chapterMatches.map((match, chapterIndex) => {
  const chapterBody = text.slice(match.index, chapterMatches[chapterIndex + 1]?.index);
  const sceneMatches = [...chapterBody.matchAll(/^### S(\d+) — (.+) \| (.+)$/gm)];
  const scenes = sceneMatches.map((sceneMatch, sceneIndex) => {
    const body = chapterBody.slice(sceneMatch.index, sceneMatches[sceneIndex + 1]?.index);
    const learning = body.match(/^- 족보\/학습: \*\*(.+?)\*\*\. 주제 태그 `(.+?)`\./m);
    const cast = body.match(/^- 등장: (.+)$/m)?.[1];
    const background = body.match(/^- 배경 일러스트: (.+)$/m)?.[1];
    if (!learning || !cast || !background) throw Error(`Missing scene metadata: ${match[1]}/${sceneMatch[1]}`);
    const choices = [...body.matchAll(/^\*\*선택지 ([ABC]) — (.+)\*\*$/gm)].map((choiceMatch, index, list) => {
      const chunk = body.slice(choiceMatch.index, list[index + 1]?.index ?? body.indexOf('**선택 후 공통 합류**'));
      const label = chunk.match(/^- 선택지: "(.+)"$/m)?.[1];
      if (!label) throw Error('Missing choice label');
      return {key: choiceMatch[1], title: choiceMatch[2], label,
        dialogues: dialogueLines(chunk).filter(line => line.speaker !== '선택지'),
        result: chunk.match(/^- 결과: (.+)$/m)?.[1] ?? ''};
    });
    const dialogues = dialogueLines(section(body, '**게임 출력 대사 전문 (공통 도입)**', '**선택지 A'));
    const common = dialogueLines(section(body, '**선택 후 공통 합류**', '**실제 심화 기출 연결 지시**'));
    if (!dialogues.length || !common.length || choices.length !== 3 || choices.some(choice => !choice.dialogues.length)) {
      throw Error(`Incomplete scene: ${match[1]}/${sceneMatch[1]}`);
    }
    return {number: Number(sceneMatch[1]), title: sceneMatch[2], dateLabel: sceneMatch[3],
      sourceLine: lineNumber(match.index + sceneMatch.index), background, cast,
      learningTopic: learning[1], topicTag: learning[2], dialogues, choices, common,
      examInstructions: section(body, '**실제 심화 기출 연결 지시**', '**다음 장면 연결**'),
      transition: section(body, '**다음 장면 연결**'),
      production: {dialogue: 'requires-event-rewrite', artwork: 'pending', officialQuestions: 'unverified'}};
  });
  return {number: Number(match[1]), title: match[2], country: match[3], sourceLine: lineNumber(match.index), scenes};
});
if (chapters.length !== 30 || chapters.some((chapter, index) => chapter.number !== index + 1 || chapter.scenes.length !== 3 || chapter.scenes.some((scene, index) => scene.number !== index + 1))) {
  throw Error('Expected exactly CH.01–30, each containing S01–03');
}
const result = {schemaVersion: 1, status: 'source-import-only',
  source: {filename: path.basename(source), sha256: crypto.createHash('sha256').update(bytes).digest('hex')},
  chapterCount: chapters.length, sceneCount: chapters.reduce((count, chapter) => count + chapter.scenes.length, 0),
  originalPreamble: text.slice(0, chapterMatches[0].index).trim(), chapters};
fs.mkdirSync(path.dirname(destination), {recursive: true});
fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({chapterCount: result.chapterCount, sceneCount: result.sceneCount,
  choiceCount: chapters.reduce((count, chapter) => count + chapter.scenes.reduce((count, scene) => count + scene.choices.length, 0), 0),
  sourceSha256: result.source.sha256}));

#!/usr/bin/env python3
"""Install the approved five-scene Proto story and verified official questions."""
from pathlib import Path
import argparse
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/proto-revision/눈떠보니원삼국_개정게임데이터.json'
EXPECTED_SHA = '13f950c903028d8ae17d74e28eb62d8416f15dc33b84986b921a8c7fb981b4f9'
LEGACY_QUESTIONS = ROOT / 'docs/proto-revision/legacy-study-questions.json'
LEGACY_SHA = '32b3abdec10a4e359a8935c76dec0725d7780b61d4e118395e02baa7e130e016'


def verify(data):
    chapters = data['chapters']
    scenes = [scene for chapter in chapters for scene in chapter['scenes']]
    assert len(chapters) == 5 and len(scenes) == 5
    assert [chapter['chapterNumber'] for chapter in chapters] == [2, 3, 4, 5, 6]
    assert len({scene['sceneId'] for scene in scenes}) == 5
    by_id = {scene['sceneId']: scene for scene in scenes}
    all_lines, all_line_ids = [], set()
    learning_ids = {item['id'] for item in data['learning']}
    assert len(learning_ids) == 31
    all_scene_ids = {scene['sceneId'] for scene in scenes}
    assert all(item['firstSceneId'] in all_scene_ids for item in data['learning'])
    assert all(set(item['sceneIds']) <= all_scene_ids for item in data['learning'])
    for index, scene in enumerate(scenes):
        assert scene['country'] and scene['place'] and scene['location']
        assert scene['nextSceneId'] == (scenes[index + 1]['sceneId'] if index + 1 < len(scenes) else None)
        assert scene['choices'] == []
        assert scene['learning'] and all(item['id'] in learning_ids for item in scene['learning'])
        assert all(item['firstSceneId'] in all_scene_ids for item in scene['learning'])
        lines = [*scene['main'], *scene['join']]
        all_lines.extend(lines)
        for line in lines:
            assert isinstance(line.get('learningKeywordIds'), list)
            assert set(line['learningKeywordIds']) <= learning_ids
            assert line['lineId'] not in all_line_ids
            all_line_ids.add(line['lineId'])
        line_by_id = {line['lineId']: line for line in lines}
        assert set(scene['keyDialogueLineIds']) == {line['lineId'] for line in lines if line['learningKeywordIds']}
        assert all(entry['text'] == line_by_id[entry['lineId']]['text'] for entry in scene['keyDialogues'])
        assert {entry['lineId'] for entry in scene['keyDialogues']} == set(scene['keyDialogueLineIds'])
        assert set(scene['learningIds'] if 'learningIds' in scene else [item['id'] for item in scene['learning']]) <= learning_ids

    text_by_country = {
        scene['country']: '\n'.join(line['text'] for line in [*scene['main'], *scene['join']])
        for scene in scenes
    }
    required = {
        '부여': ['5부족 연맹체', '사출도', '영고', '12월', '1책 12법'],
        '고구려': ['5부족 연맹체', '연맹왕국', '동맹', '10월', '서옥제', '1책 12법'],
        '옥저': ['읍군·삼로', '민며느리제', '가족 공동 무덤', '소금', '어물'],
        '동예': ['읍군·삼로', '무천', '10월', '족외혼', '책화', '단궁', '과하마', '반어피'],
        '삼한': ['소도', '천군', '계절제', '10월', '두레', '철', '수출'],
    }
    for country, keywords in required.items():
        for keyword in keywords:
            assert keyword in text_by_country[country], f'{country}: missing spoken keyword {keyword}'

    questions, queues = data['examPlan']['questions'], data['examPlan']['queues']
    assert len(questions) == 15 and len(queues) == 5
    ids = [question['officialQuestionId'] for question in questions]
    assert len(set(ids)) == 15
    catalog = {question['officialQuestionId']: question for question in json.loads((ROOT / 'dist/official-exam-catalog.json').read_bytes())}
    options = {question['officialQuestionId']: question for question in json.loads((ROOT / 'dist/official-exam-choices.json').read_bytes())['records']}
    explanations = {question['officialQuestionId']: question for question in json.loads((ROOT / 'dist/official-exam-explanations.json').read_bytes())['records']}
    question_by_id = {question['officialQuestionId']: question for question in questions}
    queue_ids = []
    for queue in queues:
        scene = by_id[queue['sceneId']]
        last = (scene['join'] or scene['main'])[-1]
        assert (queue['afterLineId'], queue['afterSpeaker'], queue['afterText']) == (last['lineId'], last['speaker'], last['text'])
        assert queue['officialQuestionIds'] == scene['quizAfter']['officialQuestionIds']
        assert len(queue['officialQuestionIds']) == queue['count'] == 3
        queue_ids.extend(queue['officialQuestionIds'])
    assert len(queue_ids) == 15 and set(queue_ids) == set(ids)
    for question in questions:
        official_id = question['officialQuestionId']
        original, choice, detail = catalog[official_id], options[official_id], explanations[official_id]
        assert question['proposed']['quizAfterSceneId'] in by_id
        assert question['proposed']['quizAfterSceneId'] in question['proposed']['requiresReadSceneIds']
        assert all(scene_id in by_id for scene_id in question['proposed']['requiresReadSceneIds'])
        assert question['answerIndex0'] == original['answer']
        assert question['answerNumber1'] == original['answer'] + 1
        assert question['choiceCount'] == len(choice['choices']) == {'기본': 4, '심화': 5}[question['examLevel']]
        assert len(detail['choiceExplanations']) == question['choiceCount']
        assert question['examRound'] == original['examRound'] and question['examYear'] == original['examYear']
        assert question['examLevel'] == original['examLevel'] and question['questionNumber'] == original['questionNumber']
        assert question['questionImage'] == original['detailImage']
        assert hashlib.sha256((ROOT / 'dist' / original['detailImage']).read_bytes()).hexdigest() == original['detailImageSha256']
        assert question['questionImageSha256'] == original['detailImageSha256']
        assert question['learningKeywordIds'] and set(question['learningKeywordIds']) <= learning_ids
        assert question['proposed']['playExplanation'] == detail['explanation']
        required_scenes = [by_id[scene_id] for scene_id in question['proposed']['requiresReadSceneIds']]
        learned_ids = {keyword_id for scene in required_scenes for line in [*scene['main'], *scene['join']]
                       for keyword_id in line['learningKeywordIds']}
        assert all(keyword_id in learned_ids for keyword_id in question['learningKeywordIds'])

    compatibility = data['saveCompatibility']
    assert compatibility['previousContentVersion'] == 'proto-revision-83-v1'
    assert set(compatibility['legacyCompletionMilestones']) == {
        'proto_ch02_s5', 'proto_ch03_s13', 'proto_ch04_s5', 'proto_ch05_s7', 'proto_ch06_s7'
    }
    return {'contentVersion': data['contentVersion'], 'chapters': 5, 'scenes': 5,
            'utterances': len(all_lines), 'learning': len(learning_ids), 'questions': 15,
            'queues': 5, 'questionsPerQueue': 3, 'verifiedQuestionImages': 15,
            'verifiedChoiceExplanationSets': 15}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    raw = SOURCE.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == EXPECTED_SHA, 'Approved source identity changed'
    data = json.loads(raw)
    report = verify(data)
    legacy_raw = LEGACY_QUESTIONS.read_bytes()
    assert hashlib.sha256(legacy_raw).hexdigest() == LEGACY_SHA, 'Legacy question snapshot changed'
    legacy = json.loads(legacy_raw)
    assert legacy['sourceCommit'] == '585688d8f8032983cdc1acfe186838ef733849d7'
    assert len(legacy['questions']) == 23
    wrapper = '''/* Generated by scripts/import-proto-revision.py. Complete canonical input; do not edit. */
const PROTO_REVISION_SOURCE_SHA256 = "''' + EXPECTED_SHA + '''";
const PROTO_REVISION_SOURCE = ''' + raw.decode('utf-8').rstrip() + ''';
const PROTO_STORY_SCRIPT = PROTO_REVISION_SOURCE.chapters.map(chapter => ({
  number:chapter.chapterNumber, title:chapter.chapterTitle, arc:chapter.arc,
  scenes:chapter.scenes.map(source => ({...source, background:source.background||source.location,
    type:source.choices.length?'CHOICE':'STORY', dialogues:source.main,
    choices:source.choices.map(choice => ({...choice,dialogues:choice.reply})),
    checkpoint:source.quizAfter?{topic:source.learning.map(item=>item.id).join(" · ")}:null
  }))
}));
const PROTO_EXAM_ASSIGNMENTS = PROTO_REVISION_SOURCE.examPlan.queues.map(queue => {
  const match=queue.sceneId.match(/^proto_ch(\\d+)_s(\\d+)$/);
  return [Number(match[1]),Number(match[2]),queue.officialQuestionIds.map(id=>id.replace(/^official-/,""))];
});
const PROTO_LEGACY_STUDY_QUESTIONS = ''' + json.dumps(legacy['questions'], ensure_ascii=False, indent=2) + ';\n'
    outputs = {ROOT / 'dist/proto-story-script.json': raw,
               ROOT / 'dist/proto-story-script.js': wrapper.encode('utf-8')}
    for path, content in outputs.items():
        if args.check:
            actual = path.read_bytes().replace(b'\r\n', b'\n')
            expected = content.replace(b'\r\n', b'\n')
            assert actual == expected, 'Generated file differs: ' + str(path.relative_to(ROOT))
        else:
            path.write_bytes(content)
    print(json.dumps({'mode': 'check' if args.check else 'write', 'canonicalSha256': EXPECTED_SHA, **report}, ensure_ascii=False))


if __name__ == '__main__':
    main()

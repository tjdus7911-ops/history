#!/usr/bin/env python3
"""Import the approved, complete Three Kingdoms manuscript without rewriting it.

Only the Python standard library is used.  The checked-in Markdown is the source
of truth; no draft JSON, network resource or previous generated script is read.
Run normally to regenerate JSON/JS and the audit, or with --check to verify them.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_REL = "docs/three-content/complete-manuscript.md"
EXPECTED_SCENES = [8, 8, 10, 10, 12, 9, 9, 11, 10, 8, 10, 10, 12, 8, 8, 10, 9, 8, 9, 8, 10, 8, 10]
CONTENT_VERSION = "three-complete-23-v1"
SPEECH_RE = re.compile(r"^\*\*([^*\n]+)\*\*  \n([^\n]+)(?=\n|$)", re.M)
CHOICE_LABEL_RE = re.compile(r"^\*\*서아의 선택 대사 — “(.*)”\*\*$", re.M)
SCENE_ID_RE = re.compile(r"THR-C\d{2}-S\d{2}")

# These are presentation annotations, not rewritten dialogue. Each rule is tied
# to an explicit, checked staging phrase in the approved source. Museum/record
# guides may speak in a record context without being time-travelling historical
# NPCs; callers must honor presentationContext as well as the literal speaker.
RECORD_SCENES = {
    "THR-C03-S10": ("시대별 구조를 관찰하는 재현 공간", "기록책 · 고구려 유물 비교"),
    "THR-C04-S08": ("후대 비문 관찰 공간", "기록책 · 충주 고구려비 자료"),
    "THR-C04-S09": ("기록책 열람", "기록책 · 남겨진 편지와 기록"),
    "THR-C06-S09": ("책 밖 자료 공간", "기록책 · 384년에서 475년으로"),
    "THR-C07-S09": ("자료 공간의 기록관", "기록책 · 왕위 계승과 지방 통치"),
    "THR-C08-S03": ("후대 유물 자료 공간", "기록책 · 무령왕릉의 발굴 자료"),
    "THR-C08-S11": ("자료 공간", "기록책 · 554년에서 639년으로"),
    "THR-C09-S03": ("비시대적 비교 공간", "기록책 · 한성·웅진·사비 비교"),
    "THR-C12-S06": ("기록책 비교 공간", "기록책 · 연대가 다른 비석 비교"),
    "THR-C12-S10": ("비시대적 사료 해설", "기록책 · 다음 왕과 다른 자료"),
    "THR-C15-S06": ("별도 자료로 비교하는 기록책 공간", "기록책 · 532년과 562년"),
    "THR-C15-S08": ("허구 기록 낭독", "기록책 · 여울이 남긴 말"),
    "THR-C17-S08": ("재구성한 주조 장인의 허구 증언", "기록책 · 성덕대왕신종의 기록"),
    "THR-C18-S06": ("사료 비교 공간", "기록책 · 서로 다른 사망 기록"),
    "THR-C21-S08": ("묘지 자료를 비교하는 기록 공간", "기록책 · 정혜·정효공주묘 비교"),
    "THR-C22-S03": ("현대 기록 공간", "기록책 · 926년과 946년의 구별"),
    "THR-C22-S08": ("기록책을 열어", "기록책 · 934년에서 900년으로"),
    "THR-C23-S04": ("국호 변경 기록을 비교하는 자료 공간", "기록책 · 국호와 연호"),
    "THR-C23-S08": ("미래 자료를 재정렬", "기록책 · 이미 본 기록의 실제 순서"),
}
RECORD_RANGES = {
    "THR-C03-S09": [("join", 1, 2, "마지막 join", "후대 유물 비교 · 414년과 415년")],
    "THR-C03-S10": [("join", 1, 2, "후대 유물 기록: 6세기", "후대 유물 기록 · 6세기")],
    "THR-C06-S02": [("join", 2, 2, "마지막 기록관", "후대 해설 · 제도 정비의 시점")],
    "THR-C06-S03": [("main", 9, 10, "본선 마지막 두 턴", "현대 지도 비교 · 진출과 지배")],
    "THR-C08-S05": [("main", 5, 7, "사비시대 제도 자료", "사비시대 제도 자료 · 장기 정비")],
    "THR-C11-S02": [("main", 8, 10, "8번째 발화 직전", "기록 추가:509년 동시전")],
    "THR-C11-S09": [("main", 7, 8, "7~8턴만", "기록책 · 여러 세대 뒤의 계보")],
    "THR-C12-S06": [("main", 7, 8, "572년 연호는 후속 기록 낭독", "후속 기록 · 572년 홍제")],
    "THR-C16-S09": [("main", 7, 10, "7~10턴은", "촌락문서 비교 · 작성연대 이견")],
    "THR-C16-S10": [("main", 7, 10, "7~10턴은", "기록책 · 촌락문서의 토지와 호등")],
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(value):
    encoded = json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def between(text, start, end):
    begin = text.index(start)
    finish = text.index(end, begin + len(start))
    return text[begin:finish]


def field(text, name, required=True):
    match = re.search(r"^\*\*" + re.escape(name) + r":\*\* ([^\n]+)", text, re.M)
    require(match or not required, f"Missing field: {name}")
    return match[1].rstrip() if match else ""


def csv_field(text, name):
    return [part.strip() for part in field(text, name, False).split(",") if part.strip()]


def rows(text, width):
    """Read pipe tables; preserve cell text, including Markdown source links."""
    result = []
    for line in text.splitlines():
        if not line.startswith("|"):
            continue
        values = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(values) == width and not all(re.fullmatch(r":?-+:?", v) for v in values):
            result.append(values)
    return result


def source_url(markdown):
    match = re.search(r"\[[^\]]+\]\((https?://.*)\)$", markdown)
    return match[1] if match else markdown


def line_kind(speaker):
    if speaker == "나레이션":
        return "narration"
    if speaker.startswith(("기록책", "현대 주석", "후대 기록")) or speaker.endswith(("의 기록", "의 기억")):
        return "record"
    return "dialogue"


def make_line(line_id, speaker, text, source_line=None, **extra):
    entry = {"lineId": line_id, "speaker": speaker, "text": text,
             "kind": line_kind(speaker), "advance": "tap"}
    if source_line is not None:
        entry["sourceLine"] = source_line
    entry.update(extra)
    return entry


def speeches(section, prefix, full_text, source_offset):
    found = list(SPEECH_RE.finditer(section))
    # Do not silently skip changed speaker markup or multiple text paragraphs.
    residual = SPEECH_RE.sub("", section).strip()
    require(not residual, f"Unrecognized dialogue markup in {prefix}: {residual[:180]!r}")
    require(found, f"No dialogue in {prefix}")
    return [make_line(f"{prefix}{index:02}", match[1], match[2],
                      full_text.count("\n", 0, source_offset + match.start()) + 1)
            for index, match in enumerate(found, 1)]


def parse_appendices(text):
    a = between(text, "# 부록 A", "# 부록 B")
    coverage = [{"coverageId": r[0], "photoNumber": int(r[1]), "topic": r[2],
                 "sceneIds": SCENE_ID_RE.findall(r[3]), "note": r[4]}
                for r in rows(a, 5) if re.fullmatch(r"P[123][A-Z]\d{2}", r[0])]
    photos = [{"photoNumber": int(r[0]), "originalFilename": r[1], "scope": r[2]}
              for r in rows(a, 3) if r[0] in {"1", "2", "3"}]
    b = between(text, "# 부록 B", "# 부록 C")
    headings = list(re.finditer(r"^## ([BD]\d{3}) · (.+)$", b, re.M))
    mnemonics = []
    for index, heading in enumerate(headings):
        body = b[heading.end():headings[index + 1].start() if index + 1 < len(headings) else len(b)]
        quoted = re.findall(r"^> (.*)$", body, re.M)
        require(quoted, f"Mnemonic original missing: {heading[1]}")
        links = field(body, "실제 연결")
        note = body[body.index("**실제 연결:") + len("**실제 연결:"):].split("\n", 1)[1].strip()
        mnemonics.append({"mnemonicId": heading[1], "title": heading[2],
                          "originalText": "\n".join(quoted), "sceneIds": SCENE_ID_RE.findall(links),
                          "explanation": note, "sourceKind": "supplemental-original-mnemonic"})
    c = between(text, "# 부록 C", "# 부록 D")
    corrections = [{"topic": r[0], "treatment": r[1], "sourceUrl": source_url(r[2])}
                   for r in rows(c, 3) if r[0] != "주제"]
    d = between(text, "# 부록 D", "# 원고 완성 확인")
    history = [{"eventId": r[0], "topic": r[1], "sceneIds": SCENE_ID_RE.findall(r[2]),
                "sourceUrl": source_url(r[3])}
               for r in rows(d, 4) if re.fullmatch(r"H-[A-Z]\d+", r[0])]
    return photos, coverage, mnemonics, corrections, history


def parse_main_scene(body, match, chapter, text, absolute_offset):
    scene_id, title = match[1], match[2]
    headings = list(re.finditer(r"^#### (.+)$", body, re.M))
    require(headings and headings[0][1] == "본선 대사", f"Missing main in {scene_id}")
    section_map = {}
    for index, heading in enumerate(headings):
        end = headings[index + 1].start() if index + 1 < len(headings) else len(body)
        section_map[heading[1]] = (body[heading.end():end], heading.end())
    main_text, main_offset = section_map["본선 대사"]
    main = speeches(main_text, f"{scene_id}-M", text, absolute_offset + main_offset)
    choices = []
    for heading in headings:
        choice_match = re.fullmatch(r"선택 ([AB]) · (THR-C\d{2}-S\d{2}-B[12])", heading[1])
        if not choice_match:
            continue
        section, section_offset = section_map[heading[1]]
        label_match = CHOICE_LABEL_RE.search(section)
        require(label_match, f"Missing spoken choice: {scene_id}")
        require(choice_match[2] == f"{scene_id}-B{len(choices) + 1}", f"Wrong choice ID: {scene_id}")
        effect_match = re.search(r"^\*관계·행동 변화: (.*)\*$", section, re.M)
        require(effect_match, f"Missing consequence metadata: {scene_id}")
        reply_start = section.index("**선택 직후**") + len("**선택 직후**")
        reply_text = section[reply_start:effect_match.start()]
        choice_id = choice_match[2]
        label = label_match[1]
        label_line = text.count("\n", 0, absolute_offset + section_offset + label_match.start()) + 1
        choices.append({"choiceId": choice_id, "key": choice_match[1], "label": label,
                        "lineId": f"{choice_id}-LABEL",
                        "spokenLine": make_line(f"{choice_id}-LABEL", "서아", label, label_line),
                        "reply": speeches(reply_text, f"{choice_id}-R", text,
                                          absolute_offset + section_offset + reply_start),
                        "effect": effect_match[1], "nextPhase": "join"})
    require(len(choices) in (0, 2), f"Expected zero or two choices: {scene_id}")
    join_heading = "공통 연결" if "공통 연결" in section_map else "장면 끝"
    require(join_heading in section_map, f"Missing common join: {scene_id}")
    join_text, join_offset = section_map[join_heading]
    # The source maps are comments adjacent to, but not part of, the common dialogue.
    join_text = join_text.split("<!-- EXAM-MAP START", 1)[0]
    join = speeches(join_text, f"{scene_id}-J", text, absolute_offset + join_offset)
    accepted = {"본선 대사", "공통 연결", "장면 끝", "기출 연결 · 제작용"}
    require(all(h[1] in accepted or h[1].startswith("선택 ") for h in headings),
            f"Unknown scene section: {scene_id}")
    return {"number": int(scene_id[-2:]), "sceneId": scene_id, "chapterId": chapter["chapterId"],
            "sceneTitle": title, "year": field(body, "시점"), "location": field(body, "장소"),
            "country": chapter["country"], "cast": csv_field(body, "등장"),
            "staging": field(body, "연출"), "sourceLine": text.count("\n", 0, absolute_offset) + 1,
            "sourceEventIds": csv_field(body, "사실 연결"),
            "mnemonicRefs": csv_field(body, "보충 암기 연결"),
            "sourceCoverageRefs": csv_field(body, "원본 족보 대조"),
            "learningTopic": field(body, "학습 내용"),
            "main": main, "choices": choices, "join": join, "joinHeading": join_heading,
            "nextSceneId": field(body, "다음"),
            "examAnchorLineId": join[-1]["lineId"],
            "progression": "tap_only", "isPrologue": False}


def parse_chapters(text):
    start = text.index("# 전체 대본\n")
    finish = text.index("# 부록 A", start)
    main_source = text[start:finish]
    headings = list(re.finditer(r"^## CH(\d{2}) · (.+)$", main_source, re.M))
    chapters = []
    for index, heading in enumerate(headings):
        number = int(heading[1])
        chapter_end = headings[index + 1].start() if index + 1 < len(headings) else len(main_source)
        body = main_source[heading.end():chapter_end]
        first_scene = re.search(r"^### THR-C\d{2}-S\d{2} · .+$", body, re.M)
        require(first_scene, f"No scenes in chapter {number}")
        header = body[:first_scene.start()]
        meta = re.search(r"^\*\*(.+) · (\d+)씬\*\*$", header, re.M)
        require(meta, f"Chapter metadata missing: {number}")
        memo_start = body.index("### 제작·고증 메모")
        scene_body = body[:memo_start]
        chapter = {"number": number, "chapterId": f"THR-C{number:02}", "title": heading[2],
                   "country": meta[1], "storyArc": header[meta.end():].strip(),
                   "sourceLine": text.count("\n", 0, start + heading.start()) + 1,
                   "sourceNotes": [line[2:] for line in body[memo_start:].splitlines() if line.startswith("- ")],
                   "scenes": []}
        scene_headings = list(re.finditer(r"^### (THR-C\d{2}-S\d{2}) · (.+)$", scene_body, re.M))
        for scene_index, scene_heading in enumerate(scene_headings):
            end = scene_headings[scene_index + 1].start() if scene_index + 1 < len(scene_headings) else len(scene_body)
            scene = parse_main_scene(scene_body[scene_heading.start():end], scene_heading,
                                     chapter, text, start + heading.end() + scene_heading.start())
            chapter["scenes"].append(scene)
        require(int(meta[2]) == len(chapter["scenes"]), f"Declared scene count differs: {number}")
        chapters.append(chapter)
    return chapters, main_source


def parse_prologue(text):
    source = between(text, "# 프롤로그 ·", "# 전체 대본\n")
    headings = list(re.finditer(r"^## (THR-PRO-S\d{2}) · (.+)$", source, re.M))
    scenes = []
    for index, heading in enumerate(headings):
        ending = re.search(r"^## ", source[heading.end():], re.M)
        end = heading.end() + ending.start() if ending else len(source)
        body = source[heading.end():end]
        scene_id = heading[1]
        moment, place = field(body, "시간·장소").split(" / ", 1)
        dialogue_rows = [row for row in rows(body, 5) if row[0].isdigit()]
        absolute_start = text.index(source) + heading.end()
        lines = []
        for row in dialogue_rows:
            number = int(row[0])
            speaker, position = row[1].split(" · ", 1)
            lines.append(make_line(f"{scene_id}-L{number:02}", speaker, row[3],
                                   text.count("\n", 0, absolute_start + body.index("| " + " | ".join(row) + " |")) + 1,
                                   expression=row[2], speakerPosition="right" if position == "오른쪽" else "left",
                                   visualCue=row[4]))
        next_scene = re.search(r"\*\*다음 장면:\*\* `(.*?)`", body)
        require(next_scene, f"Missing prologue next ID: {scene_id}")
        transition = {"trigger": "tap_after_last_line", "type": "cut", "durationMs": 0,
                      "advanceAdditionalDialogue": False}
        if "**암전:**" in body:
            milliseconds = re.search(r"(\d+)ms", field(body, "암전"))
            require(milliseconds, "Missing explicit prologue black transition duration")
            transition.update({"type": "brief_black_cut", "durationMs": int(milliseconds[1]),
                               "standaloneBlackScreen": False, "blackHasDialogue": False})
        if next_scene[1] == "THR-C01-S01":
            transition.update({"type": "continuous_scene_handoff", "reuseBackground": True,
                               "preserveCharacterPositions": True})
        scenes.append({"number": index + 1, "sceneId": scene_id, "chapterId": "THR-PROLOGUE",
                       "sceneTitle": heading[2], "year": moment, "location": place, "country": "",
                       "sourceLine": text.count("\n", 0, text.index(source) + heading.start()) + 1,
                       "cast": ["서아", "연우"] if index == 2 else ["서아"],
                       "backgroundBrief": field(body, "2D 배경"), "portraitLayout": field(body, "화면 배치"),
                       "staging": field(body, "연출"), "main": lines, "choices": [], "join": [],
                       "sourceEventIds": [], "mnemonicRefs": [], "coverageRefs": [],
                       "nextSceneId": next_scene[1], "exitTransition": transition,
                       "progression": "tap_only", "isPrologue": True,
                       "showDateAndLocation": index < 2, "examQuestions": []})
    return {"prologueId": "THR-PROLOGUE", "title": "빈 장의 바람", "entrySceneId": "THR-PRO-S01",
            "exitSceneId": "THR-C01-S01", "choicesEnabled": False, "autoAdvance": False,
            "timedBlackScreenOnlyMs": 120, "scenes": scenes}


def author_lines(scene):
    """Original writing order; alternate paths are both audited, never both played."""
    yield from scene["main"]
    for choice in scene["choices"]:
        yield choice["spokenLine"]
        yield from choice["reply"]
    yield from scene["join"]


def annotate_presentation(scenes):
    """Add explicit record entry/return cues without adding an authored utterance."""
    for scene in scenes:
        scene_id = scene["sceneId"]
        rule = RECORD_SCENES.get(scene_id)
        default_context = "record" if rule else "scene"
        default_label = rule[1] if rule else ""
        if rule:
            require(rule[0] in scene["staging"], f"Record staging changed: {scene_id}")
        scene["presentationContext"] = default_context
        scene["presentationLabel"] = default_label
        scene["presentationSource"] = "approved-manuscript-staging-and-record-speakers"
        forced = {}
        for phase, start, end, evidence, label in RECORD_RANGES.get(scene_id, []):
            require(evidence in scene["staging"], f"Record range staging changed: {scene_id}")
            require(0 < start <= end <= len(scene[phase]), f"Record range outside scene: {scene_id}")
            for index in range(start - 1, end):
                forced[scene[phase][index]["lineId"]] = label
        phases = [scene["main"]]
        for choice in scene["choices"]:
            phases.append([choice["spokenLine"], *choice["reply"]])
        phases.append(scene["join"])
        previous_context = "scene"
        previous_label = ""
        for phase_index, lines in enumerate(phases):
            # Each branch starts from the source scene context. In the approved
            # manuscript no choice is opened inside a partial record sequence.
            if 0 < phase_index < len(phases) - 1:
                previous_context = default_context
                previous_label = default_label
            record_open = False
            for line in lines:
                context = default_context
                label = default_label
                explicit = forced.get(line["lineId"])
                if explicit:
                    context, label = "record", explicit
                elif line["kind"] == "record":
                    context, label = "record", line["speaker"].replace("·", " · ")
                    record_open = True
                elif record_open and line["speaker"] == "서아":
                    context, label = "record", previous_label
                elif line["speaker"] != "서아":
                    record_open = False
                line["presentationContext"] = context
                if label:
                    line["presentationLabel"] = label
                if context != previous_context or (context == "record" and label != previous_label):
                    return_label = ("722년 · 성덕왕대 농촌" if scene_id == "THR-C16-S09"
                                    else f"{scene['year']} · {scene['location']}")
                    line["presentationCue"] = {
                        "type": "enter_record" if context == "record" else "return_to_scene",
                        "label": label if context == "record" else return_label,
                        "source": "staging-or-explicit-record-speaker",
                    }
                previous_context, previous_label = context, label


def build(source_path):
    raw = source_path.read_bytes()
    text = raw.decode("utf-8-sig").replace("\r\n", "\n")
    chapters, main_source = parse_chapters(text)
    prologue = parse_prologue(text)
    photos, coverage, mnemonics, corrections, history = parse_appendices(text)
    main_scenes = [scene for chapter in chapters for scene in chapter["scenes"]]
    annotate_presentation(prologue["scenes"] + main_scenes)
    scene_by_id = {scene["sceneId"]: scene for scene in main_scenes}
    for scene in main_scenes:
        scene["coverageRefs"] = [entry["coverageId"] for entry in coverage if scene["sceneId"] in entry["sceneIds"]]
    original_lines = []
    # An independent scan of all author-marked paragraphs detects omitted sections,
    # reordered lines, truncation and accidentally playable production metadata.
    tokens = [(match.start(), (match[1], match[2])) for match in SPEECH_RE.finditer(main_source)]
    tokens += [(match.start(), ("서아", match[1])) for match in CHOICE_LABEL_RE.finditer(main_source)]
    original_lines = [entry for _, entry in sorted(tokens)]
    imported_lines = [(line["speaker"], line["text"]) for scene in main_scenes for line in author_lines(scene)]
    require(imported_lines == original_lines, "Imported dialogue differs from author-marked original")
    counts = {"chapterCount": len(chapters), "mainSceneCount": len(main_scenes),
              "prologueSceneCount": len(prologue["scenes"]),
              "choiceSceneCount": sum(bool(scene["choices"]) for scene in main_scenes),
              "choiceCount": sum(len(scene["choices"]) for scene in main_scenes),
              "mainDialogueCount": sum(len(scene["main"]) for scene in main_scenes),
              "replyDialogueCount": sum(len(choice["reply"]) for scene in main_scenes for choice in scene["choices"]),
              "joinDialogueCount": sum(len(scene["join"]) for scene in main_scenes),
              "mainAuthoredUtteranceCount": len(imported_lines),
              "prologueUtteranceCount": sum(len(scene["main"]) for scene in prologue["scenes"]),
              "coverageCount": len(coverage), "mnemonicCount": len(mnemonics), "historyEventCount": len(history)}
    expected = {"chapterCount": 23, "mainSceneCount": 215, "prologueSceneCount": 3,
                "choiceSceneCount": 71, "choiceCount": 142, "mainDialogueCount": 1774,
                "replyDialogueCount": 426, "joinDialogueCount": 421, "mainAuthoredUtteranceCount": 2763,
                "prologueUtteranceCount": 14, "coverageCount": 89, "mnemonicCount": 23, "historyEventCount": 77}
    require(counts == expected, f"Approved manuscript counts differ: {counts}")
    require([len(chapter["scenes"]) for chapter in chapters] == EXPECTED_SCENES, "Chapter scene counts differ")
    require([chapter["number"] for chapter in chapters] == list(range(1, 24)), "Chapters reordered")
    require(len(scene_by_id) == len(main_scenes), "Duplicate scene IDs")
    for chapter in chapters:
        require([scene["sceneId"] for scene in chapter["scenes"]] ==
                [f"THR-C{chapter['number']:02}-S{n:02}" for n in range(1, len(chapter["scenes"]) + 1)],
                f"Unexpected scene IDs in chapter {chapter['number']}")
    playable = prologue["scenes"] + main_scenes
    for current, following in zip(playable, playable[1:]):
        require(current["nextSceneId"] == following["sceneId"], f"Broken transition from {current['sceneId']}")
    require(playable[-1]["nextSceneId"] == "SEASON-END-PLANNED", "Missing authored season end")
    require([scene["exitTransition"]["durationMs"] for scene in prologue["scenes"]] == [0, 120, 0],
            "Unexpected prologue transition timing")
    require(main_scenes[0]["main"][0]["text"] == "잠깐만요. 어머니가 쓰러지셨어요. 그늘 쪽으로 옮길게요.",
            "Prologue continuity anchor changed")
    all_lines = [line for scene in playable for line in author_lines(scene)]
    require(len({line["lineId"] for line in all_lines}) == len(all_lines), "Duplicate authored line IDs")
    for group in (coverage, mnemonics, history):
        for entry in group:
            require(entry["sceneIds"] and all(sid in scene_by_id for sid in entry["sceneIds"]),
                    f"Unresolved appendix scene references: {entry}")
    mnemonic_by_id = {entry["mnemonicId"]: entry for entry in mnemonics}
    history_by_id = {entry["eventId"]: entry for entry in history}
    coverage_by_id = {entry["coverageId"]: entry for entry in coverage}
    for scene in main_scenes:
        require(set(scene["mnemonicRefs"]) == {m["mnemonicId"] for m in mnemonics if scene["sceneId"] in m["sceneIds"]},
                f"Mnemonic mapping disagrees with appendix: {scene['sceneId']}")
        require(set(scene["sourceEventIds"]) == {e["eventId"] for e in history if scene["sceneId"] in e["sceneIds"]},
                f"History mapping disagrees with appendix: {scene['sceneId']}")
        require(all(ref in mnemonic_by_id for ref in scene["mnemonicRefs"]), "Missing mnemonic")
        require(all(ref in history_by_id for ref in scene["sourceEventIds"]), "Missing history event")
        require(all(ref in coverage_by_id for ref in scene["sourceCoverageRefs"]), "Missing coverage entry")
        require(set(scene["sourceCoverageRefs"]) == set(scene["coverageRefs"]),
                f"Coverage mapping disagrees with appendix: {scene['sceneId']}")
    counts["playableSceneCount"] = len(playable)
    counts["authoredUtteranceCount"] = len(all_lines)
    source_meta = {"path": SOURCE_REL, "filename": "눈떠보니삼국_전체대본_23챕터.md",
                   "sha256": hashlib.sha256(raw).hexdigest(), "byteLength": len(raw)}
    output = {"schemaVersion": 3, "contentVersion": CONTENT_VERSION,
              "status": "complete-authored-manuscript", "source": source_meta,
              "chapterCount": 23, "sceneCount": 215, **counts,
              "entrySceneId": "THR-PRO-S01", "firstMainSceneId": "THR-C01-S01",
              "terminalSceneId": "SEASON-END-PLANNED",
              "fictionNotice": "서아와 현장 인물의 대화·개인적 사건은 역사 학습을 위한 창작입니다. 역사적 결과는 선택으로 바뀌지 않습니다.",
              "interaction": {"progression": "tap_only", "autoAdvance": False,
                              "tapDuringTextReveal": "complete_current_line",
                              "tapWhenLineComplete": "advance_one_line",
                              "choiceScoring": False, "choiceSpokenLineCount": 1},
              "prologue": prologue, "chapters": chapters, "sourcePhotos": photos,
              "coverage": coverage, "mnemonics": mnemonics, "historicalCorrections": corrections,
              "historicalEvents": history}
    kinds = Counter(line["kind"] for line in all_lines)
    audit = {"status": "passed", "source": source_meta, "contentVersion": CONTENT_VERSION,
             "counts": counts, "authoredLineKinds": dict(sorted(kinds.items())),
             "originalAuthoredDialogueSha256": digest(original_lines),
             "importedAuthoredDialogueSha256": digest(imported_lines),
             "allAuthoredDialogueSha256": digest([(l["speaker"], l["text"]) for l in all_lines]),
             "mnemonicOriginalsSha256": digest([(m["mnemonicId"], m["originalText"]) for m in mnemonics]),
             "checkedChoicePaths": 142, "brokenTransitions": [], "duplicateLineIds": [],
             "recordContextSceneCount": sum(scene["presentationContext"] == "record" for scene in main_scenes),
             "recordContextLineCount": sum(line["presentationContext"] == "record" for line in all_lines),
             "recordReturnCueCount": sum(line.get("presentationCue", {}).get("type") == "return_to_scene" for line in all_lines),
             "omittedAuthoredLines": [], "changedAuthoredLines": [],
             "chapterSceneCounts": EXPECTED_SCENES,
             "checks": ["original author-marked text equals imported text in writing order",
                        "exact approved counts", "unique stable line and scene IDs",
                        "all A/B branches retain spoken label, matching reply and common join",
                        "prologue and all chapter transitions follow original next IDs",
                        "all 89 coverage, 23 mnemonic and 77 event groups reference existing scenes",
                        "scene mnemonic and history references equal the complete appendices",
                        "prologue has no choices or questions and only a 120ms second-scene black cut"]}
    return output, audit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT / SOURCE_REL)
    parser.add_argument("--output-root", type=Path, default=ROOT)
    parser.add_argument("--check", action="store_true", help="Compare generated files without writing")
    args = parser.parse_args()
    output, audit = build(args.source)
    encoded = json.dumps(output, ensure_ascii=False, indent=2) + "\n"
    files = {"dist/three-story-script.json": encoded,
             "dist/three-story-script.js": "globalThis.THREE_STORY_SCRIPT=" + encoded.rstrip() + ";\n",
             "docs/three-content/manuscript-import-audit.json": json.dumps(audit, ensure_ascii=False, indent=2) + "\n"}
    for relative, content in files.items():
        destination = args.output_root / relative
        if args.check:
            require(destination.exists() and destination.read_text(encoding="utf-8") == content,
                    f"Generated file is stale: {relative}; run {Path(__file__).name}")
        else:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(content, encoding="utf-8")
    print(json.dumps({"status": "checked" if args.check else "generated", **audit["counts"],
                      "sourceSha256": output["source"]["sha256"],
                      "authoredDialogueSha256": audit["allAuthoredDialogueSha256"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()

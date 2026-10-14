#!/usr/bin/env python3
"""Import the approved Three Kingdoms XLSX without a spreadsheet dependency.

The workbook owns selection, answers, explanations and all 302 connections.
The manuscript supplies exact insertion anchors and the additional-link reasons
which are deliberately shortened in the workbook. Source evidence only supplies
review provenance and already-transcribed original options; it cannot change a
workbook answer or select a question. No network or generated image is used.
"""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import struct
import sys
import xml.etree.ElementTree as ET
import zipfile


ROOT = Path(__file__).resolve().parents[1]
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
EXPECTED = {
    "mainScenes": 215,
    "verifiedQuestionPool": 122,
    "usedDistinctQuestions": 91,
    "unusedReviewedQuestions": 31,
    "connections": 302,
    "representativeConnections": 215,
    "additionalConnections": 87,
    "representativeScheduleRows": 99,
    "firstQuestions": 77,
    "reviewCandidates": 22,
    "additionalScheduleCandidates": 26,
    "firstQuestionCheckpoints": 62,
    "allRepresentativeCheckpoints": 80,
    "maxFirstQuestionsAtCheckpoint": 3,
}
SYMBOLS = "①②③④⑤"
LEVELS = {"기본": "basic", "심화": "advanced"}
LINK_TYPES = {"직접", "선지학습", "관련복습", "서사연결"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def text_sha256(path):
    """Hash repository text canonically across Git LF/CRLF checkouts."""
    return hashlib.sha256(path.read_bytes().replace(b"\r\n", b"\n")).hexdigest()


def optional(value):
    return "" if value in ("", "—", None) else str(value)


def scene_id(value):
    match = re.search(r"(?:THR-)?C(?:H)?(\d{2})-?S(\d{2})", str(value))
    require(match, f"Invalid scene ID: {value!r}")
    return f"THR-C{match[1]}-S{match[2]}"


def question_id(round_number, level, number):
    require(level in LEVELS, f"Unknown exam level: {level}")
    return f"official-{int(round_number)}-{LEVELS[level]}-{int(number):02d}"


def question_label(label):
    match = re.fullmatch(r"(\d+)회 (심화|기본) (\d+)번", label)
    require(match, f"Invalid question label: {label!r}")
    return question_id(match[1], match[2], match[3])


def cell_column(reference):
    match = re.fullmatch(r"([A-Z]+)(\d+)", reference)
    require(match, f"Invalid cell reference: {reference}")
    return match[1]


def read_workbook(path):
    """Read values from OOXML, retaining explicit worksheet names/headers."""
    with zipfile.ZipFile(path) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            for item in ET.fromstring(archive.read("xl/sharedStrings.xml")):
                strings.append("".join(t.text or "" for t in item.iter(f"{{{NS['m']}}}t")))
        relationships = {
            element.attrib["Id"]: element.attrib["Target"]
            for element in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        }
        sheets = {}
        for sheet in ET.fromstring(archive.read("xl/workbook.xml")).findall("m:sheets/m:sheet", NS):
            target = relationships[sheet.attrib[f"{{{REL_NS}}}id"]]
            member = str(PurePosixPath("xl", target)) if not target.startswith("/") else target.lstrip("/")
            rows = {}
            for row in ET.fromstring(archive.read(member)).findall("m:sheetData/m:row", NS):
                values = {}
                for cell in row.findall("m:c", NS):
                    require(int(row.attrib["r"]) < 6 or cell.find("m:f", NS) is None, f"Formula in authoritative input: {sheet.attrib['name']}!{cell.attrib['r']}")
                    kind = cell.get("t")
                    require(kind != "e", f"Spreadsheet error: {sheet.attrib['name']}!{cell.attrib['r']}")
                    value = cell.find("m:v", NS)
                    text = value.text or "" if value is not None else ""
                    if kind == "s":
                        text = strings[int(text)]
                    elif kind == "inlineStr":
                        text = "".join(t.text or "" for t in cell.findall("m:is//m:t", NS))
                    column = cell_column(cell.attrib["r"])
                    require(column not in values, f"Duplicate cell: {cell.attrib['r']}")
                    values[column] = text
                rows[int(row.attrib["r"])] = values
            sheets[sheet.attrib["name"]] = rows
    require(set(sheets) == {"씬별연결", "실제출제순서", "문항원장"}, "Workbook worksheet names differ from the approved three-sheet layout")
    return sheets


def table_rows(sheets, name, headers):
    rows = sheets[name]
    require(rows.get(6) == headers, f"{name}: header layout changed; review the importer instead of silently dropping columns")
    result = []
    for number, row in sorted(rows.items()):
        if number > 6 and any(optional(v) for v in row.values()):
            result.append((number, row))
    return result


def read_manuscript(path):
    text = path.read_text(encoding="utf-8")
    blocks = {}
    pattern = r"<!-- EXAM-MAP START (THR-C\d{2}-S\d{2}) -->(.*?)<!-- EXAM-MAP END \1 -->"
    for match in re.finditer(pattern, text, re.S):
        sid, block = match.groups()
        require(sid not in blocks, f"Duplicate manuscript exam block: {sid}")
        anchor = re.search(r"\*\*이번 씬의 삽입 기준:\*\* 공통 연결의 마지막 발화, (.+?)의 “(.+?)”를 모두 표시한 뒤\.", block, re.S)
        require(anchor, f"Missing exact manuscript anchor: {sid}")
        reasons = {}
        for reason in re.finditer(r"^- \*\*(\d+회 (?:심화|기본) \d+번):\*\* (.+)$", block, re.M):
            reasons[question_label(reason[1])] = reason[2]
        rows = []
        for line in block.splitlines():
            if line.startswith("| 대표 |") or line.startswith("| 추가복습 |"):
                cells = [part.strip() for part in line.strip("|").split("|")]
                label, symbol = cells[1].rsplit(" · ", 1)
                link_type, component = cells[2].split(" / ", 1)
                rows.append({
                    "officialQuestionId": question_label(label),
                    "priority": "representative" if cells[0] == "대표" else "additional",
                    "answerNumber": SYMBOLS.index(symbol) + 1,
                    "linkType": link_type,
                    "component": component,
                    "quizAfterSceneId": scene_id(cells[3]),
                })
        blocks[sid] = {"anchorSpeaker": anchor[1], "anchorText": anchor[2], "reasons": reasons, "rows": rows}
    require(len(blocks) == 215, f"Expected 215 manuscript exam blocks, found {len(blocks)}")
    return blocks


def webp_size(path):
    data = path.read_bytes()
    require(data[:4] == b"RIFF" and data[8:12] == b"WEBP", f"Not a WebP original image: {path}")
    offset = 12
    while offset + 8 <= len(data):
        kind = data[offset:offset + 4]
        length = struct.unpack_from("<I", data, offset + 4)[0]
        content = data[offset + 8:offset + 8 + length]
        if kind == b"VP8X":
            return 1 + int.from_bytes(content[4:7], "little"), 1 + int.from_bytes(content[7:10], "little")
        if kind == b"VP8 " and len(content) >= 10 and content[3:6] == b"\x9d\x01\x2a":
            width, height = struct.unpack_from("<HH", content, 6)
            return width & 0x3FFF, height & 0x3FFF
        if kind == b"VP8L" and len(content) >= 5 and content[0] == 0x2F:
            packed = int.from_bytes(content[1:5], "little")
            return (packed & 0x3FFF) + 1, ((packed >> 14) & 0x3FFF) + 1
        offset += 8 + length + (length % 2)
    raise ValueError(f"Could not inspect WebP dimensions: {path}")


def parse_ledger(sheets):
    headers = dict(zip("ABCDEFGHIJKLMNOPQ", ["문항 ID", "회차", "유형", "문항", "정답", "선정 상태", "문항 핵심", "발문 유형", "원문 자료의 단서", "원문 기준 해설", "원문 URL", "공식 정답 URL", "첫 대표 출제 씬", "연결 수", "원문 확인 방식", "원본 문제지 이름", "PDF 쪽"]))
    ledger = []
    for row_number, row in table_rows(sheets, "문항원장", headers):
        qid = question_id(row["B"], row["C"], row["D"])
        require(qid == row["A"], f"Question ID does not match metadata at 문항원장!A{row_number}")
        choice_count = 4 if row["C"] == "기본" else 5
        answer = int(row["E"])
        require(1 <= answer <= choice_count, f"Answer outside source choice range: {qid}")
        require(row["F"] in {"선정", "검토만"}, f"Unknown selection state: {qid}")
        require(row["H"] in {"일반", "부정형"}, f"Unknown stem type: {qid}")
        require(row["K"].startswith("https://") and row["L"].startswith("https://"), f"Missing question/official answer URL: {qid}")
        ledger.append({
            "id": qid, "officialQuestionId": qid,
            "examRound": int(row["B"]), "examLevel": row["C"],
            "questionNumber": int(row["D"]), "choiceCount": choice_count,
            "answer": answer - 1, "answerNumber": answer,
            "answerLabel": SYMBOLS[answer - 1], "selected": row["F"] == "선정",
            "label": f"{row['B']}회 {row['C']} {row['D']}번",
            "summary": row["G"], "negative": row["H"] == "부정형",
            "clue": row["I"], "explanation": row["J"],
            "sourceUrl": row["K"], "officialAnswerUrl": row["L"],
            "firstRepresentativeAt": scene_id(row["M"]) if optional(row["M"]) and row["M"] != "추가 후보만" else None,
            "connectionCount": int(row["N"]), "sourceKind": row["O"],
            "sourceFilename": row["P"], "sourcePage": int(row["Q"]) if optional(row["Q"]) else None,
            "workbookRow": row_number,
        })
    require(len({q["id"] for q in ledger}) == len(ledger), "Duplicate canonical question ID in ledger")
    return ledger


def parse_scenes(sheets, blocks, bank):
    headers = dict(zip("ABCDEFGHIJKLM", ["챕터", "씬 ID", "씬 제목", "이 씬에서 배우는 내용", "대표 기출", "정답\n번호", "연결 방식", "전체 문제 풀이 위치", "기출 안의 연결 부분", "연결 이유", "추가 복습 후보", "문제 직전 기록책 제안", "제작 메모"]))
    scenes = []
    for row_number, row in table_rows(sheets, "씬별연결", headers):
        sid = scene_id(row["B"])
        require(sid == row["B"], f"Noncanonical scene ID: {sid}")
        require(sid in blocks, f"Scene absent from manuscript: {sid}")
        representative = {
            "officialQuestionId": question_label(row["E"]), "priority": "representative",
            "answerNumber": int(row["F"]), "linkType": row["G"],
            "quizAfterSceneId": scene_id(row["H"]), "component": row["I"], "reason": row["J"],
        }
        connections = [representative]
        if optional(row["K"]):
            pattern = r"(\d+)\. (\d+회 (?:심화|기본) \d+번) · ([①②③④⑤])\n(직접|선지학습|관련복습|서사연결) · (.+?)\n→ (C\d{2}-S\d{2}) 공통 연결 뒤"
            for index, chunk in enumerate(row["K"].split("\n\n"), 1):
                match = re.fullmatch(pattern, chunk, re.S)
                require(match and int(match[1]) == index, f"Malformed additional connection at 씬별연결!K{row_number}: {chunk!r}")
                qid = question_label(match[2])
                connections.append({
                    "officialQuestionId": qid, "priority": "additional",
                    "answerNumber": SYMBOLS.index(match[3]) + 1, "linkType": match[4],
                    "component": match[5], "quizAfterSceneId": scene_id(match[6]),
                    "reason": blocks[sid]["reasons"].get(qid, ""),
                })
        require(len(connections) == len(blocks[sid]["rows"]), f"Workbook/manuscript connection count mismatch: {sid}")
        for connection, manuscript_connection in zip(connections, blocks[sid]["rows"]):
            qid = connection["officialQuestionId"]
            require(qid in bank and bank[qid]["selected"], f"Connection uses an unselected question: {sid} {qid}")
            require(connection["answerNumber"] == bank[qid]["answerNumber"], f"Connection changes the original answer: {sid} {qid}")
            require(connection["linkType"] in LINK_TYPES, f"Unknown link type: {sid} {qid}")
            require(connection["quizAfterSceneId"] in blocks, f"Missing destination: {sid} {qid}")
            require(connection["reason"] == blocks[sid]["reasons"].get(qid), f"Workbook/manuscript reason mismatch: {sid} {qid}")
            for key, value in manuscript_connection.items():
                require(connection[key] == value, f"Workbook/manuscript connection mismatch: {sid} {qid} {key}")
        scenes.append({
            "sceneId": sid, "chapterNumber": int(row["A"][2:]), "sceneTitle": row["C"],
            "learningFocus": row["D"], "connections": connections,
            "sceneNote": optional(row["M"]), "sourceHint": optional(row["L"]),
            "anchorSpeaker": blocks[sid]["anchorSpeaker"], "anchorText": blocks[sid]["anchorText"],
            "workbookRow": row_number,
        })
    require(len({s["sceneId"] for s in scenes}) == len(scenes), "Duplicate scene ID in workbook")
    return scenes


def split_explanation(text):
    parts = text.split("\n\n[뒤로 미룰 해설] ", 1)
    delayed = parts[1] if len(parts) == 2 else ""
    full_after = None
    if delayed:
        full_after = scene_id(delayed)
    return parts[0], delayed, full_after


def parse_schedule(sheets, blocks, bank, scenes):
    headers = dict(zip("ABCDEFGHIJKLMN", ["순서", "전체 문제 풀이 씬", "씬 제목", "회차", "유형", "문항", "정답", "출제 구분", "문항 핵심", "함께 연결된 씬", "이 발화가 끝난 뒤 출제", "문제 직전 기록책 제안", "이 시점에 제공할 해설", "문항 ID"]))
    scene_lookup = {s["sceneId"]: s for s in scenes}
    groups = defaultdict(list)
    for scene in scenes:
        for connection in scene["connections"]:
            groups[(connection["officialQuestionId"], connection["quizAfterSceneId"])].append((scene["sceneId"], connection))
    schedule = []
    seen_questions = set()
    pairs = set()
    for expected_sequence, (row_number, row) in enumerate(table_rows(sheets, "실제출제순서", headers), 1):
        qid = question_id(row["D"], row["E"], row["F"])
        require(qid == row["N"] and qid in bank, f"Schedule question mismatch at row {row_number}")
        require(int(row["A"]) == expected_sequence, "Noncontiguous representative schedule sequence")
        require(int(row["G"]) == bank[qid]["answerNumber"], f"Schedule changes original answer: {qid}")
        dest = scene_id(row["B"])
        require(dest in blocks and row["C"] == scene_lookup[dest]["sceneTitle"], f"Schedule destination/title mismatch: {dest}")
        pair = (qid, dest)
        require(pair not in pairs, f"Duplicate official question and destination in schedule: {pair}")
        pairs.add(pair)
        require(any(c["priority"] == "representative" for _, c in groups[pair]), f"Schedule pair has no representative connection: {pair}")
        source_scenes = [scene_id(s.strip()) for s in row["J"].split(",")]
        require(source_scenes == sorted({sid for sid, _ in groups[pair]}), f"Schedule source scenes differ from connection grouping: {pair}")
        anchor = f"{blocks[dest]['anchorSpeaker']}: “{blocks[dest]['anchorText']}”"
        require(row["K"] == anchor, f"Exact insertion anchor differs from manuscript: {pair}")
        require(row["I"] == bank[qid]["summary"], f"Schedule summary differs from ledger: {pair}")
        require(row["H"] in {"첫출제", "복습후보"}, f"Unknown play mode at row {row_number}")
        mode = "first" if row["H"] == "첫출제" else "review"
        require((qid not in seen_questions) == (mode == "first"), f"First/review order is inconsistent for {qid}")
        seen_questions.add(qid)
        play_explanation, delayed_note, full_after = split_explanation(row["M"])
        require(not full_after or full_after in blocks, f"Missing full explanation gate: {qid}")
        entry = {
            "id": f"three-exam-{dest}-{qid}", "officialQuestionId": qid,
            "quizAfterSceneId": dest, "sceneTitle": row["C"],
            "sequence": expected_sequence, "playMode": mode, "insertPhase": "after_join",
            "sourceSceneIds": source_scenes,
            "primarySourceSceneIds": sorted({sid for sid, c in groups[pair] if c["priority"] == "representative"}),
            "additionalSourceSceneIds": sorted({sid for sid, c in groups[pair] if c["priority"] == "additional"}),
            "anchorSpeaker": blocks[dest]["anchorSpeaker"], "anchorText": blocks[dest]["anchorText"],
            "preQuizHints": [optional(row["L"])] if optional(row["L"]) else [],
            "playExplanation": play_explanation, "delayedExplanationNote": delayed_note,
            "fullExplanationAfterSceneId": full_after,
            "workbookRow": row_number,
        }
        schedule.append(entry)
    representative_pairs = {pair for pair, group in groups.items() if any(c["priority"] == "representative" for _, c in group)}
    require(pairs == representative_pairs, "Representative schedule does not cover precisely the representative pairs")

    # Additional candidates are the (officialQuestionId, destination) groups
    # with no representative there. They never join the mandatory first queue.
    additional = []
    scene_order = {s["sceneId"]: n for n, s in enumerate(scenes)}
    for qid, dest in sorted(set(groups) - pairs, key=lambda pair: (scene_order[pair[1]], pair[0])):
        source_scenes = sorted({sid for sid, _ in groups[(qid, dest)]})
        additional.append({
            "id": f"three-exam-{dest}-{qid}", "officialQuestionId": qid,
            "quizAfterSceneId": dest, "sceneTitle": scene_lookup[dest]["sceneTitle"],
            "sequence": len(additional) + 1, "playMode": "additional", "insertPhase": "after_join",
            "sourceSceneIds": source_scenes, "primarySourceSceneIds": [],
            "additionalSourceSceneIds": source_scenes,
            "anchorSpeaker": blocks[dest]["anchorSpeaker"], "anchorText": blocks[dest]["anchorText"],
            "preQuizHints": [], "playExplanation": bank[qid]["explanation"],
            "delayedExplanationNote": "", "fullExplanationAfterSceneId": None,
        })

    hints = {(e["officialQuestionId"], e["quizAfterSceneId"]): e["preQuizHints"] for e in schedule + additional}
    for scene in scenes:
        for connection in scene["connections"]:
            available = hints[(connection["officialQuestionId"], connection["quizAfterSceneId"])]
            connection["preQuizHint"] = scene["sourceHint"] if scene["sourceHint"] in available else ""
        recovered_hints = list(dict.fromkeys(c["preQuizHint"] for c in scene["connections"] if c["preQuizHint"]))
        require(recovered_hints == ([scene["sourceHint"]] if scene["sourceHint"] else []), f"Unassigned conditional source hint: {scene['sceneId']}")
        del scene["sourceHint"]
    return schedule, additional


def compile_questions(ledger, evidence, catalog, schedule, repo_root):
    evidence_bank = {q["id"]: q for q in evidence["questions"]}
    catalog_bank = {q["officialQuestionId"]: q for q in catalog}
    require(evidence.get("answerBase") == 1, "Evidence answer basis is not 1-based")
    questions, images = [], []
    for source in ledger:
        qid = source["id"]
        proof = evidence_bank.get(qid)
        original = catalog_bank.get(qid)
        require(proof is not None and original is not None, f"Missing original-source evidence/catalog row: {qid}")
        require(proof["answer"] == source["answerNumber"], f"Workbook/evidence original answer mismatch: {qid}")
        require(original["answer"] == source["answer"], f"Workbook/catalog 0-based answer mismatch: {qid}")
        require(proof["originalQuestionReviewed"] and proof["answerVerified"], f"Original question or official answer is unverified: {qid}")
        require(proof["sourceUrl"] == source["sourceUrl"] and proof["officialAnswerUrl"] == source["officialAnswerUrl"], f"Workbook/evidence provenance mismatch: {qid}")
        if not source["selected"]:
            continue
        q = dict(source)
        q.pop("workbookRow")
        q.pop("selected")
        # The reviewed manuscript keeps its exact historical crop as authoring
        # evidence. Runtime media is upgraded separately through the canonical
        # catalog's hashed detailImage, so regeneration must validate both
        # without rewriting the approved Three data or its source proof.
        authored_prefix = "dist/"
        require(proof["repoImagePath"].startswith(authored_prefix), f"Invalid reviewed image path: {qid}")
        q["questionImage"] = proof["repoImagePath"][len(authored_prefix):]
        image_path = repo_root / "dist" / q["questionImage"]
        require(image_path.is_file(), f"Missing original question image: {image_path}")
        require(proof["repoImagePath"] == "dist/" + q["questionImage"], f"Original image path mismatch: {qid}")
        image_hash = sha256(image_path)
        width, height = webp_size(image_path)
        review = proof.get("runtimeImageReview")
        require(review and review["sha256"] == image_hash, f"Image changed since crop review; inspect the image before replacing the evidence: {qid}")
        require((width, height) == (review["width"], review["height"]), f"Original image dimensions changed: {qid}")
        require(review.get("completeQuestionVisible") and review.get("questionNumberMatches"), f"Incomplete original image crop review: {qid}")
        require(width > 0 and height > 0, f"Invalid original image dimensions: {qid}")
        detail_image = original.get("detailImage") or original["questionImage"]
        detail_path = repo_root / "dist" / detail_image
        require(detail_path.is_file(), f"Missing canonical detail image: {qid}")
        require(original.get("questionImage") == detail_image, f"Canonical question/detail image mismatch: {qid}")
        require(sha256(detail_path) == original.get("detailImageSha256"), f"Canonical detail image hash mismatch: {qid}")
        detail_width, detail_height = webp_size(detail_path)
        require((detail_width, detail_height) == (original.get("detailImageWidth"), original.get("detailImageHeight")), f"Canonical detail image dimensions changed: {qid}")
        require(original.get("cropValidation", {}).get("status") == "passed", f"Canonical crop validation missing: {qid}")
        require(original["examYear"] > 0 and original["sourcePdf"].endswith(".pdf") and original["answerPdf"].endswith(".pdf"), f"Incomplete official source metadata: {qid}")
        options = proof.get("options", [])
        require(not options or (len(options) == q["choiceCount"] and all(isinstance(x, str) and x for x in options)), f"Partial text transcription must not become answer choices: {qid}")
        q.update({
            "questionId": qid, "question": q["label"], "isOfficial": True,
            "sourceVerified": True, "sourceImageStatus": "verified_original",
            "examYear": original["examYear"], "sourceFile": original["sourcePdf"],
            "answerFile": original["answerPdf"], "sourcePage": original["sourcePage"],
            "sourceQuestionImage": q["questionImage"],
            "sourceImageWidth": width, "sourceImageHeight": height,
            "sourceImageSha256": image_hash,
            "options": options, "correctChoice": proof.get("correctChoice", ""),
            "answerPresentation": "original_image_with_numbered_choices",
            "originalQuestionPdfUrl": proof.get("officialQuestionPdfUrl", ""),
            "fullExplanationAfterSceneId": next((e["fullExplanationAfterSceneId"] for e in schedule if e["officialQuestionId"] == qid and e["fullExplanationAfterSceneId"]), None),
            "sourceValidation": {
                "originalQuestionReviewed": proof["originalQuestionReviewed"],
                "officialAnswerVerified": proof["answerVerified"],
                "historicalRepoImageReviewed": proof["repoImageVisuallyReviewedThisTurn"],
                "currentCropReviewed": True, "imageHashMatchesReview": True,
                "answerNumberMatchesEvidence": True, "answerIndexMatchesCatalog": True,
            },
        })
        questions.append(q)
        images.append({"officialQuestionId": qid, "questionImage": q["questionImage"], "sha256": image_hash, "width": width, "height": height, "cropReviewed": True})
    return questions, images


def compile_payload(workbook, manuscript, evidence_path, catalog_path, repo_root):
    sheets = read_workbook(workbook)
    blocks = read_manuscript(manuscript)
    ledger = parse_ledger(sheets)
    bank = {q["id"]: q for q in ledger}
    scenes = parse_scenes(sheets, blocks, bank)
    schedule, additional = parse_schedule(sheets, blocks, bank, scenes)
    evidence = json.loads(evidence_path.read_text(encoding="utf-8"))
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    questions, images = compile_questions(ledger, evidence, catalog, schedule, repo_root)
    connections = [c for s in scenes for c in s["connections"]]
    counts = Counter(c["officialQuestionId"] for c in connections)
    first = [e for e in schedule if e["playMode"] == "first"]
    checkpoints = Counter(e["quizAfterSceneId"] for e in first)
    first_by_question = {e["officialQuestionId"]: e["quizAfterSceneId"] for e in first}
    for q in ledger:
        require(counts[q["id"]] == q["connectionCount"], f"Ledger connection count mismatch: {q['id']}")
        require(bool(counts[q["id"]]) == q["selected"], f"Ledger selection differs from scene use: {q['id']}")
        require(first_by_question.get(q["id"]) == q["firstRepresentativeAt"], f"First representative destination mismatch: {q['id']}")
    scene_order = {s["sceneId"]: i for i, s in enumerate(scenes)}
    for entry in schedule + additional:
        require(all(scene_order[sid] <= scene_order[entry["quizAfterSceneId"]] for sid in entry["sourceSceneIds"]), f"Question opens before its source learning scene: {entry['id']}")
        if entry["fullExplanationAfterSceneId"]:
            require(scene_order[entry["fullExplanationAfterSceneId"]] > scene_order[entry["quizAfterSceneId"]], f"Invalid delayed explanation condition: {entry['id']}")
    stats = {
        "mainScenes": len(scenes), "mainChapters": len({s["chapterNumber"] for s in scenes}),
        "verifiedQuestionPool": len(ledger), "usedDistinctQuestions": len(questions),
        "unusedReviewedQuestions": sum(not q["selected"] for q in ledger),
        "connections": len(connections),
        "representativeConnections": sum(c["priority"] == "representative" for c in connections),
        "additionalConnections": sum(c["priority"] == "additional" for c in connections),
        "representativeScheduleRows": len(schedule), "firstQuestions": len(first),
        "reviewCandidates": sum(e["playMode"] == "review" for e in schedule),
        "additionalScheduleCandidates": len(additional),
        "firstQuestionCheckpoints": len(checkpoints),
        "allRepresentativeCheckpoints": len({e["quizAfterSceneId"] for e in schedule}),
        "maxFirstQuestionsAtCheckpoint": max(checkpoints.values()),
        "connectionTypes": dict(sorted(Counter(c["linkType"] for c in connections).items())),
        "basicQuestions": sum(q["examLevel"] == "기본" for q in questions),
        "advancedQuestions": sum(q["examLevel"] == "심화" for q in questions),
        "questionsWithCompleteTextOptions": sum(bool(q["options"]) for q in questions),
        "questionsUsingOnlyOriginalImageOptions": sum(not q["options"] for q in questions),
        "originalImagesVerified": len(images),
        "verifiedExamSets": len({(q["examRound"], q["examLevel"]) for q in ledger}),
    }
    for key, expected in EXPECTED.items():
        require(stats[key] == expected, f"Approved whole-task scope changed: {key} expected {expected}, found {stats[key]}")
    source = {
        "workbook": "docs/three-content/exam-mapping.xlsx", "workbookSha256": sha256(workbook),
        "manuscript": "docs/three-content/complete-manuscript.md", "manuscriptSha256": sha256(manuscript),
        "evidence": "docs/three-content/exam-source-evidence.json", "evidenceSha256": sha256(evidence_path),
        "catalog": "dist/official-exam-catalog.json", "catalogSha256": text_sha256(catalog_path),
    }
    payload = {
        "schemaVersion": 1, "contentVersion": "three-complete-" + source["workbookSha256"][:12],
        "answerBase": 0, "sourceAnswerBase": 1, "source": source, "stats": stats,
        "questions": questions, "scenes": scenes, "schedule": schedule,
        "additionalCandidates": additional, "ledger": ledger,
        "runtimeRules": {
            "officialQuestionIdentity": "officialQuestionId",
            "mandatoryQueueModes": ["first"], "optionalReviewModes": ["review", "additional"],
            "insertPhase": "after_join", "questionSummaryAndClueAreProductionMetadata": True,
            "showExplanationOnlyAfterAnswer": True, "manualAdvance": True,
            "preserveOptionOrder": True,
        },
    }
    audit = {
        "passed": True, "source": source, "stats": stats,
        "checks": {
            "allWorkbookSheetsRead": True, "workbookAndManuscriptConnectionsMatch": True,
            "allAnswersMatchOriginalEvidence": True, "allAnswersMatchCatalogAfterSingleConversion": True,
            "allSelectedQuestionImagesExistAndMatchReviewedHashes": True,
            "allSelectedImagesHaveCompleteStemMaterialAndOptions": True,
            "allOfficialQuestionIdsUnique": True, "allSchedulePairsDeduplicated": True,
            "allScheduleAnchorsMatchManuscript": True, "noQuestionBeforeItsSourceScenes": True,
            "allConditionalHintsAssigned": True,
        },
        "images": images,
        "visualReviewScope": "All 91 original repository crops were visually checked for question number, stem, source material, numbered options and bottom edge. Mobile layout, enlargement and runtime play are separate UI checks.",
        "imagePolicy": "Original repository image bytes are unchanged. No AI image, synthetic stem, fabricated option, reordered choice or autogenerated explanation is used.",
    }
    return payload, audit


def serialize(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def generated_files(payload, audit, output_dir, audit_path):
    data = serialize(payload)
    javascript = "// Generated by scripts/import-three-complete-exams.py. Edit the approved source files.\n" + "globalThis.THREE_COMPLETE_EXAMS = " + data.rstrip() + ";\n"
    return {output_dir / "three-exam-data.json": data, output_dir / "three-exam-data.js": javascript, audit_path: serialize(audit)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workbook", type=Path, default=ROOT / "docs/three-content/exam-mapping.xlsx")
    parser.add_argument("--manuscript", type=Path, default=ROOT / "docs/three-content/complete-manuscript.md")
    parser.add_argument("--evidence", type=Path, default=ROOT / "docs/three-content/exam-source-evidence.json")
    parser.add_argument("--catalog", type=Path, default=ROOT / "dist/official-exam-catalog.json")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "dist")
    parser.add_argument("--audit", type=Path, default=ROOT / "docs/three-content/exam-import-audit.json")
    parser.add_argument("--check", action="store_true", help="Validate inputs/images and fail if generated outputs are stale; do not write")
    args = parser.parse_args()
    payload, audit = compile_payload(args.workbook, args.manuscript, args.evidence, args.catalog, ROOT)
    for path, content in generated_files(payload, audit, args.output_dir, args.audit).items():
        if args.check:
            require(path.is_file() and path.read_text(encoding="utf-8") == content, f"Generated output is stale: {path.relative_to(ROOT)}; run python3 scripts/import-three-complete-exams.py")
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
    print(json.dumps({"passed": True, "checkOnly": args.check, "stats": payload["stats"]}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, OSError, ET.ParseError, zipfile.BadZipFile) as error:
        print(f"Three Kingdoms exam import failed: {error}", file=sys.stderr)
        sys.exit(1)

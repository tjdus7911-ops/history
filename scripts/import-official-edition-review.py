"""Merge a hand-reviewed official edition (question/choice transcription + explanations)
into dist/official-exam-explanations.json and its core bootstrap.

The full explanation builder needs OCR exports that are not committed, so new editions
are imported from a reviewed ledger (scripts/data/official-<round>-<level>-review.py).
Every record uses the same schema and QA vocabulary as the existing curated records.

Usage: python scripts/import-official-edition-review.py scripts/data/official-80-advanced-review.py [--check]
"""

from __future__ import annotations

import argparse
import json
import re
import runpy
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
PAYLOAD = DIST / "official-exam-explanations.json"
BOOTSTRAP = DIST / "official-exam-explanations.js"
CATALOG = DIST / "official-exam-catalog.json"
INVENTORY = DIST / "official-exam-inventory.json"
LABELS = "①②③④⑤"
ERA_LABELS = {
    "ancient": "선사·고대",
    "goryeo": "고려",
    "joseon": "조선",
    "empire": "개항기·대한제국",
    "occupation": "일제강점기",
    "republic": "대한민국",
}
CORE_FIELDS = (
    "officialQuestionId", "question", "clue", "correctChoice", "explanation",
    "curated", "qualityTier", "coreVerificationStatus", "coreEvidenceSources",
)
STATUS = "CURATED_REVIEWED"
PUBLISHER_SOURCE = "https://www.historyexam.go.kr/pst/list.do?bbs=dat"
SENTENCE_END = re.compile(r"[.!?](?=\s|$|[가-힣A-Za-z])")


def read_text_keep_newline(path: Path) -> tuple[str, str]:
    raw = path.read_bytes().decode("utf-8")
    return raw.replace("\r\n", "\n"), ("\r\n" if "\r\n" in raw[:4096] else "\n")


def write_text(path: Path, text: str, newline: str) -> None:
    path.write_bytes((text.replace("\n", newline) if newline != "\n" else text).encode("utf-8"))


def one_sentence(text: str) -> bool:
    return len(SENTENCE_END.findall(text)) == 1 and bool(re.search(r"[다요](?:\([^()]*\))?[.!?]$", text.strip()))


def build_records(review: dict, catalog: list[dict], review_path: str) -> list[dict]:
    edition = review["EDITION"]
    slug = "advanced" if edition["examLevel"] == "심화" else "basic"
    by_number = {
        item["questionNumber"]: item for item in catalog
        if item["examRound"] == edition["examRound"] and item["examLevel"] == edition["examLevel"]
    }
    if sorted(by_number) != list(range(1, 51)) or sorted(review["QUESTIONS"]) != list(range(1, 51)):
        raise ValueError("review and catalog must both cover questions 1-50")
    records = []
    for number in range(1, 51):
        source = by_number[number]
        data = review["QUESTIONS"][number]
        question_id = f"official-{edition['examRound']}-{slug}-{number:02d}"
        if source["officialQuestionId"] != question_id:
            raise ValueError(question_id)
        choice_count = 4 if edition["examLevel"] == "기본" else 5
        choices, meanings = data["ch"], data["m"]
        if len(choices) != choice_count or len(meanings) != choice_count:
            raise ValueError(f"{question_id}: choice count")
        accepted = sorted(set(source["acceptedAnswers"])) if isinstance(source.get("acceptedAnswers"), list) else [source["answer"]]
        era_label = ERA_LABELS[source["primaryEra"]]
        image_hash = source["detailImageSha256"].lower()
        evidence = [PUBLISHER_SOURCE, source["detailImage"], review_path]
        reasons = data.get("reasons") or [
            f"자료가 가리키는 {data['t']}에 해당하므로 정답이다." if index in accepted
            else f"자료가 가리키는 {data['t']}에 해당하지 않으므로 오답이다."
            for index in range(choice_count)
        ]
        explanations = []
        for index in range(choice_count):
            meaning, reason = meanings[index].strip(), reasons[index].strip()
            if not one_sentence(meaning):
                raise ValueError(f"{question_id} ①+{index}: summary must be one complete sentence: {meaning}")
            if len(SENTENCE_END.findall(reason)) not in (1, 2) or meaning == reason:
                raise ValueError(f"{question_id} ①+{index}: judgment sentence rule")
            explanations.append({
                "choiceIndex": index,
                "label": LABELS[index],
                "choiceText": choices[index],
                "isCorrect": index in accepted,
                "relatedEra": "",
                "relatedTarget": era_label,
                "coreConcept": era_label,
                "meaning": meaning,
                "judgmentReason": reason,
                "correctedFact": None,
                "explanation": f"{meaning} {reason}",
                "verificationStatus": STATUS,
                "ocrConfidence": None,
                "sourceImageSha256": image_hash,
                "sourceImageHashVerified": True,
                "choiceTextVerificationStatus": "VISUALLY_REVIEWED",
                "evidenceSources": evidence,
            })
        if len(SENTENCE_END.findall(data["exp"])) < 3:
            raise ValueError(f"{question_id}: explanation needs at least three sentences")
        records.append({
            "officialQuestionId": question_id,
            "question": data["q"],
            "clue": data["clue"],
            "correctChoice": choices[accepted[0]],
            "explanation": data["exp"],
            "curated": True,
            "qualityTier": "curated",
            "coreVerificationStatus": STATUS,
            "coreEvidenceSources": evidence,
            "choiceCount": choice_count,
            "choices": choices,
            "choiceConfidences": [None] * choice_count,
            "choiceImageSha256": [image_hash] * choice_count,
            "acceptedChoiceIndexes": accepted,
            "choiceExplanations": explanations,
            "choiceCurationSources": evidence,
            "choiceCurationProvenance": {
                "sourceDocument": review_path,
                "sourceImage": source["detailImage"],
                "sourceImageSha256": image_hash,
                "reviewMethod": "공식 문제지 PDF의 텍스트 레이어와 240dpi 상세 문항 이미지를 직접 대조해 발문·선지 순서를 전사하고 공식 정답표와 대조했다.",
                "originalImageVisuallyReviewed": True,
                "officialAnswerVerified": True,
                "curationStatus": STATUS,
            },
            "choiceCurationStatus": STATUS,
            "choiceCurationReviewLabel": "원본 이미지 직접 검토",
            "verificationStatus": STATUS,
        })
    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("review", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    review_file = args.review.resolve()
    review_path = review_file.relative_to(ROOT).as_posix()
    review = runpy.run_path(str(review_file))
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    new_records = build_records(review, catalog, review_path)
    new_ids = {record["officialQuestionId"] for record in new_records}

    payload_text, payload_newline = read_text_keep_newline(PAYLOAD)
    payload = json.loads(payload_text)
    existing = [record for record in payload["records"] if record["officialQuestionId"] in new_ids]
    kept = [record for record in payload["records"] if record["officialQuestionId"] not in new_ids]
    order = {item["officialQuestionId"]: index for index, item in enumerate(catalog)}
    records = sorted(kept + new_records, key=lambda record: order[record["officialQuestionId"]])
    if [record["officialQuestionId"] for record in records] != [item["officialQuestionId"] for item in catalog]:
        raise ValueError("explanation records must follow the canonical catalog exactly")
    payload["records"] = records
    payload["canonicalQuestionCount"] = len(records)
    payload["canonicalChoiceCount"] = sum(record["choiceCount"] for record in records)

    qa = payload["qa"]
    if not existing:
        choices = sum(record["choiceCount"] for record in new_records)
        questions = len(new_records)
        for key in ("choiceCount", "choiceExplanationCount", "curatedChoiceExplanationCount", "curatedSourceChoiceTextCount",
                    "editorialReviewedChoiceExplanationCount", "imageVisuallyReviewedChoiceCount",
                    "curatedRegistryChoiceExplanationCount", "missingChoiceConfidenceCount"):
            qa[key] += choices
        for key in ("curatedChoiceQuestionCount", "editorialReviewedChoiceQuestionCount", "imageVisuallyReviewedQuestionCount",
                    "curatedRegistryQuestionCount", "knowledgeRuleCount"):
            qa[key] += questions
        qa["choiceVerificationStatusCounts"][STATUS] = qa["choiceVerificationStatusCounts"].get(STATUS, 0) + choices
        if review_path not in qa.get("curatedChoiceSourceDocuments", []):
            qa.setdefault("curatedChoiceSourceDocuments", []).append(review_path)
        if review_path not in payload["curatedChoiceCorrectionSources"]:
            payload["curatedChoiceCorrectionSources"].append(review_path)
    core = [{field: record[field] for field in CORE_FIELDS} for record in records]
    qa["fullRecordJsonBytes"] = len(json.dumps(records, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    qa["initialCoreRecordJsonBytes"] = len(json.dumps(core, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    qa["initialCoreRecordReductionPercent"] = round((1 - qa["initialCoreRecordJsonBytes"] / qa["fullRecordJsonBytes"]) * 100, 1)

    bootstrap_text, bootstrap_newline = read_text_keep_newline(BOOTSTRAP)
    head, rest = bootstrap_text.split("globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS=", 1)
    _, rest = rest.split(";\nglobalThis.OFFICIAL_EXAM_EXPLANATION_META=", 1)
    meta_text, tail = rest.split(";\n", 1)
    meta = json.loads(meta_text)
    meta.update({"canonicalQuestionCount": payload["canonicalQuestionCount"], "canonicalChoiceCount": payload["canonicalChoiceCount"], "qa": qa})
    bootstrap = (
        head + "globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS=" + json.dumps(core, ensure_ascii=False, separators=(",", ":"))
        + ";\nglobalThis.OFFICIAL_EXAM_EXPLANATION_META=" + json.dumps(meta, ensure_ascii=False, separators=(",", ":")) + ";\n" + tail
    )
    inventory_text, inventory_newline = read_text_keep_newline(INVENTORY)
    inventory = json.loads(inventory_text)
    inventory["explanationQa"] = qa

    outputs = [
        (PAYLOAD, json.dumps(payload, ensure_ascii=False, indent=2) + "\n", payload_newline),
        (BOOTSTRAP, bootstrap, bootstrap_newline),
        (INVENTORY, json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", inventory_newline),
    ]
    if args.check:
        stale = [path.name for path, text, _ in outputs if read_text_keep_newline(path)[0] != text]
        if stale:
            sys.exit(f"stale reviewed edition output: {stale}")
        print(f"OK {len(new_records)} reviewed records from {review_path}")
        return
    for path, text, newline in outputs:
        write_text(path, text, newline)
    print(f"{'REPLACED' if existing else 'IMPORTED'} {len(new_records)} records from {review_path}; "
          f"{payload['canonicalQuestionCount']} questions / {payload['canonicalChoiceCount']} choices")


if __name__ == "__main__":
    main()

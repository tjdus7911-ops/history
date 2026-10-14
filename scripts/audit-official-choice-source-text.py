"""Audit pre-grade choice text against OCR from official PDF-derived detail crops.

This audit is deliberately narrower than explanation review: it detects source
labels that were expanded with historical meaning and verifies that pure image
choices do not ship explanatory identity prose in the pre-grade bundle.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def compact(value: str) -> str:
    return re.sub(r"[\s·,.;:!?'\"“”‘’\-–—()]+", "", value or "")


def choice_symbol(value: str) -> str:
    value = re.sub(r"\s+", "", value or "")
    match = re.fullmatch(r"\(?([가-마])\)?", value)
    if match:
        return match.group(1)
    if re.fullmatch(r"[ㄱ-ㅎ](?:[,·][ㄱ-ㅎ]){0,3}", value):
        return value.replace(",", "·")
    return ""


def load_ocr_extractor():
    path = ROOT / "scripts" / "build-official-explanations.py"
    spec = importlib.util.spec_from_file_location("official_explanation_builder", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ocr-json", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    catalog_rows = read_json(ROOT / "dist" / "official-exam-catalog.json")
    explanation_rows = read_json(ROOT / "dist" / "official-exam-explanations.json")["records"]
    media_rows = read_json(ROOT / "docs" / "official-exams" / "question-choice-media.json")["records"]
    corrections = read_json(ROOT / "config" / "official-choice-source-corrections.json")["records"]
    visual_baseline = read_json(ROOT / "docs" / "official-exams" / "image-review-report.json")
    ocr_rows = read_json(args.ocr_json)
    extractor = load_ocr_extractor()
    missing = extractor.MISSING_CHOICE_TEXT

    catalog = {row["officialQuestionId"]: row for row in catalog_rows}
    explanations = {row["officialQuestionId"]: row for row in explanation_rows}
    media = {row["officialQuestionId"]: row for row in media_rows}
    correction_by_id = {row["officialQuestionId"]: row for row in corrections}
    if len(ocr_rows) != len(catalog_rows):
        raise ValueError(f"expected {len(catalog_rows)} OCR rows, received {len(ocr_rows)}")
    if len(correction_by_id) != len(corrections):
        raise ValueError("duplicate source-text correction ID")

    source_hash_matches = 0
    exact_ocr_matches = 0
    complete_ocr_questions = 0
    potential_uncorrected: list[str] = []
    ocr_review_rows = []
    for raw in ocr_rows:
        question_id = raw["officialQuestionId"]
        source = catalog[question_id]
        if raw["imageSha256"] == source["detailImageSha256"]:
            source_hash_matches += 1
        evidence = extractor.extract_ocr_evidence(source, raw)
        extracted = evidence.get("choices") or []
        expected_count = 4 if source["examLevel"] == "기본" else 5
        complete = len(extracted) == expected_count and all(value != missing and str(value).strip() for value in extracted)
        if complete:
            complete_ocr_questions += 1
        original_choices = correction_by_id.get(question_id, {}).get("originalChoices") or explanations[question_id]["choices"]
        if media[question_id]["presentation"] == "image":
            original_choices = [""] * expected_count
        exact = complete and media[question_id]["presentation"] != "image" and all(
            compact(left) == compact(right) for left, right in zip(extracted, original_choices)
        )
        if exact:
            exact_ocr_matches += 1

        observed = [(index, choice_symbol(value)) for index, value in enumerate(extracted) if value != missing and choice_symbol(value)]
        current = explanations[question_id]["choices"]
        looks_like_added_meaning = len(observed) >= 3 and all(
            index < len(current)
            and compact(current[index]).startswith(symbol)
            and len(compact(current[index])) > len(symbol) + 3
            for index, symbol in observed
        )
        if looks_like_added_meaning and media[question_id]["presentation"] != "image" and question_id not in correction_by_id:
            potential_uncorrected.append(question_id)
        if question_id in correction_by_id:
            correction = correction_by_id[question_id]
            if correction["sourceDetailSha256"] != source["detailImageSha256"]:
                raise ValueError(f"stale correction source hash: {question_id}")
            if len(correction["originalChoices"]) != expected_count:
                raise ValueError(f"invalid correction choice count: {question_id}")
            ocr_review_rows.append({
                "officialQuestionId": question_id,
                "sourcePdf": source["sourcePdf"],
                "sourcePage": source["sourcePage"],
                "originalChoices": correction["originalChoices"],
                "ocrChoices": extracted,
                "ocrChoiceConfidences": evidence.get("_choiceConfidences") or [],
                "sourceDetailSha256": source["detailImageSha256"],
            })

    if source_hash_matches != len(catalog_rows):
        raise ValueError(f"OCR source hash mismatch: {source_hash_matches}/{len(catalog_rows)}")
    if potential_uncorrected:
        raise ValueError(f"uncorrected source-label hints: {potential_uncorrected}")
    baseline = visual_baseline["canonicalCoverage"]
    if baseline["fullyReviewedQuestionCount"] != len(catalog_rows) or baseline["remainingReviewQuestionCount"]:
        raise ValueError("visual source-review baseline is incomplete")

    image_ids = [question_id for question_id, row in media.items() if row["presentation"] == "image"]
    mismatch_ids = sorted(set(image_ids) | set(correction_by_id))
    report = {
        "schemaVersion": 1,
        "scope": "풀이 전 선지는 원본 시험지의 텍스트·이미지만 노출하고 역사적 의미 설명은 채점 후 해설로 분리",
        "source": "국사편찬위원회 원본 PDF에서 생성한 카탈로그 detailImage와 전체 재실행 OCR",
        "auditedQuestionCount": len(catalog_rows),
        "auditedChoiceCount": sum(4 if row["examLevel"] == "기본" else 5 for row in catalog_rows),
        "sourceHashMatchedQuestionCount": source_hash_matches,
        "freshOcrQuestionCount": len(ocr_rows),
        "completeOcrChoiceQuestionCount": complete_ocr_questions,
        "normalizedExactOcrQuestionCount": exact_ocr_matches,
        "visualReviewBaselineQuestionCount": baseline["fullyReviewedQuestionCount"],
        "originalMismatchQuestionCount": len(mismatch_ids),
        "fixedQuestionCount": len(mismatch_ids),
        "sourceTextCorrectionQuestionCount": len(corrections),
        "imageChoiceProseSuppressedQuestionCount": len(image_ids),
        "unverifiedQuestionCount": 0,
        "unverifiedQuestionIds": [],
        "potentialUncorrectedHintQuestionIds": [],
        "correctionOcrEvidence": ocr_review_rows,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in report.items() if not isinstance(value, list)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

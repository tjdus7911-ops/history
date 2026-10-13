"""Apply visually reviewed choice corrections to the generated explanation payload.

The full explanation builder needs the original OCR export, which is intentionally
not committed. This synchronizer keeps the checked-in generated payload aligned
with image-choice-reviews.json while the main builder consumes the same ledger on
the next source rebuild.
"""

from __future__ import annotations

from collections import Counter
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
REVIEWS = ROOT / "docs" / "story-exams" / "image-choice-reviews.json"
PAYLOAD = DIST / "official-exam-explanations.json"
CATALOG = DIST / "official-exam-catalog.json"
INVENTORY = DIST / "official-exam-inventory.json"
EXTRACTION_AUDIT = ROOT / "docs" / "official-exams" / "choice-extraction-audit.json"
IMAGE_REVIEW_REPORT = ROOT / "docs" / "official-exams" / "image-review-report.json"
MISSING_CHOICE_TEXT = "[원문 이미지 선택지 — OCR 전사 필요]"
LABELS = ["①", "②", "③", "④", "⑤"]
CORE_FIELDS = (
    "officialQuestionId",
    "question",
    "clue",
    "correctChoice",
    "explanation",
    "curated",
    "qualityTier",
    "coreVerificationStatus",
    "coreEvidenceSources",
)


def sentence_parts(value: str) -> list[str]:
    return [item.strip() for item in re.split(r"(?<=[.!?])\s+", value.strip()) if item.strip()]


def write_extraction_audit(records: list[dict]) -> None:
    placeholder_indexes = {
        record["officialQuestionId"]: [
            index + 1 for index, choice in enumerate(record["choices"])
            if choice == MISSING_CHOICE_TEXT
        ]
        for record in records
    }
    placeholder_indexes = {key: value for key, value in placeholder_indexes.items() if value}
    all_placeholder = [
        record["officialQuestionId"] for record in records
        if placeholder_indexes.get(record["officialQuestionId"])
        and len(placeholder_indexes[record["officialQuestionId"]]) == len(record["choices"])
    ]
    partial_placeholder = [
        record["officialQuestionId"] for record in records
        if placeholder_indexes.get(record["officialQuestionId"])
        and len(placeholder_indexes[record["officialQuestionId"]]) < len(record["choices"])
    ]
    audit = {
        "schemaVersion": 1,
        "ocrFailureIds": [],
        "emptyChoiceIds": [],
        "placeholderChoiceCount": sum(map(len, placeholder_indexes.values())),
        "questionsWithPlaceholderCount": len(placeholder_indexes),
        "allPlaceholderQuestionIds": all_placeholder,
        "partialPlaceholderQuestionIds": partial_placeholder,
        "placeholderChoiceIndexesByOfficialQuestionId": placeholder_indexes,
    }
    EXTRACTION_AUDIT.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_image_review_report(payload: dict, review_payload: dict) -> None:
    visually_reviewed_ids = [item["officialQuestionId"] for item in review_payload["records"]]
    remaining = [
        record["officialQuestionId"] for record in payload["records"]
        if any(choice["choiceTextVerificationStatus"] == "DATA_REVIEW_REQUIRED" for choice in record["choiceExplanations"])
    ]
    report = {
        "schemaVersion": 1,
        "scope": "기존 choiceTextVerificationStatus=DATA_REVIEW_REQUIRED 문항의 원본 이미지 재검사",
        "baseline": {
            "ocrReviewRequiredQuestionCount": 1593,
            "ocrReviewRequiredChoiceCount": 7367,
            "placeholderChoiceCount": 2235,
        },
        "sourceImageAudit": {
            "locatedQuestionCount": 1593,
            "hashVerifiedQuestionCount": 1593,
            "missingOrUnreadableQuestionCount": 0,
            "sourceCommit": "83c9da64e68d16264d4ba2cf2437a3d095d04b38",
            "method": "배포 스냅샷의 detailImage를 내려받아 카탈로그 SHA-256과 일치하는지 확인",
        },
        "completedVisualReview": {
            "questionCount": len(visually_reviewed_ids),
            "choiceCount": sum(len(item["choices"]) for item in review_payload["records"]),
            "questionIds": visually_reviewed_ids,
            "ledger": REVIEWS.relative_to(ROOT).as_posix(),
        },
        "remainingManualReview": {
            "questionCount": len(remaining),
            "reason": "원본 이미지와 보조 OCR 자료는 확보했지만 사람의 육안 원문 판독 및 역사 해설 검수가 아직 완료되지 않음",
            "questionIds": remaining,
        },
        "unavailableOriginals": {
            "questionCount": 0,
            "questions": [],
        },
        "userInterfacePolicy": {
            "developerQaBadgesVisible": False,
            "unresolvedUserMessage": "원문 확인 중",
        },
    }
    IMAGE_REVIEW_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    payload = json.loads(PAYLOAD.read_text(encoding="utf-8"))
    catalog = {item["officialQuestionId"]: item for item in json.loads(CATALOG.read_text(encoding="utf-8"))}
    review_payload = json.loads(REVIEWS.read_text(encoding="utf-8"))
    source_document = REVIEWS.relative_to(ROOT).as_posix()
    records = {item["officialQuestionId"]: item for item in payload["records"]}
    reviewed_choice_count = 0

    for review in review_payload["records"]:
        question_id = review["officialQuestionId"]
        source = catalog[question_id]
        record = records[question_id]
        choices = review["choices"]
        explanations = review["choiceExplanations"]
        expected_count = 4 if source["examLevel"] == "기본" else 5
        accepted_indexes = (
            list(source["acceptedAnswers"])
            if isinstance(source.get("acceptedAnswers"), list)
            else [source["answer"]]
        )
        assert len(choices) == len(explanations) == expected_count
        assert review["answer"] == source["answer"]
        assert review.get("acceptedAnswers", accepted_indexes) == accepted_indexes
        assert review["sourceImageSha256"] == source["detailImageSha256"]
        assert review.get("originalImageVisuallyReviewed") is True
        reviewed_choice_count += expected_count

        sources = list(dict.fromkeys([*(review.get("sources") or []), source_document]))
        provenance = {
            "sourceDocument": source_document,
            "sourceImage": source["detailImage"],
            "sourceImageSha256": source["detailImageSha256"],
            "reviewMethod": review_payload["reviewMethod"],
            "originalImageVisuallyReviewed": True,
            "officialAnswerVerified": True,
            "curationStatus": "CURATED_REVIEWED",
        }
        choice_rows = []
        for index, (choice_text, explanation) in enumerate(zip(choices, explanations)):
            parts = sentence_parts(explanation)
            meaning = parts[0] if parts else explanation
            judgment = " ".join(parts[1:]) if len(parts) > 1 else ""
            choice_rows.append({
                "choiceIndex": index,
                "label": LABELS[index],
                "choiceText": choice_text,
                "isCorrect": index in accepted_indexes,
                "relatedEra": "",
                "relatedTarget": (review.get("topicTags") or [""])[0],
                "coreConcept": (review.get("topicTags") or [""])[0],
                "meaning": meaning,
                "judgmentReason": judgment,
                "correctedFact": None,
                "explanation": explanation,
                "verificationStatus": "CURATED_REVIEWED",
                "ocrConfidence": None,
                "sourceImageSha256": source["detailImageSha256"],
                "sourceImageHashVerified": True,
                "choiceTextVerificationStatus": "VISUALLY_REVIEWED",
                "evidenceSources": sources,
            })

        record.update({
            "clue": review["clue"],
            "correctChoice": choices[source["answer"]] if source["answer"] is not None else "",
            "explanation": review["explanation"],
            "curated": True,
            "qualityTier": "curated",
            "coreVerificationStatus": "CURATED_REVIEWED",
            "coreEvidenceSources": sources,
            "choices": choices,
            "choiceConfidences": [None] * expected_count,
            "choiceImageSha256": [source["detailImageSha256"]] * expected_count,
            "choiceExplanations": choice_rows,
            "choiceCurationSources": sources,
            "choiceCurationProvenance": provenance,
            "choiceCurationStatus": "CURATED_REVIEWED",
            "choiceCurationReviewLabel": "원본 이미지 직접 검토",
            "verificationStatus": "CURATED_REVIEWED",
        })

    all_choices = [choice for record in payload["records"] for choice in record["choiceExplanations"]]
    status_counts = Counter(choice["verificationStatus"] for choice in all_choices)
    curated_question_count = sum(
        any(choice["verificationStatus"] in ("CURATED_VERIFIED", "CURATED_REVIEWED") for choice in record["choiceExplanations"])
        for record in payload["records"]
    )
    editorial_reviewed_question_count = sum(
        any(choice["verificationStatus"] == "CURATED_REVIEWED" for choice in record["choiceExplanations"])
        for record in payload["records"]
    )
    review_question_count = sum(
        record["verificationStatus"] == "DATA_REVIEW_REQUIRED"
        for record in payload["records"]
    )
    qa = payload["qa"]
    qa.update({
        "knowledgeRuleCount": sum(record["qualityTier"] in ("curated", "knowledge") for record in payload["records"]),
        "evidenceFallbackCount": sum(record["qualityTier"] == "evidence" for record in payload["records"]),
        "curatedChoiceExplanationCount": status_counts["CURATED_VERIFIED"] + status_counts["CURATED_REVIEWED"],
        "curatedChoiceQuestionCount": curated_question_count,
        "editorialReviewedChoiceExplanationCount": status_counts["CURATED_REVIEWED"],
        "editorialReviewedChoiceQuestionCount": editorial_reviewed_question_count,
        "curatedRegistryQuestionCount": curated_question_count + qa["skippedNonCanonicalCuratedQuestionCount"],
        "curatedRegistryChoiceExplanationCount": status_counts["CURATED_VERIFIED"] + status_counts["CURATED_REVIEWED"] + qa["skippedNonCanonicalCuratedChoiceExplanationCount"],
        "curatedSourceChoiceTextCount": sum(choice["choiceTextVerificationStatus"] == "VISUALLY_REVIEWED" for choice in all_choices),
        "dataReviewRequiredChoiceCount": sum(
            choice["verificationStatus"] == "DATA_REVIEW_REQUIRED"
            or choice["choiceTextVerificationStatus"] == "DATA_REVIEW_REQUIRED"
            for choice in all_choices
        ),
        "dataReviewRequiredQuestionCount": review_question_count,
        "missingChoiceTextCount": sum(choice["choiceText"] == MISSING_CHOICE_TEXT for choice in all_choices),
        "uncertainChoiceTextCount": sum(
            choice["choiceText"] != MISSING_CHOICE_TEXT
            and choice["choiceTextVerificationStatus"] == "DATA_REVIEW_REQUIRED"
            for choice in all_choices
        ),
        "missingChoiceConfidenceCount": sum(choice["ocrConfidence"] is None for choice in all_choices),
        "choiceVerificationStatusCounts": dict(status_counts),
        "qaDeferredCount": review_question_count,
        "imageVisuallyReviewedQuestionCount": len(review_payload["records"]),
        "imageVisuallyReviewedChoiceCount": reviewed_choice_count,
    })
    if source_document not in qa["curatedChoiceSourceDocuments"]:
        qa["curatedChoiceSourceDocuments"].append(source_document)
    payload["curatedChoiceCorrectionSources"] = qa["curatedChoiceSourceDocuments"]

    full_bytes = len(json.dumps(payload["records"], ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    core_records = [{field: record[field] for field in CORE_FIELDS} for record in payload["records"]]
    core_bytes = len(json.dumps(core_records, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    qa["fullRecordJsonBytes"] = full_bytes
    qa["initialCoreRecordJsonBytes"] = core_bytes
    qa["initialCoreRecordReductionPercent"] = round((1 - core_bytes / full_bytes) * 100, 1)

    PAYLOAD.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_extraction_audit(payload["records"])
    write_image_review_report(payload, review_payload)
    js = "/* Core-only bootstrap; option explanations hydrate from official-exam-explanations.json. */\n"
    js += "globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS=" + json.dumps(core_records, ensure_ascii=False, separators=(",", ":")) + ";\n"
    js += "globalThis.OFFICIAL_EXAM_EXPLANATION_META=" + json.dumps({
        "schemaVersion": payload["schemaVersion"],
        "canonicalQuestionCount": payload["canonicalQuestionCount"],
        "canonicalChoiceCount": payload["canonicalChoiceCount"],
        "qa": qa,
    }, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DIST / "official-exam-explanations.js").write_text(js, encoding="utf-8")

    inventory = json.loads(INVENTORY.read_text(encoding="utf-8"))
    inventory["explanationQa"] = qa
    INVENTORY.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"PASS: applied {len(review_payload['records'])} image-reviewed questions and {reviewed_choice_count} choice explanations.")


if __name__ == "__main__":
    main()

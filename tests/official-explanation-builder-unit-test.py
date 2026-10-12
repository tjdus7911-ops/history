"""Focused, dependency-free checks for official explanation/OCR helpers."""

from __future__ import annotations

import importlib.util
import copy
import hashlib
import json
from pathlib import Path
from tempfile import TemporaryDirectory


ROOT = Path(__file__).resolve().parents[1]


def load_script(name: str, relative_path: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"could not load {relative_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


builder = load_script(
    "build_official_explanations",
    "scripts/build-official-explanations.py",
)
ocr_script = load_script(
    "ocr_official_exam_crops",
    "scripts/ocr-official-exam-crops.py",
)


def ocr_line(text: str, y: float, confidence: float | None) -> dict:
    return {
        "text": text,
        "x": 10,
        "y": y,
        "confidence": confidence,
        "words": [{"text": text.split(maxsplit=1)[0]}],
    }


assert builder.normalize_text("옮지 않은 것은?") == "옳지 않은 것은?"
assert builder.normalize_text("적절하지않은 것은?") == "적절하지 않은 것은?"
assert builder.normalize_text("전생 설화와 경제 회생") == "전생 설화와 경제 회생"
assert builder.question_kind("옮지 않은 것은?") == "incorrect"
assert builder.question_kind("적절하지않은 것은?") == "incorrect"
assert builder.question_kind("당시의 연구 활동으로 옳은 것은?") != "person"

assert builder.choice_marker_index("1. 다음 중 옳은 것은?", 5) is None
assert builder.choice_marker_index("1 다음 중 옳은 것은?", 5) is None
assert builder.choice_marker_index("10년 뒤의 사실", 5) is None
assert builder.choice_marker_index("1가락바퀴를 이용하였다", 5) == 0
assert builder.choice_marker_index("5빗살무늬 토기를 만들었다", 5) == 4
assert builder.remove_choice_marker("1가락바퀴를 이용하였다") == "가락바퀴를 이용하였다"

lines = builder.ordered_lines({
    "lines": [
        ocr_line("1. 다음 중 옳은 것은?", 5, 0.99),
        ocr_line("1가락바퀴를 이용하였다", 25, 0.94),
        ocr_line("농경 생활과 관련된 도구이다", 40, 0.73),
        ocr_line("2빗살무늬 토기를 만들었다", 60, 0.92),
        ocr_line("3고인돌을 축조하였다", 80, 0.91),
        ocr_line("4철제 농기구를 사용하였다", 100, 0.90),
        ocr_line("5청동 방울을 제작하였다", 120, 0.89),
    ]
})
choices, first_choice_y, confidences = builder.choice_lines(lines, 5)
assert choices == [
    "가락바퀴를 이용하였다 농경 생활과 관련된 도구이다",
    "빗살무늬 토기를 만들었다",
    "고인돌을 축조하였다",
    "철제 농기구를 사용하였다",
    "청동 방울을 제작하였다",
]
assert first_choice_y == 25
assert confidences == [0.73, 0.92, 0.91, 0.90, 0.89]

partial_lines = builder.ordered_lines({
    "lines": [
        ocr_line("1가락바퀴를 이용하였다", 10, 0.9),
        ocr_line("2빗살무늬 토기를 만들었다", 20, 0.9),
        ocr_line("10년 뒤의 사실", 30, 0.9),
    ]
})
assert builder.choice_lines(partial_lines, 5) == ([], None, [])

# Production extraction may recover text whose circled numerals were dropped,
# but it must keep the printed gap instead of shifting later options forward.
spatial_lines = builder.ordered_lines({
    "lines": [
        ocr_line("1", 400, 0.9),
        ocr_line("첫 번째 선지", 390, 0.9),
        ocr_line("네 번째 선지", 580, 0.9),
        ocr_line("5", 650, 0.9),
        ocr_line("다섯 번째 선지", 640, 0.9),
    ]
})
spatial_choices, _, spatial_confidences = builder.choice_lines(spatial_lines, 5, 700)
assert spatial_choices == [
    "첫 번째 선지",
    builder.MISSING_CHOICE_TEXT,
    builder.MISSING_CHOICE_TEXT,
    "네 번째 선지",
    "다섯 번째 선지",
]
assert spatial_confidences == [None] * 5

# With no marker evidence, the final complete printed block stays in row-major
# y-then-x order and is explicitly review-required.
grid_lines = builder.ordered_lines({
    "lines": [
        {**ocr_line("자료 설명 문장입니다", 200, 0.9), "x": 40},
        {**ocr_line("첫째 선지", 500, 0.9), "x": 50},
        {**ocr_line("둘째 선지", 500, 0.9), "x": 550},
        {**ocr_line("셋째 선지", 600, 0.9), "x": 50},
        {**ocr_line("넷째 선지", 600, 0.9), "x": 550},
    ]
})
grid_choices, _, grid_confidences = builder.choice_lines(grid_lines, 4, 700)
assert grid_choices == ["첫째 선지", "둘째 선지", "셋째 선지", "넷째 선지"]
assert grid_confidences == [None] * 4

missing_confidence_lines = builder.ordered_lines({
    "lines": [
        ocr_line(f"{index}{text}", index * 20, None if index == 2 else 0.9)
        for index, text in enumerate(
            ("가락바퀴", "빗살무늬", "고인돌", "철제 농기구", "청동 방울"),
            start=1,
        )
    ]
})
_, _, missing_confidences = builder.choice_lines(missing_confidence_lines, 5)
assert missing_confidences[1] is None
assert builder.choice_text_needs_review("빗살무늬 토기를 만들었다", None)

assert not builder.rule_alias_matches("조선 건국동맹은 광복을 준비하였다", "동맹")
assert not builder.rule_alias_matches("권한을 부여된 기관", "부여")
assert not builder.rule_alias_matches("주자감에서 인재를 양성하였다", "인재")
assert not builder.rule_alias_matches("한성사범학교를 세웠다", "학교")
assert not builder.rule_alias_matches("전쟁 중 피란하였다", "전쟁")
assert not builder.rule_alias_matches("반란을 진압하였다", "반란")
assert builder.rule_alias_matches("나당 동맹을 체결하였다", "나당 동맹")

rule = builder.choice_history_rule("조선 건국동맹은 광복을 준비하였다")
assert rule is None or rule[0] != "동맹"
rule = builder.choice_history_rule("주자감에서 인재를 양성하였다")
assert rule is None or rule[0] != "인재"
_, matched = builder.historical_context("", "", "농민들이 고추", "joseon")
assert not matched
fallback, matched = builder.make_explanation(
    {"answer": 0, "primaryEra": "joseon"},
    "다음 설명으로 옳은 것은?",
    "",
    "농민들이 고추",
)
assert not matched
assert len(builder.re.findall(r"[.!?](?:[’'\"]|$|\s)", fallback)) >= 3
assert not any(phrase in fallback for phrase in builder.FORBIDDEN_GENERIC)

assert "근대식 우편 업무" in builder.CURATED_EXPLANATIONS["official-63-basic-32"]
assert "개경 환도 이후" in builder.CURATED_EXPLANATIONS["official-69-advanced-15"]

catalog = json.loads((ROOT / "dist" / "official-exam-catalog.json").read_text(encoding="utf-8"))
catalog_by_id = {item["officialQuestionId"]: item for item in catalog}
corrections, skipped_noncanonical = builder.load_curated_choice_corrections(catalog_by_id)
assert builder.EXPECTED_CURATED_CHOICE_QUESTION_COUNT == 35
assert builder.EXPECTED_CURATED_CHOICE_COUNT == 158
assert builder.EXPECTED_CANONICAL_CURATED_QUESTION_COUNT == 21
assert builder.EXPECTED_CANONICAL_CURATED_CHOICE_COUNT == 102
assert len(corrections) == 21
assert sum(len(item["choiceExplanations"]) for item in corrections.values()) == 102
assert len(skipped_noncanonical) == 14
assert sum(len(item["choiceExplanations"]) for item in skipped_noncanonical) == 56
assert len(corrections) + len(skipped_noncanonical) == 35
assert (
    sum(len(item["choiceExplanations"]) for item in corrections.values())
    + sum(len(item["choiceExplanations"]) for item in skipped_noncanonical)
) == 158
assert sum(len(item.get("choices") or []) for item in corrections.values()) == 88
assert "해동통보" in corrections["official-69-basic-12"]["explanation"]
assert "1941년" in corrections["official-79-advanced-40"]["explanation"]
assert "소학교" in corrections["official-79-advanced-40"]["explanation"]
assert "국민학교" in corrections["official-79-advanced-40"]["explanation"]
assert "1996년" not in corrections["official-79-advanced-40"]["explanation"]

curated_counts_by_source = {}
for item in corrections.values():
    source_document = item["provenance"]["sourceDocument"]
    curated_counts_by_source[source_document] = curated_counts_by_source.get(source_document, 0) + 1
assert curated_counts_by_source == {
    "docs/story-exams/explanation-corrections.json": 5,
    "docs/THREE_OFFICIAL_REVIEW_61.json": 8,
    "docs/story-exams/chapter-split-choice-reviews.json": 8,
}
assert {
    item["provenance"]["sourceDocument"] for item in skipped_noncanonical
} == {"docs/story-exams/supplement-60-basic.json"}
assert {
    item["officialQuestionId"] for item in skipped_noncanonical
} == {
    f"official-60-basic-{number:02d}"
    for number in (2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17)
}
assert sum(
    item["curationStatus"] == builder.VERIFICATION_CURATED
    for item in corrections.values()
) == 5
assert sum(
    len(item["choiceExplanations"])
    for item in corrections.values()
    if item["curationStatus"] == builder.VERIFICATION_CURATED
) == 24
assert sum(
    item["curationStatus"] == builder.VERIFICATION_CURATED_REVIEWED
    for item in corrections.values()
) == 16
assert sum(
    len(item["choiceExplanations"])
    for item in corrections.values()
    if item["curationStatus"] == builder.VERIFICATION_CURATED_REVIEWED
) == 78

round_61 = corrections["official-61-advanced-03"]
assert round_61["choices"][4] == "왕족인 부여씨와 8성 귀족이 지배층을 이루었다."
assert round_61["choiceTextVisuallyReviewed"]
assert round_61["curationStatus"] == builder.VERIFICATION_CURATED_REVIEWED
assert round_61["reviewLabel"] == "수기 해설 검토"
assert round_61["provenance"]["questionPdfSha256"].startswith("80b4a83a")
assert "https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029914" in round_61["sources"]

supplement = {
    item["officialQuestionId"]: item for item in skipped_noncanonical
}["official-60-basic-02"]
assert supplement["choices"] is None
assert supplement["provenance"]["sourceImageSha256"].startswith("541de94d")
assert supplement["sources"] == ["docs/story-exams/supplement-60-basic.json"]
assert supplement["curationStatus"] == builder.VERIFICATION_CURATED_REVIEWED
assert supplement["provenance"]["reviewMethod"]

chapter_split = corrections["official-67-basic-10"]
assert chapter_split["choices"] == ["성골", "호족", "권문세족", "신진 사대부"]
assert chapter_split["choiceTextVisuallyReviewed"]
assert chapter_split["curationStatus"] == builder.VERIFICATION_CURATED_REVIEWED
assert chapter_split["provenance"]["reviewMethod"]
assert "dist/chapter-split.js" in chapter_split["sources"]

overridden, overridden_confidences, overridden_hashes = builder.apply_curated_source_choices(
    chapter_split,
    ["OCR 1", "OCR 2", "OCR 3", "OCR 4"],
    [0.99] * 4,
    ["b" * 64] * 4,
)
assert overridden == chapter_split["choices"]
assert overridden_confidences == [None] * 4
assert overridden_hashes == [None] * 4
curated_choice = builder.build_choice_explanation(
    catalog_by_id["official-67-basic-10"],
    "",
    "",
    overridden[0],
    overridden_confidences[0],
    overridden_hashes[0],
    0,
    chapter_split,
)
assert curated_choice["verificationStatus"] == builder.VERIFICATION_CURATED_REVIEWED
assert curated_choice["choiceTextVerificationStatus"] == builder.CHOICE_TEXT_VISUALLY_REVIEWED
assert curated_choice["evidenceSources"] == chapter_split["sources"]

source_verified = corrections["official-77-advanced-11"]
verified_choice = builder.build_choice_explanation(
    catalog_by_id["official-77-advanced-11"],
    "",
    "",
    "별무반은 여진에 대응하였다.",
    0.99,
    None,
    0,
    source_verified,
)
assert verified_choice["verificationStatus"] == builder.VERIFICATION_CURATED
assert verified_choice["choiceTextVerificationStatus"] == "OCR_EXTRACTED"
assert source_verified["reviewLabel"] == "출처 근거 검수 완료"

supplement_choice = builder.build_choice_explanation(
    {
        "answer": supplement["answer"],
        "examLevel": supplement["examLevel"],
        "primaryEra": "ancient",
    },
    "",
    "",
    "영고는 부여의 제천 행사이다.",
    0.99,
    None,
    0,
    supplement,
)
assert supplement_choice["verificationStatus"] == builder.VERIFICATION_CURATED_REVIEWED
assert supplement_choice["choiceTextVerificationStatus"] == "OCR_EXTRACTED"


def expect_curated_validation_error(rows: list[dict], text: str) -> None:
    try:
        builder.validate_curated_choice_corrections(rows, catalog_by_id)
    except ValueError as error:
        assert text in str(error)
    else:
        raise AssertionError(f"expected curated validation error containing {text!r}")


duplicate_rows = [copy.deepcopy(chapter_split), copy.deepcopy(chapter_split)]
expect_curated_validation_error(duplicate_rows, "duplicate curated correction ID")
wrong_answer = copy.deepcopy(chapter_split)
wrong_answer["answer"] = (wrong_answer["answer"] + 1) % wrong_answer["choiceCount"]
expect_curated_validation_error([wrong_answer], "answer mismatch")
wrong_choice_count = copy.deepcopy(chapter_split)
wrong_choice_count["choices"] = wrong_choice_count["choices"][:-1]
expect_curated_validation_error([wrong_choice_count], "source-choice count mismatch")

fake_hash = "a" * 64
selected_choices, selected_confidences, selected_hashes = builder.choose_best_choices(
    [{
        "choices": choices,
        "_choiceConfidences": confidences,
        "_choiceImageSha256": [fake_hash] * 5,
    }],
    5,
)
assert selected_choices == choices
assert selected_confidences == confidences
assert selected_hashes == [fake_hash] * 5

full_record = {
    field: field for field in builder.INITIAL_CORE_FIELDS
}
full_record.update({
    "choices": choices,
    "choiceExplanations": [{"choiceText": value} for value in choices],
    "choiceConfidences": confidences,
    "choiceImageSha256": [fake_hash] * 5,
    "acceptedChoiceIndexes": [0],
})
bootstrap_record = builder.initial_core_record(full_record)
assert tuple(bootstrap_record) == builder.INITIAL_CORE_FIELDS
assert not {
    "choices",
    "choiceExplanations",
    "choiceConfidences",
    "choiceImageSha256",
    "acceptedChoiceIndexes",
} & bootstrap_record.keys()

indexed_rows = [
    (
        index,
        {
            "examRound": 79 if index < 5 else 78,
            "examLevel": "심화",
            "officialQuestionId": f"sample-{index}",
        },
    )
    for index in range(8)
]
chunks = ocr_script.edition_question_chunks(indexed_rows, 2)
assert [len(chunk) for chunk in chunks] == [3, 2, 2, 1]
assert all(len({ocr_script.edition_key(row) for _, row in chunk}) == 1 for chunk in chunks)
restored = {
    index: {"officialQuestionId": row["officialQuestionId"]}
    for chunk in reversed(chunks)
    for index, row in chunk
}
assert [restored[index]["officialQuestionId"] for index in range(8)] == [
    f"sample-{index}" for index in range(8)
]

with TemporaryDirectory(dir=ROOT) as temporary_directory:
    temporary_root = Path(temporary_directory)
    image_payload = b"sample-image-payload"
    (temporary_root / "sample.webp").write_bytes(image_payload)

    class EmptyOcrResult:
        boxes = None
        txts = None
        scores = None

    original_dist = ocr_script.DIST
    original_engine = ocr_script._OCR_ENGINE
    try:
        ocr_script.DIST = temporary_root
        ocr_script._OCR_ENGINE = lambda _path: EmptyOcrResult()
        ocr_row = ocr_script.ocr_record({
            "questionImage": "sample.webp",
            "officialQuestionId": "sample-hash",
        })
    finally:
        ocr_script.DIST = original_dist
        ocr_script._OCR_ENGINE = original_engine
    assert ocr_row["imageSha256"] == hashlib.sha256(image_payload).hexdigest()

print("official explanation builder unit checks passed")

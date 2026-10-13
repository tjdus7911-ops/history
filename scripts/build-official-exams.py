"""Build the canonical official-exam source catalog from user-supplied PDFs.

The PDFs stay outside the repository. This script validates official answer tables,
renders every complete question paper, detects the numbered two-column layout, and
writes compact WebP question crops plus reproducible catalog metadata.
"""

from __future__ import annotations

import argparse
from concurrent.futures import as_completed, ProcessPoolExecutor
import hashlib
from io import BytesIO
import json
from pathlib import Path
import re
import sys

import numpy as np
import pdfplumber
from pdf2image import convert_from_path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
IMAGE_ROOT = DIST / "assets" / "exams" / "catalog"
DETAIL_IMAGE_ROOT = IMAGE_ROOT / "detail"
THUMBNAIL_IMAGE_ROOT = IMAGE_ROOT / "thumbnail"

# Number detection remains at the proven 120 dpi so OCR work does not double,
# while the learner-facing crop is rendered at print-readable resolution.
DETECTION_DPI = 120
DETAIL_DPI = 240
THUMBNAIL_WIDTH = 320
DETAIL_WEBP_QUALITY = 80
THUMBNAIL_WEBP_QUALITY = 68
IMAGE_REVISION = "official-exam-hq-v3-240dpi-q80"

# These questions exposed false OCR headings in the old generator. The bogus
# heading split the preceding question in two (57 심화 6 / 71 기본 4) and then
# assigned the second fragment to the listed question. Requiring a verified
# visual heading for these question numbers repairs both affected pairs and
# prevents the old 80-pixel fragment from being emitted again.
FORCED_VISUAL_HEADINGS = {
    (57, "심화"): {7},
    (71, "기본"): {5},
}
HEADING_LAYOUT_HINTS = {
    (57, "심화", 7): (2, "right"),
    (71, "기본", 5): (2, "left"),
}
KNOWN_CROP_REGRESSIONS = {
    "official-57-advanced-06",
    "official-57-advanced-07",
    "official-71-basic-04",
    "official-71-basic-05",
}

_WORKER_OCR_ENGINE = None

EXAMS = [
    (57, 2022, "기본", "57회 한국사_문제지(기본).pdf", "제57회 기본 정답표 업로드용.pdf"),
    (57, 2022, "심화", "57회 한국사_문제지(심화).pdf", "제57회_심화_정답표.pdf"),
    (58, 2022, "기본", "58회 한국사_문제지(기본).pdf", "58회 기본 정답표.pdf"),
    (58, 2022, "심화", "58회 한국사_문제지(심화).pdf", "58회 심화 정답표.pdf"),
    (59, 2022, "심화", "59회 한국사_문제지(심화).pdf", "제59회 심화 정답표(공개용).pdf"),
    (60, 2022, "심화", "60회 한국사_문제지(심화).pdf", "제60회 정답표(심화).pdf"),
    (61, 2022, "기본", "61회 한국사_문제지(기본).pdf", "제61회 한국사능력검정시험 정답표(기본).pdf"),
    (61, 2022, "심화", "61회 한국사_문제지(심화).pdf", "제61회 한국사능력검정시험 정답표(심화).pdf"),
    (62, 2022, "심화", "62회 한국사능력검정시험 문제지(심화).pdf", "제62회 한국사능력검정시험(심화) 정답표.pdf"),
    (63, 2023, "기본", "63회 한국사_문제지(기본).pdf", "63회 한국사능력검정시험 정답표(기본).pdf"),
    (63, 2023, "심화", "63회 한국사_문제지(심화).pdf", "제63회 한국사능력검정시험 심화 정답표(정정).pdf"),
    (64, 2023, "기본", "64회 한국사_문제지(기본).pdf", "제64회 기본 정답표.pdf"),
    (64, 2023, "심화", "64회 한국사_문제지(심화).pdf", "제64회 심화 정답표.pdf"),
    (65, 2023, "심화", "제65회 한국사능력검정시험 심화 문제지.pdf", "제65회 한국사능력검정시험 심화 정답표.pdf"),
    (66, 2023, "기본", "66회 한국사_문제지(기본).pdf", "66회 한국사_정답표(기본).pdf"),
    (66, 2023, "심화", "66회 한국사_문제지(심화).pdf", "66회 한국사_정답표(심화).pdf"),
    (67, 2023, "기본", "67회 한국사_문제지(기본).pdf", "67회 한국사_정답표(기본).pdf"),
    (67, 2023, "심화", "67회 한국사_문제지(심화).pdf", "67회 한국사_정답표(심화).pdf"),
    (68, 2023, "심화", "68회 한국사_문제지(심화).pdf", "68회 한국사_정답표(심화).pdf"),
    (69, 2024, "기본", "69회 한국사 문제지(기본).pdf", "69회 한국사 정답표(기본).pdf"),
    (69, 2024, "심화", "69회 한국사_문제지(심화).pdf", "69회 한국사_정답표(심화).pdf"),
    (70, 2024, "심화", "70회 한국사_문제지(심화).pdf", "70회 한국사_정답지(심화).pdf"),
    (71, 2024, "기본", "71회 한국사_문제지(기본).pdf", "71회 한국사_답지(기본).pdf"),
    (71, 2024, "심화", "71회 한국사_문제지(심화).pdf", "제71회 심화 정답표.pdf"),
    (72, 2024, "심화", "제72회 심화 문제지.pdf", "제72회 심화 정답표.pdf"),
    (73, 2025, "기본", "73회 한국사_문제지(기본).pdf", "73회 한국사_답지(기본).pdf"),
    (73, 2025, "심화", "73회 심화 문제지.pdf", "73회 심화 정답표.pdf"),
    (74, 2025, "심화", "74회 한국사_문제지(심화).pdf", "74회 심화 정답표.pdf"),
    (75, 2025, "기본", "75회 한국사_문제지(기본).pdf", "75회 한국사_답지(기본).pdf"),
    (75, 2025, "심화", "제75회 심화 문제지.pdf", "제75회 심화 정답표.pdf"),
    (76, 2025, "심화", "76회 한국사_문제지(심화).pdf", "76회 한국사_답지(심화)).pdf"),
    (77, 2026, "기본", "77회 한국사_문제지(기본).pdf", "77회 한국사_답지(기본).pdf"),
    (77, 2026, "심화", "77회 한국사_문제지(심화).pdf", "77회 한국사_답지(심화).pdf"),
    (78, 2026, "심화", "78회 한국사_문제지(심화).pdf", "78회 한국사_답지(심화).pdf"),
    (79, 2026, "기본", "79회 한국사_문제지(기본).pdf", "79회 한국사_답지(기본).pdf"),
    (79, 2026, "심화", "79회 한국사_문제지(심화).pdf", "79회 한국사_답지(심화).pdf"),
]

DUPLICATE_FILES = [
    "제57회_심화_정답표 (1).pdf",
    "제72회 심화 문제지 (1).pdf",
    "제72회 심화 문제지 (2).pdf",
    "제72회 심화 정답표 (1).pdf",
    "제72회 심화 정답표 (2).pdf",
    "78회 한국사_문제지(심화) (1).pdf",
    "78회 한국사_답지(심화) (1).pdf",
]

DEFERRED_FILES = [
    {
        "file": "60회 한국사_문제지(기본).pdf",
        "reason": "이 대화에 제60회 기본 정답표가 명시적으로 첨부되지 않아 보류",
    }
]

# These verified ranges share a source box printed before the first numbered
# question. Every question gets that source: later questions are rendered as a
# source/question composite so unrelated intervening questions are not shown.
SHARED_STIMULUS_GROUPS = {
    (57, "심화"): ((35, 36, 0.092348),),
    (61, "심화"): ((29, 30, 0.093008),),
    (62, "심화"): ((49, 50, 0.092348),),
    (63, "심화"): ((47, 48, 0.093008),),
    (66, "심화"): ((30, 31, 0.094327),),
    (67, "심화"): ((47, 48, 0.093008),),
}

ANSWER_SYMBOLS = {"①": 0, "②": 1, "③": 2, "④": 3, "⑤": 4}
ERA_LABELS = {
    "ancient": "선사·고대",
    "goryeo": "고려",
    "joseon": "조선",
    "empire": "개항기·대한제국",
    "occupation": "일제강점기",
    "republic": "대한민국",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def encode_webp(image: Image.Image, quality: int) -> bytes:
    """Encode once so the digest, filename, and bytes on disk cannot diverge."""
    output = BytesIO()
    image.convert("RGB").save(output, "WEBP", quality=quality, method=6)
    return output.getvalue()


def write_hashed_webp(image: Image.Image, root: Path, stem: str, quality: int) -> dict:
    payload = encode_webp(image, quality)
    digest = sha256_bytes(payload)
    filename = f"{stem}.{digest[:12]}.webp"
    path = root / filename
    root.mkdir(parents=True, exist_ok=True)
    if not path.exists() or path.read_bytes() != payload:
        path.write_bytes(payload)
    return {
        "path": path,
        "sha256": digest,
        "width": image.width,
        "height": image.height,
        "bytes": len(payload),
    }


def relative_dist_path(path: Path) -> str:
    return path.relative_to(DIST).as_posix()


def cleanup_generated_images(records: list[dict]) -> dict:
    """Remove only stale files owned by this pipeline's dedicated directories."""
    if not records or not all(item.get("detailImage") and item.get("thumbnailImage") for item in records):
        return {
            "performed": False,
            "reason": "catalog does not yet contain the complete dual-image schema",
            "staleDetailRemoved": 0,
            "staleThumbnailRemoved": 0,
            "legacyFlatRemoved": [],
            "compatibilityFlatRetained": [],
        }
    expected_detail = {DIST / item["detailImage"] for item in records}
    expected_thumbnail = {DIST / item["thumbnailImage"] for item in records}
    stale_detail = [path for path in DETAIL_IMAGE_ROOT.glob("*.webp") if path not in expected_detail]
    stale_thumbnail = [path for path in THUMBNAIL_IMAGE_ROOT.glob("*.webp") if path not in expected_thumbnail]
    for path in stale_detail + stale_thumbnail:
        path.unlink()

    # Several released story-data files intentionally keep their original flat
    # image paths as immutable source evidence. Preserve exactly those live
    # references (including 60th-basic supplements), while removing flat files
    # that the current app and source records no longer reference.
    generated_catalog_names = {
        "official-exam-catalog.js",
        "official-exam-catalog.json",
        "official-exam-inventory.json",
    }
    live_flat_references: set[str] = set()
    flat_reference_pattern = re.compile(
        r"assets/exams/catalog/(\d+-(?:advanced|basic)-\d{2}\.webp)"
    )
    for source_path in DIST.rglob("*"):
        if (
            not source_path.is_file()
            or source_path.name in generated_catalog_names
            or source_path.suffix.lower() not in {
                ".js", ".mjs", ".cjs", ".json", ".html", ".css",
                ".svg", ".xml", ".txt", ".webmanifest",
            }
        ):
            continue
        try:
            source_text = source_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        live_flat_references.update(flat_reference_pattern.findall(source_text))

    legacy_flat = []
    retained_compatibility_flat = []
    pattern = re.compile(r"(\d+)-(advanced|basic)-(\d{2})\.webp")
    for path in IMAGE_ROOT.glob("*.webp"):
        match = pattern.fullmatch(path.name)
        if not match:
            continue
        if path.name in live_flat_references:
            retained_compatibility_flat.append(path)
        else:
            legacy_flat.append(path)
    # Runtime/UI QA resolves every canonical image through detailImage or
    # thumbnailImage. The exact flat-name pattern is pipeline-owned legacy data,
    # so retaining it would add ~60 MiB of low-resolution duplicates.
    for path in legacy_flat:
        path.unlink()
    return {
        "performed": True,
        "staleDetailRemoved": len(stale_detail),
        "staleThumbnailRemoved": len(stale_thumbnail),
        "legacyFlatRemoved": [relative_dist_path(path) for path in legacy_flat],
        "compatibilityFlatRetained": [
            relative_dist_path(path) for path in retained_compatibility_flat
        ],
    }


def projection_centers(mask: np.ndarray) -> list[int]:
    indexes = np.flatnonzero(mask)
    if not len(indexes):
        return []
    groups = [[int(indexes[0])]]
    for index in indexes[1:]:
        if index - groups[-1][-1] <= 3:
            groups[-1].append(int(index))
        else:
            groups.append([int(index)])
    return [round(sum(group) / len(group)) for group in groups]


def normalized_cell(gray: np.ndarray, bounds: tuple[int, int, int, int]) -> np.ndarray:
    left, top, right, bottom = bounds
    pad_x, pad_y = max(2, (right - left) // 12), max(2, (bottom - top) // 10)
    cell = gray[top + pad_y : bottom - pad_y, left + pad_x : right - pad_x]
    ink = cell < 175
    ys, xs = np.where(ink)
    if not len(xs):
        return np.zeros((32, 32), dtype=np.uint8)
    glyph = (ink[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1] * 255).astype(np.uint8)
    return np.asarray(Image.fromarray(glyph).resize((32, 32), Image.Resampling.NEAREST))


def parse_answers_ocr(path: Path, poppler_bin: Path, ocr_engine) -> dict[int, dict]:
    if ocr_engine is None:
        raise ValueError(f"{path.name}: answer table needs OCR fallback")
    image = convert_from_path(path, dpi=180, fmt="png", first_page=1, last_page=1, poppler_path=str(poppler_bin))[0]
    gray = np.asarray(image.convert("L"))
    height, width = gray.shape
    vertical_region = gray[int(height * .12) : int(height * .58)]
    vertical = projection_centers((vertical_region < 80).sum(axis=0) > vertical_region.shape[0] * .42)
    horizontal_region = gray[:, int(width * .06) : int(width * .94)]
    horizontal = projection_centers((horizontal_region < 80).sum(axis=1) > horizontal_region.shape[1] * .52)
    vertical = [value for value in vertical if int(width * .04) < value < int(width * .96)]
    horizontal = [value for value in horizontal if int(height * .08) < value < int(height * .65)]
    if len(vertical) != 16 or len(horizontal) != 12:
        raise ValueError(f"{path.name}: answer grid detection got {len(vertical)} vertical / {len(horizontal)} horizontal lines")

    result, _ = ocr_engine(image)
    tokens = []
    translate = str.maketrans("１２３４５", "12345")
    for box, text, confidence in result or []:
        normalized = text.translate(translate).strip()
        match = re.fullmatch(r"[①②③④⑤1-5]", normalized)
        if not match or confidence < .82:
            continue
        label = ANSWER_SYMBOLS.get(normalized, int(normalized) - 1 if normalized.isdigit() else None)
        tokens.append({
            "x": sum(point[0] for point in box) / len(box),
            "y": sum(point[1] for point in box) / len(box),
            "label": label,
        })

    cells = []
    for group in range(5):
        for row in range(10):
            top, bottom = horizontal[row + 1], horizontal[row + 2]
            answer_bounds = (vertical[group * 3 + 1], top, vertical[group * 3 + 2], bottom)
            point_bounds = (vertical[group * 3 + 2], top, vertical[group * 3 + 3], bottom)
            number = group * 10 + row + 1
            cells.append({"number": number, "kind": "answer", "bounds": answer_bounds, "glyph": normalized_cell(gray, answer_bounds)})
            cells.append({"number": number, "kind": "points", "bounds": point_bounds, "glyph": normalized_cell(gray, point_bounds)})

    templates = {"answer": {}, "points": {}}
    for cell in cells:
        left, top, right, bottom = cell["bounds"]
        token = next((item for item in tokens if left < item["x"] < right and top < item["y"] < bottom), None)
        if token is None:
            continue
        value = token["label"] + 1
        allowed = range(1, 6) if cell["kind"] == "answer" else range(1, 4)
        if value in allowed:
            cell["value"] = value
            templates[cell["kind"]].setdefault(value, []).append(cell["glyph"])
    if set(templates["answer"]) != set(range(1, 6)) or set(templates["points"]) != set(range(1, 4)):
        raise ValueError(f"{path.name}: incomplete OCR digit templates")
    for cell in cells:
        if "value" in cell:
            continue
        distances = {}
        for value, samples in templates[cell["kind"]].items():
            distances[value] = min(float(np.mean(np.abs(cell["glyph"].astype(float) - sample.astype(float)))) for sample in samples)
        cell["value"] = min(distances, key=distances.get)
        if distances[cell["value"]] > 42:
            raise ValueError(f"{path.name}: uncertain OCR digit for question {cell['number']} {cell['kind']}")

    answers = {}
    for number in range(1, 51):
        answer = next(cell["value"] for cell in cells if cell["number"] == number and cell["kind"] == "answer")
        points = next(cell["value"] for cell in cells if cell["number"] == number and cell["kind"] == "points")
        answers[number] = {"answer": answer - 1, "answerLabel": str(answer), "points": points, "acceptedAnswers": None}
    if sum(item["points"] for item in answers.values()) != 100:
        raise ValueError(f"{path.name}: OCR point total is not 100")
    return answers


def parse_answers(path: Path, poppler_bin: Path, ocr_engine=None) -> dict[int, dict]:
    with pdfplumber.open(path) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    matches = re.findall(r"(?<!\d)(\d{1,2})\s+(①|②|③|④|⑤|없음)\s+([123])(?=\s|$)", text)
    answers: dict[int, dict] = {}
    for number_text, symbol, points_text in matches:
        number = int(number_text)
        if 1 <= number <= 50:
            answers[number] = {
                "answer": ANSWER_SYMBOLS.get(symbol),
                "answerLabel": symbol,
                "points": int(points_text),
                "acceptedAnswers": list(range(5)) if symbol == "없음" else None,
            }
    if set(answers) != set(range(1, 51)):
        return parse_answers_ocr(path, poppler_bin, ocr_engine)
    return answers


def row_runs(mask: np.ndarray, max_gap: int = 6) -> list[tuple[int, int]]:
    rows = np.flatnonzero(mask)
    if not len(rows):
        return []
    groups = [[int(rows[0])]]
    for row in rows[1:]:
        if row - groups[-1][-1] <= max_gap:
            groups[-1].append(int(row))
        else:
            groups.append([int(row)])
    return [(group[0], group[-1]) for group in groups]


def band_candidates(gray: np.ndarray, start: float, end: float) -> list[dict]:
    height, width = gray.shape
    # Some Basic papers place the first question directly below a compact header.
    y0, y1 = int(height * 0.055), int(height * 0.94)
    band = gray[y0:y1, int(width * start) : int(width * end)]
    row_ink = (band < 105).sum(axis=1)
    candidates = []
    for top, bottom in row_runs(row_ink >= 2):
        block = band[top : bottom + 1]
        ink = int((block < 105).sum())
        block_height = bottom - top + 1
        if 13 <= block_height <= 30 and 35 <= ink <= 340:
            candidates.append({"top": top + y0, "bottom": bottom + y0, "ink": ink})
    return candidates


def merge_candidates(groups: list[list[dict]]) -> list[dict]:
    merged: list[dict] = []
    for candidate in sorted((item for group in groups for item in group), key=lambda item: item["top"]):
        current = next((item for item in merged if abs(item["top"] - candidate["top"]) <= 10), None)
        if current:
            current["top"] = min(current["top"], candidate["top"])
            current["bottom"] = max(current["bottom"], candidate["bottom"])
            current["ink"] = max(current["ink"], candidate["ink"])
        else:
            merged.append(candidate.copy())
    return merged


def question_headings(image: Image.Image, page_index: int) -> list[dict]:
    gray = np.asarray(image.convert("L"))
    height, width = gray.shape
    definitions = {
        "left": [(0.062, 0.081), (0.066, 0.089)],
        "right": [(0.502, 0.521), (0.516, 0.539)],
    }
    headings = []
    for column, bands in definitions.items():
        candidates = merge_candidates([band_candidates(gray, start, end) for start, end in bands])
        score_start, score_end = ((0.44, 0.49) if column == "left" else (0.89, 0.935))
        for candidate in candidates:
            if candidate["ink"] < 35:
                continue
            if page_index == 0 and candidate["top"] < int(height * 0.165):
                continue
            score = gray[
                max(0, candidate["top"] - 6) : min(height, candidate["bottom"] + 7),
                int(width * score_start) : int(width * score_end),
            ]
            if int((score < 150).sum()) < 95 or float(score.mean()) < 210:
                continue
            headings.append({"column": column, **candidate})
    return sorted(headings, key=lambda item: (0 if item["column"] == "left" else 1, item["top"]))


def score_heading_candidates(image: Image.Image, page_index: int) -> list[dict]:
    """Use the printed [1점]/[2점]/[3점] marker as a second heading anchor."""
    gray = np.asarray(image.convert("L"))
    height, width = gray.shape
    definitions = {"left": [(0.438, 0.492)], "right": [(0.888, 0.938)]}
    candidates = []
    for column, bands in definitions.items():
        for candidate in merge_candidates([band_candidates(gray, start, end) for start, end in bands]):
            number_start, number_end = ((0.05, 0.12) if column == "left" else (0.495, 0.565))
            number_ink = int((gray[
                max(0, candidate["top"] - 10):min(height, candidate["bottom"] + 11),
                int(width * number_start):int(width * number_end),
            ] < 130).sum())
            if candidate["ink"] >= 35 and number_ink >= 180:
                candidates.append({"pageIndex": page_index, "page": image, "column": column, "numberInk": number_ink, **candidate})
    return candidates


def trim_bottom(image: Image.Image, left: int, right: int, top: int, limit: int) -> int:
    gray = np.asarray(image.convert("L"))
    region = gray[top:limit, left:right]
    colored = (region < 247).sum(axis=1)
    rows = np.flatnonzero(colored >= 3)
    if not len(rows):
        return min(limit, top + max(120, round(image.height * .07)))
    return min(limit, top + int(rows[-1]) + max(24, round(image.height * .014)))


def validate_question_locations(located: list[dict], question_name: str) -> None:
    numbers = [item["questionNumber"] for item in located]
    if numbers != list(range(1, 51)):
        raise ValueError(f"{question_name}: question number sequence is not 1-50: {numbers}")
    if any(location_key(located[index]) >= location_key(located[index + 1]) for index in range(49)):
        raise ValueError(f"{question_name}: question headings are not in reading order")
    for current, following in zip(located, located[1:]):
        if current["pageIndex"] != following["pageIndex"] or current["column"] != following["column"]:
            continue
        minimum_gap = max(60, round(current["page"].height * .035))
        if following["top"] - current["top"] < minimum_gap:
            raise ValueError(
                f"{question_name}: suspicious duplicate headings for questions "
                f"{current['questionNumber']}/{following['questionNumber']} at page "
                f"{current['pageIndex'] + 1} {current['column']}"
            )


def crop_question(
    page: Image.Image,
    location: dict,
    located: list[dict],
    round_no: int,
    level: str,
) -> tuple[Image.Image, dict]:
    width, height = page.size
    column_locations = [
        item for item in located
        if item["pageIndex"] == location["pageIndex"] and item["column"] == location["column"]
    ]
    column_index = column_locations.index(location)
    following = column_locations[column_index + 1] if column_index + 1 < len(column_locations) else None
    left, right = (
        (int(width * .06), int(width * .497))
        if location["column"] == "left"
        else (int(width * .503), int(width * .945))
    )
    heading_padding = max(10, round(height * .006))
    following_padding = max(12, round(height * .007))
    top = max(0, location["top"] - heading_padding)
    shared_group = next(
        (
            (start, end, top_ratio)
            for start, end, top_ratio in SHARED_STIMULUS_GROUPS.get((round_no, level), ())
            if start <= location["questionNumber"] <= end
        ),
        None,
    )
    first_shared_location = None
    shared_source_top = None
    if shared_group:
        start, _, top_ratio = shared_group
        first_shared_location = next(item for item in located if item["questionNumber"] == start)
        if first_shared_location["pageIndex"] != location["pageIndex"]:
            raise ValueError(f"shared source layout changed for {round_no} {level} {start}-{shared_group[1]}")
        shared_source_top = max(0, int(height * top_ratio) - heading_padding)
        if location["questionNumber"] == start:
            top = min(top, shared_source_top)
    limit = following["top"] - following_padding if following else int(height * .925)
    if limit <= top:
        raise ValueError(
            f"question {location['questionNumber']}: crop limit {limit} is above top {top}; "
            "likely duplicate/false heading"
        )
    bottom = trim_bottom(page, left, right, top, limit)
    if bottom <= top:
        raise ValueError(f"question {location['questionNumber']}: empty crop")
    crop = page.crop((left, top, right, bottom))
    source_box = None
    if shared_group and location["questionNumber"] > shared_group[0]:
        source_bottom = max(shared_source_top + round(height * .012), first_shared_location["top"] - following_padding)
        source_left, source_right = (
            (int(width * .06), int(width * .497))
            if first_shared_location["column"] == "left"
            else (int(width * .503), int(width * .945))
        )
        source_crop = page.crop((source_left, shared_source_top, source_right, source_bottom))
        combined_width = max(crop.width, source_crop.width)
        combined = Image.new("RGB", (combined_width, source_crop.height + crop.height), "white")
        combined.paste(source_crop, ((combined_width - source_crop.width) // 2, 0))
        combined.paste(crop, ((combined_width - crop.width) // 2, source_crop.height))
        crop = combined
        source_box = [source_left, shared_source_top, source_right, source_bottom]
    return crop, {
        "questionBox": [left, top, right, bottom],
        "sharedSourceBox": source_box,
        "pageWidth": width,
        "pageHeight": height,
    }


def validate_crop(crop: Image.Image, page: Image.Image, question_id: str, location: dict) -> dict:
    minimum_ratio = .06
    if question_id in KNOWN_CROP_REGRESSIONS:
        minimum_ratio = .10
    height_ratio = crop.height / page.height
    if height_ratio < minimum_ratio:
        raise ValueError(
            f"{question_id}: crop height {crop.height}px ({height_ratio:.3f} page) is below "
            f"the {minimum_ratio:.2f} minimum; likely truncated"
        )
    if crop.width < page.width * .40:
        raise ValueError(f"{question_id}: crop width {crop.width}px is unexpectedly narrow")
    gray = np.asarray(crop.convert("L"))
    ink_rows = int(np.count_nonzero((gray < 245).sum(axis=1) >= 3))
    dark_pixels = int((gray < 215).sum())
    if ink_rows < 24 or dark_pixels < 250:
        raise ValueError(f"{question_id}: crop has too little printed content")
    return {
        "status": "passed",
        "headingVerification": location.get("headingVerification", "visual_layout"),
        "cropHeightRatio": round(height_ratio, 4),
        "inkRowCount": ink_rows,
        "darkPixelCount": dark_pixels,
    }


def source_era(question_number: int) -> str:
    if question_number <= 10:
        return "ancient"
    if question_number <= 17:
        return "goryeo"
    if question_number <= 30:
        return "joseon"
    if question_number <= 35:
        return "empire"
    if question_number <= 45:
        return "occupation"
    return "republic"


def text_question_headings(question_path: Path, pages: list[Image.Image]) -> list[dict]:
    located = []
    with pdfplumber.open(question_path) as pdf:
        for page_index, (pdf_page, rendered_page) in enumerate(zip(pdf.pages, pages)):
            scale_y = rendered_page.height / pdf_page.height
            for word in pdf_page.extract_words() or []:
                match = re.fullmatch(r"(\d{1,2})\.", word.get("text", ""))
                if not match:
                    continue
                x_ratio = word["x0"] / pdf_page.width
                if not (0.04 <= x_ratio <= 0.13 or 0.48 <= x_ratio <= 0.58):
                    continue
                number = int(match.group(1))
                if not 1 <= number <= 50:
                    continue
                located.append({
                    "questionNumber": number,
                    "pageIndex": page_index,
                    "page": rendered_page,
                    "column": "left" if word["x0"] < pdf_page.width / 2 else "right",
                    "top": round(word["top"] * scale_y),
                    "bottom": round(word["bottom"] * scale_y),
                    "ink": 999,
                    "headingVerification": "pdf_text",
                })
    by_number: dict[int, list[dict]] = {}
    for item in located:
        by_number.setdefault(item["questionNumber"], []).append(item)
    # A number such as "1." can also occur in a source quotation or choice.
    # Text coordinates are safe only when every printed question number occurs
    # exactly once and the resulting positions follow the paper's reading order.
    if set(by_number) != set(range(1, 51)) or any(len(items) != 1 for items in by_number.values()):
        return []
    ordered = [by_number[number][0] for number in range(1, 51)]
    if any(location_key(ordered[index]) >= location_key(ordered[index + 1]) for index in range(49)):
        return []
    return ordered


def location_key(item: dict) -> tuple:
    return item["pageIndex"], 0 if item["column"] == "left" else 1, item["top"]


def deduplicate_visual_candidates(candidates: list[dict]) -> list[dict]:
    """Collapse number-band and score-band hits for the same printed heading."""
    deduplicated: list[dict] = []
    for candidate in sorted(candidates, key=location_key):
        duplicate = next(
            (
                item for item in reversed(deduplicated)
                if item["pageIndex"] == candidate["pageIndex"]
                and item["column"] == candidate["column"]
                and abs(item["top"] - candidate["top"])
                <= max(55, round(candidate["page"].height * .035))
            ),
            None,
        )
        if duplicate is None:
            deduplicated.append(candidate.copy())
            continue
        duplicate["top"] = min(duplicate["top"], candidate["top"])
        duplicate["bottom"] = max(duplicate["bottom"], candidate["bottom"])
        duplicate["ink"] = max(duplicate.get("ink", 0), candidate.get("ink", 0))
        duplicate["numberInk"] = max(duplicate.get("numberInk", 0), candidate.get("numberInk", 0))
    return deduplicated


def ocr_question_headings(
    pages: list[Image.Image],
    ocr_engine,
    visual_candidates: list[dict],
    forced_visual_numbers: set[int] | None = None,
    layout_hints: dict[int, tuple[int, str]] | None = None,
) -> list[dict]:
    forced_visual_numbers = forced_visual_numbers or set()
    layout_hints = layout_hints or {}
    visual_candidates = deduplicate_visual_candidates(visual_candidates)
    located = []
    for page_index, image in enumerate(pages):
        width, height = image.size
        for column, left_ratio, right_ratio in (("left", 0.045, 0.19), ("right", 0.49, 0.65)):
            offset = int(width * left_ratio)
            crop = image.crop((offset, 0, int(width * right_ratio), height))
            result, _ = ocr_engine(crop)
            for box, text, confidence in result or []:
                match = re.match(r"^\s*(\d{1,2})\.", text)
                if not match or confidence < 0.6:
                    continue
                number = int(match.group(1))
                if not 1 <= number <= 50:
                    continue
                x = min(point[0] for point in box) + offset
                top = round(min(point[1] for point in box))
                bottom = round(max(point[1] for point in box))
                expected_x = (0.04 <= x / width <= 0.14) if column == "left" else (0.49 <= x / width <= 0.59)
                if expected_x and int(height * 0.055) <= top <= int(height * 0.94):
                    located.append({
                        "questionNumber": number,
                        "pageIndex": page_index,
                        "page": image,
                        "column": column,
                        "top": top,
                        "bottom": bottom,
                        "ink": round(confidence * 1000),
                        "headingVerification": "ocr",
                    })
    by_number = {}
    for item in located:
        by_number.setdefault(item["questionNumber"], item)
    # A known false OCR number must never win merely because it is monotonic.
    # Remove it before visual gap filling, then require the replacement to come
    # from the paired number/score layout detector.
    for number in forced_visual_numbers:
        by_number.pop(number, None)
    # Discard isolated OCR numbers embedded in the question body when they violate
    # the monotonic order established by their nearest known neighbours.
    for number in list(sorted(by_number)):
        previous = next((by_number[value] for value in range(number - 1, 0, -1) if value in by_number), None)
        following = next((by_number[value] for value in range(number + 1, 51) if value in by_number), None)
        if previous and following and not (location_key(previous) < location_key(by_number[number]) < location_key(following)):
            del by_number[number]
    missing = sorted(set(range(1, 51)) - set(by_number))
    while missing:
        start = missing[0]
        end = start
        while end + 1 in missing:
            end += 1
        previous = by_number.get(start - 1)
        following = by_number.get(end + 1)
        lower = location_key(previous) if previous else (-1, -1, -1)
        upper = location_key(following) if following else (999, 999, 999999)
        known_locations = list(by_number.values())
        possible = [
            item for item in visual_candidates
            if lower < location_key(item) < upper
            and not any(
                item["pageIndex"] == known["pageIndex"]
                and item["column"] == known["column"]
                and abs(item["top"] - known["top"]) <= max(48, round(item["page"].height * .03))
                for known in known_locations
            )
        ]
        needed = end - start + 1
        if needed == 1 and start in layout_hints:
            page_number, column = layout_hints[start]
            possible = [
                item for item in possible
                if item["pageIndex"] == page_number - 1 and item["column"] == column
            ]
        # In the standard reading order a single question between the last
        # left-column question and a following right-column question starts the
        # right column. This preference rejects body text falsely read as a
        # question number in the lower half of the left column.
        if (
            needed == 1
            and previous
            and following
            and previous["pageIndex"] == following["pageIndex"]
            and previous["column"] == "left"
            and following["column"] == "right"
        ):
            right_column = [
                item for item in possible
                if item["pageIndex"] == following["pageIndex"] and item["column"] == "right"
            ]
            if right_column:
                possible = right_column
        if len(possible) < needed:
            # A faint printed number can evade the visual detector even when OCR
            # identifies both neighbours. In the standard two-column paper,
            # a single missing number between the last left-column question and
            # the following right-column question must start that right column.
            if (
                needed == 1
                and previous
                and following
                and previous["pageIndex"] == following["pageIndex"]
                and previous["column"] == "left"
                and following["column"] == "right"
            ):
                top_samples = [
                    item["top"] for item in by_number.values()
                    if item["column"] == "right" and item["top"] < 400
                ]
                inferred_top = round(sum(top_samples) / len(top_samples)) if top_samples else 170
                by_number[start] = {
                    "questionNumber": start,
                    "pageIndex": following["pageIndex"],
                    "page": following["page"],
                    "column": "right",
                    "top": inferred_top,
                    "bottom": inferred_top + 24,
                    "ink": 0,
                    "inferred": True,
                    "headingVerification": "layout_inference",
                }
                missing = sorted(set(range(1, 51)) - set(by_number))
                continue
            neighbours = {number: (item["pageIndex"] + 1, item["column"], item["top"]) for number, item in sorted(by_number.items())}
            raise ValueError(f"OCR question-number verification missing {missing}; only {len(possible)} visual candidates; located={neighbours}")
        chosen = sorted(sorted(possible, key=lambda item: item.get("ink", 0), reverse=True)[:needed], key=location_key)
        for number, candidate in zip(range(start, end + 1), chosen):
            by_number[number] = {
                "questionNumber": number,
                **candidate,
                "headingVerification": "visual_layout",
            }
        missing = sorted(set(range(1, 51)) - set(by_number))
    for number in forced_visual_numbers:
        if by_number[number].get("headingVerification") != "visual_layout":
            raise ValueError(f"question {number}: required visual heading verification was not used")
    return [by_number[number] for number in range(1, 51)]


def build_exam(source_dir: Path, poppler_bin: Path, item: tuple, output_images: bool, ocr_engine=None) -> tuple[list[dict], dict]:
    round_no, year, level, question_name, answer_name = item
    question_path, answer_path = source_dir / question_name, source_dir / answer_name
    if not question_path.exists() or not answer_path.exists():
        raise FileNotFoundError(f"missing attached source: {question_path if not question_path.exists() else answer_path}")
    answers = parse_answers(answer_path, poppler_bin, ocr_engine)
    detection_pages = convert_from_path(
        question_path,
        dpi=DETECTION_DPI,
        fmt="png",
        thread_count=2,
        poppler_path=str(poppler_bin),
    )
    located = text_question_headings(question_path, detection_pages)
    detection_method = "pdf_text"
    if not located:
        detection_method = "visual_layout"
        visual_candidates = []
        for page_index, page in enumerate(detection_pages):
            for heading in question_headings(page, page_index):
                visual_candidates.append({"pageIndex": page_index, "page": page, **heading})
            visual_candidates.extend(score_heading_candidates(page, page_index))
        if ocr_engine is not None:
            layout_hints = {
                number: hint
                for (hint_round, hint_level, number), hint in HEADING_LAYOUT_HINTS.items()
                if hint_round == round_no and hint_level == level
            }
            located = ocr_question_headings(
                detection_pages,
                ocr_engine,
                visual_candidates,
                FORCED_VISUAL_HEADINGS.get((round_no, level), set()),
                layout_hints,
            )
            detection_method = "visual_ocr"
        else:
            located = deduplicate_visual_candidates(visual_candidates)
            for number, location in enumerate(located, start=1):
                location["questionNumber"] = number
                location["headingVerification"] = "visual_layout"
    if len(located) != 50:
        per_page = {}
        for entry in located:
            per_page.setdefault(entry["pageIndex"] + 1, []).append((entry["column"], entry["top"]))
        raise ValueError(f"{question_name}: detected {len(located)} question headings, expected 50: {per_page}")
    validate_question_locations(located, question_name)

    detail_pages = []
    detail_locations = []
    if output_images:
        detail_pages = convert_from_path(
            question_path,
            dpi=DETAIL_DPI,
            fmt="png",
            thread_count=2,
            poppler_path=str(poppler_bin),
        )
        if len(detail_pages) != len(detection_pages):
            raise ValueError(f"{question_name}: detection/detail page counts differ")
        for location in located:
            source_page = detection_pages[location["pageIndex"]]
            detail_page = detail_pages[location["pageIndex"]]
            scale_y = detail_page.height / source_page.height
            detail_locations.append({
                **location,
                "page": detail_page,
                "top": round(location["top"] * scale_y),
                "bottom": round(location["bottom"] * scale_y),
            })

    slug = "advanced" if level == "심화" else "basic"
    records = []
    for location in located:
        number = location["questionNumber"]
        page = location["page"]
        question_id = f"official-{round_no}-{slug}-{number:02d}"
        detection_crop, detection_box = crop_question(page, location, located, round_no, level)
        crop_validation = validate_crop(detection_crop, page, question_id, location)
        crop_validation.update({
            "detectionDpi": DETECTION_DPI,
            "detectionQuestionBox": detection_box["questionBox"],
            "sharedSourceIncluded": detection_box["sharedSourceBox"] is not None,
        })
        image_metadata = {}
        if output_images:
            detail_location = detail_locations[number - 1]
            detail_page = detail_location["page"]
            detail_crop, detail_box = crop_question(
                detail_page, detail_location, detail_locations, round_no, level
            )
            validate_crop(detail_crop, detail_page, question_id, detail_location)
            thumbnail = detail_crop.copy()
            thumbnail.thumbnail(
                (THUMBNAIL_WIDTH, max(1, round(detail_crop.height * THUMBNAIL_WIDTH / detail_crop.width))),
                Image.Resampling.LANCZOS,
            )
            detail_artifact = write_hashed_webp(
                detail_crop, DETAIL_IMAGE_ROOT, question_id, DETAIL_WEBP_QUALITY
            )
            thumbnail_artifact = write_hashed_webp(
                thumbnail, THUMBNAIL_IMAGE_ROOT, question_id, THUMBNAIL_WEBP_QUALITY
            )
            detail_image = relative_dist_path(detail_artifact["path"])
            thumbnail_image = relative_dist_path(thumbnail_artifact["path"])
            crop_validation.update({
                "detailDpi": DETAIL_DPI,
                "detailQuestionBox": detail_box["questionBox"],
            })
            image_metadata = {
                # Keep the historical field as a detail-image alias so existing
                # consumers remain readable while the UI adopts the explicit pair.
                "questionImage": detail_image,
                "detailImage": detail_image,
                "thumbnailImage": thumbnail_image,
                "detailImageWidth": detail_artifact["width"],
                "detailImageHeight": detail_artifact["height"],
                "thumbnailImageWidth": thumbnail_artifact["width"],
                "thumbnailImageHeight": thumbnail_artifact["height"],
                "detailImageSha256": detail_artifact["sha256"],
                "thumbnailImageSha256": thumbnail_artifact["sha256"],
                "detailImageBytes": detail_artifact["bytes"],
                "thumbnailImageBytes": thumbnail_artifact["bytes"],
                "imageRevision": IMAGE_REVISION,
                "imageFormat": "webp",
                "cropValidation": crop_validation,
            }
        answer = answers[number]
        era = source_era(number)
        record = {
            "officialQuestionId": question_id,
            "examRound": round_no,
            "examYear": year,
            "examLevel": level,
            "questionNumber": number,
            "answer": answer["answer"],
            "answerLabel": "없음" if answer["answer"] is None else tuple(ANSWER_SYMBOLS)[answer["answer"]],
            "acceptedAnswers": answer["acceptedAnswers"],
            "points": answer["points"],
            "sourcePdf": question_name,
            "answerPdf": answer_name,
            "primaryEra": era,
            "concepts": [ERA_LABELS[era]],
            "sourcePage": location["pageIndex"] + 1,
            **image_metadata,
        }
        records.append(record)
    inventory = {
        "examRound": round_no,
        "examYear": year,
        "examLevel": level,
        "questionPdf": question_name,
        "answerPdf": answer_name,
        "questionPdfSha256": sha256(question_path),
        "answerPdfSha256": sha256(answer_path),
        "questionCount": len(records),
        "pageCount": len(detection_pages),
        "answerCount": len(answers),
        "allCorrectQuestions": [number for number, value in answers.items() if value["answer"] is None],
        "questionDetectionMethod": detection_method,
        "imageRevision": IMAGE_REVISION,
        "detailImageBytes": sum(item.get("detailImageBytes", 0) for item in records),
        "thumbnailImageBytes": sum(item.get("thumbnailImageBytes", 0) for item in records),
        "sharedStimulusGroups": [
            {"start": start, "end": end}
            for start, end, _ in SHARED_STIMULUS_GROUPS.get((round_no, level), ())
        ],
    }
    return records, inventory


def initialize_build_worker(ocr_runtime: str | None) -> None:
    """Initialize one OCR model per spawned process (Windows-safe)."""
    global _WORKER_OCR_ENGINE
    if not ocr_runtime:
        _WORKER_OCR_ENGINE = None
        return
    if ocr_runtime not in sys.path:
        sys.path.insert(0, ocr_runtime)
    from rapidocr_onnxruntime import RapidOCR
    _WORKER_OCR_ENGINE = RapidOCR()


def build_exam_worker(payload: tuple[str, str, tuple, bool]) -> tuple[list[dict], dict]:
    source_dir, poppler_bin, item, output_images = payload
    return build_exam(
        Path(source_dir),
        Path(poppler_bin),
        item,
        output_images,
        _WORKER_OCR_ENGINE,
    )


def inspect_reusable_image(root: Path, question_id: str) -> dict:
    matches = list(root.glob(f"{question_id}.*.webp"))
    if len(matches) != 1:
        raise ValueError(
            f"{question_id}: expected exactly one reusable image in {root}, got {len(matches)}"
        )
    path = matches[0]
    payload = path.read_bytes()
    digest = sha256_bytes(payload)
    if f".{digest[:12]}.webp" not in path.name:
        raise ValueError(f"{path}: filename does not match content hash")
    with Image.open(path) as image:
        width, height = image.size
        if image.format != "WEBP":
            raise ValueError(f"{path}: reusable image is not WebP")
    return {
        "path": path,
        "sha256": digest,
        "width": width,
        "height": height,
        "bytes": len(payload),
    }


def resume_exam_from_catalog(
    source_dir: Path,
    item: tuple,
    previous_records: list[dict],
    previous_exams: list[dict],
) -> tuple[list[dict], dict]:
    round_no, _, level, question_name, answer_name = item
    slug = "advanced" if level == "심화" else "basic"
    records = [
        dict(record)
        for record in previous_records
        if record["examRound"] == round_no and record["examLevel"] == level
    ]
    records.sort(key=lambda record: record["questionNumber"])
    if [record["questionNumber"] for record in records] != list(range(1, 51)):
        raise ValueError(f"{round_no}회 {level}: previous catalog is not a complete 50-question edition")
    inventory_matches = [
        dict(exam)
        for exam in previous_exams
        if exam["examRound"] == round_no and exam["examLevel"] == level
    ]
    if len(inventory_matches) != 1:
        raise ValueError(f"{round_no}회 {level}: previous inventory match count is {len(inventory_matches)}")
    inventory = inventory_matches[0]
    question_path, answer_path = source_dir / question_name, source_dir / answer_name
    if sha256(question_path) != inventory["questionPdfSha256"]:
        raise ValueError(f"{round_no}회 {level}: question PDF changed; cannot resume images")
    if sha256(answer_path) != inventory["answerPdfSha256"]:
        raise ValueError(f"{round_no}회 {level}: answer PDF changed; cannot resume images")
    with pdfplumber.open(question_path) as pdf:
        page_heights = {
            index + 1: round(page.height * DETAIL_DPI / 72)
            for index, page in enumerate(pdf.pages)
        }
    for record in records:
        question_id = f"official-{round_no}-{slug}-{record['questionNumber']:02d}"
        if record["officialQuestionId"] != question_id:
            raise ValueError(f"{question_id}: previous officialQuestionId changed")
        detail = inspect_reusable_image(DETAIL_IMAGE_ROOT, question_id)
        thumbnail = inspect_reusable_image(THUMBNAIL_IMAGE_ROOT, question_id)
        if detail["width"] < 1000:
            raise ValueError(f"{question_id}: reusable detail width {detail['width']} is not 240dpi")
        if not THUMBNAIL_WIDTH - 2 <= thumbnail["width"] <= THUMBNAIL_WIDTH:
            raise ValueError(
                f"{question_id}: reusable thumbnail width {thumbnail['width']} is outside "
                f"the {THUMBNAIL_WIDTH - 2}-{THUMBNAIL_WIDTH}px target"
            )
        if abs(detail["width"] / detail["height"] - thumbnail["width"] / thumbnail["height"]) > .01:
            raise ValueError(f"{question_id}: reusable detail/thumbnail aspect ratios differ")
        detail_image = relative_dist_path(detail["path"])
        thumbnail_image = relative_dist_path(thumbnail["path"])
        page_height = page_heights[record["sourcePage"]]
        record.update({
            "questionImage": detail_image,
            "detailImage": detail_image,
            "thumbnailImage": thumbnail_image,
            "detailImageWidth": detail["width"],
            "detailImageHeight": detail["height"],
            "thumbnailImageWidth": thumbnail["width"],
            "thumbnailImageHeight": thumbnail["height"],
            "detailImageSha256": detail["sha256"],
            "thumbnailImageSha256": thumbnail["sha256"],
            "detailImageBytes": detail["bytes"],
            "thumbnailImageBytes": thumbnail["bytes"],
            "imageRevision": IMAGE_REVISION,
            "imageFormat": "webp",
            "cropValidation": {
                "status": "passed",
                "headingVerification": "resumed_hash_verified",
                "cropHeightRatio": round(detail["height"] / page_height, 4),
                "detectionDpi": DETECTION_DPI,
                "detailDpi": DETAIL_DPI,
                "sharedSourceIncluded": any(
                    start <= record["questionNumber"] <= end and record["questionNumber"] > start
                    for start, end, _ in SHARED_STIMULUS_GROUPS.get((round_no, level), ())
                ),
                "resumedExisting": True,
            },
        })
    inventory.update({
        "imageRevision": IMAGE_REVISION,
        "detailImageBytes": sum(record["detailImageBytes"] for record in records),
        "thumbnailImageBytes": sum(record["thumbnailImageBytes"] for record in records),
    })
    return records, inventory


def atomic_write_text(path: Path, content: str) -> None:
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(content, encoding="utf-8")
    temporary.replace(path)


def synchronize_explanation_image_hashes(
    records: list[dict], *, require_complete_catalog: bool = True
) -> int:
    """Keep structured choice provenance linked after compression-only changes."""
    explanation_path = DIST / "official-exam-explanations.json"
    if not explanation_path.exists():
        return 0
    payload = json.loads(explanation_path.read_text(encoding="utf-8"))
    hashes = {item["officialQuestionId"]: item["detailImageSha256"] for item in records}
    refreshed = 0
    for record in payload.get("records", []):
        expected = hashes.get(record.get("officialQuestionId"))
        if not expected:
            if require_complete_catalog:
                raise ValueError(
                    f"explanation points outside canonical catalog: {record.get('officialQuestionId')}"
                )
            continue
        linked_hashes = record.get("choiceImageSha256") or []
        for index, current in enumerate(linked_hashes):
            if current:
                if current != expected:
                    refreshed += 1
                linked_hashes[index] = expected
        for choice in record.get("choiceExplanations", []):
            if choice.get("sourceImageSha256"):
                if choice["sourceImageSha256"] != expected:
                    refreshed += 1
                choice["sourceImageSha256"] = expected
                choice["sourceImageHashVerified"] = True

    all_choices = [
        choice
        for record in payload.get("records", [])
        for choice in record.get("choiceExplanations", [])
    ]
    qa = payload.setdefault("qa", {})
    qa["missingChoiceImageHashCount"] = sum(
        not choice.get("sourceImageSha256") for choice in all_choices
    )
    qa["choiceImageHashMismatchCount"] = sum(
        bool(choice.get("sourceImageSha256"))
        and bool(hashes.get(record.get("officialQuestionId")))
        and choice["sourceImageSha256"] != hashes[record["officialQuestionId"]]
        for record in payload.get("records", [])
        for choice in record.get("choiceExplanations", [])
    )
    qa["fullRecordJsonBytes"] = len(
        json.dumps(payload.get("records", []), ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    )
    atomic_write_text(
        explanation_path,
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
    )
    return refreshed


def reencode_existing_details() -> None:
    """Re-encode verified 240 dpi crops without rerunning layout/OCR detection.

    This mode is intentionally limited to compression-only revisions. It verifies
    every current byte hash and preserves the decoded dimensions before swapping
    catalog paths atomically. A later full PDF rebuild uses the same quality
    constant, so this deployment optimization cannot be reverted by the normal
    generator.
    """
    catalog_path = DIST / "official-exam-catalog.json"
    inventory_path = DIST / "official-exam-inventory.json"
    if not catalog_path.exists() or not inventory_path.exists():
        raise FileNotFoundError("--reencode-existing-details requires the existing catalog and inventory")

    records = json.loads(catalog_path.read_text(encoding="utf-8"))
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    if len(records) != len(EXAMS) * 50:
        raise ValueError(f"expected {len(EXAMS) * 50} canonical records, got {len(records)}")

    source_revisions = sorted({item.get("imageRevision", "unknown") for item in records})
    source_bytes = sum(int(item.get("detailImageBytes") or 0) for item in records)
    reencoded_count = 0
    for index, item in enumerate(records, start=1):
        current_path = DIST / item["detailImage"]
        if not current_path.is_file():
            raise FileNotFoundError(f"missing detail image: {current_path}")
        current_payload = current_path.read_bytes()
        current_hash = sha256_bytes(current_payload)
        if current_hash != item.get("detailImageSha256"):
            raise ValueError(f"detail hash mismatch before re-encode: {item['officialQuestionId']}")

        if item.get("imageRevision") == IMAGE_REVISION:
            generated = {
                "path": current_path,
                "sha256": current_hash,
                "bytes": len(current_payload),
                "width": int(item["detailImageWidth"]),
                "height": int(item["detailImageHeight"]),
            }
        else:
            with Image.open(BytesIO(current_payload)) as decoded:
                decoded.load()
                if decoded.size != (
                    int(item["detailImageWidth"]), int(item["detailImageHeight"])
                ):
                    raise ValueError(f"detail dimensions changed before re-encode: {item['officialQuestionId']}")
                generated = write_hashed_webp(
                    decoded.convert("RGB"), DETAIL_IMAGE_ROOT,
                    item["officialQuestionId"], DETAIL_WEBP_QUALITY,
                )
            reencoded_count += 1

        item.update({
            "questionImage": relative_dist_path(generated["path"]),
            "detailImage": relative_dist_path(generated["path"]),
            "detailImageWidth": generated["width"],
            "detailImageHeight": generated["height"],
            "detailImageSha256": generated["sha256"],
            "detailImageBytes": generated["bytes"],
            "imageRevision": IMAGE_REVISION,
            "imageFormat": "webp",
        })
        if index % 100 == 0:
            print(f"REENCODED {index}/{len(records)}", flush=True)

    detail_bytes = sum(int(item["detailImageBytes"]) for item in records)
    thumbnail_bytes = sum(int(item.get("thumbnailImageBytes") or 0) for item in records)
    inventory["imagePipeline"] = {
        "revision": IMAGE_REVISION,
        "format": "webp",
        "detectionDpi": DETECTION_DPI,
        "detailDpi": DETAIL_DPI,
        "detailQuality": DETAIL_WEBP_QUALITY,
        "thumbnailWidth": THUMBNAIL_WIDTH,
        "thumbnailQuality": THUMBNAIL_WEBP_QUALITY,
        "detailImageCount": sum(bool(item.get("detailImage")) for item in records),
        "thumbnailImageCount": sum(bool(item.get("thumbnailImage")) for item in records),
        "detailImageBytes": detail_bytes,
        "thumbnailImageBytes": thumbnail_bytes,
        "cropValidationPassedCount": sum(
            item.get("cropValidation", {}).get("status") == "passed" for item in records
        ),
    }
    # Publish the new catalog before deleting the old hash-named files. If the
    # process is interrupted, the last complete catalog still points only to
    # files that exist; at worst a later run removes harmless stale files.
    atomic_write_text(
        catalog_path,
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
    )
    js = "/* Generated by scripts/build-official-exams.py from attached official PDFs. */\n"
    js += "globalThis.OFFICIAL_EXAM_SOURCE_RECORDS="
    js += json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    js += ";\n"
    atomic_write_text(DIST / "official-exam-catalog.js", js)

    explanation_hash_refresh_count = synchronize_explanation_image_hashes(records)
    image_cleanup = cleanup_generated_images(records)
    inventory["imageCleanup"] = image_cleanup
    previous_optimization = inventory.get("imageOptimization")
    if reencoded_count or not previous_optimization:
        inventory["imageOptimization"] = {
            "mode": "verified-existing-240dpi-crop-reencode",
            "sourceRevisions": source_revisions,
            "reencodedCount": reencoded_count,
            "dimensionsPreservedCount": len(records),
            "sourceDetailImageBytes": source_bytes,
            "outputDetailImageBytes": detail_bytes,
            "savedDetailImageBytes": source_bytes - detail_bytes,
            "explanationHashRefreshCount": explanation_hash_refresh_count,
        }
    else:
        previous_optimization["explanationHashRefreshCount"] = (
            int(previous_optimization.get("explanationHashRefreshCount") or 0)
            + explanation_hash_refresh_count
        )
    for exam in inventory.get("exams", []):
        matching = [
            item for item in records
            if item["examRound"] == exam["examRound"] and item["examLevel"] == exam["examLevel"]
        ]
        exam["imageRevision"] = IMAGE_REVISION
        exam["detailImageBytes"] = sum(int(item["detailImageBytes"]) for item in matching)
        exam["thumbnailImageBytes"] = sum(int(item.get("thumbnailImageBytes") or 0) for item in matching)

    atomic_write_text(
        inventory_path,
        json.dumps(inventory, ensure_ascii=False, indent=2) + "\n",
    )
    print(
        f"WROTE {len(records)} q{DETAIL_WEBP_QUALITY} detail images; "
        f"{source_bytes} -> {detail_bytes} bytes; cleaned "
        f"{image_cleanup['staleDetailRemoved']} stale detail files",
        flush=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path)
    parser.add_argument("--poppler-bin", type=Path)
    parser.add_argument("--ocr-runtime", type=Path)
    parser.add_argument(
        "--workers",
        type=int,
        default=1,
        help="Build independent exam editions in parallel (each process owns one OCR engine)",
    )
    parser.add_argument("--only", help="Optional comma-separated round-level keys, e.g. 57-basic,70-advanced")
    parser.add_argument(
        "--resume-editions",
        help=(
            "Comma-separated editions whose already-generated hash images should be verified and "
            "reused with records from the current catalog"
        ),
    )
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument(
        "--merge-existing",
        action="store_true",
        help="Build only the selected attached editions and merge them into the existing canonical catalog",
    )
    parser.add_argument(
        "--reencode-existing-details",
        action="store_true",
        help="Compression-only rebuild of the verified 240 dpi crops; skips PDF layout/OCR detection",
    )
    args = parser.parse_args()

    if args.reencode_existing_details:
        if args.only or args.resume_editions or args.merge_existing or args.validate_only:
            parser.error("--reencode-existing-details cannot be combined with selection/build modes")
        reencode_existing_details()
        return
    if not args.source_dir or not args.poppler_bin:
        parser.error("--source-dir and --poppler-bin are required for PDF builds")

    if not 1 <= args.workers <= 8:
        raise ValueError("--workers must be between 1 and 8")

    ocr_engine = None
    if args.ocr_runtime and args.workers == 1:
        sys.path.insert(0, str(args.ocr_runtime))
        from rapidocr_onnxruntime import RapidOCR
        ocr_engine = RapidOCR()

    IMAGE_ROOT.mkdir(parents=True, exist_ok=True)
    records, exams = [], []
    selected = EXAMS
    if args.only:
        requested = set(args.only.split(","))
        selected = [item for item in EXAMS if f"{item[0]}-{'advanced' if item[2] == '심화' else 'basic'}" in requested]
    resume_requested = set(args.resume_editions.split(",")) if args.resume_editions else set()
    selected_keys = {
        f"{item[0]}-{'advanced' if item[2] == '심화' else 'basic'}"
        for item in selected
    }
    unknown_resume = resume_requested - selected_keys
    if unknown_resume:
        raise ValueError(f"--resume-editions contains unselected/unknown keys: {sorted(unknown_resume)}")
    if resume_requested and args.validate_only:
        raise ValueError("--resume-editions cannot be combined with --validate-only")
    if resume_requested:
        catalog_path = DIST / "official-exam-catalog.json"
        inventory_path = DIST / "official-exam-inventory.json"
        if not catalog_path.exists() or not inventory_path.exists():
            raise FileNotFoundError("--resume-editions requires the existing catalog and inventory")
        resume_catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
        resume_inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
        for item in selected:
            key = f"{item[0]}-{'advanced' if item[2] == '심화' else 'basic'}"
            if key not in resume_requested:
                continue
            built, inventory = resume_exam_from_catalog(
                args.source_dir,
                item,
                resume_catalog,
                resume_inventory["exams"],
            )
            records.extend(built)
            exams.append(inventory)
            print(f"REUSED {inventory['examRound']}회 {inventory['examLevel']} 50문항", flush=True)
    build_selected = [
        item for item in selected
        if f"{item[0]}-{'advanced' if item[2] == '심화' else 'basic'}" not in resume_requested
    ]
    if args.workers == 1:
        for item in build_selected:
            built, inventory = build_exam(
                args.source_dir, args.poppler_bin, item, not args.validate_only, ocr_engine
            )
            records.extend(built)
            exams.append(inventory)
            print(f"OK {inventory['examRound']}회 {inventory['examLevel']} {inventory['questionCount']}문항", flush=True)
    else:
        payloads = [
            (str(args.source_dir), str(args.poppler_bin), item, not args.validate_only)
            for item in build_selected
        ]
        with ProcessPoolExecutor(
            max_workers=args.workers,
            initializer=initialize_build_worker,
            initargs=(str(args.ocr_runtime) if args.ocr_runtime else None,),
        ) as executor:
            futures = {executor.submit(build_exam_worker, payload): payload[2] for payload in payloads}
            for future in as_completed(futures):
                item = futures[future]
                try:
                    built, inventory = future.result()
                except Exception as error:
                    for pending in futures:
                        pending.cancel()
                    raise RuntimeError(f"failed building {item[0]}회 {item[2]}: {error}") from error
                records.extend(built)
                exams.append(inventory)
                print(
                    f"OK {inventory['examRound']}회 {inventory['examLevel']} "
                    f"{inventory['questionCount']}문항",
                    flush=True,
                )

    keys = [(item["examRound"], item["examLevel"], item["questionNumber"]) for item in records]
    if len(keys) != len(set(keys)):
        raise ValueError("duplicate canonical exam keys generated")
    if len(records) != len(selected) * 50:
        raise ValueError(f"expected {len(selected) * 50} records, got {len(records)}")

    if args.validate_only:
        print(f"VALID {len(exams)} editions / {len(records)} questions", flush=True)
        return

    imported_question_count = len(records)
    replaced_question_count = 0
    if len(selected) != len(EXAMS):
        if not args.merge_existing:
            raise ValueError("partial --only runs must use --validate-only or --merge-existing")
        catalog_path = DIST / "official-exam-catalog.json"
        inventory_path = DIST / "official-exam-inventory.json"
        if not catalog_path.exists() or not inventory_path.exists():
            raise FileNotFoundError("--merge-existing requires the existing canonical catalog and inventory")
        previous_records = json.loads(catalog_path.read_text(encoding="utf-8"))
        previous_inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
        imported_keys = {
            (item["examRound"], item["examLevel"], item["questionNumber"])
            for item in records
        }
        replaced_question_count = sum(
            (item["examRound"], item["examLevel"], item["questionNumber"]) in imported_keys
            for item in previous_records
        )
        records = [
            item for item in previous_records
            if (item["examRound"], item["examLevel"], item["questionNumber"]) not in imported_keys
        ] + records
        selected_editions = {(item[0], item[2]) for item in selected}
        exams = [
            item for item in previous_inventory["exams"]
            if (item["examRound"], item["examLevel"]) not in selected_editions
        ] + exams

    records.sort(key=lambda item: (item["examRound"], 0 if item["examLevel"] == "기본" else 1, item["questionNumber"]))
    exams.sort(key=lambda item: (item["examRound"], 0 if item["examLevel"] == "기본" else 1))
    canonical_keys = [(item["examRound"], item["examLevel"], item["questionNumber"]) for item in records]
    if len(canonical_keys) != len(set(canonical_keys)):
        raise ValueError("duplicate canonical exam keys after merge")

    previous_inventory_path = DIST / "official-exam-inventory.json"
    previous_inventory = (
        json.loads(previous_inventory_path.read_text(encoding="utf-8"))
        if previous_inventory_path.exists() else {}
    )
    last_import = {
        "editionCount": len(selected),
        "questionCount": imported_question_count,
        "existingCanonicalMatchCount": replaced_question_count,
        "duplicateCanonicalKeyCount": 0,
    }
    if previous_inventory.get("lastImport") and (
        len(selected) == len(EXAMS)
        or (args.merge_existing and replaced_question_count == imported_question_count)
    ):
        last_import = previous_inventory["lastImport"]

    inventory = {
        "schemaVersion": 2,
        "attachedRelevantFileCount": len(exams) * 2 + len(DUPLICATE_FILES) + len(DEFERRED_FILES),
        "processedFileCount": len(exams) * 2,
        "examEditionCount": len(exams),
        "advancedEditionCount": sum(item["examLevel"] == "심화" for item in exams),
        "basicEditionCount": sum(item["examLevel"] == "기본" for item in exams),
        "canonicalQuestionCount": len(records),
        "duplicateFiles": DUPLICATE_FILES,
        "deferredFiles": DEFERRED_FILES,
        "lastImport": last_import,
        "imagePipeline": {
            "revision": IMAGE_REVISION,
            "format": "webp",
            "detectionDpi": DETECTION_DPI,
            "detailDpi": DETAIL_DPI,
            "detailQuality": DETAIL_WEBP_QUALITY,
            "thumbnailWidth": THUMBNAIL_WIDTH,
            "thumbnailQuality": THUMBNAIL_WEBP_QUALITY,
            "detailImageCount": sum(bool(item.get("detailImage")) for item in records),
            "thumbnailImageCount": sum(bool(item.get("thumbnailImage")) for item in records),
            "detailImageBytes": sum(item.get("detailImageBytes", 0) for item in records),
            "thumbnailImageBytes": sum(item.get("thumbnailImageBytes", 0) for item in records),
            "cropValidationPassedCount": sum(
                item.get("cropValidation", {}).get("status") == "passed" for item in records
            ),
        },
        "exams": exams,
    }
    # Keep the previously published hash-named assets until both catalog files
    # point at the newly generated images. This makes an interrupted rebuild
    # leave extra files rather than broken image references.
    atomic_write_text(
        DIST / "official-exam-catalog.json",
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
    )
    js = "/* Generated by scripts/build-official-exams.py from attached official PDFs. */\n"
    js += "globalThis.OFFICIAL_EXAM_SOURCE_RECORDS="
    js += json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    js += ";\n"
    atomic_write_text(DIST / "official-exam-catalog.js", js)
    synchronize_explanation_image_hashes(
        records,
        require_complete_catalog=len(records) == len(EXAMS) * 50,
    )
    image_cleanup = cleanup_generated_images(records)
    inventory["imageCleanup"] = image_cleanup
    atomic_write_text(
        DIST / "official-exam-inventory.json",
        json.dumps(inventory, ensure_ascii=False, indent=2) + "\n",
    )
    print(
        f"WROTE {len(exams)} editions / {len(records)} questions / "
        f"{len(list(DETAIL_IMAGE_ROOT.glob('*.webp')))} detail + "
        f"{len(list(THUMBNAIL_IMAGE_ROOT.glob('*.webp')))} thumbnail images; "
        f"imported {imported_question_count}, matched {replaced_question_count}; "
        f"cleaned {image_cleanup['staleDetailRemoved']} stale detail / "
        f"{image_cleanup['staleThumbnailRemoved']} stale thumbnail / "
        f"{len(image_cleanup['legacyFlatRemoved'])} legacy flat; "
        f"retained {len(image_cleanup['compatibilityFlatRetained'])} live story references",
        flush=True,
    )


if __name__ == "__main__":
    main()

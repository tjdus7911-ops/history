"""Build the canonical official-exam source catalog from user-supplied PDFs.

The PDFs stay outside the repository. This script validates official answer tables,
renders every complete question paper, detects the numbered two-column layout, and
writes compact WebP question crops plus reproducible catalog metadata.
"""

from __future__ import annotations

import argparse
import hashlib
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

EXAMS = [
    (57, 2022, "기본", "57회 한국사_문제지(기본).pdf", "제57회 기본 정답표 업로드용.pdf"),
    (57, 2022, "심화", "57회 한국사_문제지(심화).pdf", "제57회_심화_정답표.pdf"),
    (58, 2022, "기본", "58회 한국사_문제지(기본).pdf", "58회 기본 정답표.pdf"),
    (58, 2022, "심화", "58회 한국사_문제지(심화).pdf", "58회 심화 정답표.pdf"),
    (59, 2022, "심화", "59회 한국사_문제지(심화).pdf", "제59회 심화 정답표(공개용).pdf"),
    (60, 2022, "심화", "60회 한국사_문제지(심화).pdf", "제60회 정답표(심화).pdf"),
    (61, 2022, "기본", "61회 한국사_문제지(기본).pdf", "제61회 한국사능력검정시험 정답표(기본).pdf"),
    (62, 2022, "심화", "62회 한국사능력검정시험 문제지(심화).pdf", "제62회 한국사능력검정시험(심화) 정답표.pdf"),
    (63, 2023, "심화", "63회 한국사_문제지(심화).pdf", "제63회 한국사능력검정시험 심화 정답표(정정).pdf"),
    (64, 2023, "심화", "64회 한국사_문제지(심화).pdf", "제64회 심화 정답표.pdf"),
    (65, 2023, "심화", "제65회 한국사능력검정시험 심화 문제지.pdf", "제65회 한국사능력검정시험 심화 정답표.pdf"),
    (66, 2023, "심화", "66회 한국사_문제지(심화).pdf", "66회 한국사_정답표(심화).pdf"),
    (67, 2023, "기본", "67회 한국사_문제지(기본).pdf", "67회 한국사_정답표(기본).pdf"),
    (68, 2023, "심화", "68회 한국사_문제지(심화).pdf", "68회 한국사_정답표(심화).pdf"),
    (69, 2024, "기본", "69회 한국사 문제지(기본).pdf", "69회 한국사 정답표(기본).pdf"),
    (69, 2024, "심화", "69회 한국사_문제지(심화).pdf", "69회 한국사_정답표(심화).pdf"),
    (70, 2024, "심화", "70회 한국사_문제지(심화).pdf", "70회 한국사_정답지(심화).pdf"),
    (72, 2024, "심화", "제72회 심화 문제지.pdf", "제72회 심화 정답표.pdf"),
    (73, 2025, "기본", "73회 한국사_문제지(기본).pdf", "73회 한국사_답지(기본).pdf"),
    (74, 2025, "심화", "74회 한국사_문제지(심화).pdf", "74회 심화 정답표.pdf"),
    (75, 2025, "기본", "75회 한국사_문제지(기본).pdf", "75회 한국사_답지(기본).pdf"),
    (75, 2025, "심화", "제75회 심화 문제지.pdf", "제75회 심화 정답표.pdf"),
    (76, 2025, "심화", "76회 한국사_문제지(심화).pdf", "76회 한국사_답지(심화)).pdf"),
    (77, 2026, "심화", "77회 한국사_문제지(심화).pdf", "77회 한국사_답지(심화).pdf"),
    (78, 2026, "심화", "78회 한국사_문제지(심화).pdf", "78회 한국사_답지(심화).pdf"),
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
        return min(limit, top + 120)
    return min(limit, top + int(rows[-1]) + 24)


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
                })
    by_number = {item["questionNumber"]: item for item in located}
    if set(by_number) != set(range(1, 51)):
        return []
    return [by_number[number] for number in range(1, 51)]


def location_key(item: dict) -> tuple:
    return item["pageIndex"], 0 if item["column"] == "left" else 1, item["top"]


def ocr_question_headings(pages: list[Image.Image], ocr_engine, visual_candidates: list[dict]) -> list[dict]:
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
                    })
    by_number = {}
    for item in located:
        by_number.setdefault(item["questionNumber"], item)
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
                and abs(item["top"] - known["top"]) <= 24
                for known in known_locations
            )
        ]
        needed = end - start + 1
        if len(possible) < needed:
            neighbours = {number: (item["pageIndex"] + 1, item["column"], item["top"]) for number, item in sorted(by_number.items())}
            raise ValueError(f"OCR question-number verification missing {missing}; only {len(possible)} visual candidates; located={neighbours}")
        chosen = sorted(sorted(possible, key=lambda item: item.get("ink", 0), reverse=True)[:needed], key=location_key)
        for number, candidate in zip(range(start, end + 1), chosen):
            by_number[number] = {"questionNumber": number, **candidate}
        missing = sorted(set(range(1, 51)) - set(by_number))
    return [by_number[number] for number in range(1, 51)]


def build_exam(source_dir: Path, poppler_bin: Path, item: tuple, output_images: bool, ocr_engine=None) -> tuple[list[dict], dict]:
    round_no, year, level, question_name, answer_name = item
    question_path, answer_path = source_dir / question_name, source_dir / answer_name
    if not question_path.exists() or not answer_path.exists():
        raise FileNotFoundError(f"missing attached source: {question_path if not question_path.exists() else answer_path}")
    answers = parse_answers(answer_path, poppler_bin, ocr_engine)
    pages = convert_from_path(
        question_path,
        dpi=120,
        fmt="png",
        thread_count=2,
        poppler_path=str(poppler_bin),
    )
    located = text_question_headings(question_path, pages)
    detection_method = "pdf_text"
    if not located:
        detection_method = "visual_layout"
        visual_candidates = []
        for page_index, page in enumerate(pages):
            for heading in question_headings(page, page_index):
                visual_candidates.append({"pageIndex": page_index, "page": page, **heading})
            visual_candidates.extend(score_heading_candidates(page, page_index))
        if ocr_engine is not None:
            located = ocr_question_headings(pages, ocr_engine, visual_candidates)
            detection_method = "visual_ocr"
        else:
            located = list(visual_candidates)
            for number, location in enumerate(located, start=1):
                location["questionNumber"] = number
    if len(located) != 50:
        per_page = {}
        for entry in located:
            per_page.setdefault(entry["pageIndex"] + 1, []).append((entry["column"], entry["top"]))
        raise ValueError(f"{question_name}: detected {len(located)} question headings, expected 50: {per_page}")

    slug = "advanced" if level == "심화" else "basic"
    records = []
    for location in located:
        number = location["questionNumber"]
        page = location["page"]
        width, height = page.size
        column_locations = [
            item for item in located
            if item["pageIndex"] == location["pageIndex"] and item["column"] == location["column"]
        ]
        column_index = column_locations.index(location)
        following = column_locations[column_index + 1] if column_index + 1 < len(column_locations) else None
        left, right = (
            (int(width * 0.06), int(width * 0.497))
            if location["column"] == "left"
            else (int(width * 0.503), int(width * 0.945))
        )
        top = max(0, location["top"] - 10)
        limit = following["top"] - 12 if following else int(height * 0.925)
        bottom = trim_bottom(page, left, right, top, limit)
        relative_image = f"assets/exams/catalog/{round_no}-{slug}-{number:02d}.webp"
        if output_images:
            crop = page.crop((left, top, right, max(top + 80, bottom)))
            crop.save(DIST / relative_image, "WEBP", quality=76, method=6)
        answer = answers[number]
        era = source_era(number)
        record = {
            "officialQuestionId": f"official-{round_no}-{slug}-{number:02d}",
            "examRound": round_no,
            "examYear": year,
            "examLevel": level,
            "questionNumber": number,
            "answer": answer["answer"],
            "answerLabel": answer["answerLabel"],
            "acceptedAnswers": answer["acceptedAnswers"],
            "points": answer["points"],
            "sourcePdf": question_name,
            "answerPdf": answer_name,
            "questionImage": relative_image,
            "primaryEra": era,
            "concepts": [ERA_LABELS[era]],
            "sourcePage": location["pageIndex"] + 1,
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
        "pageCount": len(pages),
        "answerCount": len(answers),
        "allCorrectQuestions": [number for number, value in answers.items() if value["answer"] is None],
        "questionDetectionMethod": detection_method,
    }
    return records, inventory


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", required=True, type=Path)
    parser.add_argument("--poppler-bin", required=True, type=Path)
    parser.add_argument("--ocr-runtime", type=Path)
    parser.add_argument("--only", help="Optional comma-separated round-level keys, e.g. 57-basic,70-advanced")
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()

    ocr_engine = None
    if args.ocr_runtime:
        sys.path.insert(0, str(args.ocr_runtime))
        from rapidocr_onnxruntime import RapidOCR
        ocr_engine = RapidOCR()

    IMAGE_ROOT.mkdir(parents=True, exist_ok=True)
    records, exams = [], []
    selected = EXAMS
    if args.only:
        requested = set(args.only.split(","))
        selected = [item for item in EXAMS if f"{item[0]}-{'advanced' if item[2] == '심화' else 'basic'}" in requested]
    for item in selected:
        built, inventory = build_exam(args.source_dir, args.poppler_bin, item, not args.validate_only, ocr_engine)
        records.extend(built)
        exams.append(inventory)
        print(f"OK {inventory['examRound']}회 {inventory['examLevel']} {inventory['questionCount']}문항", flush=True)

    keys = [(item["examRound"], item["examLevel"], item["questionNumber"]) for item in records]
    if len(keys) != len(set(keys)):
        raise ValueError("duplicate canonical exam keys generated")
    if len(records) != len(selected) * 50:
        raise ValueError(f"expected {len(selected) * 50} records, got {len(records)}")

    if args.validate_only:
        print(f"VALID {len(exams)} editions / {len(records)} questions", flush=True)
        return

    if len(selected) != len(EXAMS):
        raise ValueError("partial --only runs are validation-only")

    inventory = {
        "schemaVersion": 1,
        "attachedRelevantFileCount": len(EXAMS) * 2 + len(DUPLICATE_FILES) + len(DEFERRED_FILES),
        "processedFileCount": len(EXAMS) * 2,
        "examEditionCount": len(exams),
        "advancedEditionCount": sum(item["examLevel"] == "심화" for item in exams),
        "basicEditionCount": sum(item["examLevel"] == "기본" for item in exams),
        "canonicalQuestionCount": len(records),
        "duplicateFiles": DUPLICATE_FILES,
        "deferredFiles": DEFERRED_FILES,
        "exams": exams,
    }
    (DIST / "official-exam-inventory.json").write_text(
        json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (DIST / "official-exam-catalog.json").write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    js = "/* Generated by scripts/build-official-exams.py from attached official PDFs. */\n"
    js += "globalThis.OFFICIAL_EXAM_SOURCE_RECORDS="
    js += json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    js += ";\n"
    (DIST / "official-exam-catalog.js").write_text(js, encoding="utf-8")
    print(f"WROTE {len(exams)} editions / {len(records)} questions / {len(list(IMAGE_ROOT.glob('*.webp')))} images", flush=True)


if __name__ == "__main__":
    main()

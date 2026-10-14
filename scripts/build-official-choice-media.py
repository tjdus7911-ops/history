"""Build physical question-body and image-choice crops from canonical exam images.

Every output pixel comes from the reviewed canonical detail image, which is a
240-dpi crop of the publisher PDF.  Text-choice questions receive one physical
body crop.  Reviewed image/mixed questions additionally receive one physical
crop per answer choice.  The browser never clips the original sheet with CSS.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from itertools import combinations
from pathlib import Path
from statistics import median

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
CONFIG = ROOT / "config" / "official-choice-media-reviews.json"
CROPS = ROOT / "docs" / "official-exams" / "question-content-crops.json"
OUTPUT = ROOT / "docs" / "official-exams" / "question-choice-media.json"
CONTENT_DIR = DIST / "assets" / "exams" / "catalog" / "content"
CHOICE_DIR = DIST / "assets" / "exams" / "catalog" / "choices"


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_image(path: Path) -> np.ndarray:
    image = cv2.imdecode(np.frombuffer(path.read_bytes(), dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"cannot read canonical image: {path}")
    return image


def encode_webp(image: np.ndarray) -> bytes:
    ok, encoded = cv2.imencode(".webp", image, [cv2.IMWRITE_WEBP_QUALITY, 92])
    if not ok:
        raise ValueError("failed to encode WebP")
    return encoded.tobytes()


def unique_circles(circles: list[dict], distance: float = 9.0) -> list[dict]:
    selected: list[dict] = []
    for circle in sorted(circles, key=lambda item: (item["y"], item["x"])):
        if any(abs(circle["x"] - item["x"]) <= distance and abs(circle["y"] - item["y"]) <= distance for item in selected):
            continue
        selected.append(circle)
    return selected


def hough_circles(image: np.ndarray) -> list[dict]:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    height, width = gray.shape
    raw = cv2.HoughCircles(
        cv2.GaussianBlur(gray, (3, 3), 0), cv2.HOUGH_GRADIENT,
        dp=1.2, minDist=max(22, round(width * 0.019)), param1=110, param2=20,
        minRadius=max(8, round(width * 0.010)), maxRadius=max(19, round(width * 0.020)),
    )
    if raw is None:
        return []
    return unique_circles([
        {"x": float(x), "y": float(y), "radius": float(radius)}
        for x, y, radius in raw[0]
        if y >= height * 0.25 and width * 0.020 <= x <= width * 0.98
        and width * 0.010 <= radius <= width * 0.0205
    ])


def circles_in_band(circles: list[dict], width: int, low: float, high: float) -> list[dict]:
    return [item for item in circles if width * low <= item["x"] <= width * high]


def aligned_rows(circles: list[dict], width: int, bands: list[tuple[float, float]], minimum_columns: int = 2) -> list[dict]:
    banded = [circles_in_band(circles, width, low, high) for low, high in bands]
    anchors = banded[0]
    rows: list[dict] = []
    tolerance = max(10.0, width * 0.011)
    for anchor in anchors:
        points = [anchor]
        for values in banded[1:]:
            match = min(values, key=lambda item: abs(item["y"] - anchor["y"]), default=None)
            if match is not None and abs(match["y"] - anchor["y"]) <= tolerance:
                points.append(match)
        if len(points) < minimum_columns:
            continue
        row_y = median(item["y"] for item in points)
        if any(abs(row_y - row["y"]) <= tolerance * 1.7 for row in rows):
            existing = min(rows, key=lambda row: abs(row["y"] - row_y))
            if len(points) > len(existing["points"]):
                existing.update({"y": row_y, "points": points})
            continue
        rows.append({"y": row_y, "points": points})
    return sorted(rows, key=lambda row: row["y"])


def choose_row_sequence(rows: list[dict], count: int, height: int) -> list[dict]:
    viable = []
    for sequence in combinations(rows, count):
        ys = [row["y"] for row in sequence]
        gaps = [right - left for left, right in zip(ys, ys[1:])]
        if ys[0] < height * 0.30 or any(gap < height * 0.11 for gap in gaps):
            continue
        regularity = 0 if len(gaps) < 2 else max(gaps) - min(gaps)
        trailing = height - ys[-1]
        score = regularity * 0.8 + abs(trailing - (median(gaps) if gaps else height * 0.2)) * 0.12 - ys[-1] * 0.01
        viable.append((score, list(sequence)))
    if not viable:
        raise ValueError(f"could not isolate {count} image-choice rows from {len(rows)} aligned rows")
    return min(viable, key=lambda value: value[0])[1]


def regular_media_layout(question_id: str, image: np.ndarray, crop: dict, expected: int, single_row: bool) -> tuple[int, list[list[int]], list[dict]]:
    height, width = image.shape[:2]
    radius = float(crop.get("choiceMarkerRadius") or width * 0.015)
    guard = max(radius * 2.35, width * 0.027)
    if single_row:
        start = max(1, round(float(crop["choiceStartY"]) - guard))
        rects = [[round(index * width / expected), start, round((index + 1) * width / expected), height] for index in range(expected)]
        return start, rects, [{"y": crop["choiceStartY"], "points": []}]

    circles = hough_circles(image)
    if expected == 4:
        columns, row_count = 2, 2
        rows = aligned_rows(circles, width, [(0.025, 0.115), (0.47, 0.585)])
    elif len(crop.get("markerYs") or []) >= 3 and (
        min(np.diff(sorted(float(value) for value in crop["markerYs"])[-3:])) > height * 0.11
        and max(np.diff(sorted(float(value) for value in crop["markerYs"])[-3:]))
        / min(np.diff(sorted(float(value) for value in crop["markerYs"])[-3:])) < 1.35
    ):
        columns, row_count = 2, 3
        rows = aligned_rows(circles, width, [(0.025, 0.115), (0.47, 0.585)])
    else:
        columns, row_count = 3, 2
        rows = aligned_rows(circles, width, [(0.025, 0.115), (0.30, 0.405), (0.61, 0.735)])
    try:
        selected_rows = choose_row_sequence(rows, row_count, height)
    except ValueError as error:
        audited_ys = sorted(float(value) for value in (crop.get("markerYs") or []))
        if len(audited_ys) >= row_count and all(right - left >= height * 0.11 for left, right in zip(audited_ys[-row_count:], audited_ys[-row_count + 1:])):
            selected_rows = [{"y": value, "points": []} for value in audited_ys[-row_count:]]
        else:
            raise ValueError(f"{question_id}: {error}; markerCount={crop.get('markerCount')}") from error
    row_starts = [max(1, round(row["y"] - guard)) for row in selected_rows]
    rects: list[list[int]] = []
    remaining = expected
    for row_index, y0 in enumerate(row_starts):
        items = min(columns, remaining)
        y1 = row_starts[row_index + 1] if row_index + 1 < len(row_starts) else height
        for column in range(items):
            x0 = round(column * width / columns)
            x1 = round((column + 1) * width / columns)
            rects.append([x0, y0, x1, y1])
        remaining -= items
    if len(rects) != expected:
        raise ValueError(f"{question_id}: expected {expected} choice rectangles, got {len(rects)}")
    return row_starts[0], rects, selected_rows


def page_rect(source: dict, rect: list[int]) -> list[int] | None:
    box = source.get("cropValidation", {}).get("detailQuestionBox")
    if not isinstance(box, list) or len(box) != 4:
        return None
    return [box[0] + rect[0], box[1] + rect[1], box[0] + rect[2], box[1] + rect[3]]


def composite_body(image: np.ndarray, regions: list[list[int]]) -> np.ndarray:
    width = image.shape[1]
    gap, outer = 18, 12
    pieces = [image[y0:y1, x0:x1].copy() for x0, y0, x1, y1 in regions]
    height = outer * 2 + sum(piece.shape[0] for piece in pieces) + gap * max(0, len(pieces) - 1)
    canvas = np.full((height, width, 3), 255, dtype=np.uint8)
    cursor = outer
    for piece in pieces:
        left = max(0, (width - piece.shape[1]) // 2)
        canvas[cursor:cursor + piece.shape[0], left:left + piece.shape[1]] = piece
        cursor += piece.shape[0] + gap
    return canvas


def write_asset(directory: Path, stem: str, image: np.ndarray) -> dict:
    payload = encode_webp(image)
    digest = sha256_bytes(payload)
    filename = f"{stem}.{digest[:12]}.webp"
    path = directory / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists() or path.read_bytes() != payload:
        path.write_bytes(payload)
    return {
        "path": path.relative_to(DIST).as_posix(),
        "width": int(image.shape[1]),
        "height": int(image.shape[0]),
        "sha256": digest,
        "bytes": len(payload),
    }


def verify_payload(payload: dict) -> None:
    if payload.get("schemaVersion") != 1 or len(payload.get("records", [])) != 1800:
        raise ValueError("choice media ledger is incomplete")
    for row in payload["records"]:
        assets = [row["contentImage"], *row.get("choiceMedia", [])]
        for asset in assets:
            path = DIST / asset["path"]
            if not path.exists() or sha256_file(path) != asset["sha256"] or path.stat().st_size != asset["bytes"]:
                raise ValueError(f"stale generated choice asset: {path}")
            image = read_image(path)
            if image.shape[1] != asset["width"] or image.shape[0] != asset["height"]:
                raise ValueError(f"generated choice asset dimensions changed: {path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        if not OUTPUT.exists():
            raise SystemExit(f"missing choice media ledger: {OUTPUT}")
        payload = json.loads(OUTPUT.read_text(encoding="utf-8"))
        verify_payload(payload)
        print(f"OK {len(payload['records'])} physical body crops and {payload['choiceMediaAssetCount']} choice media assets")
        return

    catalog = json.loads((DIST / "official-exam-catalog.json").read_text(encoding="utf-8"))
    crop_ledger = json.loads(CROPS.read_text(encoding="utf-8"))
    crop_by_id = {row["officialQuestionId"]: row for row in crop_ledger["records"]}
    review = json.loads(CONFIG.read_text(encoding="utf-8"))
    image_ids = set(review["imageQuestionIds"])
    mixed_ids = set(review["mixedQuestionIds"])
    media_ids = image_ids | mixed_ids
    single_row_ids = set(review["singleRowQuestionIds"])
    if len(media_ids) != review["mediaChoiceCount"]:
        raise ValueError("reviewed media question count changed")

    records = []
    total_choice_assets = 0
    for index, source in enumerate(catalog, start=1):
        question_id = source["officialQuestionId"]
        crop = crop_by_id[question_id]
        image_path = DIST / source["detailImage"]
        if sha256_file(image_path) != source["detailImageSha256"] or crop["sourceImageSha256"] != source["detailImageSha256"]:
            raise ValueError(f"canonical image hash mismatch: {question_id}")
        image = read_image(image_path)
        height, width = image.shape[:2]
        if [width, height] != [crop["imageWidth"], crop["imageHeight"]]:
            raise ValueError(f"canonical image dimensions changed: {question_id}")
        expected = 4 if source["examLevel"] == "기본" else 5
        presentation = "mixed" if question_id in mixed_ids else "image" if question_id in image_ids else "text"
        choice_rects: list[list[int]] = []
        marker_rows: list[dict] = []
        if presentation == "mixed":
            layout = review["compositeLayouts"][question_id]
            content_regions = layout["bodyRegions"]
            content_image = composite_body(image, content_regions)
            choice_rects = layout["choiceRects"]
        elif presentation == "image":
            manual_layout = review.get("manualImageLayouts", {}).get(question_id)
            if manual_layout:
                content_y = int(manual_layout["contentY"])
                choice_rects = manual_layout["choiceRects"]
            else:
                content_y, choice_rects, marker_rows = regular_media_layout(question_id, image, crop, expected, question_id in single_row_ids)
            content_regions = [[0, 0, width, content_y]]
            content_image = image[:content_y, :].copy()
        else:
            content_y = int(crop["contentCropY"])
            content_regions = [[0, 0, width, content_y]]
            content_image = image[:content_y, :].copy()

        content_asset = write_asset(CONTENT_DIR, f"{question_id}-content", content_image)
        content_asset["sourceRects"] = content_regions
        content_asset["pdfPageRects240Dpi"] = [value for rect in content_regions if (value := page_rect(source, rect)) is not None]
        choice_assets = []
        for choice_index, rect in enumerate(choice_rects):
            x0, y0, x1, y1 = rect
            if not (0 <= x0 < x1 <= width and 0 <= y0 < y1 <= height):
                raise ValueError(f"invalid choice rect {question_id} #{choice_index + 1}: {rect}")
            asset = write_asset(CHOICE_DIR, f"{question_id}-choice-{choice_index + 1}", image[y0:y1, x0:x1].copy())
            asset["choiceIndex"] = choice_index
            asset["sourceRect"] = rect
            asset["pdfPageRect240Dpi"] = page_rect(source, rect)
            choice_assets.append(asset)
        if presentation != "text" and len(choice_assets) != expected:
            raise ValueError(f"missing image choices: {question_id}")
        total_choice_assets += len(choice_assets)
        records.append({
            "officialQuestionId": question_id,
            "presentation": presentation,
            "sourceDetailImage": source["detailImage"],
            "sourceDetailSha256": source["detailImageSha256"],
            "sourcePage": source["sourcePage"],
            "detailDpi": source.get("cropValidation", {}).get("detailDpi"),
            "contentImage": content_asset,
            "choiceMedia": choice_assets,
            **({"markerRows": [{"y": round(row["y"], 1), "points": [[round(point["x"], 1), round(point["y"], 1)] for point in row["points"]]} for row in marker_rows]} if marker_rows else {}),
        })
        if index % 100 == 0 or index == len(catalog):
            print(f"built {index}/{len(catalog)}; choice media {total_choice_assets}", flush=True)

    counts = {kind: sum(row["presentation"] == kind for row in records) for kind in ("text", "image", "mixed")}
    if counts != {"text": 1687, "image": 105, "mixed": 8}:
        raise ValueError(f"review classification changed: {counts}")
    payload = {
        "schemaVersion": 1,
        "method": "physical-pdf-coordinate-crops-v1",
        "canonicalQuestionCount": len(records),
        "visualCandidateCount": review["visualCandidateCount"],
        "presentationCounts": counts,
        "contentImageAssetCount": len(records),
        "choiceMediaAssetCount": total_choice_assets,
        "records": records,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    verify_payload(payload)
    print(f"WROTE {len(records)} physical body crops and {total_choice_assets} choice media assets")


if __name__ == "__main__":
    main()

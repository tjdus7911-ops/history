"""Render before/after QA sheets for changed official question body crops.

Red is the current crop boundary and green is the candidate boundary.  The
source shown behind both lines is the immutable detail image rendered from the
official PDF, so reviewers can confirm that body material remains above the
new cut and printed answer choices remain below it.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]


def read_image(path: Path) -> np.ndarray:
    image = cv2.imdecode(np.frombuffer(path.read_bytes(), dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"cannot read image: {path}")
    return image


def render_card(source: dict, old: dict, new: dict) -> np.ndarray:
    width, height = 360, 470
    card = np.full((height, width, 3), 250, dtype=np.uint8)
    image = read_image(ROOT / "dist" / source["detailImage"])
    available_height = 405
    scale = min((width - 20) / image.shape[1], available_height / image.shape[0])
    resized = cv2.resize(
        image,
        (max(1, round(image.shape[1] * scale)), max(1, round(image.shape[0] * scale))),
        interpolation=cv2.INTER_AREA,
    )
    x = (width - resized.shape[1]) // 2
    y = 42
    card[y : y + resized.shape[0], x : x + resized.shape[1]] = resized
    old_y = y + round(old["contentCropY"] * scale)
    new_y = y + round(new["contentCropY"] * scale)
    cv2.line(card, (x, old_y), (x + resized.shape[1], old_y), (40, 55, 215), 3)
    cv2.line(card, (x, new_y), (x + resized.shape[1], new_y), (45, 175, 65), 3)
    title = source["officialQuestionId"].replace("official-", "")
    delta = old["contentCropY"] - new["contentCropY"]
    cv2.putText(card, title, (10, 19), cv2.FONT_HERSHEY_SIMPLEX, .48, (28, 35, 42), 1, cv2.LINE_AA)
    cv2.putText(
        card,
        f"OLD {old['contentCropY']}  NEW {new['contentCropY']}  DELTA {delta:+d}",
        (10, 36),
        cv2.FONT_HERSHEY_SIMPLEX,
        .40,
        (45, 55, 65),
        1,
        cv2.LINE_AA,
    )
    cv2.rectangle(card, (0, 0), (width - 1, height - 1), (205, 210, 214), 1)
    return card


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--baseline", type=Path, required=True)
    parser.add_argument("--candidate", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    catalog = json.loads((ROOT / "dist" / "official-exam-catalog.json").read_text(encoding="utf-8"))
    source_by_id = {row["officialQuestionId"]: row for row in catalog}
    old_payload = json.loads(args.baseline.read_text(encoding="utf-8"))
    new_payload = json.loads(args.candidate.read_text(encoding="utf-8"))
    old_by_id = {row["officialQuestionId"]: row for row in old_payload["records"]}
    new_by_id = {row["officialQuestionId"]: row for row in new_payload["records"]}
    changed = [
        question_id
        for question_id, new in new_by_id.items()
        if question_id in old_by_id and old_by_id[question_id]["contentCropY"] != new["contentCropY"]
    ]
    changed.sort()
    args.output.mkdir(parents=True, exist_ok=True)
    cards = [render_card(source_by_id[item], old_by_id[item], new_by_id[item]) for item in changed]
    columns, rows = 4, 3
    page_size = columns * rows
    for sheet_index, start in enumerate(range(0, len(cards), page_size), 1):
        sheet = np.full((rows * 470, columns * 360, 3), 235, dtype=np.uint8)
        for offset, card in enumerate(cards[start : start + page_size]):
            row, column = divmod(offset, columns)
            sheet[row * 470 : (row + 1) * 470, column * 360 : (column + 1) * 360] = card
        path = args.output / f"sheet-{sheet_index:02d}.jpg"
        ok, encoded = cv2.imencode(".jpg", sheet, [cv2.IMWRITE_JPEG_QUALITY, 92])
        if not ok:
            raise ValueError(f"cannot encode {path}")
        path.write_bytes(encoded.tobytes())

    summary = {
        "canonicalQuestionCount": len(source_by_id),
        "candidateDetectedQuestionCount": new_payload.get("detectedQuestionCount"),
        "candidateFailureCount": new_payload.get("failureCount"),
        "candidateFailures": new_payload.get("failures", []),
        "changedQuestionCount": len(changed),
        "shortenedCropCount": sum(
            old_by_id[item]["contentCropY"] > new_by_id[item]["contentCropY"] for item in changed
        ),
        "extendedCropCount": sum(
            old_by_id[item]["contentCropY"] < new_by_id[item]["contentCropY"] for item in changed
        ),
        "changedQuestionIds": changed,
        "sheetCount": (len(cards) + page_size - 1) // page_size,
        "legend": {"oldBoundary": "red", "candidateBoundary": "green"},
    }
    (args.output / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"WROTE {summary['sheetCount']} sheets for {len(changed)} changed crops")


if __name__ == "__main__":
    main()

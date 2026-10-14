"""Render review contact sheets for every image/mixed official question.

Each card shows the physically extracted question body followed by every
ordered choice crop.  The sheets are a manual QA companion to the hash and
count checks in tests/official-choice-media-assets-test.cjs.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "docs" / "official-exams" / "question-choice-media.json"


def read_image(relative_path: str) -> np.ndarray:
    path = ROOT / "dist" / relative_path
    image = cv2.imdecode(np.frombuffer(path.read_bytes(), dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"cannot read {path}")
    return image


def contain(image: np.ndarray, width: int, height: int) -> np.ndarray:
    scale = min(width / image.shape[1], height / image.shape[0])
    resized = cv2.resize(image, (max(1, round(image.shape[1] * scale)), max(1, round(image.shape[0] * scale))), interpolation=cv2.INTER_AREA)
    canvas = np.full((height, width, 3), 255, dtype=np.uint8)
    x = (width - resized.shape[1]) // 2
    y = (height - resized.shape[0]) // 2
    canvas[y:y + resized.shape[0], x:x + resized.shape[1]] = resized
    return canvas


def render_card(record: dict) -> np.ndarray:
    width, height = 500, 570
    card = np.full((height, width, 3), 248, dtype=np.uint8)
    cv2.rectangle(card, (1, 1), (width - 2, height - 2), (210, 216, 220), 2)
    title = f"{record['officialQuestionId']}  [{record['presentation']}]"
    cv2.putText(card, title, (13, 25), cv2.FONT_HERSHEY_SIMPLEX, .48, (32, 44, 52), 1, cv2.LINE_AA)
    body = contain(read_image(record["contentImage"]["path"]), 474, 200)
    card[37:237, 13:487] = body
    cv2.putText(card, "BODY", (17, 54), cv2.FONT_HERSHEY_SIMPLEX, .42, (45, 95, 150), 1, cv2.LINE_AA)
    choice_width, choice_height = 232, 96
    for index, item in enumerate(record["choiceMedia"]):
        row, column = divmod(index, 2)
        x, y = 13 + column * 242, 255 + row * 101
        card[y:y + choice_height, x:x + choice_width] = contain(read_image(item["path"]), choice_width, choice_height)
        cv2.putText(card, str(index + 1), (x + 5, y + 15), cv2.FONT_HERSHEY_SIMPLEX, .46, (175, 58, 48), 1, cv2.LINE_AA)
    return card


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT / "tmp" / "official-choice-media-qa")
    args = parser.parse_args()
    payload = json.loads(LEDGER.read_text(encoding="utf-8"))
    records = [record for record in payload["records"] if record["presentation"] != "text"]
    args.output.mkdir(parents=True, exist_ok=True)
    cards = [render_card(record) for record in records]
    columns, rows = 3, 3
    for sheet_index, start in enumerate(range(0, len(cards), columns * rows), 1):
        sheet = np.full((rows * 570, columns * 500, 3), 235, dtype=np.uint8)
        for offset, card in enumerate(cards[start:start + columns * rows]):
            row, column = divmod(offset, columns)
            sheet[row * 570:(row + 1) * 570, column * 500:(column + 1) * 500] = card
        path = args.output / f"sheet-{sheet_index:02d}.jpg"
        ok, encoded = cv2.imencode(".jpg", sheet, [cv2.IMWRITE_JPEG_QUALITY, 91])
        if not ok:
            raise ValueError(f"cannot encode {path}")
        path.write_bytes(encoded.tobytes())
    summary = {
        "reviewedQuestionCount": len(records),
        "imageQuestionCount": sum(record["presentation"] == "image" for record in records),
        "mixedQuestionCount": sum(record["presentation"] == "mixed" for record in records),
        "choiceMediaCount": sum(len(record["choiceMedia"]) for record in records),
        "sheetCount": (len(cards) + columns * rows - 1) // (columns * rows),
    }
    (args.output / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"WROTE {summary['sheetCount']} sheets for {summary['reviewedQuestionCount']} media questions")


if __name__ == "__main__":
    main()

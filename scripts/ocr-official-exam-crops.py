"""Extract Korean text evidence from canonical official-question crops.

The generated JSON is an intermediate input for build-official-explanations.py;
it is intentionally kept outside dist. RapidOCR 3.9+ supplies the Korean
recognition model while the canonical catalog remains the source of question IDs.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from rapidocr import LangRec, ModelType, OCRVersion, RapidOCR


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


def parse_only(value: str | None) -> set[str]:
    return {item.strip() for item in (value or "").split(",") if item.strip()}


def edition_key(record: dict) -> str:
    slug = "advanced" if record["examLevel"] == "심화" else "basic"
    return f"{record['examRound']}-{slug}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--only", help="Comma-separated edition keys, such as 61-advanced,79-basic")
    args = parser.parse_args()

    selected = parse_only(args.only)
    catalog = json.loads((DIST / "official-exam-catalog.json").read_text(encoding="utf-8"))
    rows = [record for record in catalog if not selected or edition_key(record) in selected]
    if selected and {edition_key(record) for record in rows} != selected:
        missing = selected - {edition_key(record) for record in rows}
        raise ValueError(f"unknown edition keys: {sorted(missing)}")

    engine = RapidOCR(
        params={
            "Rec.lang_type": LangRec.KOREAN,
            "Rec.model_type": ModelType.MOBILE,
            "Rec.ocr_version": OCRVersion.PPOCRV5,
        }
    )
    output = []
    for index, record in enumerate(rows, start=1):
        image_path = DIST / record["questionImage"]
        result = engine(image_path)
        lines = []
        if result.boxes is not None and result.txts is not None and result.scores is not None:
            for box, text, score in zip(result.boxes, result.txts, result.scores):
                token = str(text).strip().split(maxsplit=1)[0] if str(text).strip() else ""
                lines.append({
                    "text": str(text).strip(),
                    "confidence": round(float(score), 6),
                    "x": round(float(min(point[0] for point in box)), 3),
                    "y": round(float(min(point[1] for point in box)), 3),
                    "words": [{"text": token}],
                })
        output.append({
            "file": image_path.name,
            "officialQuestionId": record["officialQuestionId"],
            "lines": lines,
        })
        if index % 25 == 0 or index == len(rows):
            print(f"OCR {index}/{len(rows)}", flush=True)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"WROTE {len(output)} OCR records to {args.output}", flush=True)


if __name__ == "__main__":
    main()

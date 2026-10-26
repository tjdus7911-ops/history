"""Export source-text evidence for canonical question crops from the official PDF text layer.

Newer official PDFs carry an exact text layer, so this produces rows in the same schema
as scripts/ocr-official-exam-crops.py (lines with text, x, y in detail-image pixels) but
with the publisher's own characters instead of recognised ones (confidence 1.0,
"textSource": "pdf-text-layer"). Used when the OCR model is unavailable or for editions
whose PDF text layer is complete.

Usage: python scripts/extract-official-pdf-text-lines.py --source-dir <pdf dir> --only 80-advanced --output <json>
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
POINTS_PER_INCH = 72


def edition_key(record: dict) -> str:
    return f"{record['examRound']}-{'advanced' if record['examLevel'] == '심화' else 'basic'}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", required=True, type=Path)
    parser.add_argument("--only", required=True, help="Comma-separated edition keys, such as 80-advanced")
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    selected = {item.strip() for item in args.only.split(",") if item.strip()}
    catalog = json.loads((DIST / "official-exam-catalog.json").read_text(encoding="utf-8"))
    rows = [record for record in catalog if edition_key(record) in selected]
    if {edition_key(record) for record in rows} != selected:
        raise ValueError(f"unknown edition keys: {sorted(selected - {edition_key(r) for r in rows})}")
    output = []
    pdfs: dict[str, pdfplumber.PDF] = {}
    try:
        for record in rows:
            validation = record["cropValidation"]
            if validation.get("sharedSourceIncluded"):
                raise ValueError(f"{record['officialQuestionId']}: composite crops need manual evidence")
            pdf = pdfs.setdefault(record["sourcePdf"], pdfplumber.open(args.source_dir / record["sourcePdf"]))
            page = pdf.pages[record["sourcePage"] - 1]
            scale = validation["detailDpi"] / POINTS_PER_INCH
            left, top, right, bottom = validation["detailQuestionBox"]
            region = page.crop((left / scale, top / scale, right / scale, bottom / scale))
            lines = []
            for line in region.extract_text_lines(layout=False, strip=True, return_chars=False):
                text = " ".join(line["text"].replace("‌", " ").split())
                if not text:
                    continue
                lines.append({
                    "text": text,
                    "confidence": 1.0,
                    "x": round(line["x0"] * scale - left, 3),
                    "y": round(line["top"] * scale - top, 3),
                    "words": [{"text": text.split(maxsplit=1)[0]}],
                })
            image_path = DIST / record["detailImage"]
            output.append({
                "file": image_path.name,
                "officialQuestionId": record["officialQuestionId"],
                "imageSha256": hashlib.sha256(image_path.read_bytes()).hexdigest(),
                "textSource": "pdf-text-layer",
                "lines": lines,
            })
    finally:
        for pdf in pdfs.values():
            pdf.close()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"WROTE {len(output)} PDF text-layer rows to {args.output}")


if __name__ == "__main__":
    main()

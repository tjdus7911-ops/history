"""Extract Korean text evidence from canonical official-question crops.

The generated JSON is an intermediate input for build-official-explanations.py;
it is intentionally kept outside dist. RapidOCR 3.9+ supplies the Korean
recognition model while the canonical catalog remains the source of question IDs.
"""

from __future__ import annotations

import argparse
from concurrent.futures import ProcessPoolExecutor, as_completed
import hashlib
import json
import os
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
_OCR_ENGINE: Any | None = None


def parse_only(value: str | None) -> set[str]:
    return {item.strip() for item in (value or "").split(",") if item.strip()}


def edition_key(record: dict) -> str:
    slug = "advanced" if record["examLevel"] == "심화" else "basic"
    return f"{record['examRound']}-{slug}"


def build_engine() -> Any:
    """Create one Korean OCR engine inside the process that will use it."""
    from rapidocr import LangRec, ModelType, OCRVersion, RapidOCR

    return RapidOCR(
        params={
            "Rec.lang_type": LangRec.KOREAN,
            "Rec.model_type": ModelType.MOBILE,
            "Rec.ocr_version": OCRVersion.PPOCRV5,
        }
    )


def initialize_worker() -> None:
    """ProcessPool initializer: load the model exactly once in each worker."""
    global _OCR_ENGINE
    _OCR_ENGINE = build_engine()


def edition_question_chunks(
    indexed_rows: list[tuple[int, dict]], worker_count: int
) -> list[list[tuple[int, dict]]]:
    """Split each edition into ordered question chunks without crossing editions."""
    editions: list[list[tuple[int, dict]]] = []
    current: list[tuple[int, dict]] = []
    current_key = ""
    for indexed_row in indexed_rows:
        key = edition_key(indexed_row[1])
        if current and key != current_key:
            editions.append(current)
            current = []
        current_key = key
        current.append(indexed_row)
    if current:
        editions.append(current)

    chunks: list[list[tuple[int, dict]]] = []
    for edition_rows in editions:
        chunk_size = max(1, (len(edition_rows) + worker_count - 1) // worker_count)
        chunks.extend(
            edition_rows[start : start + chunk_size]
            for start in range(0, len(edition_rows), chunk_size)
        )
    return chunks


def ocr_record(record: dict) -> dict:
    if _OCR_ENGINE is None:
        raise RuntimeError("OCR worker was not initialized")

    image_path = DIST / record["questionImage"]
    result = _OCR_ENGINE(image_path)
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
    return {
        "file": image_path.name,
        "officialQuestionId": record["officialQuestionId"],
        "imageSha256": hashlib.sha256(image_path.read_bytes()).hexdigest(),
        "lines": lines,
    }


def ocr_chunk(indexed_rows: list[tuple[int, dict]]) -> list[tuple[int, dict]]:
    return [(index, ocr_record(record)) for index, record in indexed_rows]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--only", help="Comma-separated edition keys, such as 61-advanced,79-basic")
    parser.add_argument(
        "--workers",
        type=int,
        default=1,
        help="OCR worker processes (default: 1; each worker loads RapidOCR once)",
    )
    args = parser.parse_args()

    if args.workers < 1:
        parser.error("--workers must be at least 1")

    selected = parse_only(args.only)
    catalog = json.loads((DIST / "official-exam-catalog.json").read_text(encoding="utf-8"))
    rows = [record for record in catalog if not selected or edition_key(record) in selected]
    if selected and {edition_key(record) for record in rows} != selected:
        missing = selected - {edition_key(record) for record in rows}
        raise ValueError(f"unknown edition keys: {sorted(missing)}")
    if not rows:
        raise ValueError("canonical catalog contains no OCR rows")

    indexed_rows = list(enumerate(rows))
    worker_count = min(args.workers, len(rows), os.cpu_count() or args.workers)
    chunks = edition_question_chunks(indexed_rows, worker_count)
    output_by_index: dict[int, dict] = {}
    completed = 0

    if worker_count == 1:
        initialize_worker()
        for chunk in chunks:
            for index, row in ocr_chunk(chunk):
                output_by_index[index] = row
            completed += len(chunk)
            print(f"OCR {completed}/{len(rows)}", flush=True)
    else:
        with ProcessPoolExecutor(
            max_workers=worker_count,
            initializer=initialize_worker,
        ) as executor:
            futures = {executor.submit(ocr_chunk, chunk): len(chunk) for chunk in chunks}
            for future in as_completed(futures):
                for index, row in future.result():
                    output_by_index[index] = row
                completed += futures[future]
                print(f"OCR {completed}/{len(rows)}", flush=True)

    if len(output_by_index) != len(rows):
        raise RuntimeError(
            f"OCR output count mismatch: expected {len(rows)}, got {len(output_by_index)}"
        )
    output = [output_by_index[index] for index in range(len(rows))]

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"WROTE {len(output)} OCR records to {args.output}", flush=True)


if __name__ == "__main__":
    main()

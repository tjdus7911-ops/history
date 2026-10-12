"""Validate and publish official per-edition pass-rate records."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "official-exams" / "round-statistics.json"
CATALOG = ROOT / "dist" / "official-exam-catalog.json"
OUTPUT_JSON = ROOT / "dist" / "official-exam-statistics.json"
OUTPUT_JS = ROOT / "dist" / "official-exam-statistics.js"


def edition_key(row: dict) -> str:
    return f"{row['examRound']}-{'advanced' if row['examLevel'] == '심화' else 'basic'}"


def build() -> dict:
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    expected = {edition_key(row) for row in catalog}
    records = source["records"]
    unavailable = source["unavailableEditions"]
    by_edition = {}
    for row in records:
        key = edition_key(row)
        if row["key"] != key or key in by_edition:
            raise ValueError(f"invalid or duplicate statistics key: {row['key']}")
        if row["verificationStatus"] not in {"OFFICIAL_VERIFIED", "OFFICIAL_VERIFIED_WITH_NOTE"}:
            raise ValueError(f"unverified record must not be published as a rate: {key}")
        if not (0 <= float(row["passRate"]) <= 100) or row["passRateRaw"] != f"{float(row['passRate']):.2f}":
            raise ValueError(f"invalid official rate precision: {key}")
        if row.get("examinees") is not None:
            computed = round(row["certified"] / row["examinees"] * 100, 2)
            if abs(computed - float(row["passRate"])) > 0.01:
                raise ValueError(f"counts do not reproduce official rate for {key}: {computed}")
        by_edition[key] = {**row, "sourceLabel": source["publisher"]}
    unavailable_keys = {row["key"] for row in unavailable}
    if set(by_edition) | unavailable_keys != expected:
        raise ValueError(f"statistics coverage mismatch: missing={sorted(expected - set(by_edition) - unavailable_keys)} extra={sorted((set(by_edition) | unavailable_keys) - expected)}")
    return {
        "schemaVersion": source["schemaVersion"],
        "sourceLabel": source["publisher"],
        "byEdition": by_edition,
        "unavailableEditions": unavailable,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    payload = build()
    json_text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    js_text = "globalThis.OFFICIAL_EXAM_STATISTICS=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    if args.check:
        if OUTPUT_JSON.read_text(encoding="utf-8") != json_text or OUTPUT_JS.read_text(encoding="utf-8") != js_text:
            raise SystemExit("official exam statistics artifacts are stale; run scripts/build-official-exam-statistics.py")
        return
    OUTPUT_JSON.write_text(json_text, encoding="utf-8")
    OUTPUT_JS.write_text(js_text, encoding="utf-8")
    print(f"published {len(payload['byEdition'])} official rates; {len(payload['unavailableEditions'])} unavailable editions")


if __name__ == "__main__":
    main()

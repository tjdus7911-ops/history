"""Download the canonical official K-History exam PDFs from the publisher.

The source PDFs remain outside the repository. File IDs are reviewed in
docs/official-exams/source-downloads.json, while local filenames are read from
the EXAMS constant in build-official-exams.py so the two scripts cannot drift.
"""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
from pathlib import Path
import urllib.request


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs" / "official-exams" / "source-downloads.json"
BUILDER = ROOT / "scripts" / "build-official-exams.py"


def load_exams() -> dict[str, tuple]:
    tree = ast.parse(BUILDER.read_text(encoding="utf-8"))
    value = next(
        node.value
        for node in tree.body
        if isinstance(node, ast.Assign)
        and any(isinstance(target, ast.Name) and target.id == "EXAMS" for target in node.targets)
    )
    exams = ast.literal_eval(value)
    return {
        f"{round_no}-{'advanced' if level == '심화' else 'basic'}": item
        for item in exams
        for round_no, _year, level, _question_name, _answer_name in (item,)
    }


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def download(url: str, target: Path, force: bool) -> None:
    if target.exists() and target.stat().st_size > 1024 and not force:
        return
    request = urllib.request.Request(url, headers={"User-Agent": "history-study-source-builder/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        payload = response.read()
    if not payload.startswith(b"%PDF-"):
        raise ValueError(f"official download did not return a PDF: {url}")
    target.write_bytes(payload)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--only", help="Comma-separated edition keys such as 79-advanced,79-basic")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    exams = load_exams()
    requested = set(args.only.split(",")) if args.only else set(exams)
    manifest_rows = {row["key"]: row for row in manifest["editions"]}
    if requested - set(exams) or requested - set(manifest_rows):
        raise ValueError(f"unknown or unreviewed edition keys: {sorted(requested - set(exams) | requested - set(manifest_rows))}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    result = []
    template = manifest["downloadUrlTemplate"]
    for key in sorted(requested, key=lambda value: (int(value.split("-")[0]), value.endswith("advanced"))):
        round_no, year, level, question_name, answer_name = exams[key]
        row = manifest_rows[key]
        question_path = args.output_dir / question_name
        answer_path = args.output_dir / answer_name
        download(template.format(fileId=row["questionFileId"]), question_path, args.force)
        download(template.format(fileId=row["answerFileId"]), answer_path, args.force)
        result.append({
            "key": key,
            "examRound": round_no,
            "examYear": year,
            "examLevel": level,
            "postUrl": f"https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno={row['postId']}",
            "questionFile": question_name,
            "questionBytes": question_path.stat().st_size,
            "questionSha256": sha256(question_path),
            "answerFile": answer_name,
            "answerBytes": answer_path.stat().st_size,
            "answerSha256": sha256(answer_path),
        })
        print(f"verified {key}: {question_path.stat().st_size:,} B + {answer_path.stat().st_size:,} B")

    report_path = args.output_dir / "download-report.json"
    report_path.write_text(json.dumps({"publisher": manifest["publisher"], "editions": result}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {report_path}")


if __name__ == "__main__":
    main()

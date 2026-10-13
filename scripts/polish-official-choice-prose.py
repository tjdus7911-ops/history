"""Apply reviewed prose edits without rebuilding questions, OCR, or evidence metadata."""
from __future__ import annotations
import argparse
import copy
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("explanation_builder", ROOT / "scripts/build-official-explanations.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)

def render(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    detail_path = ROOT / "dist/official-exam-explanations.json"
    payload = json.loads(detail_path.read_text(encoding="utf-8"))
    supplemental = json.loads((ROOT / "config/official-choice-prose-corrections.json").read_text(encoding="utf-8")).get("supplementalRecords", {})
    for question_id, choices in supplemental.items():
        for choice in choices:
            if not builder.complete_prose_sentence(choice["meaning"]) or builder.prose_sentence_count(choice["meaning"]) != 1:
                raise ValueError(f"incomplete supplemental summary {question_id}")
            if not all(builder.complete_prose_sentence(s) for s in builder.sentence_parts(choice["judgmentReason"])):
                raise ValueError(f"incomplete supplemental judgment {question_id}")
    baseline = copy.deepcopy(payload["records"])
    overrides = builder.load_choice_prose_corrections()
    found = set()
    summary_count = reason_count = 0
    for record in payload["records"]:
        question_id = record["officialQuestionId"]
        for choice in record["choiceExplanations"]:
            index = str(choice["choiceIndex"])
            correction = overrides.get(question_id, {}).get(index, {})
            if correction:
                found.add((question_id, index))
            for field, expected_key in (("meaning", "expectedMeaning"), ("judgmentReason", "expectedJudgmentReason")):
                if field not in correction:
                    continue
                if choice[field] not in (correction[expected_key], correction[field]):
                    raise ValueError(f"stale correction {question_id}:{index}:{field}")
                choice[field] = correction[field]
                if field == "meaning": summary_count += 1
                else: reason_count += 1
            summary = choice["meaning"]
            if not builder.complete_prose_sentence(summary) or builder.prose_sentence_count(summary) != 1 or "\n" in summary:
                raise ValueError(f"incomplete summary {question_id}:{index}: {summary}")
            reasons = builder.sentence_parts(choice["judgmentReason"])
            if len(reasons) not in (1, 2) or not all(builder.complete_prose_sentence(s) for s in reasons):
                raise ValueError(f"incomplete judgment {question_id}:{index}")
            if summary == choice["judgmentReason"]:
                raise ValueError(f"duplicate summary {question_id}:{index}")
    expected = {(qid, index) for qid, choices in overrides.items() for index in choices}
    if found != expected:
        raise ValueError(f"unknown correction keys: {expected - found}")
    # Strict allowlist: even other explanation and provenance fields stay intact.
    for old, new in zip(baseline, payload["records"]):
        restored = copy.deepcopy(new)
        for before, after in zip(old["choiceExplanations"], restored["choiceExplanations"]):
            after["meaning"] = before["meaning"]
            after["judgmentReason"] = before["judgmentReason"]
        if old != restored:
            raise ValueError("non-prose data changed")
    qa = payload["qa"]
    qa["choiceSummaryCompleteSentenceViolationCount"] = 0
    qa["choiceJudgmentCompleteSentenceViolationCount"] = 0
    qa["fullRecordJsonBytes"] = len(json.dumps(payload["records"], ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    qa["initialCoreRecordReductionPercent"] = round((1 - qa["initialCoreRecordJsonBytes"] / qa["fullRecordJsonBytes"]) * 100, 1)
    bootstrap_path = ROOT / "dist/official-exam-explanations.js"
    bootstrap = bootstrap_path.read_text(encoding="utf-8")
    prefix, meta_text = bootstrap.split("globalThis.OFFICIAL_EXAM_EXPLANATION_META=", 1)
    meta = json.loads(meta_text.split(";", 1)[0])
    meta["qa"] = qa
    inventory_path = ROOT / "dist/official-exam-inventory.json"
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    inventory["explanationQa"] = qa
    outputs = {detail_path: render(payload), inventory_path: render(inventory), bootstrap_path: prefix + "globalThis.OFFICIAL_EXAM_EXPLANATION_META=" + json.dumps(meta, ensure_ascii=False, separators=(",", ":")) + ";\n" + "globalThis.OFFICIAL_SUPPLEMENTAL_CHOICE_PROSE=" + json.dumps(supplemental, ensure_ascii=False, separators=(",", ":")) + ";\n"}
    for file, text in outputs.items():
        if args.check:
            if file.read_text(encoding="utf-8") != text:
                raise ValueError(f"stale choice prose output: {file.name}")
        else:
            file.write_text(text, encoding="utf-8")
    print(f"PASS: {payload['canonicalChoiceCount']} complete summaries; {summary_count} reviewed summaries, {reason_count} reviewed judgments; question/evidence data preserved")

if __name__ == "__main__":
    main()

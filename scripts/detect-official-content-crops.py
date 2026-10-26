"""Detect where answer choices begin in canonical official-exam images.

The source images are intentionally kept outside the application branch.  Run
this script only in the authoring workspace after restoring the immutable exam
assets.  It detects the printed circled choice markers and writes a small,
reviewable crop ledger that the web build can consume without shipping the
original choice pixels.
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
DEFAULT_OUTPUT = ROOT / "docs" / "official-exams" / "question-content-crops.json"

# This basic-exam item prints all four answers inside illustrated speech
# bubbles, so there is no terminal marker row to infer.  The reviewed boundary
# retains the teacher prompt and removes the first answer label and everything
# below it.
MANUAL_FIRST_CHOICE_MARKERS = {
    # Source illustrations in these questions contain several circled or
    # circular shapes before a separate portrait/photo option grid.  Keep the
    # complete source illustration and cut at the reviewed first option row.
    "official-67-basic-05": {"y": 1080.0, "radius": 18.0},
    "official-73-basic-11": {"y": 800.0, "radius": 18.0},
    "official-73-basic-14": {"y": 1065.0, "radius": 18.0},
    # 80회 심화 21번은 태블릿 화면 속 붉은 표시를, 47번은 겹친 종이 그림의
    # 가로선을 선지로 오인했다. 원본에서 확인한 ①의 위치로 고정한다.
    "official-80-advanced-21": {"y": 935.0, "radius": 16.0},
    "official-80-advanced-47": {"y": 1076.0, "radius": 16.0},
    # The portrait options are a single image row and one printed marker is
    # partially merged with its photo edge, so Hough detection sees only three.
    # This reviewed boundary preserves the full classroom illustration.
    "official-75-basic-14": {"y": 769.0, "radius": 18.0},
    "official-75-advanced-18": {"y": 935.0, "radius": 18.0},
    "official-78-advanced-14": {"y": 947.0, "radius": 18.0},
    "official-79-basic-16": {"y": 399.0, "radius": 14.0},
}

# These source layouts contain numbered rows inside the question material.
# Circle detection cannot distinguish those rows from answer markers, so the
# reviewed body boundary is stored directly.  The second item is already a
# body-only source crop and must be retained through its final pixel row.
MANUAL_CONTENT_CROPS = {
    "official-64-advanced-49": 860,
    "official-71-advanced-02": 651,
}


def evenly_spaced(values: list[float], tolerance: float = 0.24) -> bool:
    """Return true when printed option columns form a regular row."""
    if len(values) < 3:
        return True
    gaps = [right - left for left, right in zip(values, values[1:])]
    typical = median(gaps)
    return typical > 0 and max(abs(gap - typical) for gap in gaps) <= typical * tolerance


def regular_row_subset(circles: list[dict], count: int, width: int) -> list[dict] | None:
    """Choose printed option markers even when nearby parenthesis also look circular."""
    viable = []
    for subset in combinations(sorted(circles, key=lambda item: item["x"]), count):
        items = list(subset)
        xs = [item["x"] for item in items]
        ys = [item["y"] for item in items]
        radii = [item["radius"] for item in items]
        if (
            not width * 0.030 <= xs[0] <= width * 0.130
            or xs[-1] - xs[0] < width * 0.55
            or not evenly_spaced(xs, tolerance=0.30)
            or max(ys) - min(ys) > width * 0.009
            or max(radii) - min(radii) > width * 0.009
        ):
            continue
        gaps = [right - left for left, right in zip(xs, xs[1:])]
        typical = median(gaps)
        regularity = sum(abs(gap - typical) for gap in gaps) / typical
        score = regularity + (max(ys) - min(ys)) / width + abs(xs[0] / width - 0.07)
        viable.append((score, items))
    return min(viable, key=lambda value: value[0])[1] if viable else None


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def unique_circles(circles: list[dict], distance: float = 10.0) -> list[dict]:
    selected: list[dict] = []
    for circle in sorted(circles, key=lambda item: (item["y"], item["x"])):
        if any(
            abs(circle["x"] - item["x"]) <= distance
            and abs(circle["y"] - item["y"]) <= distance
            for item in selected
        ):
            continue
        selected.append(circle)
    return selected


def x_clusters(circles: list[dict], tolerance: float) -> list[list[dict]]:
    clusters: list[list[dict]] = []
    for circle in sorted(circles, key=lambda item: item["x"]):
        matching = next(
            (
                cluster
                for cluster in clusters
                if abs(circle["x"] - median(item["x"] for item in cluster)) <= tolerance
            ),
            None,
        )
        if matching is None:
            clusters.append([circle])
        else:
            matching.append(circle)
    return clusters


def first_choice_circle(
    image_path: Path,
    choice_count: int,
    *,
    allow_horizontal: bool = True,
) -> tuple[dict, dict]:
    # cv2.imread still fails on some Windows Unicode paths; imdecode accepts the
    # exact bytes read by pathlib and is equivalent for the analysis below.
    image = cv2.imdecode(np.frombuffer(image_path.read_bytes(), dtype=np.uint8), cv2.IMREAD_GRAYSCALE)
    if image is None:
        raise ValueError(f"cannot read image: {image_path}")
    height, width = image.shape
    blurred = cv2.GaussianBlur(image, (3, 3), 0)
    raw = cv2.HoughCircles(
        blurred,
        cv2.HOUGH_GRADIENT,
        dp=1.2,
        minDist=max(22, round(width * 0.019)),
        param1=110,
        param2=20,
        minRadius=max(8, round(width * 0.010)),
        maxRadius=max(19, round(width * 0.020)),
    )
    if raw is None:
        raise ValueError("no circles detected")
    circles = unique_circles(
        [
            {"x": float(x), "y": float(y), "radius": float(radius)}
            for x, y, radius in raw[0]
            if y >= height * 0.30
            and width * 0.035 <= x <= width * 0.96
            and width * 0.010 <= radius <= width * 0.0205
        ]
    )
    left = [item for item in circles if width * 0.030 <= item["x"] <= width * 0.130]
    secondary = [item for item in circles if width * 0.49 <= item["x"] <= width * 0.59]
    expected_left_grid = (choice_count + 1) // 2
    candidates = []
    horizontal_fallbacks = []
    secondary_clusters = x_clusters(secondary, max(7.0, width * 0.008))
    for cluster in x_clusters(left, max(5.0, width * 0.006)):
        ordered = sorted(cluster, key=lambda item: item["y"])
        if len(ordered) < 2:
            continue
        paired_secondary = next(
            (
                other_cluster
                for other_cluster in secondary_clusters
                if len(other_cluster) >= choice_count // 2
                and sum(
                    any(abs(item["y"] - other["y"]) <= max(6, width * 0.006) for other in other_cluster)
                    for item in ordered
                )
                >= choice_count // 2
            ),
            None,
        )
        grid_layout = paired_secondary is not None or len(ordered) < choice_count
        expected = (
            choice_count
            if len(ordered) >= choice_count
            else expected_left_grid
            if len(ordered) >= expected_left_grid
            else 2
        )
        if len(ordered) < 2:
            continue
        block = ordered[-expected:] if len(ordered) >= expected else ordered
        first, last = block[0], block[-1]
        terminal = last["y"] / height
        span = (last["y"] - first["y"]) / height
        if terminal < 0.45:
            continue
        count_penalty = abs(len(block) - expected)
        marker_radius = median(item["radius"] for item in block)
        radius_spread = max(abs(item["radius"] - marker_radius) for item in block)
        score = (
            count_penalty * 30
            + radius_spread
            - terminal * 12
            - min(span, 0.5) * 8
            - len(block) * 5
            - (4 if grid_layout else 0)
        )
        candidates.append((score, first, block, grid_layout, "vertical"))

    # Compact layouts put every option on one horizontal line.  Prefer that
    # unmistakable terminal row over incidental circles inside a photograph or
    # infographic; otherwise an illustration near the left edge can look like
    # a short vertical choice column.
    row_tolerance = max(7, width * 0.009)
    for anchor in circles if allow_horizontal else []:
        row = unique_circles(
            [item for item in circles if abs(item["y"] - anchor["y"]) <= row_tolerance],
            distance=8,
        )
        row = sorted(row, key=lambda item: item["x"])
        if (
            len(row) < choice_count
            or anchor["y"] / height < 0.72
        ):
            continue
        row = regular_row_subset(row, choice_count, width)
        if row is None:
            continue
        candidates.append(
            (-60 - anchor["y"] / height * 10, min(row, key=lambda item: item["y"]), row, True, "horizontal")
        )

    # Some compact source tables make one of the printed option markers merge
    # with an adjacent parenthesis, so the strict regular-row pass above can
    # miss the row.  Preserve the older broad row detector only as a fallback:
    # it may replace a verified vertical candidate solely when it starts
    # earlier on the page.  This removes the historical failure mode where a
    # later body-text line overrode the true first option row.
    broad_row_tolerance = max(16, width * 0.020)
    for anchor in circles if allow_horizontal else []:
        row = unique_circles(
            [item for item in circles if abs(item["y"] - anchor["y"]) <= broad_row_tolerance],
            distance=8,
        )
        row = sorted(row, key=lambda item: item["x"])
        radius_value = median(item["radius"] for item in row) if row else 0
        if (
            len(row) < choice_count
            or anchor["y"] / height < 0.72
            or not any(width * 0.030 <= item["x"] <= width * 0.130 for item in row)
            or row[-1]["x"] - row[0]["x"] < width * 0.55
            or max(abs(item["radius"] - radius_value) for item in row) > width * 0.008
        ):
            continue
        if len(row) > choice_count:
            possible = [row[start : start + choice_count] for start in range(len(row) - choice_count + 1)]
            row = max(possible, key=lambda items: items[-1]["x"] - items[0]["x"])
        horizontal_fallbacks.append(
            (-40 - anchor["y"] / height * 5, min(row, key=lambda item: item["y"]), row, True, "horizontal-fallback")
        )

    if not candidates and not horizontal_fallbacks:
        raise ValueError(
            f"could not isolate {choice_count} terminal choice markers from {len(circles)} circles"
        )
    selected = min(candidates, key=lambda item: item[0]) if candidates else None
    fallback = min(horizontal_fallbacks, key=lambda item: item[0]) if horizontal_fallbacks else None
    if selected is None or (fallback is not None and fallback[1]["y"] < selected[1]["y"]):
        selected = fallback
    _, first, block, grid_layout, layout_detection = selected
    return first, {
        "imageWidth": width,
        "imageHeight": height,
        "markerCount": len(block),
        "markerYs": [round(item["y"], 1) for item in sorted(block, key=lambda item: item["y"])],
        "gridLayout": grid_layout,
        "markerX": round(median(item["x"] for item in block), 1),
        "lastMarkerY": round(max(item["y"] for item in block), 1),
        "layoutDetection": layout_detection,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--only", help="Comma-separated official question IDs")
    args = parser.parse_args()

    catalog = json.loads((DIST / "official-exam-catalog.json").read_text(encoding="utf-8"))
    choice_bundle_path = DIST / "official-exam-choices.json"
    choice_rows = (
        json.loads(choice_bundle_path.read_text(encoding="utf-8")).get("records", [])
        if choice_bundle_path.exists()
        else []
    )
    choices_by_id = {row["officialQuestionId"]: row.get("choices", []) for row in choice_rows}
    media_review_path = ROOT / "config" / "official-choice-media-reviews.json"
    media_question_ids: set[str] = set()
    if media_review_path.exists():
        media_review = json.loads(media_review_path.read_text(encoding="utf-8"))
        media_question_ids.update(media_review.get("imageQuestionIds", []))
        media_question_ids.update(media_review.get("mixedQuestionIds", []))
    selected = {item.strip() for item in (args.only or "").split(",") if item.strip()}
    if selected:
        catalog = [item for item in catalog if item["officialQuestionId"] in selected]
        missing = selected - {item["officialQuestionId"] for item in catalog}
        if missing:
            raise ValueError(f"unknown official question IDs: {sorted(missing)}")

    rows = []
    failures = []
    for index, source in enumerate(catalog, start=1):
        image_path = DIST / source["detailImage"]
        try:
            image_hash = sha256(image_path)
            expected_hash = str(source.get("detailImageSha256") or "").lower()
            if expected_hash and image_hash != expected_hash:
                raise ValueError("detail image hash does not match canonical catalog")
            choice_count = 4 if source["examLevel"] == "기본" else 5
            if source["officialQuestionId"] in MANUAL_CONTENT_CROPS:
                with image_path.open("rb") as stream:
                    shape = cv2.imdecode(
                        np.frombuffer(stream.read(), dtype=np.uint8), cv2.IMREAD_GRAYSCALE
                    ).shape
                cut_y = min(shape[0], MANUAL_CONTENT_CROPS[source["officialQuestionId"]])
                rows.append(
                    {
                        "officialQuestionId": source["officialQuestionId"],
                        "sourceImageSha256": image_hash,
                        "contentCropRatio": round(cut_y / shape[0], 6),
                        "contentCropY": cut_y,
                        "cropGuardPixels": None,
                        "choiceStartY": None,
                        "choiceMarkerRadius": None,
                        "imageWidth": shape[1],
                        "imageHeight": shape[0],
                        "markerCount": 0,
                        "markerYs": [],
                        "gridLayout": False,
                        "markerX": None,
                        "lastMarkerY": None,
                        "manualLayoutReview": True,
                        "layoutDetection": "manual-content-boundary",
                    }
                )
                continue
            if source["officialQuestionId"] in MANUAL_FIRST_CHOICE_MARKERS:
                first = MANUAL_FIRST_CHOICE_MARKERS[source["officialQuestionId"]]
                with image_path.open("rb") as stream:
                    shape = cv2.imdecode(np.frombuffer(stream.read(), dtype=np.uint8), cv2.IMREAD_GRAYSCALE).shape
                audit = {
                    "imageWidth": shape[1],
                    "imageHeight": shape[0],
                    "markerCount": choice_count,
                    "gridLayout": True,
                    "markerX": None,
                    "lastMarkerY": None,
                    "manualLayoutReview": True,
                    "layoutDetection": "manual",
                }
            else:
                source_choices = choices_by_id.get(source["officialQuestionId"], [])
                compact_choices = [
                    "".join(character for character in str(choice) if character.isalnum())
                    for choice in source_choices
                ]
                # A genuine one-row choice set contains compact labels such as
                # (가)~(마) or short ordering combinations.  Long sentence
                # choices are printed vertically; Hangul circles inside the
                # final sentence must never be mistaken for five option marks.
                allow_horizontal = (
                    source["officialQuestionId"] in media_question_ids
                    or not compact_choices
                    or max(map(len, compact_choices)) <= 12
                )
                first, audit = first_choice_circle(
                    image_path,
                    choice_count,
                    allow_horizontal=allow_horizontal,
                )
            # Manual boundaries were visually reviewed against unusually
            # complex illustrations.  Automatic boundaries reserve at least
            # 2.5 marker radii (and a source-width floor) above the centre so
            # that the marker top and the first option's ascenders cannot leak
            # into the retained question image.
            crop_guard = (
                first["radius"] * 1.75
                if audit.get("manualLayoutReview")
                else max(first["radius"] * 2.5, audit["imageWidth"] * 0.029)
            )
            cut_y = max(1, round(first["y"] - crop_guard))
            ratio = round(cut_y / audit["imageHeight"], 6)
            if not 0.20 <= ratio <= 0.985:
                raise ValueError(f"implausible content crop ratio: {ratio}")
            rows.append(
                {
                    "officialQuestionId": source["officialQuestionId"],
                    "sourceImageSha256": image_hash,
                    "contentCropRatio": ratio,
                    "contentCropY": cut_y,
                    "cropGuardPixels": round(crop_guard, 1),
                    "choiceStartY": round(first["y"], 1),
                    "choiceMarkerRadius": round(first["radius"], 1),
                    **audit,
                }
            )
        except Exception as error:  # keep the full audit actionable
            failures.append({"officialQuestionId": source["officialQuestionId"], "error": str(error)})
        if index % 100 == 0 or index == len(catalog):
            print(f"detected {index}/{len(catalog)}; failures {len(failures)}", flush=True)

    payload = {
        "schemaVersion": 1,
        "method": "circled-choice-marker-layout-v3",
        "canonicalQuestionCount": len(catalog),
        "detectedQuestionCount": len(rows),
        "failureCount": len(failures),
        "failures": failures,
        "records": rows,
    }
    rendered = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if args.check:
        if not args.output.exists() or args.output.read_text(encoding="utf-8") != rendered:
            raise SystemExit(f"stale content-crop ledger: {args.output}")
        print(f"OK {len(rows)} content crop records")
        return
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(rendered, encoding="utf-8")
    print(f"WROTE {len(rows)} records and {len(failures)} failures to {args.output}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Map reviewed illustrations and generated portraits to the complete manuscript.

No stock portrait is silently relabelled as a newly authored person. Missing
principal portraits and scene-specific props remain explicit production items.
The original genealogy photographs are preserved byte for byte in the repository.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
ART_DIR = "assets/ancient/three-complete"
ANC = "assets/ancient/backgrounds/"
OLD = "assets/ancient/three-v2/backgrounds/"
V2 = "assets/v2/backgrounds/"

# All entries below were visually reviewed as illustrations. Reuse describes a
# setting, not a photograph or a definitive reconstruction of a named monument.
BACKGROUNDS = {
    "queue": (ART_DIR + "/backgrounds/goguryeo-spring-queue-before-collapse.png", "배급 줄에서 휘청이는 어머니와 아이", "imagegen-edit-of-approved-goguryeo-spring-background"),
    "spring": (OLD + "goguryeo-hungry-village-spring.webp", "봄의 고구려 마을", "existing-approved-three-illustration"),
    "granary": (OLD + "goguryeo-granary-office.webp", "곡식 창고의 업무 공간", "existing-approved-three-illustration"),
    "autumn": (OLD + "goguryeo-grain-return-autumn.webp", "곡식을 돌려주는 계절의 마을", "existing-approved-three-illustration"),
    "council": (ANC + "rebuild-goguryeo-council.webp", "고구려 회의 공간", "compatible-unpeopled-ancient-interior"),
    "pyongyang": (ANC + "three-pyongyang-fortress.jpg", "고구려 성과 강가", "existing-three-country-illustration"),
    "road": (ANC + "rebuild-wagon.webp", "수레와 흙길", "compatible-unpeopled-ancient-road"),
    "forest": (ANC + "proto-forest-road.jpg", "나무와 강을 따라 난 길", "compatible-unpeopled-landscape"),
    "camp": (ANC + "rebuild-forest-camp.webp", "숲의 야영지", "compatible-unpeopled-night-landscape"),
    "market": (ANC + "three-border-market.jpg", "옛 교역장과 길", "existing-three-country-illustration"),
    "han": (ANC + "three-han-river.jpg", "한강 주변의 길과 마을", "existing-three-country-illustration"),
    "sabi": (ANC + "three-sabi-fortress.jpg", "사비의 성과 나루", "existing-three-country-illustration"),
    "gaya": (ANC + "three-gaya-workshop.jpg", "가야의 공방과 교역 터", "existing-three-country-illustration"),
    "workshop": (ANC + "rebuild-byeonhan-workshop.webp", "남부의 작업장", "compatible-unpeopled-ancient-workshop"),
    "silla": (ANC + "three-unified-capitals.jpg", "신라의 도성 길", "existing-three-country-illustration"),
    "port": (ANC + "three-balhae-harbor.jpg", "동아시아 바닷길의 항구", "compatible-three-period-port-illustration"),
    "house": (ANC + "rebuild-jumong-birth.webp", "옛 목조 가옥 내부", "compatible-unpeopled-ancient-interior"),
    "archive": (V2 + "late-history-books.webp", "기록책 속 자료 공간", "nondiegetic-record-illustration"),
    "museum": (ANC + "ancient-modern-museum.jpg", "후대 유물 자료를 보는 공간", "nondiegetic-museum-illustration"),
    "modern": (V2 + "modern-study-night.webp", "서아의 방", "existing-modern-study-illustration"),
    "songak": (V2 + "songak-village-918.webp", "고려가 시작된 무렵의 송악 길", "existing-918-songak-illustration"),
    "earlymarket": (V2 + "early-songak-market.webp", "후삼국 무렵의 장터", "compatible-later-three-kingdoms-market"),
}

# Explicit scene order makes every reuse decision reviewable. A scenic exterior
# establishes the locality while any specific monument/prop must be a separately
# sourced overlay; it is never labelled as the exact artifact being discussed.
CHAPTER_BACKGROUNDS = {
    1: "queue granary council house council granary autumn autumn",
    2: "forest market pyongyang road forest archive pyongyang archive",
    3: "house house council archive council pyongyang market market pyongyang museum",
    4: "road forest house council house han han museum archive archive",
    5: "road forest forest road council pyongyang pyongyang pyongyang house pyongyang road archive",
    6: "workshop house market han han workshop house house archive",
    7: "han han han house archive market house han archive",
    8: "house house museum house house han house house house han archive",
    9: "workshop workshop museum port house forest sabi road port port",
    10: "market workshop road house council market house archive",
    11: "spring house port house forest forest council road house archive",
    12: "han han house han forest museum forest road workshop archive",
    13: "workshop silla workshop house house house port pyongyang road road port road",
    14: "gaya house workshop gaya workshop port workshop gaya",
    15: "gaya house workshop forest house archive road archive",
    16: "silla house house house road council house house spring house",
    17: "house market forest workshop silla workshop house archive port",
    18: "port house port port house archive port archive",
    19: "house house road forest forest spring spring house archive",
    20: "road camp forest forest house workshop port archive",
    21: "house port port house road house road museum house archive",
    22: "road house museum road songak songak archive archive",
    23: "earlymarket earlymarket house archive road earlymarket house archive songak songak",
}

HISTORICAL = {
    "고국천왕": "gogukcheon", "을파소": "eulpaso", "순도": "sundo", "광개토대왕": "gwanggaeto",
    "장수왕": "jangsu", "을지문덕": "euljimundeok", "마라난타": "marananta", "문주왕": "munju",
    "무령왕": "muryeong", "성왕": "seong", "법흥왕": "beopheung", "자장": "jajang",
    "김춘추": "kimchunchu", "김유신": "kimyusin", "우륵": "ureuk", "신문왕": "sinmun",
    "원효": "wonhyo", "의상": "uisang", "장보고": "jangbogo", "최치원": "choechiwon",
    "대조영": "daejoyeong", "왕건": "wanggeon",
}
NAMED = {
    1: "연우 모진 해솔", 2: "도림 소운 하준 기록관_소정 전령_태수 기록관_연진",
    3: "규림 기록관_가현", 4: "다은 설모 은호 우진 소리", 5: "온달수 민서 길원 진하 지오 윤서 초연 태문",
    6: "솔아 유솔", 7: "해인 다솔", 8: "여울 한결", 9: "도연 다은 설",
    10: "미솔 다함 가람", 11: "보리 아라", 12: "하람", 13: "", 14: "아라 해들 나루",
    15: "아라 여울", 16: "온유 수인 도겸 소담", 17: "가온 보라 해명",
    18: "나래", 19: "재인 지우", 20: "해루 누리", 21: "다온 다솜",
    22: "은서 은서의_딸", 23: "시온 도하",
}
NAMED = {chapter: {name.replace("_", " ") for name in names.split()} for chapter, names in NAMED.items()}
ALIASES = {
    (9, "어머니"): "설", (15, "상인 아라"): "아라", (16, "고구려계 군인"): "도겸",
    (17, "이웃 가온"): "가온", (17, "이웃 보라"): "보라",
}
PORTRAITS = {
    "history-gogukcheon": "assets/ancient/three-v2/characters/gogukcheon-neutral.webp",
    "history-eulpaso": "assets/ancient/three-v2/characters/eulpaso-neutral.webp",
}
EXPRESSIONS = ["neutral", "smile", "surprised", "embarrassed", "suspicious", "angry", "sad", "determined", "fear", "worried", "relieved"]
ORIGINAL_PHOTOS = [
    ("image(20261009-194851).png", "253197b6865dffb946148596f94a6056a140d4fe463b87ea16a7c271845d6581"),
    ("image(20261009-194900).png", "319c953e356edce398d30babbb3fadf69cbeec2aa7304a4726b8c911d6f3b7dc"),
    ("image(20261009-194906).png", "ca47052f52778c68bfcbbe821c6fc3040abcf701fa9556ac390fa376ecb119db"),
]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def asset_info(src):
    path = DIST / src
    require(path.is_file(), f"Missing source asset: {src}")
    raw = path.read_bytes()
    return {"src": src, "sha256": hashlib.sha256(raw).hexdigest(), "byteLength": len(raw), "exists": True}


def compact_name(name):
    return hashlib.sha256(name.encode("utf-8")).hexdigest()[:10]


def named_id(chapter, name):
    return f"civilian-c{chapter:02}-{compact_name(name)}"


def recurring_portraits():
    """Read the reviewed, non-destructively generated portrait atlas source map.

    Image generation does not promise pixel-exact quarter-cell layouts. The
    source rectangles preserve complete silhouettes using CSS, without cutting
    or re-encoding the generated PNGs. Nominal row/column indices remain useful
    for identity and production review, not as an alternative crop definition.
    """
    source = json.loads((ROOT / "docs/three-content/recurring-portrait-atlas-generation.json").read_text(encoding="utf-8"))
    portraits, sheets = {}, {}
    for sheet in source["sheets"]:
        info = asset_info(sheet["src"])
        require(info["sha256"] == sheet["sha256"], f"Portrait atlas changed: {sheet['src']}")
        sheets[sheet["sheetId"]] = {**info, "width": sheet["width"], "height": sheet["height"],
                                  "columns": sheet["columns"], "rows": sheet["rows"],
                                  "occupiedCellCount": sheet["occupiedCellCount"],
                                  "emptyCells": sheet["emptyCells"], "visualFileReview": True,
                                  "sourceKind": "built-in-imagegen-reviewed-fictional-civilians"}
        occupied, rectangles = set(), []
        for cell in sheet["cells"]:
            slot = (cell["row"], cell["column"])
            require(slot not in occupied, f"Duplicate atlas slot: {sheet['sheetId']} {slot}")
            require(0 <= slot[0] < sheet["rows"] and 0 <= slot[1] < sheet["columns"], "Invalid atlas slot")
            occupied.add(slot)
            rect = cell["sourceRect"]
            require(rect["x"] >= 0 and rect["y"] >= 0 and rect["width"] > 0 and rect["height"] > 0,
                    f"Invalid portrait rectangle: {cell['name']}")
            require(rect["x"] + rect["width"] <= sheet["width"] and rect["y"] + rect["height"] <= sheet["height"],
                    f"Portrait outside atlas: {cell['name']}")
            for previous in rectangles:
                overlap = (rect["x"] < previous["x"] + previous["width"] and
                           previous["x"] < rect["x"] + rect["width"] and
                           rect["y"] < previous["y"] + previous["height"] and
                           previous["y"] < rect["y"] + rect["height"])
                require(not overlap, f"Portrait source rectangles overlap: {cell['name']}")
            rectangles.append(rect)
            character_id = named_id(cell["chapter"], cell["name"]) + "--" + cell["ageVariant"]
            require(character_id not in portraits, f"Duplicate atlas character: {character_id}")
            portraits[character_id] = {
                "neutral": sheet["src"], "asset": info, "atlasId": sheet["sheetId"],
                "flipX": sheet["flipX"], "nativeFacing": sheet["nativeFacing"],
                "sprite": {"columns": sheet["columns"], "rows": sheet["rows"],
                           "column": cell["column"], "row": cell["row"],
                           "sheetWidth": sheet["width"], "sheetHeight": sheet["height"],
                           "sourceRect": rect},
                "portraitFraming": "upper-body", "visualFileReview": cell["visualFileReview"],
                "portraitGeometry": {"coordinateSpace": "sheet-pixels", "alphaThreshold": 32,
                    "sheetWidth": sheet["width"], "sheetHeight": sheet["height"],
                    "alphaBounds": {key: cell["alphaComponentBounds"][key] for key in ("x", "y", "width", "height")},
                    "faceBounds": {"x": round(rect["x"] + rect["width"] * (0.25 if sheet["flipX"] else 0.36)),
                        "y": round(rect["y"] + rect["height"] * 0.21), "width": round(rect["width"] * 0.48),
                        "height": round(rect["height"] * 0.54)},
                    "upperBodyBounds": rect, "framing": "upper-body",
                    "faceAnchorMethod": "legacy reviewed upper-body head region; replaced by full-body source before final deployment"},
                "genderEvidence": cell["genderEvidence"], "ageEvidence": cell["ageEvidence"],
                "portraitSourceEvidence": cell["sourceEvidence"], "portraitSourceSceneId": cell["sourceSceneId"],
                "portraitGenerationSource": "docs/three-content/recurring-portrait-atlas-generation.json",
            }
        require(len(occupied) == sheet["occupiedCellCount"], "Portrait atlas occupied-cell count differs")
        require(all((c["row"], c["column"]) not in occupied for c in sheet["emptyCells"]), "Empty atlas slot is assigned")
    require(len(portraits) == 29, "Expected all 29 recurring civilian appearances")
    require(len({cid.rsplit("--", 1)[0] for cid in portraits}) == 21, "Expected 21 recurring civilian identities")
    return portraits, sheets



def completed_portraits():
    """Load reviewed body extensions without changing original image bytes."""
    relative = "docs/three-content/fullbody-portrait-generation.json"
    path = ROOT / relative
    if not path.is_file():
        return {}, {}
    source = json.loads(path.read_text(encoding="utf-8"))
    portraits, sheets = {}, {}
    for sheet in source["sheets"]:
        info = asset_info(sheet["src"])
        require(info["sha256"] == sheet["sha256"], f"Body extension changed: {sheet['src']}")
        occupied = set()
        sheets[sheet["sheetId"]] = {**info, "width": sheet["width"], "height": sheet["height"],
            "columns": sheet["columns"], "rows": sheet["rows"],
            "occupiedCellCount": sheet["occupiedCellCount"], "emptyCells": sheet["emptyCells"],
            "visualFileReview": True, "sourceKind": "built-in-imagegen-identity-preserving-body-extension"}
        for cell in sheet["cells"]:
            cid, rect = cell["characterId"], cell["sourceRect"]
            slot = (cell["row"], cell["column"])
            require(slot not in occupied and cid not in portraits, f"Duplicate completed portrait: {cid}")
            occupied.add(slot)
            require(0 <= slot[0] < sheet["rows"] and 0 <= slot[1] < sheet["columns"], f"Invalid portrait slot: {cid}")
            require(rect["x"] >= 0 and rect["y"] >= 0 and rect["width"] > 0 and rect["height"] > 0, f"Invalid body rectangle: {cid}")
            require(rect["x"] + rect["width"] <= sheet["width"] and rect["y"] + rect["height"] <= sheet["height"], f"Body rectangle outside sheet: {cid}")
            require(cell["visualFileReview"] and cell["cropReview"]["foreignPortraitComponents"] == 0 and
                cell["cropReview"]["completeSolidSilhouetteInsideClip"], f"Incomplete portrait crop review: {cid}")
            geometry = {"coordinateSpace": "sheet-pixels", "alphaThreshold": 32,
                "sheetWidth": sheet["width"], "sheetHeight": sheet["height"],
                "faceBounds": cell["faceBounds"], "alphaBounds": cell["alphaBounds"],
                "upperBodyBounds": cell["upperBodyBounds"],
                "faceAnchorMethod": cell["cropReview"]["faceAnchorMethod"], "framing": cell["portraitFraming"]}
            portraits[cid] = {
                "neutral": sheet["src"], "asset": info, "atlasId": sheet["sheetId"],
                "flipX": cell["flipX"], "nativeFacing": cell["nativeFacing"],
                "sprite": {"columns": sheet["columns"], "rows": sheet["rows"],
                    "column": cell["column"], "row": cell["row"],
                    "sheetWidth": sheet["width"], "sheetHeight": sheet["height"],
                    "sourceRect": rect, **({"clipPath": cell["clipPath"]} if cell.get("clipPath") else {})},
                "portraitGeometry": geometry, "portraitFraming": cell["portraitFraming"],
                "portraitStatus": "generated-principal-portrait-reviewed" if cid.startswith("history-") else "generated-civilian-portrait-reviewed",
                "visualFileReview": True, "genderEvidence": cell["genderEvidence"], "ageEvidence": cell["ageEvidence"],
                "portraitSourceEvidence": cell["sourceEvidence"], "portraitSourceSceneId": cell["sourceSceneId"],
                "portraitGenerationSource": relative, "cropReview": cell["cropReview"],
                **({"preservedSource": cell["preservedSource"]} if cell.get("preservedSource") else {})}
        require(len(occupied) == sheet["occupiedCellCount"], f"Body atlas occupied-cell count differs: {sheet['sheetId']}")
    return portraits, sheets

def approved_geometry():
    path = ROOT / "docs/three-content/approved-portrait-geometry.json"
    if not path.is_file():
        return {"files": {}, "sourceOriginalHashes": {}}
    source = json.loads(path.read_text(encoding="utf-8"))
    for src, record in source["files"].items():
        require(asset_info(src)["sha256"] == record["sha256"], f"Approved portrait original changed: {src}")
    return {"coordinateSpace": "sheet-pixels", "alphaThreshold": 32,
            "files": {src: record["portraitGeometry"] for src, record in source["files"].items()},
            "sourceOriginalHashes": {src: record["sha256"] for src, record in source["files"].items()}}


def identity(chapter, scene_number, speaker):
    name = ALIASES.get((chapter, speaker), speaker)
    if name in HISTORICAL:
        return "history-" + HISTORICAL[name], name, "historical-person", True
    if name in NAMED[chapter]:
        return named_id(chapter, name), name, "authored-civilian", True
    # Unnamed occupations in distant scenes are different individuals. Do not
    # keep a clerk or a soldier alive across decades merely because roles match.
    return f"support-c{chapter:02}-s{scene_number:02}-{compact_name(name)}", name, "supporting-role", False


def appearance(chapter, scene_number, name):
    """Only explicit source age or generation changes select another appearance."""
    rules = [
        (chapter == 7 and name == "해인", scene_number >= 6, "17년 이상 지난 40대의 해인"),
        (chapter == 8 and name == "여울", scene_number >= 8, "510년의 20대에서 554년으로 나이 든 여울"),
        (chapter == 18 and name == "나래", scene_number >= 7, "40대 중반의 나래"),
        (chapter == 19 and name == "재인", scene_number >= 8, "50대 중반의 재인"),
        (chapter == 20 and name == "해루", scene_number >= 7, "초기 정착 시기보다 나이 든 해루"),
        (chapter == 22 and name == "은서", scene_number >= 6, "40대의 은서"),
        (chapter == 22 and name == "은서의 딸", scene_number >= 6, "934년까지 성장한 은서의 딸"),
        (chapter == 23 and name == "시온", scene_number >= 9, "40대 중반의 시온"),
    ]
    for applies, later, label in rules:
        if applies:
            return ("later", label) if later else ("initial", "원고의 첫 등장 시기")
    if chapter == 21 and name == "다솜":
        return "elderly", "70대의 누리 손녀 다솜"
    if chapter == 21 and name == "다온":
        return "middle-aged", "40대의 해루 아들 다온"
    if name == "김유신":
        return "older", "654년 약 60세의 김유신"
    return "initial", "원고의 해당 시기"


def principal_relationships():
    return [
        {"identityId": named_id(9, "다은"), "relation": "grandchild-of", "relatedIdentityId": named_id(9, "도연")},
        {"identityId": named_id(14, "나루"), "relation": "great-grandchild-of", "relatedIdentityId": named_id(14, "아라")},
        {"identityId": named_id(15, "여울"), "relation": "great-grandchild-of", "relatedIdentityId": named_id(15, "아라")},
        {"identityId": named_id(16, "소담"), "relation": "daughter-of", "relatedIdentityId": named_id(16, "온유")},
        {"identityId": named_id(21, "다온"), "relation": "son-of", "relatedIdentityId": named_id(20, "해루")},
        {"identityId": named_id(21, "다솜"), "relation": "granddaughter-of", "relatedIdentityId": named_id(20, "누리")},
        {"identityId": named_id(22, "은서의 딸"), "relation": "daughter-of", "relatedIdentityId": named_id(22, "은서")},
        {"identityId": named_id(23, "도하"), "relation": "relative-of", "relatedIdentityId": named_id(23, "시온")},
    ]


def all_lines(scene):
    yield from scene["main"]
    for choice in scene["choices"]:
        yield choice["spokenLine"]
        yield from choice["reply"]
    yield from scene["join"]


def support_portraits():
    relative = "docs/three-content/support-portrait-generation.json"
    path = ROOT / relative
    if not path.exists():
        return {}, {}
    source = json.loads(path.read_text(encoding="utf-8"))
    portraits, sheets = {}, {}
    for sheet in source["sheets"]:
        info = asset_info(sheet["src"])
        require(info["sha256"] == sheet["sha256"], "Support portrait changed")
        sheets[sheet["sheetId"]] = {**info, "width": sheet["width"], "height": sheet["height"], "columns": sheet["columns"], "rows": sheet["rows"], "sourceKind": "built-in-imagegen-unique-supporting-character"}
        for cell in sheet["cells"]:
            cid = cell["characterId"]
            require(cid not in portraits, "Repeated supporting identity: " + cid)
            portraits[cid] = {
                "neutral": sheet["src"], "asset": info, "atlasId": sheet["sheetId"],
                "sprite": {"columns": sheet["columns"], "rows": sheet["rows"], "column": cell["column"], "row": cell["row"], "sheetWidth": sheet["width"], "sheetHeight": sheet["height"], "sourceRect": cell["sourceRect"]},
                "portraitGeometry": {"coordinateSpace": "sheet-pixels", "sheetWidth": sheet["width"], "sheetHeight": sheet["height"], "faceBounds": cell["faceBounds"], "alphaBounds": cell["alphaBounds"], "upperBodyBounds": cell["upperBodyBounds"], "framing": "full-body", "faceAnchorMethod": "visually-reviewed-skin-component-upper-face"},
                "flipX": cell["flipX"], "nativeFacing": cell["nativeFacing"], "portraitRequired": True,
                "portraitStatus": "generated-support-portrait-reviewed", "portraitFraming": "full-body", "visualFileReview": cell["visualFileReview"],
                "ageEvidence": cell["ageEvidence"], "portraitSourceEvidence": cell["sourceEvidence"], "portraitSourceSceneId": cell["sourceSceneId"], "portraitGenerationSource": relative}
    return portraits, sheets


def build():
    manuscript = json.loads((DIST / "three-story-script.json").read_text(encoding="utf-8"))
    atlas_portraits, portrait_atlases = recurring_portraits()
    recurring_appearance_ids = set(atlas_portraits)
    completed, completed_atlases = completed_portraits()
    atlas_portraits.update(completed)
    portrait_atlases.update(completed_atlases)
    support, support_atlases = support_portraits()
    atlas_portraits.update(support)
    portrait_atlases.update(support_atlases)
    geometry = approved_geometry()
    backgrounds, characters, scene_characters, record_voices = {}, {}, {}, {}
    background_assets = {key: {**asset_info(src), "label": label, "sourceKind": source_kind,
                               "visualFileReview": True, "containsNamedCharacters": False,
                               "containsScenarioCharacters": key == "queue",
                               "reviewMethod": "visual inspection of existing repository illustrations"}
                         for key, (src, label, source_kind) in BACKGROUNDS.items()}
    all_scenes = manuscript["prologue"]["scenes"] + [s for ch in manuscript["chapters"] for s in ch["scenes"]]
    for scene in manuscript["prologue"]["scenes"]:
        key = "queue" if scene["sceneId"] == "THR-PRO-S03" else "modern"
        backgrounds[scene["sceneId"]] = {**background_assets[key], "settingRole": "scene-setting",
                                           "fit": "approved-setting-reuse", "sourceSceneId": scene["sceneId"]}
        if scene["sceneId"] == "THR-PRO-S02":
            backgrounds[scene["sceneId"]]["composition"] = "book-closeup-dom-overlay"
        if scene["sceneId"] == "THR-PRO-S03":
            backgrounds[scene["sceneId"]]["continuityWith"] = "THR-C01-S01"
        scene_characters[scene["sceneId"]] = {}
        record_voices[scene["sceneId"]] = []
    for chapter in manuscript["chapters"]:
        number = chapter["number"]
        sequence = CHAPTER_BACKGROUNDS[number].split()
        require(len(sequence) == len(chapter["scenes"]), f"Missing background decisions for chapter {number}")
        for index, scene in enumerate(chapter["scenes"]):
            scene_id = scene["sceneId"]
            key = sequence[index]
            if scene["presentationContext"] == "record":
                key = "museum" if key == "museum" else "archive"
            asset = background_assets[key]
            backgrounds[scene_id] = {**asset, "label": scene["location"], "sourceAssetLabel": asset["label"],
                                     "settingRole": "record-space" if key in {"archive", "museum"} else "locality-illustration",
                                     "fit": "record-space" if key in {"archive", "museum"} else "compatible-setting-reuse",
                                     "sourceSceneId": scene_id, "sourceLocation": scene["location"],
                                     "exactScenePropsIncluded": False}
            if number == 1 and key in {"queue", "spring", "granary", "autumn"}:
                backgrounds[scene_id]["fit"] = "approved-setting-reuse"
            scene_characters[scene_id] = {}
            record_voices[scene_id] = []
            for line in all_lines(scene):
                speaker = line["speaker"]
                if speaker == "서아" or line["kind"] == "narration":
                    continue
                if line["presentationContext"] == "record" or line["kind"] == "record":
                    if speaker not in record_voices[scene_id]:
                        record_voices[scene_id].append(speaker)
                    continue
                identity_id, name, identity_kind, principal = identity(number, scene["number"], speaker)
                age_key, age_label = appearance(number, scene["number"], name)
                appearance_id = identity_id + "--" + age_key
                atlas_portrait = atlas_portraits.get(appearance_id)
                neutral = atlas_portrait["neutral"] if atlas_portrait else PORTRAITS.get(identity_id)
                if appearance_id not in characters:
                    characters[appearance_id] = {
                        "characterId": appearance_id, "identityId": identity_id, "name": name,
                        "identityKind": identity_kind, "ageVariant": age_key, "ageLabel": age_label,
                        "neutral": neutral, "portraitRequired": principal, "position": "left",
                        "portraitStatus": "generated-recurring-portrait-reviewed" if atlas_portrait else "existing-character-reviewed" if neutral else "unmade-principal" if principal else "background-role",
                        "renderScale": 1, "sourceSceneIds": [], "speakerAliases": [],
                        "interpretationNotice": "역사 학습용 창작 인물 디자인; 실제 초상으로 표시하지 않는다.",
                    }
                    if atlas_portrait:
                        characters[appearance_id].update(atlas_portrait)
                    elif neutral:
                        characters[appearance_id]["asset"] = asset_info(neutral)
                        characters[appearance_id]["visualFileReview"] = True
                        if neutral in geometry["files"]:
                            characters[appearance_id]["portraitGeometry"] = geometry["files"][neutral]
                person = characters[appearance_id]
                if scene_id not in person["sourceSceneIds"]:
                    person["sourceSceneIds"].append(scene_id)
                if speaker not in person["speakerAliases"]:
                    person["speakerAliases"].append(speaker)
                scene_characters[scene_id][speaker] = appearance_id
    # The prologue handoff includes the same silent Yeonwoo as the first scene.
    scene_characters["THR-PRO-S03"]["연우"] = scene_characters["THR-C01-S01"]["연우"]
    identity_scenes = {}
    for person in characters.values():
        identity_scenes.setdefault(person["identityId"], set()).update(person["sourceSceneIds"])
    for person in characters.values():
        person["portraitPriority"] = (
            "historical-person" if person["identityKind"] == "historical-person" else
            "recurring-civilian" if person["identityKind"] == "authored-civilian" and len(identity_scenes[person["identityId"]]) > 1 else
            "named-local-role" if person["identityKind"] == "authored-civilian" else "background-role")
    def actor(scene_id, speaker):
        return characters[scene_characters[scene_id][speaker]]

    continuity_checks = []
    for first_scene, last_scene, speaker in [
        ("THR-C07-S01", "THR-C07-S08", "해인"),
        ("THR-C08-S02", "THR-C08-S08", "여울"),
        ("THR-C18-S01", "THR-C18-S07", "나래"),
        ("THR-C19-S02", "THR-C19-S08", "재인"),
        ("THR-C20-S01", "THR-C20-S07", "해루"),
        ("THR-C22-S02", "THR-C22-S06", "은서"),
        ("THR-C22-S02", "THR-C22-S06", "은서의 딸"),
        ("THR-C23-S02", "THR-C23-S09", "시온"),
    ]:
        first, last = actor(first_scene, speaker), actor(last_scene, speaker)
        require(first["identityId"] == last["identityId"], f"Identity split across ages: {speaker}")
        require(first["characterId"] != last["characterId"], f"Missing age variant: {speaker}")
        continuity_checks.append({"kind": "same-person-distinct-age-appearance", "name": speaker,
                                  "sceneIds": [first_scene, last_scene], "status": "passed"})
    for first_scene, first_name, last_scene, last_name in [
        ("THR-C04-S01", "다은", "THR-C09-S07", "다은"),
        ("THR-C11-S08", "아라", "THR-C14-S01", "아라"),
        ("THR-C14-S01", "아라", "THR-C15-S01", "상인 아라"),
        ("THR-C08-S02", "여울", "THR-C15-S07", "여울"),
        ("THR-C20-S01", "해루", "THR-C21-S05", "다온"),
        ("THR-C20-S02", "누리", "THR-C21-S09", "다솜"),
        ("THR-C16-S05", "온유", "THR-C16-S09", "소담"),
    ]:
        require(actor(first_scene, first_name)["identityId"] != actor(last_scene, last_name)["identityId"],
                f"Different people conflated: {first_name}/{last_name}")
        continuity_checks.append({"kind": "distinct-person-or-generation", "names": [first_name, last_name],
                                  "sceneIds": [first_scene, last_scene], "status": "passed"})
    require(scene_characters["THR-C16-S06"]["도겸"] == scene_characters["THR-C16-S06"]["고구려계 군인"],
            "Dogyeom role/name alias split")
    require(scene_characters["THR-C17-S01"]["가온"] == scene_characters["THR-C17-S01"]["이웃 가온"],
            "Gaon role/name alias split")
    require(scene_characters["THR-C17-S01"]["보라"] == scene_characters["THR-C17-S02"]["보라"],
            "Bora identity split")
    faces = {}
    for person in characters.values():
        if person["neutral"]:
            sprite = person.get("sprite")
            face = (person["neutral"], sprite["row"], sprite["column"]) if sprite else (person["neutral"], None, None)
            faces.setdefault(face, set()).add(person["identityId"])
    require(all(len(ids) == 1 for ids in faces.values()), "One portrait used for different people")
    require(set(atlas_portraits).issubset(characters), "Atlas character does not exist in the source manuscript")
    require(all(c["portraitSourceSceneId"] in c["sourceSceneIds"] for c in characters.values() if "atlasId" in c),
            "Atlas source-scene reference does not contain this appearance")
    require(all(person["position"] == "left" for person in characters.values()), "NPC assigned to protagonist slot")
    for scene_id in ("THR-PRO-S03", "THR-C01-S01"):
        backgrounds[scene_id]["embeddedSceneCharacters"] = ["연우의 어머니", "아이", "배급을 기다리는 주민들"]
        backgrounds[scene_id]["embeddedCharacterState"] = "grandmother-standing-unsteady-before-collapse"
        backgrounds[scene_id]["foregroundPortraitSlots"] = {"left": "연우", "right": "서아"}
        backgrounds[scene_id]["sourceEditTarget"] = OLD + "goguryeo-hungry-village-spring.webp"
        backgrounds[scene_id]["rescueAlreadyCompleted"] = False
    protagonist = {"characterId": "three_v2_seoa", "identityId": "three-seoa", "name": "서아", "position": "right",
                   "modernSrc": "assets/ancient/characters/three-player-modern.png",
                   "files": [{"expression": expression, "src": f"assets/ancient/three-v2/characters/seoa-{expression}.png"}
                             for expression in EXPRESSIONS],
                   "cover": {"src": "assets/ancient/three-v2/heroes/seoa-cover.jpg"},
                   "visualFileReview": True, "sourceKind": "existing-approved-three-protagonist"}
    for src in [protagonist["modernSrc"], protagonist["cover"]["src"], *[f["src"] for f in protagonist["files"]]]:
        asset_info(src)
    protagonist["files"].append({"expression": "modern", "src": protagonist["modernSrc"]})
    for entry in protagonist["files"]:
        if entry["src"] in geometry["files"]:
            entry["portraitGeometry"] = geometry["files"][entry["src"]]
    photos = []
    for index, (original_name, expected_hash) in enumerate(ORIGINAL_PHOTOS, 1):
        src = f"{ART_DIR}/source-photos/genealogy-{index:02}.png"
        info = asset_info(src)
        require(info["sha256"] == expected_hash, f"Original genealogy photograph changed: {src}")
        photos.append({**info, "photoNumber": index, "originalFilename": original_name,
                       "sourceKind": "user-original-photo", "pixelEditing": False,
                       "displayLabel": f"족보 원본 {index}"})
    require(set(backgrounds) == {scene["sceneId"] for scene in all_scenes}, "Incomplete background map")
    require(backgrounds["THR-PRO-S03"]["src"] == backgrounds["THR-C01-S01"]["src"], "Prologue background handoff mismatch")
    missing_principals = [{"characterId": c["characterId"], "identityId": c["identityId"], "name": c["name"],
                           "ageLabel": c["ageLabel"], "sceneIds": c["sourceSceneIds"], "priority": c["portraitPriority"]}
                          for c in characters.values() if c["portraitStatus"] == "unmade-principal"]
    authored_scene_props = [{"sceneId": scene["sceneId"], "staging": scene["staging"],
                             "status": "requires-runtime-staging-review"} for scene in all_scenes]
    audit = {"schemaVersion": 1,
             "status": "principal-portraits-and-fullbody-sources-ready-runtime-composition-review-pending" if not missing_principals else "mapped-art-principal-portraits-incomplete",
             "sceneBackgroundCount": len(backgrounds), "distinctBackgroundCount": len({b["src"] for b in backgrounds.values()}),
             "characterAppearanceCount": len(characters), "characterIdentityCount": len({c["identityId"] for c in characters.values()}),
             "existingPrincipalPortraitCount": sum(c["portraitStatus"] == "existing-character-reviewed" for c in characters.values()),
             "generatedRecurringPortraitCount": len(recurring_appearance_ids),
             "generatedPrincipalPortraitCount": len(set(atlas_portraits) - recurring_appearance_ids),
             "fullbodyPortraitCount": len(completed), "generatedPortraitAtlasCount": len(portrait_atlases),
             "missingPrincipalAppearanceCount": len(missing_principals),
             "missingRecurringCivilianAppearances": sum(c["priority"] == "recurring-civilian" for c in missing_principals),
             "missingHistoricalPersonAppearances": sum(c["priority"] == "historical-person" for c in missing_principals),
             "unmadeNamedLocalRoles": sum(c["priority"] == "named-local-role" for c in missing_principals),
             "supportingBackgroundRoleCount": sum(c["portraitStatus"] == "background-role" for c in characters.values()),
             "originalGenealogyPhotoCount": len(photos), "missingSourceFiles": [],
             "sameFaceReusedForDifferentPeople": [], "missingPrincipalPortraits": missing_principals,
             "identityContinuityChecks": continuity_checks,
             "speakerAliasChecks": "passed", "npcPositionChecks": "all-left",
             "atlasSourceRectChecks": f"{len(atlas_portraits)} in-bounds portraits; distinct identity slots; body extensions use alpha-envelope CSS clips where bounding boxes meet",
             "specificSceneProps": authored_scene_props,
             "limitations": ["Existing illustrations establish compatible settings; they do not contain every authored action or object.",
                              "The new spring queue illustration includes the waiting residents, unsteady grandmother and child; the later collapse/help actions still follow runtime staging.",
                              "Portrait source rectangles and alpha-envelope clips are required because generated grid positions are approximate; body-extension runtime composites are reviewed separately from source files.",
                              "Unmade principal portraits have no substitute stock face. Their dialogue and identity remain available.",
                              "Supporting occupations can be staged inside background illustrations or as off-screen speech; individual portraits are not required.",
                              "Book closeup and the original-photo layers are implemented in the runtime, not baked into a new raster image."],
             "visualReview": {"method": "source-file identity review, full alpha-component crop validation and manual skin-face landmark audits; actual browser composition reviewed separately",
                              "backgroundFileReview": True, "knownPortraitFileReview": True,
                              "generatedPortraitFileReview": True, "generatedPortraitAppearanceCount": len(atlas_portraits),
                              "runtimeDesktopReview": False, "runtimeMobileReview": False}}
    manifest = {"schemaVersion": 1, "contentVersion": manuscript["contentVersion"],
                "status": audit["status"], "backgrounds": backgrounds, "characters": characters,
                "sceneCharacters": scene_characters, "recordVoices": record_voices,
                "protagonist": protagonist, "approvedGeometry": geometry, "sourcePhotos": photos, "relationships": principal_relationships(),
                "backgroundCatalog": background_assets, "portraitAtlases": portrait_atlases,
                "audit": {k: audit[k] for k in ["sceneBackgroundCount", "distinctBackgroundCount", "generatedRecurringPortraitCount", "generatedPortraitAtlasCount", "missingPrincipalAppearanceCount", "originalGenealogyPhotoCount"]}}
    return manifest, audit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    manifest, audit = build()
    encoded = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    files = {"dist/three-complete-art.json": encoded,
             "dist/three-complete-art.js": "globalThis.THREE_COMPLETE_ART=" + encoded.rstrip() + ";\n",
             "docs/three-content/art-import-audit.json": json.dumps(audit, ensure_ascii=False, indent=2) + "\n"}
    for relative, content in files.items():
        destination = ROOT / relative
        if args.check:
            require(destination.is_file() and destination.read_text(encoding="utf-8") == content, f"Stale art file: {relative}")
        else:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(content, encoding="utf-8")
    print(json.dumps({"status": "checked" if args.check else "generated", **manifest["audit"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()

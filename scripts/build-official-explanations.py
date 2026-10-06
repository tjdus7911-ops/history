"""Build learning explanations for the canonical official-exam catalog.

Existing hand-authored explanations are preserved at runtime. This generator turns
OCR captured from the official question crops into evidence records and concise
fallback explanations for canonical questions that otherwise only have an answer-
number placeholder. The official answer catalog remains the only grading source.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
ERA_LABELS = {
    "ancient": "선사·고대",
    "goryeo": "고려",
    "joseon": "조선",
    "empire": "개항기·대한제국",
    "occupation": "일제강점기",
    "republic": "대한민국",
}
CHOICE_LABELS = ["①", "②", "③", "④", "⑤"]
POINT_LINE = re.compile(r"^\[?\s*[123]\s*점\s*\]?$|^결점\]$|^\[[^]]{0,3}점\]$")
QUESTION_LINE = re.compile(r"^\s*\d{1,2}\s*[.]\s*")
MARKER_CHARACTERS = set("①②③④⑤㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫㉬㉭㉮㉯㉰㉱㉲㉳㉴㉵㉶㉷㉸㉹㉺㉻㉼㉽㉾㉿@")
HISTORY_HINTS = ("시대", "왕", "왕조", "나라", "국가", "전투", "전쟁", "반란", "봉기", "운동", "개혁", "혁명", "독립", "광복", "정부", "위원회", "군대", "군사", "제도", "정책", "법", "조약", "기구", "기관", "학교", "교육", "불교", "유교", "문화", "유산", "유적", "토기", "석기", "청동", "철기", "고분", "무덤", "사찰", "서원", "궁", "탑", "수도", "도읍", "지방", "토지", "세금", "경제", "신분", "농민", "의병", "연호", "일본", "중국", "미국", "소련", "고구려", "백제", "신라", "가야", "발해", "고려", "조선", "대한제국", "대한민국", "북한", "남북")
CURATED_EXPLANATIONS = {
    "official-57-basic-45": "자료의 이윤재·최현배, 『조선말 큰사전』 원고, 「한글 맞춤법 통일안」은 조선어 학회를 가리킵니다. 조선어 학회는 일제의 탄압 속에서도 우리말과 글을 연구하고 사전 편찬을 추진했으므로 공식 정답은 ④입니다.",
    "official-57-basic-46": "광주 금남로, YWCA 옛터, 옛 전남도청은 1980년 5·18 민주화 운동의 핵심 현장입니다. 광주 시민들이 계엄군에 맞서 민주화를 요구한 사건이므로 공식 정답은 ④입니다.",
    "official-57-basic-49": "서독 파견 광부·간호사와 베트남 파견 기술자는 박정희 정부 시기의 해외 인력 진출을 보여 줍니다. 같은 시기에 농촌 근대화를 내세운 새마을 운동이 시작되었으므로 공식 정답은 ①입니다.",
    "official-57-advanced-06": "함양 상림을 조성하고 진성 여왕에게 시무책 10여 조를 올린 인물은 최치원입니다. 최치원은 신라 말의 사회상을 담은 「해인사 묘길상탑기」를 남겼으므로 공식 정답은 ④입니다.",
    "official-57-advanced-32": "초량 왜관, 개항 뒤의 조계, 두모포 수세 사건은 모두 부산과 관련된 단서입니다. 따라서 지도에서 부산을 표시한 ④가 공식 정답입니다.",
    "official-57-advanced-35": "자료의 저술은 고려의 최승로, 조선 초의 정도전, 조선 후기의 박세당, 근대의 박은식으로 이어집니다. 따라서 (나)→(다)→(가)→(라) 순서인 공식 정답 ④가 맞습니다.",
    "official-58-basic-35": "동학을 계승하고 손병희가 교단을 정비했으며 어린이날 제정과 『개벽』·『신여성』 발간에 기여한 종교는 천도교입니다. 따라서 공식 정답은 ③입니다.",
    "official-58-basic-39": "사회주의 계열과 비타협적 민족주의 계열이 민족 유일당 운동의 결과로 함께 만든 단체는 신간회입니다. 신간회는 일제에 맞선 합법적 민족 협동 전선이므로 공식 정답은 ①입니다.",
    "official-60-advanced-27": "(가)는 신라 국학, (나)는 고려 국자감의 7재, (다)는 조선 성균관, (라)는 근대 육영공원입니다. 신문왕의 국학 설치와 성균관의 석전대제 설명이 맞고, 지방 학교 설명과 교육 입국 조서 설명은 각각 향교·한성 사범 학교와 관련되므로 공식 정답은 ②입니다.",
    "official-60-advanced-36": "서울 전차 개통은 1899년의 일입니다. 보기 중 그 이후의 사실은 1904년 베델과 양기탁이 대한매일신보를 창간한 것이므로 공식 정답은 ②입니다.",
    "official-61-basic-48": "2002년 한일 월드컵은 김대중 정부 시기의 사실입니다. 이 정부는 외환 위기 극복 과정에서 국제 통화 기금(IMF) 구제 금융을 조기에 상환했으므로 공식 정답은 ④입니다.",
    "official-61-basic-50": "신문왕의 달구벌 천도 시도, 공산 전투, 2·28 민주 운동, 국채 보상 운동은 모두 대구와 연결됩니다. 따라서 공식 정답은 ①입니다.",
    "official-63-advanced-25": "『성시전도』와 박제가의 시는 조선 후기 한양의 활발한 상업을 보여 줍니다. 이 시기에는 인삼과 담배 같은 상품 작물이 널리 재배되었으므로 공식 정답은 ⑤입니다.",
    "official-63-advanced-42": "이 문항은 공식 정답표 정정으로 모든 선택지가 정답으로 인정된 문항입니다. 서비스는 정정된 공식 채점 기준을 그대로 적용하므로 어느 선택지를 골라도 정답 처리합니다.",
    "official-63-advanced-47": "고구려 멸망(668)인 (나) → 몽골 침입 때 처인성 전투(1232)인 (가) → 임진왜란 동래성 전투(1592)인 (라) → 정묘호란 용골산성 전투(1627)인 (다) 순서입니다. 따라서 공식 정답은 ③입니다.",
    "official-64-advanced-43": "(가)는 신문왕 때 완성된 신라 9주, (나)는 고려의 5도 양계, (다)는 조선의 8도, (라)는 갑오개혁기의 23부입니다. 옳은 설명은 신문왕 때 정비된 (가)와 관찰사가 수령을 감독한 (다)이므로 공식 정답은 ②입니다.",
    "official-65-advanced-22": "안견이 안평 대군의 꿈을 바탕으로 그린 작품은 「몽유도원도」입니다. 현실 세계에서 이상 세계로 이어지는 독특한 산수 구성을 보여 주는 ①이 공식 정답입니다.",
    "official-67-basic-04": "보고서의 무령왕릉은 한성·웅진 시기 백제 문화유산입니다. 보기 중 서울 풍납·몽촌 일대의 백제 도성 유적인 몽촌 토성이 같은 백제 문화유산이므로 공식 정답은 ③입니다.",
    "official-68-advanced-26": "자료는 효종의 계모 자의 대비가 입을 상복 기간을 둘러싼 1차 예송입니다. 1659년의 사건이므로 인조반정(1623) 뒤, 경신환국(1680) 전인 (라)에 해당하여 공식 정답은 ④입니다.",
    "official-69-basic-24": "멀리 있는 적의 출현을 횃불과 연기로 단계별 전달한 제도는 봉수제입니다. 역참·조운·파발과 달리 군사적 긴급 신호를 전달했으므로 공식 정답은 ①입니다.",
    "official-69-basic-27": "탕평비를 세우고 탕평책을 적극 추진한 왕은 영조입니다. 영조는 군포 부담을 2필에서 1필로 줄인 균역법을 시행했으므로 공식 정답은 ②입니다.",
    "official-69-basic-43": "자료의 노래와 흥남 철수는 6·25 전쟁을 가리킵니다. 반민족 행위 처벌법 제정은 전쟁 전인 1948년의 사실이므로 전쟁 중의 사실이 아닌 ④가 공식 정답입니다.",
    "official-69-advanced-24": "과전을 없애고 현직 관리에게만 직전을 지급한 왕은 세조입니다. 세조 때 불교 경전을 간행하기 위해 간경도감을 설치했으므로 공식 정답은 ①입니다.",
    "official-69-advanced-47": "통일 신라의 9서당인 (가) → 고려 중앙군의 응양군인 (나) → 숙종 때 완성된 5군영의 금위영인 (라) → 개항기 군영인 무위영인 (다) 순서입니다. 따라서 공식 정답은 ②입니다.",
    "official-69-advanced-48": "자료의 왕은 신문왕입니다. 신문왕은 왕권을 위협한 김흠돌의 난을 진압했고, 병부·상대등은 법흥왕, 나선 정벌은 효종, 정계·계백료서는 고려 태조의 사실이므로 공식 정답은 ①입니다.",
    "official-70-advanced-39": "나운규의 영화 「아리랑」은 1926년에 발표되었습니다. 같은 1920년대에 신경향파 문학가들이 카프(KAPF)를 결성해 활동했으므로 공식 정답은 ⑤입니다.",
    "official-72-advanced-38": "신한촌과 1937년 한인의 중앙아시아 강제 이주는 연해주의 역사입니다. 지도에서 연해주를 가리킨 (나)가 맞으므로 공식 정답은 ②입니다.",
    "official-72-advanced-47": "신문왕의 관료전 지급·녹읍 폐지인 (가) → 고려 경종의 시정 전시과인 (나) → 고려 말 과전법인 (다) → 세조의 직전법인 (라) 순서입니다. 따라서 공식 정답은 ①입니다.",
    "official-72-advanced-48": "㉠은 녹읍을 폐지한 신문왕, ㉡은 직전법을 시행한 세조입니다. 신문왕의 9주 5소경 정비와 세조의 6조 직계제가 옳으므로 ㄴ·ㄷ 조합인 공식 정답 ③이 맞습니다.",
    "official-73-basic-13": "이자겸의 난은 1126년에 일어났습니다. 귀주 대첩(1019) 뒤이자 무신 정변(1170) 전인 (나)에 해당하므로 공식 정답은 ②입니다.",
    "official-73-basic-16": "고려와 조선 초에 재해나 빈곤을 겪는 백성에게 비축 곡물을 빌려주거나 나누어 준 구휼 기관은 의창입니다. 따라서 공식 정답은 ①입니다.",
    "official-73-basic-22": "1467년 세조 때 대리석으로 만들고 서유기·불상·보살상 등을 조각한 문화유산은 서울 원각사지 십층 석탑입니다. 따라서 공식 정답은 ①입니다.",
    "official-73-basic-36": "전환국에서 발행했고 화폐 정리 사업으로 유통이 중단된 보조 화폐는 백동화입니다. 따라서 공식 정답은 ②입니다.",
    "official-74-advanced-48": "IMF 구제 금융 조기 상환은 김대중 정부 시기의 사실입니다. 같은 정부에서 외환 위기 극복을 위한 사회적 합의 기구인 노사정 위원회가 출범했으므로 공식 정답은 ⑤입니다.",
    "official-76-advanced-27": "혜원 신윤복은 양반과 기녀의 풍속을 섬세한 색채로 그렸습니다. 보기 ③의 「월하정인」이 신윤복의 작품이며, 나머지는 다른 화가의 작품과 구분해야 하므로 공식 정답은 ③입니다.",
    "official-78-advanced-14": "직지는 고려 시대 청주 흥덕사에서 금속 활자로 인쇄되었습니다. 보기 ③의 평창 월정사 팔각 구층 석탑도 고려 문화유산이므로 공식 정답은 ③입니다.",
    "official-78-advanced-24": "사도 세자의 묘를 수원으로 옮길 때 한강에 배다리를 놓게 한 왕은 정조입니다. 정조는 규장각을 중심으로 초계문신제를 시행했으므로 공식 정답은 ⑤입니다.",
    "official-79-advanced-37": "나운규의 영화 「아리랑」이 개봉된 1926년에는 카프(KAPF)의 신경향파 작가들이 활동했습니다. 다른 보기는 개항기·대한제국 시기의 사실이므로 공식 정답은 ③입니다.",
    "official-79-advanced-45": "남한만의 단독 선거에 반대한 무장대와 토벌대의 충돌, 제주 민간인 희생은 제주 4·3 사건을 가리킵니다. 이후 진상 규명과 희생자 명예 회복을 위한 특별법이 제정되었으므로 공식 정답은 ⑤입니다.",
}


def normalize_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value or "").strip()
    value = value.replace("바귀", "바퀴").replace("미을", "마을")
    value = value.replace("함/게", "함께").replace("실치", "설치")
    value = value.replace("실았던뉴석기", "살았던 구석기").replace("맡0갔다", "맡았다")
    value = value.replace("고러", "고려").replace("전생 중", "전쟁 중").replace("(바에", "(나)에")
    value = value.replace("고려 알", "고려 말").replace("조신 후기", "조선 후기").replace("귀즈", "퀴즈")
    value = re.sub(r"\s+([,.?!])", r"\1", value)
    return value.strip(" ·•-/")


def text_quality(value: str) -> float:
    compact = re.sub(r"\s", "", value)
    if not compact:
        return 0
    hangul = len(re.findall(r"[가-힣]", compact))
    readable = len(re.findall(r"[가-힣A-Za-z0-9一-龥,.()·~\-]", compact))
    return (hangul / len(compact)) * 0.75 + (readable / len(compact)) * 0.25


def readable_korean(value: str) -> bool:
    compact = re.sub(r"\s", "", value)
    if not compact:
        return False
    hangul = len(re.findall(r"[가-힣]", compact))
    letters = len(re.findall(r"[가-힣A-Za-z一-龥]", compact))
    strange = len(re.findall(r"[^가-힣A-Za-z0-9一-龥,.?!()·~:'\"\-/%]", compact))
    suspicious = bool(re.search(r"[|卜缸]|[A-Z]{2,}|[A-Z](?=[가-힣])", compact))
    return hangul >= 3 and hangul / max(1, letters) >= 0.78 and strange / len(compact) <= 0.08 and not suspicious


def readable_choice(value: str) -> bool:
    compact = re.sub(r"\s", "", value)
    hangul = len(re.findall(r"[가-힣]", compact))
    letters = len(re.findall(r"[가-힣A-Za-z一-龥]", compact))
    strange = len(re.findall(r"[^가-힣A-Za-z0-9一-龥,.?!()·~:'\"\-/%]", compact))
    suspicious = bool(re.search(r"[|卜缸]|[A-Z]{2,}|[A-Z](?=[가-힣])", compact))
    return len(compact) >= 2 and hangul >= 2 and hangul / max(1, letters) >= 0.75 and strange / max(1, len(compact)) <= 0.08 and not suspicious


def is_point_line(value: str) -> bool:
    return bool(POINT_LINE.fullmatch(value.strip()))


def first_word(line: dict) -> dict:
    words = line.get("words") or []
    return words[0] if words and isinstance(words[0], dict) else {}


def is_choice_marker(line: dict) -> bool:
    word = first_word(line)
    token = str(word.get("text") or "").strip()
    if not token or is_point_line(line.get("text", "")):
        return False
    if token[0] in MARKER_CHARACTERS:
        return True
    if len(token) <= 4 and any(character in token for character in "()"):
        return not re.fullmatch(r"\([가-힣]{1,2}\)", token)
    return False


def remove_choice_marker(value: str) -> str:
    return normalize_text(re.sub(r"^(?:[①②③④⑤㉠-㉿@]|\([^ ]{0,3}\)?|\[[^ ]{0,3}\]?)\s*", "", value, count=1))


def ordered_lines(ocr_row: dict) -> list[dict]:
    lines = []
    for index, source in enumerate(ocr_row.get("lines") or []):
        text = normalize_text(source.get("text", ""))
        if not text:
            continue
        lines.append({**source, "text": text, "_index": index, "x": float(source.get("x") or 0), "y": float(source.get("y") or 0)})
    return sorted(lines, key=lambda item: (round(item["y"] / 15), item["x"], item["y"], item["_index"]))


def question_stem(lines: list[dict], number: int) -> str:
    expected = re.compile(rf"^\s*{number}\s*[.]\s*")
    line = next((item["text"] for item in lines if expected.match(item["text"])), "")
    if not line:
        line = next((item["text"] for item in lines if QUESTION_LINE.match(item["text"])), "")
    line = QUESTION_LINE.sub("", line)
    line = re.sub(r"\s*\[[^]]{0,4}\]\s*$", "", line)
    line = normalize_text(line)
    return line if text_quality(line) >= 0.48 else ""


def choice_lines(lines: list[dict], choice_count: int) -> tuple[list[str], float | None]:
    marked = [line for line in lines if is_choice_marker(line)]
    if len(marked) < choice_count:
        content_y = [line["y"] for line in lines if not is_point_line(line["text"])]
        cutoff = max(content_y, default=0) * 0.58
        tail = []
        for line in lines:
            value = remove_choice_marker(line["text"])
            if line["y"] < cutoff or is_point_line(line["text"]) or QUESTION_LINE.match(line["text"]):
                continue
            if text_quality(value) >= 0.48 and readable_choice(value):
                tail.append(line)
        if len(tail) == choice_count:
            return [remove_choice_marker(line["text"]) for line in tail], tail[0]["y"]
        return [], None
    selected = marked[-choice_count:]
    raw_values = [remove_choice_marker(line["text"]) for line in selected]
    values = [value if text_quality(value) >= 0.48 and readable_choice(value) else "" for value in raw_values]
    return values, selected[0]["y"]


def clue_text(lines: list[dict], stem: str, first_choice_y: float | None) -> str:
    candidates = []
    content_y = [line["y"] for line in lines if not is_point_line(line["text"])]
    fallback_cutoff = max(content_y, default=0) * 0.68
    for line in lines:
        value = line["text"]
        if value == stem or QUESTION_LINE.match(value) or is_point_line(value) or is_choice_marker(line):
            continue
        if line["y"] >= (first_choice_y if first_choice_y is not None else fallback_cutoff):
            continue
        if re.fullmatch(r"[0-9./~\- ]+", value) or len(value) < 4 or text_quality(value) < 0.62 or not readable_korean(value):
            continue
        if not any(hint in value for hint in HISTORY_HINTS) and not re.search(r"\b\d{3,4}년?\b", value):
            continue
        candidates.append(value)
    selected = []
    for value in candidates:
        if value not in selected:
            selected.append(value)
        if len(" ".join(selected)) >= 105 or len(selected) == 3:
            break
    clue = normalize_text(" ".join(selected))[:135].rstrip(" ,·")
    return clue


def question_kind(stem: str) -> str:
    if "옳지 않은" in stem or "적절하지 않은" in stem:
        return "incorrect"
    if any(word in stem for word in ("순서", "나열", "먼저", "이후")):
        return "sequence"
    if any(word in stem for word in ("시기", "연표", "사이")):
        return "period"
    if any(word in stem for word in ("지역", "지도", "장소")):
        return "location"
    if any(word in stem for word in ("사진", "그림", "문화유산", "유물", "건축물")):
        return "visual"
    return "fact"


def make_explanation(source: dict, stem: str, clue: str, correct_choice: str) -> str:
    answer_label = "없음" if source["answer"] is None else CHOICE_LABELS[source["answer"]]
    era = ERA_LABELS[source["primaryEra"]]
    subject = f"‘{stem}’" if stem else f"{era} 범위의 핵심 사실"
    intro = f"이 문제는 {subject}에 답하려면 자료의 핵심 개념을 판별해야 합니다."
    if clue:
        evidence = f"자료의 ‘{clue}’라는 내용이 판별의 핵심 단서입니다."
    elif question_kind(stem) == "visual":
        evidence = "이미지의 형태·배치·재료와 시대적 특징을 함께 비교하는 것이 핵심입니다."
    else:
        evidence = f"{era}의 사건·인물·제도를 서로 연결해 판단해야 합니다."

    if source["answer"] is None:
        conclusion = "공식 정답표 정정에 따라 모든 선택지가 정답으로 인정되므로, 서비스도 그 채점 기준을 그대로 적용합니다."
    elif correct_choice:
        kind = question_kind(stem)
        if kind == "incorrect":
            conclusion = f"공식 정답은 {answer_label}이고, 선택 내용은 ‘{correct_choice}’입니다. 이 내용은 해당 대상의 사실과 일치하지 않습니다."
        elif kind == "sequence":
            conclusion = f"정답 {answer_label}의 ‘{correct_choice}’가 사건의 선후 관계에 맞는 배열입니다."
        elif kind == "period":
            conclusion = f"정답 {answer_label}의 ‘{correct_choice}’가 자료의 사건이 놓이는 시기와 일치합니다."
        elif kind == "location":
            conclusion = f"정답 {answer_label}의 ‘{correct_choice}’가 자료가 가리키는 지역·위치와 연결됩니다."
        elif kind == "visual":
            conclusion = f"공식 정답은 {answer_label}이고, 선택 내용은 ‘{correct_choice}’입니다. 이 내용이 이미지에서 확인해야 할 특징과 일치합니다."
        else:
            conclusion = f"공식 정답은 {answer_label}이고, 선택 내용은 ‘{correct_choice}’입니다. 이 내용이 자료의 조건과 일치하며, 다른 선택지는 시기·인물·제도의 특징을 구분해야 합니다."
    else:
        kind = question_kind(stem)
        if kind == "visual":
            conclusion = f"원문 이미지의 특징을 비교하면 공식 정답 {answer_label}에 해당하며, 유사한 문화유산·지도·인물과 구분해야 합니다."
        elif kind == "sequence":
            conclusion = f"각 사건의 선후 관계를 적용하면 공식 정답 {answer_label}의 배열이 맞습니다."
        elif kind == "period":
            conclusion = f"자료의 사건을 연표에 놓으면 공식 정답 {answer_label}의 시기에 해당합니다."
        elif kind == "incorrect":
            conclusion = f"공식 정답 {answer_label}는 해당 대상의 사실과 일치하지 않는 선택지이며, 나머지는 관련 사실입니다."
        else:
            conclusion = f"이 단서를 선택지와 대조하면 공식 정답 {answer_label}이 자료의 조건에 해당합니다."
    return " ".join((intro, evidence, conclusion))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ocr-json", required=True, type=Path, help="Windows Korean OCR output for the 1,300 official question crops")
    args = parser.parse_args()

    catalog = json.loads((DIST / "official-exam-catalog.json").read_text(encoding="utf-8"))
    ocr = json.loads(args.ocr_json.read_text(encoding="utf-8"))
    ocr_by_stem = {Path(item["file"]).stem: item for item in ocr}
    records = []
    for source in catalog:
        slug = "advanced" if source["examLevel"] == "심화" else "basic"
        image_stem = f"{source['examRound']}-{slug}-{source['questionNumber']:02d}"
        if image_stem not in ocr_by_stem:
            raise ValueError(f"missing OCR source for {source['officialQuestionId']}")
        lines = ordered_lines(ocr_by_stem[image_stem])
        count = 5 if source["examLevel"] == "심화" else 4
        choices, first_choice_y = choice_lines(lines, count)
        stem = question_stem(lines, source["questionNumber"])
        clue = "" if source["answer"] is None else clue_text(lines, stem, first_choice_y)
        answer = source["answer"]
        correct_choice = choices[answer] if answer is not None and len(choices) == count else ""
        explanation = CURATED_EXPLANATIONS.get(source["officialQuestionId"]) or make_explanation(source, stem, clue, correct_choice)
        records.append({
            "officialQuestionId": source["officialQuestionId"],
            "question": stem,
            "clue": clue,
            "correctChoice": correct_choice,
            "explanation": explanation,
            "curated": source["officialQuestionId"] in CURATED_EXPLANATIONS,
        })

    if len(records) != 1300 or len({item["officialQuestionId"] for item in records}) != 1300:
        raise ValueError("expected 1,300 unique explanation records")
    if any(not item["explanation"].strip() for item in records):
        raise ValueError("empty explanation generated")
    payload = {
        "schemaVersion": 1,
        "canonicalQuestionCount": len(records),
        "officialAnswerSource": "official-exam-catalog.json",
        "records": records,
    }
    (DIST / "official-exam-explanations.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    js = "/* Generated from the canonical official catalog and OCR of official question crops. */\n"
    js += "globalThis.OFFICIAL_EXAM_EXPLANATION_RECORDS="
    js += json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    js += ";\n"
    (DIST / "official-exam-explanations.js").write_text(js, encoding="utf-8")
    with_choice = sum(bool(item["correctChoice"]) for item in records)
    with_clue = sum(bool(item["clue"]) for item in records)
    print(f"OK {len(records)} explanations; {with_clue} clues; {with_choice} exact correct-choice texts")


if __name__ == "__main__":
    main()

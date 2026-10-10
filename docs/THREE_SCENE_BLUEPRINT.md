# 전체 씬 상세 설계

기준: `55609d66afc269394ad604b47bde18aebf5d0ae3`.

상태: 제작 전 기획 제안. 운영 데이터로 로드하지 않는다. 기존 30챕터·90씬 원본과 모든 서비스 파일을 보존한다.

215개 씬의 제작용 JSON 설계다. 대본 완성이나 게임 구현 완료를 뜻하지 않는다. genealogyLinks는 역사 사건 ID로 계보의 관련사건에 역연결한다. backgroundAsset/characterAssets는 에셋 계획의 ID이다. questionIds=[]는 확보된 실제 기출이 없음을 뜻하며, questionSlotStatus=TBD는 출제 문항이 아니다. 선택의 JOIN은 해당 씬 내부 합류 지점이고 다음 진행은 nextSceneId를 따른다. 모든 민간 사건·후속 대화는 허구다.

## CH.01 빈 창고와 왕의 약속

```json
[
  {
    "sceneId": "THR-C01-S01",
    "chapterId": "THR-C01",
    "sceneTitle": "빈 자루의 줄",
    "historicalYear": "194년 봄(허구 도입)",
    "location": "고구려 농촌",
    "historicalEventId": "H-G3",
    "characters": [
      "서아",
      "농민 연우"
    ],
    "backgroundAsset": "BG-1f556df310",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C01-6cb6a1d",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 쓰러진 어머니를 부축한다",
    "storyObjective": "서아가 쓰러진 어머니를 부축한다. 연우는 한 가족만 살리면 뒤의 사람은 누가 돌보느냐고 묻는다.",
    "conflict": "배고픈 아이를 돕자 다른 가족이 배급 순서를 항의한다",
    "dialogueOutline": "서아가 쓰러진 어머니를 부축한다. 연우는 한 가족만 살리면 뒤의 사람은 누가 돌보느냐고 묻는다.",
    "choices": [
      {
        "choiceId": "THR-C01-S01-B1",
        "label": "물을 먼저 나른다",
        "action": "물을 먼저 나른다",
        "npcReaction": "아이의 경계가 풀리지만 배급 순서 문제는 남는다",
        "followupDialogueOutline": "서아가 물을 먼저 나른다 행동을 실행한다. 농민 연우의 반응: 아이의 경계가 풀리지만 배급 순서 문제는 남는다. 상대의 답을 듣고 현재 갈등인 “배고픈 아이를 돕자 다른 가족이 배급 순서를 항의한다의 처리 결과를 확인한다.",
        "relationshipEffect": "아이의 경계가 풀리지만 배급 순서 문제는 남는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C01-S01-JOIN"
      },
      {
        "choiceId": "THR-C01-S01-B2",
        "label": "가족별 사정을 적는다",
        "action": "가족별 사정을 적는다",
        "npcReaction": "연우가 증언을 맡기지만 구조가 늦었다고 서운해한다",
        "followupDialogueOutline": "서아가 가족별 사정을 적는다 행동을 실행한다. 농민 연우의 반응: 연우가 증언을 맡기지만 구조가 늦었다고 서운해한다. 상대의 답을 듣고 현재 갈등인 “배고픈 아이를 돕자 다른 가족이 배급 순서를 항의한다의 처리 결과를 확인한다.",
        "relationshipEffect": "연우가 증언을 맡기지만 구조가 늦었다고 서운해한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C01-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "배고픈 아이를 돕자 다른 가족이 배급 순서를 항의한다",
      "turn": "서아가 쓰러진 어머니를 부축한다. 연우는 한 가족만 살리면 뒤의 사람은 누가 돌보느냐고 묻는다.",
      "end": "남을 구하는 충동에서 상환까지 책임지는 약속으로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "진대법 제정: 관곡 대여와 상환",
    "questionIds": [],
    "genealogyLinks": [
      "H-G3"
    ],
    "nextSceneId": "THR-C01-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “194년 봄(허구 도입) / 고구려 농촌”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C01-S02",
    "chapterId": "THR-C01",
    "sceneTitle": "잠긴 창고",
    "historicalYear": "194년 봄(허구)",
    "location": "관곡 창고",
    "historicalEventId": "H-G3",
    "characters": [
      "서아",
      "창고지기 모진"
    ],
    "backgroundAsset": "BG-07f831f7ac",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C01-e1cbb8b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 열쇠를 요구하자 모진이 봉인과 책임자를 보여준다",
    "storyObjective": "서아가 열쇠를 요구하자 모진이 봉인과 책임자를 보여준다. 두 사람은 구휼을 개인의 선의로 해결할 수 없음을 깨닫는다.",
    "conflict": "곡식은 있으나 임의 반출하면 담당자가 처벌받는다",
    "dialogueOutline": "서아가 열쇠를 요구하자 모진이 봉인과 책임자를 보여준다. 두 사람은 구휼을 개인의 선의로 해결할 수 없음을 깨닫는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "곡식은 있으나 임의 반출하면 담당자가 처벌받는다",
      "turn": "서아가 열쇠를 요구하자 모진이 봉인과 책임자를 보여준다. 두 사람은 구휼을 개인의 선의로 해결할 수 없음을 깨닫는다.",
      "end": "남을 구하는 충동에서 상환까지 책임지는 약속으로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "진대법 제정: 관곡 대여와 상환",
    "questionIds": [],
    "genealogyLinks": [
      "H-G3"
    ],
    "nextSceneId": "THR-C01-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “194년 봄(허구) / 관곡 창고”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C01-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C01-S03",
    "chapterId": "THR-C01",
    "sceneTitle": "누구의 부인가",
    "historicalYear": "194년(개편 연도 미확정)",
    "location": "지방 관청",
    "historicalEventId": "H-G1",
    "characters": [
      "서아",
      "관리 해솔"
    ],
    "backgroundAsset": "BG-c03a2aaf5b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C01-ac97b81",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "해솔은 행정적 부 편제가 명령을 전달하는 통로라고 설명한다",
    "storyObjective": "해솔은 행정적 부 편제가 명령을 전달하는 통로라고 설명한다. 서아는 같은 마을 가족이 다른 명부에 갈라진 사례를 찾아 합친다.",
    "conflict": "옛 부족 이름으로 주민을 나누어 구휼 책임을 떠넘긴다",
    "dialogueOutline": "해솔은 행정적 부 편제가 명령을 전달하는 통로라고 설명한다. 서아는 같은 마을 가족이 다른 명부에 갈라진 사례를 찾아 합친다.",
    "choices": [],
    "emotionalBeat": {
      "start": "옛 부족 이름으로 주민을 나누어 구휼 책임을 떠넘긴다",
      "turn": "해솔은 행정적 부 편제가 명령을 전달하는 통로라고 설명한다. 서아는 같은 마을 가족이 다른 명부에 갈라진 사례를 찾아 합친다.",
      "end": "남을 구하는 충동에서 상환까지 책임지는 약속으로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "5부를 행정적 성격으로 개편하는 왕권 강화",
    "questionIds": [],
    "genealogyLinks": [
      "H-G1"
    ],
    "nextSceneId": "THR-C01-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “194년(개편 연도 미확정) / 지방 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C01-S04",
    "chapterId": "THR-C01",
    "sceneTitle": "국상이 된 농부",
    "historicalYear": "191년 기록 회상",
    "location": "국상 집무처",
    "historicalEventId": "H-G2",
    "characters": [
      "서아",
      "을파소"
    ],
    "backgroundAsset": "BG-76652a0920",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C01-c3faab0",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 을파소의 농사 경험을 실무 능력으로 제시한다",
    "storyObjective": "서아가 을파소의 농사 경험을 실무 능력으로 제시한다. 을파소는 자신을 칭송하기보다 장부의 오류를 함께 고치자고 한다.",
    "conflict": "추천받은 인재를 출신 때문에 배척하는 귀족이 있다",
    "dialogueOutline": "서아가 을파소의 농사 경험을 실무 능력으로 제시한다. 을파소는 자신을 칭송하기보다 장부의 오류를 함께 고치자고 한다.",
    "choices": [
      {
        "choiceId": "THR-C01-S04-B1",
        "label": "실적을 제시한다",
        "action": "실적을 제시한다",
        "npcReaction": "귀족이 검산을 요구하고 을파소가 서아에게 검증을 맡긴다",
        "followupDialogueOutline": "서아가 실적을 제시한다 행동을 실행한다. 을파소의 반응: 귀족이 검산을 요구하고 을파소가 서아에게 검증을 맡긴다. 상대의 답을 듣고 현재 갈등인 “추천받은 인재를 출신 때문에 배척하는 귀족이 있다의 처리 결과를 확인한다.",
        "relationshipEffect": "귀족이 검산을 요구하고 을파소가 서아에게 검증을 맡긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C01-S04-JOIN"
      },
      {
        "choiceId": "THR-C01-S04-B2",
        "label": "농민 증언을 모은다",
        "action": "농민 증언을 모은다",
        "npcReaction": "농민이 발언 기회를 얻고 귀족은 공개 청문을 부담스러워한다",
        "followupDialogueOutline": "서아가 농민 증언을 모은다 행동을 실행한다. 을파소의 반응: 농민이 발언 기회를 얻고 귀족은 공개 청문을 부담스러워한다. 상대의 답을 듣고 현재 갈등인 “추천받은 인재를 출신 때문에 배척하는 귀족이 있다의 처리 결과를 확인한다.",
        "relationshipEffect": "농민이 발언 기회를 얻고 귀족은 공개 청문을 부담스러워한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C01-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "추천받은 인재를 출신 때문에 배척하는 귀족이 있다",
      "turn": "서아가 을파소의 농사 경험을 실무 능력으로 제시한다. 을파소는 자신을 칭송하기보다 장부의 오류를 함께 고치자고 한다.",
      "end": "남을 구하는 충동에서 상환까지 책임지는 약속으로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "능력에 따른 을파소 등용",
    "questionIds": [],
    "genealogyLinks": [
      "H-G2"
    ],
    "nextSceneId": "THR-C01-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “191년 기록 회상 / 국상 집무처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C01-S05",
    "chapterId": "THR-C01",
    "sceneTitle": "왕 앞의 계산",
    "historicalYear": "194년 10월",
    "location": "왕의 구휼 논의처",
    "historicalEventId": "H-G3",
    "characters": [
      "서아",
      "고국천왕"
    ],
    "backgroundAsset": "BG-499ae33b7f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C01-7be02d0",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "왕이 대여와 상환을 함께 제도화하는 이유를 묻는다",
    "storyObjective": "왕이 대여와 상환을 함께 제도화하는 이유를 묻는다. 서아는 지금의 배고픔과 다음 농사의 종자를 따로 계산해 대답한다.",
    "conflict": "당장 나누자는 주장과 다음 해 종자까지 남겨야 한다는 주장이 충돌한다",
    "dialogueOutline": "왕이 대여와 상환을 함께 제도화하는 이유를 묻는다. 서아는 지금의 배고픔과 다음 농사의 종자를 따로 계산해 대답한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "당장 나누자는 주장과 다음 해 종자까지 남겨야 한다는 주장이 충돌한다",
      "turn": "왕이 대여와 상환을 함께 제도화하는 이유를 묻는다. 서아는 지금의 배고픔과 다음 농사의 종자를 따로 계산해 대답한다.",
      "end": "남을 구하는 충동에서 상환까지 책임지는 약속으로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "진대법 제정: 관곡 대여와 상환",
    "questionIds": [],
    "genealogyLinks": [
      "H-G3"
    ],
    "nextSceneId": "THR-C01-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “194년 10월 / 왕의 구휼 논의처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C01-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C01-S06",
    "chapterId": "THR-C01",
    "sceneTitle": "첫 대여 장부",
    "historicalYear": "195년 봄(시행 뒤 허구)",
    "location": "관곡 창고",
    "historicalEventId": "H-G3",
    "characters": [
      "서아",
      "을파소"
    ],
    "backgroundAsset": "BG-07f831f7ac",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C01-c3faab0",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 대여량과 상환 시기를 소리 내어 확인한다",
    "storyObjective": "서아가 대여량과 상환 시기를 소리 내어 확인한다. 을파소는 시혜가 아니라 국가의 약속임을 기록하게 한다.",
    "conflict": "문자를 모르는 가족이 빚으로 속을까 두려워 서명을 거부한다",
    "dialogueOutline": "서아가 대여량과 상환 시기를 소리 내어 확인한다. 을파소는 시혜가 아니라 국가의 약속임을 기록하게 한다.",
    "choices": [
      {
        "choiceId": "THR-C01-S06-B1",
        "label": "이웃을 증인으로 부른다",
        "action": "이웃을 증인으로 부른다",
        "npcReaction": "가족이 안심하고 대여를 받는다",
        "followupDialogueOutline": "서아가 이웃을 증인으로 부른다 행동을 실행한다. 을파소의 반응: 가족이 안심하고 대여를 받는다. 상대의 답을 듣고 현재 갈등인 “문자를 모르는 가족이 빚으로 속을까 두려워 서명을 거부한다의 처리 결과를 확인한다.",
        "relationshipEffect": "가족이 안심하고 대여를 받는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C01-S06-JOIN"
      },
      {
        "choiceId": "THR-C01-S06-B2",
        "label": "계량 과정을 다시 보인다",
        "action": "계량 과정을 다시 보인다",
        "npcReaction": "모진이 체면을 다치지만 과다 계량 오류를 바로잡는다",
        "followupDialogueOutline": "서아가 계량 과정을 다시 보인다 행동을 실행한다. 을파소의 반응: 모진이 체면을 다치지만 과다 계량 오류를 바로잡는다. 상대의 답을 듣고 현재 갈등인 “문자를 모르는 가족이 빚으로 속을까 두려워 서명을 거부한다의 처리 결과를 확인한다.",
        "relationshipEffect": "모진이 체면을 다치지만 과다 계량 오류를 바로잡는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C01-S06-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "문자를 모르는 가족이 빚으로 속을까 두려워 서명을 거부한다",
      "turn": "서아가 대여량과 상환 시기를 소리 내어 확인한다. 을파소는 시혜가 아니라 국가의 약속임을 기록하게 한다.",
      "end": "남을 구하는 충동에서 상환까지 책임지는 약속으로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "진대법 제정: 관곡 대여와 상환",
    "questionIds": [],
    "genealogyLinks": [
      "H-G3"
    ],
    "nextSceneId": "THR-C01-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “195년 봄(시행 뒤 허구) / 관곡 창고”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C01-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C01-S07",
    "chapterId": "THR-C01",
    "sceneTitle": "돌아온 곡식",
    "historicalYear": "195년 10월(허구 사례)",
    "location": "상환 마당",
    "historicalEventId": "H-G3",
    "characters": [
      "서아",
      "농민 연우"
    ],
    "backgroundAsset": "BG-7081558dd8",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C01-6cb6a1d",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "연우가 자신도 갚지 못했다고 털어놓는다",
    "storyObjective": "연우가 자신도 갚지 못했다고 털어놓는다. 서아는 면제를 역사적 사실처럼 약속하지 않고 관청에 사정을 전달하는 일을 맡는다.",
    "conflict": "흉작을 겪은 집이 약속을 못 지켜 달아나려 한다",
    "dialogueOutline": "연우가 자신도 갚지 못했다고 털어놓는다. 서아는 면제를 역사적 사실처럼 약속하지 않고 관청에 사정을 전달하는 일을 맡는다.",
    "choices": [
      {
        "choiceId": "THR-C01-S07-B1",
        "label": "함께 사정을 설명한다",
        "action": "함께 사정을 설명한다",
        "npcReaction": "연우가 도망을 멈추고 심사를 기다린다",
        "followupDialogueOutline": "서아가 함께 사정을 설명한다 행동을 실행한다. 농민 연우의 반응: 연우가 도망을 멈추고 심사를 기다린다. 상대의 답을 듣고 현재 갈등인 “흉작을 겪은 집이 약속을 못 지켜 달아나려 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "연우가 도망을 멈추고 심사를 기다린다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C01-S07-JOIN"
      },
      {
        "choiceId": "THR-C01-S07-B2",
        "label": "수확 증거를 정리한다",
        "action": "수확 증거를 정리한다",
        "npcReaction": "담당자가 조사에 착수하며 서아와 연우의 신뢰가 회복된다",
        "followupDialogueOutline": "서아가 수확 증거를 정리한다 행동을 실행한다. 농민 연우의 반응: 담당자가 조사에 착수하며 서아와 연우의 신뢰가 회복된다. 상대의 답을 듣고 현재 갈등인 “흉작을 겪은 집이 약속을 못 지켜 달아나려 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "담당자가 조사에 착수하며 서아와 연우의 신뢰가 회복된다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C01-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "흉작을 겪은 집이 약속을 못 지켜 달아나려 한다",
      "turn": "연우가 자신도 갚지 못했다고 털어놓는다. 서아는 면제를 역사적 사실처럼 약속하지 않고 관청에 사정을 전달하는 일을 맡는다.",
      "end": "남을 구하는 충동에서 상환까지 책임지는 약속으로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "진대법 제정: 관곡 대여와 상환",
    "questionIds": [],
    "genealogyLinks": [
      "H-G3"
    ],
    "nextSceneId": "THR-C01-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “195년 10월(허구 사례) / 상환 마당”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C01-S08",
    "chapterId": "THR-C01",
    "sceneTitle": "남겨진 이름",
    "historicalYear": "195년→313년",
    "location": "창고 문 앞·기록책 전환",
    "historicalEventId": "H-G3",
    "characters": [
      "서아",
      "농민 연우"
    ],
    "backgroundAsset": "BG-c587569a84",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C01-6cb6a1d",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "연우는 다음 봄에도 자신들의 이름을 기억해 달라고 한다",
    "storyObjective": "연우는 다음 봄에도 자신들의 이름을 기억해 달라고 한다. 서아는 돌아온다는 거짓 약속 대신 배운 일을 기록하고 313년 낙랑 접경으로 이동한다.",
    "conflict": "서아가 시간 이동을 앞두고 다시 오겠다고 약속할 수 없다",
    "dialogueOutline": "연우는 다음 봄에도 자신들의 이름을 기억해 달라고 한다. 서아는 돌아온다는 거짓 약속 대신 배운 일을 기록하고 313년 낙랑 접경으로 이동한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "서아가 시간 이동을 앞두고 다시 오겠다고 약속할 수 없다",
      "turn": "연우는 다음 봄에도 자신들의 이름을 기억해 달라고 한다. 서아는 돌아온다는 거짓 약속 대신 배운 일을 기록하고 313년 낙랑 접경으로 이동한다.",
      "end": "남을 구하는 충동에서 상환까지 책임지는 약속으로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "진대법 제정: 관곡 대여와 상환",
    "questionIds": [],
    "genealogyLinks": [
      "H-G3"
    ],
    "nextSceneId": "THR-C02-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “195년→313년 / 창고 문 앞·기록책 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C01-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.02 사라진 군현의 길

```json
[
  {
    "sceneId": "THR-C02-S01",
    "chapterId": "THR-C02",
    "sceneTitle": "낯선 검문패",
    "historicalYear": "313년",
    "location": "낙랑 접경길",
    "historicalEventId": "H-G4",
    "characters": [
      "서아",
      "수레꾼 도림"
    ],
    "backgroundAsset": "BG-ef3258b479",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C02-98998f0",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 도림의 수레를 따라가다 제지된다",
    "storyObjective": "서아가 도림의 수레를 따라가다 제지된다. 그는 싸움 뒤에는 길의 주인뿐 아니라 거래 규칙도 달라진다고 말한다.",
    "conflict": "서아의 낡은 통행 표시가 새 검문소에서 통하지 않는다",
    "dialogueOutline": "서아가 도림의 수레를 따라가다 제지된다. 그는 싸움 뒤에는 길의 주인뿐 아니라 거래 규칙도 달라진다고 말한다.",
    "choices": [
      {
        "choiceId": "THR-C02-S01-B1",
        "label": "짐을 열어 확인받는다",
        "action": "짐을 열어 확인받는다",
        "npcReaction": "검문이 길어져 도림이 불평하지만 오해가 풀린다",
        "followupDialogueOutline": "서아가 짐을 열어 확인받는다 행동을 실행한다. 수레꾼 도림의 반응: 검문이 길어져 도림이 불평하지만 오해가 풀린다. 상대의 답을 듣고 현재 갈등인 “서아의 낡은 통행 표시가 새 검문소에서 통하지 않는다의 처리 결과를 확인한다.",
        "relationshipEffect": "검문이 길어져 도림이 불평하지만 오해가 풀린다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C02-S01-JOIN"
      },
      {
        "choiceId": "THR-C02-S01-B2",
        "label": "행선지 증언을 구한다",
        "action": "행선지 증언을 구한다",
        "npcReaction": "피란민이 보증을 서고 서아는 그 가족의 짐을 돕기로 한다",
        "followupDialogueOutline": "서아가 행선지 증언을 구한다 행동을 실행한다. 수레꾼 도림의 반응: 피란민이 보증을 서고 서아는 그 가족의 짐을 돕기로 한다. 상대의 답을 듣고 현재 갈등인 “서아의 낡은 통행 표시가 새 검문소에서 통하지 않는다의 처리 결과를 확인한다.",
        "relationshipEffect": "피란민이 보증을 서고 서아는 그 가족의 짐을 돕기로 한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C02-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "서아의 낡은 통행 표시가 새 검문소에서 통하지 않는다",
      "turn": "서아가 도림의 수레를 따라가다 제지된다. 그는 싸움 뒤에는 길의 주인뿐 아니라 거래 규칙도 달라진다고 말한다.",
      "end": "지도의 승리가 주민의 삶을 자동으로 낫게 하지 않음을 발견; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "낙랑군 축출",
    "questionIds": [],
    "genealogyLinks": [
      "H-G4"
    ],
    "nextSceneId": "THR-C02-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “313년 / 낙랑 접경길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C02-S02",
    "chapterId": "THR-C02",
    "sceneTitle": "지워지는 세금표",
    "historicalYear": "313년",
    "location": "군현 관청 밖",
    "historicalEventId": "H-G4",
    "characters": [
      "서아",
      "서리 하준"
    ],
    "backgroundAsset": "BG-220422abdb",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C02-25f6a2e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "하준은 통치 기호를 없애자는 군인과 다툰다",
    "storyObjective": "하준은 통치 기호를 없애자는 군인과 다툰다. 서아는 군현 권력의 해체와 주민 기록의 보존을 분리하자고 제안한다.",
    "conflict": "군현의 옛 장부를 버리면 주민의 재산 증거도 사라진다",
    "dialogueOutline": "하준은 통치 기호를 없애자는 군인과 다툰다. 서아는 군현 권력의 해체와 주민 기록의 보존을 분리하자고 제안한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "군현의 옛 장부를 버리면 주민의 재산 증거도 사라진다",
      "turn": "하준은 통치 기호를 없애자는 군인과 다툰다. 서아는 군현 권력의 해체와 주민 기록의 보존을 분리하자고 제안한다.",
      "end": "지도의 승리가 주민의 삶을 자동으로 낫게 하지 않음을 발견; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "낙랑군 축출",
    "questionIds": [],
    "genealogyLinks": [
      "H-G4"
    ],
    "nextSceneId": "THR-C02-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “313년 / 군현 관청 밖”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C02-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C02-S03",
    "chapterId": "THR-C02",
    "sceneTitle": "미천왕의 명령",
    "historicalYear": "313년",
    "location": "군영",
    "historicalEventId": "H-G4",
    "characters": [
      "서아",
      "고구려 장교"
    ],
    "backgroundAsset": "BG-369226d02f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C02-e0a4c46",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 승리 소식을 기다리는 군인에게 피란 행렬을 보여준다",
    "storyObjective": "서아는 승리 소식을 기다리는 군인에게 피란 행렬을 보여준다. 장교는 미천왕의 남쪽 진출이 병참과 거점 확보에 달렸다고 답한다.",
    "conflict": "전과를 재촉하는 장교가 주민 호송 병력을 줄이려 한다",
    "dialogueOutline": "서아는 승리 소식을 기다리는 군인에게 피란 행렬을 보여준다. 장교는 미천왕의 남쪽 진출이 병참과 거점 확보에 달렸다고 답한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "전과를 재촉하는 장교가 주민 호송 병력을 줄이려 한다",
      "turn": "서아는 승리 소식을 기다리는 군인에게 피란 행렬을 보여준다. 장교는 미천왕의 남쪽 진출이 병참과 거점 확보에 달렸다고 답한다.",
      "end": "지도의 승리가 주민의 삶을 자동으로 낫게 하지 않음을 발견; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "낙랑군 축출",
    "questionIds": [],
    "genealogyLinks": [
      "H-G4"
    ],
    "nextSceneId": "THR-C02-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “313년 / 군영”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C02-S04",
    "chapterId": "THR-C02",
    "sceneTitle": "돌아갈 집의 표식",
    "historicalYear": "313년",
    "location": "낙랑 옛 거주지",
    "historicalEventId": "H-G4",
    "characters": [
      "서아",
      "피란민 소운"
    ],
    "backgroundAsset": "BG-2fd18795a2",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C02-1f549b9",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 벽의 생활 흔적을 비교하고 이웃 증언을 듣는다",
    "storyObjective": "서아가 벽의 생활 흔적을 비교하고 이웃 증언을 듣는다. 소운은 어느 나라 사람인지부터 묻지 말아 달라고 한다.",
    "conflict": "주민들이 같은 빈집을 서로 자기 집이라 주장한다",
    "dialogueOutline": "서아가 벽의 생활 흔적을 비교하고 이웃 증언을 듣는다. 소운은 어느 나라 사람인지부터 묻지 말아 달라고 한다.",
    "choices": [
      {
        "choiceId": "THR-C02-S04-B1",
        "label": "이웃 증언을 듣는다",
        "action": "이웃 증언을 듣는다",
        "npcReaction": "소운이 어린 시절의 기억을 말하며 경계를 푼다",
        "followupDialogueOutline": "서아가 이웃 증언을 듣는다 행동을 실행한다. 피란민 소운의 반응: 소운이 어린 시절의 기억을 말하며 경계를 푼다. 상대의 답을 듣고 현재 갈등인 “주민들이 같은 빈집을 서로 자기 집이라 주장한다의 처리 결과를 확인한다.",
        "relationshipEffect": "소운이 어린 시절의 기억을 말하며 경계를 푼다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C02-S04-JOIN"
      },
      {
        "choiceId": "THR-C02-S04-B2",
        "label": "장부를 먼저 확인한다",
        "action": "장부를 먼저 확인한다",
        "npcReaction": "문서 없는 가족의 불안이 드러나 임시 중재가 필요해진다",
        "followupDialogueOutline": "서아가 장부를 먼저 확인한다 행동을 실행한다. 피란민 소운의 반응: 문서 없는 가족의 불안이 드러나 임시 중재가 필요해진다. 상대의 답을 듣고 현재 갈등인 “주민들이 같은 빈집을 서로 자기 집이라 주장한다의 처리 결과를 확인한다.",
        "relationshipEffect": "문서 없는 가족의 불안이 드러나 임시 중재가 필요해진다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C02-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "주민들이 같은 빈집을 서로 자기 집이라 주장한다",
      "turn": "서아가 벽의 생활 흔적을 비교하고 이웃 증언을 듣는다. 소운은 어느 나라 사람인지부터 묻지 말아 달라고 한다.",
      "end": "지도의 승리가 주민의 삶을 자동으로 낫게 하지 않음을 발견; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "낙랑군 축출",
    "questionIds": [],
    "genealogyLinks": [
      "H-G4"
    ],
    "nextSceneId": "THR-C02-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “313년 / 낙랑 옛 거주지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C02-S05",
    "chapterId": "THR-C02",
    "sceneTitle": "남쪽 강의 지도",
    "historicalYear": "313년 이후(개념 장면)",
    "location": "교역 나루",
    "historicalEventId": "H-G4",
    "characters": [
      "서아",
      "상인 도림"
    ],
    "backgroundAsset": "BG-0f375a8ddb",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C02-401251e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "도림이 낙랑·대방 옛 영역의 교역로를 펼친다",
    "storyObjective": "도림이 낙랑·대방 옛 영역의 교역로를 펼친다. 서아는 이 지도가 훗날 백제와의 전쟁터가 되는 이유를 짚는다.",
    "conflict": "통행이 쉬워졌지만 새로운 경쟁국과 충돌할 위험이 커진다",
    "dialogueOutline": "도림이 낙랑·대방 옛 영역의 교역로를 펼친다. 서아는 이 지도가 훗날 백제와의 전쟁터가 되는 이유를 짚는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "통행이 쉬워졌지만 새로운 경쟁국과 충돌할 위험이 커진다",
      "turn": "도림이 낙랑·대방 옛 영역의 교역로를 펼친다. 서아는 이 지도가 훗날 백제와의 전쟁터가 되는 이유를 짚는다.",
      "end": "지도의 승리가 주민의 삶을 자동으로 낫게 하지 않음을 발견; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "낙랑군 축출",
    "questionIds": [],
    "genealogyLinks": [
      "H-G4"
    ],
    "nextSceneId": "THR-C02-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “313년 이후(개념 장면) / 교역 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C02-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C02-S06",
    "chapterId": "THR-C02",
    "sceneTitle": "가계도를 끊는 손",
    "historicalYear": "331년 회상",
    "location": "왕실 기록실",
    "historicalEventId": "H-G5",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-1d7e8a86dc",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C02-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 미천왕 사망과 고국원왕 계승 사이의 시간을 확인한다",
    "storyObjective": "서아가 미천왕 사망과 고국원왕 계승 사이의 시간을 확인한다. 기록관은 왕의 업적뿐 아니라 위기를 물려받는 과정도 적자고 한다.",
    "conflict": "미천왕과 뒤의 왕을 같은 인물로 적은 임시 기록이 발견된다",
    "dialogueOutline": "서아가 미천왕 사망과 고국원왕 계승 사이의 시간을 확인한다. 기록관은 왕의 업적뿐 아니라 위기를 물려받는 과정도 적자고 한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "미천왕과 뒤의 왕을 같은 인물로 적은 임시 기록이 발견된다",
      "turn": "서아가 미천왕 사망과 고국원왕 계승 사이의 시간을 확인한다. 기록관은 왕의 업적뿐 아니라 위기를 물려받는 과정도 적자고 한다.",
      "end": "지도의 승리가 주민의 삶을 자동으로 낫게 하지 않음을 발견; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "백제의 평양 공격과 고국원왕 전사",
    "questionIds": [],
    "genealogyLinks": [
      "H-G5"
    ],
    "nextSceneId": "THR-C02-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “331년 회상 / 왕실 기록실”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C02-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C02-S07",
    "chapterId": "THR-C02",
    "sceneTitle": "화살 뒤의 침묵",
    "historicalYear": "371년",
    "location": "평양 방어선 뒤",
    "historicalEventId": "H-G5",
    "characters": [
      "서아",
      "전령"
    ],
    "backgroundAsset": "BG-f6ec00df22",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C02-41ff692",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "전령이 고국원왕의 죽음을 전한다",
    "storyObjective": "전령이 고국원왕의 죽음을 전한다. 서아는 근초고왕의 공격이라는 사실과 패전의 책임을 특정 주민에게 돌리는 소문을 구별한다.",
    "conflict": "전사 소식이 군영에 퍼지자 누군가 주민을 배신자로 몰아간다",
    "dialogueOutline": "전령이 고국원왕의 죽음을 전한다. 서아는 근초고왕의 공격이라는 사실과 패전의 책임을 특정 주민에게 돌리는 소문을 구별한다.",
    "choices": [
      {
        "choiceId": "THR-C02-S07-B1",
        "label": "전령의 말부터 확인한다",
        "action": "전령의 말부터 확인한다",
        "npcReaction": "소문이 멎지만 군인들의 불안은 남는다",
        "followupDialogueOutline": "서아가 전령의 말부터 확인한다 행동을 실행한다. 전령의 반응: 소문이 멎지만 군인들의 불안은 남는다. 상대의 답을 듣고 현재 갈등인 “전사 소식이 군영에 퍼지자 누군가 주민을 배신자로 몰아간다의 처리 결과를 확인한다.",
        "relationshipEffect": "소문이 멎지만 군인들의 불안은 남는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C02-S07-JOIN"
      },
      {
        "choiceId": "THR-C02-S07-B2",
        "label": "주민을 안전한 곳으로 이끈다",
        "action": "주민을 안전한 곳으로 이끈다",
        "npcReaction": "희생을 막은 뒤 정확한 전황을 다시 듣는다",
        "followupDialogueOutline": "서아가 주민을 안전한 곳으로 이끈다 행동을 실행한다. 전령의 반응: 희생을 막은 뒤 정확한 전황을 다시 듣는다. 상대의 답을 듣고 현재 갈등인 “전사 소식이 군영에 퍼지자 누군가 주민을 배신자로 몰아간다의 처리 결과를 확인한다.",
        "relationshipEffect": "희생을 막은 뒤 정확한 전황을 다시 듣는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C02-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "전사 소식이 군영에 퍼지자 누군가 주민을 배신자로 몰아간다",
      "turn": "전령이 고국원왕의 죽음을 전한다. 서아는 근초고왕의 공격이라는 사실과 패전의 책임을 특정 주민에게 돌리는 소문을 구별한다.",
      "end": "지도의 승리가 주민의 삶을 자동으로 낫게 하지 않음을 발견; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "백제의 평양 공격과 고국원왕 전사",
    "questionIds": [],
    "genealogyLinks": [
      "H-G5"
    ],
    "nextSceneId": "THR-C02-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “371년 / 평양 방어선 뒤”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C02-S08",
    "chapterId": "THR-C02",
    "sceneTitle": "다음 왕의 빈 자리",
    "historicalYear": "371년→372년",
    "location": "왕도 회복 현장",
    "historicalEventId": "H-G6",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-981ee47a0a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C02-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "기록관은 새 왕 소수림왕의 교육과 제도 소식을 건넨다",
    "storyObjective": "기록관은 새 왕 소수림왕의 교육과 제도 소식을 건넨다. 서아는 무기를 더 만드는 대신 나라를 다시 세우는 길을 따라간다.",
    "conflict": "서아가 복수만이 답이라고 생각한 자신을 부끄러워한다",
    "dialogueOutline": "기록관은 새 왕 소수림왕의 교육과 제도 소식을 건넨다. 서아는 무기를 더 만드는 대신 나라를 다시 세우는 길을 따라간다.",
    "choices": [],
    "emotionalBeat": {
      "start": "서아가 복수만이 답이라고 생각한 자신을 부끄러워한다",
      "turn": "기록관은 새 왕 소수림왕의 교육과 제도 소식을 건넨다. 서아는 무기를 더 만드는 대신 나라를 다시 세우는 길을 따라간다.",
      "end": "지도의 승리가 주민의 삶을 자동으로 낫게 하지 않음을 발견; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "불교 수용과 태학 설립",
    "questionIds": [],
    "genealogyLinks": [
      "H-G6"
    ],
    "nextSceneId": "THR-C03-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “371년→372년 / 왕도 회복 현장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C02-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.03 칼을 들기 전의 나라

```json
[
  {
    "sceneId": "THR-C03-S01",
    "chapterId": "THR-C03",
    "sceneTitle": "처음 들어온 경전",
    "historicalYear": "372년",
    "location": "불교 수용 현장",
    "historicalEventId": "H-G6",
    "characters": [
      "서아",
      "승려 순도"
    ],
    "backgroundAsset": "BG-9c57fa3769",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-82b7fd3",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 강요보다 설명을 요청한다",
    "storyObjective": "서아가 강요보다 설명을 요청한다. 순도는 경전을 전하되 주민의 두려움을 조롱하지 않는다.",
    "conflict": "낯선 신앙을 받아들이면 선조를 버린다는 주민의 반발",
    "dialogueOutline": "서아가 강요보다 설명을 요청한다. 순도는 경전을 전하되 주민의 두려움을 조롱하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "낯선 신앙을 받아들이면 선조를 버린다는 주민의 반발",
      "turn": "서아가 강요보다 설명을 요청한다. 순도는 경전을 전하되 주민의 두려움을 조롱하지 않는다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "불교 수용과 태학 설립",
    "questionIds": [],
    "genealogyLinks": [
      "H-G6"
    ],
    "nextSceneId": "THR-C03-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “372년 / 불교 수용 현장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C03-S02",
    "chapterId": "THR-C03",
    "sceneTitle": "태학의 문턱",
    "historicalYear": "372년",
    "location": "태학",
    "historicalEventId": "H-G6",
    "characters": [
      "서아",
      "학생 규림"
    ],
    "backgroundAsset": "BG-ef6689c16f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-dd193df",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 현대 학교와 같다고 말했다가 귀족 교육이라는 차이를 듣는다",
    "storyObjective": "서아가 현대 학교와 같다고 말했다가 귀족 교육이라는 차이를 듣는다. 규림은 입학보다 밖에서라도 글을 배울 방법을 찾는다.",
    "conflict": "규림은 배우고 싶지만 교육 기회가 누구에게나 열려 있지는 않다",
    "dialogueOutline": "서아가 현대 학교와 같다고 말했다가 귀족 교육이라는 차이를 듣는다. 규림은 입학보다 밖에서라도 글을 배울 방법을 찾는다.",
    "choices": [
      {
        "choiceId": "THR-C03-S02-B1",
        "label": "책 읽기를 함께 연습한다",
        "action": "책 읽기를 함께 연습한다",
        "npcReaction": "규림이 한 글자를 읽고 자신감을 얻는다",
        "followupDialogueOutline": "서아가 책 읽기를 함께 연습한다 행동을 실행한다. 학생 규림의 반응: 규림이 한 글자를 읽고 자신감을 얻는다. 상대의 답을 듣고 현재 갈등인 “규림은 배우고 싶지만 교육 기회가 누구에게나 열려 있지는 않다의 처리 결과를 확인한다.",
        "relationshipEffect": "규림이 한 글자를 읽고 자신감을 얻는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C03-S02-JOIN"
      },
      {
        "choiceId": "THR-C03-S02-B2",
        "label": "교육 담당자에게 묻는다",
        "action": "교육 담당자에게 묻는다",
        "npcReaction": "규림이 서아의 배려를 고마워하면서도 제도 한계를 받아들인다",
        "followupDialogueOutline": "서아가 교육 담당자에게 묻는다 행동을 실행한다. 학생 규림의 반응: 규림이 서아의 배려를 고마워하면서도 제도 한계를 받아들인다. 상대의 답을 듣고 현재 갈등인 “규림은 배우고 싶지만 교육 기회가 누구에게나 열려 있지는 않다의 처리 결과를 확인한다.",
        "relationshipEffect": "규림이 서아의 배려를 고마워하면서도 제도 한계를 받아들인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C03-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "규림은 배우고 싶지만 교육 기회가 누구에게나 열려 있지는 않다",
      "turn": "서아가 현대 학교와 같다고 말했다가 귀족 교육이라는 차이를 듣는다. 규림은 입학보다 밖에서라도 글을 배울 방법을 찾는다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "불교 수용과 태학 설립",
    "questionIds": [],
    "genealogyLinks": [
      "H-G6"
    ],
    "nextSceneId": "THR-C03-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “372년 / 태학”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C03-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C03-S03",
    "chapterId": "THR-C03",
    "sceneTitle": "하나의 죄 두 판결",
    "historicalYear": "373년",
    "location": "재판 관청",
    "historicalEventId": "H-G7",
    "characters": [
      "서아",
      "율령 담당관"
    ],
    "backgroundAsset": "BG-c2c153840b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-e32a15f",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 사례 두 개를 비교하고 담당관은 율령의 통일 규범을 설명한다",
    "storyObjective": "서아가 사례 두 개를 비교하고 담당관은 율령의 통일 규범을 설명한다. 법이 생겨도 공정한 집행이 저절로 보장되지는 않는다는 질문을 남긴다.",
    "conflict": "마을마다 다른 처분을 받은 형제가 항의한다",
    "dialogueOutline": "서아가 사례 두 개를 비교하고 담당관은 율령의 통일 규범을 설명한다. 법이 생겨도 공정한 집행이 저절로 보장되지는 않는다는 질문을 남긴다.",
    "choices": [],
    "emotionalBeat": {
      "start": "마을마다 다른 처분을 받은 형제가 항의한다",
      "turn": "서아가 사례 두 개를 비교하고 담당관은 율령의 통일 규범을 설명한다. 법이 생겨도 공정한 집행이 저절로 보장되지는 않는다는 질문을 남긴다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "율령 반포",
    "questionIds": [],
    "genealogyLinks": [
      "H-G7"
    ],
    "nextSceneId": "THR-C03-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “373년 / 재판 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C03-S04",
    "chapterId": "THR-C03",
    "sceneTitle": "전쟁 사이의 왕들",
    "historicalYear": "384~391년 전환",
    "location": "왕실 기록실",
    "historicalEventId": "H-G8",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-1d7e8a86dc",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 고국양왕을 빠뜨린 계승표를 고친다",
    "storyObjective": "서아가 고국양왕을 빠뜨린 계승표를 고친다. 기록관은 개혁과 팽창 사이에 사라진 시간을 되돌려 놓는다.",
    "conflict": "소수림왕 다음이 곧 광개토왕이라는 잘못된 요약",
    "dialogueOutline": "서아가 고국양왕을 빠뜨린 계승표를 고친다. 기록관은 개혁과 팽창 사이에 사라진 시간을 되돌려 놓는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "소수림왕 다음이 곧 광개토왕이라는 잘못된 요약",
      "turn": "서아가 고국양왕을 빠뜨린 계승표를 고친다. 기록관은 개혁과 팽창 사이에 사라진 시간을 되돌려 놓는다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "영락 연호와 영역 확장",
    "questionIds": [],
    "genealogyLinks": [
      "H-G8"
    ],
    "nextSceneId": "THR-C03-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “384~391년 전환 / 왕실 기록실”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C03-S05",
    "chapterId": "THR-C03",
    "sceneTitle": "영락의 첫 장",
    "historicalYear": "391년 이후",
    "location": "광개토왕 군영",
    "historicalEventId": "H-G8",
    "characters": [
      "서아",
      "광개토대왕"
    ],
    "backgroundAsset": "BG-31fca47bb5",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-99dc902",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "왕의 연호와 원정 계획을 듣던 서아가 보급 문제를 묻는다",
    "storyObjective": "왕의 연호와 원정 계획을 듣던 서아가 보급 문제를 묻는다. 왕은 장부와 지도를 함께 읽게 한다.",
    "conflict": "승전 기록에만 이름을 올리고 싶어 하는 젊은 군인",
    "dialogueOutline": "왕의 연호와 원정 계획을 듣던 서아가 보급 문제를 묻는다. 왕은 장부와 지도를 함께 읽게 한다.",
    "choices": [
      {
        "choiceId": "THR-C03-S05-B1",
        "label": "보급 담당을 돕는다",
        "action": "보급 담당을 돕는다",
        "npcReaction": "군인이 비겁하다고 했다가 자신의 식량을 구해 준 서아를 인정한다",
        "followupDialogueOutline": "서아가 보급 담당을 돕는다 행동을 실행한다. 광개토대왕의 반응: 군인이 비겁하다고 했다가 자신의 식량을 구해 준 서아를 인정한다. 상대의 답을 듣고 현재 갈등인 “승전 기록에만 이름을 올리고 싶어 하는 젊은 군인의 처리 결과를 확인한다.",
        "relationshipEffect": "군인이 비겁하다고 했다가 자신의 식량을 구해 준 서아를 인정한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C03-S05-JOIN"
      },
      {
        "choiceId": "THR-C03-S05-B2",
        "label": "행군 지도를 검토한다",
        "action": "행군 지도를 검토한다",
        "npcReaction": "장교가 지형 판단을 인정하지만 민간 통행 제한도 드러난다",
        "followupDialogueOutline": "서아가 행군 지도를 검토한다 행동을 실행한다. 광개토대왕의 반응: 장교가 지형 판단을 인정하지만 민간 통행 제한도 드러난다. 상대의 답을 듣고 현재 갈등인 “승전 기록에만 이름을 올리고 싶어 하는 젊은 군인의 처리 결과를 확인한다.",
        "relationshipEffect": "장교가 지형 판단을 인정하지만 민간 통행 제한도 드러난다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C03-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "승전 기록에만 이름을 올리고 싶어 하는 젊은 군인",
      "turn": "왕의 연호와 원정 계획을 듣던 서아가 보급 문제를 묻는다. 왕은 장부와 지도를 함께 읽게 한다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "영락 연호와 영역 확장",
    "questionIds": [
      "official-61-advanced-04"
    ],
    "genealogyLinks": [
      "H-G8"
    ],
    "nextSceneId": "THR-C03-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “391년 이후 / 광개토왕 군영”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C03-S05-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C03-S06",
    "chapterId": "THR-C03",
    "sceneTitle": "세 방향의 깃발",
    "historicalYear": "4세기 말~5세기 초",
    "location": "국경 지도실",
    "historicalEventId": "H-G8",
    "characters": [
      "서아",
      "장교"
    ],
    "backgroundAsset": "BG-19d2202b3b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-bfe9dd8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 서로 다른 방향과 시기를 지도에 표시한다",
    "storyObjective": "서아가 서로 다른 방향과 시기를 지도에 표시한다. 장교는 영토 색칠만으로 정복의 난점을 설명할 수 없다고 한다.",
    "conflict": "백제·후연·북방 원정을 한 전쟁으로 뭉뚱그린다",
    "dialogueOutline": "서아가 서로 다른 방향과 시기를 지도에 표시한다. 장교는 영토 색칠만으로 정복의 난점을 설명할 수 없다고 한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "백제·후연·북방 원정을 한 전쟁으로 뭉뚱그린다",
      "turn": "서아가 서로 다른 방향과 시기를 지도에 표시한다. 장교는 영토 색칠만으로 정복의 난점을 설명할 수 없다고 한다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "영락 연호와 영역 확장",
    "questionIds": [],
    "genealogyLinks": [
      "H-G8"
    ],
    "nextSceneId": "THR-C03-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “4세기 말~5세기 초 / 국경 지도실”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C03-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C03-S07",
    "chapterId": "THR-C03",
    "sceneTitle": "신라의 급한 편지",
    "historicalYear": "400년",
    "location": "신라 구원군 집결지",
    "historicalEventId": "H-G9",
    "characters": [
      "서아",
      "신라 사신"
    ],
    "backgroundAsset": "BG-e58da864f3",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-fb59915",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 구원은 빚이 되는지 묻자 사신은 오늘 살아야 내일 외교도 있다고 답한다.",
    "storyObjective": "서아가 구원은 빚이 되는지 묻자 사신은 오늘 살아야 내일 외교도 있다고 답한다.",
    "conflict": "도움을 요청한 사신이 고구려의 영향력 확대도 두려워한다",
    "dialogueOutline": "서아가 구원은 빚이 되는지 묻자 사신은 오늘 살아야 내일 외교도 있다고 답한다.",
    "choices": [
      {
        "choiceId": "THR-C03-S07-B1",
        "label": "사신의 우려를 전달한다",
        "action": "사신의 우려를 전달한다",
        "npcReaction": "장교가 당장 약속하지 않지만 호송에 신라 안내자를 붙인다",
        "followupDialogueOutline": "서아가 사신의 우려를 전달한다 행동을 실행한다. 신라 사신의 반응: 장교가 당장 약속하지 않지만 호송에 신라 안내자를 붙인다. 상대의 답을 듣고 현재 갈등인 “도움을 요청한 사신이 고구려의 영향력 확대도 두려워한다의 처리 결과를 확인한다.",
        "relationshipEffect": "장교가 당장 약속하지 않지만 호송에 신라 안내자를 붙인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C03-S07-JOIN"
      },
      {
        "choiceId": "THR-C03-S07-B2",
        "label": "피란민 이동을 준비한다",
        "action": "피란민 이동을 준비한다",
        "npcReaction": "사신이 정치 이야기 대신 가족들의 이름을 맡긴다",
        "followupDialogueOutline": "서아가 피란민 이동을 준비한다 행동을 실행한다. 신라 사신의 반응: 사신이 정치 이야기 대신 가족들의 이름을 맡긴다. 상대의 답을 듣고 현재 갈등인 “도움을 요청한 사신이 고구려의 영향력 확대도 두려워한다의 처리 결과를 확인한다.",
        "relationshipEffect": "사신이 정치 이야기 대신 가족들의 이름을 맡긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C03-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "도움을 요청한 사신이 고구려의 영향력 확대도 두려워한다",
      "turn": "서아가 구원은 빚이 되는지 묻자 사신은 오늘 살아야 내일 외교도 있다고 답한다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "신라 구원과 왜군 격퇴",
    "questionIds": [],
    "genealogyLinks": [
      "H-G9"
    ],
    "nextSceneId": "THR-C03-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “400년 / 신라 구원군 집결지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C03-S08",
    "chapterId": "THR-C03",
    "sceneTitle": "구원 뒤의 그림자",
    "historicalYear": "400년 이후",
    "location": "낙동강 교역로",
    "historicalEventId": "H-G9",
    "characters": [
      "서아",
      "가야 상인"
    ],
    "backgroundAsset": "BG-ea13170e93",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-12d07f3",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "상인이 끊긴 거래와 훼손된 항구를 보여준다",
    "storyObjective": "상인이 끊긴 거래와 훼손된 항구를 보여준다. 서아는 승자의 구원과 이웃의 손실을 같은 사건 ID로 기록한다.",
    "conflict": "신라를 구한 전쟁이 교역망의 다른 사람들을 무너뜨린다",
    "dialogueOutline": "상인이 끊긴 거래와 훼손된 항구를 보여준다. 서아는 승자의 구원과 이웃의 손실을 같은 사건 ID로 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "신라를 구한 전쟁이 교역망의 다른 사람들을 무너뜨린다",
      "turn": "상인이 끊긴 거래와 훼손된 항구를 보여준다. 서아는 승자의 구원과 이웃의 손실을 같은 사건 ID로 기록한다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "신라 구원과 왜군 격퇴",
    "questionIds": [],
    "genealogyLinks": [
      "H-G9"
    ],
    "nextSceneId": "THR-C03-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “400년 이후 / 낙동강 교역로”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C03-S09",
    "chapterId": "THR-C03",
    "sceneTitle": "돌에 새긴 공적",
    "historicalYear": "414년",
    "location": "광개토대왕릉비 건립터",
    "historicalEventId": "H-G10",
    "characters": [
      "서아",
      "비석 석공"
    ],
    "backgroundAsset": "BG-ed19201d6d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-ac2753a",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "석공이 획을 확인하라고 멈춰 세운다",
    "storyObjective": "석공이 획을 확인하라고 멈춰 세운다. 서아는 비문이 왕의 업적을 전하면서 왕권의 시선도 담는 자료임을 배운다.",
    "conflict": "읽기 어려운 글자를 서아가 추측으로 채우려 한다",
    "dialogueOutline": "석공이 획을 확인하라고 멈춰 세운다. 서아는 비문이 왕의 업적을 전하면서 왕권의 시선도 담는 자료임을 배운다.",
    "choices": [],
    "emotionalBeat": {
      "start": "읽기 어려운 글자를 서아가 추측으로 채우려 한다",
      "turn": "석공이 획을 확인하라고 멈춰 세운다. 서아는 비문이 왕의 업적을 전하면서 왕권의 시선도 담는 자료임을 배운다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "광개토대왕릉비 건립",
    "questionIds": [],
    "genealogyLinks": [
      "H-G10"
    ],
    "nextSceneId": "THR-C03-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “414년 / 광개토대왕릉비 건립터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C03-S10",
    "chapterId": "THR-C03",
    "sceneTitle": "돌과 흙의 기억",
    "historicalYear": "5세기·비교 삽화",
    "location": "고분 외부·단면 자료",
    "historicalEventId": "H-G14",
    "characters": [
      "서아",
      "장례 장인"
    ],
    "backgroundAsset": "BG-d4a97044d3",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C03-88403d9",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "장인은 무덤을 훼손하지 말라며 구조 그림을 허락한다",
    "storyObjective": "장인은 무덤을 훼손하지 말라며 구조 그림을 허락한다. 서아는 돌무지와 돌방·벽화를 관찰 기록으로 남기고 427년으로 이동한다. 생활 자료의 부경과 고분의 부장품을 비교하여 전쟁 밖의 고구려 생활을 확인한다.",
    "conflict": "유물을 가져가야 기억을 보존할 수 있다는 서아의 착각",
    "dialogueOutline": "장인은 무덤을 훼손하지 말라며 구조 그림을 허락한다. 서아는 돌무지와 돌방·벽화를 관찰 기록으로 남기고 427년으로 이동한다. 생활 자료의 부경과 고분의 부장품을 비교하여 전쟁 밖의 고구려 생활을 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "유물을 가져가야 기억을 보존할 수 있다는 서아의 착각",
      "turn": "장인은 무덤을 훼손하지 말라며 구조 그림을 허락한다. 서아는 돌무지와 돌방·벽화를 관찰 기록으로 남기고 427년으로 이동한다. 생활 자료의 부경과 고분의 부장품을 비교하여 전쟁 밖의 고구려 생활을 확인한다.",
      "end": "패전의 상처를 교육·법·신앙으로 회복하고 팽창의 비용을 질문; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "돌무지무덤·굴식 돌방무덤·고분벽화",
    "questionIds": [
      "official-77-advanced-08"
    ],
    "genealogyLinks": [
      "H-G14"
    ],
    "nextSceneId": "THR-C04-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “5세기·비교 삽화 / 고분 외부·단면 자료”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C03-S10-Q",
    "questionSlotStatus": "VERIFIED"
  }
]
```

## CH.04 도읍이 떠난 자리

```json
[
  {
    "sceneId": "THR-C04-S01",
    "chapterId": "THR-C04",
    "sceneTitle": "짐수레의 수도",
    "historicalYear": "427년",
    "location": "국내성 출발길",
    "historicalEventId": "H-G11",
    "characters": [
      "서아",
      "이주민 다은"
    ],
    "backgroundAsset": "BG-65dfa5638b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-37e44ec",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 무덤을 옮기자고 했다가 불가능하다는 답을 듣는다",
    "storyObjective": "서아가 무덤을 옮기자고 했다가 불가능하다는 답을 듣는다. 다은은 새 수도의 이름보다 떠나는 집을 기억해 달라고 한다.",
    "conflict": "이주 명령에 가족의 무덤을 두고 떠나야 한다",
    "dialogueOutline": "서아가 무덤을 옮기자고 했다가 불가능하다는 답을 듣는다. 다은은 새 수도의 이름보다 떠나는 집을 기억해 달라고 한다.",
    "choices": [
      {
        "choiceId": "THR-C04-S01-B1",
        "label": "짐을 함께 줄인다",
        "action": "짐을 함께 줄인다",
        "npcReaction": "가족이 실용적인 도움을 받아 서아를 믿는다",
        "followupDialogueOutline": "서아가 짐을 함께 줄인다 행동을 실행한다. 이주민 다은의 반응: 가족이 실용적인 도움을 받아 서아를 믿는다. 상대의 답을 듣고 현재 갈등인 “이주 명령에 가족의 무덤을 두고 떠나야 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "가족이 실용적인 도움을 받아 서아를 믿는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C04-S01-JOIN"
      },
      {
        "choiceId": "THR-C04-S01-B2",
        "label": "이별 기록을 남긴다",
        "action": "이별 기록을 남긴다",
        "npcReaction": "다은이 슬픔을 말할 시간을 얻지만 출발을 서둘러야 한다",
        "followupDialogueOutline": "서아가 이별 기록을 남긴다 행동을 실행한다. 이주민 다은의 반응: 다은이 슬픔을 말할 시간을 얻지만 출발을 서둘러야 한다. 상대의 답을 듣고 현재 갈등인 “이주 명령에 가족의 무덤을 두고 떠나야 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "다은이 슬픔을 말할 시간을 얻지만 출발을 서둘러야 한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C04-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "이주 명령에 가족의 무덤을 두고 떠나야 한다",
      "turn": "서아가 무덤을 옮기자고 했다가 불가능하다는 답을 듣는다. 다은은 새 수도의 이름보다 떠나는 집을 기억해 달라고 한다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "국내성에서 평양으로 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-G11"
    ],
    "nextSceneId": "THR-C04-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “427년 / 국내성 출발길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C04-S02",
    "chapterId": "THR-C04",
    "sceneTitle": "강을 따라 내려가다",
    "historicalYear": "427년",
    "location": "평양행 나루",
    "historicalEventId": "H-G11",
    "characters": [
      "서아",
      "뱃사공"
    ],
    "backgroundAsset": "BG-6e7943e7c7",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-83c3da4",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "뱃사공이 평양의 교통·경제 입지를 설명하고 서아는 물자선과 주민선의 순서를 조정한다.",
    "storyObjective": "뱃사공이 평양의 교통·경제 입지를 설명하고 서아는 물자선과 주민선의 순서를 조정한다.",
    "conflict": "물자와 주민이 한 나루에 몰려 충돌한다",
    "dialogueOutline": "뱃사공이 평양의 교통·경제 입지를 설명하고 서아는 물자선과 주민선의 순서를 조정한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "물자와 주민이 한 나루에 몰려 충돌한다",
      "turn": "뱃사공이 평양의 교통·경제 입지를 설명하고 서아는 물자선과 주민선의 순서를 조정한다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "국내성에서 평양으로 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-G11"
    ],
    "nextSceneId": "THR-C04-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “427년 / 평양행 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C04-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C04-S03",
    "chapterId": "THR-C04",
    "sceneTitle": "새 도읍의 빈집",
    "historicalYear": "427년",
    "location": "평양 거주지",
    "historicalEventId": "H-G11",
    "characters": [
      "서아",
      "이주민 다은"
    ],
    "backgroundAsset": "BG-1019325c7b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-37e44ec",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 다은의 처지만 옹호하다 원주민의 사정을 듣는다",
    "storyObjective": "서아가 다은의 처지만 옹호하다 원주민의 사정을 듣는다. 남진 정책의 기반과 이주 비용을 함께 적는다.",
    "conflict": "기존 주민이 이주민에게 집터를 빼앗길까 경계한다",
    "dialogueOutline": "서아가 다은의 처지만 옹호하다 원주민의 사정을 듣는다. 남진 정책의 기반과 이주 비용을 함께 적는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "기존 주민이 이주민에게 집터를 빼앗길까 경계한다",
      "turn": "서아가 다은의 처지만 옹호하다 원주민의 사정을 듣는다. 남진 정책의 기반과 이주 비용을 함께 적는다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "국내성에서 평양으로 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-G11"
    ],
    "nextSceneId": "THR-C04-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “427년 / 평양 거주지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C04-S04",
    "chapterId": "THR-C04",
    "sceneTitle": "장수왕의 시선",
    "historicalYear": "5세기",
    "location": "평양 정책 논의처",
    "historicalEventId": "H-G11",
    "characters": [
      "서아",
      "장수왕"
    ],
    "backgroundAsset": "BG-85a7e8b9dd",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-bc9df33",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "왕은 대외 관계와 남진의 필요를 말한다",
    "storyObjective": "왕은 대외 관계와 남진의 필요를 말한다. 서아는 정책의 목적과 주민 보상 문제를 구별해 질문한다.",
    "conflict": "귀족이 이전 수도의 권익을 내세워 계획을 비난한다",
    "dialogueOutline": "왕은 대외 관계와 남진의 필요를 말한다. 서아는 정책의 목적과 주민 보상 문제를 구별해 질문한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "귀족이 이전 수도의 권익을 내세워 계획을 비난한다",
      "turn": "왕은 대외 관계와 남진의 필요를 말한다. 서아는 정책의 목적과 주민 보상 문제를 구별해 질문한다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "국내성에서 평양으로 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-G11"
    ],
    "nextSceneId": "THR-C04-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “5세기 / 평양 정책 논의처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C04-S05",
    "chapterId": "THR-C04",
    "sceneTitle": "북위로 가는 글",
    "historicalYear": "472년",
    "location": "백제 외교문서의 기록 공간",
    "historicalEventId": "H-G12",
    "characters": [
      "서아",
      "백제 서리"
    ],
    "backgroundAsset": "BG-d6d99a551f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-689626e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서리가 개로왕의 구원 요청서를 읽는다",
    "storyObjective": "서리가 개로왕의 구원 요청서를 읽는다. 서아는 적국의 요청을 비겁함으로 단정했던 기록을 고친다.",
    "conflict": "고구려의 승리 기록만 읽은 서아가 백제의 공포를 놓친다",
    "dialogueOutline": "서리가 개로왕의 구원 요청서를 읽는다. 서아는 적국의 요청을 비겁함으로 단정했던 기록을 고친다.",
    "choices": [
      {
        "choiceId": "THR-C04-S05-B1",
        "label": "문서의 요청 이유를 묻는다",
        "action": "문서의 요청 이유를 묻는다",
        "npcReaction": "서리가 공격받는 쪽의 절박함을 드러낸다",
        "followupDialogueOutline": "서아가 문서의 요청 이유를 묻는다 행동을 실행한다. 백제 서리의 반응: 서리가 공격받는 쪽의 절박함을 드러낸다. 상대의 답을 듣고 현재 갈등인 “고구려의 승리 기록만 읽은 서아가 백제의 공포를 놓친다의 처리 결과를 확인한다.",
        "relationshipEffect": "서리가 공격받는 쪽의 절박함을 드러낸다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C04-S05-JOIN"
      },
      {
        "choiceId": "THR-C04-S05-B2",
        "label": "양국 지도를 나란히 놓는다",
        "action": "양국 지도를 나란히 놓는다",
        "npcReaction": "군사 압박이 글의 표현과 연결되어 보인다",
        "followupDialogueOutline": "서아가 양국 지도를 나란히 놓는다 행동을 실행한다. 백제 서리의 반응: 군사 압박이 글의 표현과 연결되어 보인다. 상대의 답을 듣고 현재 갈등인 “고구려의 승리 기록만 읽은 서아가 백제의 공포를 놓친다의 처리 결과를 확인한다.",
        "relationshipEffect": "군사 압박이 글의 표현과 연결되어 보인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C04-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "고구려의 승리 기록만 읽은 서아가 백제의 공포를 놓친다",
      "turn": "서리가 개로왕의 구원 요청서를 읽는다. 서아는 적국의 요청을 비겁함으로 단정했던 기록을 고친다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "북위 구원 요청과 한성 함락",
    "questionIds": [
      "official-61-advanced-06"
    ],
    "genealogyLinks": [
      "H-G12"
    ],
    "nextSceneId": "THR-C04-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “472년 / 백제 외교문서의 기록 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C04-S05-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C04-S06",
    "chapterId": "THR-C04",
    "sceneTitle": "한성 앞의 밤",
    "historicalYear": "475년",
    "location": "한성 외곽",
    "historicalEventId": "H-G12",
    "characters": [
      "서아",
      "고구려 보급병"
    ],
    "backgroundAsset": "BG-f2e8a48fe3",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-3833d59",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 대피 통로를 확보하자고 주장한다",
    "storyObjective": "서아가 대피 통로를 확보하자고 주장한다. 병사는 전투 승패를 바꿀 권한은 없지만 민간 통로를 상관에게 보고한다.",
    "conflict": "공격 준비 중 병사가 주민 대피 소식을 사소한 것으로 취급한다",
    "dialogueOutline": "서아가 대피 통로를 확보하자고 주장한다. 병사는 전투 승패를 바꿀 권한은 없지만 민간 통로를 상관에게 보고한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "공격 준비 중 병사가 주민 대피 소식을 사소한 것으로 취급한다",
      "turn": "서아가 대피 통로를 확보하자고 주장한다. 병사는 전투 승패를 바꿀 권한은 없지만 민간 통로를 상관에게 보고한다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "북위 구원 요청과 한성 함락",
    "questionIds": [],
    "genealogyLinks": [
      "H-G12"
    ],
    "nextSceneId": "THR-C04-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “475년 / 한성 외곽”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C04-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C04-S07",
    "chapterId": "THR-C04",
    "sceneTitle": "불탄 왕도의 소식",
    "historicalYear": "475년",
    "location": "한성 후방 피란길",
    "historicalEventId": "H-G12",
    "characters": [
      "서아",
      "백제 피란민"
    ],
    "backgroundAsset": "BG-8109474e75",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-ea0c35e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 확정된 소식과 아직 모르는 가족의 행방을 나누어 말한다",
    "storyObjective": "서아는 확정된 소식과 아직 모르는 가족의 행방을 나누어 말한다. 피란민은 거짓 위로 대신 찾을 이름을 건넨다.",
    "conflict": "개로왕 전사 소식을 숨겨야 가족이 덜 놀랄 것이라는 유혹",
    "dialogueOutline": "서아는 확정된 소식과 아직 모르는 가족의 행방을 나누어 말한다. 피란민은 거짓 위로 대신 찾을 이름을 건넨다.",
    "choices": [
      {
        "choiceId": "THR-C04-S07-B1",
        "label": "확인된 소식만 전한다",
        "action": "확인된 소식만 전한다",
        "npcReaction": "주민이 슬퍼하면서도 서아의 기록을 신뢰한다",
        "followupDialogueOutline": "서아가 확인된 소식만 전한다 행동을 실행한다. 백제 피란민의 반응: 주민이 슬퍼하면서도 서아의 기록을 신뢰한다. 상대의 답을 듣고 현재 갈등인 “개로왕 전사 소식을 숨겨야 가족이 덜 놀랄 것이라는 유혹의 처리 결과를 확인한다.",
        "relationshipEffect": "주민이 슬퍼하면서도 서아의 기록을 신뢰한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C04-S07-JOIN"
      },
      {
        "choiceId": "THR-C04-S07-B2",
        "label": "수색을 먼저 돕는다",
        "action": "수색을 먼저 돕는다",
        "npcReaction": "가족 확인 뒤 왕도 소식을 함께 받아들인다",
        "followupDialogueOutline": "서아가 수색을 먼저 돕는다 행동을 실행한다. 백제 피란민의 반응: 가족 확인 뒤 왕도 소식을 함께 받아들인다. 상대의 답을 듣고 현재 갈등인 “개로왕 전사 소식을 숨겨야 가족이 덜 놀랄 것이라는 유혹의 처리 결과를 확인한다.",
        "relationshipEffect": "가족 확인 뒤 왕도 소식을 함께 받아들인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C04-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "개로왕 전사 소식을 숨겨야 가족이 덜 놀랄 것이라는 유혹",
      "turn": "서아는 확정된 소식과 아직 모르는 가족의 행방을 나누어 말한다. 피란민은 거짓 위로 대신 찾을 이름을 건넨다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "북위 구원 요청과 한성 함락",
    "questionIds": [],
    "genealogyLinks": [
      "H-G12"
    ],
    "nextSceneId": "THR-C04-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “475년 / 한성 후방 피란길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C04-S08",
    "chapterId": "THR-C04",
    "sceneTitle": "남쪽 돌의 글자",
    "historicalYear": "5세기(정확연대 미확정)",
    "location": "충주 고구려비 관련 기록",
    "historicalEventId": "H-G13",
    "characters": [
      "서아",
      "비문 조사자"
    ],
    "backgroundAsset": "BG-d0d4fba3b5",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-5be65f4",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "조사자가 판독과 건립연도 논쟁을 지적한다",
    "storyObjective": "조사자가 판독과 건립연도 논쟁을 지적한다. 서아는 확인된 대외 관계와 추정 영토를 다른 선으로 그린다.",
    "conflict": "비석 하나로 모든 경계를 그리려는 욕심",
    "dialogueOutline": "조사자가 판독과 건립연도 논쟁을 지적한다. 서아는 확인된 대외 관계와 추정 영토를 다른 선으로 그린다.",
    "choices": [],
    "emotionalBeat": {
      "start": "비석 하나로 모든 경계를 그리려는 욕심",
      "turn": "조사자가 판독과 건립연도 논쟁을 지적한다. 서아는 확인된 대외 관계와 추정 영토를 다른 선으로 그린다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "충주 고구려비와 한반도 중부 영향",
    "questionIds": [],
    "genealogyLinks": [
      "H-G13"
    ],
    "nextSceneId": "THR-C04-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “5세기(정확연대 미확정) / 충주 고구려비 관련 기록”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C04-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C04-S09",
    "chapterId": "THR-C04",
    "sceneTitle": "누가 승리했나",
    "historicalYear": "475년 이후",
    "location": "고구려·백제 기록 대조",
    "historicalEventId": "H-G12",
    "characters": [
      "서아",
      "이주민 다은의 기록"
    ],
    "backgroundAsset": "BG-1df1c6fd76",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-4c7d74c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 고구려의 정책 성과와 백제의 재건 출발점을 함께 기록한다",
    "storyObjective": "서아가 고구려의 정책 성과와 백제의 재건 출발점을 함께 기록한다. 백제 시점의 CH07에서는 전투를 반복하지 않고 탈출 뒤를 보겠다고 예고한다.",
    "conflict": "승전 뒤 삶이 모두 나아졌다는 결론이 피란 증언과 충돌한다",
    "dialogueOutline": "서아가 고구려의 정책 성과와 백제의 재건 출발점을 함께 기록한다. 백제 시점의 CH07에서는 전투를 반복하지 않고 탈출 뒤를 보겠다고 예고한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "승전 뒤 삶이 모두 나아졌다는 결론이 피란 증언과 충돌한다",
      "turn": "서아가 고구려의 정책 성과와 백제의 재건 출발점을 함께 기록한다. 백제 시점의 CH07에서는 전투를 반복하지 않고 탈출 뒤를 보겠다고 예고한다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "북위 구원 요청과 한성 함락",
    "questionIds": [],
    "genealogyLinks": [
      "H-G12"
    ],
    "nextSceneId": "THR-C04-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “475년 이후 / 고구려·백제 기록 대조”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C04-S10",
    "chapterId": "THR-C04",
    "sceneTitle": "오래된 강의 다음 장",
    "historicalYear": "475년→612년",
    "location": "평양 강가·시간 전환",
    "historicalEventId": "H-G15",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-9bfaa60bb9",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C04-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "기록관이 왕계와 경과 시간을 표시한다",
    "storyObjective": "기록관이 왕계와 경과 시간을 표시한다. 서아는 새로운 왕 영양왕의 시대임을 확인하고 수의 원정 소식 속으로 이동한다.",
    "conflict": "150여 년 뒤 장수왕을 다시 만나려는 서아의 혼동",
    "dialogueOutline": "기록관이 왕계와 경과 시간을 표시한다. 서아는 새로운 왕 영양왕의 시대임을 확인하고 수의 원정 소식 속으로 이동한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "150여 년 뒤 장수왕을 다시 만나려는 서아의 혼동",
      "turn": "기록관이 왕계와 경과 시간을 표시한다. 서아는 새로운 왕 영양왕의 시대임을 확인하고 수의 원정 소식 속으로 이동한다.",
      "end": "국가의 남진을 이주민과 적국 주민의 상실을 통해 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "수의 침입과 살수대첩",
    "questionIds": [],
    "genealogyLinks": [
      "H-G15"
    ],
    "nextSceneId": "THR-C05-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “475년→612년 / 평양 강가·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  }
]
```

## CH.05 성벽보다 긴 전쟁

```json
[
  {
    "sceneId": "THR-C05-S01",
    "chapterId": "THR-C05",
    "sceneTitle": "끝없는 군량 수레",
    "historicalYear": "612년",
    "location": "살수로 이어지는 보급로",
    "historicalEventId": "H-G15",
    "characters": [
      "서아",
      "보급병 온달수(허구)"
    ],
    "backgroundAsset": "BG-6c9f3da43d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-573d268",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 수의 보급로를 따라 지도 조각을 맞춘다",
    "storyObjective": "서아가 수의 보급로를 따라 지도 조각을 맞춘다. 병사는 전투만큼 식량과 거리도 전쟁을 결정한다고 말한다.",
    "conflict": "적군 규모에 압도되어 방어를 포기하려는 병사",
    "dialogueOutline": "서아가 수의 보급로를 따라 지도 조각을 맞춘다. 병사는 전투만큼 식량과 거리도 전쟁을 결정한다고 말한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "적군 규모에 압도되어 방어를 포기하려는 병사",
      "turn": "서아가 수의 보급로를 따라 지도 조각을 맞춘다. 병사는 전투만큼 식량과 거리도 전쟁을 결정한다고 말한다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "수의 침입과 살수대첩",
    "questionIds": [],
    "genealogyLinks": [
      "H-G15"
    ],
    "nextSceneId": "THR-C05-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “612년 / 살수로 이어지는 보급로”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C05-S02",
    "chapterId": "THR-C05",
    "sceneTitle": "을지문덕의 기다림",
    "historicalYear": "612년",
    "location": "고구려 지휘소",
    "historicalEventId": "H-G15",
    "characters": [
      "서아",
      "을지문덕"
    ],
    "backgroundAsset": "BG-f7943789bd",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-8f56cba",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 서두르자는 병사를 말리고 을지문덕에게 정찰 결과를 전한다",
    "storyObjective": "서아가 서두르자는 병사를 말리고 을지문덕에게 정찰 결과를 전한다. 승리는 서아의 전략 발명 때문이 아니라 기존 방어와 판단의 결과로 둔다.",
    "conflict": "성급히 공격하면 유리한 지형과 시간을 잃는다",
    "dialogueOutline": "서아가 서두르자는 병사를 말리고 을지문덕에게 정찰 결과를 전한다. 승리는 서아의 전략 발명 때문이 아니라 기존 방어와 판단의 결과로 둔다.",
    "choices": [
      {
        "choiceId": "THR-C05-S02-B1",
        "label": "정찰 소식을 전달한다",
        "action": "정찰 소식을 전달한다",
        "npcReaction": "병사가 답답함을 누르고 대기를 받아들인다",
        "followupDialogueOutline": "서아가 정찰 소식을 전달한다 행동을 실행한다. 을지문덕의 반응: 병사가 답답함을 누르고 대기를 받아들인다. 상대의 답을 듣고 현재 갈등인 “성급히 공격하면 유리한 지형과 시간을 잃는다의 처리 결과를 확인한다.",
        "relationshipEffect": "병사가 답답함을 누르고 대기를 받아들인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C05-S02-JOIN"
      },
      {
        "choiceId": "THR-C05-S02-B2",
        "label": "후방 부상자를 돕는다",
        "action": "후방 부상자를 돕는다",
        "npcReaction": "전투에 못 갔다던 죄책감이 생명을 지킨 책임감으로 바뀐다",
        "followupDialogueOutline": "서아가 후방 부상자를 돕는다 행동을 실행한다. 을지문덕의 반응: 전투에 못 갔다던 죄책감이 생명을 지킨 책임감으로 바뀐다. 상대의 답을 듣고 현재 갈등인 “성급히 공격하면 유리한 지형과 시간을 잃는다의 처리 결과를 확인한다.",
        "relationshipEffect": "전투에 못 갔다던 죄책감이 생명을 지킨 책임감으로 바뀐다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C05-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "성급히 공격하면 유리한 지형과 시간을 잃는다",
      "turn": "서아가 서두르자는 병사를 말리고 을지문덕에게 정찰 결과를 전한다. 승리는 서아의 전략 발명 때문이 아니라 기존 방어와 판단의 결과로 둔다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "수의 침입과 살수대첩",
    "questionIds": [],
    "genealogyLinks": [
      "H-G15"
    ],
    "nextSceneId": "THR-C05-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “612년 / 고구려 지휘소”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C05-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C05-S03",
    "chapterId": "THR-C05",
    "sceneTitle": "살수 뒤의 사람들",
    "historicalYear": "612년",
    "location": "전투 뒤 강변",
    "historicalEventId": "H-G15",
    "characters": [
      "서아",
      "의료 보조 민서"
    ],
    "backgroundAsset": "BG-19e731b936",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-7a5b293",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "민서가 부상자를 분류하고 서아가 물을 건넨다",
    "storyObjective": "민서가 부상자를 분류하고 서아가 물을 건넨다. 살수대첩의 결과를 확인한 뒤 전쟁 피해를 희화화하지 않는다.",
    "conflict": "승리를 기뻐하면서도 다친 사람을 적이라 버릴 수 있는가",
    "dialogueOutline": "민서가 부상자를 분류하고 서아가 물을 건넨다. 살수대첩의 결과를 확인한 뒤 전쟁 피해를 희화화하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "승리를 기뻐하면서도 다친 사람을 적이라 버릴 수 있는가",
      "turn": "민서가 부상자를 분류하고 서아가 물을 건넨다. 살수대첩의 결과를 확인한 뒤 전쟁 피해를 희화화하지 않는다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "수의 침입과 살수대첩",
    "questionIds": [],
    "genealogyLinks": [
      "H-G15"
    ],
    "nextSceneId": "THR-C05-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “612년 / 전투 뒤 강변”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C05-S04",
    "chapterId": "THR-C05",
    "sceneTitle": "길게 쌓는 돌",
    "historicalYear": "631년",
    "location": "천리장성 공사장",
    "historicalEventId": "H-G16",
    "characters": [
      "서아",
      "축성 인부"
    ],
    "backgroundAsset": "BG-310732e4cb",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-c2e7de5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 공사 장부를 읽고 인부의 결손 노동을 듣는다",
    "storyObjective": "서아가 공사 장부를 읽고 인부의 결손 노동을 듣는다. 영류왕 때 축조 시작과 연개소문 활동을 구분한다.",
    "conflict": "방어 필요와 농사철 부역이 충돌한다",
    "dialogueOutline": "서아가 공사 장부를 읽고 인부의 결손 노동을 듣는다. 영류왕 때 축조 시작과 연개소문 활동을 구분한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "방어 필요와 농사철 부역이 충돌한다",
      "turn": "서아가 공사 장부를 읽고 인부의 결손 노동을 듣는다. 영류왕 때 축조 시작과 연개소문 활동을 구분한다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "천리장성 축조와 연개소문 정변",
    "questionIds": [],
    "genealogyLinks": [
      "H-G16"
    ],
    "nextSceneId": "THR-C05-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “631년 / 천리장성 공사장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C05-S05",
    "chapterId": "THR-C05",
    "sceneTitle": "뒤집힌 왕실",
    "historicalYear": "642년",
    "location": "평양 소문이 모이는 거리",
    "historicalEventId": "H-G16",
    "characters": [
      "서아",
      "궁중 서리"
    ],
    "backgroundAsset": "BG-85b8a83e8d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-220a3a6",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서리가 영류왕 피살과 보장왕 즉위를 확인한다",
    "storyObjective": "서리가 영류왕 피살과 보장왕 즉위를 확인한다. 서아는 구국 영웅 또는 악인 하나로 설명하지 않고 권력 갈등을 적는다.",
    "conflict": "연개소문 정변을 듣고 사실과 과장이 뒤섞인다",
    "dialogueOutline": "서리가 영류왕 피살과 보장왕 즉위를 확인한다. 서아는 구국 영웅 또는 악인 하나로 설명하지 않고 권력 갈등을 적는다.",
    "choices": [
      {
        "choiceId": "THR-C05-S05-B1",
        "label": "출처를 확인한다",
        "action": "출처를 확인한다",
        "npcReaction": "서리가 불확실한 숫자를 지우고 확인된 왕위 변화만 남긴다",
        "followupDialogueOutline": "서아가 출처를 확인한다 행동을 실행한다. 궁중 서리의 반응: 서리가 불확실한 숫자를 지우고 확인된 왕위 변화만 남긴다. 상대의 답을 듣고 현재 갈등인 “연개소문 정변을 듣고 사실과 과장이 뒤섞인다의 처리 결과를 확인한다.",
        "relationshipEffect": "서리가 불확실한 숫자를 지우고 확인된 왕위 변화만 남긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C05-S05-JOIN"
      },
      {
        "choiceId": "THR-C05-S05-B2",
        "label": "겁먹은 가족을 귀가시킨다",
        "action": "겁먹은 가족을 귀가시킨다",
        "npcReaction": "주민의 불안이 가라앉고 뒤늦게 정변 기록을 확인한다",
        "followupDialogueOutline": "서아가 겁먹은 가족을 귀가시킨다 행동을 실행한다. 궁중 서리의 반응: 주민의 불안이 가라앉고 뒤늦게 정변 기록을 확인한다. 상대의 답을 듣고 현재 갈등인 “연개소문 정변을 듣고 사실과 과장이 뒤섞인다의 처리 결과를 확인한다.",
        "relationshipEffect": "주민의 불안이 가라앉고 뒤늦게 정변 기록을 확인한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C05-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "연개소문 정변을 듣고 사실과 과장이 뒤섞인다",
      "turn": "서리가 영류왕 피살과 보장왕 즉위를 확인한다. 서아는 구국 영웅 또는 악인 하나로 설명하지 않고 권력 갈등을 적는다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "천리장성 축조와 연개소문 정변",
    "questionIds": [],
    "genealogyLinks": [
      "H-G16"
    ],
    "nextSceneId": "THR-C05-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “642년 / 평양 소문이 모이는 거리”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C05-S06",
    "chapterId": "THR-C05",
    "sceneTitle": "당군이 온다",
    "historicalYear": "645년",
    "location": "요동 방어선",
    "historicalEventId": "H-G17",
    "characters": [
      "서아",
      "고구려 전령"
    ],
    "backgroundAsset": "BG-e7ad2124e8",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-0c8147a",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "전령이 당의 진격 경로를 알려 준다",
    "storyObjective": "전령이 당의 진격 경로를 알려 준다. 서아는 642년과 645년을 분리하고 여러 성의 방어를 지도에 놓는다.",
    "conflict": "국내 정변과 외부 침략을 같은 사건으로 혼동한다",
    "dialogueOutline": "전령이 당의 진격 경로를 알려 준다. 서아는 642년과 645년을 분리하고 여러 성의 방어를 지도에 놓는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "국내 정변과 외부 침략을 같은 사건으로 혼동한다",
      "turn": "전령이 당의 진격 경로를 알려 준다. 서아는 642년과 645년을 분리하고 여러 성의 방어를 지도에 놓는다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "당 침입과 안시성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-G17"
    ],
    "nextSceneId": "THR-C05-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “645년 / 요동 방어선”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C05-S07",
    "chapterId": "THR-C05",
    "sceneTitle": "안시성의 흙자루",
    "historicalYear": "645년",
    "location": "안시성",
    "historicalEventId": "H-G17",
    "characters": [
      "서아",
      "성민 윤서"
    ],
    "backgroundAsset": "BG-3d3e3bfb3e",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-d6075ef",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 성민의 방어 노동에 참여한다",
    "storyObjective": "서아는 성민의 방어 노동에 참여한다. 성주의 이름을 확정해 양만춘으로 소개하지 않고 사료상의 안시성주로 표기한다.",
    "conflict": "군용 흙자루와 주민 식량의 운반 인력이 부족하다",
    "dialogueOutline": "서아는 성민의 방어 노동에 참여한다. 성주의 이름을 확정해 양만춘으로 소개하지 않고 사료상의 안시성주로 표기한다.",
    "choices": [
      {
        "choiceId": "THR-C05-S07-B1",
        "label": "식량 운반을 돕는다",
        "action": "식량 운반을 돕는다",
        "npcReaction": "성민이 서아를 동료로 받아들이고 방어 인력이 버틴다",
        "followupDialogueOutline": "서아가 식량 운반을 돕는다 행동을 실행한다. 성민 윤서의 반응: 성민이 서아를 동료로 받아들이고 방어 인력이 버틴다. 상대의 답을 듣고 현재 갈등인 “군용 흙자루와 주민 식량의 운반 인력이 부족하다의 처리 결과를 확인한다.",
        "relationshipEffect": "성민이 서아를 동료로 받아들이고 방어 인력이 버틴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C05-S07-JOIN"
      },
      {
        "choiceId": "THR-C05-S07-B2",
        "label": "부상자 대피를 돕는다",
        "action": "부상자 대피를 돕는다",
        "npcReaction": "전령이 더 늦어질까 걱정하지만 가족들이 서로 협력한다",
        "followupDialogueOutline": "서아가 부상자 대피를 돕는다 행동을 실행한다. 성민 윤서의 반응: 전령이 더 늦어질까 걱정하지만 가족들이 서로 협력한다. 상대의 답을 듣고 현재 갈등인 “군용 흙자루와 주민 식량의 운반 인력이 부족하다의 처리 결과를 확인한다.",
        "relationshipEffect": "전령이 더 늦어질까 걱정하지만 가족들이 서로 협력한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C05-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "군용 흙자루와 주민 식량의 운반 인력이 부족하다",
      "turn": "서아는 성민의 방어 노동에 참여한다. 성주의 이름을 확정해 양만춘으로 소개하지 않고 사료상의 안시성주로 표기한다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "당 침입과 안시성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-G17"
    ],
    "nextSceneId": "THR-C05-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “645년 / 안시성”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C05-S07-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C05-S08",
    "chapterId": "THR-C05",
    "sceneTitle": "철수의 아침",
    "historicalYear": "645년",
    "location": "안시성 성문",
    "historicalEventId": "H-G17",
    "characters": [
      "서아",
      "성민 윤서"
    ],
    "backgroundAsset": "BG-0a5ec8979a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-d6075ef",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "윤서가 다시 농사를 지을 수 있을지 묻는다",
    "storyObjective": "윤서가 다시 농사를 지을 수 있을지 묻는다. 서아는 승전의 기쁨을 나누되 이후 전쟁이 끝난다고 약속하지 않는다.",
    "conflict": "당군 철수를 전쟁의 영구 종결로 오해한다",
    "dialogueOutline": "윤서가 다시 농사를 지을 수 있을지 묻는다. 서아는 승전의 기쁨을 나누되 이후 전쟁이 끝난다고 약속하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "당군 철수를 전쟁의 영구 종결로 오해한다",
      "turn": "윤서가 다시 농사를 지을 수 있을지 묻는다. 서아는 승전의 기쁨을 나누되 이후 전쟁이 끝난다고 약속하지 않는다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "당 침입과 안시성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-G17"
    ],
    "nextSceneId": "THR-C05-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “645년 / 안시성 성문”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C05-S09",
    "chapterId": "THR-C05",
    "sceneTitle": "서로 다른 유언",
    "historicalYear": "666년",
    "location": "평양 왕실 주변",
    "historicalEventId": "H-G18",
    "characters": [
      "서아",
      "서리"
    ],
    "backgroundAsset": "BG-0a9c7ffe67",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-64a6cc9",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 연남생 등 세력 분열을 듣고 특정 가공 인물의 배신 하나로 멸망을 설명하지 않는다.",
    "storyObjective": "서아는 연남생 등 세력 분열을 듣고 특정 가공 인물의 배신 하나로 멸망을 설명하지 않는다.",
    "conflict": "연개소문 사후 형제 갈등에 주변 사람이 편을 강요한다",
    "dialogueOutline": "서아는 연남생 등 세력 분열을 듣고 특정 가공 인물의 배신 하나로 멸망을 설명하지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C05-S09-B1",
        "label": "주민 호송을 우선한다",
        "action": "주민 호송을 우선한다",
        "npcReaction": "어느 편도 들지 않는다는 비난을 감수하고 민간인을 지킨다",
        "followupDialogueOutline": "서아가 주민 호송을 우선한다 행동을 실행한다. 서리의 반응: 어느 편도 들지 않는다는 비난을 감수하고 민간인을 지킨다. 상대의 답을 듣고 현재 갈등인 “연개소문 사후 형제 갈등에 주변 사람이 편을 강요한다의 처리 결과를 확인한다.",
        "relationshipEffect": "어느 편도 들지 않는다는 비난을 감수하고 민간인을 지킨다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C05-S09-JOIN"
      },
      {
        "choiceId": "THR-C05-S09-B2",
        "label": "명령 출처를 기록한다",
        "action": "명령 출처를 기록한다",
        "npcReaction": "서리가 상충하는 명령을 구별하고 피해 경위를 보존한다",
        "followupDialogueOutline": "서아가 명령 출처를 기록한다 행동을 실행한다. 서리의 반응: 서리가 상충하는 명령을 구별하고 피해 경위를 보존한다. 상대의 답을 듣고 현재 갈등인 “연개소문 사후 형제 갈등에 주변 사람이 편을 강요한다의 처리 결과를 확인한다.",
        "relationshipEffect": "서리가 상충하는 명령을 구별하고 피해 경위를 보존한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C05-S09-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "연개소문 사후 형제 갈등에 주변 사람이 편을 강요한다",
      "turn": "서아는 연남생 등 세력 분열을 듣고 특정 가공 인물의 배신 하나로 멸망을 설명하지 않는다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "내분과 나당 연합군의 고구려 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-G18"
    ],
    "nextSceneId": "THR-C05-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “666년 / 평양 왕실 주변”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C05-S10",
    "chapterId": "THR-C05",
    "sceneTitle": "평양의 마지막 문",
    "historicalYear": "668년",
    "location": "평양 피란길",
    "historicalEventId": "H-G18",
    "characters": [
      "서아",
      "피란민 태문"
    ],
    "backgroundAsset": "BG-b7d78c2fff",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-2cabf4f",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 태문의 아이와 짐을 나눠 맡는다",
    "storyObjective": "서아가 태문의 아이와 짐을 나눠 맡는다. 보장왕·평양 함락과 안동도호부 설치를 전령의 소식으로 확인한다.",
    "conflict": "왕이 항복하면 사람들의 고향 기억도 끝난다는 절망",
    "dialogueOutline": "서아가 태문의 아이와 짐을 나눠 맡는다. 보장왕·평양 함락과 안동도호부 설치를 전령의 소식으로 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "왕이 항복하면 사람들의 고향 기억도 끝난다는 절망",
      "turn": "서아가 태문의 아이와 짐을 나눠 맡는다. 보장왕·평양 함락과 안동도호부 설치를 전령의 소식으로 확인한다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "내분과 나당 연합군의 고구려 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-G18"
    ],
    "nextSceneId": "THR-C05-S11",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “668년 / 평양 피란길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C05-S10-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C05-S11",
    "chapterId": "THR-C05",
    "sceneTitle": "나라 뒤에 남은 이름",
    "historicalYear": "668년 이후",
    "location": "유민 임시 거처",
    "historicalEventId": "H-G18",
    "characters": [
      "서아",
      "유민 태문"
    ],
    "backgroundAsset": "BG-423231542b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-97d7585",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 귀부와 부흥·이주의 여러 경로를 듣는다",
    "storyObjective": "서아는 귀부와 부흥·이주의 여러 경로를 듣는다. 발해를 668년에 곧바로 건국한 것처럼 연결하지 않는다.",
    "conflict": "신라행·북쪽행을 둘러싸고 가족이 다툰다",
    "dialogueOutline": "서아는 귀부와 부흥·이주의 여러 경로를 듣는다. 발해를 668년에 곧바로 건국한 것처럼 연결하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "신라행·북쪽행을 둘러싸고 가족이 다툰다",
      "turn": "서아는 귀부와 부흥·이주의 여러 경로를 듣는다. 발해를 668년에 곧바로 건국한 것처럼 연결하지 않는다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "내분과 나당 연합군의 고구려 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-G18"
    ],
    "nextSceneId": "THR-C05-S12",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “668년 이후 / 유민 임시 거처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C05-S12",
    "chapterId": "THR-C05",
    "sceneTitle": "다시 한강으로",
    "historicalYear": "668년→260년 기록 장면",
    "location": "기록책·한성 관청",
    "historicalEventId": "H-B1",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-4b6fd36265",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C05-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 시간 역행을 명시하고 260년 기록으로 이동한다",
    "storyObjective": "서아는 시간 역행을 명시하고 260년 기록으로 이동한다. 왕국의 성장도 마지막 결과를 모르는 사람들의 일상이었음을 받아들인다.",
    "conflict": "멸망을 먼저 봐서 백제의 처음부터 실패로 판단할 위험",
    "dialogueOutline": "서아는 시간 역행을 명시하고 260년 기록으로 이동한다. 왕국의 성장도 마지막 결과를 모르는 사람들의 일상이었음을 받아들인다.",
    "choices": [],
    "emotionalBeat": {
      "start": "멸망을 먼저 봐서 백제의 처음부터 실패로 판단할 위험",
      "turn": "서아는 시간 역행을 명시하고 260년 기록으로 이동한다. 왕국의 성장도 마지막 결과를 모르는 사람들의 일상이었음을 받아들인다.",
      "end": "한 번의 대승이 영원한 안전을 주지 않으며 멸망 뒤에도 사람이 남음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "6좌평·16관등·관복 정비",
    "questionIds": [],
    "genealogyLinks": [
      "H-B1"
    ],
    "nextSceneId": "THR-C06-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “668년→260년 기록 장면 / 기록책·한성 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C05-S12-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.06 색으로 나뉜 사람들

```json
[
  {
    "sceneId": "THR-C06-S01",
    "chapterId": "THR-C06",
    "sceneTitle": "관복을 빌린 아이",
    "historicalYear": "260년 기록 재현",
    "location": "한성 관청",
    "historicalEventId": "H-B1",
    "characters": [
      "서아",
      "재봉 장인 솔아"
    ],
    "backgroundAsset": "BG-b36368b390",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-16452d5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 옷을 돌려주며 관등과 관복 색의 관계를 묻는다",
    "storyObjective": "서아가 옷을 돌려주며 관등과 관복 색의 관계를 묻는다. 솔아는 옷이 단순한 취향이 아님을 설명한다.",
    "conflict": "아이의 장난이 신분 사칭으로 오해받는다",
    "dialogueOutline": "서아가 옷을 돌려주며 관등과 관복 색의 관계를 묻는다. 솔아는 옷이 단순한 취향이 아님을 설명한다.",
    "choices": [
      {
        "choiceId": "THR-C06-S01-B1",
        "label": "사정을 직접 설명한다",
        "action": "사정을 직접 설명한다",
        "npcReaction": "관리가 엄격히 경고하고 아이는 잘못을 인정한다",
        "followupDialogueOutline": "서아가 사정을 직접 설명한다 행동을 실행한다. 재봉 장인 솔아의 반응: 관리가 엄격히 경고하고 아이는 잘못을 인정한다. 상대의 답을 듣고 현재 갈등인 “아이의 장난이 신분 사칭으로 오해받는다의 처리 결과를 확인한다.",
        "relationshipEffect": "관리가 엄격히 경고하고 아이는 잘못을 인정한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C06-S01-JOIN"
      },
      {
        "choiceId": "THR-C06-S01-B2",
        "label": "솔아를 증인으로 부른다",
        "action": "솔아를 증인으로 부른다",
        "npcReaction": "장인이 수선 의뢰 내역을 보여 오해를 푼다",
        "followupDialogueOutline": "서아가 솔아를 증인으로 부른다 행동을 실행한다. 재봉 장인 솔아의 반응: 장인이 수선 의뢰 내역을 보여 오해를 푼다. 상대의 답을 듣고 현재 갈등인 “아이의 장난이 신분 사칭으로 오해받는다의 처리 결과를 확인한다.",
        "relationshipEffect": "장인이 수선 의뢰 내역을 보여 오해를 푼다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C06-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "아이의 장난이 신분 사칭으로 오해받는다",
      "turn": "서아가 옷을 돌려주며 관등과 관복 색의 관계를 묻는다. 솔아는 옷이 단순한 취향이 아님을 설명한다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "6좌평·16관등·관복 정비",
    "questionIds": [],
    "genealogyLinks": [
      "H-B1"
    ],
    "nextSceneId": "THR-C06-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “260년 기록 재현 / 한성 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C06-S02",
    "chapterId": "THR-C06",
    "sceneTitle": "여섯 자리의 권한",
    "historicalYear": "260년 기록 재현",
    "location": "좌평 집무처",
    "historicalEventId": "H-B1",
    "characters": [
      "서아",
      "백제 서리"
    ],
    "backgroundAsset": "BG-e0e98cfdc4",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-689626e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 6좌평의 역할과 16관등의 서열을 다른 도식에 놓는다",
    "storyObjective": "서아가 6좌평의 역할과 16관등의 서열을 다른 도식에 놓는다. 제도 완성 시기에 대한 기록 해석 유보도 학습 노트에 표시한다.",
    "conflict": "같은 민원을 여러 관서가 돌려보낸다",
    "dialogueOutline": "서아가 6좌평의 역할과 16관등의 서열을 다른 도식에 놓는다. 제도 완성 시기에 대한 기록 해석 유보도 학습 노트에 표시한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "같은 민원을 여러 관서가 돌려보낸다",
      "turn": "서아가 6좌평의 역할과 16관등의 서열을 다른 도식에 놓는다. 제도 완성 시기에 대한 기록 해석 유보도 학습 노트에 표시한다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "6좌평·16관등·관복 정비",
    "questionIds": [
      "official-61-advanced-03"
    ],
    "genealogyLinks": [
      "H-B1"
    ],
    "nextSceneId": "THR-C06-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “260년 기록 재현 / 좌평 집무처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C06-S02-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C06-S03",
    "chapterId": "THR-C06",
    "sceneTitle": "남쪽에서 온 토기",
    "historicalYear": "4세기",
    "location": "한성 교역장",
    "historicalEventId": "H-B2",
    "characters": [
      "서아",
      "마한 상인"
    ],
    "backgroundAsset": "BG-a77685f239",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-a331598",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "상인이 아직 남은 정치체와 교역망을 지적한다",
    "storyObjective": "상인이 아직 남은 정치체와 교역망을 지적한다. 서아는 근초고왕의 팽창과 마한 전 지역 일시 정복을 구분한다.",
    "conflict": "백제 관리가 남쪽 모든 세력이 이미 복속했다고 말한다",
    "dialogueOutline": "상인이 아직 남은 정치체와 교역망을 지적한다. 서아는 근초고왕의 팽창과 마한 전 지역 일시 정복을 구분한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "백제 관리가 남쪽 모든 세력이 이미 복속했다고 말한다",
      "turn": "상인이 아직 남은 정치체와 교역망을 지적한다. 서아는 근초고왕의 팽창과 마한 전 지역 일시 정복을 구분한다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "마한 세력 정복과 교역 확대",
    "questionIds": [],
    "genealogyLinks": [
      "H-B2"
    ],
    "nextSceneId": "THR-C06-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “4세기 / 한성 교역장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C06-S04",
    "chapterId": "THR-C06",
    "sceneTitle": "평양을 향한 배",
    "historicalYear": "371년",
    "location": "백제 출정 나루",
    "historicalEventId": "H-G5",
    "characters": [
      "서아",
      "군량 담당 솔아의 후손"
    ],
    "backgroundAsset": "BG-e32d14a4fe",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-ae9530b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 CH02의 전사 소식을 떠올리지만 예언하지 않는다",
    "storyObjective": "서아는 CH02의 전사 소식을 떠올리지만 예언하지 않는다. 보급품과 편지를 정리하며 공격 측 사람들의 마음을 듣는다.",
    "conflict": "고구려 공격의 전과에 대한 기대와 가족의 두려움",
    "dialogueOutline": "서아는 CH02의 전사 소식을 떠올리지만 예언하지 않는다. 보급품과 편지를 정리하며 공격 측 사람들의 마음을 듣는다.",
    "choices": [
      {
        "choiceId": "THR-C06-S04-B1",
        "label": "가족 편지를 맡는다",
        "action": "가족 편지를 맡는다",
        "npcReaction": "병사가 두려움을 고백하고 가족은 기다릴 이유를 얻는다",
        "followupDialogueOutline": "서아가 가족 편지를 맡는다 행동을 실행한다. 군량 담당 솔아의 후손의 반응: 병사가 두려움을 고백하고 가족은 기다릴 이유를 얻는다. 상대의 답을 듣고 현재 갈등인 “고구려 공격의 전과에 대한 기대와 가족의 두려움의 처리 결과를 확인한다.",
        "relationshipEffect": "병사가 두려움을 고백하고 가족은 기다릴 이유를 얻는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C06-S04-JOIN"
      },
      {
        "choiceId": "THR-C06-S04-B2",
        "label": "보급 명부를 검산한다",
        "action": "보급 명부를 검산한다",
        "npcReaction": "빠진 군량을 찾아내며 장교의 신뢰를 얻는다",
        "followupDialogueOutline": "서아가 보급 명부를 검산한다 행동을 실행한다. 군량 담당 솔아의 후손의 반응: 빠진 군량을 찾아내며 장교의 신뢰를 얻는다. 상대의 답을 듣고 현재 갈등인 “고구려 공격의 전과에 대한 기대와 가족의 두려움의 처리 결과를 확인한다.",
        "relationshipEffect": "빠진 군량을 찾아내며 장교의 신뢰를 얻는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C06-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "고구려 공격의 전과에 대한 기대와 가족의 두려움",
      "turn": "서아는 CH02의 전사 소식을 떠올리지만 예언하지 않는다. 보급품과 편지를 정리하며 공격 측 사람들의 마음을 듣는다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "백제의 평양 공격과 고국원왕 전사",
    "questionIds": [],
    "genealogyLinks": [
      "H-G5"
    ],
    "nextSceneId": "THR-C06-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “371년 / 백제 출정 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C06-S05",
    "chapterId": "THR-C06",
    "sceneTitle": "돌아온 승전보",
    "historicalYear": "371년",
    "location": "한성 거리",
    "historicalEventId": "H-G5",
    "characters": [
      "서아",
      "백제 전령"
    ],
    "backgroundAsset": "BG-28e7748d9c",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-8db71c5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 고국원왕 전사와 백제 성장의 사실을 적되 허구 병사의 죽음도 이야기 속 기억으로 남긴다.",
    "storyObjective": "서아가 고국원왕 전사와 백제 성장의 사실을 적되 허구 병사의 죽음도 이야기 속 기억으로 남긴다.",
    "conflict": "승리 축하가 전사자의 이름을 덮는다",
    "dialogueOutline": "서아가 고국원왕 전사와 백제 성장의 사실을 적되 허구 병사의 죽음도 이야기 속 기억으로 남긴다.",
    "choices": [],
    "emotionalBeat": {
      "start": "승리 축하가 전사자의 이름을 덮는다",
      "turn": "서아가 고국원왕 전사와 백제 성장의 사실을 적되 허구 병사의 죽음도 이야기 속 기억으로 남긴다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "백제의 평양 공격과 고국원왕 전사",
    "questionIds": [],
    "genealogyLinks": [
      "H-G5"
    ],
    "nextSceneId": "THR-C06-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “371년 / 한성 거리”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C06-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C06-S06",
    "chapterId": "THR-C06",
    "sceneTitle": "바다 건너의 칼",
    "historicalYear": "4세기",
    "location": "외교 공방",
    "historicalEventId": "H-B3",
    "characters": [
      "서아",
      "칠지도 장인"
    ],
    "backgroundAsset": "BG-2df83cfeb8",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-889cfea",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 명문의 확인 가능한 글자와 해석을 나눈다",
    "storyObjective": "서아는 명문의 확인 가능한 글자와 해석을 나눈다. 장인이 장식과 철 제작 기술을 보여 준다.",
    "conflict": "칼의 명문을 자신들에게 유리한 위계로 읽으려는 사신",
    "dialogueOutline": "서아는 명문의 확인 가능한 글자와 해석을 나눈다. 장인이 장식과 철 제작 기술을 보여 준다.",
    "choices": [],
    "emotionalBeat": {
      "start": "칼의 명문을 자신들에게 유리한 위계로 읽으려는 사신",
      "turn": "서아는 명문의 확인 가능한 글자와 해석을 나눈다. 장인이 장식과 철 제작 기술을 보여 준다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "칠지도와 왜 교류",
    "questionIds": [],
    "genealogyLinks": [
      "H-B3"
    ],
    "nextSceneId": "THR-C06-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “4세기 / 외교 공방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C06-S07",
    "chapterId": "THR-C06",
    "sceneTitle": "사신의 말은 다르다",
    "historicalYear": "4세기",
    "location": "한성 외교 나루",
    "historicalEventId": "H-B2",
    "characters": [
      "서아",
      "통역관"
    ],
    "backgroundAsset": "BG-d0bf51274e",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-55800e6",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "통역관이 동진·왜 교류의 맥락을 설명한다",
    "storyObjective": "통역관이 동진·왜 교류의 맥락을 설명한다. 서아는 상대의 체면을 지키면서 뜻을 다시 확인한다.",
    "conflict": "물품 거래와 외교 관계를 같은 말로 옮겨 갈등이 난다",
    "dialogueOutline": "통역관이 동진·왜 교류의 맥락을 설명한다. 서아는 상대의 체면을 지키면서 뜻을 다시 확인한다.",
    "choices": [
      {
        "choiceId": "THR-C06-S07-B1",
        "label": "거래 조건을 재확인한다",
        "action": "거래 조건을 재확인한다",
        "npcReaction": "오해가 풀리고 통역관이 서아에게 발언 순서를 맡긴다",
        "followupDialogueOutline": "서아가 거래 조건을 재확인한다 행동을 실행한다. 통역관의 반응: 오해가 풀리고 통역관이 서아에게 발언 순서를 맡긴다. 상대의 답을 듣고 현재 갈등인 “물품 거래와 외교 관계를 같은 말로 옮겨 갈등이 난다의 처리 결과를 확인한다.",
        "relationshipEffect": "오해가 풀리고 통역관이 서아에게 발언 순서를 맡긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C06-S07-JOIN"
      },
      {
        "choiceId": "THR-C06-S07-B2",
        "label": "양쪽 표현을 병기한다",
        "action": "양쪽 표현을 병기한다",
        "npcReaction": "갈등은 남지만 기록에서 한쪽을 지우지 않는다",
        "followupDialogueOutline": "서아가 양쪽 표현을 병기한다 행동을 실행한다. 통역관의 반응: 갈등은 남지만 기록에서 한쪽을 지우지 않는다. 상대의 답을 듣고 현재 갈등인 “물품 거래와 외교 관계를 같은 말로 옮겨 갈등이 난다의 처리 결과를 확인한다.",
        "relationshipEffect": "갈등은 남지만 기록에서 한쪽을 지우지 않는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C06-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "물품 거래와 외교 관계를 같은 말로 옮겨 갈등이 난다",
      "turn": "통역관이 동진·왜 교류의 맥락을 설명한다. 서아는 상대의 체면을 지키면서 뜻을 다시 확인한다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "마한 세력 정복과 교역 확대",
    "questionIds": [],
    "genealogyLinks": [
      "H-B2"
    ],
    "nextSceneId": "THR-C06-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “4세기 / 한성 외교 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C06-S07-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C06-S08",
    "chapterId": "THR-C06",
    "sceneTitle": "처음 맞는 승려",
    "historicalYear": "384년",
    "location": "백제 왕도",
    "historicalEventId": "H-B4",
    "characters": [
      "서아",
      "마라난타"
    ],
    "backgroundAsset": "BG-9692d1bd58",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-4300caf",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 마라난타에게 전래와 국가 후원·개인 신앙의 차이를 묻는다",
    "storyObjective": "서아가 마라난타에게 전래와 국가 후원·개인 신앙의 차이를 묻는다. 침류왕의 재위와 불교 수용 연도를 확인한다.",
    "conflict": "불교 수용을 곧 모든 주민의 개종으로 생각한다",
    "dialogueOutline": "서아가 마라난타에게 전래와 국가 후원·개인 신앙의 차이를 묻는다. 침류왕의 재위와 불교 수용 연도를 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "불교 수용을 곧 모든 주민의 개종으로 생각한다",
      "turn": "서아가 마라난타에게 전래와 국가 후원·개인 신앙의 차이를 묻는다. 침류왕의 재위와 불교 수용 연도를 확인한다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "불교 수용",
    "questionIds": [],
    "genealogyLinks": [
      "H-B4"
    ],
    "nextSceneId": "THR-C06-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “384년 / 백제 왕도”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C06-S09",
    "chapterId": "THR-C06",
    "sceneTitle": "오래된 강의 경고",
    "historicalYear": "384년→475년",
    "location": "한강 나루·시간 전환",
    "historicalEventId": "H-G12",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-af1b0090bd",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C06-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 한성·웅진·사비 빈 지도를 받는다",
    "storyObjective": "서아가 한성·웅진·사비 빈 지도를 받는다. 475년의 같은 강으로 이동하며 이번에는 피란민의 시점에서 기록한다.",
    "conflict": "한성의 번영을 영원한 것으로 믿고 싶은 마음",
    "dialogueOutline": "서아가 한성·웅진·사비 빈 지도를 받는다. 475년의 같은 강으로 이동하며 이번에는 피란민의 시점에서 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "한성의 번영을 영원한 것으로 믿고 싶은 마음",
      "turn": "서아가 한성·웅진·사비 빈 지도를 받는다. 475년의 같은 강으로 이동하며 이번에는 피란민의 시점에서 기록한다.",
      "end": "관직과 교역의 성장 뒤에 가려진 노동과 외교의 언어; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "북위 구원 요청과 한성 함락",
    "questionIds": [],
    "genealogyLinks": [
      "H-G12"
    ],
    "nextSceneId": "THR-C07-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “384년→475년 / 한강 나루·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C06-S09-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.07 강을 건넌 왕도

```json
[
  {
    "sceneId": "THR-C07-S01",
    "chapterId": "THR-C07",
    "sceneTitle": "문이 닫히기 전에",
    "historicalYear": "475년",
    "location": "한성 피란문",
    "historicalEventId": "H-G12",
    "characters": [
      "서아",
      "피란민 해인"
    ],
    "backgroundAsset": "BG-787d1d8e12",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-0993611",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 이미 확인한 함락을 바꾸려 하지 않고 해인의 가족이 나루에 닿게 돕는다.",
    "storyObjective": "서아는 이미 확인한 함락을 바꾸려 하지 않고 해인의 가족이 나루에 닿게 돕는다.",
    "conflict": "CH04에서 본 공격의 결과를 이번에는 안에서 겪는다",
    "dialogueOutline": "서아는 이미 확인한 함락을 바꾸려 하지 않고 해인의 가족이 나루에 닿게 돕는다.",
    "choices": [
      {
        "choiceId": "THR-C07-S01-B1",
        "label": "아이를 먼저 호송한다",
        "action": "아이를 먼저 호송한다",
        "npcReaction": "해인이 짐을 잃어도 가족을 구했다며 손을 잡는다",
        "followupDialogueOutline": "서아가 아이를 먼저 호송한다 행동을 실행한다. 피란민 해인의 반응: 해인이 짐을 잃어도 가족을 구했다며 손을 잡는다. 상대의 답을 듣고 현재 갈등인 “CH04에서 본 공격의 결과를 이번에는 안에서 겪는다의 처리 결과를 확인한다.",
        "relationshipEffect": "해인이 짐을 잃어도 가족을 구했다며 손을 잡는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C07-S01-JOIN"
      },
      {
        "choiceId": "THR-C07-S01-B2",
        "label": "수레를 함께 옮긴다",
        "action": "수레를 함께 옮긴다",
        "npcReaction": "늦게 도착하지만 생계 도구를 남길 수 있다",
        "followupDialogueOutline": "서아가 수레를 함께 옮긴다 행동을 실행한다. 피란민 해인의 반응: 늦게 도착하지만 생계 도구를 남길 수 있다. 상대의 답을 듣고 현재 갈등인 “CH04에서 본 공격의 결과를 이번에는 안에서 겪는다의 처리 결과를 확인한다.",
        "relationshipEffect": "늦게 도착하지만 생계 도구를 남길 수 있다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C07-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "CH04에서 본 공격의 결과를 이번에는 안에서 겪는다",
      "turn": "서아는 이미 확인한 함락을 바꾸려 하지 않고 해인의 가족이 나루에 닿게 돕는다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "북위 구원 요청과 한성 함락",
    "questionIds": [],
    "genealogyLinks": [
      "H-G12"
    ],
    "nextSceneId": "THR-C07-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “475년 / 한성 피란문”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C07-S02",
    "chapterId": "THR-C07",
    "sceneTitle": "왕의 부재",
    "historicalYear": "475년",
    "location": "피란 나루",
    "historicalEventId": "H-G12",
    "characters": [
      "서아",
      "백제 전령"
    ],
    "backgroundAsset": "BG-4df9d8e8c9",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-8db71c5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "전령은 문주가 돌아왔지만 왕도를 되찾지 못했다고 전한다",
    "storyObjective": "전령은 문주가 돌아왔지만 왕도를 되찾지 못했다고 전한다. 서아는 도움 요청과 실제 도착의 시차를 확인한다.",
    "conflict": "개로왕 전사 뒤 지휘가 없어 주민이 흩어진다",
    "dialogueOutline": "전령은 문주가 돌아왔지만 왕도를 되찾지 못했다고 전한다. 서아는 도움 요청과 실제 도착의 시차를 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "개로왕 전사 뒤 지휘가 없어 주민이 흩어진다",
      "turn": "전령은 문주가 돌아왔지만 왕도를 되찾지 못했다고 전한다. 서아는 도움 요청과 실제 도착의 시차를 확인한다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "북위 구원 요청과 한성 함락",
    "questionIds": [],
    "genealogyLinks": [
      "H-G12"
    ],
    "nextSceneId": "THR-C07-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “475년 / 피란 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C07-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C07-S03",
    "chapterId": "THR-C07",
    "sceneTitle": "웅진을 고르는 까닭",
    "historicalYear": "475년",
    "location": "금강 주변",
    "historicalEventId": "H-B5",
    "characters": [
      "서아",
      "문주왕"
    ],
    "backgroundAsset": "BG-e43f3766f6",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-7a6bab8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "왕은 방어·수운·남쪽 생산 기반을 말한다",
    "storyObjective": "왕은 방어·수운·남쪽 생산 기반을 말한다. 서아는 새 수도가 사람들의 재출발을 가능하게 하는지 질문한다.",
    "conflict": "떠나는 것이 패배를 인정하는 일이라는 귀족의 반발",
    "dialogueOutline": "왕은 방어·수운·남쪽 생산 기반을 말한다. 서아는 새 수도가 사람들의 재출발을 가능하게 하는지 질문한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "떠나는 것이 패배를 인정하는 일이라는 귀족의 반발",
      "turn": "왕은 방어·수운·남쪽 생산 기반을 말한다. 서아는 새 수도가 사람들의 재출발을 가능하게 하는지 질문한다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "웅진 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-B5"
    ],
    "nextSceneId": "THR-C07-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “475년 / 금강 주변”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C07-S04",
    "chapterId": "THR-C07",
    "sceneTitle": "강가의 낯선 이웃",
    "historicalYear": "475년",
    "location": "웅진 거주지",
    "historicalEventId": "H-B5",
    "characters": [
      "서아",
      "현지 주민 다솔"
    ],
    "backgroundAsset": "BG-3e06d4492d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-3522e87",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 두 집의 필요한 물건을 적어 서로 빌릴 수 있게 한다",
    "storyObjective": "서아가 두 집의 필요한 물건을 적어 서로 빌릴 수 있게 한다. 왕도 재건을 건물뿐 아니라 공동생활로 보여 준다.",
    "conflict": "피란민이 물과 집터를 차지할까 현지민이 경계한다",
    "dialogueOutline": "서아가 두 집의 필요한 물건을 적어 서로 빌릴 수 있게 한다. 왕도 재건을 건물뿐 아니라 공동생활로 보여 준다.",
    "choices": [
      {
        "choiceId": "THR-C07-S04-B1",
        "label": "공동 급수 순서를 만든다",
        "action": "공동 급수 순서를 만든다",
        "npcReaction": "다솔이 공정한 순서를 인정하고 피란민도 양보한다",
        "followupDialogueOutline": "서아가 공동 급수 순서를 만든다 행동을 실행한다. 현지 주민 다솔의 반응: 다솔이 공정한 순서를 인정하고 피란민도 양보한다. 상대의 답을 듣고 현재 갈등인 “피란민이 물과 집터를 차지할까 현지민이 경계한다의 처리 결과를 확인한다.",
        "relationshipEffect": "다솔이 공정한 순서를 인정하고 피란민도 양보한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C07-S04-JOIN"
      },
      {
        "choiceId": "THR-C07-S04-B2",
        "label": "빈 집터를 함께 찾는다",
        "action": "빈 집터를 함께 찾는다",
        "npcReaction": "해인이 다솔의 안내를 받아 처음으로 고맙다고 말한다",
        "followupDialogueOutline": "서아가 빈 집터를 함께 찾는다 행동을 실행한다. 현지 주민 다솔의 반응: 해인이 다솔의 안내를 받아 처음으로 고맙다고 말한다. 상대의 답을 듣고 현재 갈등인 “피란민이 물과 집터를 차지할까 현지민이 경계한다의 처리 결과를 확인한다.",
        "relationshipEffect": "해인이 다솔의 안내를 받아 처음으로 고맙다고 말한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C07-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "피란민이 물과 집터를 차지할까 현지민이 경계한다",
      "turn": "서아가 두 집의 필요한 물건을 적어 서로 빌릴 수 있게 한다. 왕도 재건을 건물뿐 아니라 공동생활로 보여 준다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "웅진 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-B5"
    ],
    "nextSceneId": "THR-C07-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “475년 / 웅진 거주지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C07-S05",
    "chapterId": "THR-C07",
    "sceneTitle": "끊긴 왕의 이름",
    "historicalYear": "477~479년",
    "location": "웅진 기록실",
    "historicalEventId": "H-B5",
    "characters": [
      "서아",
      "서리"
    ],
    "backgroundAsset": "BG-00c7d6eefe",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-64a6cc9",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 삼근왕과 동성왕을 계승표에 복원한다",
    "storyObjective": "서아가 삼근왕과 동성왕을 계승표에 복원한다. 정치 불안과 개인적 비극을 단순한 인물평으로 끝내지 않는다.",
    "conflict": "문주왕 뒤에 곧 무령왕을 적어 혼란을 지운다",
    "dialogueOutline": "서아가 삼근왕과 동성왕을 계승표에 복원한다. 정치 불안과 개인적 비극을 단순한 인물평으로 끝내지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "문주왕 뒤에 곧 무령왕을 적어 혼란을 지운다",
      "turn": "서아가 삼근왕과 동성왕을 계승표에 복원한다. 정치 불안과 개인적 비극을 단순한 인물평으로 끝내지 않는다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "웅진 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-B5"
    ],
    "nextSceneId": "THR-C07-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “477~479년 / 웅진 기록실”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C07-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C07-S06",
    "chapterId": "THR-C07",
    "sceneTitle": "다시 모이는 장터",
    "historicalYear": "493년 이전",
    "location": "웅진 장터",
    "historicalEventId": "H-B6",
    "characters": [
      "서아",
      "상인 해인"
    ],
    "backgroundAsset": "BG-944fbaa85a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-15dbbce",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "해인이 외교가 자기 수레의 안전과 연결된다고 말한다",
    "storyObjective": "해인이 외교가 자기 수레의 안전과 연결된다고 말한다. 서아는 동성왕이 고구려를 견제하며 외교를 넓힌 맥락을 듣는다.",
    "conflict": "군사 위험 때문에 거래와 생계가 막힌다",
    "dialogueOutline": "해인이 외교가 자기 수레의 안전과 연결된다고 말한다. 서아는 동성왕이 고구려를 견제하며 외교를 넓힌 맥락을 듣는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "군사 위험 때문에 거래와 생계가 막힌다",
      "turn": "해인이 외교가 자기 수레의 안전과 연결된다고 말한다. 서아는 동성왕이 고구려를 견제하며 외교를 넓힌 맥락을 듣는다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "신라와 혼인 동맹",
    "questionIds": [],
    "genealogyLinks": [
      "H-B6"
    ],
    "nextSceneId": "THR-C07-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “493년 이전 / 웅진 장터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C07-S07",
    "chapterId": "THR-C07",
    "sceneTitle": "혼인 문서의 무게",
    "historicalYear": "493년",
    "location": "백제·신라 사절 숙소",
    "historicalEventId": "H-B6",
    "characters": [
      "서아",
      "신라 사신"
    ],
    "backgroundAsset": "BG-e16ed0282a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-fb59915",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 동맹의 목적을 확인하고 혼인 당사자의 감정을 사료 사실과 구별한다.",
    "storyObjective": "서아가 동맹의 목적을 확인하고 혼인 당사자의 감정을 사료 사실과 구별한다.",
    "conflict": "왕실 혼인을 개인의 사랑 이야기로만 꾸미려는 소문",
    "dialogueOutline": "서아가 동맹의 목적을 확인하고 혼인 당사자의 감정을 사료 사실과 구별한다.",
    "choices": [
      {
        "choiceId": "THR-C07-S07-B1",
        "label": "호송 준비를 돕는다",
        "action": "호송 준비를 돕는다",
        "npcReaction": "사신이 정치적 약속의 실무를 맡긴다",
        "followupDialogueOutline": "서아가 호송 준비를 돕는다 행동을 실행한다. 신라 사신의 반응: 사신이 정치적 약속의 실무를 맡긴다. 상대의 답을 듣고 현재 갈등인 “왕실 혼인을 개인의 사랑 이야기로만 꾸미려는 소문의 처리 결과를 확인한다.",
        "relationshipEffect": "사신이 정치적 약속의 실무를 맡긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C07-S07-JOIN"
      },
      {
        "choiceId": "THR-C07-S07-B2",
        "label": "물자 교환을 확인한다",
        "action": "물자 교환을 확인한다",
        "npcReaction": "해인이 외교 뒤 장터가 다시 열릴 가능성을 이해한다",
        "followupDialogueOutline": "서아가 물자 교환을 확인한다 행동을 실행한다. 신라 사신의 반응: 해인이 외교 뒤 장터가 다시 열릴 가능성을 이해한다. 상대의 답을 듣고 현재 갈등인 “왕실 혼인을 개인의 사랑 이야기로만 꾸미려는 소문의 처리 결과를 확인한다.",
        "relationshipEffect": "해인이 외교 뒤 장터가 다시 열릴 가능성을 이해한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C07-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "왕실 혼인을 개인의 사랑 이야기로만 꾸미려는 소문",
      "turn": "서아가 동맹의 목적을 확인하고 혼인 당사자의 감정을 사료 사실과 구별한다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "신라와 혼인 동맹",
    "questionIds": [],
    "genealogyLinks": [
      "H-B6"
    ],
    "nextSceneId": "THR-C07-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “493년 / 백제·신라 사절 숙소”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C07-S07-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C07-S08",
    "chapterId": "THR-C07",
    "sceneTitle": "믿음의 조건",
    "historicalYear": "493년 이후",
    "location": "웅진 나루",
    "historicalEventId": "H-B6",
    "characters": [
      "서아",
      "상인 해인"
    ],
    "backgroundAsset": "BG-7ce6eb6595",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-15dbbce",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 동맹의 이익과 이해관계 변화 가능성을 함께 기록한다",
    "storyObjective": "서아가 동맹의 이익과 이해관계 변화 가능성을 함께 기록한다. 554년의 결렬은 지금 인물에게 알려 주지 않는다.",
    "conflict": "동맹을 맺으면 전쟁이 없어진다는 기대",
    "dialogueOutline": "서아가 동맹의 이익과 이해관계 변화 가능성을 함께 기록한다. 554년의 결렬은 지금 인물에게 알려 주지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "동맹을 맺으면 전쟁이 없어진다는 기대",
      "turn": "서아가 동맹의 이익과 이해관계 변화 가능성을 함께 기록한다. 554년의 결렬은 지금 인물에게 알려 주지 않는다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "신라와 혼인 동맹",
    "questionIds": [],
    "genealogyLinks": [
      "H-B6"
    ],
    "nextSceneId": "THR-C07-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “493년 이후 / 웅진 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C07-S09",
    "chapterId": "THR-C07",
    "sceneTitle": "왕릉으로 이어진 길",
    "historicalYear": "501년",
    "location": "웅진 관청·시간 전환",
    "historicalEventId": "H-B7",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-b049fc97cc",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C07-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 동성왕과 무령왕의 관계를 단순 부자로 확정하지 않는다",
    "storyObjective": "서아가 동성왕과 무령왕의 관계를 단순 부자로 확정하지 않는다. 새 왕의 지방 통제와 재건으로 장면을 넘긴다.",
    "conflict": "왕 교체 소식과 반란을 듣고 다시 무너질까 걱정한다",
    "dialogueOutline": "서아가 동성왕과 무령왕의 관계를 단순 부자로 확정하지 않는다. 새 왕의 지방 통제와 재건으로 장면을 넘긴다.",
    "choices": [],
    "emotionalBeat": {
      "start": "왕 교체 소식과 반란을 듣고 다시 무너질까 걱정한다",
      "turn": "서아가 동성왕과 무령왕의 관계를 단순 부자로 확정하지 않는다. 새 왕의 지방 통제와 재건으로 장면을 넘긴다.",
      "end": "탈출·정착·동맹이 국가 재건을 이루는 과정; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "22담로에 왕족 파견",
    "questionIds": [],
    "genealogyLinks": [
      "H-B7"
    ],
    "nextSceneId": "THR-C08-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “501년 / 웅진 관청·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C07-S09-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.08 돌아온 땅과 잃은 강

```json
[
  {
    "sceneId": "THR-C08-S01",
    "chapterId": "THR-C08",
    "sceneTitle": "왕족의 파견장",
    "historicalYear": "6세기 초",
    "location": "웅진 관청",
    "historicalEventId": "H-B7",
    "characters": [
      "서아",
      "무령왕"
    ],
    "backgroundAsset": "BG-7b24f8c41a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-0c70a4d",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "왕이 22담로 통제를 설명하고 서아는 먼 지역의 목소리가 중앙에 닿는지 묻는다.",
    "storyObjective": "왕이 22담로 통제를 설명하고 서아는 먼 지역의 목소리가 중앙에 닿는지 묻는다.",
    "conflict": "왕족 파견이 지방민에게는 간섭으로 느껴진다",
    "dialogueOutline": "왕이 22담로 통제를 설명하고 서아는 먼 지역의 목소리가 중앙에 닿는지 묻는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "왕족 파견이 지방민에게는 간섭으로 느껴진다",
      "turn": "왕이 22담로 통제를 설명하고 서아는 먼 지역의 목소리가 중앙에 닿는지 묻는다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "22담로에 왕족 파견",
    "questionIds": [],
    "genealogyLinks": [
      "H-B7"
    ],
    "nextSceneId": "THR-C08-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “6세기 초 / 웅진 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C08-S02",
    "chapterId": "THR-C08",
    "sceneTitle": "담로의 두 장부",
    "historicalYear": "6세기 초",
    "location": "지방 담로 관청",
    "historicalEventId": "H-B7",
    "characters": [
      "서아",
      "지방 서리 여울"
    ],
    "backgroundAsset": "BG-74eb53d27f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-58d257c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 둘을 검산하자 여울은 누락을 숨기고 싶어 한다",
    "storyObjective": "서아가 둘을 검산하자 여울은 누락을 숨기고 싶어 한다. 담로 통제가 단순한 지도 점 찍기가 아님을 드러낸다.",
    "conflict": "중앙 보고와 실제 창고 수량이 맞지 않는다",
    "dialogueOutline": "서아가 둘을 검산하자 여울은 누락을 숨기고 싶어 한다. 담로 통제가 단순한 지도 점 찍기가 아님을 드러낸다.",
    "choices": [
      {
        "choiceId": "THR-C08-S02-B1",
        "label": "오류를 함께 보고한다",
        "action": "오류를 함께 보고한다",
        "npcReaction": "여울이 책임을 인정하고 서아에게 수정 장부를 맡긴다",
        "followupDialogueOutline": "서아가 오류를 함께 보고한다 행동을 실행한다. 지방 서리 여울의 반응: 여울이 책임을 인정하고 서아에게 수정 장부를 맡긴다. 상대의 답을 듣고 현재 갈등인 “중앙 보고와 실제 창고 수량이 맞지 않는다의 처리 결과를 확인한다.",
        "relationshipEffect": "여울이 책임을 인정하고 서아에게 수정 장부를 맡긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C08-S02-JOIN"
      },
      {
        "choiceId": "THR-C08-S02-B2",
        "label": "주민 진술을 먼저 듣는다",
        "action": "주민 진술을 먼저 듣는다",
        "npcReaction": "누락의 피해가 보이고 보고의 근거가 늘어난다",
        "followupDialogueOutline": "서아가 주민 진술을 먼저 듣는다 행동을 실행한다. 지방 서리 여울의 반응: 누락의 피해가 보이고 보고의 근거가 늘어난다. 상대의 답을 듣고 현재 갈등인 “중앙 보고와 실제 창고 수량이 맞지 않는다의 처리 결과를 확인한다.",
        "relationshipEffect": "누락의 피해가 보이고 보고의 근거가 늘어난다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C08-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "중앙 보고와 실제 창고 수량이 맞지 않는다",
      "turn": "서아가 둘을 검산하자 여울은 누락을 숨기고 싶어 한다. 담로 통제가 단순한 지도 점 찍기가 아님을 드러낸다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "22담로에 왕족 파견",
    "questionIds": [
      "official-77-advanced-05"
    ],
    "genealogyLinks": [
      "H-B7"
    ],
    "nextSceneId": "THR-C08-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “6세기 초 / 지방 담로 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C08-S02-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C08-S03",
    "chapterId": "THR-C08",
    "sceneTitle": "무덤의 이름표",
    "historicalYear": "523·525 장례 기록의 후대 관찰",
    "location": "무령왕릉 자료 공간",
    "historicalEventId": "H-B8",
    "characters": [
      "서아",
      "유물 기록관"
    ],
    "backgroundAsset": "BG-89a202a9a0",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-49bec74",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 왕·왕비 지석과 벽돌무덤 구조를 대조한다",
    "storyObjective": "서아가 왕·왕비 지석과 벽돌무덤 구조를 대조한다. 실제 무덤에 들어가 유물을 가져오는 연출은 쓰지 않는다.",
    "conflict": "발굴일1971을 왕의 사망년으로 혼동한다",
    "dialogueOutline": "서아가 왕·왕비 지석과 벽돌무덤 구조를 대조한다. 실제 무덤에 들어가 유물을 가져오는 연출은 쓰지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "발굴일1971을 왕의 사망년으로 혼동한다",
      "turn": "서아가 왕·왕비 지석과 벽돌무덤 구조를 대조한다. 실제 무덤에 들어가 유물을 가져오는 연출은 쓰지 않는다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "무령왕릉·지석·벽돌무덤·석수",
    "questionIds": [],
    "genealogyLinks": [
      "H-B8"
    ],
    "nextSceneId": "THR-C08-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “523·525 장례 기록의 후대 관찰 / 무령왕릉 자료 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C08-S04",
    "chapterId": "THR-C08",
    "sceneTitle": "웅진의 좁은 길",
    "historicalYear": "538년",
    "location": "사비 이주 준비처",
    "historicalEventId": "H-B9",
    "characters": [
      "서아",
      "성왕"
    ],
    "backgroundAsset": "BG-dba8971bc3",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-2c70974",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 왕에게 행정·교통 확장 이유를 듣고 주민에게는 재이주의 피로를 듣는다.",
    "storyObjective": "서아가 왕에게 행정·교통 확장 이유를 듣고 주민에게는 재이주의 피로를 듣는다.",
    "conflict": "웅진에서 자리 잡은 가족이 또 떠나야 한다",
    "dialogueOutline": "서아가 왕에게 행정·교통 확장 이유를 듣고 주민에게는 재이주의 피로를 듣는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "웅진에서 자리 잡은 가족이 또 떠나야 한다",
      "turn": "서아가 왕에게 행정·교통 확장 이유를 듣고 주민에게는 재이주의 피로를 듣는다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "사비 천도·국호 남부여",
    "questionIds": [],
    "genealogyLinks": [
      "H-B9"
    ],
    "nextSceneId": "THR-C08-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “538년 / 사비 이주 준비처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C08-S05",
    "chapterId": "THR-C08",
    "sceneTitle": "남부여의 현판",
    "historicalYear": "538년",
    "location": "사비 관청",
    "historicalEventId": "H-B9",
    "characters": [
      "서아",
      "백제 서리"
    ],
    "backgroundAsset": "BG-d0dae2d83d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-689626e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 백제의 연속성과 남부여의 계승 의식을 구분한다",
    "storyObjective": "서아가 백제의 연속성과 남부여의 계승 의식을 구분한다. 서리는 5부5방·22부의 기능을 다른 종이에 적는다.",
    "conflict": "국호 변화가 새로운 왕조 건국이라는 오해",
    "dialogueOutline": "서아가 백제의 연속성과 남부여의 계승 의식을 구분한다. 서리는 5부5방·22부의 기능을 다른 종이에 적는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "국호 변화가 새로운 왕조 건국이라는 오해",
      "turn": "서아가 백제의 연속성과 남부여의 계승 의식을 구분한다. 서리는 5부5방·22부의 기능을 다른 종이에 적는다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "사비 천도·국호 남부여",
    "questionIds": [],
    "genealogyLinks": [
      "H-B9"
    ],
    "nextSceneId": "THR-C08-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “538년 / 사비 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C08-S06",
    "chapterId": "THR-C08",
    "sceneTitle": "옛 강으로의 귀환",
    "historicalYear": "551년",
    "location": "한강 회복 지역",
    "historicalEventId": "H-B10",
    "characters": [
      "서아",
      "백제 병사"
    ],
    "backgroundAsset": "BG-f3dae449a6",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-ba45dbb",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 함께 움직인 양국의 역할을 병사에게 확인한다",
    "storyObjective": "서아는 함께 움직인 양국의 역할을 병사에게 확인한다. 회복한 땅의 주민은 또 통치자가 바뀌었다고 말한다.",
    "conflict": "신라와 협력한 승리를 자기 나라 단독 공적으로 적으려 한다",
    "dialogueOutline": "서아는 함께 움직인 양국의 역할을 병사에게 확인한다. 회복한 땅의 주민은 또 통치자가 바뀌었다고 말한다.",
    "choices": [
      {
        "choiceId": "THR-C08-S06-B1",
        "label": "양국의 증언을 병기한다",
        "action": "양국의 증언을 병기한다",
        "npcReaction": "병사가 불쾌해도 동맹의 역할을 지울 수 없음을 인정한다",
        "followupDialogueOutline": "서아가 양국의 증언을 병기한다 행동을 실행한다. 백제 병사의 반응: 병사가 불쾌해도 동맹의 역할을 지울 수 없음을 인정한다. 상대의 답을 듣고 현재 갈등인 “신라와 협력한 승리를 자기 나라 단독 공적으로 적으려 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "병사가 불쾌해도 동맹의 역할을 지울 수 없음을 인정한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C08-S06-JOIN"
      },
      {
        "choiceId": "THR-C08-S06-B2",
        "label": "주민 귀환을 돕는다",
        "action": "주민 귀환을 돕는다",
        "npcReaction": "주민이 전쟁터와 생활 공간의 차이를 알려 준다",
        "followupDialogueOutline": "서아가 주민 귀환을 돕는다 행동을 실행한다. 백제 병사의 반응: 주민이 전쟁터와 생활 공간의 차이를 알려 준다. 상대의 답을 듣고 현재 갈등인 “신라와 협력한 승리를 자기 나라 단독 공적으로 적으려 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "주민이 전쟁터와 생활 공간의 차이를 알려 준다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C08-S06-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "신라와 협력한 승리를 자기 나라 단독 공적으로 적으려 한다",
      "turn": "서아는 함께 움직인 양국의 역할을 병사에게 확인한다. 회복한 땅의 주민은 또 통치자가 바뀌었다고 말한다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 회복·신라 장악·관산성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B10"
    ],
    "nextSceneId": "THR-C08-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “551년 / 한강 회복 지역”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C08-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C08-S07",
    "chapterId": "THR-C08",
    "sceneTitle": "강을 빼앗긴 지도",
    "historicalYear": "553년",
    "location": "사비 군영",
    "historicalEventId": "H-B10",
    "characters": [
      "서아",
      "백제 사신"
    ],
    "backgroundAsset": "BG-95aad585e6",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-07f470d",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 진흥왕의 정책과 성왕의 분노를 두 지도에서 확인한다",
    "storyObjective": "서아가 진흥왕의 정책과 성왕의 분노를 두 지도에서 확인한다. 이해관계가 동맹을 바꾸는 계기를 기록한다.",
    "conflict": "신라의 한강 장악 소식이 과장된 소문과 뒤섞인다",
    "dialogueOutline": "서아가 진흥왕의 정책과 성왕의 분노를 두 지도에서 확인한다. 이해관계가 동맹을 바꾸는 계기를 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "신라의 한강 장악 소식이 과장된 소문과 뒤섞인다",
      "turn": "서아가 진흥왕의 정책과 성왕의 분노를 두 지도에서 확인한다. 이해관계가 동맹을 바꾸는 계기를 기록한다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 회복·신라 장악·관산성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B10"
    ],
    "nextSceneId": "THR-C08-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “553년 / 사비 군영”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C08-S08",
    "chapterId": "THR-C08",
    "sceneTitle": "관산성으로 가는 편지",
    "historicalYear": "554년",
    "location": "관산성 후방",
    "historicalEventId": "H-B10",
    "characters": [
      "서아",
      "병사 가족 여울"
    ],
    "backgroundAsset": "BG-9577a90cb2",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-5fbdd59",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 가족의 편지를 전달하며 누가 전쟁의 대가를 치르는지 묻는다.",
    "storyObjective": "서아가 가족의 편지를 전달하며 누가 전쟁의 대가를 치르는지 묻는다.",
    "conflict": "복수를 지지하면 가족을 위험으로 보내는 셈인가",
    "dialogueOutline": "서아가 가족의 편지를 전달하며 누가 전쟁의 대가를 치르는지 묻는다.",
    "choices": [
      {
        "choiceId": "THR-C08-S08-B1",
        "label": "편지를 읽어 주도록 부탁한다",
        "action": "편지를 읽어 주도록 부탁한다",
        "npcReaction": "병사가 두려움을 말하고 가족에게 답장을 남긴다",
        "followupDialogueOutline": "서아가 편지를 읽어 주도록 부탁한다 행동을 실행한다. 병사 가족 여울의 반응: 병사가 두려움을 말하고 가족에게 답장을 남긴다. 상대의 답을 듣고 현재 갈등인 “복수를 지지하면 가족을 위험으로 보내는 셈인가의 처리 결과를 확인한다.",
        "relationshipEffect": "병사가 두려움을 말하고 가족에게 답장을 남긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C08-S08-JOIN"
      },
      {
        "choiceId": "THR-C08-S08-B2",
        "label": "귀환 약속을 피한다",
        "action": "귀환 약속을 피한다",
        "npcReaction": "가족이 서운해하다 거짓 보장 대신 준비할 일을 듣는다",
        "followupDialogueOutline": "서아가 귀환 약속을 피한다 행동을 실행한다. 병사 가족 여울의 반응: 가족이 서운해하다 거짓 보장 대신 준비할 일을 듣는다. 상대의 답을 듣고 현재 갈등인 “복수를 지지하면 가족을 위험으로 보내는 셈인가의 처리 결과를 확인한다.",
        "relationshipEffect": "가족이 서운해하다 거짓 보장 대신 준비할 일을 듣는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C08-S08-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "복수를 지지하면 가족을 위험으로 보내는 셈인가",
      "turn": "서아가 가족의 편지를 전달하며 누가 전쟁의 대가를 치르는지 묻는다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 회복·신라 장악·관산성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B10"
    ],
    "nextSceneId": "THR-C08-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “554년 / 관산성 후방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C08-S09",
    "chapterId": "THR-C08",
    "sceneTitle": "돌아오지 못한 왕",
    "historicalYear": "554년",
    "location": "백제 후방 구호소",
    "historicalEventId": "H-B10",
    "characters": [
      "서아",
      "전령"
    ],
    "backgroundAsset": "BG-d681fd0748",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-41ff692",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "전령이 패전을 확인한다",
    "storyObjective": "전령이 패전을 확인한다. 서아는 551년 협력과 553년 장악·554년 전투의 순서를 분리해 남긴다.",
    "conflict": "성왕 전사 뒤 동맹의 기억까지 배신으로만 지우려 한다",
    "dialogueOutline": "전령이 패전을 확인한다. 서아는 551년 협력과 553년 장악·554년 전투의 순서를 분리해 남긴다.",
    "choices": [],
    "emotionalBeat": {
      "start": "성왕 전사 뒤 동맹의 기억까지 배신으로만 지우려 한다",
      "turn": "전령이 패전을 확인한다. 서아는 551년 협력과 553년 장악·554년 전투의 순서를 분리해 남긴다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 회복·신라 장악·관산성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B10"
    ],
    "nextSceneId": "THR-C08-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “554년 / 백제 후방 구호소”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C08-S09-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C08-S10",
    "chapterId": "THR-C08",
    "sceneTitle": "바뀐 국경의 사람",
    "historicalYear": "554년 이후",
    "location": "접경 장터",
    "historicalEventId": "H-B10",
    "characters": [
      "서아",
      "백제·신라 상인"
    ],
    "backgroundAsset": "BG-4b849812e1",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-61d5ad2",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 개인 관계를 유지할 작은 거래를 중재하되 국가적 적대가 사라졌다고 끝내지 않는다.",
    "storyObjective": "서아가 개인 관계를 유지할 작은 거래를 중재하되 국가적 적대가 사라졌다고 끝내지 않는다.",
    "conflict": "오래 거래한 상대를 국적만으로 밀어낸다",
    "dialogueOutline": "서아가 개인 관계를 유지할 작은 거래를 중재하되 국가적 적대가 사라졌다고 끝내지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "오래 거래한 상대를 국적만으로 밀어낸다",
      "turn": "서아가 개인 관계를 유지할 작은 거래를 중재하되 국가적 적대가 사라졌다고 끝내지 않는다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 회복·신라 장악·관산성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B10"
    ],
    "nextSceneId": "THR-C08-S11",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “554년 이후 / 접경 장터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C08-S11",
    "chapterId": "THR-C08",
    "sceneTitle": "기록을 건너는 불빛",
    "historicalYear": "554년→639년",
    "location": "사비·익산 전환",
    "historicalEventId": "H-B11",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-695b23c87b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C08-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 다음 세대 왕들을 확인하고 미륵사 조성 기록의 시기로 이동한다",
    "storyObjective": "서아는 다음 세대 왕들을 확인하고 미륵사 조성 기록의 시기로 이동한다. 같은 여울을 젊은 모습으로 재등장시키지 않는다.",
    "conflict": "패전 뒤 백제 문화가 사라졌다는 결론",
    "dialogueOutline": "서아는 다음 세대 왕들을 확인하고 미륵사 조성 기록의 시기로 이동한다. 같은 여울을 젊은 모습으로 재등장시키지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "패전 뒤 백제 문화가 사라졌다는 결론",
      "turn": "서아는 다음 세대 왕들을 확인하고 미륵사 조성 기록의 시기로 이동한다. 같은 여울을 젊은 모습으로 재등장시키지 않는다.",
      "end": "재건의 성공·수도 이동·동맹 파탄을 장기 관계로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "미륵사와 백제 불교·건축",
    "questionIds": [],
    "genealogyLinks": [
      "H-B11"
    ],
    "nextSceneId": "THR-C09-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “554년→639년 / 사비·익산 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C08-S11-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.09 향로의 불씨와 마지막 배

```json
[
  {
    "sceneId": "THR-C09-S01",
    "chapterId": "THR-C09",
    "sceneTitle": "돌탑의 빈 자리",
    "historicalYear": "639년",
    "location": "미륵사 조성 현장",
    "historicalEventId": "H-B11",
    "characters": [
      "서아",
      "백제 장인 도연"
    ],
    "backgroundAsset": "BG-45a41a006e",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-4d96475",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 서동설화와 사리봉안기의 왕비 기록을 구별한다",
    "storyObjective": "서아가 서동설화와 사리봉안기의 왕비 기록을 구별한다. 특정 전승을 사실로 덮어쓰지 않는다.",
    "conflict": "설화의 인물만 후원자로 말하자 장인이 명문 기록을 보여 준다",
    "dialogueOutline": "서아가 서동설화와 사리봉안기의 왕비 기록을 구별한다. 특정 전승을 사실로 덮어쓰지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "설화의 인물만 후원자로 말하자 장인이 명문 기록을 보여 준다",
      "turn": "서아가 서동설화와 사리봉안기의 왕비 기록을 구별한다. 특정 전승을 사실로 덮어쓰지 않는다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "미륵사와 백제 불교·건축",
    "questionIds": [],
    "genealogyLinks": [
      "H-B11"
    ],
    "nextSceneId": "THR-C09-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “639년 / 미륵사 조성 현장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C09-S02",
    "chapterId": "THR-C09",
    "sceneTitle": "향로의 작은 산",
    "historicalYear": "6~7세기(제작일 미상)",
    "location": "사비 공방 재현",
    "historicalEventId": "H-B12",
    "characters": [
      "서아",
      "금속 장인"
    ],
    "backgroundAsset": "BG-4f5b8221d1",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-82720d5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 금동대향로의 산과 인물·동물을 관찰하고 불교·도교 요소의 공존을 기록한다.",
    "storyObjective": "서아가 금동대향로의 산과 인물·동물을 관찰하고 불교·도교 요소의 공존을 기록한다.",
    "conflict": "서아는 유물을 장식품이라 부르고 장인은 분업과 상징을 강조한다",
    "dialogueOutline": "서아가 금동대향로의 산과 인물·동물을 관찰하고 불교·도교 요소의 공존을 기록한다.",
    "choices": [
      {
        "choiceId": "THR-C09-S02-B1",
        "label": "제작 도구를 정리한다",
        "action": "제작 도구를 정리한다",
        "npcReaction": "장인이 숙련 노동의 어려움을 이야기한다",
        "followupDialogueOutline": "서아가 제작 도구를 정리한다 행동을 실행한다. 금속 장인의 반응: 장인이 숙련 노동의 어려움을 이야기한다. 상대의 답을 듣고 현재 갈등인 “서아는 유물을 장식품이라 부르고 장인은 분업과 상징을 강조한다의 처리 결과를 확인한다.",
        "relationshipEffect": "장인이 숙련 노동의 어려움을 이야기한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C09-S02-JOIN"
      },
      {
        "choiceId": "THR-C09-S02-B2",
        "label": "도상 해석을 묻는다",
        "action": "도상 해석을 묻는다",
        "npcReaction": "장인이 확실한 관찰과 추정을 나눠 설명한다",
        "followupDialogueOutline": "서아가 도상 해석을 묻는다 행동을 실행한다. 금속 장인의 반응: 장인이 확실한 관찰과 추정을 나눠 설명한다. 상대의 답을 듣고 현재 갈등인 “서아는 유물을 장식품이라 부르고 장인은 분업과 상징을 강조한다의 처리 결과를 확인한다.",
        "relationshipEffect": "장인이 확실한 관찰과 추정을 나눠 설명한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C09-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "서아는 유물을 장식품이라 부르고 장인은 분업과 상징을 강조한다",
      "turn": "서아가 금동대향로의 산과 인물·동물을 관찰하고 불교·도교 요소의 공존을 기록한다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고분·금동대향로·정림사지·일본 문화 교류",
    "questionIds": [],
    "genealogyLinks": [
      "H-B12"
    ],
    "nextSceneId": "THR-C09-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “6~7세기(제작일 미상) / 사비 공방 재현”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C09-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C09-S03",
    "chapterId": "THR-C09",
    "sceneTitle": "세 수도의 무덤",
    "historicalYear": "한성·웅진·사비 비교",
    "location": "고분 단면 자료실",
    "historicalEventId": "H-B12",
    "characters": [
      "서아",
      "장례 기록관"
    ],
    "backgroundAsset": "BG-f9299488dd",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-fdefb9a",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 석촌동·송산리·능산리 사례를 수도 지도에 놓고 변화를 비교한다",
    "storyObjective": "서아가 석촌동·송산리·능산리 사례를 수도 지도에 놓고 변화를 비교한다. 정림사지 오층석탑의 백제 건축과 멸망 뒤 새겨진 당의 기록을 구별한다. 서산 마애여래삼존상과 산수무늬벽돌을 도판에서 비교하며 불교와 자연 표현을 살핀다.",
    "conflict": "돌무지·벽돌·돌방 양식을 모두 같은 시기로 착각한다",
    "dialogueOutline": "서아가 석촌동·송산리·능산리 사례를 수도 지도에 놓고 변화를 비교한다. 정림사지 오층석탑의 백제 건축과 멸망 뒤 새겨진 당의 기록을 구별한다. 서산 마애여래삼존상과 산수무늬벽돌을 도판에서 비교하며 불교와 자연 표현을 살핀다.",
    "choices": [],
    "emotionalBeat": {
      "start": "돌무지·벽돌·돌방 양식을 모두 같은 시기로 착각한다",
      "turn": "서아가 석촌동·송산리·능산리 사례를 수도 지도에 놓고 변화를 비교한다. 정림사지 오층석탑의 백제 건축과 멸망 뒤 새겨진 당의 기록을 구별한다. 서산 마애여래삼존상과 산수무늬벽돌을 도판에서 비교하며 불교와 자연 표현을 살핀다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고분·금동대향로·정림사지·일본 문화 교류",
    "questionIds": [],
    "genealogyLinks": [
      "H-B12"
    ],
    "nextSceneId": "THR-C09-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “한성·웅진·사비 비교 / 고분 단면 자료실”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C09-S04",
    "chapterId": "THR-C09",
    "sceneTitle": "바다 건너 배움",
    "historicalYear": "6~7세기 비교",
    "location": "백제 교류 나루",
    "historicalEventId": "H-B12",
    "characters": [
      "서아",
      "승려·기술자"
    ],
    "backgroundAsset": "BG-fda605ae85",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-b365b3e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 일본과의 학문·불교·기술 교류 사례를 나눈다",
    "storyObjective": "서아가 일본과의 학문·불교·기술 교류 사례를 나눈다. 왕인·아직기 전승의 연대 문제는 확인 전 특정 연도로 고정하지 않는다.",
    "conflict": "사신이 문화를 일방 선물로만 설명하고 수용자의 역할을 지운다",
    "dialogueOutline": "서아가 일본과의 학문·불교·기술 교류 사례를 나눈다. 왕인·아직기 전승의 연대 문제는 확인 전 특정 연도로 고정하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "사신이 문화를 일방 선물로만 설명하고 수용자의 역할을 지운다",
      "turn": "서아가 일본과의 학문·불교·기술 교류 사례를 나눈다. 왕인·아직기 전승의 연대 문제는 확인 전 특정 연도로 고정하지 않는다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고분·금동대향로·정림사지·일본 문화 교류",
    "questionIds": [],
    "genealogyLinks": [
      "H-B12"
    ],
    "nextSceneId": "THR-C09-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “6~7세기 비교 / 백제 교류 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C09-S05",
    "chapterId": "THR-C09",
    "sceneTitle": "대야성의 그림자",
    "historicalYear": "642년",
    "location": "사비 군영",
    "historicalEventId": "H-B13",
    "characters": [
      "서아",
      "백제 전령"
    ],
    "backgroundAsset": "BG-95aad585e6",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-8db71c5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "전령이 윤충의 대야성 함락 소식을 전한다",
    "storyObjective": "전령이 윤충의 대야성 함락 소식을 전한다. 서아는 신라가 왜 당과 동맹을 추진했는지 상대편의 동기도 연결한다.",
    "conflict": "의자왕대 공세를 이후의 멸망만으로 판단한다",
    "dialogueOutline": "전령이 윤충의 대야성 함락 소식을 전한다. 서아는 신라가 왜 당과 동맹을 추진했는지 상대편의 동기도 연결한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "의자왕대 공세를 이후의 멸망만으로 판단한다",
      "turn": "전령이 윤충의 대야성 함락 소식을 전한다. 서아는 신라가 왜 당과 동맹을 추진했는지 상대편의 동기도 연결한다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대야성 함락과 백제 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-B13"
    ],
    "nextSceneId": "THR-C09-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “642년 / 사비 군영”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C09-S06",
    "chapterId": "THR-C09",
    "sceneTitle": "황산벌 후방의 물",
    "historicalYear": "660년",
    "location": "황산벌 후방",
    "historicalEventId": "H-B13",
    "characters": [
      "서아",
      "부상병·계백의 전령"
    ],
    "backgroundAsset": "BG-646c0a9f9d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-36a576c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 부상자에게 물을 주고 전령은 계백과 김유신의 대결 결과를 전한다",
    "storyObjective": "서아가 부상자에게 물을 주고 전령은 계백과 김유신의 대결 결과를 전한다. 가족 살해 전승을 영웅의 필수 덕목으로 미화하지 않는다.",
    "conflict": "결사대의 명예를 말하면서 살아남은 사람을 비난한다",
    "dialogueOutline": "서아가 부상자에게 물을 주고 전령은 계백과 김유신의 대결 결과를 전한다. 가족 살해 전승을 영웅의 필수 덕목으로 미화하지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C09-S06-B1",
        "label": "살아남은 병사를 지지한다",
        "action": "살아남은 병사를 지지한다",
        "npcReaction": "병사가 죄책감을 털어놓고 구호를 돕는다",
        "followupDialogueOutline": "서아가 살아남은 병사를 지지한다 행동을 실행한다. 부상병·계백의 전령의 반응: 병사가 죄책감을 털어놓고 구호를 돕는다. 상대의 답을 듣고 현재 갈등인 “결사대의 명예를 말하면서 살아남은 사람을 비난한다의 처리 결과를 확인한다.",
        "relationshipEffect": "병사가 죄책감을 털어놓고 구호를 돕는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C09-S06-JOIN"
      },
      {
        "choiceId": "THR-C09-S06-B2",
        "label": "전사 명부를 정리한다",
        "action": "전사 명부를 정리한다",
        "npcReaction": "유족에게 확인된 이름을 전하며 침묵을 지킨다",
        "followupDialogueOutline": "서아가 전사 명부를 정리한다 행동을 실행한다. 부상병·계백의 전령의 반응: 유족에게 확인된 이름을 전하며 침묵을 지킨다. 상대의 답을 듣고 현재 갈등인 “결사대의 명예를 말하면서 살아남은 사람을 비난한다의 처리 결과를 확인한다.",
        "relationshipEffect": "유족에게 확인된 이름을 전하며 침묵을 지킨다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C09-S06-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "결사대의 명예를 말하면서 살아남은 사람을 비난한다",
      "turn": "서아가 부상자에게 물을 주고 전령은 계백과 김유신의 대결 결과를 전한다. 가족 살해 전승을 영웅의 필수 덕목으로 미화하지 않는다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대야성 함락과 백제 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-B13"
    ],
    "nextSceneId": "THR-C09-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “660년 / 황산벌 후방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C09-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C09-S07",
    "chapterId": "THR-C09",
    "sceneTitle": "사비의 닫힌 문",
    "historicalYear": "660년",
    "location": "사비 피란길",
    "historicalEventId": "H-B13",
    "characters": [
      "서아",
      "도연의 후손"
    ],
    "backgroundAsset": "BG-bd51c78d43",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-f46f175",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "의자왕 항복과 웅진도독부 소식을 듣는다",
    "storyObjective": "의자왕 항복과 웅진도독부 소식을 듣는다. 서아는 이동하는 사람들과 남겨진 문화의 지속을 기록한다.",
    "conflict": "국가 멸망과 모든 백제인의 소멸을 동일시한다",
    "dialogueOutline": "의자왕 항복과 웅진도독부 소식을 듣는다. 서아는 이동하는 사람들과 남겨진 문화의 지속을 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "국가 멸망과 모든 백제인의 소멸을 동일시한다",
      "turn": "의자왕 항복과 웅진도독부 소식을 듣는다. 서아는 이동하는 사람들과 남겨진 문화의 지속을 기록한다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대야성 함락과 백제 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-B13"
    ],
    "nextSceneId": "THR-C09-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “660년 / 사비 피란길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C09-S08",
    "chapterId": "THR-C09",
    "sceneTitle": "다시 세운 깃발",
    "historicalYear": "660~662년",
    "location": "부흥군 거점",
    "historicalEventId": "H-B14",
    "characters": [
      "서아",
      "복신·도침의 연락관"
    ],
    "backgroundAsset": "BG-dfb645fae6",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-59b6690",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "연락관이 왜의 지원과 부흥군의 여러 갈래를 설명한다",
    "storyObjective": "연락관이 왜의 지원과 부흥군의 여러 갈래를 설명한다. 흑치상지 등의 별도 활동을 하나의 군대로 합치지 않는다.",
    "conflict": "부여풍 추대에 기대하지만 내부 불신이 커진다",
    "dialogueOutline": "연락관이 왜의 지원과 부흥군의 여러 갈래를 설명한다. 흑치상지 등의 별도 활동을 하나의 군대로 합치지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "부여풍 추대에 기대하지만 내부 불신이 커진다",
      "turn": "연락관이 왜의 지원과 부흥군의 여러 갈래를 설명한다. 흑치상지 등의 별도 활동을 하나의 군대로 합치지 않는다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "백제 부흥 운동과 백강 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B14"
    ],
    "nextSceneId": "THR-C09-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “660~662년 / 부흥군 거점”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C09-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C09-S09",
    "chapterId": "THR-C09",
    "sceneTitle": "백강의 갈라진 배",
    "historicalYear": "663년",
    "location": "백강 후방 나루",
    "historicalEventId": "H-B14",
    "characters": [
      "서아",
      "피란 가족"
    ],
    "backgroundAsset": "BG-9a35eaceb9",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-84a4d6e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 승패를 바꿀 무기를 발명하지 않고 가족 승선을 돕는다",
    "storyObjective": "서아는 승패를 바꿀 무기를 발명하지 않고 가족 승선을 돕는다. 부흥군·왜군과 나당 연합군의 전투 결과를 확인한다.",
    "conflict": "군사 지원선과 피란선의 공간이 부족하다",
    "dialogueOutline": "서아는 승패를 바꿀 무기를 발명하지 않고 가족 승선을 돕는다. 부흥군·왜군과 나당 연합군의 전투 결과를 확인한다.",
    "choices": [
      {
        "choiceId": "THR-C09-S09-B1",
        "label": "가족 명단을 묶는다",
        "action": "가족 명단을 묶는다",
        "npcReaction": "흩어질 위험을 줄이고 연락관이 호송을 맡는다",
        "followupDialogueOutline": "서아가 가족 명단을 묶는다 행동을 실행한다. 피란 가족의 반응: 흩어질 위험을 줄이고 연락관이 호송을 맡는다. 상대의 답을 듣고 현재 갈등인 “군사 지원선과 피란선의 공간이 부족하다의 처리 결과를 확인한다.",
        "relationshipEffect": "흩어질 위험을 줄이고 연락관이 호송을 맡는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C09-S09-JOIN"
      },
      {
        "choiceId": "THR-C09-S09-B2",
        "label": "식수를 나눈다",
        "action": "식수를 나눈다",
        "npcReaction": "낯선 피란민들이 서로 자리를 양보한다",
        "followupDialogueOutline": "서아가 식수를 나눈다 행동을 실행한다. 피란 가족의 반응: 낯선 피란민들이 서로 자리를 양보한다. 상대의 답을 듣고 현재 갈등인 “군사 지원선과 피란선의 공간이 부족하다의 처리 결과를 확인한다.",
        "relationshipEffect": "낯선 피란민들이 서로 자리를 양보한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C09-S09-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "군사 지원선과 피란선의 공간이 부족하다",
      "turn": "서아는 승패를 바꿀 무기를 발명하지 않고 가족 승선을 돕는다. 부흥군·왜군과 나당 연합군의 전투 결과를 확인한다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "백제 부흥 운동과 백강 전투",
    "questionIds": [
      "official-77-advanced-06"
    ],
    "genealogyLinks": [
      "H-B14"
    ],
    "nextSceneId": "THR-C09-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “663년 / 백강 후방 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C09-S09-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C09-S10",
    "chapterId": "THR-C09",
    "sceneTitle": "남은 말의 행선지",
    "historicalYear": "663년→356년",
    "location": "바닷가·기록책 전환",
    "historicalEventId": "H-B14",
    "characters": [
      "서아",
      "피란 가족의 기록"
    ],
    "backgroundAsset": "BG-c533e7a11b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C09-20c0f48",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "피란 가족은 자신들의 말이 남으면 모두 사라진 것은 아니라고 답한다",
    "storyObjective": "피란 가족은 자신들의 말이 남으면 모두 사라진 것은 아니라고 답한다. 신라 성장의 시작으로 되돌아가 적국의 삶을 다시 본다.",
    "conflict": "서아는 구하지 못한 나라 앞에서 기록의 의미를 의심한다",
    "dialogueOutline": "피란 가족은 자신들의 말이 남으면 모두 사라진 것은 아니라고 답한다. 신라 성장의 시작으로 되돌아가 적국의 삶을 다시 본다.",
    "choices": [],
    "emotionalBeat": {
      "start": "서아는 구하지 못한 나라 앞에서 기록의 의미를 의심한다",
      "turn": "피란 가족은 자신들의 말이 남으면 모두 사라진 것은 아니라고 답한다. 신라 성장의 시작으로 되돌아가 적국의 삶을 다시 본다.",
      "end": "문화의 주체를 만나고 멸망 뒤 부흥과 이동을 추적; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "백제 부흥 운동과 백강 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B14"
    ],
    "nextSceneId": "THR-C10-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “663년→356년 / 바닷가·기록책 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  }
]
```

## CH.10 태어날 때 정해진 자리

```json
[
  {
    "sceneId": "THR-C10-S01",
    "chapterId": "THR-C10",
    "sceneTitle": "왕의 이름을 부르다",
    "historicalYear": "356년 이후",
    "location": "서라벌 시장",
    "historicalEventId": "H-S1",
    "characters": [
      "서아",
      "장터 주민 미솔"
    ],
    "backgroundAsset": "BG-29e2da07d9",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C10-82e1587",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "미솔이 마립간과 김씨 왕실의 성장을 설명한다",
    "storyObjective": "미솔이 마립간과 김씨 왕실의 성장을 설명한다. 서아는 칭호 하나에 권력 변화가 담긴 것을 배운다.",
    "conflict": "서아가 왕을 옛 칭호로 불러 장터 사람이 불안해한다",
    "dialogueOutline": "미솔이 마립간과 김씨 왕실의 성장을 설명한다. 서아는 칭호 하나에 권력 변화가 담긴 것을 배운다.",
    "choices": [],
    "emotionalBeat": {
      "start": "서아가 왕을 옛 칭호로 불러 장터 사람이 불안해한다",
      "turn": "미솔이 마립간과 김씨 왕실의 성장을 설명한다. 서아는 칭호 하나에 권력 변화가 담긴 것을 배운다.",
      "end": "왕권 성장과 신분의 벽을 서로 다른 사람의 삶으로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "김씨 왕위 세습·마립간",
    "questionIds": [],
    "genealogyLinks": [
      "H-S1"
    ],
    "nextSceneId": "THR-C10-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “356년 이후 / 서라벌 시장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C10-S02",
    "chapterId": "THR-C10",
    "sceneTitle": "금관을 만드는 손",
    "historicalYear": "4~5세기",
    "location": "왕실 공방",
    "historicalEventId": "H-S1",
    "characters": [
      "서아",
      "금속 장인"
    ],
    "backgroundAsset": "BG-8b323133bb",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C10-82720d5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 제작 도구를 돕고 장인은 위세품과 신분의 관계를 말한다",
    "storyObjective": "서아가 제작 도구를 돕고 장인은 위세품과 신분의 관계를 말한다. 천마총 유물의 실물을 이 시대 특정 왕의 것으로 단정하지 않는다.",
    "conflict": "눈부신 장신구를 만든 사람은 착용할 수 없다",
    "dialogueOutline": "서아가 제작 도구를 돕고 장인은 위세품과 신분의 관계를 말한다. 천마총 유물의 실물을 이 시대 특정 왕의 것으로 단정하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "눈부신 장신구를 만든 사람은 착용할 수 없다",
      "turn": "서아가 제작 도구를 돕고 장인은 위세품과 신분의 관계를 말한다. 천마총 유물의 실물을 이 시대 특정 왕의 것으로 단정하지 않는다.",
      "end": "왕권 성장과 신분의 벽을 서로 다른 사람의 삶으로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "김씨 왕위 세습·마립간",
    "questionIds": [],
    "genealogyLinks": [
      "H-S1"
    ],
    "nextSceneId": "THR-C10-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “4~5세기 / 왕실 공방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C10-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C10-S03",
    "chapterId": "THR-C10",
    "sceneTitle": "돌을 덮는 사람들",
    "historicalYear": "5세기",
    "location": "돌무지덧널무덤 축조터",
    "historicalEventId": "H-S3",
    "characters": [
      "서아",
      "인부 다함"
    ],
    "backgroundAsset": "BG-0cb0ee227f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C10-19f4ff0",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 돌·나무 덧널·봉토 구조를 그리며 무덤 양식과 지배층 권위를 연결한다.",
    "storyObjective": "서아가 돌·나무 덧널·봉토 구조를 그리며 무덤 양식과 지배층 권위를 연결한다.",
    "conflict": "장례의 위엄을 위해 생업을 멈춰야 하는 인부",
    "dialogueOutline": "서아가 돌·나무 덧널·봉토 구조를 그리며 무덤 양식과 지배층 권위를 연결한다.",
    "choices": [
      {
        "choiceId": "THR-C10-S03-B1",
        "label": "물과 도구를 나른다",
        "action": "물과 도구를 나른다",
        "npcReaction": "다함이 작업자의 고통을 말하기 시작한다",
        "followupDialogueOutline": "서아가 물과 도구를 나른다 행동을 실행한다. 인부 다함의 반응: 다함이 작업자의 고통을 말하기 시작한다. 상대의 답을 듣고 현재 갈등인 “장례의 위엄을 위해 생업을 멈춰야 하는 인부의 처리 결과를 확인한다.",
        "relationshipEffect": "다함이 작업자의 고통을 말하기 시작한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C10-S03-JOIN"
      },
      {
        "choiceId": "THR-C10-S03-B2",
        "label": "작업 순서를 정리한다",
        "action": "작업 순서를 정리한다",
        "npcReaction": "감독이 반발하다 사고 위험 감소를 인정한다",
        "followupDialogueOutline": "서아가 작업 순서를 정리한다 행동을 실행한다. 인부 다함의 반응: 감독이 반발하다 사고 위험 감소를 인정한다. 상대의 답을 듣고 현재 갈등인 “장례의 위엄을 위해 생업을 멈춰야 하는 인부의 처리 결과를 확인한다.",
        "relationshipEffect": "감독이 반발하다 사고 위험 감소를 인정한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C10-S03-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "장례의 위엄을 위해 생업을 멈춰야 하는 인부",
      "turn": "서아가 돌·나무 덧널·봉토 구조를 그리며 무덤 양식과 지배층 권위를 연결한다.",
      "end": "왕권 성장과 신분의 벽을 서로 다른 사람의 삶으로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "골품제·화백회의·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S3"
    ],
    "nextSceneId": "THR-C10-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “5세기 / 돌무지덧널무덤 축조터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C10-S04",
    "chapterId": "THR-C10",
    "sceneTitle": "골품의 문턱",
    "historicalYear": "6세기 제도 비교",
    "location": "귀족 가옥 문 앞",
    "historicalEventId": "H-S3",
    "characters": [
      "서아",
      "6두품 청년 가람"
    ],
    "backgroundAsset": "BG-1f78e1bc41",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C10-4d5d6ec",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 노력만 하면 된다고 말했다가 가람의 반문을 듣는다",
    "storyObjective": "서아가 노력만 하면 된다고 말했다가 가람의 반문을 듣는다. 개인의 게으름이 아닌 제도적 한계를 적는다.",
    "conflict": "능력이 있어도 신분 때문에 오를 수 있는 관등이 제한된다",
    "dialogueOutline": "서아가 노력만 하면 된다고 말했다가 가람의 반문을 듣는다. 개인의 게으름이 아닌 제도적 한계를 적는다.",
    "choices": [
      {
        "choiceId": "THR-C10-S04-B1",
        "label": "경솔한 말을 고친다",
        "action": "경솔한 말을 고친다",
        "npcReaction": "가람이 자신의 공부를 보여 주며 마음을 연다",
        "followupDialogueOutline": "서아가 경솔한 말을 고친다 행동을 실행한다. 6두품 청년 가람의 반응: 가람이 자신의 공부를 보여 주며 마음을 연다. 상대의 답을 듣고 현재 갈등인 “능력이 있어도 신분 때문에 오를 수 있는 관등이 제한된다의 처리 결과를 확인한다.",
        "relationshipEffect": "가람이 자신의 공부를 보여 주며 마음을 연다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C10-S04-JOIN"
      },
      {
        "choiceId": "THR-C10-S04-B2",
        "label": "관등표를 함께 읽는다",
        "action": "관등표를 함께 읽는다",
        "npcReaction": "서아의 막연한 격려가 구체적 이해로 바뀐다",
        "followupDialogueOutline": "서아가 관등표를 함께 읽는다 행동을 실행한다. 6두품 청년 가람의 반응: 서아의 막연한 격려가 구체적 이해로 바뀐다. 상대의 답을 듣고 현재 갈등인 “능력이 있어도 신분 때문에 오를 수 있는 관등이 제한된다의 처리 결과를 확인한다.",
        "relationshipEffect": "서아의 막연한 격려가 구체적 이해로 바뀐다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C10-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "능력이 있어도 신분 때문에 오를 수 있는 관등이 제한된다",
      "turn": "서아가 노력만 하면 된다고 말했다가 가람의 반문을 듣는다. 개인의 게으름이 아닌 제도적 한계를 적는다.",
      "end": "왕권 성장과 신분의 벽을 서로 다른 사람의 삶으로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "골품제·화백회의·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S3"
    ],
    "nextSceneId": "THR-C10-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “6세기 제도 비교 / 귀족 가옥 문 앞”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C10-S05",
    "chapterId": "THR-C10",
    "sceneTitle": "합의가 늦는 밤",
    "historicalYear": "6세기 제도 비교",
    "location": "화백회의 외부",
    "historicalEventId": "H-S3",
    "characters": [
      "서아",
      "귀족 연락관"
    ],
    "backgroundAsset": "BG-211bfc6779",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C10-52fdc19",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "연락관이 귀족 합의와 상대등의 역할을 설명한다",
    "storyObjective": "연락관이 귀족 합의와 상대등의 역할을 설명한다. 서아는 화백을 현대 보통선거 의회와 같다고 하지 않는다.",
    "conflict": "합의가 안 되어 긴급 민원이 기다린다",
    "dialogueOutline": "연락관이 귀족 합의와 상대등의 역할을 설명한다. 서아는 화백을 현대 보통선거 의회와 같다고 하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "합의가 안 되어 긴급 민원이 기다린다",
      "turn": "연락관이 귀족 합의와 상대등의 역할을 설명한다. 서아는 화백을 현대 보통선거 의회와 같다고 하지 않는다.",
      "end": "왕권 성장과 신분의 벽을 서로 다른 사람의 삶으로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "골품제·화백회의·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S3"
    ],
    "nextSceneId": "THR-C10-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “6세기 제도 비교 / 화백회의 외부”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C10-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C10-S06",
    "chapterId": "THR-C10",
    "sceneTitle": "구원군이 남긴 물건",
    "historicalYear": "400년",
    "location": "서라벌 교역장",
    "historicalEventId": "H-G9",
    "characters": [
      "서아",
      "신라 상인"
    ],
    "backgroundAsset": "BG-0354dbfb2a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C10-2320f60",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 CH03의 사건 ID를 다시 열고 도움과 정치적 영향력을 함께 본다",
    "storyObjective": "서아가 CH03의 사건 ID를 다시 열고 도움과 정치적 영향력을 함께 본다. 호우명 그릇은 415년 명문 자료로 별도 관찰 삽화에 둔다.",
    "conflict": "고구려 지원의 흔적을 치욕이라고 지우려 한다",
    "dialogueOutline": "서아가 CH03의 사건 ID를 다시 열고 도움과 정치적 영향력을 함께 본다. 호우명 그릇은 415년 명문 자료로 별도 관찰 삽화에 둔다.",
    "choices": [],
    "emotionalBeat": {
      "start": "고구려 지원의 흔적을 치욕이라고 지우려 한다",
      "turn": "서아가 CH03의 사건 ID를 다시 열고 도움과 정치적 영향력을 함께 본다. 호우명 그릇은 415년 명문 자료로 별도 관찰 삽화에 둔다.",
      "end": "왕권 성장과 신분의 벽을 서로 다른 사람의 삶으로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "신라 구원과 왜군 격퇴",
    "questionIds": [],
    "genealogyLinks": [
      "H-G9"
    ],
    "nextSceneId": "THR-C10-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “400년 / 서라벌 교역장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C10-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C10-S07",
    "chapterId": "THR-C10",
    "sceneTitle": "백제에서 온 손",
    "historicalYear": "433년",
    "location": "신라 사절 숙소",
    "historicalEventId": "H-S2",
    "characters": [
      "서아",
      "눌지왕의 사신"
    ],
    "backgroundAsset": "BG-8cff65cf94",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C10-19db818",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "사신이 나제 동맹의 필요를 설명한다",
    "storyObjective": "사신이 나제 동맹의 필요를 설명한다. 서아는 이전 구원군에 대한 감사와 독립 외교가 양립할 수 있다고 답한다.",
    "conflict": "고구려의 영향에서 벗어나기 위해 과거의 경쟁자와 손잡아야 한다",
    "dialogueOutline": "사신이 나제 동맹의 필요를 설명한다. 서아는 이전 구원군에 대한 감사와 독립 외교가 양립할 수 있다고 답한다.",
    "choices": [
      {
        "choiceId": "THR-C10-S07-B1",
        "label": "외교 상대의 요구를 듣는다",
        "action": "외교 상대의 요구를 듣는다",
        "npcReaction": "사신이 경계 속에서도 협력 조건을 검토한다",
        "followupDialogueOutline": "서아가 외교 상대의 요구를 듣는다 행동을 실행한다. 눌지왕의 사신의 반응: 사신이 경계 속에서도 협력 조건을 검토한다. 상대의 답을 듣고 현재 갈등인 “고구려의 영향에서 벗어나기 위해 과거의 경쟁자와 손잡아야 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "사신이 경계 속에서도 협력 조건을 검토한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C10-S07-JOIN"
      },
      {
        "choiceId": "THR-C10-S07-B2",
        "label": "주민 교역 피해를 전달한다",
        "action": "주민 교역 피해를 전달한다",
        "npcReaction": "동맹이 일상의 안전과 연결됨을 이해한다",
        "followupDialogueOutline": "서아가 주민 교역 피해를 전달한다 행동을 실행한다. 눌지왕의 사신의 반응: 동맹이 일상의 안전과 연결됨을 이해한다. 상대의 답을 듣고 현재 갈등인 “고구려의 영향에서 벗어나기 위해 과거의 경쟁자와 손잡아야 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "동맹이 일상의 안전과 연결됨을 이해한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C10-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "고구려의 영향에서 벗어나기 위해 과거의 경쟁자와 손잡아야 한다",
      "turn": "사신이 나제 동맹의 필요를 설명한다. 서아는 이전 구원군에 대한 감사와 독립 외교가 양립할 수 있다고 답한다.",
      "end": "왕권 성장과 신분의 벽을 서로 다른 사람의 삶으로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "나제 동맹",
    "questionIds": [],
    "genealogyLinks": [
      "H-S2"
    ],
    "nextSceneId": "THR-C10-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “433년 / 신라 사절 숙소”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C10-S08",
    "chapterId": "THR-C10",
    "sceneTitle": "왕계의 빈칸을 채우다",
    "historicalYear": "433년→502년",
    "location": "왕실 기록·시간 전환",
    "historicalEventId": "H-S1",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-cd8894718e",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C10-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 왕위 순서와 혈연을 따로 적는다",
    "storyObjective": "서아가 왕위 순서와 혈연을 따로 적는다. 자비왕·소지왕을 거쳐 지증왕 시대로 간다는 표시 뒤 농경 마을로 이동한다.",
    "conflict": "내물왕 뒤를 곧 눌지왕으로 이어 실성왕을 생략했다",
    "dialogueOutline": "서아가 왕위 순서와 혈연을 따로 적는다. 자비왕·소지왕을 거쳐 지증왕 시대로 간다는 표시 뒤 농경 마을로 이동한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "내물왕 뒤를 곧 눌지왕으로 이어 실성왕을 생략했다",
      "turn": "서아가 왕위 순서와 혈연을 따로 적는다. 자비왕·소지왕을 거쳐 지증왕 시대로 간다는 표시 뒤 농경 마을로 이동한다.",
      "end": "왕권 성장과 신분의 벽을 서로 다른 사람의 삶으로 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "김씨 왕위 세습·마립간",
    "questionIds": [],
    "genealogyLinks": [
      "H-S1"
    ],
    "nextSceneId": "THR-C11-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “433년→502년 / 왕실 기록·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C10-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.11 나라를 바꾸는 약속

```json
[
  {
    "sceneId": "THR-C11-S01",
    "chapterId": "THR-C11",
    "sceneTitle": "쟁기 앞의 소",
    "historicalYear": "502년",
    "location": "신라 농경 마을",
    "historicalEventId": "H-S4",
    "characters": [
      "서아",
      "농민 보리"
    ],
    "backgroundAsset": "BG-8cc66c6199",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-5c24feb",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 공동 사용 일정을 짜고 농민은 깊이갈이와 노동 변화의 장단점을 말한다.",
    "storyObjective": "서아가 공동 사용 일정을 짜고 농민은 깊이갈이와 노동 변화의 장단점을 말한다.",
    "conflict": "소를 가진 집과 없는 집이 우경 순서를 다툰다",
    "dialogueOutline": "서아가 공동 사용 일정을 짜고 농민은 깊이갈이와 노동 변화의 장단점을 말한다.",
    "choices": [
      {
        "choiceId": "THR-C11-S01-B1",
        "label": "공동 순서를 제안한다",
        "action": "공동 순서를 제안한다",
        "npcReaction": "보리가 양보하지만 소 주인의 부담도 보상해야 한다",
        "followupDialogueOutline": "서아가 공동 순서를 제안한다 행동을 실행한다. 농민 보리의 반응: 보리가 양보하지만 소 주인의 부담도 보상해야 한다. 상대의 답을 듣고 현재 갈등인 “소를 가진 집과 없는 집이 우경 순서를 다툰다의 처리 결과를 확인한다.",
        "relationshipEffect": "보리가 양보하지만 소 주인의 부담도 보상해야 한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C11-S01-JOIN"
      },
      {
        "choiceId": "THR-C11-S01-B2",
        "label": "다친 소를 먼저 돌본다",
        "action": "다친 소를 먼저 돌본다",
        "npcReaction": "일정은 늦어져도 마을이 지속 가능한 사용을 논의한다",
        "followupDialogueOutline": "서아가 다친 소를 먼저 돌본다 행동을 실행한다. 농민 보리의 반응: 일정은 늦어져도 마을이 지속 가능한 사용을 논의한다. 상대의 답을 듣고 현재 갈등인 “소를 가진 집과 없는 집이 우경 순서를 다툰다의 처리 결과를 확인한다.",
        "relationshipEffect": "일정은 늦어져도 마을이 지속 가능한 사용을 논의한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C11-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "소를 가진 집과 없는 집이 우경 순서를 다툰다",
      "turn": "서아가 공동 사용 일정을 짜고 농민은 깊이갈이와 노동 변화의 장단점을 말한다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "우경·국호 신라·왕 칭호",
    "questionIds": [],
    "genealogyLinks": [
      "H-S4"
    ],
    "nextSceneId": "THR-C11-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “502년 / 신라 농경 마을”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C11-S02",
    "chapterId": "THR-C11",
    "sceneTitle": "새 이름의 관청",
    "historicalYear": "503년",
    "location": "서라벌 관청",
    "historicalEventId": "H-S4",
    "characters": [
      "서아",
      "지증왕의 서리"
    ],
    "backgroundAsset": "BG-f0696d4e3f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-09c3568",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 국호 신라와 왕 칭호를 문서에서 확인한다",
    "storyObjective": "서아가 국호 신라와 왕 칭호를 문서에서 확인한다. 명칭 정비를 즉석 건국 장면처럼 연출하지 않는다.",
    "conflict": "옛 이름과 새 국호가 섞여 문서가 반려된다",
    "dialogueOutline": "서아가 국호 신라와 왕 칭호를 문서에서 확인한다. 명칭 정비를 즉석 건국 장면처럼 연출하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "옛 이름과 새 국호가 섞여 문서가 반려된다",
      "turn": "서아가 국호 신라와 왕 칭호를 문서에서 확인한다. 명칭 정비를 즉석 건국 장면처럼 연출하지 않는다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "우경·국호 신라·왕 칭호",
    "questionIds": [],
    "genealogyLinks": [
      "H-S4"
    ],
    "nextSceneId": "THR-C11-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “503년 / 서라벌 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C11-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C11-S03",
    "chapterId": "THR-C11",
    "sceneTitle": "바다를 두려워한 사공",
    "historicalYear": "512년",
    "location": "동해 출항지",
    "historicalEventId": "H-S5",
    "characters": [
      "서아",
      "이사부의 전령"
    ],
    "backgroundAsset": "BG-991021402b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-70911d1",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 복속 기록과 목우사자 전승을 나누고 실제 항해의 위험을 사공에게 묻는다.",
    "storyObjective": "서아는 복속 기록과 목우사자 전승을 나누고 실제 항해의 위험을 사공에게 묻는다.",
    "conflict": "우산국 파견 이야기가 바다 괴물 소문으로 변한다",
    "dialogueOutline": "서아는 복속 기록과 목우사자 전승을 나누고 실제 항해의 위험을 사공에게 묻는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "우산국 파견 이야기가 바다 괴물 소문으로 변한다",
      "turn": "서아는 복속 기록과 목우사자 전승을 나누고 실제 항해의 위험을 사공에게 묻는다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "우산국 복속",
    "questionIds": [],
    "genealogyLinks": [
      "H-S5"
    ],
    "nextSceneId": "THR-C11-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “512년 / 동해 출항지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C11-S04",
    "chapterId": "THR-C11",
    "sceneTitle": "같은 잘못의 다른 벌",
    "historicalYear": "520년",
    "location": "법 집행 관청",
    "historicalEventId": "H-S6",
    "characters": [
      "서아",
      "율령 담당관"
    ],
    "backgroundAsset": "BG-94dc2c888d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-e32a15f",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 율령 반포의 목적과 집행의 차이를 묻는다",
    "storyObjective": "서아가 율령 반포의 목적과 집행의 차이를 묻는다. 담당관은 법의 존재를 공정성의 완성이라 부르지 않는다.",
    "conflict": "귀족과 평민에게 같은 법이 적용되는지 주민이 의심한다",
    "dialogueOutline": "서아가 율령 반포의 목적과 집행의 차이를 묻는다. 담당관은 법의 존재를 공정성의 완성이라 부르지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C11-S04-B1",
        "label": "사례를 공개 질문한다",
        "action": "사례를 공개 질문한다",
        "npcReaction": "주민의 목소리가 들리지만 담당관이 서아를 경계한다",
        "followupDialogueOutline": "서아가 사례를 공개 질문한다 행동을 실행한다. 율령 담당관의 반응: 주민의 목소리가 들리지만 담당관이 서아를 경계한다. 상대의 답을 듣고 현재 갈등인 “귀족과 평민에게 같은 법이 적용되는지 주민이 의심한다의 처리 결과를 확인한다.",
        "relationshipEffect": "주민의 목소리가 들리지만 담당관이 서아를 경계한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C11-S04-JOIN"
      },
      {
        "choiceId": "THR-C11-S04-B2",
        "label": "피해 진술을 먼저 모은다",
        "action": "피해 진술을 먼저 모은다",
        "npcReaction": "증언을 정리한 뒤 신중히 문제를 제기한다",
        "followupDialogueOutline": "서아가 피해 진술을 먼저 모은다 행동을 실행한다. 율령 담당관의 반응: 증언을 정리한 뒤 신중히 문제를 제기한다. 상대의 답을 듣고 현재 갈등인 “귀족과 평민에게 같은 법이 적용되는지 주민이 의심한다의 처리 결과를 확인한다.",
        "relationshipEffect": "증언을 정리한 뒤 신중히 문제를 제기한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C11-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "귀족과 평민에게 같은 법이 적용되는지 주민이 의심한다",
      "turn": "서아가 율령 반포의 목적과 집행의 차이를 묻는다. 담당관은 법의 존재를 공정성의 완성이라 부르지 않는다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "율령 반포와 불교 공인",
    "questionIds": [],
    "genealogyLinks": [
      "H-S6"
    ],
    "nextSceneId": "THR-C11-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “520년 / 법 집행 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C11-S05",
    "chapterId": "THR-C11",
    "sceneTitle": "왕의 뜻과 숲의 신",
    "historicalYear": "527/528년",
    "location": "서라벌 천경림 주변",
    "historicalEventId": "H-S6",
    "characters": [
      "서아",
      "신앙을 지키는 주민"
    ],
    "backgroundAsset": "BG-0eaacc7fc9",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-ff9b1b5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 주민의 두려움을 듣고 국가 후원과 개인의 신앙을 구분한다",
    "storyObjective": "서아는 주민의 두려움을 듣고 국가 후원과 개인의 신앙을 구분한다. 귀족의 정치적 반대도 함께 설명한다.",
    "conflict": "불교 공인을 낯선 신앙의 강요로 받아들인다",
    "dialogueOutline": "서아는 주민의 두려움을 듣고 국가 후원과 개인의 신앙을 구분한다. 귀족의 정치적 반대도 함께 설명한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "불교 공인을 낯선 신앙의 강요로 받아들인다",
      "turn": "서아는 주민의 두려움을 듣고 국가 후원과 개인의 신앙을 구분한다. 귀족의 정치적 반대도 함께 설명한다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "율령 반포와 불교 공인",
    "questionIds": [],
    "genealogyLinks": [
      "H-S6"
    ],
    "nextSceneId": "THR-C11-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “527/528년 / 서라벌 천경림 주변”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C11-S06",
    "chapterId": "THR-C11",
    "sceneTitle": "이차돈의 마지막 말",
    "historicalYear": "527년 전승",
    "location": "처형 소식이 전해진 거리",
    "historicalEventId": "H-S6",
    "characters": [
      "서아",
      "이차돈의 지인"
    ],
    "backgroundAsset": "BG-38904a9df1",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-241c368",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 순교 전승을 존중하면서 기적과 역사 기록을 다른 층위로 적는다.",
    "storyObjective": "서아는 순교 전승을 존중하면서 기적과 역사 기록을 다른 층위로 적는다.",
    "conflict": "기적을 직접 목격했다고 써야 신앙을 존중하는가",
    "dialogueOutline": "서아는 순교 전승을 존중하면서 기적과 역사 기록을 다른 층위로 적는다.",
    "choices": [
      {
        "choiceId": "THR-C11-S06-B1",
        "label": "전승과 사실을 나눈다",
        "action": "전승과 사실을 나눈다",
        "npcReaction": "지인이 처음엔 서운해하다 기억을 지우는 뜻이 아님을 이해한다",
        "followupDialogueOutline": "서아가 전승과 사실을 나눈다 행동을 실행한다. 이차돈의 지인의 반응: 지인이 처음엔 서운해하다 기억을 지우는 뜻이 아님을 이해한다. 상대의 답을 듣고 현재 갈등인 “기적을 직접 목격했다고 써야 신앙을 존중하는가의 처리 결과를 확인한다.",
        "relationshipEffect": "지인이 처음엔 서운해하다 기억을 지우는 뜻이 아님을 이해한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C11-S06-JOIN"
      },
      {
        "choiceId": "THR-C11-S06-B2",
        "label": "남겨진 사람을 위로한다",
        "action": "남겨진 사람을 위로한다",
        "npcReaction": "지인이 이차돈의 뜻을 들려주고 기록 검토를 함께 한다",
        "followupDialogueOutline": "서아가 남겨진 사람을 위로한다 행동을 실행한다. 이차돈의 지인의 반응: 지인이 이차돈의 뜻을 들려주고 기록 검토를 함께 한다. 상대의 답을 듣고 현재 갈등인 “기적을 직접 목격했다고 써야 신앙을 존중하는가의 처리 결과를 확인한다.",
        "relationshipEffect": "지인이 이차돈의 뜻을 들려주고 기록 검토를 함께 한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C11-S06-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "기적을 직접 목격했다고 써야 신앙을 존중하는가",
      "turn": "서아는 순교 전승을 존중하면서 기적과 역사 기록을 다른 층위로 적는다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "율령 반포와 불교 공인",
    "questionIds": [],
    "genealogyLinks": [
      "H-S6"
    ],
    "nextSceneId": "THR-C11-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “527년 전승 / 처형 소식이 전해진 거리”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C11-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C11-S07",
    "chapterId": "THR-C11",
    "sceneTitle": "법흥왕의 결단",
    "historicalYear": "528년 전후",
    "location": "신라 관청",
    "historicalEventId": "H-S6",
    "characters": [
      "서아",
      "법흥왕"
    ],
    "backgroundAsset": "BG-3d6bacbcf7",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-af215bc",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "왕은 율령과 불교로 체제를 정비하는 뜻을 말한다",
    "storyObjective": "왕은 율령과 불교로 체제를 정비하는 뜻을 말한다. 서아는 제도 변화 뒤에도 주민의 적응 시간이 필요하다고 답한다.",
    "conflict": "귀족 반발을 제압하면 모든 갈등이 끝난다고 기대한다",
    "dialogueOutline": "왕은 율령과 불교로 체제를 정비하는 뜻을 말한다. 서아는 제도 변화 뒤에도 주민의 적응 시간이 필요하다고 답한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "귀족 반발을 제압하면 모든 갈등이 끝난다고 기대한다",
      "turn": "왕은 율령과 불교로 체제를 정비하는 뜻을 말한다. 서아는 제도 변화 뒤에도 주민의 적응 시간이 필요하다고 답한다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "율령 반포와 불교 공인",
    "questionIds": [],
    "genealogyLinks": [
      "H-S6"
    ],
    "nextSceneId": "THR-C11-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “528년 전후 / 신라 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C11-S08",
    "chapterId": "THR-C11",
    "sceneTitle": "금관가야에서 온 짐",
    "historicalYear": "532년",
    "location": "신라 편입 등록처",
    "historicalEventId": "H-S7",
    "characters": [
      "서아",
      "가야 가족 아라"
    ],
    "backgroundAsset": "BG-0e2dfe94b2",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-f5c69ed",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 왕실 항복과 편입을 확인하고 아라의 기술을 직업 장부에 남긴다",
    "storyObjective": "서아가 왕실 항복과 편입을 확인하고 아라의 기술을 직업 장부에 남긴다. CH14에서 독립 가야의 시간을 먼저 볼 것을 예고한다.",
    "conflict": "새 통치 아래 가족의 이름과 기술을 잃을까 두렵다",
    "dialogueOutline": "서아가 왕실 항복과 편입을 확인하고 아라의 기술을 직업 장부에 남긴다. CH14에서 독립 가야의 시간을 먼저 볼 것을 예고한다.",
    "choices": [
      {
        "choiceId": "THR-C11-S08-B1",
        "label": "가족 이름을 먼저 적는다",
        "action": "가족 이름을 먼저 적는다",
        "npcReaction": "아라가 자신을 정복민 번호로 보지 않는다고 느낀다",
        "followupDialogueOutline": "서아가 가족 이름을 먼저 적는다 행동을 실행한다. 가야 가족 아라의 반응: 아라가 자신을 정복민 번호로 보지 않는다고 느낀다. 상대의 답을 듣고 현재 갈등인 “새 통치 아래 가족의 이름과 기술을 잃을까 두렵다의 처리 결과를 확인한다.",
        "relationshipEffect": "아라가 자신을 정복민 번호로 보지 않는다고 느낀다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C11-S08-JOIN"
      },
      {
        "choiceId": "THR-C11-S08-B2",
        "label": "기술 도구를 함께 옮긴다",
        "action": "기술 도구를 함께 옮긴다",
        "npcReaction": "장인이 새 터전에서 일을 이어 갈 용기를 얻는다",
        "followupDialogueOutline": "서아가 기술 도구를 함께 옮긴다 행동을 실행한다. 가야 가족 아라의 반응: 장인이 새 터전에서 일을 이어 갈 용기를 얻는다. 상대의 답을 듣고 현재 갈등인 “새 통치 아래 가족의 이름과 기술을 잃을까 두렵다의 처리 결과를 확인한다.",
        "relationshipEffect": "장인이 새 터전에서 일을 이어 갈 용기를 얻는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C11-S08-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "새 통치 아래 가족의 이름과 기술을 잃을까 두렵다",
      "turn": "서아가 왕실 항복과 편입을 확인하고 아라의 기술을 직업 장부에 남긴다. CH14에서 독립 가야의 시간을 먼저 볼 것을 예고한다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "금관가야 병합",
    "questionIds": [],
    "genealogyLinks": [
      "H-S7"
    ],
    "nextSceneId": "THR-C11-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “532년 / 신라 편입 등록처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C11-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C11-S09",
    "chapterId": "THR-C11",
    "sceneTitle": "갑옷을 벗은 왕자",
    "historicalYear": "532년 이후",
    "location": "가야 왕족 정착지",
    "historicalEventId": "H-S7",
    "characters": [
      "서아",
      "가야계 청년"
    ],
    "backgroundAsset": "BG-fe8c505bac",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-ec9c17a",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 구형왕·김무력·김유신의 계승 관계를 도식으로 확인한다",
    "storyObjective": "서아는 구형왕·김무력·김유신의 계승 관계를 도식으로 확인한다. 당대 청년을 김유신으로 잘못 등장시키지 않는다.",
    "conflict": "신라에서 역할을 얻는 것과 고향을 잃은 슬픔이 충돌한다",
    "dialogueOutline": "서아는 구형왕·김무력·김유신의 계승 관계를 도식으로 확인한다. 당대 청년을 김유신으로 잘못 등장시키지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "신라에서 역할을 얻는 것과 고향을 잃은 슬픔이 충돌한다",
      "turn": "서아는 구형왕·김무력·김유신의 계승 관계를 도식으로 확인한다. 당대 청년을 김유신으로 잘못 등장시키지 않는다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "금관가야 병합",
    "questionIds": [],
    "genealogyLinks": [
      "H-S7"
    ],
    "nextSceneId": "THR-C11-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “532년 이후 / 가야 왕족 정착지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C11-S10",
    "chapterId": "THR-C11",
    "sceneTitle": "다음 왕의 길",
    "historicalYear": "540년",
    "location": "신라 왕계·시간 전환",
    "historicalEventId": "H-S8",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-9aacc6a2eb",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C11-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 입종갈문왕과 지소부인의 아들임을 고친다",
    "storyObjective": "서아는 입종갈문왕과 지소부인의 아들임을 고친다. 어린 왕의 통치가 곧 단독 친정이 아니었음을 표시하고 다음 장으로 간다.",
    "conflict": "진흥왕을 법흥왕의 아들로 적은 초안",
    "dialogueOutline": "서아는 입종갈문왕과 지소부인의 아들임을 고친다. 어린 왕의 통치가 곧 단독 친정이 아니었음을 표시하고 다음 장으로 간다.",
    "choices": [],
    "emotionalBeat": {
      "start": "진흥왕을 법흥왕의 아들로 적은 초안",
      "turn": "서아는 입종갈문왕과 지소부인의 아들임을 고친다. 어린 왕의 통치가 곧 단독 친정이 아니었음을 표시하고 다음 장으로 간다.",
      "end": "생산·법·신앙의 개혁이 주민과 귀족에게 다른 의미를 가짐; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 확보·순수비·단양 적성비·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S8"
    ],
    "nextSceneId": "THR-C12-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “540년 / 신라 왕계·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C11-S10-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.12 강을 얻은 사람들

```json
[
  {
    "sceneId": "THR-C12-S01",
    "chapterId": "THR-C12",
    "sceneTitle": "함께 되찾은 강",
    "historicalYear": "551년",
    "location": "한강 전선 후방",
    "historicalEventId": "H-B10",
    "characters": [
      "서아",
      "신라 병사 하람"
    ],
    "backgroundAsset": "BG-a9e7dad446",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-09c6b9f",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 CH08과 공통 사건 기록을 확인하며 양국 협공의 역할을 병사에게 묻는다.",
    "storyObjective": "서아는 CH08과 공통 사건 기록을 확인하며 양국 협공의 역할을 병사에게 묻는다.",
    "conflict": "백제의 공을 지우고 신라만의 승리로 보고하려 한다",
    "dialogueOutline": "서아는 CH08과 공통 사건 기록을 확인하며 양국 협공의 역할을 병사에게 묻는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "백제의 공을 지우고 신라만의 승리로 보고하려 한다",
      "turn": "서아는 CH08과 공통 사건 기록을 확인하며 양국 협공의 역할을 병사에게 묻는다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 회복·신라 장악·관산성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B10"
    ],
    "nextSceneId": "THR-C12-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “551년 / 한강 전선 후방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C12-S02",
    "chapterId": "THR-C12",
    "sceneTitle": "어느 나라의 나루인가",
    "historicalYear": "553년",
    "location": "한강 나루",
    "historicalEventId": "H-S8",
    "characters": [
      "서아",
      "나루 주인"
    ],
    "backgroundAsset": "BG-306fe00bea",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-2ce3fd0",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 한강 장악의 경제·외교 가치를 듣고 주민 통행의 대가도 기록한다.",
    "storyObjective": "서아가 한강 장악의 경제·외교 가치를 듣고 주민 통행의 대가도 기록한다.",
    "conflict": "국경 변경 때문에 물품과 가족의 이동이 막힌다",
    "dialogueOutline": "서아가 한강 장악의 경제·외교 가치를 듣고 주민 통행의 대가도 기록한다.",
    "choices": [
      {
        "choiceId": "THR-C12-S02-B1",
        "label": "가족 통행을 중재한다",
        "action": "가족 통행을 중재한다",
        "npcReaction": "주인이 서아를 믿지만 교역 화물은 기다려야 한다",
        "followupDialogueOutline": "서아가 가족 통행을 중재한다 행동을 실행한다. 나루 주인의 반응: 주인이 서아를 믿지만 교역 화물은 기다려야 한다. 상대의 답을 듣고 현재 갈등인 “국경 변경 때문에 물품과 가족의 이동이 막힌다의 처리 결과를 확인한다.",
        "relationshipEffect": "주인이 서아를 믿지만 교역 화물은 기다려야 한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C12-S02-JOIN"
      },
      {
        "choiceId": "THR-C12-S02-B2",
        "label": "화물 기록을 검산한다",
        "action": "화물 기록을 검산한다",
        "npcReaction": "억울한 몰수는 막지만 가족의 불만을 먼저 듣게 된다",
        "followupDialogueOutline": "서아가 화물 기록을 검산한다 행동을 실행한다. 나루 주인의 반응: 억울한 몰수는 막지만 가족의 불만을 먼저 듣게 된다. 상대의 답을 듣고 현재 갈등인 “국경 변경 때문에 물품과 가족의 이동이 막힌다의 처리 결과를 확인한다.",
        "relationshipEffect": "억울한 몰수는 막지만 가족의 불만을 먼저 듣게 된다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C12-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "국경 변경 때문에 물품과 가족의 이동이 막힌다",
      "turn": "서아가 한강 장악의 경제·외교 가치를 듣고 주민 통행의 대가도 기록한다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 확보·순수비·단양 적성비·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S8"
    ],
    "nextSceneId": "THR-C12-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “553년 / 한강 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C12-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C12-S03",
    "chapterId": "THR-C12",
    "sceneTitle": "신주를 세운 사람",
    "historicalYear": "553년",
    "location": "한강 유역 관청",
    "historicalEventId": "H-S8",
    "characters": [
      "서아",
      "관리"
    ],
    "backgroundAsset": "BG-59f159e6b1",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-c29fba5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "관리는 행정과 주민 협력이 필요하다고 설명한다",
    "storyObjective": "관리는 행정과 주민 협력이 필요하다고 설명한다. 서아는 당과 직접 교류할 통로를 지도에 표시한다.",
    "conflict": "지도에 신라 색을 칠했으니 통치도 끝났다는 오해",
    "dialogueOutline": "관리는 행정과 주민 협력이 필요하다고 설명한다. 서아는 당과 직접 교류할 통로를 지도에 표시한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "지도에 신라 색을 칠했으니 통치도 끝났다는 오해",
      "turn": "관리는 행정과 주민 협력이 필요하다고 설명한다. 서아는 당과 직접 교류할 통로를 지도에 표시한다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 확보·순수비·단양 적성비·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S8"
    ],
    "nextSceneId": "THR-C12-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “553년 / 한강 유역 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C12-S04",
    "chapterId": "THR-C12",
    "sceneTitle": "동맹을 잃은 식탁",
    "historicalYear": "554년",
    "location": "신라 장터",
    "historicalEventId": "H-B10",
    "characters": [
      "서아",
      "백제 출신 상인"
    ],
    "backgroundAsset": "BG-17df4743ef",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-4466ef4",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 전투를 다시 재현하지 않고 CH08에서 확인한 전사 소식 뒤 관계의 변화를 다룬다.",
    "storyObjective": "서아는 전투를 다시 재현하지 않고 CH08에서 확인한 전사 소식 뒤 관계의 변화를 다룬다.",
    "conflict": "관산성 승전 뒤 이웃 상인을 적으로 몰아낸다",
    "dialogueOutline": "서아는 전투를 다시 재현하지 않고 CH08에서 확인한 전사 소식 뒤 관계의 변화를 다룬다.",
    "choices": [
      {
        "choiceId": "THR-C12-S04-B1",
        "label": "상인의 거래를 보증한다",
        "action": "상인의 거래를 보증한다",
        "npcReaction": "주민이 망설이면서도 개인의 신뢰를 시험한다",
        "followupDialogueOutline": "서아가 상인의 거래를 보증한다 행동을 실행한다. 백제 출신 상인의 반응: 주민이 망설이면서도 개인의 신뢰를 시험한다. 상대의 답을 듣고 현재 갈등인 “관산성 승전 뒤 이웃 상인을 적으로 몰아낸다의 처리 결과를 확인한다.",
        "relationshipEffect": "주민이 망설이면서도 개인의 신뢰를 시험한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C12-S04-JOIN"
      },
      {
        "choiceId": "THR-C12-S04-B2",
        "label": "피해 경험을 서로 듣는다",
        "action": "피해 경험을 서로 듣는다",
        "npcReaction": "양쪽이 다른 상실을 인정하고 대화를 재개한다",
        "followupDialogueOutline": "서아가 피해 경험을 서로 듣는다 행동을 실행한다. 백제 출신 상인의 반응: 양쪽이 다른 상실을 인정하고 대화를 재개한다. 상대의 답을 듣고 현재 갈등인 “관산성 승전 뒤 이웃 상인을 적으로 몰아낸다의 처리 결과를 확인한다.",
        "relationshipEffect": "양쪽이 다른 상실을 인정하고 대화를 재개한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C12-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "관산성 승전 뒤 이웃 상인을 적으로 몰아낸다",
      "turn": "서아는 전투를 다시 재현하지 않고 CH08에서 확인한 전사 소식 뒤 관계의 변화를 다룬다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 회복·신라 장악·관산성 전투",
    "questionIds": [],
    "genealogyLinks": [
      "H-B10"
    ],
    "nextSceneId": "THR-C12-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “554년 / 신라 장터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C12-S05",
    "chapterId": "THR-C12",
    "sceneTitle": "산길의 포상",
    "historicalYear": "545~550년대(단양 적성비 연대 유보)",
    "location": "단양 적성",
    "historicalEventId": "H-S8",
    "characters": [
      "서아",
      "비문을 새기는 서리"
    ],
    "backgroundAsset": "BG-34db4de8c0",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-6d6e635",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 지역민의 협력과 포상의 내용을 확인한다",
    "storyObjective": "서아가 지역민의 협력과 포상의 내용을 확인한다. 적성비를 순수비와 같은 종류로 분류하지 않는다.",
    "conflict": "협력자의 이름을 공적 문서에서 빼려는 감독",
    "dialogueOutline": "서아가 지역민의 협력과 포상의 내용을 확인한다. 적성비를 순수비와 같은 종류로 분류하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "협력자의 이름을 공적 문서에서 빼려는 감독",
      "turn": "서아가 지역민의 협력과 포상의 내용을 확인한다. 적성비를 순수비와 같은 종류로 분류하지 않는다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 확보·순수비·단양 적성비·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S8"
    ],
    "nextSceneId": "THR-C12-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “545~550년대(단양 적성비 연대 유보) / 단양 적성”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C12-S06",
    "chapterId": "THR-C12",
    "sceneTitle": "왕이 밟은 경계",
    "historicalYear": "555·568년 관련",
    "location": "창녕·북한산·황초령·마운령 비교 공간",
    "historicalEventId": "H-S8",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-c8fc641856",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 각 비석의 위치와 연대를 분리한다",
    "storyObjective": "서아가 각 비석의 위치와 연대를 분리한다. 북한산비의 정확 건립연도는 유보하고 진흥왕 관련 사실을 남긴다.",
    "conflict": "네 순수비를 같은 해 같은 장소의 사건으로 뭉친다",
    "dialogueOutline": "서아가 각 비석의 위치와 연대를 분리한다. 북한산비의 정확 건립연도는 유보하고 진흥왕 관련 사실을 남긴다.",
    "choices": [],
    "emotionalBeat": {
      "start": "네 순수비를 같은 해 같은 장소의 사건으로 뭉친다",
      "turn": "서아가 각 비석의 위치와 연대를 분리한다. 북한산비의 정확 건립연도는 유보하고 진흥왕 관련 사실을 남긴다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 확보·순수비·단양 적성비·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S8"
    ],
    "nextSceneId": "THR-C12-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “555·568년 관련 / 창녕·북한산·황초령·마운령 비교 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C12-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C12-S07",
    "chapterId": "THR-C12",
    "sceneTitle": "함께 걷는 화랑",
    "historicalYear": "6세기",
    "location": "신라 산길",
    "historicalEventId": "H-S3",
    "characters": [
      "서아",
      "화랑 청년"
    ],
    "backgroundAsset": "BG-c31817369f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-52c0054",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 병든 동료를 도우며 수련·인재 양성의 역할을 묻는다",
    "storyObjective": "서아가 병든 동료를 도우며 수련·인재 양성의 역할을 묻는다. 화랑을 현대 특수부대와 동일시하지 않는다.",
    "conflict": "이름난 전투만 배우려는 청년이 동료의 약함을 비웃는다",
    "dialogueOutline": "서아가 병든 동료를 도우며 수련·인재 양성의 역할을 묻는다. 화랑을 현대 특수부대와 동일시하지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C12-S07-B1",
        "label": "동료와 속도를 맞춘다",
        "action": "동료와 속도를 맞춘다",
        "npcReaction": "청년이 책임을 배워 관계 신뢰가 높아진다",
        "followupDialogueOutline": "서아가 동료와 속도를 맞춘다 행동을 실행한다. 화랑 청년의 반응: 청년이 책임을 배워 관계 신뢰가 높아진다. 상대의 답을 듣고 현재 갈등인 “이름난 전투만 배우려는 청년이 동료의 약함을 비웃는다의 처리 결과를 확인한다.",
        "relationshipEffect": "청년이 책임을 배워 관계 신뢰가 높아진다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C12-S07-JOIN"
      },
      {
        "choiceId": "THR-C12-S07-B2",
        "label": "지도 역할을 나눈다",
        "action": "지도 역할을 나눈다",
        "npcReaction": "약한 동료의 지형 지식이 인정되어 협력이 생긴다",
        "followupDialogueOutline": "서아가 지도 역할을 나눈다 행동을 실행한다. 화랑 청년의 반응: 약한 동료의 지형 지식이 인정되어 협력이 생긴다. 상대의 답을 듣고 현재 갈등인 “이름난 전투만 배우려는 청년이 동료의 약함을 비웃는다의 처리 결과를 확인한다.",
        "relationshipEffect": "약한 동료의 지형 지식이 인정되어 협력이 생긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C12-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "이름난 전투만 배우려는 청년이 동료의 약함을 비웃는다",
      "turn": "서아가 병든 동료를 도우며 수련·인재 양성의 역할을 묻는다. 화랑을 현대 특수부대와 동일시하지 않는다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "골품제·화백회의·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S3"
    ],
    "nextSceneId": "THR-C12-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “6세기 / 신라 산길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C12-S08",
    "chapterId": "THR-C12",
    "sceneTitle": "가야 쪽에서 온 울음",
    "historicalYear": "562년",
    "location": "대가야 병합 뒤 길",
    "historicalEventId": "H-Y5",
    "characters": [
      "서아",
      "가야 피란민"
    ],
    "backgroundAsset": "BG-604801f634",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-d99292b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 신라의 성과와 가야인의 손실을 같은 사건 ID로 기록한다",
    "storyObjective": "서아가 신라의 성과와 가야인의 손실을 같은 사건 ID로 기록한다. CH15는 병합 전 가야의 정치·문화를 별도로 체험한다.",
    "conflict": "영토 확장 축하 속에서 고향 상실이 들리지 않는다",
    "dialogueOutline": "서아가 신라의 성과와 가야인의 손실을 같은 사건 ID로 기록한다. CH15는 병합 전 가야의 정치·문화를 별도로 체험한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "영토 확장 축하 속에서 고향 상실이 들리지 않는다",
      "turn": "서아가 신라의 성과와 가야인의 손실을 같은 사건 ID로 기록한다. CH15는 병합 전 가야의 정치·문화를 별도로 체험한다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대가야 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y5"
    ],
    "nextSceneId": "THR-C12-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “562년 / 대가야 병합 뒤 길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C12-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C12-S09",
    "chapterId": "THR-C12",
    "sceneTitle": "새 영토의 일상",
    "historicalYear": "562년 이후",
    "location": "편입 지역 장터",
    "historicalEventId": "H-S8",
    "characters": [
      "서아",
      "신라 관리·가야 장인"
    ],
    "backgroundAsset": "BG-68edbe646e",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-843e6c1",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 계량과 계약을 설명하는 자리를 만들고 관리도 지역 기술을 인정하게 한다.",
    "storyObjective": "서아가 계량과 계약을 설명하는 자리를 만들고 관리도 지역 기술을 인정하게 한다.",
    "conflict": "새 법과 옛 관행이 거래에서 부딪친다",
    "dialogueOutline": "서아가 계량과 계약을 설명하는 자리를 만들고 관리도 지역 기술을 인정하게 한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "새 법과 옛 관행이 거래에서 부딪친다",
      "turn": "서아가 계량과 계약을 설명하는 자리를 만들고 관리도 지역 기술을 인정하게 한다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "한강 확보·순수비·단양 적성비·화랑도",
    "questionIds": [],
    "genealogyLinks": [
      "H-S8"
    ],
    "nextSceneId": "THR-C12-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “562년 이후 / 편입 지역 장터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C12-S10",
    "chapterId": "THR-C12",
    "sceneTitle": "높은 탑을 향한 장",
    "historicalYear": "568년→634년",
    "location": "서라벌·시간 전환",
    "historicalEventId": "H-S9",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-921584f83f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C12-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 진지왕·진평왕·선덕여왕 계승을 확인한다",
    "storyObjective": "서아가 진지왕·진평왕·선덕여왕 계승을 확인한다. 황룡사에 아직 9층 목탑이 없는 시점부터 시작한다.",
    "conflict": "다음 세대에도 진흥왕이 살아 있을 것처럼 느끼는 혼동",
    "dialogueOutline": "서아가 진지왕·진평왕·선덕여왕 계승을 확인한다. 황룡사에 아직 9층 목탑이 없는 시점부터 시작한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "다음 세대에도 진흥왕이 살아 있을 것처럼 느끼는 혼동",
      "turn": "서아가 진지왕·진평왕·선덕여왕 계승을 확인한다. 황룡사에 아직 9층 목탑이 없는 시점부터 시작한다.",
      "end": "영토 확장의 이득과 배신으로 느끼는 이웃의 시선을 교차; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "첨성대·분황사(634)·황룡사9층목탑(645)",
    "questionIds": [],
    "genealogyLinks": [
      "H-S9"
    ],
    "nextSceneId": "THR-C13-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “568년→634년 / 서라벌·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C12-S10-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.13 통일이라는 말의 무게

```json
[
  {
    "sceneId": "THR-C13-S01",
    "chapterId": "THR-C13",
    "sceneTitle": "여왕을 시험하는 말",
    "historicalYear": "634년",
    "location": "분황사 주변",
    "historicalEventId": "H-S9",
    "characters": [
      "서아",
      "선덕여왕의 서리"
    ],
    "backgroundAsset": "BG-ceb0970a16",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-c384ff8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 근거 없는 비난을 막고 분황사와 왕권 정당성·불교 후원의 맥락을 듣는다.",
    "storyObjective": "서아가 근거 없는 비난을 막고 분황사와 왕권 정당성·불교 후원의 맥락을 듣는다.",
    "conflict": "여성이 왕이라는 이유로 국가 위기를 모두 탓한다",
    "dialogueOutline": "서아가 근거 없는 비난을 막고 분황사와 왕권 정당성·불교 후원의 맥락을 듣는다.",
    "choices": [
      {
        "choiceId": "THR-C13-S01-B1",
        "label": "비난의 근거를 묻는다",
        "action": "비난의 근거를 묻는다",
        "npcReaction": "서리가 외교적 위기와 성별 편견을 구별한다",
        "followupDialogueOutline": "서아가 비난의 근거를 묻는다 행동을 실행한다. 선덕여왕의 서리의 반응: 서리가 외교적 위기와 성별 편견을 구별한다. 상대의 답을 듣고 현재 갈등인 “여성이 왕이라는 이유로 국가 위기를 모두 탓한다의 처리 결과를 확인한다.",
        "relationshipEffect": "서리가 외교적 위기와 성별 편견을 구별한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C13-S01-JOIN"
      },
      {
        "choiceId": "THR-C13-S01-B2",
        "label": "공사 인부의 말을 전한다",
        "action": "공사 인부의 말을 전한다",
        "npcReaction": "왕권 논쟁에 가려진 노동과 주민의 기대가 들린다",
        "followupDialogueOutline": "서아가 공사 인부의 말을 전한다 행동을 실행한다. 선덕여왕의 서리의 반응: 왕권 논쟁에 가려진 노동과 주민의 기대가 들린다. 상대의 답을 듣고 현재 갈등인 “여성이 왕이라는 이유로 국가 위기를 모두 탓한다의 처리 결과를 확인한다.",
        "relationshipEffect": "왕권 논쟁에 가려진 노동과 주민의 기대가 들린다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C13-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "여성이 왕이라는 이유로 국가 위기를 모두 탓한다",
      "turn": "서아가 근거 없는 비난을 막고 분황사와 왕권 정당성·불교 후원의 맥락을 듣는다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "첨성대·분황사(634)·황룡사9층목탑(645)",
    "questionIds": [],
    "genealogyLinks": [
      "H-S9"
    ],
    "nextSceneId": "THR-C13-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “634년 / 분황사 주변”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C13-S02",
    "chapterId": "THR-C13",
    "sceneTitle": "별을 세는 사람",
    "historicalYear": "선덕여왕대",
    "location": "첨성대 주변",
    "historicalEventId": "H-S9",
    "characters": [
      "서아",
      "관측 보조"
    ],
    "backgroundAsset": "BG-1df32074a1",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-09a4896",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "보조가 농사·역법과 국가 운영의 연결을 말한다",
    "storyObjective": "보조가 농사·역법과 국가 운영의 연결을 말한다. 첨성대의 세부 운용 방식은 추정과 확정 사실을 나눈다.",
    "conflict": "서아는 관측이 전쟁을 멈추지 못한다며 가치를 의심한다",
    "dialogueOutline": "보조가 농사·역법과 국가 운영의 연결을 말한다. 첨성대의 세부 운용 방식은 추정과 확정 사실을 나눈다.",
    "choices": [],
    "emotionalBeat": {
      "start": "서아는 관측이 전쟁을 멈추지 못한다며 가치를 의심한다",
      "turn": "보조가 농사·역법과 국가 운영의 연결을 말한다. 첨성대의 세부 운용 방식은 추정과 확정 사실을 나눈다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "첨성대·분황사(634)·황룡사9층목탑(645)",
    "questionIds": [],
    "genealogyLinks": [
      "H-S9"
    ],
    "nextSceneId": "THR-C13-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “선덕여왕대 / 첨성대 주변”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C13-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C13-S03",
    "chapterId": "THR-C13",
    "sceneTitle": "아홉 층의 기원",
    "historicalYear": "645년",
    "location": "황룡사 목탑 공사터",
    "historicalEventId": "H-S9",
    "characters": [
      "서아",
      "자장·백제 장인 관련 기록"
    ],
    "backgroundAsset": "BG-a1b4ae9f07",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-31f64b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 목탑 건립과 백제 장인 아비지의 전승을 함께 적는다",
    "storyObjective": "서아는 목탑 건립과 백제 장인 아비지의 전승을 함께 적는다. 오늘날 남아 있지 않은 탑을 현재 유적으로 표시하지 않는다.",
    "conflict": "나라의 안녕을 기원하는 건축에 적국 기술자의 공이 남는다",
    "dialogueOutline": "서아는 목탑 건립과 백제 장인 아비지의 전승을 함께 적는다. 오늘날 남아 있지 않은 탑을 현재 유적으로 표시하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "나라의 안녕을 기원하는 건축에 적국 기술자의 공이 남는다",
      "turn": "서아는 목탑 건립과 백제 장인 아비지의 전승을 함께 적는다. 오늘날 남아 있지 않은 탑을 현재 유적으로 표시하지 않는다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "첨성대·분황사(634)·황룡사9층목탑(645)",
    "questionIds": [],
    "genealogyLinks": [
      "H-S9"
    ],
    "nextSceneId": "THR-C13-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “645년 / 황룡사 목탑 공사터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C13-S04",
    "chapterId": "THR-C13",
    "sceneTitle": "당으로 가는 사신",
    "historicalYear": "648년",
    "location": "대당 사절 출항지",
    "historicalEventId": "H-S10",
    "characters": [
      "서아",
      "김춘추"
    ],
    "backgroundAsset": "BG-ec43d9a871",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-c2726f9",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "김춘추가 동맹의 절박함을 말하고 서아는 이후 지배 구상과 충돌할 가능성을 학습 노트에 분리한다.",
    "storyObjective": "김춘추가 동맹의 절박함을 말하고 서아는 이후 지배 구상과 충돌할 가능성을 학습 노트에 분리한다.",
    "conflict": "당의 지원을 얻으면 대가 없이 안전해진다는 기대",
    "dialogueOutline": "김춘추가 동맹의 절박함을 말하고 서아는 이후 지배 구상과 충돌할 가능성을 학습 노트에 분리한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "당의 지원을 얻으면 대가 없이 안전해진다는 기대",
      "turn": "김춘추가 동맹의 절박함을 말하고 서아는 이후 지배 구상과 충돌할 가능성을 학습 노트에 분리한다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "나당 동맹과 집사부 설치",
    "questionIds": [],
    "genealogyLinks": [
      "H-S10"
    ],
    "nextSceneId": "THR-C13-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “648년 / 대당 사절 출항지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C13-S05",
    "chapterId": "THR-C13",
    "sceneTitle": "집사부의 새 문서",
    "historicalYear": "651년",
    "location": "서라벌 집사부",
    "historicalEventId": "H-S10",
    "characters": [
      "서아",
      "행정 서리"
    ],
    "backgroundAsset": "BG-9ba07482c9",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-9999a21",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 집사부와 화백회의를 다른 상자로 그린다",
    "storyObjective": "서아가 집사부와 화백회의를 다른 상자로 그린다. 진덕여왕의 개혁을 무열왕 업적으로 돌리지 않는다.",
    "conflict": "귀족 합의와 왕 중심 집행의 권한이 충돌한다",
    "dialogueOutline": "서아가 집사부와 화백회의를 다른 상자로 그린다. 진덕여왕의 개혁을 무열왕 업적으로 돌리지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "귀족 합의와 왕 중심 집행의 권한이 충돌한다",
      "turn": "서아가 집사부와 화백회의를 다른 상자로 그린다. 진덕여왕의 개혁을 무열왕 업적으로 돌리지 않는다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "나당 동맹과 집사부 설치",
    "questionIds": [],
    "genealogyLinks": [
      "H-S10"
    ],
    "nextSceneId": "THR-C13-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “651년 / 서라벌 집사부”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C13-S06",
    "chapterId": "THR-C13",
    "sceneTitle": "김춘추가 왕이 되다",
    "historicalYear": "654년",
    "location": "신라 왕실 기록 공간",
    "historicalEventId": "H-S11",
    "characters": [
      "서아",
      "김유신"
    ],
    "backgroundAsset": "BG-c255b1448b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-0b87a3a",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "김유신이 왕권 기반과 동맹을 설명한다",
    "storyObjective": "김유신이 왕권 기반과 동맹을 설명한다. 서아는 성골에서 진골 왕으로의 변화와 골품제 존속을 구별한다.",
    "conflict": "진골 왕의 즉위를 신분제 폐지로 오해한다",
    "dialogueOutline": "김유신이 왕권 기반과 동맹을 설명한다. 서아는 성골에서 진골 왕으로의 변화와 골품제 존속을 구별한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "진골 왕의 즉위를 신분제 폐지로 오해한다",
      "turn": "김유신이 왕권 기반과 동맹을 설명한다. 서아는 성골에서 진골 왕으로의 변화와 골품제 존속을 구별한다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "진골 왕위와 백제 정복 전쟁",
    "questionIds": [],
    "genealogyLinks": [
      "H-S11"
    ],
    "nextSceneId": "THR-C13-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “654년 / 신라 왕실 기록 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C13-S07",
    "chapterId": "THR-C13",
    "sceneTitle": "660년의 두 배",
    "historicalYear": "660년",
    "location": "덕물도 연결 군영",
    "historicalEventId": "H-S11",
    "characters": [
      "서아",
      "신라 수군"
    ],
    "backgroundAsset": "BG-6be6f48e86",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-6dbc9a3",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 소정방과 김법민의 접촉·신라군 진격 순서를 확인한다",
    "storyObjective": "서아가 소정방과 김법민의 접촉·신라군 진격 순서를 확인한다. 백제 시점 CH09와 전투 결과를 공유한다.",
    "conflict": "승리 일정에 맞추느라 주민 배를 무리하게 동원한다",
    "dialogueOutline": "서아가 소정방과 김법민의 접촉·신라군 진격 순서를 확인한다. 백제 시점 CH09와 전투 결과를 공유한다.",
    "choices": [
      {
        "choiceId": "THR-C13-S07-B1",
        "label": "동원 명부를 확인한다",
        "action": "동원 명부를 확인한다",
        "npcReaction": "가족 생계의 공백이 드러나 대체 수송을 검토한다",
        "followupDialogueOutline": "서아가 동원 명부를 확인한다 행동을 실행한다. 신라 수군의 반응: 가족 생계의 공백이 드러나 대체 수송을 검토한다. 상대의 답을 듣고 현재 갈등인 “승리 일정에 맞추느라 주민 배를 무리하게 동원한다의 처리 결과를 확인한다.",
        "relationshipEffect": "가족 생계의 공백이 드러나 대체 수송을 검토한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C13-S07-JOIN"
      },
      {
        "choiceId": "THR-C13-S07-B2",
        "label": "피란 통로를 알린다",
        "action": "피란 통로를 알린다",
        "npcReaction": "군인이 지연을 걱정하지만 주민 피해를 줄일 여지를 만든다",
        "followupDialogueOutline": "서아가 피란 통로를 알린다 행동을 실행한다. 신라 수군의 반응: 군인이 지연을 걱정하지만 주민 피해를 줄일 여지를 만든다. 상대의 답을 듣고 현재 갈등인 “승리 일정에 맞추느라 주민 배를 무리하게 동원한다의 처리 결과를 확인한다.",
        "relationshipEffect": "군인이 지연을 걱정하지만 주민 피해를 줄일 여지를 만든다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C13-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "승리 일정에 맞추느라 주민 배를 무리하게 동원한다",
      "turn": "서아가 소정방과 김법민의 접촉·신라군 진격 순서를 확인한다. 백제 시점 CH09와 전투 결과를 공유한다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "진골 왕위와 백제 정복 전쟁",
    "questionIds": [],
    "genealogyLinks": [
      "H-S11"
    ],
    "nextSceneId": "THR-C13-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “660년 / 덕물도 연결 군영”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C13-S07-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C13-S08",
    "chapterId": "THR-C13",
    "sceneTitle": "668년의 빈 성",
    "historicalYear": "668년",
    "location": "고구려 멸망 뒤 행정 거점",
    "historicalEventId": "H-G18",
    "characters": [
      "서아",
      "고구려 유민"
    ],
    "backgroundAsset": "BG-4715c09621",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-01ac619",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 안동도호부와 웅진도독부·계림도독부를 나란히 확인한다",
    "storyObjective": "서아는 안동도호부와 웅진도독부·계림도독부를 나란히 확인한다. 멸망 연도를 통일 완료 연도로 쓰지 않는다.",
    "conflict": "같은 연합군 안에서 신라와 당의 통치 구상이 다르다",
    "dialogueOutline": "서아는 안동도호부와 웅진도독부·계림도독부를 나란히 확인한다. 멸망 연도를 통일 완료 연도로 쓰지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "같은 연합군 안에서 신라와 당의 통치 구상이 다르다",
      "turn": "서아는 안동도호부와 웅진도독부·계림도독부를 나란히 확인한다. 멸망 연도를 통일 완료 연도로 쓰지 않는다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "내분과 나당 연합군의 고구려 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-G18"
    ],
    "nextSceneId": "THR-C13-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “668년 / 고구려 멸망 뒤 행정 거점”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C13-S09",
    "chapterId": "THR-C13",
    "sceneTitle": "안승의 사람들",
    "historicalYear": "674년",
    "location": "보덕국 관련 거점",
    "historicalEventId": "H-S12",
    "characters": [
      "서아",
      "고구려 유민 연락관"
    ],
    "backgroundAsset": "BG-b7401781be",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-732509d",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 문무왕의 보덕왕 책봉을 듣고 정치적 포섭과 유민의 생존 요구를 함께 적는다.",
    "storyObjective": "서아가 문무왕의 보덕왕 책봉을 듣고 정치적 포섭과 유민의 생존 요구를 함께 적는다.",
    "conflict": "귀부한 사람들이 이용당할까 신라를 믿지 못한다",
    "dialogueOutline": "서아가 문무왕의 보덕왕 책봉을 듣고 정치적 포섭과 유민의 생존 요구를 함께 적는다.",
    "choices": [
      {
        "choiceId": "THR-C13-S09-B1",
        "label": "주민 요구를 전달한다",
        "action": "주민 요구를 전달한다",
        "npcReaction": "연락관이 조건을 확인한 뒤 협력을 검토한다",
        "followupDialogueOutline": "서아가 주민 요구를 전달한다 행동을 실행한다. 고구려 유민 연락관의 반응: 연락관이 조건을 확인한 뒤 협력을 검토한다. 상대의 답을 듣고 현재 갈등인 “귀부한 사람들이 이용당할까 신라를 믿지 못한다의 처리 결과를 확인한다.",
        "relationshipEffect": "연락관이 조건을 확인한 뒤 협력을 검토한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C13-S09-JOIN"
      },
      {
        "choiceId": "THR-C13-S09-B2",
        "label": "호송 연락망을 돕는다",
        "action": "호송 연락망을 돕는다",
        "npcReaction": "흩어진 가족의 소식이 연결되어 실무 신뢰가 쌓인다",
        "followupDialogueOutline": "서아가 호송 연락망을 돕는다 행동을 실행한다. 고구려 유민 연락관의 반응: 흩어진 가족의 소식이 연결되어 실무 신뢰가 쌓인다. 상대의 답을 듣고 현재 갈등인 “귀부한 사람들이 이용당할까 신라를 믿지 못한다의 처리 결과를 확인한다.",
        "relationshipEffect": "흩어진 가족의 소식이 연결되어 실무 신뢰가 쌓인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C13-S09-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "귀부한 사람들이 이용당할까 신라를 믿지 못한다",
      "turn": "서아가 문무왕의 보덕왕 책봉을 듣고 정치적 포섭과 유민의 생존 요구를 함께 적는다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고구려 멸망·나당 전쟁·통일",
    "questionIds": [
      "official-61-advanced-07"
    ],
    "genealogyLinks": [
      "H-S12"
    ],
    "nextSceneId": "THR-C13-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “674년 / 보덕국 관련 거점”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C13-S09-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C13-S10",
    "chapterId": "THR-C13",
    "sceneTitle": "매소성의 보급길",
    "historicalYear": "675년",
    "location": "매소성 후방",
    "historicalEventId": "H-S12",
    "characters": [
      "서아",
      "신라 보급병"
    ],
    "backgroundAsset": "BG-00b2806926",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-873aa7a",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 적절한 우회로 안내를 돕는다",
    "storyObjective": "서아가 적절한 우회로 안내를 돕는다. 승패를 바꾸는 현대 무기를 제안하지 않고 나당전쟁의 전략과 결과를 확인한다.",
    "conflict": "육상전 승리를 위해 물자와 주민 안전이 충돌한다",
    "dialogueOutline": "서아가 적절한 우회로 안내를 돕는다. 승패를 바꾸는 현대 무기를 제안하지 않고 나당전쟁의 전략과 결과를 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "육상전 승리를 위해 물자와 주민 안전이 충돌한다",
      "turn": "서아가 적절한 우회로 안내를 돕는다. 승패를 바꾸는 현대 무기를 제안하지 않고 나당전쟁의 전략과 결과를 확인한다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고구려 멸망·나당 전쟁·통일",
    "questionIds": [],
    "genealogyLinks": [
      "H-S12"
    ],
    "nextSceneId": "THR-C13-S11",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “675년 / 매소성 후방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C13-S10-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C13-S11",
    "chapterId": "THR-C13",
    "sceneTitle": "기벌포의 파도",
    "historicalYear": "676년",
    "location": "기벌포",
    "historicalEventId": "H-S12",
    "characters": [
      "서아",
      "신라 수군"
    ],
    "backgroundAsset": "BG-e2df755b55",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-6dbc9a3",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "수군이 시득과 설인귀의 해전을 설명한다",
    "storyObjective": "수군이 시득과 설인귀의 해전을 설명한다. 서아는 675 육상·676 해상 전투의 순서를 지도에 연결한다.",
    "conflict": "매소성과 기벌포를 같은 육지 전투로 혼동한다",
    "dialogueOutline": "수군이 시득과 설인귀의 해전을 설명한다. 서아는 675 육상·676 해상 전투의 순서를 지도에 연결한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "매소성과 기벌포를 같은 육지 전투로 혼동한다",
      "turn": "수군이 시득과 설인귀의 해전을 설명한다. 서아는 675 육상·676 해상 전투의 순서를 지도에 연결한다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고구려 멸망·나당 전쟁·통일",
    "questionIds": [],
    "genealogyLinks": [
      "H-S12"
    ],
    "nextSceneId": "THR-C13-S12",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “676년 / 기벌포”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C13-S12",
    "chapterId": "THR-C13",
    "sceneTitle": "통일의 바깥을 묻다",
    "historicalYear": "676년→3세기 가야",
    "location": "전쟁 뒤 피란 거처·시간 전환",
    "historicalEventId": "H-S12",
    "characters": [
      "서아",
      "유민 가족"
    ],
    "backgroundAsset": "BG-270ca4cd26",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C13-5a9917e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 통일의 의의와 한계를 함께 적고 발해의 다음 장을 예고한다",
    "storyObjective": "서아는 통일의 의의와 한계를 함께 적고 발해의 다음 장을 예고한다. 가야를 부속 결말로 보지 않기 위해 독립 발전기로 돌아간다.",
    "conflict": "승전의 결말에서 고구려 옛 북쪽 영역과 남은 유민을 잊는다",
    "dialogueOutline": "서아는 통일의 의의와 한계를 함께 적고 발해의 다음 장을 예고한다. 가야를 부속 결말로 보지 않기 위해 독립 발전기로 돌아간다.",
    "choices": [],
    "emotionalBeat": {
      "start": "승전의 결말에서 고구려 옛 북쪽 영역과 남은 유민을 잊는다",
      "turn": "서아는 통일의 의의와 한계를 함께 적고 발해의 다음 장을 예고한다. 가야를 부속 결말로 보지 않기 위해 독립 발전기로 돌아간다.",
      "end": "왕위·외교·연합전쟁·유민·나당전쟁을 압축하되 사건 순서 보존; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고구려 멸망·나당 전쟁·통일",
    "questionIds": [],
    "genealogyLinks": [
      "H-S12"
    ],
    "nextSceneId": "THR-C14-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “676년→3세기 가야 / 전쟁 뒤 피란 거처·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  }
]
```

## CH.14 철을 만드는 사람들

```json
[
  {
    "sceneId": "THR-C14-S01",
    "chapterId": "THR-C14",
    "sceneTitle": "낙동강의 첫 물결",
    "historicalYear": "3세기·42년 설화 회상",
    "location": "금관가야 항구",
    "historicalEventId": "H-Y1",
    "characters": [
      "서아",
      "상인 아라1"
    ],
    "backgroundAsset": "BG-30e08a3d79",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C14-41277f5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "아라1은 전승을 들려주고 서아는 설화 연대와 고고학적 발전을 따로 기록한다.",
    "storyObjective": "아라1은 전승을 들려주고 서아는 설화 연대와 고고학적 발전을 따로 기록한다.",
    "conflict": "서아가 김수로왕 설화를 항구의 실증 건국일로 착각한다",
    "dialogueOutline": "아라1은 전승을 들려주고 서아는 설화 연대와 고고학적 발전을 따로 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "서아가 김수로왕 설화를 항구의 실증 건국일로 착각한다",
      "turn": "아라1은 전승을 들려주고 서아는 설화 연대와 고고학적 발전을 따로 기록한다.",
      "end": "독립적인 연맹·생산·교역의 힘과 분배 갈등; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "금관가야·김수로왕·전기 연맹",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y1"
    ],
    "nextSceneId": "THR-C14-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “3세기·42년 설화 회상 / 금관가야 항구”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C14-S02",
    "chapterId": "THR-C14",
    "sceneTitle": "여러 왕의 약속",
    "historicalYear": "3세기",
    "location": "연맹 교역 회합",
    "historicalEventId": "H-Y1",
    "characters": [
      "서아",
      "연맹 연락관"
    ],
    "backgroundAsset": "BG-45df8986b8",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C14-898a446",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 정치체별 깃발과 계약을 확인한다",
    "storyObjective": "서아가 정치체별 깃발과 계약을 확인한다. 연맹과 중앙집권 왕국의 차이를 말로만이 아닌 조율의 지연으로 겪는다.",
    "conflict": "한 왕의 명령이면 모든 가야가 움직인다는 오해",
    "dialogueOutline": "서아가 정치체별 깃발과 계약을 확인한다. 연맹과 중앙집권 왕국의 차이를 말로만이 아닌 조율의 지연으로 겪는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "한 왕의 명령이면 모든 가야가 움직인다는 오해",
      "turn": "서아가 정치체별 깃발과 계약을 확인한다. 연맹과 중앙집권 왕국의 차이를 말로만이 아닌 조율의 지연으로 겪는다.",
      "end": "독립적인 연맹·생산·교역의 힘과 분배 갈등; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "금관가야·김수로왕·전기 연맹",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y1"
    ],
    "nextSceneId": "THR-C14-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “3세기 / 연맹 교역 회합”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C14-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C14-S03",
    "chapterId": "THR-C14",
    "sceneTitle": "뜨거운 노의 규칙",
    "historicalYear": "3~4세기",
    "location": "금관가야 제철소",
    "historicalEventId": "H-Y2",
    "characters": [
      "서아",
      "장인 해들"
    ],
    "backgroundAsset": "BG-8503e7c719",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C14-c1a9f7b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "해들이 작업 거리와 순서를 알려 준다",
    "storyObjective": "해들이 작업 거리와 순서를 알려 준다. 서아는 철 생산이 자원·연료·숙련 노동의 결합임을 배운다.",
    "conflict": "서아의 급한 도움이 화상 위험을 만든다",
    "dialogueOutline": "해들이 작업 거리와 순서를 알려 준다. 서아는 철 생산이 자원·연료·숙련 노동의 결합임을 배운다.",
    "choices": [
      {
        "choiceId": "THR-C14-S03-B1",
        "label": "안전한 연료 운반을 맡는다",
        "action": "안전한 연료 운반을 맡는다",
        "npcReaction": "해들이 믿고 작업 동선을 설명한다",
        "followupDialogueOutline": "서아가 안전한 연료 운반을 맡는다 행동을 실행한다. 장인 해들의 반응: 해들이 믿고 작업 동선을 설명한다. 상대의 답을 듣고 현재 갈등인 “서아의 급한 도움이 화상 위험을 만든다의 처리 결과를 확인한다.",
        "relationshipEffect": "해들이 믿고 작업 동선을 설명한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C14-S03-JOIN"
      },
      {
        "choiceId": "THR-C14-S03-B2",
        "label": "도구 정리를 돕는다",
        "action": "도구 정리를 돕는다",
        "npcReaction": "잘못 놓인 집게를 찾으며 숙련의 의미를 이해한다",
        "followupDialogueOutline": "서아가 도구 정리를 돕는다 행동을 실행한다. 장인 해들의 반응: 잘못 놓인 집게를 찾으며 숙련의 의미를 이해한다. 상대의 답을 듣고 현재 갈등인 “서아의 급한 도움이 화상 위험을 만든다의 처리 결과를 확인한다.",
        "relationshipEffect": "잘못 놓인 집게를 찾으며 숙련의 의미를 이해한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C14-S03-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "서아의 급한 도움이 화상 위험을 만든다",
      "turn": "해들이 작업 거리와 순서를 알려 준다. 서아는 철 생산이 자원·연료·숙련 노동의 결합임을 배운다.",
      "end": "독립적인 연맹·생산·교역의 힘과 분배 갈등; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "철 생산·덩이쇠·무기·해상 교역",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y2"
    ],
    "nextSceneId": "THR-C14-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “3~4세기 / 금관가야 제철소”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C14-S04",
    "chapterId": "THR-C14",
    "sceneTitle": "덩이쇠의 값",
    "historicalYear": "3~4세기",
    "location": "철 교역장",
    "historicalEventId": "H-Y2",
    "characters": [
      "서아",
      "상인 아라1"
    ],
    "backgroundAsset": "BG-1bc6491ae2",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C14-41277f5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 계량을 재확인하고 교역품·교환 수단이라는 철의 역할을 듣는다.",
    "storyObjective": "서아가 계량을 재확인하고 교역품·교환 수단이라는 철의 역할을 듣는다.",
    "conflict": "같은 덩이쇠의 질과 무게를 놓고 분쟁이 생긴다",
    "dialogueOutline": "서아가 계량을 재확인하고 교역품·교환 수단이라는 철의 역할을 듣는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "같은 덩이쇠의 질과 무게를 놓고 분쟁이 생긴다",
      "turn": "서아가 계량을 재확인하고 교역품·교환 수단이라는 철의 역할을 듣는다.",
      "end": "독립적인 연맹·생산·교역의 힘과 분배 갈등; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "철 생산·덩이쇠·무기·해상 교역",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y2"
    ],
    "nextSceneId": "THR-C14-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “3~4세기 / 철 교역장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C14-S05",
    "chapterId": "THR-C14",
    "sceneTitle": "칼보다 먼저 만든 것",
    "historicalYear": "3~4세기",
    "location": "철제 농기구 공방",
    "historicalEventId": "H-Y2",
    "characters": [
      "서아",
      "장인 해들"
    ],
    "backgroundAsset": "BG-6e8b723668",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C14-c1a9f7b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 철제 무기와 농기구의 생산 경쟁을 중재한다",
    "storyObjective": "서아는 철제 무기와 농기구의 생산 경쟁을 중재한다. 기술의 가치가 전쟁에만 있지 않음을 장인의 가족이 보여 준다.",
    "conflict": "군수 주문이 농기구 공급을 밀어낸다",
    "dialogueOutline": "서아는 철제 무기와 농기구의 생산 경쟁을 중재한다. 기술의 가치가 전쟁에만 있지 않음을 장인의 가족이 보여 준다.",
    "choices": [
      {
        "choiceId": "THR-C14-S05-B1",
        "label": "농기구 수요를 모은다",
        "action": "농기구 수요를 모은다",
        "npcReaction": "장인이 분할 생산을 검토하고 농민이 신뢰를 보인다",
        "followupDialogueOutline": "서아가 농기구 수요를 모은다 행동을 실행한다. 장인 해들의 반응: 장인이 분할 생산을 검토하고 농민이 신뢰를 보인다. 상대의 답을 듣고 현재 갈등인 “군수 주문이 농기구 공급을 밀어낸다의 처리 결과를 확인한다.",
        "relationshipEffect": "장인이 분할 생산을 검토하고 농민이 신뢰를 보인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C14-S05-JOIN"
      },
      {
        "choiceId": "THR-C14-S05-B2",
        "label": "군수 운송을 개선한다",
        "action": "군수 운송을 개선한다",
        "npcReaction": "긴급 주문을 빨리 끝낸 뒤 농기구 작업 시간을 확보한다",
        "followupDialogueOutline": "서아가 군수 운송을 개선한다 행동을 실행한다. 장인 해들의 반응: 긴급 주문을 빨리 끝낸 뒤 농기구 작업 시간을 확보한다. 상대의 답을 듣고 현재 갈등인 “군수 주문이 농기구 공급을 밀어낸다의 처리 결과를 확인한다.",
        "relationshipEffect": "긴급 주문을 빨리 끝낸 뒤 농기구 작업 시간을 확보한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C14-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "군수 주문이 농기구 공급을 밀어낸다",
      "turn": "서아는 철제 무기와 농기구의 생산 경쟁을 중재한다. 기술의 가치가 전쟁에만 있지 않음을 장인의 가족이 보여 준다.",
      "end": "독립적인 연맹·생산·교역의 힘과 분배 갈등; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "철 생산·덩이쇠·무기·해상 교역",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y2"
    ],
    "nextSceneId": "THR-C14-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “3~4세기 / 철제 농기구 공방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C14-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C14-S06",
    "chapterId": "THR-C14",
    "sceneTitle": "바다 건너의 계약",
    "historicalYear": "4세기",
    "location": "가야 출항 나루",
    "historicalEventId": "H-Y2",
    "characters": [
      "서아",
      "왜의 교역 상대"
    ],
    "backgroundAsset": "BG-220b45c900",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C14-2dc7aa1",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 물품과 수량을 도식으로 확인하고 교역로를 표시한다",
    "storyObjective": "서아가 물품과 수량을 도식으로 확인하고 교역로를 표시한다. 모든 교류를 정복이나 조공으로 환원하지 않는다.",
    "conflict": "말이 통하지 않아 약속을 어겼다는 오해",
    "dialogueOutline": "서아가 물품과 수량을 도식으로 확인하고 교역로를 표시한다. 모든 교류를 정복이나 조공으로 환원하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "말이 통하지 않아 약속을 어겼다는 오해",
      "turn": "서아가 물품과 수량을 도식으로 확인하고 교역로를 표시한다. 모든 교류를 정복이나 조공으로 환원하지 않는다.",
      "end": "독립적인 연맹·생산·교역의 힘과 분배 갈등; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "철 생산·덩이쇠·무기·해상 교역",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y2"
    ],
    "nextSceneId": "THR-C14-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “4세기 / 가야 출항 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C14-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C14-S07",
    "chapterId": "THR-C14",
    "sceneTitle": "갑옷 속의 사람",
    "historicalYear": "4~5세기",
    "location": "무기·갑옷 공방",
    "historicalEventId": "H-Y4",
    "characters": [
      "서아",
      "갑옷 장인"
    ],
    "backgroundAsset": "BG-a1065144df",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C14-c1d6f7d",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 판갑옷 등 유물 형태를 관찰하고 전쟁이 가족에게 남기는 불안을 듣는다.",
    "storyObjective": "서아가 판갑옷 등 유물 형태를 관찰하고 전쟁이 가족에게 남기는 불안을 듣는다.",
    "conflict": "장인의 아들이 전투에 나가면 자신의 제작물이 삶을 지킬 수 있을까",
    "dialogueOutline": "서아가 판갑옷 등 유물 형태를 관찰하고 전쟁이 가족에게 남기는 불안을 듣는다.",
    "choices": [
      {
        "choiceId": "THR-C14-S07-B1",
        "label": "장인의 걱정을 듣는다",
        "action": "장인의 걱정을 듣는다",
        "npcReaction": "장인이 기술의 한계와 정성을 함께 말한다",
        "followupDialogueOutline": "서아가 장인의 걱정을 듣는다 행동을 실행한다. 갑옷 장인의 반응: 장인이 기술의 한계와 정성을 함께 말한다. 상대의 답을 듣고 현재 갈등인 “장인의 아들이 전투에 나가면 자신의 제작물이 삶을 지킬 수 있을까의 처리 결과를 확인한다.",
        "relationshipEffect": "장인이 기술의 한계와 정성을 함께 말한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C14-S07-JOIN"
      },
      {
        "choiceId": "THR-C14-S07-B2",
        "label": "운반 끈을 고친다",
        "action": "운반 끈을 고친다",
        "npcReaction": "작은 실무 도움이 가족의 긴장을 누그러뜨린다",
        "followupDialogueOutline": "서아가 운반 끈을 고친다 행동을 실행한다. 갑옷 장인의 반응: 작은 실무 도움이 가족의 긴장을 누그러뜨린다. 상대의 답을 듣고 현재 갈등인 “장인의 아들이 전투에 나가면 자신의 제작물이 삶을 지킬 수 있을까의 처리 결과를 확인한다.",
        "relationshipEffect": "작은 실무 도움이 가족의 긴장을 누그러뜨린다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C14-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "장인의 아들이 전투에 나가면 자신의 제작물이 삶을 지킬 수 있을까",
      "turn": "서아가 판갑옷 등 유물 형태를 관찰하고 전쟁이 가족에게 남기는 불안을 듣는다.",
      "end": "독립적인 연맹·생산·교역의 힘과 분배 갈등; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고분·토기·갑옷·가야금",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y4"
    ],
    "nextSceneId": "THR-C14-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “4~5세기 / 무기·갑옷 공방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C14-S08",
    "chapterId": "THR-C14",
    "sceneTitle": "400년 뒤의 항구",
    "historicalYear": "400년 전쟁 이후",
    "location": "금관가야 교역항",
    "historicalEventId": "H-G9",
    "characters": [
      "서아",
      "아라1의 후손"
    ],
    "backgroundAsset": "BG-ac349c18c1",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C14-cf12455",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 CH03의 같은 사건을 가야 경제의 시점에서 기록한다",
    "storyObjective": "서아가 CH03의 같은 사건을 가야 경제의 시점에서 기록한다. 독립 역사가 병합까지의 대기 시간이 아니었음을 남기고 내륙 대가야로 향한다.",
    "conflict": "고구려의 신라 구원이 가야 교역에도 충격을 준다",
    "dialogueOutline": "서아가 CH03의 같은 사건을 가야 경제의 시점에서 기록한다. 독립 역사가 병합까지의 대기 시간이 아니었음을 남기고 내륙 대가야로 향한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "고구려의 신라 구원이 가야 교역에도 충격을 준다",
      "turn": "서아가 CH03의 같은 사건을 가야 경제의 시점에서 기록한다. 독립 역사가 병합까지의 대기 시간이 아니었음을 남기고 내륙 대가야로 향한다.",
      "end": "독립적인 연맹·생산·교역의 힘과 분배 갈등; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "신라 구원과 왜군 격퇴",
    "questionIds": [],
    "genealogyLinks": [
      "H-G9"
    ],
    "nextSceneId": "THR-C15-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “400년 전쟁 이후 / 금관가야 교역항”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C14-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.15 연맹의 마지막 음악

```json
[
  {
    "sceneId": "THR-C15-S01",
    "chapterId": "THR-C15",
    "sceneTitle": "고령으로 간 철",
    "historicalYear": "5세기",
    "location": "대가야 교역로",
    "historicalEventId": "H-Y3",
    "characters": [
      "서아",
      "상인 아라2"
    ],
    "backgroundAsset": "BG-003bb444b3",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C15-4579521",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "아라2가 내륙 생산과 길을 보여 준다",
    "storyObjective": "아라2가 내륙 생산과 길을 보여 준다. 서아는 금관가야와 대가야 중심 시기의 차이를 지도에 표시한다.",
    "conflict": "해상 중심이던 경험으로 내륙 교역을 낮춰 본다",
    "dialogueOutline": "아라2가 내륙 생산과 길을 보여 준다. 서아는 금관가야와 대가야 중심 시기의 차이를 지도에 표시한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "해상 중심이던 경험으로 내륙 교역을 낮춰 본다",
      "turn": "아라2가 내륙 생산과 길을 보여 준다. 서아는 금관가야와 대가야 중심 시기의 차이를 지도에 표시한다.",
      "end": "후기 연맹의 성장·외교·문화 계승을 멸망과 별도로 기억; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대가야 중심 후기 연맹",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y3"
    ],
    "nextSceneId": "THR-C15-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “5세기 / 대가야 교역로”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C15-S02",
    "chapterId": "THR-C15",
    "sceneTitle": "하나가 아닌 회의",
    "historicalYear": "5~6세기",
    "location": "대가야 외교 회합",
    "historicalEventId": "H-Y3",
    "characters": [
      "서아",
      "연맹 연락관"
    ],
    "backgroundAsset": "BG-dacf03a564",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C15-898a446",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 신라·백제·왜와의 관계를 한 줄로 정리했다가 반박을 듣는다",
    "storyObjective": "서아가 신라·백제·왜와의 관계를 한 줄로 정리했다가 반박을 듣는다. 분권적 연맹의 협력과 한계를 함께 기록한다.",
    "conflict": "각 정치체가 외교 상대와 이익을 달리한다",
    "dialogueOutline": "서아가 신라·백제·왜와의 관계를 한 줄로 정리했다가 반박을 듣는다. 분권적 연맹의 협력과 한계를 함께 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "각 정치체가 외교 상대와 이익을 달리한다",
      "turn": "서아가 신라·백제·왜와의 관계를 한 줄로 정리했다가 반박을 듣는다. 분권적 연맹의 협력과 한계를 함께 기록한다.",
      "end": "후기 연맹의 성장·외교·문화 계승을 멸망과 별도로 기억; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대가야 중심 후기 연맹",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y3"
    ],
    "nextSceneId": "THR-C15-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “5~6세기 / 대가야 외교 회합”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C15-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C15-S03",
    "chapterId": "THR-C15",
    "sceneTitle": "토기에 남은 다른 선",
    "historicalYear": "5~6세기",
    "location": "토기 가마",
    "historicalEventId": "H-Y4",
    "characters": [
      "서아",
      "도공"
    ],
    "backgroundAsset": "BG-27f46d4dae",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C15-0a0d7a1",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 고령·김해·함안의 지역차를 묻는다",
    "storyObjective": "서아가 고령·김해·함안의 지역차를 묻는다. 도공은 자신들의 무늬를 지워야만 팔 수 있느냐고 되묻는다. 가야토기와 일본 스에키의 기술 교류를 살피되 단순한 일방 전파로 단정하지 않는다.",
    "conflict": "모든 가야 토기를 한 모양으로 만들라는 주문",
    "dialogueOutline": "서아가 고령·김해·함안의 지역차를 묻는다. 도공은 자신들의 무늬를 지워야만 팔 수 있느냐고 되묻는다. 가야토기와 일본 스에키의 기술 교류를 살피되 단순한 일방 전파로 단정하지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C15-S03-B1",
        "label": "지역 이름을 남긴다",
        "action": "지역 이름을 남긴다",
        "npcReaction": "도공이 자부심을 회복하고 비교 전시를 돕는다",
        "followupDialogueOutline": "서아가 지역 이름을 남긴다 행동을 실행한다. 도공의 반응: 도공이 자부심을 회복하고 비교 전시를 돕는다. 상대의 답을 듣고 현재 갈등인 “모든 가야 토기를 한 모양으로 만들라는 주문의 처리 결과를 확인한다.",
        "relationshipEffect": "도공이 자부심을 회복하고 비교 전시를 돕는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C15-S03-JOIN"
      },
      {
        "choiceId": "THR-C15-S03-B2",
        "label": "쓰임을 먼저 설명한다",
        "action": "쓰임을 먼저 설명한다",
        "npcReaction": "서아가 외형만 보던 태도를 고치고 생활을 이해한다",
        "followupDialogueOutline": "서아가 쓰임을 먼저 설명한다 행동을 실행한다. 도공의 반응: 서아가 외형만 보던 태도를 고치고 생활을 이해한다. 상대의 답을 듣고 현재 갈등인 “모든 가야 토기를 한 모양으로 만들라는 주문의 처리 결과를 확인한다.",
        "relationshipEffect": "서아가 외형만 보던 태도를 고치고 생활을 이해한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C15-S03-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "모든 가야 토기를 한 모양으로 만들라는 주문",
      "turn": "서아가 고령·김해·함안의 지역차를 묻는다. 도공은 자신들의 무늬를 지워야만 팔 수 있느냐고 되묻는다. 가야토기와 일본 스에키의 기술 교류를 살피되 단순한 일방 전파로 단정하지 않는다.",
      "end": "후기 연맹의 성장·외교·문화 계승을 멸망과 별도로 기억; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고분·토기·갑옷·가야금",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y4"
    ],
    "nextSceneId": "THR-C15-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “5~6세기 / 토기 가마”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C15-S04",
    "chapterId": "THR-C15",
    "sceneTitle": "무덤 밖의 침묵",
    "historicalYear": "5~6세기",
    "location": "지산동 고분군 관련 관찰 공간",
    "historicalEventId": "H-Y4",
    "characters": [
      "서아",
      "장례 장인"
    ],
    "backgroundAsset": "BG-dc44c42893",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C15-88403d9",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 부장품과 순장의 존재를 확인하고 희생을 충성의 아름다움으로 만들지 않는다.",
    "storyObjective": "서아는 부장품과 순장의 존재를 확인하고 희생을 충성의 아름다움으로 만들지 않는다.",
    "conflict": "큰 무덤의 권위를 칭찬하는 말이 순장 피해를 가린다",
    "dialogueOutline": "서아는 부장품과 순장의 존재를 확인하고 희생을 충성의 아름다움으로 만들지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "큰 무덤의 권위를 칭찬하는 말이 순장 피해를 가린다",
      "turn": "서아는 부장품과 순장의 존재를 확인하고 희생을 충성의 아름다움으로 만들지 않는다.",
      "end": "후기 연맹의 성장·외교·문화 계승을 멸망과 별도로 기억; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고분·토기·갑옷·가야금",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y4"
    ],
    "nextSceneId": "THR-C15-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “5~6세기 / 지산동 고분군 관련 관찰 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C15-S05",
    "chapterId": "THR-C15",
    "sceneTitle": "열두 줄을 지키다",
    "historicalYear": "6세기",
    "location": "악기 공방",
    "historicalEventId": "H-Y4",
    "characters": [
      "서아",
      "우륵"
    ],
    "backgroundAsset": "BG-572d58e609",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C15-3124441",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "우륵은 가실왕과 가야금 전승을 말한다",
    "storyObjective": "우륵은 가실왕과 가야금 전승을 말한다. 서아는 특정 제작년도를 꾸며내지 않고 음악의 전승이 정치체의 운명과 다를 수 있음을 듣는다.",
    "conflict": "나라를 떠나면 음악도 배신이 되는가",
    "dialogueOutline": "우륵은 가실왕과 가야금 전승을 말한다. 서아는 특정 제작년도를 꾸며내지 않고 음악의 전승이 정치체의 운명과 다를 수 있음을 듣는다.",
    "choices": [
      {
        "choiceId": "THR-C15-S05-B1",
        "label": "악기 운반을 돕는다",
        "action": "악기 운반을 돕는다",
        "npcReaction": "우륵이 두려움을 드러내며 새 연주를 맡긴다",
        "followupDialogueOutline": "서아가 악기 운반을 돕는다 행동을 실행한다. 우륵의 반응: 우륵이 두려움을 드러내며 새 연주를 맡긴다. 상대의 답을 듣고 현재 갈등인 “나라를 떠나면 음악도 배신이 되는가의 처리 결과를 확인한다.",
        "relationshipEffect": "우륵이 두려움을 드러내며 새 연주를 맡긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C15-S05-JOIN"
      },
      {
        "choiceId": "THR-C15-S05-B2",
        "label": "제자들의 기억을 적는다",
        "action": "제자들의 기억을 적는다",
        "npcReaction": "누가 무엇을 배웠는지가 남아 문화 계승이 구체화된다",
        "followupDialogueOutline": "서아가 제자들의 기억을 적는다 행동을 실행한다. 우륵의 반응: 누가 무엇을 배웠는지가 남아 문화 계승이 구체화된다. 상대의 답을 듣고 현재 갈등인 “나라를 떠나면 음악도 배신이 되는가의 처리 결과를 확인한다.",
        "relationshipEffect": "누가 무엇을 배웠는지가 남아 문화 계승이 구체화된다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C15-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "나라를 떠나면 음악도 배신이 되는가",
      "turn": "우륵은 가실왕과 가야금 전승을 말한다. 서아는 특정 제작년도를 꾸며내지 않고 음악의 전승이 정치체의 운명과 다를 수 있음을 듣는다.",
      "end": "후기 연맹의 성장·외교·문화 계승을 멸망과 별도로 기억; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고분·토기·갑옷·가야금",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y4"
    ],
    "nextSceneId": "THR-C15-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “6세기 / 악기 공방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C15-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C15-S06",
    "chapterId": "THR-C15",
    "sceneTitle": "532년의 다른 길",
    "historicalYear": "532년 기록 재방문",
    "location": "금관가야 항복 기록 공간",
    "historicalEventId": "H-S7",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-52406b6c96",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C15-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 30년의 간격과 금관가야 왕족의 신라 편입을 도식화한다",
    "storyObjective": "서아는 30년의 간격과 금관가야 왕족의 신라 편입을 도식화한다. CH11의 등록 장면을 반복하지 않는다.",
    "conflict": "금관가야 병합과 대가야 멸망을 같은 사건으로 압축한다",
    "dialogueOutline": "서아는 30년의 간격과 금관가야 왕족의 신라 편입을 도식화한다. CH11의 등록 장면을 반복하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "금관가야 병합과 대가야 멸망을 같은 사건으로 압축한다",
      "turn": "서아는 30년의 간격과 금관가야 왕족의 신라 편입을 도식화한다. CH11의 등록 장면을 반복하지 않는다.",
      "end": "후기 연맹의 성장·외교·문화 계승을 멸망과 별도로 기억; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "금관가야 병합",
    "questionIds": [],
    "genealogyLinks": [
      "H-S7"
    ],
    "nextSceneId": "THR-C15-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “532년 기록 재방문 / 금관가야 항복 기록 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C15-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C15-S07",
    "chapterId": "THR-C15",
    "sceneTitle": "성문을 나서는 가족",
    "historicalYear": "562년",
    "location": "대가야 후방 피란길",
    "historicalEventId": "H-Y5",
    "characters": [
      "서아",
      "가야 가족 아라2"
    ],
    "backgroundAsset": "BG-1b051defcf",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C15-e700dc7",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 전투 결과를 바꾸지 않고 피란 준비에 참여한다",
    "storyObjective": "서아는 전투 결과를 바꾸지 않고 피란 준비에 참여한다. 이사부의 대가야 정복과 정치체 소멸을 확인한다.",
    "conflict": "신라군 진격 앞에서 도구와 사람 중 무엇을 먼저 옮길 것인가",
    "dialogueOutline": "서아는 전투 결과를 바꾸지 않고 피란 준비에 참여한다. 이사부의 대가야 정복과 정치체 소멸을 확인한다.",
    "choices": [
      {
        "choiceId": "THR-C15-S07-B1",
        "label": "가족을 먼저 호송한다",
        "action": "가족을 먼저 호송한다",
        "npcReaction": "도구를 잃어도 가족이 함께 남는다",
        "followupDialogueOutline": "서아가 가족을 먼저 호송한다 행동을 실행한다. 가야 가족 아라2의 반응: 도구를 잃어도 가족이 함께 남는다. 상대의 답을 듣고 현재 갈등인 “신라군 진격 앞에서 도구와 사람 중 무엇을 먼저 옮길 것인가의 처리 결과를 확인한다.",
        "relationshipEffect": "도구를 잃어도 가족이 함께 남는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C15-S07-JOIN"
      },
      {
        "choiceId": "THR-C15-S07-B2",
        "label": "이웃과 짐을 나눈다",
        "action": "이웃과 짐을 나눈다",
        "npcReaction": "이동은 느리지만 생계 도구를 일부 보존한다",
        "followupDialogueOutline": "서아가 이웃과 짐을 나눈다 행동을 실행한다. 가야 가족 아라2의 반응: 이동은 느리지만 생계 도구를 일부 보존한다. 상대의 답을 듣고 현재 갈등인 “신라군 진격 앞에서 도구와 사람 중 무엇을 먼저 옮길 것인가의 처리 결과를 확인한다.",
        "relationshipEffect": "이동은 느리지만 생계 도구를 일부 보존한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C15-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "신라군 진격 앞에서 도구와 사람 중 무엇을 먼저 옮길 것인가",
      "turn": "서아는 전투 결과를 바꾸지 않고 피란 준비에 참여한다. 이사부의 대가야 정복과 정치체 소멸을 확인한다.",
      "end": "후기 연맹의 성장·외교·문화 계승을 멸망과 별도로 기억; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대가야 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y5"
    ],
    "nextSceneId": "THR-C15-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “562년 / 대가야 후방 피란길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C15-S08",
    "chapterId": "THR-C15",
    "sceneTitle": "정복 뒤에도 울리는 줄",
    "historicalYear": "562년→681년",
    "location": "가야 음악의 전승·시간 전환",
    "historicalEventId": "H-Y4",
    "characters": [
      "서아",
      "아라2의 기록"
    ],
    "backgroundAsset": "BG-d25b4aa214",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C15-bdd151f",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 가야계 인물과 기술·음악의 계승을 적는다",
    "storyObjective": "서아는 가야계 인물과 기술·음악의 계승을 적는다. 통일신라 통합 정책을 보기 위해 681년으로 이동한다.",
    "conflict": "멸망을 문화와 사람의 완전한 단절로 쓰고 싶은 절망",
    "dialogueOutline": "서아는 가야계 인물과 기술·음악의 계승을 적는다. 통일신라 통합 정책을 보기 위해 681년으로 이동한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "멸망을 문화와 사람의 완전한 단절로 쓰고 싶은 절망",
      "turn": "서아는 가야계 인물과 기술·음악의 계승을 적는다. 통일신라 통합 정책을 보기 위해 681년으로 이동한다.",
      "end": "후기 연맹의 성장·외교·문화 계승을 멸망과 별도로 기억; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고분·토기·갑옷·가야금",
    "questionIds": [],
    "genealogyLinks": [
      "H-Y4"
    ],
    "nextSceneId": "THR-C16-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “562년→681년 / 가야 음악의 전승·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C15-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.16 하나의 나라와 다른 삶

```json
[
  {
    "sceneId": "THR-C16-S01",
    "chapterId": "THR-C16",
    "sceneTitle": "혼례 뒤의 반란",
    "historicalYear": "681년",
    "location": "서라벌 거리",
    "historicalEventId": "H-U1",
    "characters": [
      "서아",
      "왕실 연락관"
    ],
    "backgroundAsset": "BG-3305d37b92",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-8b23c6c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 김흠돌의 난과 신문왕의 대응을 듣고 귀족 숙청과 왕권 강화를 연결한다.",
    "storyObjective": "서아가 김흠돌의 난과 신문왕의 대응을 듣고 귀족 숙청과 왕권 강화를 연결한다.",
    "conflict": "경사 뒤 반란 소식에 주민이 누구를 믿을지 모른다",
    "dialogueOutline": "서아가 김흠돌의 난과 신문왕의 대응을 듣고 귀족 숙청과 왕권 강화를 연결한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "경사 뒤 반란 소식에 주민이 누구를 믿을지 모른다",
      "turn": "서아가 김흠돌의 난과 신문왕의 대응을 듣고 귀족 숙청과 왕권 강화를 연결한다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "김흠돌의 난 진압",
    "questionIds": [],
    "genealogyLinks": [
      "H-U1"
    ],
    "nextSceneId": "THR-C16-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “681년 / 서라벌 거리”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C16-S02",
    "chapterId": "THR-C16",
    "sceneTitle": "왕의 새 장부",
    "historicalYear": "681년 이후",
    "location": "신문왕 집무처",
    "historicalEventId": "H-U1",
    "characters": [
      "서아",
      "신문왕"
    ],
    "backgroundAsset": "BG-294bf51030",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-51a9148",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "왕은 귀족의 독자 권력을 줄이겠다고 말한다",
    "storyObjective": "왕은 귀족의 독자 권력을 줄이겠다고 말한다. 서아는 국가 통합과 개인의 권리를 같은 말로 쓰지 않는다.",
    "conflict": "왕권 강화가 곧 모든 사람의 자유라는 기대",
    "dialogueOutline": "왕은 귀족의 독자 권력을 줄이겠다고 말한다. 서아는 국가 통합과 개인의 권리를 같은 말로 쓰지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "왕권 강화가 곧 모든 사람의 자유라는 기대",
      "turn": "왕은 귀족의 독자 권력을 줄이겠다고 말한다. 서아는 국가 통합과 개인의 권리를 같은 말로 쓰지 않는다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "김흠돌의 난 진압",
    "questionIds": [],
    "genealogyLinks": [
      "H-U1"
    ],
    "nextSceneId": "THR-C16-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “681년 이후 / 신문왕 집무처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C16-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C16-S03",
    "chapterId": "THR-C16",
    "sceneTitle": "국학의 자리",
    "historicalYear": "682년",
    "location": "국학",
    "historicalEventId": "H-U2",
    "characters": [
      "서아",
      "학생 수인"
    ],
    "backgroundAsset": "BG-cfc61f913c",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-33994b9",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "수인이 글 해석을 부탁하고 서아는 현대 지식을 정답처럼 주입하지 않고 자료를 함께 읽는다.",
    "storyObjective": "수인이 글 해석을 부탁하고 서아는 현대 지식을 정답처럼 주입하지 않고 자료를 함께 읽는다.",
    "conflict": "가문의 지위와 실제 학업 성취가 충돌한다",
    "dialogueOutline": "수인이 글 해석을 부탁하고 서아는 현대 지식을 정답처럼 주입하지 않고 자료를 함께 읽는다.",
    "choices": [
      {
        "choiceId": "THR-C16-S03-B1",
        "label": "함께 문장을 읽는다",
        "action": "함께 문장을 읽는다",
        "npcReaction": "수인이 실수를 인정하고 질문한다",
        "followupDialogueOutline": "서아가 함께 문장을 읽는다 행동을 실행한다. 학생 수인의 반응: 수인이 실수를 인정하고 질문한다. 상대의 답을 듣고 현재 갈등인 “가문의 지위와 실제 학업 성취가 충돌한다의 처리 결과를 확인한다.",
        "relationshipEffect": "수인이 실수를 인정하고 질문한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C16-S03-JOIN"
      },
      {
        "choiceId": "THR-C16-S03-B2",
        "label": "모르는 부분을 인정한다",
        "action": "모르는 부분을 인정한다",
        "npcReaction": "교관이 답을 확인하는 태도를 평가하고 수인이 안도한다",
        "followupDialogueOutline": "서아가 모르는 부분을 인정한다 행동을 실행한다. 학생 수인의 반응: 교관이 답을 확인하는 태도를 평가하고 수인이 안도한다. 상대의 답을 듣고 현재 갈등인 “가문의 지위와 실제 학업 성취가 충돌한다의 처리 결과를 확인한다.",
        "relationshipEffect": "교관이 답을 확인하는 태도를 평가하고 수인이 안도한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C16-S03-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "가문의 지위와 실제 학업 성취가 충돌한다",
      "turn": "수인이 글 해석을 부탁하고 서아는 현대 지식을 정답처럼 주입하지 않고 자료를 함께 읽는다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "국학 설치",
    "questionIds": [],
    "genealogyLinks": [
      "H-U2"
    ],
    "nextSceneId": "THR-C16-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “682년 / 국학”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C16-S04",
    "chapterId": "THR-C16",
    "sceneTitle": "아홉 주의 이름",
    "historicalYear": "685년",
    "location": "지방 행정실",
    "historicalEventId": "H-U3",
    "characters": [
      "서아",
      "지방 서리"
    ],
    "backgroundAsset": "BG-8a5466f52a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-70cb29c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 9주 지도를 대조하고 중앙에서 임명한 지방관의 역할을 듣는다.",
    "storyObjective": "서아가 9주 지도를 대조하고 중앙에서 임명한 지방관의 역할을 듣는다.",
    "conflict": "새 행정구역이 옛 고향 이름과 맞지 않아 문서가 반려된다",
    "dialogueOutline": "서아가 9주 지도를 대조하고 중앙에서 임명한 지방관의 역할을 듣는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "새 행정구역이 옛 고향 이름과 맞지 않아 문서가 반려된다",
      "turn": "서아가 9주 지도를 대조하고 중앙에서 임명한 지방관의 역할을 듣는다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "9주5소경 정비·9서당10정",
    "questionIds": [],
    "genealogyLinks": [
      "H-U3"
    ],
    "nextSceneId": "THR-C16-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “685년 / 지방 행정실”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C16-S05",
    "chapterId": "THR-C16",
    "sceneTitle": "다섯 작은 수도",
    "historicalYear": "685년",
    "location": "소경 이주 거점",
    "historicalEventId": "H-U3",
    "characters": [
      "서아",
      "이주민 온유"
    ],
    "backgroundAsset": "BG-272a558ddc",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-bb2abd3",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 수도의 치우침 보완과 지방 통합이라는 목적을 듣고 온유에게 새 이웃을 소개한다.",
    "storyObjective": "서아가 수도의 치우침 보완과 지방 통합이라는 목적을 듣고 온유에게 새 이웃을 소개한다.",
    "conflict": "소경 설치의 행정 목적과 강제 이주 감정이 충돌한다",
    "dialogueOutline": "서아가 수도의 치우침 보완과 지방 통합이라는 목적을 듣고 온유에게 새 이웃을 소개한다.",
    "choices": [
      {
        "choiceId": "THR-C16-S05-B1",
        "label": "생활 안내를 돕는다",
        "action": "생활 안내를 돕는다",
        "npcReaction": "온유가 행정 표어보다 사람의 도움을 기억한다",
        "followupDialogueOutline": "서아가 생활 안내를 돕는다 행동을 실행한다. 이주민 온유의 반응: 온유가 행정 표어보다 사람의 도움을 기억한다. 상대의 답을 듣고 현재 갈등인 “소경 설치의 행정 목적과 강제 이주 감정이 충돌한다의 처리 결과를 확인한다.",
        "relationshipEffect": "온유가 행정 표어보다 사람의 도움을 기억한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C16-S05-JOIN"
      },
      {
        "choiceId": "THR-C16-S05-B2",
        "label": "떠난 고향을 기록한다",
        "action": "떠난 고향을 기록한다",
        "npcReaction": "온유가 상실을 인정받고 정착을 준비한다",
        "followupDialogueOutline": "서아가 떠난 고향을 기록한다 행동을 실행한다. 이주민 온유의 반응: 온유가 상실을 인정받고 정착을 준비한다. 상대의 답을 듣고 현재 갈등인 “소경 설치의 행정 목적과 강제 이주 감정이 충돌한다의 처리 결과를 확인한다.",
        "relationshipEffect": "온유가 상실을 인정받고 정착을 준비한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C16-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "소경 설치의 행정 목적과 강제 이주 감정이 충돌한다",
      "turn": "서아가 수도의 치우침 보완과 지방 통합이라는 목적을 듣고 온유에게 새 이웃을 소개한다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "9주5소경 정비·9서당10정",
    "questionIds": [],
    "genealogyLinks": [
      "H-U3"
    ],
    "nextSceneId": "THR-C16-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “685년 / 소경 이주 거점”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C16-S06",
    "chapterId": "THR-C16",
    "sceneTitle": "함께 선 다른 군복",
    "historicalYear": "7세기 말",
    "location": "9서당 편성 거점",
    "historicalEventId": "H-U3",
    "characters": [
      "서아",
      "가야계·고구려계 군인"
    ],
    "backgroundAsset": "BG-05fdf9587d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-fe06027",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 9서당의 여러 집단 편입과 10정의 지방 조직을 구분한다",
    "storyObjective": "서아가 9서당의 여러 집단 편입과 10정의 지방 조직을 구분한다. 포섭 정책이 차별을 즉시 없애지는 않는다고 남긴다.",
    "conflict": "서로의 출신 때문에 같은 편을 믿지 못한다",
    "dialogueOutline": "서아가 9서당의 여러 집단 편입과 10정의 지방 조직을 구분한다. 포섭 정책이 차별을 즉시 없애지는 않는다고 남긴다.",
    "choices": [],
    "emotionalBeat": {
      "start": "서로의 출신 때문에 같은 편을 믿지 못한다",
      "turn": "서아가 9서당의 여러 집단 편입과 10정의 지방 조직을 구분한다. 포섭 정책이 차별을 즉시 없애지는 않는다고 남긴다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "9주5소경 정비·9서당10정",
    "questionIds": [],
    "genealogyLinks": [
      "H-U3"
    ],
    "nextSceneId": "THR-C16-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “7세기 말 / 9서당 편성 거점”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C16-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C16-S07",
    "chapterId": "THR-C16",
    "sceneTitle": "관료전의 경계",
    "historicalYear": "687년",
    "location": "토지 장부실",
    "historicalEventId": "H-U4",
    "characters": [
      "서아",
      "관리·농민"
    ],
    "backgroundAsset": "BG-17d13c3249",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-b917d33",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 관료전의 성격을 확인하고 누가 무엇을 받는지 표로 나눈다.",
    "storyObjective": "서아가 관료전의 성격을 확인하고 누가 무엇을 받는지 표로 나눈다.",
    "conflict": "관리 보수의 토지를 농민의 완전한 소유로 오해한다",
    "dialogueOutline": "서아가 관료전의 성격을 확인하고 누가 무엇을 받는지 표로 나눈다.",
    "choices": [],
    "emotionalBeat": {
      "start": "관리 보수의 토지를 농민의 완전한 소유로 오해한다",
      "turn": "서아가 관료전의 성격을 확인하고 누가 무엇을 받는지 표로 나눈다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "관료전 지급·녹읍 폐지",
    "questionIds": [],
    "genealogyLinks": [
      "H-U4"
    ],
    "nextSceneId": "THR-C16-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “687년 / 토지 장부실”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C16-S08",
    "chapterId": "THR-C16",
    "sceneTitle": "사라진 녹읍의 주인",
    "historicalYear": "689년",
    "location": "녹읍 장부 이관처",
    "historicalEventId": "H-U4",
    "characters": [
      "서아",
      "귀족 대리인"
    ],
    "backgroundAsset": "BG-a2bd04fd89",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-53f294b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 녹읍 폐지와 관료전 지급의 연도를 구별한다",
    "storyObjective": "서아가 녹읍 폐지와 관료전 지급의 연도를 구별한다. 대리인에게 사사로운 보복 대신 문서로 권리를 다투게 한다.",
    "conflict": "권익을 잃은 귀족과 부담 변화를 기대하는 농민",
    "dialogueOutline": "서아가 녹읍 폐지와 관료전 지급의 연도를 구별한다. 대리인에게 사사로운 보복 대신 문서로 권리를 다투게 한다.",
    "choices": [
      {
        "choiceId": "THR-C16-S08-B1",
        "label": "농민 증언을 듣는다",
        "action": "농민 증언을 듣는다",
        "npcReaction": "귀족이 반발하지만 수취 관계가 드러난다",
        "followupDialogueOutline": "서아가 농민 증언을 듣는다 행동을 실행한다. 귀족 대리인의 반응: 귀족이 반발하지만 수취 관계가 드러난다. 상대의 답을 듣고 현재 갈등인 “권익을 잃은 귀족과 부담 변화를 기대하는 농민의 처리 결과를 확인한다.",
        "relationshipEffect": "귀족이 반발하지만 수취 관계가 드러난다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C16-S08-JOIN"
      },
      {
        "choiceId": "THR-C16-S08-B2",
        "label": "장부 이관을 돕는다",
        "action": "장부 이관을 돕는다",
        "npcReaction": "갈등을 낮추되 누락된 부담은 따로 확인한다",
        "followupDialogueOutline": "서아가 장부 이관을 돕는다 행동을 실행한다. 귀족 대리인의 반응: 갈등을 낮추되 누락된 부담은 따로 확인한다. 상대의 답을 듣고 현재 갈등인 “권익을 잃은 귀족과 부담 변화를 기대하는 농민의 처리 결과를 확인한다.",
        "relationshipEffect": "갈등을 낮추되 누락된 부담은 따로 확인한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C16-S08-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "권익을 잃은 귀족과 부담 변화를 기대하는 농민",
      "turn": "서아가 녹읍 폐지와 관료전 지급의 연도를 구별한다. 대리인에게 사사로운 보복 대신 문서로 권리를 다투게 한다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "관료전 지급·녹읍 폐지",
    "questionIds": [],
    "genealogyLinks": [
      "H-U4"
    ],
    "nextSceneId": "THR-C16-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “689년 / 녹읍 장부 이관처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C16-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C16-S09",
    "chapterId": "THR-C16",
    "sceneTitle": "정전의 한 줄",
    "historicalYear": "722년",
    "location": "성덕왕대 농촌",
    "historicalEventId": "H-U5",
    "characters": [
      "서아",
      "농민 온유의 후손"
    ],
    "backgroundAsset": "BG-192a348bed",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-199b982",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 사료의 짧은 기록과 해석 한계를 설명받고 경작·수취 관계를 주민에게 묻는다.",
    "storyObjective": "서아는 사료의 짧은 기록과 해석 한계를 설명받고 경작·수취 관계를 주민에게 묻는다.",
    "conflict": "정전 지급을 모든 농민에게 새 땅을 나눈 일로 믿는다",
    "dialogueOutline": "서아는 사료의 짧은 기록과 해석 한계를 설명받고 경작·수취 관계를 주민에게 묻는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "정전 지급을 모든 농민에게 새 땅을 나눈 일로 믿는다",
      "turn": "서아는 사료의 짧은 기록과 해석 한계를 설명받고 경작·수취 관계를 주민에게 묻는다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "정전 지급",
    "questionIds": [],
    "genealogyLinks": [
      "H-U5"
    ],
    "nextSceneId": "THR-C16-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “722년 / 성덕왕대 농촌”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C16-S10",
    "chapterId": "THR-C16",
    "sceneTitle": "다시 돌아온 녹읍",
    "historicalYear": "757~759년",
    "location": "경덕왕대 관청·시간 전환",
    "historicalEventId": "H-U6",
    "characters": [
      "서아",
      "지방 서리"
    ],
    "backgroundAsset": "BG-bbeeadc2b7",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C16-70cb29c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 757년 녹읍 부활·지명 개편과 관직명 한식화를 구분한다",
    "storyObjective": "서아가 757년 녹읍 부활·지명 개편과 관직명 한식화를 구분한다. 정책 변화가 뒤의 사회 갈등으로 이어지는 질문을 남긴다.",
    "conflict": "폐지와 부활을 같은 왕의 정책이라 혼동한다",
    "dialogueOutline": "서아가 757년 녹읍 부활·지명 개편과 관직명 한식화를 구분한다. 정책 변화가 뒤의 사회 갈등으로 이어지는 질문을 남긴다.",
    "choices": [],
    "emotionalBeat": {
      "start": "폐지와 부활을 같은 왕의 정책이라 혼동한다",
      "turn": "서아가 757년 녹읍 부활·지명 개편과 관직명 한식화를 구분한다. 정책 변화가 뒤의 사회 갈등으로 이어지는 질문을 남긴다.",
      "end": "제도 통합의 성과와 새 규칙이 만드는 손실을 동시 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "녹읍 부활·지명과 관직명 한식화",
    "questionIds": [],
    "genealogyLinks": [
      "H-U6"
    ],
    "nextSceneId": "THR-C17-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “757~759년 / 경덕왕대 관청·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C16-S10-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.17 사람을 향한 불빛

```json
[
  {
    "sceneId": "THR-C17-S01",
    "chapterId": "THR-C17",
    "sceneTitle": "누구의 경전이 옳은가",
    "historicalYear": "7세기 후반",
    "location": "마을 설법터",
    "historicalEventId": "H-U7",
    "characters": [
      "서아",
      "원효"
    ],
    "backgroundAsset": "BG-98b800a9e0",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-40bd5a8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "원효는 상대를 이기려는 말부터 내려놓으라고 한다",
    "storyObjective": "원효는 상대를 이기려는 말부터 내려놓으라고 한다. 서아가 논쟁의 공통 관심을 찾아 화쟁의 뜻을 생활 갈등과 연결한다.",
    "conflict": "서로 다른 교설을 믿는 이웃이 공동 식사를 거절한다",
    "dialogueOutline": "원효는 상대를 이기려는 말부터 내려놓으라고 한다. 서아가 논쟁의 공통 관심을 찾아 화쟁의 뜻을 생활 갈등과 연결한다.",
    "choices": [
      {
        "choiceId": "THR-C17-S01-B1",
        "label": "각자의 걱정을 듣는다",
        "action": "각자의 걱정을 듣는다",
        "npcReaction": "이웃이 교설보다 가족의 평안을 바랐음을 말한다",
        "followupDialogueOutline": "서아가 각자의 걱정을 듣는다 행동을 실행한다. 원효의 반응: 이웃이 교설보다 가족의 평안을 바랐음을 말한다. 상대의 답을 듣고 현재 갈등인 “서로 다른 교설을 믿는 이웃이 공동 식사를 거절한다의 처리 결과를 확인한다.",
        "relationshipEffect": "이웃이 교설보다 가족의 평안을 바랐음을 말한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C17-S01-JOIN"
      },
      {
        "choiceId": "THR-C17-S01-B2",
        "label": "식사 준비를 함께 한다",
        "action": "식사 준비를 함께 한다",
        "npcReaction": "말싸움이 멎고 대화할 자리가 생긴다",
        "followupDialogueOutline": "서아가 식사 준비를 함께 한다 행동을 실행한다. 원효의 반응: 말싸움이 멎고 대화할 자리가 생긴다. 상대의 답을 듣고 현재 갈등인 “서로 다른 교설을 믿는 이웃이 공동 식사를 거절한다의 처리 결과를 확인한다.",
        "relationshipEffect": "말싸움이 멎고 대화할 자리가 생긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C17-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "서로 다른 교설을 믿는 이웃이 공동 식사를 거절한다",
      "turn": "원효는 상대를 이기려는 말부터 내려놓으라고 한다. 서아가 논쟁의 공통 관심을 찾아 화쟁의 뜻을 생활 갈등과 연결한다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "일심·화쟁·아미타 신앙",
    "questionIds": [],
    "genealogyLinks": [
      "H-U7"
    ],
    "nextSceneId": "THR-C17-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “7세기 후반 / 마을 설법터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C17-S02",
    "chapterId": "THR-C17",
    "sceneTitle": "모두를 위한 노래",
    "historicalYear": "7세기 후반",
    "location": "신라 마을",
    "historicalEventId": "H-U7",
    "characters": [
      "서아",
      "원효·마을 주민"
    ],
    "backgroundAsset": "BG-1feff7d7bf",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-e5212f2",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 알아들을 수 있는 말로 질문하고 원효는 아미타 신앙·불교 대중화의 뜻을 전달한다",
    "storyObjective": "서아가 알아들을 수 있는 말로 질문하고 원효는 아미타 신앙·불교 대중화의 뜻을 전달한다. 기적을 구휼의 대체물로 쓰지 않는다.",
    "conflict": "글을 모르는 주민이 불교는 자신과 무관하다고 느낀다",
    "dialogueOutline": "서아가 알아들을 수 있는 말로 질문하고 원효는 아미타 신앙·불교 대중화의 뜻을 전달한다. 기적을 구휼의 대체물로 쓰지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "글을 모르는 주민이 불교는 자신과 무관하다고 느낀다",
      "turn": "서아가 알아들을 수 있는 말로 질문하고 원효는 아미타 신앙·불교 대중화의 뜻을 전달한다. 기적을 구휼의 대체물로 쓰지 않는다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "일심·화쟁·아미타 신앙",
    "questionIds": [
      "official-61-advanced-05"
    ],
    "genealogyLinks": [
      "H-U7"
    ],
    "nextSceneId": "THR-C17-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “7세기 후반 / 신라 마을”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C17-S02-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C17-S03",
    "chapterId": "THR-C17",
    "sceneTitle": "하나로 이어진 잎",
    "historicalYear": "676년 이후",
    "location": "부석사 관련 현장",
    "historicalEventId": "H-U8",
    "characters": [
      "서아",
      "의상·제자"
    ],
    "backgroundAsset": "BG-31f04e3a92",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-3cfe280",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "의상이 서로 의존하는 관계로 화엄을 설명한다",
    "storyObjective": "의상이 서로 의존하는 관계로 화엄을 설명한다. 서아는 원효의 화쟁과 의상의 화엄을 같은 이름으로 적지 않는다.",
    "conflict": "제자가 다른 사람의 몫을 사소하다고 여긴다",
    "dialogueOutline": "의상이 서로 의존하는 관계로 화엄을 설명한다. 서아는 원효의 화쟁과 의상의 화엄을 같은 이름으로 적지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "제자가 다른 사람의 몫을 사소하다고 여긴다",
      "turn": "의상이 서로 의존하는 관계로 화엄을 설명한다. 서아는 원효의 화쟁과 의상의 화엄을 같은 이름으로 적지 않는다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "화엄 사상",
    "questionIds": [],
    "genealogyLinks": [
      "H-U8"
    ],
    "nextSceneId": "THR-C17-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “676년 이후 / 부석사 관련 현장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C17-S04",
    "chapterId": "THR-C17",
    "sceneTitle": "돌을 옮기는 어깨",
    "historicalYear": "751년",
    "location": "불국사 조성 현장",
    "historicalEventId": "H-U9",
    "characters": [
      "서아",
      "석공 해명"
    ],
    "backgroundAsset": "BG-f6f267cfe1",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-9b221c2",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 해명의 작업을 멈추게 하고 김대성의 후원·공사 규모를 기록한다.",
    "storyObjective": "서아가 해명의 작업을 멈추게 하고 김대성의 후원·공사 규모를 기록한다.",
    "conflict": "찬란한 건축의 이야기에서 인부의 부상이 지워진다",
    "dialogueOutline": "서아가 해명의 작업을 멈추게 하고 김대성의 후원·공사 규모를 기록한다.",
    "choices": [
      {
        "choiceId": "THR-C17-S04-B1",
        "label": "부상자를 먼저 돌본다",
        "action": "부상자를 먼저 돌본다",
        "npcReaction": "공사가 늦어져도 동료가 안전을 지지한다",
        "followupDialogueOutline": "서아가 부상자를 먼저 돌본다 행동을 실행한다. 석공 해명의 반응: 공사가 늦어져도 동료가 안전을 지지한다. 상대의 답을 듣고 현재 갈등인 “찬란한 건축의 이야기에서 인부의 부상이 지워진다의 처리 결과를 확인한다.",
        "relationshipEffect": "공사가 늦어져도 동료가 안전을 지지한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C17-S04-JOIN"
      },
      {
        "choiceId": "THR-C17-S04-B2",
        "label": "작업 순서를 조정한다",
        "action": "작업 순서를 조정한다",
        "npcReaction": "해명이 기술자의 제안을 인정받고 무리한 작업을 줄인다",
        "followupDialogueOutline": "서아가 작업 순서를 조정한다 행동을 실행한다. 석공 해명의 반응: 해명이 기술자의 제안을 인정받고 무리한 작업을 줄인다. 상대의 답을 듣고 현재 갈등인 “찬란한 건축의 이야기에서 인부의 부상이 지워진다의 처리 결과를 확인한다.",
        "relationshipEffect": "해명이 기술자의 제안을 인정받고 무리한 작업을 줄인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C17-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "찬란한 건축의 이야기에서 인부의 부상이 지워진다",
      "turn": "서아가 해명의 작업을 멈추게 하고 김대성의 후원·공사 규모를 기록한다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "불국사와 석굴암",
    "questionIds": [],
    "genealogyLinks": [
      "H-U9"
    ],
    "nextSceneId": "THR-C17-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “751년 / 불국사 조성 현장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C17-S05",
    "chapterId": "THR-C17",
    "sceneTitle": "두 탑의 다른 그림자",
    "historicalYear": "8세기",
    "location": "불국사 탑 조성 기록",
    "historicalEventId": "H-U9",
    "characters": [
      "서아",
      "석공 해명"
    ],
    "backgroundAsset": "BG-c5ebc2f8a2",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-9b221c2",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 탑의 구조와 상징을 비교한다",
    "storyObjective": "서아가 탑의 구조와 상징을 비교한다. 무구정광대다라니경의 발견은 현대 조사 층위로 따로 표시한다.",
    "conflict": "다보탑과 석가탑의 외형을 같은 양식으로 그린다",
    "dialogueOutline": "서아가 탑의 구조와 상징을 비교한다. 무구정광대다라니경의 발견은 현대 조사 층위로 따로 표시한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "다보탑과 석가탑의 외형을 같은 양식으로 그린다",
      "turn": "서아가 탑의 구조와 상징을 비교한다. 무구정광대다라니경의 발견은 현대 조사 층위로 따로 표시한다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "불국사와 석굴암",
    "questionIds": [],
    "genealogyLinks": [
      "H-U9"
    ],
    "nextSceneId": "THR-C17-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “8세기 / 불국사 탑 조성 기록”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C17-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C17-S06",
    "chapterId": "THR-C17",
    "sceneTitle": "바위 속의 얼굴",
    "historicalYear": "8세기",
    "location": "석굴암 조성 관련 현장",
    "historicalEventId": "H-U9",
    "characters": [
      "서아",
      "조각 장인"
    ],
    "backgroundAsset": "BG-5abe7e00bc",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-f954a2c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "장인이 돌방·본존불·둘레 조각의 관계를 말하고 서아는 현존 사진의 한계를 메모한다",
    "storyObjective": "장인이 돌방·본존불·둘레 조각의 관계를 말하고 서아는 현존 사진의 한계를 메모한다. 서아는 혜초의 여행 기록과 설총의 이두 활용을 별개 사례로 비교하고, 기록자가 자신의 언어를 남기는 어려움을 듣는다.",
    "conflict": "완성된 현재 복원 모습과 창건 당시 모습을 섞는다",
    "dialogueOutline": "장인이 돌방·본존불·둘레 조각의 관계를 말하고 서아는 현존 사진의 한계를 메모한다. 서아는 혜초의 여행 기록과 설총의 이두 활용을 별개 사례로 비교하고, 기록자가 자신의 언어를 남기는 어려움을 듣는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "완성된 현재 복원 모습과 창건 당시 모습을 섞는다",
      "turn": "장인이 돌방·본존불·둘레 조각의 관계를 말하고 서아는 현존 사진의 한계를 메모한다. 서아는 혜초의 여행 기록과 설총의 이두 활용을 별개 사례로 비교하고, 기록자가 자신의 언어를 남기는 어려움을 듣는다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "불국사와 석굴암",
    "questionIds": [],
    "genealogyLinks": [
      "H-U9"
    ],
    "nextSceneId": "THR-C17-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “8세기 / 석굴암 조성 관련 현장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C17-S07",
    "chapterId": "THR-C17",
    "sceneTitle": "돌아오지 않은 여행자",
    "historicalYear": "727년경",
    "location": "당의 여행 기록 공간",
    "historicalEventId": "H-U10",
    "characters": [
      "서아",
      "혜초의 기록·필사자"
    ],
    "backgroundAsset": "BG-c3dc83d281",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-f6169e3",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 당에서 이어진 삶과 왕오천축국전을 읽는다",
    "storyObjective": "서아는 당에서 이어진 삶과 왕오천축국전을 읽는다. 인도·중앙아시아 관찰을 타문화의 우열 평가로 다루지 않는다.",
    "conflict": "혜초를 신라 귀환 환영식에 등장시키려는 초안",
    "dialogueOutline": "서아는 당에서 이어진 삶과 왕오천축국전을 읽는다. 인도·중앙아시아 관찰을 타문화의 우열 평가로 다루지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C17-S07-B1",
        "label": "이동 경로를 복원한다",
        "action": "이동 경로를 복원한다",
        "npcReaction": "필사자가 빠진 지명을 확인하며 기록을 보완한다",
        "followupDialogueOutline": "서아가 이동 경로를 복원한다 행동을 실행한다. 혜초의 기록·필사자의 반응: 필사자가 빠진 지명을 확인하며 기록을 보완한다. 상대의 답을 듣고 현재 갈등인 “혜초를 신라 귀환 환영식에 등장시키려는 초안의 처리 결과를 확인한다.",
        "relationshipEffect": "필사자가 빠진 지명을 확인하며 기록을 보완한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C17-S07-JOIN"
      },
      {
        "choiceId": "THR-C17-S07-B2",
        "label": "사람들의 생활을 비교한다",
        "action": "사람들의 생활을 비교한다",
        "npcReaction": "서아의 낯섦이 호기심과 존중으로 바뀐다",
        "followupDialogueOutline": "서아가 사람들의 생활을 비교한다 행동을 실행한다. 혜초의 기록·필사자의 반응: 서아의 낯섦이 호기심과 존중으로 바뀐다. 상대의 답을 듣고 현재 갈등인 “혜초를 신라 귀환 환영식에 등장시키려는 초안의 처리 결과를 확인한다.",
        "relationshipEffect": "서아의 낯섦이 호기심과 존중으로 바뀐다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C17-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "혜초를 신라 귀환 환영식에 등장시키려는 초안",
      "turn": "서아는 당에서 이어진 삶과 왕오천축국전을 읽는다. 인도·중앙아시아 관찰을 타문화의 우열 평가로 다루지 않는다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "왕오천축국전과 구법 여행",
    "questionIds": [],
    "genealogyLinks": [
      "H-U10"
    ],
    "nextSceneId": "THR-C17-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “727년경 / 당의 여행 기록 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C17-S07-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C17-S08",
    "chapterId": "THR-C17",
    "sceneTitle": "종소리에 남은 노동",
    "historicalYear": "771년 관련 기록",
    "location": "성덕대왕신종 관찰 공간",
    "historicalEventId": "H-U9",
    "characters": [
      "서아",
      "주조 장인 기록"
    ],
    "backgroundAsset": "BG-83a4396b28",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-8376e93",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 성덕대왕신종의 제작·완성과 전설을 구별한다",
    "storyObjective": "서아는 성덕대왕신종의 제작·완성과 전설을 구별한다. 주조 기술과 후원·노동을 학습한다. 석가탑의 무구정광대다라니경은 현대 발견과 고대 제작을 구별하여 기록 패널로 확인한다.",
    "conflict": "아이를 희생해야 종을 만든다는 전설을 사실로 받아들인다",
    "dialogueOutline": "서아는 성덕대왕신종의 제작·완성과 전설을 구별한다. 주조 기술과 후원·노동을 학습한다. 석가탑의 무구정광대다라니경은 현대 발견과 고대 제작을 구별하여 기록 패널로 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "아이를 희생해야 종을 만든다는 전설을 사실로 받아들인다",
      "turn": "서아는 성덕대왕신종의 제작·완성과 전설을 구별한다. 주조 기술과 후원·노동을 학습한다. 석가탑의 무구정광대다라니경은 현대 발견과 고대 제작을 구별하여 기록 패널로 확인한다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "불국사와 석굴암",
    "questionIds": [],
    "genealogyLinks": [
      "H-U9"
    ],
    "nextSceneId": "THR-C17-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “771년 관련 기록 / 성덕대왕신종 관찰 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C17-S09",
    "chapterId": "THR-C17",
    "sceneTitle": "바다로 이어진 기도",
    "historicalYear": "8세기→828년",
    "location": "사찰의 교류 지도·시간 전환",
    "historicalEventId": "H-U11",
    "characters": [
      "서아",
      "필사자"
    ],
    "backgroundAsset": "BG-be7396c2b8",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C17-00f2fb6",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 상인·항로·사찰의 연결을 확인하고 청해진으로 이동한다",
    "storyObjective": "서아는 상인·항로·사찰의 연결을 확인하고 청해진으로 이동한다. 원효·의상을 9세기 인물로 다시 등장시키지 않는다.",
    "conflict": "불교 교류가 승려의 여행만이라고 생각한다",
    "dialogueOutline": "서아는 상인·항로·사찰의 연결을 확인하고 청해진으로 이동한다. 원효·의상을 9세기 인물로 다시 등장시키지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "불교 교류가 승려의 여행만이라고 생각한다",
      "turn": "서아는 상인·항로·사찰의 연결을 확인하고 청해진으로 이동한다. 원효·의상을 9세기 인물로 다시 등장시키지 않는다.",
      "end": "사상 차이를 말싸움 대신 구체적 돌봄과 제작 현장으로 학습; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "청해진 설치·해상 무역",
    "questionIds": [],
    "genealogyLinks": [
      "H-U11"
    ],
    "nextSceneId": "THR-C18-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “8세기→828년 / 사찰의 교류 지도·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C17-S09-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.18 돌아오는 배의 약속

```json
[
  {
    "sceneId": "THR-C18-S01",
    "chapterId": "THR-C18",
    "sceneTitle": "항구의 사라진 아이",
    "historicalYear": "828년",
    "location": "완도 해안",
    "historicalEventId": "H-U11",
    "characters": [
      "서아",
      "상인 나래"
    ],
    "backgroundAsset": "BG-c4e076266f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C18-bc2a50b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 확인된 이름·항로를 분리하며 장보고가 해적과 인신매매에 대응한 맥락을 듣는다.",
    "storyObjective": "서아가 확인된 이름·항로를 분리하며 장보고가 해적과 인신매매에 대응한 맥락을 듣는다.",
    "conflict": "가족이 팔려 갔다는 소문과 확인되지 않은 목격담",
    "dialogueOutline": "서아가 확인된 이름·항로를 분리하며 장보고가 해적과 인신매매에 대응한 맥락을 듣는다.",
    "choices": [
      {
        "choiceId": "THR-C18-S01-B1",
        "label": "목격 기록을 모은다",
        "action": "목격 기록을 모은다",
        "npcReaction": "나래가 근거 없는 희망 대신 추적할 단서를 얻는다",
        "followupDialogueOutline": "서아가 목격 기록을 모은다 행동을 실행한다. 상인 나래의 반응: 나래가 근거 없는 희망 대신 추적할 단서를 얻는다. 상대의 답을 듣고 현재 갈등인 “가족이 팔려 갔다는 소문과 확인되지 않은 목격담의 처리 결과를 확인한다.",
        "relationshipEffect": "나래가 근거 없는 희망 대신 추적할 단서를 얻는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C18-S01-JOIN"
      },
      {
        "choiceId": "THR-C18-S01-B2",
        "label": "남은 가족을 돕는다",
        "action": "남은 가족을 돕는다",
        "npcReaction": "불안이 가라앉은 뒤 믿을 만한 증언을 확보한다",
        "followupDialogueOutline": "서아가 남은 가족을 돕는다 행동을 실행한다. 상인 나래의 반응: 불안이 가라앉은 뒤 믿을 만한 증언을 확보한다. 상대의 답을 듣고 현재 갈등인 “가족이 팔려 갔다는 소문과 확인되지 않은 목격담의 처리 결과를 확인한다.",
        "relationshipEffect": "불안이 가라앉은 뒤 믿을 만한 증언을 확보한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C18-S01-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "가족이 팔려 갔다는 소문과 확인되지 않은 목격담",
      "turn": "서아가 확인된 이름·항로를 분리하며 장보고가 해적과 인신매매에 대응한 맥락을 듣는다.",
      "end": "해상 무역의 번영과 인신매매·중앙정치의 위험을 하나의 관계로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "청해진 설치·해상 무역",
    "questionIds": [],
    "genealogyLinks": [
      "H-U11"
    ],
    "nextSceneId": "THR-C18-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “828년 / 완도 해안”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C18-S02",
    "chapterId": "THR-C18",
    "sceneTitle": "청해진을 청하다",
    "historicalYear": "828년",
    "location": "신라 조정 관련 기록",
    "historicalEventId": "H-U11",
    "characters": [
      "서아",
      "장보고"
    ],
    "backgroundAsset": "BG-5f0d452ba5",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C18-246eccf",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "장보고가 군사적 보호와 교역의 연결을 말한다",
    "storyObjective": "장보고가 군사적 보호와 교역의 연결을 말한다. 서아는 흥덕왕대 설치와 군사 거점을 확인한다.",
    "conflict": "무역상의 이익과 주민 보호 중 설치 목적이 무엇인가",
    "dialogueOutline": "장보고가 군사적 보호와 교역의 연결을 말한다. 서아는 흥덕왕대 설치와 군사 거점을 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "무역상의 이익과 주민 보호 중 설치 목적이 무엇인가",
      "turn": "장보고가 군사적 보호와 교역의 연결을 말한다. 서아는 흥덕왕대 설치와 군사 거점을 확인한다.",
      "end": "해상 무역의 번영과 인신매매·중앙정치의 위험을 하나의 관계로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "청해진 설치·해상 무역",
    "questionIds": [],
    "genealogyLinks": [
      "H-U11"
    ],
    "nextSceneId": "THR-C18-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “828년 / 신라 조정 관련 기록”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C18-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C18-S03",
    "chapterId": "THR-C18",
    "sceneTitle": "세 나라의 물건",
    "historicalYear": "830년대",
    "location": "청해진 창고",
    "historicalEventId": "H-U11",
    "characters": [
      "서아",
      "통역 상인"
    ],
    "backgroundAsset": "BG-f01744239e",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C18-5c4988c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 당·신라·일본 항로와 물품 표지를 대조한다",
    "storyObjective": "서아가 당·신라·일본 항로와 물품 표지를 대조한다. 신라방·신라원·사찰 등 거점을 지도에 놓는다.",
    "conflict": "물건의 출처를 속이면 이익이 늘지만 신뢰가 깨진다",
    "dialogueOutline": "서아가 당·신라·일본 항로와 물품 표지를 대조한다. 신라방·신라원·사찰 등 거점을 지도에 놓는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "물건의 출처를 속이면 이익이 늘지만 신뢰가 깨진다",
      "turn": "서아가 당·신라·일본 항로와 물품 표지를 대조한다. 신라방·신라원·사찰 등 거점을 지도에 놓는다.",
      "end": "해상 무역의 번영과 인신매매·중앙정치의 위험을 하나의 관계로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "청해진 설치·해상 무역",
    "questionIds": [],
    "genealogyLinks": [
      "H-U11"
    ],
    "nextSceneId": "THR-C18-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “830년대 / 청해진 창고”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C18-S04",
    "chapterId": "THR-C18",
    "sceneTitle": "파도를 기다리는 사람",
    "historicalYear": "830년대",
    "location": "청해진 출항 나루",
    "historicalEventId": "H-U11",
    "characters": [
      "서아",
      "상인 나래"
    ],
    "backgroundAsset": "BG-6f02a1fa14",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C18-bc2a50b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 항해 결정을 역사적 전투 결과와 분리된 생활 선택으로 체험한다.",
    "storyObjective": "서아는 항해 결정을 역사적 전투 결과와 분리된 생활 선택으로 체험한다.",
    "conflict": "손해를 줄이려면 위험한 날에도 출항해야 한다",
    "dialogueOutline": "서아는 항해 결정을 역사적 전투 결과와 분리된 생활 선택으로 체험한다.",
    "choices": [
      {
        "choiceId": "THR-C18-S04-B1",
        "label": "출항을 늦추자고 한다",
        "action": "출항을 늦추자고 한다",
        "npcReaction": "거래 상대가 불평하지만 선원 가족의 신뢰가 높아진다",
        "followupDialogueOutline": "서아가 출항을 늦추자고 한다 행동을 실행한다. 상인 나래의 반응: 거래 상대가 불평하지만 선원 가족의 신뢰가 높아진다. 상대의 답을 듣고 현재 갈등인 “손해를 줄이려면 위험한 날에도 출항해야 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "거래 상대가 불평하지만 선원 가족의 신뢰가 높아진다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C18-S04-JOIN"
      },
      {
        "choiceId": "THR-C18-S04-B2",
        "label": "짐을 줄여 안전을 높인다",
        "action": "짐을 줄여 안전을 높인다",
        "npcReaction": "이익은 줄어도 선장이 안전 절차를 재확인한다",
        "followupDialogueOutline": "서아가 짐을 줄여 안전을 높인다 행동을 실행한다. 상인 나래의 반응: 이익은 줄어도 선장이 안전 절차를 재확인한다. 상대의 답을 듣고 현재 갈등인 “손해를 줄이려면 위험한 날에도 출항해야 한다의 처리 결과를 확인한다.",
        "relationshipEffect": "이익은 줄어도 선장이 안전 절차를 재확인한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C18-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "손해를 줄이려면 위험한 날에도 출항해야 한다",
      "turn": "서아는 항해 결정을 역사적 전투 결과와 분리된 생활 선택으로 체험한다.",
      "end": "해상 무역의 번영과 인신매매·중앙정치의 위험을 하나의 관계로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "청해진 설치·해상 무역",
    "questionIds": [],
    "genealogyLinks": [
      "H-U11"
    ],
    "nextSceneId": "THR-C18-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “830년대 / 청해진 출항 나루”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C18-S05",
    "chapterId": "THR-C18",
    "sceneTitle": "왕실로 간 제안",
    "historicalYear": "9세기 전반",
    "location": "청해진 연락소",
    "historicalEventId": "H-U12",
    "characters": [
      "서아",
      "장보고의 연락관"
    ],
    "backgroundAsset": "BG-949ddf6ca4",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C18-301a1ae",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 장보고의 정치 개입과 혼인 구상 관련 기록을 듣는다",
    "storyObjective": "서아가 장보고의 정치 개입과 혼인 구상 관련 기록을 듣는다. 모든 갈등을 한 귀족의 질투로 단순화하지 않는다.",
    "conflict": "해상 세력의 영향력과 중앙 귀족의 골품 장벽",
    "dialogueOutline": "서아가 장보고의 정치 개입과 혼인 구상 관련 기록을 듣는다. 모든 갈등을 한 귀족의 질투로 단순화하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "해상 세력의 영향력과 중앙 귀족의 골품 장벽",
      "turn": "서아가 장보고의 정치 개입과 혼인 구상 관련 기록을 듣는다. 모든 갈등을 한 귀족의 질투로 단순화하지 않는다.",
      "end": "해상 무역의 번영과 인신매매·중앙정치의 위험을 하나의 관계로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "장보고 암살과 청해진 폐지",
    "questionIds": [],
    "genealogyLinks": [
      "H-U12"
    ],
    "nextSceneId": "THR-C18-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “9세기 전반 / 청해진 연락소”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C18-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C18-S06",
    "chapterId": "THR-C18",
    "sceneTitle": "서로 다른 부고",
    "historicalYear": "841/846년 사료 차이",
    "location": "장보고 사망 기록 공간",
    "historicalEventId": "H-U12",
    "characters": [
      "서아",
      "필사자"
    ],
    "backgroundAsset": "BG-b6a715b08c",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C18-00f2fb6",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "필사자가 국내·일본 기록의 차이를 보여준다",
    "storyObjective": "필사자가 국내·일본 기록의 차이를 보여준다. 서아는 암살을 직접 막는 선택을 만들지 않고 이설을 병기한다.",
    "conflict": "서아가 한 날짜만 골라 확정하려 한다",
    "dialogueOutline": "필사자가 국내·일본 기록의 차이를 보여준다. 서아는 암살을 직접 막는 선택을 만들지 않고 이설을 병기한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "서아가 한 날짜만 골라 확정하려 한다",
      "turn": "필사자가 국내·일본 기록의 차이를 보여준다. 서아는 암살을 직접 막는 선택을 만들지 않고 이설을 병기한다.",
      "end": "해상 무역의 번영과 인신매매·중앙정치의 위험을 하나의 관계로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "장보고 암살과 청해진 폐지",
    "questionIds": [],
    "genealogyLinks": [
      "H-U12"
    ],
    "nextSceneId": "THR-C18-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “841/846년 사료 차이 / 장보고 사망 기록 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C18-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C18-S07",
    "chapterId": "THR-C18",
    "sceneTitle": "닫히는 청해진",
    "historicalYear": "851년",
    "location": "청해진 폐지·이주 출발지",
    "historicalEventId": "H-U12",
    "characters": [
      "서아",
      "나래의 가족"
    ],
    "backgroundAsset": "BG-fa821dc2c5",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C18-9a462c2",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 짐과 가족 연락을 돕는다",
    "storyObjective": "서아가 짐과 가족 연락을 돕는다. 장보고 사망과 청해진 폐지를 같은 해로 압축하지 않는다.",
    "conflict": "주민이 벽골군 이주 명령에 생업을 잃는다",
    "dialogueOutline": "서아가 짐과 가족 연락을 돕는다. 장보고 사망과 청해진 폐지를 같은 해로 압축하지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C18-S07-B1",
        "label": "이주 명부를 확인한다",
        "action": "이주 명부를 확인한다",
        "npcReaction": "가족 누락을 막고 나래가 서아에게 마지막 편지를 맡긴다",
        "followupDialogueOutline": "서아가 이주 명부를 확인한다 행동을 실행한다. 나래의 가족의 반응: 가족 누락을 막고 나래가 서아에게 마지막 편지를 맡긴다. 상대의 답을 듣고 현재 갈등인 “주민이 벽골군 이주 명령에 생업을 잃는다의 처리 결과를 확인한다.",
        "relationshipEffect": "가족 누락을 막고 나래가 서아에게 마지막 편지를 맡긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C18-S07-JOIN"
      },
      {
        "choiceId": "THR-C18-S07-B2",
        "label": "생계 도구를 묶는다",
        "action": "생계 도구를 묶는다",
        "npcReaction": "새 거처에서 일할 수 있다는 작은 희망을 남긴다",
        "followupDialogueOutline": "서아가 생계 도구를 묶는다 행동을 실행한다. 나래의 가족의 반응: 새 거처에서 일할 수 있다는 작은 희망을 남긴다. 상대의 답을 듣고 현재 갈등인 “주민이 벽골군 이주 명령에 생업을 잃는다의 처리 결과를 확인한다.",
        "relationshipEffect": "새 거처에서 일할 수 있다는 작은 희망을 남긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C18-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "주민이 벽골군 이주 명령에 생업을 잃는다",
      "turn": "서아가 짐과 가족 연락을 돕는다. 장보고 사망과 청해진 폐지를 같은 해로 압축하지 않는다.",
      "end": "해상 무역의 번영과 인신매매·중앙정치의 위험을 하나의 관계로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "장보고 암살과 청해진 폐지",
    "questionIds": [
      "official-77-advanced-10"
    ],
    "genealogyLinks": [
      "H-U12"
    ],
    "nextSceneId": "THR-C18-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “851년 / 청해진 폐지·이주 출발지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C18-S07-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C18-S08",
    "chapterId": "THR-C18",
    "sceneTitle": "항로가 남긴 사람",
    "historicalYear": "851년 이후→889년",
    "location": "해상 세력 지도·시간 전환",
    "historicalEventId": "H-U13",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-84cb2f5354",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C18-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 왕건 집안 등 지방 해상 세력으로 연결되는 길을 표시한다",
    "storyObjective": "서아는 왕건 집안 등 지방 해상 세력으로 연결되는 길을 표시한다. 중앙의 힘이 약해진 마을로 이동한다.",
    "conflict": "거점 폐지를 해상 교역 전체의 끝으로 오해한다",
    "dialogueOutline": "서아는 왕건 집안 등 지방 해상 세력으로 연결되는 길을 표시한다. 중앙의 힘이 약해진 마을로 이동한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "거점 폐지를 해상 교역 전체의 끝으로 오해한다",
      "turn": "서아는 왕건 집안 등 지방 해상 세력으로 연결되는 길을 표시한다. 중앙의 힘이 약해진 마을로 이동한다.",
      "end": "해상 무역의 번영과 인신매매·중앙정치의 위험을 하나의 관계로; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "6두품 한계·호족·선종·풍수",
    "questionIds": [],
    "genealogyLinks": [
      "H-U13"
    ],
    "nextSceneId": "THR-C19-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “851년 이후→889년 / 해상 세력 지도·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  }
]
```

## CH.19 왕도에 닿지 않는 목소리

```json
[
  {
    "sceneId": "THR-C19-S01",
    "chapterId": "THR-C19",
    "sceneTitle": "822년의 깃발",
    "historicalYear": "822년 기록 회상",
    "location": "웅천주 관련 거점",
    "historicalEventId": "H-U14",
    "characters": [
      "서아",
      "지방 서리"
    ],
    "backgroundAsset": "BG-4dfce3323d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-70cb29c",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 김헌창의 정치적 배경과 반란 진압을 확인한다",
    "storyObjective": "서아가 김헌창의 정치적 배경과 반란 진압을 확인한다. 889년과의 시간 간격을 지도 옆에 적는다. 원성왕의 788년 독서삼품과를 읽은 학생이 골품에 막힌 경험을 말한다. 서아는 경전 실력 평가가 골품제를 폐지한 것은 아님을 확인한다.",
    "conflict": "귀족의 반란을 농민 구휼 운동과 혼동한다",
    "dialogueOutline": "서아가 김헌창의 정치적 배경과 반란 진압을 확인한다. 889년과의 시간 간격을 지도 옆에 적는다. 원성왕의 788년 독서삼품과를 읽은 학생이 골품에 막힌 경험을 말한다. 서아는 경전 실력 평가가 골품제를 폐지한 것은 아님을 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "귀족의 반란을 농민 구휼 운동과 혼동한다",
      "turn": "서아가 김헌창의 정치적 배경과 반란 진압을 확인한다. 889년과의 시간 간격을 지도 옆에 적는다. 원성왕의 788년 독서삼품과를 읽은 학생이 골품에 막힌 경험을 말한다. 서아는 경전 실력 평가가 골품제를 폐지한 것은 아님을 확인한다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "김헌창의 난",
    "questionIds": [],
    "genealogyLinks": [
      "H-U14"
    ],
    "nextSceneId": "THR-C19-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “822년 기록 회상 / 웅천주 관련 거점”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C19-S02",
    "chapterId": "THR-C19",
    "sceneTitle": "벼슬의 마지막 칸",
    "historicalYear": "9세기",
    "location": "6두품 학자의 집",
    "historicalEventId": "H-U13",
    "characters": [
      "서아",
      "학자 재인"
    ],
    "backgroundAsset": "BG-25896d5f3c",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-3f9fb17",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "재인이 관등표를 보여 주고 서아는 그 좌절이 개인의 패배만은 아니라고 답한다.",
    "storyObjective": "재인이 관등표를 보여 주고 서아는 그 좌절이 개인의 패배만은 아니라고 답한다.",
    "conflict": "유학을 마쳐도 골품의 승진 한계를 넘기 어렵다",
    "dialogueOutline": "재인이 관등표를 보여 주고 서아는 그 좌절이 개인의 패배만은 아니라고 답한다.",
    "choices": [
      {
        "choiceId": "THR-C19-S02-B1",
        "label": "건의문을 함께 정리한다",
        "action": "건의문을 함께 정리한다",
        "npcReaction": "재인이 냉소를 잠시 내려놓고 구체적 대안을 적는다",
        "followupDialogueOutline": "서아가 건의문을 함께 정리한다 행동을 실행한다. 학자 재인의 반응: 재인이 냉소를 잠시 내려놓고 구체적 대안을 적는다. 상대의 답을 듣고 현재 갈등인 “유학을 마쳐도 골품의 승진 한계를 넘기 어렵다의 처리 결과를 확인한다.",
        "relationshipEffect": "재인이 냉소를 잠시 내려놓고 구체적 대안을 적는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C19-S02-JOIN"
      },
      {
        "choiceId": "THR-C19-S02-B2",
        "label": "지방의 일을 함께 듣는다",
        "action": "지방의 일을 함께 듣는다",
        "npcReaction": "공부가 주민 삶과 만나는 길을 찾는다",
        "followupDialogueOutline": "서아가 지방의 일을 함께 듣는다 행동을 실행한다. 학자 재인의 반응: 공부가 주민 삶과 만나는 길을 찾는다. 상대의 답을 듣고 현재 갈등인 “유학을 마쳐도 골품의 승진 한계를 넘기 어렵다의 처리 결과를 확인한다.",
        "relationshipEffect": "공부가 주민 삶과 만나는 길을 찾는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C19-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "유학을 마쳐도 골품의 승진 한계를 넘기 어렵다",
      "turn": "재인이 관등표를 보여 주고 서아는 그 좌절이 개인의 패배만은 아니라고 답한다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "6두품 한계·호족·선종·풍수",
    "questionIds": [],
    "genealogyLinks": [
      "H-U13"
    ],
    "nextSceneId": "THR-C19-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “9세기 / 6두품 학자의 집”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C19-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C19-S03",
    "chapterId": "THR-C19",
    "sceneTitle": "스스로 지킨 성",
    "historicalYear": "9세기",
    "location": "호족의 지방 성",
    "historicalEventId": "H-U13",
    "characters": [
      "서아",
      "성주 연락관"
    ],
    "backgroundAsset": "BG-2714125545",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-30572d7",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 지역 방어와 수취를 확인한다",
    "storyObjective": "서아가 지역 방어와 수취를 확인한다. 호족을 모두 농민 해방자 또는 도적으로 묶지 않는다.",
    "conflict": "중앙이 지켜 주지 못하자 지방 세력이 힘을 모은다",
    "dialogueOutline": "서아가 지역 방어와 수취를 확인한다. 호족을 모두 농민 해방자 또는 도적으로 묶지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "중앙이 지켜 주지 못하자 지방 세력이 힘을 모은다",
      "turn": "서아가 지역 방어와 수취를 확인한다. 호족을 모두 농민 해방자 또는 도적으로 묶지 않는다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "6두품 한계·호족·선종·풍수",
    "questionIds": [],
    "genealogyLinks": [
      "H-U13"
    ],
    "nextSceneId": "THR-C19-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “9세기 / 호족의 지방 성”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C19-S04",
    "chapterId": "THR-C19",
    "sceneTitle": "참선하는 밤",
    "historicalYear": "9세기",
    "location": "선종 산문",
    "historicalEventId": "H-U13",
    "characters": [
      "서아",
      "승려"
    ],
    "backgroundAsset": "BG-66b669aa43",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-d9df471",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "승려는 참선과 교종의 차이를 말한다",
    "storyObjective": "승려는 참선과 교종의 차이를 말한다. 서아는 선종 확산과 지방 세력의 후원을 연결한다.",
    "conflict": "문자 지식이 부족한 주민이 불교에서 소외되었다고 느낀다",
    "dialogueOutline": "승려는 참선과 교종의 차이를 말한다. 서아는 선종 확산과 지방 세력의 후원을 연결한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "문자 지식이 부족한 주민이 불교에서 소외되었다고 느낀다",
      "turn": "승려는 참선과 교종의 차이를 말한다. 서아는 선종 확산과 지방 세력의 후원을 연결한다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "6두품 한계·호족·선종·풍수",
    "questionIds": [],
    "genealogyLinks": [
      "H-U13"
    ],
    "nextSceneId": "THR-C19-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “9세기 / 선종 산문”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C19-S05",
    "chapterId": "THR-C19",
    "sceneTitle": "산을 읽는 두 눈",
    "historicalYear": "9세기",
    "location": "지방 산길",
    "historicalEventId": "H-U13",
    "characters": [
      "서아",
      "풍수에 밝은 승려"
    ],
    "backgroundAsset": "BG-aa43ec60ef",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-a8231c8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "승려가 국토와 지역의 의미를 설명하고 서아는 사상을 과학적 예언으로 단정하지 않는다.",
    "storyObjective": "승려가 국토와 지역의 의미를 설명하고 서아는 사상을 과학적 예언으로 단정하지 않는다.",
    "conflict": "서아가 풍수로 미래를 정확히 예언해 달라고 요구한다",
    "dialogueOutline": "승려가 국토와 지역의 의미를 설명하고 서아는 사상을 과학적 예언으로 단정하지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C19-S05-B1",
        "label": "마을의 입지를 함께 살핀다",
        "action": "마을의 입지를 함께 살핀다",
        "npcReaction": "주민이 물길과 삶의 조건을 먼저 말한다",
        "followupDialogueOutline": "서아가 마을의 입지를 함께 살핀다 행동을 실행한다. 풍수에 밝은 승려의 반응: 주민이 물길과 삶의 조건을 먼저 말한다. 상대의 답을 듣고 현재 갈등인 “서아가 풍수로 미래를 정확히 예언해 달라고 요구한다의 처리 결과를 확인한다.",
        "relationshipEffect": "주민이 물길과 삶의 조건을 먼저 말한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C19-S05-JOIN"
      },
      {
        "choiceId": "THR-C19-S05-B2",
        "label": "전승을 기록으로 남긴다",
        "action": "전승을 기록으로 남긴다",
        "npcReaction": "예언 대신 당시의 세계관을 이해하게 된다",
        "followupDialogueOutline": "서아가 전승을 기록으로 남긴다 행동을 실행한다. 풍수에 밝은 승려의 반응: 예언 대신 당시의 세계관을 이해하게 된다. 상대의 답을 듣고 현재 갈등인 “서아가 풍수로 미래를 정확히 예언해 달라고 요구한다의 처리 결과를 확인한다.",
        "relationshipEffect": "예언 대신 당시의 세계관을 이해하게 된다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C19-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "서아가 풍수로 미래를 정확히 예언해 달라고 요구한다",
      "turn": "승려가 국토와 지역의 의미를 설명하고 서아는 사상을 과학적 예언으로 단정하지 않는다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "6두품 한계·호족·선종·풍수",
    "questionIds": [],
    "genealogyLinks": [
      "H-U13"
    ],
    "nextSceneId": "THR-C19-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “9세기 / 지방 산길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C19-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C19-S06",
    "chapterId": "THR-C19",
    "sceneTitle": "오지 않는 세금",
    "historicalYear": "889년",
    "location": "상주 지역 농촌",
    "historicalEventId": "H-U15",
    "characters": [
      "서아",
      "농민 지우"
    ],
    "backgroundAsset": "BG-a2206df32a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-f9d7965",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 진성여왕대 재정난과 수취 강화의 연결을 듣고 주민의 실제 부족량을 적는다.",
    "storyObjective": "서아가 진성여왕대 재정난과 수취 강화의 연결을 듣고 주민의 실제 부족량을 적는다.",
    "conflict": "흉작에도 세금 독촉이 이어져 가족이 갈라진다",
    "dialogueOutline": "서아가 진성여왕대 재정난과 수취 강화의 연결을 듣고 주민의 실제 부족량을 적는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "흉작에도 세금 독촉이 이어져 가족이 갈라진다",
      "turn": "서아가 진성여왕대 재정난과 수취 강화의 연결을 듣고 주민의 실제 부족량을 적는다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "원종·애노의 난·최치원 시무10여조",
    "questionIds": [],
    "genealogyLinks": [
      "H-U15"
    ],
    "nextSceneId": "THR-C19-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “889년 / 상주 지역 농촌”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C19-S07",
    "chapterId": "THR-C19",
    "sceneTitle": "원종과 애노의 목소리",
    "historicalYear": "889년",
    "location": "사벌주 봉기 주변",
    "historicalEventId": "H-U15",
    "characters": [
      "서아",
      "원종·애노 관련 주민"
    ],
    "backgroundAsset": "BG-5e5ae1693f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-77a3eeb",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 반란 결과를 바꾸는 지도자가 아니라 주민 증언을 남기는 사람이다",
    "storyObjective": "서아는 반란 결과를 바꾸는 지도자가 아니라 주민 증언을 남기는 사람이다. 김헌창의 난과 주체·원인을 비교한다.",
    "conflict": "봉기에 참여할지 가족을 먼저 피신시킬지 갈등한다",
    "dialogueOutline": "서아는 반란 결과를 바꾸는 지도자가 아니라 주민 증언을 남기는 사람이다. 김헌창의 난과 주체·원인을 비교한다.",
    "choices": [
      {
        "choiceId": "THR-C19-S07-B1",
        "label": "가족 대피를 돕는다",
        "action": "가족 대피를 돕는다",
        "npcReaction": "주민이 비겁함 대신 돌봄의 선택을 인정한다",
        "followupDialogueOutline": "서아가 가족 대피를 돕는다 행동을 실행한다. 원종·애노 관련 주민의 반응: 주민이 비겁함 대신 돌봄의 선택을 인정한다. 상대의 답을 듣고 현재 갈등인 “봉기에 참여할지 가족을 먼저 피신시킬지 갈등한다의 처리 결과를 확인한다.",
        "relationshipEffect": "주민이 비겁함 대신 돌봄의 선택을 인정한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C19-S07-JOIN"
      },
      {
        "choiceId": "THR-C19-S07-B2",
        "label": "증언을 모은다",
        "action": "증언을 모은다",
        "npcReaction": "피해가 기록되고 소문과 사실이 구별된다",
        "followupDialogueOutline": "서아가 증언을 모은다 행동을 실행한다. 원종·애노 관련 주민의 반응: 피해가 기록되고 소문과 사실이 구별된다. 상대의 답을 듣고 현재 갈등인 “봉기에 참여할지 가족을 먼저 피신시킬지 갈등한다의 처리 결과를 확인한다.",
        "relationshipEffect": "피해가 기록되고 소문과 사실이 구별된다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C19-S07-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "봉기에 참여할지 가족을 먼저 피신시킬지 갈등한다",
      "turn": "서아는 반란 결과를 바꾸는 지도자가 아니라 주민 증언을 남기는 사람이다. 김헌창의 난과 주체·원인을 비교한다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "원종·애노의 난·최치원 시무10여조",
    "questionIds": [
      "official-61-advanced-08"
    ],
    "genealogyLinks": [
      "H-U15"
    ],
    "nextSceneId": "THR-C19-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “889년 / 사벌주 봉기 주변”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C19-S07-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C19-S08",
    "chapterId": "THR-C19",
    "sceneTitle": "열 가지 건의의 문",
    "historicalYear": "894년",
    "location": "최치원의 개혁 건의 기록",
    "historicalEventId": "H-U15",
    "characters": [
      "서아",
      "최치원"
    ],
    "backgroundAsset": "BG-4140e1e4d3",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-2c3341b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 시무10여조 건의와 개혁의 한계를 확인한다",
    "storyObjective": "서아가 시무10여조 건의와 개혁의 한계를 확인한다. 재인은 배움이 쓸모없었다는 말 대신 다른 사회를 상상한다.",
    "conflict": "좋은 건의만 있으면 곧 체제가 바뀐다고 기대한다",
    "dialogueOutline": "서아가 시무10여조 건의와 개혁의 한계를 확인한다. 재인은 배움이 쓸모없었다는 말 대신 다른 사회를 상상한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "좋은 건의만 있으면 곧 체제가 바뀐다고 기대한다",
      "turn": "서아가 시무10여조 건의와 개혁의 한계를 확인한다. 재인은 배움이 쓸모없었다는 말 대신 다른 사회를 상상한다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "원종·애노의 난·최치원 시무10여조",
    "questionIds": [],
    "genealogyLinks": [
      "H-U15"
    ],
    "nextSceneId": "THR-C19-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “894년 / 최치원의 개혁 건의 기록”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C19-S09",
    "chapterId": "THR-C19",
    "sceneTitle": "세 갈래의 길",
    "historicalYear": "9세기 말→698년",
    "location": "호족 세력 지도·시간 전환",
    "historicalEventId": "H-L1",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-0ff63372c7",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C19-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 남쪽에서889년을 본 뒤 북쪽의698년으로 돌아간다고 명시한다",
    "storyObjective": "서아는 남쪽에서889년을 본 뒤 북쪽의698년으로 돌아간다고 명시한다. 후삼국의 결말을 보기 전에 발해의 별도 역사를 시작한다.",
    "conflict": "신라 말 다음에 곧 발해 건국이라고 오해할 수 있다",
    "dialogueOutline": "서아는 남쪽에서889년을 본 뒤 북쪽의698년으로 돌아간다고 명시한다. 후삼국의 결말을 보기 전에 발해의 별도 역사를 시작한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "신라 말 다음에 곧 발해 건국이라고 오해할 수 있다",
      "turn": "서아는 남쪽에서889년을 본 뒤 북쪽의698년으로 돌아간다고 명시한다. 후삼국의 결말을 보기 전에 발해의 별도 역사를 시작한다.",
      "end": "귀족 반란과 농민 봉기의 원인을 구분하고 제도 개혁의 좌절을 체험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "완산주에서 후백제 건국",
    "questionIds": [],
    "genealogyLinks": [
      "H-L1"
    ],
    "nextSceneId": "THR-C20-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “9세기 말→698년 / 호족 세력 지도·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C19-S09-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.20 북쪽에 남은 이름

```json
[
  {
    "sceneId": "THR-C20-S01",
    "chapterId": "THR-C20",
    "sceneTitle": "또 다른 피란길",
    "historicalYear": "696년 이후",
    "location": "영주 탈출·동쪽 길",
    "historicalEventId": "H-H1",
    "characters": [
      "서아",
      "유민 해루"
    ],
    "backgroundAsset": "BG-a773b089a9",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C20-65a8468",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "해루가 부모에게 들은 고향을 말한다",
    "storyObjective": "해루가 부모에게 들은 고향을 말한다. 서아는 CH05의 태문과 새 세대를 다른 인물로 기록한다.",
    "conflict": "고구려 멸망 뒤 한 세대가 흘렀는데 서아는 같은 가족을 찾는다",
    "dialogueOutline": "해루가 부모에게 들은 고향을 말한다. 서아는 CH05의 태문과 새 세대를 다른 인물로 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "고구려 멸망 뒤 한 세대가 흘렀는데 서아는 같은 가족을 찾는다",
      "turn": "해루가 부모에게 들은 고향을 말한다. 서아는 CH05의 태문과 새 세대를 다른 인물로 기록한다.",
      "end": "피란·연합·건국과 다양한 주민의 정체성을 함께 다룸; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "동모산 일대 발해 건국",
    "questionIds": [],
    "genealogyLinks": [
      "H-H1"
    ],
    "nextSceneId": "THR-C20-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “696년 이후 / 영주 탈출·동쪽 길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C20-S02",
    "chapterId": "THR-C20",
    "sceneTitle": "말이 다른 동료",
    "historicalYear": "7세기 말",
    "location": "유민 야영지",
    "historicalEventId": "H-H2",
    "characters": [
      "서아",
      "말갈 출신 동료 누리"
    ],
    "backgroundAsset": "BG-08a9896f17",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C20-5971343",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 서로의 생활 도구와 필요한 것을 확인한다",
    "storyObjective": "서아가 서로의 생활 도구와 필요한 것을 확인한다. 고구려 유민과 말갈 세력의 결합을 관계 갈등으로 체험한다.",
    "conflict": "말이 다르면 같은 편이 될 수 없다는 불신",
    "dialogueOutline": "서아가 서로의 생활 도구와 필요한 것을 확인한다. 고구려 유민과 말갈 세력의 결합을 관계 갈등으로 체험한다.",
    "choices": [
      {
        "choiceId": "THR-C20-S02-B1",
        "label": "식량 일을 나눈다",
        "action": "식량 일을 나눈다",
        "npcReaction": "누리가 실무 신뢰를 보이며 말을 가르쳐 준다",
        "followupDialogueOutline": "서아가 식량 일을 나눈다 행동을 실행한다. 말갈 출신 동료 누리의 반응: 누리가 실무 신뢰를 보이며 말을 가르쳐 준다. 상대의 답을 듣고 현재 갈등인 “말이 다르면 같은 편이 될 수 없다는 불신의 처리 결과를 확인한다.",
        "relationshipEffect": "누리가 실무 신뢰를 보이며 말을 가르쳐 준다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C20-S02-JOIN"
      },
      {
        "choiceId": "THR-C20-S02-B2",
        "label": "통역 순서를 정한다",
        "action": "통역 순서를 정한다",
        "npcReaction": "서로의 발언이 지워지지 않아 오해가 줄어든다",
        "followupDialogueOutline": "서아가 통역 순서를 정한다 행동을 실행한다. 말갈 출신 동료 누리의 반응: 서로의 발언이 지워지지 않아 오해가 줄어든다. 상대의 답을 듣고 현재 갈등인 “말이 다르면 같은 편이 될 수 없다는 불신의 처리 결과를 확인한다.",
        "relationshipEffect": "서로의 발언이 지워지지 않아 오해가 줄어든다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C20-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "말이 다르면 같은 편이 될 수 없다는 불신",
      "turn": "서아가 서로의 생활 도구와 필요한 것을 확인한다. 고구려 유민과 말갈 세력의 결합을 관계 갈등으로 체험한다.",
      "end": "피란·연합·건국과 다양한 주민의 정체성을 함께 다룸; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고구려 계승 의식과 다양한 주민 구성",
    "questionIds": [],
    "genealogyLinks": [
      "H-H2"
    ],
    "nextSceneId": "THR-C20-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “7세기 말 / 유민 야영지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C20-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C20-S03",
    "chapterId": "THR-C20",
    "sceneTitle": "천문령의 먼 소식",
    "historicalYear": "698년 건국 전",
    "location": "전투 후방",
    "historicalEventId": "H-H1",
    "characters": [
      "서아",
      "대조영의 전령"
    ],
    "backgroundAsset": "BG-7bbf5ff8f2",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C20-ab0d574",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 확인 가능한 소식과 피란 준비를 나눈다",
    "storyObjective": "서아가 확인 가능한 소식과 피란 준비를 나눈다. 천문령 전투와 건국의 앞뒤를 연표에 놓는다.",
    "conflict": "전투 소식을 기다리다 과장된 패배 소문이 돈다",
    "dialogueOutline": "서아가 확인 가능한 소식과 피란 준비를 나눈다. 천문령 전투와 건국의 앞뒤를 연표에 놓는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "전투 소식을 기다리다 과장된 패배 소문이 돈다",
      "turn": "서아가 확인 가능한 소식과 피란 준비를 나눈다. 천문령 전투와 건국의 앞뒤를 연표에 놓는다.",
      "end": "피란·연합·건국과 다양한 주민의 정체성을 함께 다룸; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "동모산 일대 발해 건국",
    "questionIds": [],
    "genealogyLinks": [
      "H-H1"
    ],
    "nextSceneId": "THR-C20-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “698년 건국 전 / 전투 후방”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C20-S04",
    "chapterId": "THR-C20",
    "sceneTitle": "동모산 아래의 약속",
    "historicalYear": "698년",
    "location": "동모산 일대",
    "historicalEventId": "H-H1",
    "characters": [
      "서아",
      "대조영"
    ],
    "backgroundAsset": "BG-8868d51c7d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C20-1d7b830",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "대조영이 결합한 세력의 생존을 말하고 서아는 각 가족의 필요를 전달한다",
    "storyObjective": "대조영이 결합한 세력의 생존을 말하고 서아는 각 가족의 필요를 전달한다. 건국일의 실제 대사를 재현했다고 표시하지 않는다.",
    "conflict": "새 나라가 어느 집단만의 것인지 주민이 다툰다",
    "dialogueOutline": "대조영이 결합한 세력의 생존을 말하고 서아는 각 가족의 필요를 전달한다. 건국일의 실제 대사를 재현했다고 표시하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "새 나라가 어느 집단만의 것인지 주민이 다툰다",
      "turn": "대조영이 결합한 세력의 생존을 말하고 서아는 각 가족의 필요를 전달한다. 건국일의 실제 대사를 재현했다고 표시하지 않는다.",
      "end": "피란·연합·건국과 다양한 주민의 정체성을 함께 다룸; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "동모산 일대 발해 건국",
    "questionIds": [],
    "genealogyLinks": [
      "H-H1"
    ],
    "nextSceneId": "THR-C20-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “698년 / 동모산 일대”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C20-S05",
    "chapterId": "THR-C20",
    "sceneTitle": "이름을 잇는 문서",
    "historicalYear": "698년 이후",
    "location": "발해 초기 기록처",
    "historicalEventId": "H-H2",
    "characters": [
      "서아",
      "서리 해루"
    ],
    "backgroundAsset": "BG-184d0d5e43",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C20-6cc86cc",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 국가 계승 의식과 주민 구성의 다양성을 따로 적는다",
    "storyObjective": "서아가 국가 계승 의식과 주민 구성의 다양성을 따로 적는다. 일본에 보낸 국서 등 계승 표현을 학습 자료로 연결한다.",
    "conflict": "고구려 계승을 주민 모두의 동일 혈통으로 오해한다",
    "dialogueOutline": "서아가 국가 계승 의식과 주민 구성의 다양성을 따로 적는다. 일본에 보낸 국서 등 계승 표현을 학습 자료로 연결한다.",
    "choices": [
      {
        "choiceId": "THR-C20-S05-B1",
        "label": "표현의 출처를 확인한다",
        "action": "표현의 출처를 확인한다",
        "npcReaction": "서리가 계승 의식의 근거를 구체적으로 찾는다",
        "followupDialogueOutline": "서아가 표현의 출처를 확인한다 행동을 실행한다. 서리 해루의 반응: 서리가 계승 의식의 근거를 구체적으로 찾는다. 상대의 답을 듣고 현재 갈등인 “고구려 계승을 주민 모두의 동일 혈통으로 오해한다의 처리 결과를 확인한다.",
        "relationshipEffect": "서리가 계승 의식의 근거를 구체적으로 찾는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C20-S05-JOIN"
      },
      {
        "choiceId": "THR-C20-S05-B2",
        "label": "주민들의 이름을 병기한다",
        "action": "주민들의 이름을 병기한다",
        "npcReaction": "누리가 자신의 집단도 새 나라에 남는다고 느낀다",
        "followupDialogueOutline": "서아가 주민들의 이름을 병기한다 행동을 실행한다. 서리 해루의 반응: 누리가 자신의 집단도 새 나라에 남는다고 느낀다. 상대의 답을 듣고 현재 갈등인 “고구려 계승을 주민 모두의 동일 혈통으로 오해한다의 처리 결과를 확인한다.",
        "relationshipEffect": "누리가 자신의 집단도 새 나라에 남는다고 느낀다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C20-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "고구려 계승을 주민 모두의 동일 혈통으로 오해한다",
      "turn": "서아가 국가 계승 의식과 주민 구성의 다양성을 따로 적는다. 일본에 보낸 국서 등 계승 표현을 학습 자료로 연결한다.",
      "end": "피란·연합·건국과 다양한 주민의 정체성을 함께 다룸; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고구려 계승 의식과 다양한 주민 구성",
    "questionIds": [],
    "genealogyLinks": [
      "H-H2"
    ],
    "nextSceneId": "THR-C20-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “698년 이후 / 발해 초기 기록처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C20-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C20-S06",
    "chapterId": "THR-C20",
    "sceneTitle": "국경을 넘는 그릇",
    "historicalYear": "8세기 초",
    "location": "초기 발해 마을",
    "historicalEventId": "H-H2",
    "characters": [
      "서아",
      "도공 누리"
    ],
    "backgroundAsset": "BG-1c4fa8e7b7",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C20-10b9755",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 계승과 변용이 함께 있음을 도공에게 배우고 불교·생활문화 비교의 단서를 남긴다.",
    "storyObjective": "서아는 계승과 변용이 함께 있음을 도공에게 배우고 불교·생활문화 비교의 단서를 남긴다.",
    "conflict": "옛 고구려 양식과 새 생활 도구를 섞으면 전통을 버린다는 비난",
    "dialogueOutline": "서아는 계승과 변용이 함께 있음을 도공에게 배우고 불교·생활문화 비교의 단서를 남긴다.",
    "choices": [],
    "emotionalBeat": {
      "start": "옛 고구려 양식과 새 생활 도구를 섞으면 전통을 버린다는 비난",
      "turn": "서아는 계승과 변용이 함께 있음을 도공에게 배우고 불교·생활문화 비교의 단서를 남긴다.",
      "end": "피란·연합·건국과 다양한 주민의 정체성을 함께 다룸; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고구려 계승 의식과 다양한 주민 구성",
    "questionIds": [],
    "genealogyLinks": [
      "H-H2"
    ],
    "nextSceneId": "THR-C20-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “8세기 초 / 초기 발해 마을”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C20-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C20-S07",
    "chapterId": "THR-C20",
    "sceneTitle": "당이 부르는 이름",
    "historicalYear": "713년",
    "location": "사절 접견처",
    "historicalEventId": "H-H1",
    "characters": [
      "서아",
      "발해 사신"
    ],
    "backgroundAsset": "BG-b07ca62f63",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C20-828bb53",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 698년 건국과 713년 발해군왕 책봉을 구분한다",
    "storyObjective": "서아가 698년 건국과 713년 발해군왕 책봉을 구분한다. 외교적 관계와 내부 통치를 다른 층위로 정리한다.",
    "conflict": "당의 책봉이 곧 종속 또는 건국 그 자체라는 오해",
    "dialogueOutline": "서아가 698년 건국과 713년 발해군왕 책봉을 구분한다. 외교적 관계와 내부 통치를 다른 층위로 정리한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "당의 책봉이 곧 종속 또는 건국 그 자체라는 오해",
      "turn": "서아가 698년 건국과 713년 발해군왕 책봉을 구분한다. 외교적 관계와 내부 통치를 다른 층위로 정리한다.",
      "end": "피란·연합·건국과 다양한 주민의 정체성을 함께 다룸; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "동모산 일대 발해 건국",
    "questionIds": [],
    "genealogyLinks": [
      "H-H1"
    ],
    "nextSceneId": "THR-C20-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “713년 / 사절 접견처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C20-S08",
    "chapterId": "THR-C20",
    "sceneTitle": "무왕의 시대를 열다",
    "historicalYear": "719년",
    "location": "왕계·시간 전환",
    "historicalEventId": "H-H3",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-fa7739b44a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C20-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 대조영→대무예의 부자 관계와 인안 연호를 확인한다",
    "storyObjective": "서아가 대조영→대무예의 부자 관계와 인안 연호를 확인한다. 전쟁을 선택하는 왕과 반대하는 동생의 갈등으로 이동한다.",
    "conflict": "대조영과 무왕의 이름·연호가 섞인다",
    "dialogueOutline": "서아가 대조영→대무예의 부자 관계와 인안 연호를 확인한다. 전쟁을 선택하는 왕과 반대하는 동생의 갈등으로 이동한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "대조영과 무왕의 이름·연호가 섞인다",
      "turn": "서아가 대조영→대무예의 부자 관계와 인안 연호를 확인한다. 전쟁을 선택하는 왕과 반대하는 동생의 갈등으로 이동한다.",
      "end": "피란·연합·건국과 다양한 주민의 정체성을 함께 다룸; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "인안 연호·장문휴의 등주 공격",
    "questionIds": [],
    "genealogyLinks": [
      "H-H3"
    ],
    "nextSceneId": "THR-C21-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “719년 / 왕계·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C20-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.21 세상의 여러 길

```json
[
  {
    "sceneId": "THR-C21-S01",
    "chapterId": "THR-C21",
    "sceneTitle": "싸우자는 왕과 동생",
    "historicalYear": "732년 전후",
    "location": "발해 왕실 연락처",
    "historicalEventId": "H-H3",
    "characters": [
      "서아",
      "대문예 관련 연락관"
    ],
    "backgroundAsset": "BG-f7c101d051",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-9a512f9",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 신중론을 겁쟁이로 지우지 않고 두 입장의 근거를 기록한다.",
    "storyObjective": "서아는 신중론을 겁쟁이로 지우지 않고 두 입장의 근거를 기록한다.",
    "conflict": "흑수말갈·당 대응을 둘러싼 무왕과 대문예의 갈등",
    "dialogueOutline": "서아는 신중론을 겁쟁이로 지우지 않고 두 입장의 근거를 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "흑수말갈·당 대응을 둘러싼 무왕과 대문예의 갈등",
      "turn": "서아는 신중론을 겁쟁이로 지우지 않고 두 입장의 근거를 기록한다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "인안 연호·장문휴의 등주 공격",
    "questionIds": [],
    "genealogyLinks": [
      "H-H3"
    ],
    "nextSceneId": "THR-C21-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “732년 전후 / 발해 왕실 연락처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C21-S02",
    "chapterId": "THR-C21",
    "sceneTitle": "등주로 향한 돛",
    "historicalYear": "732년",
    "location": "발해 출항지",
    "historicalEventId": "H-H3",
    "characters": [
      "서아",
      "장문휴의 부하"
    ],
    "backgroundAsset": "BG-f0972e429e",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-7f1c6c4",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 장문휴의 산둥반도 등주 공격을 지도에 표시한다",
    "storyObjective": "서아가 장문휴의 산둥반도 등주 공격을 지도에 표시한다. 인안과 대흥을 왕별로 구별한다.",
    "conflict": "멀리 공격에 나서는 가족이 돌아올지 두렵다",
    "dialogueOutline": "서아가 장문휴의 산둥반도 등주 공격을 지도에 표시한다. 인안과 대흥을 왕별로 구별한다.",
    "choices": [
      {
        "choiceId": "THR-C21-S02-B1",
        "label": "가족 편지를 전달한다",
        "action": "가족 편지를 전달한다",
        "npcReaction": "병사가 두려움을 고백하며 가족에게 소식을 남긴다",
        "followupDialogueOutline": "서아가 가족 편지를 전달한다 행동을 실행한다. 장문휴의 부하의 반응: 병사가 두려움을 고백하며 가족에게 소식을 남긴다. 상대의 답을 듣고 현재 갈등인 “멀리 공격에 나서는 가족이 돌아올지 두렵다의 처리 결과를 확인한다.",
        "relationshipEffect": "병사가 두려움을 고백하며 가족에게 소식을 남긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C21-S02-JOIN"
      },
      {
        "choiceId": "THR-C21-S02-B2",
        "label": "항로 보급을 확인한다",
        "action": "항로 보급을 확인한다",
        "npcReaction": "부하가 지도를 검토하고 서아의 실무를 인정한다",
        "followupDialogueOutline": "서아가 항로 보급을 확인한다 행동을 실행한다. 장문휴의 부하의 반응: 부하가 지도를 검토하고 서아의 실무를 인정한다. 상대의 답을 듣고 현재 갈등인 “멀리 공격에 나서는 가족이 돌아올지 두렵다의 처리 결과를 확인한다.",
        "relationshipEffect": "부하가 지도를 검토하고 서아의 실무를 인정한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C21-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "멀리 공격에 나서는 가족이 돌아올지 두렵다",
      "turn": "서아가 장문휴의 산둥반도 등주 공격을 지도에 표시한다. 인안과 대흥을 왕별로 구별한다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "인안 연호·장문휴의 등주 공격",
    "questionIds": [
      "official-61-advanced-10"
    ],
    "genealogyLinks": [
      "H-H3"
    ],
    "nextSceneId": "THR-C21-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “732년 / 발해 출항지”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C21-S02-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C21-S03",
    "chapterId": "THR-C21",
    "sceneTitle": "전쟁 뒤의 다른 외교",
    "historicalYear": "737년 이후",
    "location": "문왕대 사절 숙소",
    "historicalEventId": "H-H4",
    "characters": [
      "서아",
      "발해 사신"
    ],
    "backgroundAsset": "BG-e5e6377ea2",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-828bb53",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "사신이 문왕의 교류와 제도 정비를 설명한다",
    "storyObjective": "사신이 문왕의 교류와 제도 정비를 설명한다. 서아는 왕 교체와 대흥 연호를 함께 확인한다.",
    "conflict": "무왕의 대당 대립이 영구 정책이라는 선입견",
    "dialogueOutline": "사신이 문왕의 교류와 제도 정비를 설명한다. 서아는 왕 교체와 대흥 연호를 함께 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "무왕의 대당 대립이 영구 정책이라는 선입견",
      "turn": "사신이 문왕의 교류와 제도 정비를 설명한다. 서아는 왕 교체와 대흥 연호를 함께 확인한다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대흥·3성6부·상경 용천부",
    "questionIds": [],
    "genealogyLinks": [
      "H-H4"
    ],
    "nextSceneId": "THR-C21-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “737년 이후 / 문왕대 사절 숙소”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C21-S04",
    "chapterId": "THR-C21",
    "sceneTitle": "세 성의 문서",
    "historicalYear": "8세기",
    "location": "정당성 관련 관청",
    "historicalEventId": "H-H4",
    "characters": [
      "서아",
      "관리"
    ],
    "backgroundAsset": "BG-b81f115c78",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-c29fba5",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 정당성·선조성·중대성과 충인·인의·지예 등 부 명칭을 비교한다",
    "storyObjective": "서아가 정당성·선조성·중대성과 충인·인의·지예 등 부 명칭을 비교한다. 운용의 독자성도 확인한다.",
    "conflict": "당의 3성6부를 이름까지 그대로 복사했다는 오해",
    "dialogueOutline": "서아가 정당성·선조성·중대성과 충인·인의·지예 등 부 명칭을 비교한다. 운용의 독자성도 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "당의 3성6부를 이름까지 그대로 복사했다는 오해",
      "turn": "서아가 정당성·선조성·중대성과 충인·인의·지예 등 부 명칭을 비교한다. 운용의 독자성도 확인한다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대흥·3성6부·상경 용천부",
    "questionIds": [],
    "genealogyLinks": [
      "H-H4"
    ],
    "nextSceneId": "THR-C21-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “8세기 / 정당성 관련 관청”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C21-S05",
    "chapterId": "THR-C21",
    "sceneTitle": "상경의 긴 길",
    "historicalYear": "8세기·수도 이동 비교",
    "location": "상경 용천부",
    "historicalEventId": "H-H4",
    "characters": [
      "서아",
      "이주민 해루의 후손"
    ],
    "backgroundAsset": "BG-be72fd0be0",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-23fab0e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 중경·상경·동경의 변동을 기록으로 분리한다",
    "storyObjective": "서아가 중경·상경·동경의 변동을 기록으로 분리한다. 대로의 질서와 이주민의 새 생활을 함께 본다.",
    "conflict": "문왕대 천도와 뒤의 환도를 한 번으로 압축한다",
    "dialogueOutline": "서아가 중경·상경·동경의 변동을 기록으로 분리한다. 대로의 질서와 이주민의 새 생활을 함께 본다.",
    "choices": [
      {
        "choiceId": "THR-C21-S05-B1",
        "label": "새 거처를 찾는다",
        "action": "새 거처를 찾는다",
        "npcReaction": "주민이 수도의 웅장함보다 생활의 안정을 기억한다",
        "followupDialogueOutline": "서아가 새 거처를 찾는다 행동을 실행한다. 이주민 해루의 후손의 반응: 주민이 수도의 웅장함보다 생활의 안정을 기억한다. 상대의 답을 듣고 현재 갈등인 “문왕대 천도와 뒤의 환도를 한 번으로 압축한다의 처리 결과를 확인한다.",
        "relationshipEffect": "주민이 수도의 웅장함보다 생활의 안정을 기억한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C21-S05-JOIN"
      },
      {
        "choiceId": "THR-C21-S05-B2",
        "label": "도시 지도를 그린다",
        "action": "도시 지도를 그린다",
        "npcReaction": "행정관이 길을 안내하고 주민 동선도 남긴다",
        "followupDialogueOutline": "서아가 도시 지도를 그린다 행동을 실행한다. 이주민 해루의 후손의 반응: 행정관이 길을 안내하고 주민 동선도 남긴다. 상대의 답을 듣고 현재 갈등인 “문왕대 천도와 뒤의 환도를 한 번으로 압축한다의 처리 결과를 확인한다.",
        "relationshipEffect": "행정관이 길을 안내하고 주민 동선도 남긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C21-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "문왕대 천도와 뒤의 환도를 한 번으로 압축한다",
      "turn": "서아가 중경·상경·동경의 변동을 기록으로 분리한다. 대로의 질서와 이주민의 새 생활을 함께 본다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "대흥·3성6부·상경 용천부",
    "questionIds": [],
    "genealogyLinks": [
      "H-H4"
    ],
    "nextSceneId": "THR-C21-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “8세기·수도 이동 비교 / 상경 용천부”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C21-S06",
    "chapterId": "THR-C21",
    "sceneTitle": "건흥의 새 지도",
    "historicalYear": "818~830년",
    "location": "선왕대 지도실",
    "historicalEventId": "H-H5",
    "characters": [
      "서아",
      "발해 장교"
    ],
    "backgroundAsset": "BG-7e93aaa7eb",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-242f09e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 말갈 집단과 북방 관계·행정 확대를 확인한다",
    "storyObjective": "서아가 말갈 집단과 북방 관계·행정 확대를 확인한다. 해동성국을 특정일의 공식 선포식으로 만들지 않는다.",
    "conflict": "영토 확장을 모두 빈 땅의 획득으로 표현한다",
    "dialogueOutline": "서아가 말갈 집단과 북방 관계·행정 확대를 확인한다. 해동성국을 특정일의 공식 선포식으로 만들지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "영토 확장을 모두 빈 땅의 획득으로 표현한다",
      "turn": "서아가 말갈 집단과 북방 관계·행정 확대를 확인한다. 해동성국을 특정일의 공식 선포식으로 만들지 않는다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "건흥·영역 확장·해동성국",
    "questionIds": [],
    "genealogyLinks": [
      "H-H5"
    ],
    "nextSceneId": "THR-C21-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “818~830년 / 선왕대 지도실”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C21-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C21-S07",
    "chapterId": "THR-C21",
    "sceneTitle": "다섯 경으로 가는 서신",
    "historicalYear": "9세기",
    "location": "지방 행정·역참",
    "historicalEventId": "H-H6",
    "characters": [
      "서아",
      "역참 관리"
    ],
    "backgroundAsset": "BG-2ac664352f",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-62f901a",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 5경15부62주와 주자감·교역로를 각각 연결한다",
    "storyObjective": "서아가 5경15부62주와 주자감·교역로를 각각 연결한다. 신라 9주5소경과 구별한다.",
    "conflict": "넓은 영역 때문에 문서가 늦어 주민의 일이 멈춘다",
    "dialogueOutline": "서아가 5경15부62주와 주자감·교역로를 각각 연결한다. 신라 9주5소경과 구별한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "넓은 영역 때문에 문서가 늦어 주민의 일이 멈춘다",
      "turn": "서아가 5경15부62주와 주자감·교역로를 각각 연결한다. 신라 9주5소경과 구별한다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "5경15부62주·주자감·교역로",
    "questionIds": [
      "official-77-advanced-07"
    ],
    "genealogyLinks": [
      "H-H6"
    ],
    "nextSceneId": "THR-C21-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “9세기 / 지방 행정·역참”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C21-S07-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C21-S08",
    "chapterId": "THR-C21",
    "sceneTitle": "두 공주의 무덤",
    "historicalYear": "777·792 기록 비교",
    "location": "정혜·정효공주묘 자료 공간",
    "historicalEventId": "H-H7",
    "characters": [
      "서아",
      "묘지 기록관"
    ],
    "backgroundAsset": "BG-eb93595c75",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-cc2ccd6",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 정혜의 모줄임천장과 정효의 벽돌·벽화를 대조한다",
    "storyObjective": "서아가 정혜의 모줄임천장과 정효의 벽돌·벽화를 대조한다. 문왕의 둘째·넷째 딸이며 장례 정보와 발견연도를 구분한다.",
    "conflict": "공주 이름과 돌방·벽돌 구조를 뒤바꾼 도식",
    "dialogueOutline": "서아가 정혜의 모줄임천장과 정효의 벽돌·벽화를 대조한다. 문왕의 둘째·넷째 딸이며 장례 정보와 발견연도를 구분한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "공주 이름과 돌방·벽돌 구조를 뒤바꾼 도식",
      "turn": "서아가 정혜의 모줄임천장과 정효의 벽돌·벽화를 대조한다. 문왕의 둘째·넷째 딸이며 장례 정보와 발견연도를 구분한다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "정혜공주묘·정효공주묘",
    "questionIds": [],
    "genealogyLinks": [
      "H-H7"
    ],
    "nextSceneId": "THR-C21-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “777·792 기록 비교 / 정혜·정효공주묘 자료 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C21-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C21-S09",
    "chapterId": "THR-C21",
    "sceneTitle": "온돌 곁의 두 부처",
    "historicalYear": "8~9세기",
    "location": "발해 가옥·사찰 기록",
    "historicalEventId": "H-H8",
    "characters": [
      "서아",
      "주민 누리의 후손"
    ],
    "backgroundAsset": "BG-2e5a03773a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-54f8897",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 온돌과 이불병좌상·석등·기와를 관찰한다",
    "storyObjective": "서아가 온돌과 이불병좌상·석등·기와를 관찰한다. 계승과 새로운 조합이 함께 나타남을 배운다.",
    "conflict": "고구려 영향과 당 영향을 서로 배척하는 증거로만 읽는다",
    "dialogueOutline": "서아가 온돌과 이불병좌상·석등·기와를 관찰한다. 계승과 새로운 조합이 함께 나타남을 배운다.",
    "choices": [
      {
        "choiceId": "THR-C21-S09-B1",
        "label": "생활의 쓰임을 묻는다",
        "action": "생활의 쓰임을 묻는다",
        "npcReaction": "주민이 겨울 난방과 생활을 보여 준다",
        "followupDialogueOutline": "서아가 생활의 쓰임을 묻는다 행동을 실행한다. 주민 누리의 후손의 반응: 주민이 겨울 난방과 생활을 보여 준다. 상대의 답을 듣고 현재 갈등인 “고구려 영향과 당 영향을 서로 배척하는 증거로만 읽는다의 처리 결과를 확인한다.",
        "relationshipEffect": "주민이 겨울 난방과 생활을 보여 준다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C21-S09-JOIN"
      },
      {
        "choiceId": "THR-C21-S09-B2",
        "label": "도상의 출처를 비교한다",
        "action": "도상의 출처를 비교한다",
        "npcReaction": "승려가 유물 관찰과 추정 해석을 나누어 설명한다",
        "followupDialogueOutline": "서아가 도상의 출처를 비교한다 행동을 실행한다. 주민 누리의 후손의 반응: 승려가 유물 관찰과 추정 해석을 나누어 설명한다. 상대의 답을 듣고 현재 갈등인 “고구려 영향과 당 영향을 서로 배척하는 증거로만 읽는다의 처리 결과를 확인한다.",
        "relationshipEffect": "승려가 유물 관찰과 추정 해석을 나누어 설명한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C21-S09-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "고구려 영향과 당 영향을 서로 배척하는 증거로만 읽는다",
      "turn": "서아가 온돌과 이불병좌상·석등·기와를 관찰한다. 계승과 새로운 조합이 함께 나타남을 배운다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "온돌·이불병좌상·불교 문화",
    "questionIds": [],
    "genealogyLinks": [
      "H-H8"
    ],
    "nextSceneId": "THR-C21-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “8~9세기 / 발해 가옥·사찰 기록”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C21-S10",
    "chapterId": "THR-C21",
    "sceneTitle": "전성기 뒤의 빈 기록",
    "historicalYear": "830년 이후→926년",
    "location": "왕계·시간 전환",
    "historicalEventId": "H-H9",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-fa7739b44a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C21-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 사이 왕들의 존재와 불확실한 재위 연대를 표시한다",
    "storyObjective": "서아가 사이 왕들의 존재와 불확실한 재위 연대를 표시한다. 멸망 원인을 사치 하나로 단정하지 않고 거란의 성장을 함께 확인한다.",
    "conflict": "선왕 뒤 곧 마지막 왕이 나온 것으로 편집하려 한다",
    "dialogueOutline": "서아가 사이 왕들의 존재와 불확실한 재위 연대를 표시한다. 멸망 원인을 사치 하나로 단정하지 않고 거란의 성장을 함께 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "선왕 뒤 곧 마지막 왕이 나온 것으로 편집하려 한다",
      "turn": "서아가 사이 왕들의 존재와 불확실한 재위 연대를 표시한다. 멸망 원인을 사치 하나로 단정하지 않고 거란의 성장을 함께 확인한다.",
      "end": "전쟁·제도·전성기·문화의 다양성을 외교와 생활로 경험; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "거란 침입과 발해 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-H9"
    ],
    "nextSceneId": "THR-C22-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “830년 이후→926년 / 왕계·시간 전환”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  }
]
```

## CH.22 나라가 사라진 다음 날

```json
[
  {
    "sceneId": "THR-C22-S01",
    "chapterId": "THR-C22",
    "sceneTitle": "서쪽에서 온 경고",
    "historicalYear": "925년 말~926년 초",
    "location": "발해 국경 마을",
    "historicalEventId": "H-H9",
    "characters": [
      "서아",
      "전령"
    ],
    "backgroundAsset": "BG-2dc4ced86a",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C22-41ff692",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 부여부와 상경 공격의 순서를 지도에 표시한다",
    "storyObjective": "서아가 부여부와 상경 공격의 순서를 지도에 표시한다. 거란 팽창과 외교 고립을 함께 확인한다.",
    "conflict": "거란의 진격 소식이 과장되어 어느 길도 믿지 못한다",
    "dialogueOutline": "서아가 부여부와 상경 공격의 순서를 지도에 표시한다. 거란 팽창과 외교 고립을 함께 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "거란의 진격 소식이 과장되어 어느 길도 믿지 못한다",
      "turn": "서아가 부여부와 상경 공격의 순서를 지도에 표시한다. 거란 팽창과 외교 고립을 함께 확인한다.",
      "end": "멸망·이주·계승을 단일 재난이나 단일 경로로 단순화하지 않음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "거란 침입과 발해 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-H9"
    ],
    "nextSceneId": "THR-C22-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “925년 말~926년 초 / 발해 국경 마을”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C22-S02",
    "chapterId": "THR-C22",
    "sceneTitle": "상경의 마지막 겨울",
    "historicalYear": "926년",
    "location": "상경 피란길",
    "historicalEventId": "H-H9",
    "characters": [
      "서아",
      "주민 은서"
    ],
    "backgroundAsset": "BG-43d25899c5",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C22-085015e",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 필요한 도구와 가족 명단을 나누어 챙긴다",
    "storyObjective": "서아가 필요한 도구와 가족 명단을 나누어 챙긴다. 대인선의 항복과 국가 멸망은 바뀌지 않는다.",
    "conflict": "살림을 버리면 자신들의 삶도 사라진다는 공포",
    "dialogueOutline": "서아가 필요한 도구와 가족 명단을 나누어 챙긴다. 대인선의 항복과 국가 멸망은 바뀌지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C22-S02-B1",
        "label": "가족을 먼저 모은다",
        "action": "가족을 먼저 모은다",
        "npcReaction": "은서가 이름을 잊지 않겠다고 약속한다",
        "followupDialogueOutline": "서아가 가족을 먼저 모은다 행동을 실행한다. 주민 은서의 반응: 은서가 이름을 잊지 않겠다고 약속한다. 상대의 답을 듣고 현재 갈등인 “살림을 버리면 자신들의 삶도 사라진다는 공포의 처리 결과를 확인한다.",
        "relationshipEffect": "은서가 이름을 잊지 않겠다고 약속한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C22-S02-JOIN"
      },
      {
        "choiceId": "THR-C22-S02-B2",
        "label": "생계 도구를 나눈다",
        "action": "생계 도구를 나눈다",
        "npcReaction": "이웃이 운반을 돕고 이후 정착의 단서가 남는다",
        "followupDialogueOutline": "서아가 생계 도구를 나눈다 행동을 실행한다. 주민 은서의 반응: 이웃이 운반을 돕고 이후 정착의 단서가 남는다. 상대의 답을 듣고 현재 갈등인 “살림을 버리면 자신들의 삶도 사라진다는 공포의 처리 결과를 확인한다.",
        "relationshipEffect": "이웃이 운반을 돕고 이후 정착의 단서가 남는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C22-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "살림을 버리면 자신들의 삶도 사라진다는 공포",
      "turn": "서아가 필요한 도구와 가족 명단을 나누어 챙긴다. 대인선의 항복과 국가 멸망은 바뀌지 않는다.",
      "end": "멸망·이주·계승을 단일 재난이나 단일 경로로 단순화하지 않음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "거란 침입과 발해 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-H9"
    ],
    "nextSceneId": "THR-C22-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “926년 / 상경 피란길”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C22-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C22-S03",
    "chapterId": "THR-C22",
    "sceneTitle": "폭발 때문이라는 말",
    "historicalYear": "926년 이후 기록 검토",
    "location": "멸망 원인 자료 공간",
    "historicalEventId": "H-H9",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-da6059417c",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C22-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 연대와 근거를 따로 확인한다",
    "storyObjective": "서아가 연대와 근거를 따로 확인한다. 내분·거란 팽창·대외 관계를 검토하되 단일 원인을 확정하지 않는다.",
    "conflict": "백두산 분화 하나로 멸망을 설명하려는 소문",
    "dialogueOutline": "서아가 연대와 근거를 따로 확인한다. 내분·거란 팽창·대외 관계를 검토하되 단일 원인을 확정하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "백두산 분화 하나로 멸망을 설명하려는 소문",
      "turn": "서아가 연대와 근거를 따로 확인한다. 내분·거란 팽창·대외 관계를 검토하되 단일 원인을 확정하지 않는다.",
      "end": "멸망·이주·계승을 단일 재난이나 단일 경로로 단순화하지 않음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "거란 침입과 발해 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-H9"
    ],
    "nextSceneId": "THR-C22-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “926년 이후 기록 검토 / 멸망 원인 자료 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C22-S04",
    "chapterId": "THR-C22",
    "sceneTitle": "어느 길로 갈 것인가",
    "historicalYear": "926년 이후",
    "location": "유민 이동로",
    "historicalEventId": "H-H10",
    "characters": [
      "서아",
      "유민 안내자"
    ],
    "backgroundAsset": "BG-1f5ffe060c",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C22-70b8af2",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "안내자가 남거나 다른 지역으로 가는 이들도 있다고 말한다",
    "storyObjective": "안내자가 남거나 다른 지역으로 가는 이들도 있다고 말한다. 서아는 고려 귀속의 의의를 다른 이동의 삭제 없이 적는다.",
    "conflict": "고려행만이 모든 발해인의 길이었다는 오해",
    "dialogueOutline": "안내자가 남거나 다른 지역으로 가는 이들도 있다고 말한다. 서아는 고려 귀속의 의의를 다른 이동의 삭제 없이 적는다.",
    "choices": [
      {
        "choiceId": "THR-C22-S04-B1",
        "label": "가족 연락표를 만든다",
        "action": "가족 연락표를 만든다",
        "npcReaction": "헤어지는 사람들이 소식을 잇고 신뢰가 생긴다",
        "followupDialogueOutline": "서아가 가족 연락표를 만든다 행동을 실행한다. 유민 안내자의 반응: 헤어지는 사람들이 소식을 잇고 신뢰가 생긴다. 상대의 답을 듣고 현재 갈등인 “고려행만이 모든 발해인의 길이었다는 오해의 처리 결과를 확인한다.",
        "relationshipEffect": "헤어지는 사람들이 소식을 잇고 신뢰가 생긴다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C22-S04-JOIN"
      },
      {
        "choiceId": "THR-C22-S04-B2",
        "label": "길별 위험을 듣는다",
        "action": "길별 위험을 듣는다",
        "npcReaction": "주민이 정보에 근거해 선택하고 서아는 강요하지 않는다",
        "followupDialogueOutline": "서아가 길별 위험을 듣는다 행동을 실행한다. 유민 안내자의 반응: 주민이 정보에 근거해 선택하고 서아는 강요하지 않는다. 상대의 답을 듣고 현재 갈등인 “고려행만이 모든 발해인의 길이었다는 오해의 처리 결과를 확인한다.",
        "relationshipEffect": "주민이 정보에 근거해 선택하고 서아는 강요하지 않는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C22-S04-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "고려행만이 모든 발해인의 길이었다는 오해",
      "turn": "안내자가 남거나 다른 지역으로 가는 이들도 있다고 말한다. 서아는 고려 귀속의 의의를 다른 이동의 삭제 없이 적는다.",
      "end": "멸망·이주·계승을 단일 재난이나 단일 경로로 단순화하지 않음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "발해 유민의 고려 귀속",
    "questionIds": [],
    "genealogyLinks": [
      "H-H10"
    ],
    "nextSceneId": "THR-C22-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “926년 이후 / 유민 이동로”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C22-S05",
    "chapterId": "THR-C22",
    "sceneTitle": "여덟 해의 간격",
    "historicalYear": "934년",
    "location": "고려 귀부 행렬",
    "historicalEventId": "H-H10",
    "characters": [
      "서아",
      "대광현 관련 연락관"
    ],
    "backgroundAsset": "BG-61cf972bf0",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C22-2234311",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 시간 이동을 표시하고 대광현 등 유민의 고려 귀속을 확인한다",
    "storyObjective": "서아가 시간 이동을 표시하고 대광현 등 유민의 고려 귀속을 확인한다. 실제 행렬의 인원은 사료 확인 전 임의로 정하지 않는다.",
    "conflict": "926년 멸망과934년 귀부를 같은 날로 압축한다",
    "dialogueOutline": "서아가 시간 이동을 표시하고 대광현 등 유민의 고려 귀속을 확인한다. 실제 행렬의 인원은 사료 확인 전 임의로 정하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "926년 멸망과934년 귀부를 같은 날로 압축한다",
      "turn": "서아가 시간 이동을 표시하고 대광현 등 유민의 고려 귀속을 확인한다. 실제 행렬의 인원은 사료 확인 전 임의로 정하지 않는다.",
      "end": "멸망·이주·계승을 단일 재난이나 단일 경로로 단순화하지 않음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "발해 유민의 고려 귀속",
    "questionIds": [],
    "genealogyLinks": [
      "H-H10"
    ],
    "nextSceneId": "THR-C22-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “934년 / 고려 귀부 행렬”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C22-S05-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C22-S06",
    "chapterId": "THR-C22",
    "sceneTitle": "고향을 말할 권리",
    "historicalYear": "934년",
    "location": "고려의 유민 접수처",
    "historicalEventId": "H-H10",
    "characters": [
      "서아",
      "유민 은서의 기록·후대 가족"
    ],
    "backgroundAsset": "BG-d76abf60f2",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C22-52ebc8b",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 계승 의식과 고려의 수용을 듣는다",
    "storyObjective": "서아가 계승 의식과 고려의 수용을 듣는다. 은서가 8년 뒤 늙지 않은 모습으로 등장하지 않도록 연령을 갱신한다.",
    "conflict": "새 땅에 오려면 발해의 이름을 버려야 할까",
    "dialogueOutline": "서아가 계승 의식과 고려의 수용을 듣는다. 은서가 8년 뒤 늙지 않은 모습으로 등장하지 않도록 연령을 갱신한다.",
    "choices": [
      {
        "choiceId": "THR-C22-S06-B1",
        "label": "출신을 정확히 기록한다",
        "action": "출신을 정확히 기록한다",
        "npcReaction": "가족이 기억을 숨길 필요 없다고 느낀다",
        "followupDialogueOutline": "서아가 출신을 정확히 기록한다 행동을 실행한다. 유민 은서의 기록·후대 가족의 반응: 가족이 기억을 숨길 필요 없다고 느낀다. 상대의 답을 듣고 현재 갈등인 “새 땅에 오려면 발해의 이름을 버려야 할까의 처리 결과를 확인한다.",
        "relationshipEffect": "가족이 기억을 숨길 필요 없다고 느낀다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C22-S06-JOIN"
      },
      {
        "choiceId": "THR-C22-S06-B2",
        "label": "생계 요청을 전달한다",
        "action": "생계 요청을 전달한다",
        "npcReaction": "담당자가 생활 지원 논의를 시작한다",
        "followupDialogueOutline": "서아가 생계 요청을 전달한다 행동을 실행한다. 유민 은서의 기록·후대 가족의 반응: 담당자가 생활 지원 논의를 시작한다. 상대의 답을 듣고 현재 갈등인 “새 땅에 오려면 발해의 이름을 버려야 할까의 처리 결과를 확인한다.",
        "relationshipEffect": "담당자가 생활 지원 논의를 시작한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C22-S06-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "새 땅에 오려면 발해의 이름을 버려야 할까",
      "turn": "서아가 계승 의식과 고려의 수용을 듣는다. 은서가 8년 뒤 늙지 않은 모습으로 등장하지 않도록 연령을 갱신한다.",
      "end": "멸망·이주·계승을 단일 재난이나 단일 경로로 단순화하지 않음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "발해 유민의 고려 귀속",
    "questionIds": [],
    "genealogyLinks": [
      "H-H10"
    ],
    "nextSceneId": "THR-C22-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “934년 / 고려의 유민 접수처”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C22-S06-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C22-S07",
    "chapterId": "THR-C22",
    "sceneTitle": "왕의 귀환은 없다",
    "historicalYear": "926년 멸망 기록 회상",
    "location": "유민 기록 모임",
    "historicalEventId": "H-H9",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-20827ace42",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C22-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 확인되지 않은 복국 성공을 만들지 않고 유민의 지속과 이후 부흥 시도는 범위 밖 별도 노트로 둔다.",
    "storyObjective": "서아는 확인되지 않은 복국 성공을 만들지 않고 유민의 지속과 이후 부흥 시도는 범위 밖 별도 노트로 둔다.",
    "conflict": "주민을 위로하려 대인선이 다시 나라를 세웠다는 결말을 쓰려 한다",
    "dialogueOutline": "서아는 확인되지 않은 복국 성공을 만들지 않고 유민의 지속과 이후 부흥 시도는 범위 밖 별도 노트로 둔다.",
    "choices": [],
    "emotionalBeat": {
      "start": "주민을 위로하려 대인선이 다시 나라를 세웠다는 결말을 쓰려 한다",
      "turn": "서아는 확인되지 않은 복국 성공을 만들지 않고 유민의 지속과 이후 부흥 시도는 범위 밖 별도 노트로 둔다.",
      "end": "멸망·이주·계승을 단일 재난이나 단일 경로로 단순화하지 않음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "거란 침입과 발해 멸망",
    "questionIds": [],
    "genealogyLinks": [
      "H-H9"
    ],
    "nextSceneId": "THR-C22-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “926년 멸망 기록 회상 / 유민 기록 모임”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C22-S08",
    "chapterId": "THR-C22",
    "sceneTitle": "남쪽의 900년으로",
    "historicalYear": "934년→900년",
    "location": "시간 이동 기록 공간",
    "historicalEventId": "H-L1",
    "characters": [
      "서아",
      "서아의 독백"
    ],
    "backgroundAsset": "BG-746b6429b6",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C22-ee5fec6",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 유민을 받아들인 나라가 어떻게 생겼는지 묻고900년 완산주로 되돌아간다",
    "storyObjective": "서아는 유민을 받아들인 나라가 어떻게 생겼는지 묻고900년 완산주로 되돌아간다. 기존 고려편의 사건을 다시 완결하지 않는다.",
    "conflict": "고려에 도착한 뒤 다시 고려 건국 이전으로 가는 이유가 필요하다",
    "dialogueOutline": "서아는 유민을 받아들인 나라가 어떻게 생겼는지 묻고900년 완산주로 되돌아간다. 기존 고려편의 사건을 다시 완결하지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "고려에 도착한 뒤 다시 고려 건국 이전으로 가는 이유가 필요하다",
      "turn": "서아는 유민을 받아들인 나라가 어떻게 생겼는지 묻고900년 완산주로 되돌아간다. 기존 고려편의 사건을 다시 완결하지 않는다.",
      "end": "멸망·이주·계승을 단일 재난이나 단일 경로로 단순화하지 않음; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "완산주에서 후백제 건국",
    "questionIds": [],
    "genealogyLinks": [
      "H-L1"
    ],
    "nextSceneId": "THR-C23-S01",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “934년→900년 / 시간 이동 기록 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C22-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  }
]
```

## CH.23 새 나라의 문 앞에서

```json
[
  {
    "sceneId": "THR-C23-S01",
    "chapterId": "THR-C23",
    "sceneTitle": "완산주의 새 깃발",
    "historicalYear": "900년",
    "location": "완산주",
    "historicalEventId": "H-L1",
    "characters": [
      "서아",
      "견훤의 연락관"
    ],
    "backgroundAsset": "BG-91af0664b5",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-7dbaef0",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 서남부 세력의 결집과 후백제의 정치적 계승 주장을 확인한다.",
    "storyObjective": "서아가 서남부 세력의 결집과 후백제의 정치적 계승 주장을 확인한다.",
    "conflict": "옛 백제 이름이 곧 모든 주민의 지지를 뜻하는가",
    "dialogueOutline": "서아가 서남부 세력의 결집과 후백제의 정치적 계승 주장을 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "옛 백제 이름이 곧 모든 주민의 지지를 뜻하는가",
      "turn": "서아가 서남부 세력의 결집과 후백제의 정치적 계승 주장을 확인한다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "완산주에서 후백제 건국",
    "questionIds": [],
    "genealogyLinks": [
      "H-L1"
    ],
    "nextSceneId": "THR-C23-S02",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “900년 / 완산주”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C23-S02",
    "chapterId": "THR-C23",
    "sceneTitle": "백성의 두 세금표",
    "historicalYear": "900년",
    "location": "완산주 장터",
    "historicalEventId": "H-L1",
    "characters": [
      "서아",
      "상인 시온"
    ],
    "backgroundAsset": "BG-bb3266bfe9",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-55a02f2",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 주민의 영수 기록을 정리한다",
    "storyObjective": "서아가 주민의 영수 기록을 정리한다. 새 나라가 생겼다는 사실과 주민의 생활 개선을 구분한다.",
    "conflict": "신라와 새 세력의 요구 사이에서 이중 부담을 걱정한다",
    "dialogueOutline": "서아가 주민의 영수 기록을 정리한다. 새 나라가 생겼다는 사실과 주민의 생활 개선을 구분한다.",
    "choices": [
      {
        "choiceId": "THR-C23-S02-B1",
        "label": "실제 부담을 계산한다",
        "action": "실제 부담을 계산한다",
        "npcReaction": "시온이 구체적인 요구를 만들어 연락관에게 전한다",
        "followupDialogueOutline": "서아가 실제 부담을 계산한다 행동을 실행한다. 상인 시온의 반응: 시온이 구체적인 요구를 만들어 연락관에게 전한다. 상대의 답을 듣고 현재 갈등인 “신라와 새 세력의 요구 사이에서 이중 부담을 걱정한다의 처리 결과를 확인한다.",
        "relationshipEffect": "시온이 구체적인 요구를 만들어 연락관에게 전한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C23-S02-JOIN"
      },
      {
        "choiceId": "THR-C23-S02-B2",
        "label": "상인들의 증언을 모은다",
        "action": "상인들의 증언을 모은다",
        "npcReaction": "혼자 불평하던 사람들이 공동 문제로 인식한다",
        "followupDialogueOutline": "서아가 상인들의 증언을 모은다 행동을 실행한다. 상인 시온의 반응: 혼자 불평하던 사람들이 공동 문제로 인식한다. 상대의 답을 듣고 현재 갈등인 “신라와 새 세력의 요구 사이에서 이중 부담을 걱정한다의 처리 결과를 확인한다.",
        "relationshipEffect": "혼자 불평하던 사람들이 공동 문제로 인식한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C23-S02-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "신라와 새 세력의 요구 사이에서 이중 부담을 걱정한다",
      "turn": "서아가 주민의 영수 기록을 정리한다. 새 나라가 생겼다는 사실과 주민의 생활 개선을 구분한다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "완산주에서 후백제 건국",
    "questionIds": [],
    "genealogyLinks": [
      "H-L1"
    ],
    "nextSceneId": "THR-C23-S03",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “900년 / 완산주 장터”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C23-S02-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C23-S03",
    "chapterId": "THR-C23",
    "sceneTitle": "송악의 젊은 장수",
    "historicalYear": "901년",
    "location": "송악 군영",
    "historicalEventId": "H-L2",
    "characters": [
      "서아",
      "왕건의 부하"
    ],
    "backgroundAsset": "BG-3860cb2142",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-faf0a66",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 당시의 지위와 훗날의 결과를 분리한다",
    "storyObjective": "서아가 당시의 지위와 훗날의 결과를 분리한다. 후고구려 건국의 주체가 궁예임을 확인한다.",
    "conflict": "궁예 휘하의 왕건을 이미 고려왕으로 부른다",
    "dialogueOutline": "서아가 당시의 지위와 훗날의 결과를 분리한다. 후고구려 건국의 주체가 궁예임을 확인한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "궁예 휘하의 왕건을 이미 고려왕으로 부른다",
      "turn": "서아가 당시의 지위와 훗날의 결과를 분리한다. 후고구려 건국의 주체가 궁예임을 확인한다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "후고구려·마진·태봉과 광평성",
    "questionIds": [],
    "genealogyLinks": [
      "H-L2"
    ],
    "nextSceneId": "THR-C23-S04",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “901년 / 송악 군영”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C23-S04",
    "chapterId": "THR-C23",
    "sceneTitle": "바뀌는 나라 이름",
    "historicalYear": "904·911년",
    "location": "국호 변경 기록 공간",
    "historicalEventId": "H-L2",
    "characters": [
      "서아",
      "태봉 서리"
    ],
    "backgroundAsset": "BG-2d29adbe5b",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-45f76cf",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가901·904·911 국호를 한 국가 계열의 변화로 연결한다",
    "storyObjective": "서아가901·904·911 국호를 한 국가 계열의 변화로 연결한다. 이동 연도표를 화면에 계속 표시한다.",
    "conflict": "후고구려·마진·태봉을 세 왕조로 분류한다",
    "dialogueOutline": "서아가901·904·911 국호를 한 국가 계열의 변화로 연결한다. 이동 연도표를 화면에 계속 표시한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "후고구려·마진·태봉을 세 왕조로 분류한다",
      "turn": "서아가901·904·911 국호를 한 국가 계열의 변화로 연결한다. 이동 연도표를 화면에 계속 표시한다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "후고구려·마진·태봉과 광평성",
    "questionIds": [],
    "genealogyLinks": [
      "H-L2"
    ],
    "nextSceneId": "THR-C23-S05",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “904·911년 / 국호 변경 기록 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C23-S05",
    "chapterId": "THR-C23",
    "sceneTitle": "철원의 궁궐과 논",
    "historicalYear": "905년 이후",
    "location": "철원 공사장",
    "historicalEventId": "H-L2",
    "characters": [
      "서아",
      "인부 시온의 친척"
    ],
    "backgroundAsset": "BG-4875fd5126",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-2c92d47",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 궁예의 통치와 광평성 등 관서를 듣고 주민의 부담을 기록한다",
    "storyObjective": "서아가 궁예의 통치와 광평성 등 관서를 듣고 주민의 부담을 기록한다. 병적 성격 하나로 통치를 설명하지 않는다.",
    "conflict": "궁궐 부역이 농사철을 빼앗는다",
    "dialogueOutline": "서아가 궁예의 통치와 광평성 등 관서를 듣고 주민의 부담을 기록한다. 병적 성격 하나로 통치를 설명하지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C23-S05-B1",
        "label": "부역 누락을 확인한다",
        "action": "부역 누락을 확인한다",
        "npcReaction": "관리에게 과중 동원이 드러나고 인부가 목소리를 얻는다",
        "followupDialogueOutline": "서아가 부역 누락을 확인한다 행동을 실행한다. 인부 시온의 친척의 반응: 관리에게 과중 동원이 드러나고 인부가 목소리를 얻는다. 상대의 답을 듣고 현재 갈등인 “궁궐 부역이 농사철을 빼앗는다의 처리 결과를 확인한다.",
        "relationshipEffect": "관리에게 과중 동원이 드러나고 인부가 목소리를 얻는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C23-S05-JOIN"
      },
      {
        "choiceId": "THR-C23-S05-B2",
        "label": "가족의 농사를 돕는다",
        "action": "가족의 농사를 돕는다",
        "npcReaction": "정치적 해결은 미뤄져도 생계 피해를 줄인다",
        "followupDialogueOutline": "서아가 가족의 농사를 돕는다 행동을 실행한다. 인부 시온의 친척의 반응: 정치적 해결은 미뤄져도 생계 피해를 줄인다. 상대의 답을 듣고 현재 갈등인 “궁궐 부역이 농사철을 빼앗는다의 처리 결과를 확인한다.",
        "relationshipEffect": "정치적 해결은 미뤄져도 생계 피해를 줄인다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C23-S05-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "궁궐 부역이 농사철을 빼앗는다",
      "turn": "서아가 궁예의 통치와 광평성 등 관서를 듣고 주민의 부담을 기록한다. 병적 성격 하나로 통치를 설명하지 않는다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "후고구려·마진·태봉과 광평성",
    "questionIds": [
      "official-77-advanced-09"
    ],
    "genealogyLinks": [
      "H-L2"
    ],
    "nextSceneId": "THR-C23-S06",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “905년 이후 / 철원 공사장”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C23-S05-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C23-S06",
    "chapterId": "THR-C23",
    "sceneTitle": "미륵이라는 이름",
    "historicalYear": "태봉 시기",
    "location": "태봉 거리",
    "historicalEventId": "H-L2",
    "characters": [
      "서아",
      "불교 신자"
    ],
    "backgroundAsset": "BG-10c10599ae",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-ab78281",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 권력 정당화의 방식과 종교적 다양성을 분리한다",
    "storyObjective": "서아가 권력 정당화의 방식과 종교적 다양성을 분리한다. 잔혹 전승은 출처와 정치적 맥락을 함께 표시한다.",
    "conflict": "궁예의 미륵 신앙 이용과 불교 일반을 혼동한다",
    "dialogueOutline": "서아가 권력 정당화의 방식과 종교적 다양성을 분리한다. 잔혹 전승은 출처와 정치적 맥락을 함께 표시한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "궁예의 미륵 신앙 이용과 불교 일반을 혼동한다",
      "turn": "서아가 권력 정당화의 방식과 종교적 다양성을 분리한다. 잔혹 전승은 출처와 정치적 맥락을 함께 표시한다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "후고구려·마진·태봉과 광평성",
    "questionIds": [
      "official-61-advanced-11"
    ],
    "genealogyLinks": [
      "H-L2"
    ],
    "nextSceneId": "THR-C23-S07",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “태봉 시기 / 태봉 거리”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C23-S06-Q",
    "questionSlotStatus": "VERIFIED"
  },
  {
    "sceneId": "THR-C23-S07",
    "chapterId": "THR-C23",
    "sceneTitle": "918년의 망설임",
    "historicalYear": "918년",
    "location": "철원 정변 뒤 연락소",
    "historicalEventId": "H-L3",
    "characters": [
      "서아",
      "왕건·장수 연락관"
    ],
    "backgroundAsset": "BG-4d3e7f9b59",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-621e113",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 정변의 주역이 되지 않고 확인된 왕건 즉위·국호 고려·천수 연호를 기록한다.",
    "storyObjective": "서아는 정변의 주역이 되지 않고 확인된 왕건 즉위·국호 고려·천수 연호를 기록한다.",
    "conflict": "새 지도자에게 기대하는 사람과 또 권력이 바뀐다고 두려워하는 사람",
    "dialogueOutline": "서아는 정변의 주역이 되지 않고 확인된 왕건 즉위·국호 고려·천수 연호를 기록한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "새 지도자에게 기대하는 사람과 또 권력이 바뀐다고 두려워하는 사람",
      "turn": "서아는 정변의 주역이 되지 않고 확인된 왕건 즉위·국호 고려·천수 연호를 기록한다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고려 건국과 송악 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-L3"
    ],
    "nextSceneId": "THR-C23-S08",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “918년 / 철원 정변 뒤 연락소”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C23-S08",
    "chapterId": "THR-C23",
    "sceneTitle": "북쪽 사람의 다음 자리",
    "historicalYear": "918년·934년 기록 예고",
    "location": "고려 건국 뒤 서신 공간",
    "historicalEventId": "H-H10",
    "characters": [
      "서아",
      "기록관"
    ],
    "backgroundAsset": "BG-df71c40459",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-b1116b8",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가918→926→934를 다시 정렬한다",
    "storyObjective": "서아가918→926→934를 다시 정렬한다. CH22의 귀부 장면을 재연하지 않고 미래의 수용을 연결한다.",
    "conflict": "건국 순간에 발해가 이미 멸망해 유민이 모두 도착한 것처럼 연출한다",
    "dialogueOutline": "서아가918→926→934를 다시 정렬한다. CH22의 귀부 장면을 재연하지 않고 미래의 수용을 연결한다.",
    "choices": [],
    "emotionalBeat": {
      "start": "건국 순간에 발해가 이미 멸망해 유민이 모두 도착한 것처럼 연출한다",
      "turn": "서아가918→926→934를 다시 정렬한다. CH22의 귀부 장면을 재연하지 않고 미래의 수용을 연결한다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "발해 유민의 고려 귀속",
    "questionIds": [],
    "genealogyLinks": [
      "H-H10"
    ],
    "nextSceneId": "THR-C23-S09",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “918년·934년 기록 예고 / 고려 건국 뒤 서신 공간”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조",
    "questionSlotId": "THR-C23-S08-Q",
    "questionSlotStatus": "TBD_OFFICIAL_OR_LABELLED_CREATIVE"
  },
  {
    "sceneId": "THR-C23-S09",
    "chapterId": "THR-C23",
    "sceneTitle": "송악으로 옮긴 도읍",
    "historicalYear": "919년",
    "location": "송악 이주로",
    "historicalEventId": "H-L3",
    "characters": [
      "서아",
      "상인 시온"
    ],
    "backgroundAsset": "BG-07e0ebe07d",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-55a02f2",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아가 새 도읍으로 가는 물자를 정리하고 기존 고려편의 시작 구간과 겹치는 정책을 확장하지 않는다.",
    "storyObjective": "서아가 새 도읍으로 가는 물자를 정리하고 기존 고려편의 시작 구간과 겹치는 정책을 확장하지 않는다.",
    "conflict": "918년 건국과919년 천도를 같은 해로 혼동한다",
    "dialogueOutline": "서아가 새 도읍으로 가는 물자를 정리하고 기존 고려편의 시작 구간과 겹치는 정책을 확장하지 않는다.",
    "choices": [
      {
        "choiceId": "THR-C23-S09-B1",
        "label": "가족 편지를 묶는다",
        "action": "가족 편지를 묶는다",
        "npcReaction": "시온이 다음 시대에도 연락을 잇겠다고 말한다",
        "followupDialogueOutline": "서아가 가족 편지를 묶는다 행동을 실행한다. 상인 시온의 반응: 시온이 다음 시대에도 연락을 잇겠다고 말한다. 상대의 답을 듣고 현재 갈등인 “918년 건국과919년 천도를 같은 해로 혼동한다의 처리 결과를 확인한다.",
        "relationshipEffect": "시온이 다음 시대에도 연락을 잇겠다고 말한다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C23-S09-JOIN"
      },
      {
        "choiceId": "THR-C23-S09-B2",
        "label": "기록을 지역별로 나눈다",
        "action": "기록을 지역별로 나눈다",
        "npcReaction": "서아가 여러 나라의 기억을 한 승자의 이야기로 덮지 않는다",
        "followupDialogueOutline": "서아가 기록을 지역별로 나눈다 행동을 실행한다. 상인 시온의 반응: 서아가 여러 나라의 기억을 한 승자의 이야기로 덮지 않는다. 상대의 답을 듣고 현재 갈등인 “918년 건국과919년 천도를 같은 해로 혼동한다의 처리 결과를 확인한다.",
        "relationshipEffect": "서아가 여러 나라의 기억을 한 승자의 이야기로 덮지 않는다",
        "historicalOutcomeChange": false,
        "rejoinSceneId": "THR-C23-S09-JOIN"
      }
    ],
    "emotionalBeat": {
      "start": "918년 건국과919년 천도를 같은 해로 혼동한다",
      "turn": "서아가 새 도읍으로 가는 물자를 정리하고 기존 고려편의 시작 구간과 겹치는 정책을 확장하지 않는다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고려 건국과 송악 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-L3"
    ],
    "nextSceneId": "THR-C23-S10",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "분기마다 행동·상대 반응·후속 2~4턴 작성 후 JOIN 합류",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “919년 / 송악 이주로”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  },
  {
    "sceneId": "THR-C23-S10",
    "chapterId": "THR-C23",
    "sceneTitle": "덮지 않는 마지막 장",
    "historicalYear": "919년·후속편 안내",
    "location": "송악 나루·기록책 마감",
    "historicalEventId": "H-L3",
    "characters": [
      "서아",
      "서아의 독백"
    ],
    "backgroundAsset": "BG-ef117cab32",
    "characterAssets": {
      "서아": "EXISTING-SEOA-12",
      "상대": "NPC-C23-ee5fec6",
      "expressionDirection": "서아: 놀람→기본; 상대: 기본. 분기 반응에 맞게 웃음·놀람을 선택; 동일 얼굴·체형 유지"
    },
    "sceneOpening": "서아는 성장·전쟁·문화·유민의 기록을 돌려본다",
    "storyObjective": "서아는 성장·전쟁·문화·유민의 기록을 돌려본다. 935·936년 통일과 태조의 정책은 기존 고려편에서 이어진다고 명시하며 새 결말을 덧쓰지 않는다.",
    "conflict": "역사를 다 배웠으니 이후도 안다고 생각하는 자신을 경계한다",
    "dialogueOutline": "서아는 성장·전쟁·문화·유민의 기록을 돌려본다. 935·936년 통일과 태조의 정책은 기존 고려편에서 이어진다고 명시하며 새 결말을 덧쓰지 않는다.",
    "choices": [],
    "emotionalBeat": {
      "start": "역사를 다 배웠으니 이후도 안다고 생각하는 자신을 경계한다",
      "turn": "서아는 성장·전쟁·문화·유민의 기록을 돌려본다. 935·936년 통일과 태조의 정책은 기존 고려편에서 이어진다고 명시하며 새 결말을 덧쓰지 않는다.",
      "end": "옛 질서의 붕괴와 새 국가의 성립까지만 마무리하고 고려편에 인계; 분기에서 발생한 개인적 손익은 유지하되 역사적 결과는 고정"
    },
    "learningPoint": "고려 건국과 송악 천도",
    "questionIds": [],
    "genealogyLinks": [
      "H-L3"
    ],
    "nextSceneId": "SEASON-END-PLANNED",
    "completionCriteria": [
      "본선 대사 6~10턴과 감정 전환 작성; 수치 채우기식 설명 반복 금지",
      "선택 없는 사건 관찰·행동을 대사로 완성",
      "연도·장소 이동 자막, 사료 사실과 허구 대사 구분",
      "실제 역사 인물 생존 시기와 복식 검수",
      "배경·캐릭터 PC/모바일 렌더링·로드 오류 검수",
      "문제 슬롯은 VERIFIED만 연결, 정답 및 5개 선지 설명 확인"
    ],
    "timeTransition": "이전 씬과 시간·장소가 다르면 기록책이 이전 사건을 닫고 “919년·후속편 안내 / 송악 나루·기록책 마감”을 표시한다. 과거로 돌아가면 재방문임을 명시한다.",
    "fictionNotice": "서아·민간 조연·대화·개인적 행동은 창작. 역사적 사건 결과는 고정.",
    "genealogyLinkType": "사건 ID→계보 문서의 관련사건으로 역참조"
  }
]
```


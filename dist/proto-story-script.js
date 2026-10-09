/* 확정 대사 원문 + 검증된 추가 학습/분기 대사. */
const PROTO_STORY_SCRIPT=[
  {
    "number": 0,
    "title": "낯선 숲에서",
    "scenes": [
      {
        "number": 1,
        "title": "눈을 뜨다",
        "type": "STORY",
        "background": "어두운 숲",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "차가운 바람이 뺨을 스쳤다. 눈을 뜨자 처음 보는 숲이 펼쳐져 있었다."
          },
          {
            "speaker": "주인공",
            "text": "뭐야… 여기가 어디야?"
          },
          {
            "speaker": "주인공",
            "text": "핸드폰은? 아, 진짜 미치겠네."
          }
        ],
        "choices": [],
        "directions": [
          "주인공은 현대복을 입고 있으며 주변을 살핀다."
        ]
      },
      {
        "number": 2,
        "title": "낯선 남자",
        "type": "CHOICE",
        "background": "숲속 길",
        "dialogues": [
          {
            "speaker": "단(???)",
            "text": "거기 누구냐!"
          },
          {
            "speaker": "주인공",
            "text": "으악! 깜짝이야!"
          },
          {
            "speaker": "단",
            "text": "이상한 옷을 입었군. 도적이냐?"
          },
          {
            "speaker": "주인공",
            "text": "아니거든요?! 저도 지금 상황 파악이 안 된다고요!"
          },
          {
            "speaker": "단",
            "text": "말투도 이상하군."
          },
          {
            "speaker": "주인공",
            "text": "그건 그쪽도 마찬가지거든요?"
          }
        ],
        "choices": [
          {
            "label": "도적 아니라고!",
            "result": "단: \"그렇게 소리치는 걸 보니 더 수상하군.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그렇게 소리치는 걸 보니 더 수상하군."
              }
            ]
          },
          {
            "label": "여기가 어디인지부터 알려줘.",
            "result": "단: \"북쪽 교역로 근처다.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "북쪽 교역로 근처다."
              }
            ]
          },
          {
            "label": "혹시 드라마 촬영 중이야?",
            "result": "단: \"드라마? 어느 나라 말이냐?\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "드라마? 어느 나라 말이냐?"
              }
            ]
          }
        ],
        "directions": [
          "세 분기 모두 단이 주인공을 경계하지만 공격하지 않는 결말로 합류한다."
        ]
      },
      {
        "number": 3,
        "title": "모닥불 앞에서",
        "type": "STORY",
        "background": "모닥불",
        "dialogues": [
          {
            "speaker": "단",
            "text": "이름이 무엇이냐?"
          },
          {
            "speaker": "주인공",
            "text": "그냥… 나라고 불러."
          },
          {
            "speaker": "단",
            "text": "이름이 나라고?"
          },
          {
            "speaker": "주인공",
            "text": "아, 아니. 그냥 그렇게 부르라고!"
          },
          {
            "speaker": "단",
            "text": "허허. 참으로 이상한 사람이군."
          },
          {
            "speaker": "주인공",
            "text": "근데 여기가 어디야?"
          },
          {
            "speaker": "단",
            "text": "북쪽 교역로 근처다. 나는 사람을 찾고 있지."
          },
          {
            "speaker": "주인공",
            "text": "누군데?"
          },
          {
            "speaker": "단",
            "text": "내 동생이다. 반년 전 교역단과 함께 떠난 뒤 돌아오지 않았다."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 4,
        "title": "동행 제안",
        "type": "CHOICE",
        "background": "모닥불",
        "dialogues": [
          {
            "speaker": "단",
            "text": "갈 곳이 없다면 함께 가겠느냐?"
          }
        ],
        "choices": [
          {
            "label": "좋아. 대신 먹을 건 챙겨줘.",
            "result": "단: \"먹을 것부터 찾다니. 마음에 드는군.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "먹을 것부터 찾다니. 마음에 드는군."
              }
            ]
          },
          {
            "label": "수상하지만 혼자 있는 것보단 낫겠지.",
            "result": "단: \"나 역시 자네가 수상하네. 서로 감시하면 되겠군.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "나 역시 자네가 수상하네. 서로 감시하면 되겠군."
              }
            ]
          },
          {
            "label": "난 혼자 돌아갈 방법을 찾아볼래.",
            "result": "단: \"이 숲은 위험하다. 적어도 큰길까지는 함께 가지.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "이 숲은 위험하다. 적어도 큰길까지는 함께 가지."
              }
            ]
          }
        ],
        "directions": [
          "모든 선택지는 동행으로 합류한다."
        ]
      },
      {
        "number": 5,
        "title": "첫날의 끝",
        "type": "CINEMATIC",
        "background": "꺼져가는 모닥불",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "모닥불이 서서히 꺼져갔다."
          },
          {
            "speaker": "주인공(속마음)",
            "text": "진짜 과거라면… 나 집에 돌아갈 수 있는 거야?"
          },
          {
            "speaker": "단",
            "text": "잠들지 못하겠느냐?"
          },
          {
            "speaker": "주인공",
            "text": "응. 생각할 게 많아서."
          },
          {
            "speaker": "단",
            "text": "그렇다면 내일 생각하거라. 오늘 밤은 살아남았으니."
          },
          {
            "speaker": "나레이션",
            "text": "그 말이 이상하게 위로가 되었다."
          }
        ],
        "choices": [],
        "directions": [
          "CH.00에는 기출문제를 배치하지 않는다."
        ]
      }
    ]
  },
  {
    "number": 1,
    "title": "사라진 교역단",
    "scenes": [
      {
        "number": 1,
        "title": "부서진 수레",
        "type": "STORY",
        "background": "숲속 교역로",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "며칠째 길을 걷던 두 사람은 숲길에서 부서진 수레를 발견했다."
          },
          {
            "speaker": "주인공",
            "text": "단! 저거 봐!"
          },
          {
            "speaker": "단",
            "text": "……이건."
          },
          {
            "speaker": "주인공",
            "text": "아는 수레야?"
          },
          {
            "speaker": "단",
            "text": "동생이 타고 떠났던 교역단의 표식이다."
          },
          {
            "speaker": "주인공",
            "text": "그럼 여기서 무슨 일이 있었던 거야?"
          },
          {
            "speaker": "주인공",
            "text": "수레만 보고 무슨 일이 생겼다고 단정하진 말자. 사람의 흔적부터 찾아보자."
          },
          {
            "speaker": "단",
            "text": "반년 동안 기다리기만 했네. 이제는 무엇이든 확인하고 싶군."
          }
        ],
        "choices": [
          {
            "label": "수레 안을 먼저 조사해 볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "주인공",
                "text": "깨진 항아리는 있지만 값나가는 상자가 그대로야."
              }
            ]
          },
          {
            "label": "바퀴에 어떤 흔적이 있는지 볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "주인공",
                "text": "바퀴 자국이 여기서 갑자기 멈췄어."
              }
            ]
          },
          {
            "label": "주변에 발자국이 있는지 살펴볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "주인공",
                "text": "발자국이 여러 방향으로 갈라졌어."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 2,
        "title": "남겨진 물건",
        "type": "STORY",
        "background": "수레 내부",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "값나가는 물건은 그대로인데?"
          },
          {
            "speaker": "단",
            "text": "그래서 이상하다는 거다."
          },
          {
            "speaker": "주인공",
            "text": "도적이 아니라면 누가 뒤진 거지?"
          },
          {
            "speaker": "단",
            "text": "무언가를 찾고 있었을지도 모르지."
          }
        ],
        "choices": [
          {
            "label": "사람을 찾았던 걸까?",
            "result": "단은 라온을 떠올리고 침묵한다.",
            "dialogues": [
              {
                "speaker": "단",
                "text": "사람을 찾던 거라면… 라온도 그 안에 있었을까."
              }
            ]
          },
          {
            "label": "문서를 찾았던 걸까?",
            "result": "단은 흩어진 종이를 확인한다.",
            "dialogues": [
              {
                "speaker": "단",
                "text": "흩어진 종이를 보세. 찾던 문서의 흔적이 남았을지도 모르네."
              }
            ]
          },
          {
            "label": "그냥 사고였을 수도 있잖아.",
            "result": "단: \"그렇기를 바라네.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그렇기를 바라네."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 3,
        "title": "동생의 매듭",
        "type": "STORY",
        "background": "수레 옆",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "어? 여기 천 조각이 있어."
          },
          {
            "speaker": "단",
            "text": "……!"
          },
          {
            "speaker": "주인공",
            "text": "왜 그래?"
          },
          {
            "speaker": "단",
            "text": "동생의 것이다."
          },
          {
            "speaker": "주인공",
            "text": "확실해?"
          },
          {
            "speaker": "단",
            "text": "내가 직접 만들어 준 매듭이야."
          },
          {
            "speaker": "주인공",
            "text": "그럼 살아 있을 가능성이 있겠네."
          },
          {
            "speaker": "단",
            "text": "……그랬으면 좋겠군."
          },
          {
            "speaker": "주인공",
            "text": "이 매듭을 보여 주면 라온을 기억하는 사람도 있겠지?"
          },
          {
            "speaker": "단",
            "text": "손끝으로 매듭을 만지작거리는 버릇이 있었어. 긴장하면 더 그랬지."
          },
          {
            "speaker": "주인공",
            "text": "그런 작은 버릇까지 기억하고 있었네."
          },
          {
            "speaker": "단",
            "text": "정작 그 아이가 하던 말은 놓쳤지만."
          }
        ],
        "choices": [
          {
            "label": "분명 살아 있을 거야.",
            "result": "단: \"자네는 참 쉽게 희망을 말하는군.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "자네는 참 쉽게 희망을 말하는군."
              }
            ]
          },
          {
            "label": "더 찾아보자.",
            "result": "단: \"그래. 아직 끝난 게 아니야.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 아직 끝난 게 아니야."
              }
            ]
          },
          {
            "label": "라온은 어떤 사람이었어?",
            "result": "단: \"손으로 무언가 만드는 걸 좋아했지.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "손으로 무언가 만드는 걸 좋아했지."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 4,
        "title": "갈라진 길",
        "type": "STORY",
        "background": "세 갈래 길",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "어느 쪽으로 가야 해?"
          },
          {
            "speaker": "단",
            "text": "흔적이 여기서 갈라진다."
          }
        ],
        "choices": [
          {
            "label": "나는 북쪽 길의 흔적을 확인해 볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "북쪽에는 상인의 짐이 남아 있군. 주인이 가까이 있을지도 모르네."
              }
            ]
          },
          {
            "label": "나는 동쪽 길의 흔적을 확인해 볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "동쪽에 야영 흔적이 있네. 여기서 쉬어 갔나 보군."
              }
            ]
          },
          {
            "label": "주변 마을에서 목격자를 찾아보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "상인",
                "text": "교역단이라면 보았지. 북쪽 길로 향했네."
              }
            ]
          }
        ],
        "directions": [
          "모든 선택지의 결과가 북쪽 교역단으로 이어지도록 한다."
        ]
      },
      {
        "number": 5,
        "title": "북쪽에서 온 상인",
        "type": "STORY",
        "background": "작은 교역 마을",
        "dialogues": [
          {
            "speaker": "상인",
            "text": "부여로 가는 길을 찾는다고?"
          },
          {
            "speaker": "단",
            "text": "그렇소. 혹시 교역단을 보셨소?"
          },
          {
            "speaker": "상인",
            "text": "비슷한 무리를 보기는 했지."
          },
          {
            "speaker": "주인공",
            "text": "부여면 왕이 다스리는 나라 아니야?"
          },
          {
            "speaker": "상인",
            "text": "왕이 있지. 하지만 지역을 다스리는 유력자들의 힘도 크다네."
          }
        ],
        "choices": [
          {
            "label": "부여의 왕은 어떤 일을 해?",
            "result": "",
            "dialogues": [
              {
                "speaker": "상인",
                "text": "왕이 있지만 지역을 다스리는 여러 가의 힘도 크다네."
              }
            ]
          },
          {
            "label": "주변에는 또 어떤 나라들이 있어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "상인",
                "text": "고구려는 산지, 옥저와 동예는 동해안, 삼한은 남쪽에 있지."
              }
            ]
          },
          {
            "label": "그 교역단이 어디로 갔는지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "상인",
                "text": "내가 본 교역단은 부여 쪽 북쪽 길로 갔네."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 6,
        "title": "여러 나라의 지도",
        "type": "LEARNING",
        "background": "교역로 지도",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "그러니까 이 시대에 나라가 하나만 있는 게 아니네?"
          },
          {
            "speaker": "단",
            "text": "그렇지. 저마다 다른 풍습과 질서를 가지고 있네."
          },
          {
            "speaker": "주인공",
            "text": "이름부터 헷갈리는데?"
          },
          {
            "speaker": "단",
            "text": "여행하면서 하나씩 알게 되겠지."
          },
          {
            "speaker": "단",
            "text": "부여는 송화강 유역의 평야, 고구려는 압록강 중류의 산지, 옥저와 동예는 동해안, 삼한은 한반도 남쪽에 자리했지. 동예의 책화는 경계를 지키는 풍습이고, 무천은 10월의 제천 행사라고 들었네."
          },
          {
            "speaker": "주인공",
            "text": "우리 여행 순서가 나라가 세워진 순서는 아닌 거지?"
          },
          {
            "speaker": "단",
            "text": "그렇지. 라온의 흔적을 따라가는 길일 뿐이야. 여러 나라의 풍습을 한 해의 모습으로만 생각해서도 안 되네."
          }
        ],
        "choices": [],
        "directions": [
          "지도에서 부여·고구려·옥저·동예·삼한의 대략적인 위치를 보여준다."
        ],
        "checkpoint": {
          "number": 1,
          "topic": "초기 여러 나라 비교"
        }
      },
      {
        "number": 7,
        "title": "비어 있는 야영지",
        "type": "STORY",
        "background": "옛 야영지",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "여기서 누가 불을 피웠던 것 같아."
          },
          {
            "speaker": "단",
            "text": "교역단이 쉬어 갔을 수도 있지."
          },
          {
            "speaker": "주인공",
            "text": "라온도 여기 있었을까?"
          },
          {
            "speaker": "단",
            "text": "그랬을지도."
          }
        ],
        "choices": [
          {
            "label": "잿더미에 남은 흔적을 살펴볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "철을 가공한 자국이 있군. 라온이 관심을 가졌을 법하네."
              }
            ]
          },
          {
            "label": "나무에 남은 표식이 같은지 확인해 볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "수레의 교역단 표식과 같네. 같은 무리가 쉬어 간 것 같군."
              }
            ]
          },
          {
            "label": "단, 잠깐 쉬었다가 가자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "마음만 급했군. 자네도 지쳤을 텐데, 잠깐 쉬세."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 8,
        "title": "철에 관심을 가진 아이",
        "type": "STORY",
        "background": "야영지",
        "dialogues": [
          {
            "speaker": "단",
            "text": "라온은 어려서부터 쇠붙이를 만지작거렸어."
          },
          {
            "speaker": "주인공",
            "text": "철을 만드는 사람이 되고 싶었던 거야?"
          },
          {
            "speaker": "단",
            "text": "그런 말은 했지."
          },
          {
            "speaker": "주인공",
            "text": "그런데 왜 표정이 그래?"
          },
          {
            "speaker": "단",
            "text": "……아무것도 아니다."
          }
        ],
        "choices": [
          {
            "label": "넌 반대했구나?",
            "result": "단: \"그때는 그게 옳다고 생각했어.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그때는 그게 옳다고 생각했어."
              }
            ]
          },
          {
            "label": "라온은 재능이 있었나 봐.",
            "result": "단: \"그래. 손재주가 좋았지.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 손재주가 좋았지."
              }
            ]
          },
          {
            "label": "더 말하기 어렵다면 지금은 묻지 않을게.",
            "result": "단이 고맙다는 눈빛을 보낸다.",
            "dialogues": [
              {
                "speaker": "단",
                "text": "기다려 줘서 고맙네. 지금은 말을 고르기가 어렵군."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 9,
        "title": "교역의 의미",
        "type": "LEARNING",
        "background": "교역로",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "이렇게 먼 곳까지 물건을 옮기는 이유가 뭐야?"
          },
          {
            "speaker": "단",
            "text": "어떤 곳에는 소금이 귀하고, 어떤 곳에는 철이 귀하니까."
          },
          {
            "speaker": "주인공",
            "text": "서로 필요한 걸 바꾸는 거구나."
          },
          {
            "speaker": "단",
            "text": "그래. 길은 물건뿐 아니라 소식도 옮기지."
          },
          {
            "speaker": "단",
            "text": "변한의 철은 낙랑과 왜로도 나갔지. 동예에서는 단궁·과하마·반어피가 알려져 있고, 삼한에서는 벼농사도 발달했다네."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 2,
          "topic": "초기 국가와 교역"
        }
      },
      {
        "number": 10,
        "title": "북쪽으로",
        "type": "CINEMATIC",
        "background": "북쪽 길",
        "dialogues": [
          {
            "speaker": "단",
            "text": "부여로 가자. 거기에 동생의 흔적이 있을지도 몰라."
          },
          {
            "speaker": "주인공",
            "text": "그래. 같이 찾아보자."
          },
          {
            "speaker": "나레이션",
            "text": "두 사람은 북쪽으로 향했다. 하지만 단은 주머니 속에 감춰 둔 낡은 편지를 꺼내지 않았다."
          }
        ],
        "choices": [],
        "directions": []
      }
    ]
  },
  {
    "number": 2,
    "title": "겨울의 제사",
    "scenes": [
      {
        "number": 1,
        "title": "부여에 도착하다",
        "type": "STORY",
        "background": "부여 마을",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "숙영과 교역 마을을 거치며 여러 주를 걸었다. 북쪽 평야에 닿자 겨울의 첫 바람이 불었다."
          },
          {
            "speaker": "주인공",
            "text": "와, 여긴 진짜 넓다."
          },
          {
            "speaker": "단",
            "text": "부여는 넓은 평야를 바탕으로 성장한 나라다."
          },
          {
            "speaker": "아린",
            "text": "처음 보는 사람들이네?"
          },
          {
            "speaker": "주인공",
            "text": "우리는 사람을 찾고 있어."
          },
          {
            "speaker": "주인공",
            "text": "사람이 많이 오가는 시장이면 소식도 모이겠지."
          },
          {
            "speaker": "단",
            "text": "라온의 이름을 꺼낼 때마다 혹시 나쁜 소식을 듣게 될까 두렵네."
          },
          {
            "speaker": "아린",
            "text": "찾는 사람의 특징부터 말해 봐. 내가 아는 상인들에게도 물어볼게."
          },
          {
            "speaker": "주인공",
            "text": "철을 다루는 일에 관심이 있는 젊은이야. 손으로 만든 매듭도 가지고 있었어."
          },
          {
            "speaker": "단",
            "text": "고맙다. 아직 다 말할 준비는 안 됐지만, 그 아이가 무사한지는 꼭 알고 싶어."
          }
        ],
        "choices": [
          {
            "label": "아린, 마을로 가는 길을 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "중심 마을로 가자. 길을 안내해 줄게."
              }
            ]
          },
          {
            "label": "시장에서 교역단의 소식을 물어볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "시장 상인들에게 먼저 물어볼게. 이쪽이야."
              }
            ]
          },
          {
            "label": "무슨 제사를 준비하는지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "12월의 제천 행사인 영고를 준비하고 있어."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 2,
        "title": "왕과 유력자",
        "type": "LEARNING",
        "background": "부여 중심 취락",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "부여는 왕이 모든 걸 결정해?"
          },
          {
            "speaker": "아린",
            "text": "왕이 있지만 각 지역의 유력자들도 큰 힘을 가지고 있어."
          },
          {
            "speaker": "단",
            "text": "마가·우가·저가·구가 같은 이들이지."
          },
          {
            "speaker": "주인공",
            "text": "이름이 다 동물이네?"
          },
          {
            "speaker": "아린",
            "text": "마가·우가·저가·구가는 가축 이름을 딴 지배층의 칭호야."
          },
          {
            "speaker": "주인공",
            "text": "왕이 모든 지역을 혼자 다스리는 건 아니구나."
          },
          {
            "speaker": "단",
            "text": "왕의 중심 세력과 여러 가의 세력이 결합한 5부족 연맹으로 배우면 이해하기 쉽지."
          }
        ],
        "choices": [
          {
            "label": "사출도가 무엇인지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "왕의 직할지 밖 지역을 여러 가가 나누어 맡는 지배 구조를 말해."
              }
            ]
          },
          {
            "label": "왕은 어디까지 결정할 수 있어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "왕 혼자 모든 일을 결정할 만큼 왕권이 강한 구조는 아니었어."
              }
            ]
          },
          {
            "label": "여러 가는 각 지역에서 어떤 일을 해?",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "자기 지역을 다스리고 군사력도 거느렸지."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 3,
        "title": "사출도의 길",
        "type": "STORY",
        "background": "마을 밖 네 갈래 길",
        "dialogues": [
          {
            "speaker": "아린",
            "text": "이 길은 여러 지역으로 이어져."
          },
          {
            "speaker": "주인공",
            "text": "그럼 교역단도 이 길을 지났겠네."
          },
          {
            "speaker": "단",
            "text": "그랬을 가능성이 높지."
          },
          {
            "speaker": "단",
            "text": "이 네 갈래 길이 사출도의 실제 모습을 그대로 옮긴 지도는 아니야. 사출도는 여러 가가 왕의 직할지 밖을 나누어 다스렸다는 지배 구조를 설명하는 말이지."
          },
          {
            "speaker": "주인공",
            "text": "그러면 한 사람에게만 물어봐서는 라온이 어느 지역으로 갔는지 모를 수도 있겠네."
          },
          {
            "speaker": "아린",
            "text": "그래. 사출도를 맡은 여러 가의 지역에서 온 상인들에게도 물어보자."
          },
          {
            "speaker": "단",
            "text": "급하다고 길부터 달려 나가면 또 소식을 놓치겠군."
          }
        ],
        "choices": [
          {
            "label": "북쪽 길을 다녀온 목격자를 찾아보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "북쪽에서 온 상인이 시장에 있어. 매듭을 보여 주자."
              }
            ]
          },
          {
            "label": "시장에서 거래한 물품을 확인해 보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "철을 다루는 젊은이가 다녀갔다는 소식부터 확인할게."
              }
            ]
          },
          {
            "label": "아린과 함께 영고 준비를 도와보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "고마워. 준비하러 모인 사람들에게도 소식을 물어볼 수 있겠어."
              }
            ]
          }
        ],
        "directions": [],
        "checkpoint": {
          "number": 3,
          "topic": "부여의 정치 구조"
        }
      },
      {
        "number": 4,
        "title": "영고를 준비하는 사람들",
        "type": "STORY",
        "background": "제사 준비 광장",
        "dialogues": [
          {
            "speaker": "아린",
            "text": "곧 영고가 열리거든."
          },
          {
            "speaker": "주인공",
            "text": "영고?"
          },
          {
            "speaker": "아린",
            "text": "겨울 열두 번째 달에 열리는 제천 행사야."
          },
          {
            "speaker": "단",
            "text": "많은 사람이 함께 모이는 날이지."
          },
          {
            "speaker": "주인공",
            "text": "그럼 오늘은 축제 분위기네?"
          }
        ],
        "choices": [
          {
            "label": "나도 준비를 도울게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "고마워. 함께 준비하면서 상인들에게도 물어보자."
              }
            ]
          },
          {
            "label": "영고가 사람들에게 어떤 의미인지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "하늘에 제사를 지내고 사람들이 함께 노래하며 결속을 다지는 행사야."
              }
            ]
          },
          {
            "label": "다른 나라의 제천 행사와는 어떻게 달라?",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "고구려의 동맹과 동예의 무천은 10월이라고 들었네."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 5,
        "title": "제천 행사의 의미",
        "type": "LEARNING",
        "background": "제사 광장",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "하늘에 제사를 지내는 게 왜 그렇게 중요해?"
          },
          {
            "speaker": "아린",
            "text": "사람들이 함께 모여 한 해를 돌아보는 날이기도 하니까."
          },
          {
            "speaker": "단",
            "text": "사람들을 하나로 묶는 역할도 하겠지."
          },
          {
            "speaker": "주인공",
            "text": "그냥 외울 때랑 느낌이 다르네."
          },
          {
            "speaker": "아린",
            "text": "시장에서는 물건을 훔치면 열두 배를 갚아야 한다는 말도 들었을 거야."
          },
          {
            "speaker": "주인공",
            "text": "열두 배나? 잘못 지목되면 정말 큰일이겠네."
          },
          {
            "speaker": "단",
            "text": "1책 12법이라고 하지. 부여와 고구려를 공부할 때 함께 기억할 법이네."
          },
          {
            "speaker": "아린",
            "text": "라온처럼 손재주 좋은 젊은이가 상인의 부러진 손잡이를 고쳐 준 적이 있어. 대가도 받지 않았지."
          },
          {
            "speaker": "단",
            "text": "남이 곤란한 걸 그냥 지나치지 못하던 아이였어."
          },
          {
            "speaker": "주인공",
            "text": "그럼 도둑으로 몰렸다거나 잡혀갔다는 소식은 없는 거지?"
          },
          {
            "speaker": "아린",
            "text": "내가 본 건 누군가를 돕는 모습이야. 모르는 일까지 지어 말하지는 않을게."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 6,
        "title": "풍습을 묻다",
        "type": "LEARNING",
        "background": "주민의 집",
        "dialogues": [
          {
            "speaker": "아린",
            "text": "부여에는 오래전부터 전해지는 여러 풍습이 있어."
          },
          {
            "speaker": "주인공",
            "text": "예를 들면?"
          },
          {
            "speaker": "아린",
            "text": "혼인과 장례에 관한 풍습도 있지."
          },
          {
            "speaker": "단",
            "text": "형사취수제와 순장 같은 풍습을 말하는군."
          },
          {
            "speaker": "주인공",
            "text": "순장은 죽은 지배자와 함께 다른 사람을 묻었다는 풍습이지?"
          },
          {
            "speaker": "아린",
            "text": "응. 지배층의 힘이 사람의 생명까지 좌우했음을 보여 주는 장례 풍습이야."
          },
          {
            "speaker": "주인공",
            "text": "누군가를 잃는 마음을 생각하면 쉽게 넘길 수가 없네."
          },
          {
            "speaker": "단",
            "text": "그래서 더 무사한지 알고 싶네. 하지만 내 걱정만으로 라온의 마음을 정할 수는 없겠지."
          }
        ],
        "choices": [
          {
            "label": "형사취수제가 어떤 풍습인지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "형사취수제는 형이 죽으면 동생이 형수를 아내로 맞는 풍습이라고 전해져. 가족을 유지하는 당시 관습으로 살펴보자."
              }
            ]
          },
          {
            "label": "순장이 어떤 풍습인지 설명해 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "순장은 죽은 지배층과 함께 사람을 묻던 풍습이야. 지배층의 권력과 당시 장례 질서를 보여 주지."
              }
            ]
          },
          {
            "label": "소를 이용한 점복 풍습도 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "소를 잡아 굽이 갈라지는지 보고 길흉을 점쳤다는 기록이 있어. 이를 우제점법이라 부르지."
              }
            ]
          }
        ],
        "directions": [
          "선택한 주제의 역사 설명을 별도 대사로 제공한다."
        ],
        "checkpoint": {
          "number": 4,
          "topic": "부여의 제천 행사와 사회 풍습"
        }
      },
      {
        "number": 7,
        "title": "익숙한 매듭",
        "type": "STORY",
        "background": "아린의 집 앞",
        "dialogues": [
          {
            "speaker": "단",
            "text": "아린, 혹시 이 매듭을 본 적 있느냐?"
          },
          {
            "speaker": "아린",
            "text": "……이건 어디서 났어?"
          },
          {
            "speaker": "단",
            "text": "동생의 물건이다."
          },
          {
            "speaker": "아린",
            "text": "……그렇구나."
          }
        ],
        "choices": [
          {
            "label": "알고 있는 게 있지?",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "본 적은 있어. 하지만 그 젊은이의 부탁도 있어서 망설였어."
              }
            ]
          },
          {
            "label": "천천히 이야기해 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "아린",
                "text": "기다려 줘서 고마워. 내가 직접 본 것부터 말할게."
              }
            ]
          },
          {
            "label": "단, 아린이 말할 때까지 조금 기다리자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 다그친다고 라온의 마음까지 알 수 있는 건 아니겠지."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 8,
        "title": "사라진 손님",
        "type": "STORY",
        "background": "아린의 집",
        "dialogues": [
          {
            "speaker": "아린",
            "text": "몇 달 전 같은 매듭을 가진 젊은이가 이곳에 왔어."
          },
          {
            "speaker": "단",
            "text": "정말이냐?!"
          },
          {
            "speaker": "아린",
            "text": "하지만 오래 머물지는 않았어. 남쪽으로 떠났거든."
          },
          {
            "speaker": "주인공",
            "text": "혼자 떠났어?"
          },
          {
            "speaker": "아린",
            "text": "아니. 누군가와 함께였어."
          },
          {
            "speaker": "단",
            "text": "남쪽으로 떠날 때 다친 곳은 없었느냐?"
          },
          {
            "speaker": "아린",
            "text": "내가 마지막으로 봤을 때는 자기 짐도 직접 챙겼어. 다만 지금 모습까지 아는 건 아니야."
          },
          {
            "speaker": "단",
            "text": "적어도 이곳에서는 무사했군. 그 사실부터 붙잡아야겠어."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 9,
        "title": "말하지 말라는 부탁",
        "type": "STORY",
        "background": "아린의 집",
        "dialogues": [
          {
            "speaker": "단",
            "text": "그 아이가 무슨 말을 남겼느냐?"
          },
          {
            "speaker": "아린",
            "text": "형이 찾아와도 내가 어디로 갔는지 말하지 말라고 했어."
          },
          {
            "speaker": "단",
            "text": "……."
          },
          {
            "speaker": "주인공",
            "text": "잠깐, 그게 무슨 뜻이야?"
          }
        ],
        "choices": [
          {
            "label": "동생이 널 피하는 이유가 있는 거 아냐?",
            "result": "단: \"나도 그게 두렵다.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "나도 그게 두렵다."
              }
            ]
          },
          {
            "label": "분명 이유가 있을 거야.",
            "result": "단: \"그래… 이유가 있겠지.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래… 이유가 있겠지."
              }
            ]
          },
          {
            "label": "지금 말하기 힘들면 그냥 곁에 있을게.",
            "result": "단이 어깨를 가볍게 두드린다.",
            "dialogues": [
              {
                "speaker": "단",
                "text": "말없이 곁에 있어 주는 것도 힘이 되는군."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 10,
        "title": "영고의 밤",
        "type": "CINEMATIC",
        "background": "제사 광장 야경",
        "dialogues": [
          {
            "speaker": "아린",
            "text": "오늘만큼은 다툼을 잠시 내려놓아."
          },
          {
            "speaker": "주인공",
            "text": "사람들이 다 모였네."
          },
          {
            "speaker": "단",
            "text": "나라를 하나로 묶는 데 이런 행사도 중요한 것이겠지."
          },
          {
            "speaker": "주인공",
            "text": "근데 너 아까부터 표정이 안 좋아."
          },
          {
            "speaker": "단",
            "text": "……동생이 날 피하고 있다면, 내가 찾는 게 옳은 일일까?"
          },
          {
            "speaker": "주인공",
            "text": "12월 영고에 모인 사람들 사이에도 라온을 기억하는 사람이 있겠지."
          },
          {
            "speaker": "단",
            "text": "저 웃음소리 속에서 동생 목소리만 찾게 되는군."
          },
          {
            "speaker": "주인공",
            "text": "보고 싶다는 마음은 전하자. 돌아오라고 할지부터 정하지 말고."
          },
          {
            "speaker": "단",
            "text": "만나면 먼저 듣겠다는 말… 아직은 자신 없지만 기억하겠네."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 11,
        "title": "부여에서 배운 것",
        "type": "LEARNING",
        "background": "광장",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "사출도, 영고, 형사취수제… 기억할 게 많네."
          },
          {
            "speaker": "아린",
            "text": "그래도 이곳에서 직접 보고 들었잖아."
          },
          {
            "speaker": "단",
            "text": "그게 오래 기억에 남는 법이지."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 5,
          "topic": "부여 종합"
        }
      },
      {
        "number": 12,
        "title": "남겨진 그림",
        "type": "CINEMATIC",
        "background": "부여 마을 출구",
        "dialogues": [
          {
            "speaker": "아린",
            "text": "그 아이가 남긴 천 조각이 있어."
          },
          {
            "speaker": "단",
            "text": "이건……."
          },
          {
            "speaker": "주인공",
            "text": "길을 그려 놓은 것 같은데?"
          },
          {
            "speaker": "아린",
            "text": "고구려로 향하는 교역로야."
          },
          {
            "speaker": "나레이션",
            "text": "단은 천 조각을 접어 품에 넣었다."
          },
          {
            "speaker": "주인공",
            "text": "그건 만나서 물어봐야 알 수 있지 않을까?"
          },
          {
            "speaker": "단",
            "text": "수레 곁의 매듭과 이 천 조각이 같은 길로 이어지는군."
          },
          {
            "speaker": "주인공",
            "text": "나쁜 일이 생겼다고 단정할 이유는 줄었어. 라온이 왜 떠났는지는 직접 물어보자."
          }
        ],
        "choices": [],
        "directions": []
      }
    ]
  },
  {
    "number": 3,
    "title": "알에서 태어난 왕",
    "scenes": [
      {
        "number": 1,
        "title": "고구려로 가는 길",
        "type": "STORY",
        "background": "산길",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "영고가 끝난 뒤 남쪽 교역로를 따라 몇 주를 이동했다. 산길에서는 상인들의 숙영지를 번갈아 이용했다."
          },
          {
            "speaker": "주인공",
            "text": "산이 진짜 많네."
          },
          {
            "speaker": "단",
            "text": "이곳은 산과 계곡이 많은 지역이지."
          },
          {
            "speaker": "주인공",
            "text": "부여랑 분위기가 완전히 다르다."
          },
          {
            "speaker": "단",
            "text": "나라가 달라지면 살아가는 모습도 달라지는 법이야."
          }
        ],
        "choices": [
          {
            "label": "주변 지형을 살펴볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "산이 많아 길을 돌아가야 하네. 성벽도 지형을 이용했겠지."
              }
            ]
          },
          {
            "label": "교역로가 어디로 이어지는지 확인해 보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "상인들이 쉬는 길을 따라가세. 목격자가 있을지도 모르네."
              }
            ]
          },
          {
            "label": "단, 산길을 걷는 건 괜찮아?",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "괜찮네. 자네야말로 지치면 말하게."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 2,
        "title": "산성에 도착하다",
        "type": "STORY",
        "background": "고구려 산성",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "와, 저 성벽 봐."
          },
          {
            "speaker": "단",
            "text": "험한 지형을 이용해 방어하기 좋은 곳이지."
          },
          {
            "speaker": "주인공",
            "text": "이런 곳을 어떻게 지은 거야?"
          },
          {
            "speaker": "단",
            "text": "많은 사람의 힘이 들어갔겠지."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 3,
        "title": "불가의 이야기꾼",
        "type": "STORY",
        "background": "산성 밖 모닥불",
        "dialogues": [
          {
            "speaker": "이야기꾼",
            "text": "오늘은 우리 나라를 세운 분의 이야기를 들려주마."
          },
          {
            "speaker": "주인공",
            "text": "누군데?"
          },
          {
            "speaker": "이야기꾼",
            "text": "주몽이라 불린 분이지."
          },
          {
            "speaker": "주인공",
            "text": "주몽?!"
          }
        ],
        "choices": [
          {
            "label": "어떻게 태어났어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "이야기꾼",
                "text": "유화와 알에서 태어난 아이에 관한 전승부터 들려주마."
              }
            ]
          },
          {
            "label": "왜 왕이 됐어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "이야기꾼",
                "text": "낯선 땅을 찾아 졸본에 나라를 세웠다는 이야기부터 짚어 보자."
              }
            ]
          },
          {
            "label": "주몽은 어느 나라 사람이었어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "이야기꾼",
                "text": "부여에서 자라 남쪽으로 떠났다는 전승을 먼저 이야기해 주마."
              }
            ]
          }
        ],
        "directions": [
          "각 선택지에 따라 설명 순서를 달리한다."
        ]
      },
      {
        "number": 4,
        "title": "알에서 태어난 아이",
        "type": "LEARNING",
        "background": "주몽 탄생 신화 회상",
        "dialogues": [
          {
            "speaker": "이야기꾼",
            "text": "전승에 따르면 하백의 딸 유화가 알을 낳았다고 하지."
          },
          {
            "speaker": "주인공",
            "text": "알이라고?!"
          },
          {
            "speaker": "이야기꾼",
            "text": "그 알에서 태어난 아이가 주몽이야."
          },
          {
            "speaker": "단",
            "text": "나라의 시작을 설명하는 건국 신화로 전해지는 이야기지."
          },
          {
            "speaker": "주인공",
            "text": "아, 실제 기록과 신화는 구분해야 하는구나."
          }
        ],
        "choices": [
          {
            "label": "유화는 어떤 인물인지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "이야기꾼",
                "text": "유화는 하백의 딸로 전해진다. 신성한 혈통을 설명하는 건국 전승이지."
              }
            ]
          },
          {
            "label": "주몽이라는 이름에는 어떤 뜻이 있어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "이야기꾼",
                "text": "주몽은 활을 잘 쏘는 사람이라는 뜻으로 전해진다."
              }
            ]
          },
          {
            "label": "건국 신화가 어떤 의미인지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "왕의 신성함과 나라의 기원을 설명하는 이야기네. 실제 사건 기록과 구분해야 하지."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 5,
        "title": "부여를 떠난 주몽",
        "type": "LEARNING",
        "background": "주몽의 이동 회상",
        "dialogues": [
          {
            "speaker": "이야기꾼",
            "text": "주몽은 부여를 떠나 새로운 땅을 찾아갔다."
          },
          {
            "speaker": "주인공",
            "text": "왜 떠났는데?"
          },
          {
            "speaker": "이야기꾼",
            "text": "전승에는 그를 시기하고 위협한 이들이 있었다고 해."
          },
          {
            "speaker": "단",
            "text": "익숙한 곳을 떠나는 건 쉬운 일이 아니었겠군."
          },
          {
            "speaker": "주인공",
            "text": "라온도 그런 마음이었을까?"
          },
          {
            "speaker": "나레이션",
            "text": "단은 대답하지 않았다."
          }
        ],
        "choices": [],
        "directions": [
          "단은 대답하지 않는다."
        ]
      },
      {
        "number": 6,
        "title": "졸본의 새로운 나라",
        "type": "LEARNING",
        "background": "졸본 건국 회상",
        "dialogues": [
          {
            "speaker": "이야기꾼",
            "text": "주몽은 기원전 37년 졸본 지역에 고구려를 세웠다고 전해지지."
          },
          {
            "speaker": "주인공",
            "text": "고구려를 세운 왕이 주몽이구나."
          },
          {
            "speaker": "단",
            "text": "동명성왕이라고도 하지."
          },
          {
            "speaker": "주인공",
            "text": "이제 이름이 연결된다."
          },
          {
            "speaker": "이야기꾼",
            "text": "졸본은 오늘날 중국 환인 일대로 추정하지만, 정확한 도읍의 지점을 단정하기는 어렵다. 건국 뒤 국내성으로 중심을 옮기며 나라가 성장한 과정은 또 다른 시대의 이야기란다."
          }
        ],
        "choices": [],
        "directions": [
          "주몽 직접 관련 문제를 우선하고, 부족하면 고구려 건국과 초기 성장에 관한 문제를 사용한다."
        ],
        "checkpoint": {
          "number": 6,
          "topic": "주몽·고구려 건국"
        }
      },
      {
        "number": 7,
        "title": "성문 앞의 검문",
        "type": "STORY",
        "background": "고구려 성문",
        "dialogues": [
          {
            "speaker": "무진",
            "text": "멈춰라! 어디서 온 자들이냐?"
          },
          {
            "speaker": "단",
            "text": "부여에서 온 상인입니다."
          },
          {
            "speaker": "무진",
            "text": "짐을 열어라."
          },
          {
            "speaker": "주인공",
            "text": "왜 이렇게까지 검사해?"
          },
          {
            "speaker": "무진",
            "text": "수상한 자들이 성 안으로 들어오는 걸 막기 위해서다."
          }
        ],
        "choices": [
          {
            "label": "알겠어. 짐을 확인해 봐.",
            "result": "",
            "dialogues": [
              {
                "speaker": "무진",
                "text": "짐을 확인한 뒤 지나가도록 하겠다."
              }
            ]
          },
          {
            "label": "이렇게 검문하는 이유를 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "무진",
                "text": "성 안에 위험한 자가 들어오는 일을 막기 위해서다."
              }
            ]
          },
          {
            "label": "단, 네가 사정을 설명해 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "우리는 부여에서 교역로를 따라왔습니다. 확인이 필요하면 짐을 보십시오."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 8,
        "title": "단의 거짓말",
        "type": "STORY",
        "background": "검문소",
        "dialogues": [
          {
            "speaker": "무진",
            "text": "이 물건은 무엇이냐?"
          },
          {
            "speaker": "주인공",
            "text": "단의 동생이 남긴 물건인데요?"
          },
          {
            "speaker": "무진",
            "text": "동생?"
          },
          {
            "speaker": "단",
            "text": "……그런 사람은 없습니다."
          },
          {
            "speaker": "주인공",
            "text": "뭐?"
          },
          {
            "speaker": "무진",
            "text": "방금은 동생이라고 하지 않았느냐?"
          },
          {
            "speaker": "단",
            "text": "착각하신 겁니다."
          }
        ],
        "choices": [
          {
            "label": "단이 이유가 있어서 한 말이라고 믿을게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "지금은 내 말을 믿어 주게. 나중에 설명하겠네."
              }
            ]
          },
          {
            "label": "단, 사실대로 말해 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "여기서 그 아이의 이름을 알리는 것이 두렵네. 미안하다."
              }
            ]
          },
          {
            "label": "잠깐, 우리는 부여에서 물건을 보러 온 거야.",
            "result": "",
            "dialogues": [
              {
                "speaker": "무진",
                "text": "교역 물품도 확인하겠다. 대답이 자꾸 달라지면 의심받을 수 있다."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 9,
        "title": "성 안의 질서",
        "type": "LEARNING",
        "background": "고구려 마을",
        "dialogues": [
          {
            "speaker": "무진",
            "text": "왕과 여러 대가들이 중요한 일을 함께 의논한다."
          },
          {
            "speaker": "주인공",
            "text": "그게 제가 회의라는 거구나."
          },
          {
            "speaker": "무진",
            "text": "그 말을 어디서 배웠느냐?"
          },
          {
            "speaker": "주인공",
            "text": "아…… 그냥 들었어."
          },
          {
            "speaker": "단",
            "text": "수상한 녀석이군."
          },
          {
            "speaker": "주인공",
            "text": "야! 너까지?!"
          },
          {
            "speaker": "무진",
            "text": "초기 고구려는 5부의 세력이 결합해 성장했지. 제가들은 각자의 지배 기반도 가지고 있었어."
          },
          {
            "speaker": "주인공",
            "text": "제가회의는 중요한 일을 논의하는 회의고, 부여의 사출도는 지역 지배 구조라는 차이가 있네."
          },
          {
            "speaker": "단",
            "text": "이름만 외우면 헷갈리지만, 무엇을 하는지 보면 구분할 수 있지."
          },
          {
            "speaker": "주인공",
            "text": "그 회의에 오가는 사람들 중 라온을 본 사람은 없을까?"
          },
          {
            "speaker": "무진",
            "text": "혼인한 집에 상인들이 묵곤 한다. 먼저 그곳에 물어보아라."
          }
        ],
        "choices": [
          {
            "label": "제가회의가 무엇을 결정하는지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "무진",
                "text": "왕과 여러 제가가 중요한 일을 함께 논의한다."
              }
            ]
          },
          {
            "label": "왕은 어느 정도 권한을 갖고 있어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "무진",
                "text": "왕이 있더라도 여러 부 지배층의 힘도 무시할 수 없지."
              }
            ]
          },
          {
            "label": "부여의 정치 구조와 어떻게 다른지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "부여의 사출도는 지역 지배, 고구려의 제가회의는 중요한 일을 논의하는 회의네."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 10,
        "title": "고구려의 혼인 풍습",
        "type": "LEARNING",
        "background": "마을 주택",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "저 집은 왜 따로 작은 건물이 있어?"
          },
          {
            "speaker": "무진",
            "text": "혼인과 관련된 풍습이 있지."
          },
          {
            "speaker": "단",
            "text": "서옥제를 말하는군."
          },
          {
            "speaker": "주인공",
            "text": "서옥제?"
          },
          {
            "speaker": "무진",
            "text": "혼인을 약속하면 신부 집 뒤에 서옥이라는 작은 집을 짓는다. 신랑은 그곳에서 살다가 자녀가 자라면 아내와 함께 자기 집으로 돌아간다고 전해지지."
          },
          {
            "speaker": "주인공",
            "text": "옥저의 혼인 풍습도 이런 식이야?"
          },
          {
            "speaker": "단",
            "text": "그건 다르다고 들었네. 옥저에 가면 직접 물어보자."
          },
          {
            "speaker": "무진",
            "text": "매듭을 가진 젊은이라면 상인들에게 쇠붙이 다루는 법을 묻던 모습을 봤다."
          },
          {
            "speaker": "단",
            "text": "언제였습니까?"
          },
          {
            "speaker": "무진",
            "text": "이미 떠난 뒤다. 지금 이 집에는 없다."
          },
          {
            "speaker": "단",
            "text": "여기까지 왔는데… 또 늦었군."
          },
          {
            "speaker": "주인공",
            "text": "만나지는 못했지만 라온이 무엇을 찾고 있었는지는 조금씩 알게 됐어."
          }
        ],
        "choices": [],
        "directions": [
          "무진이 서옥제의 내용을 설명한다."
        ]
      },
      {
        "number": 11,
        "title": "동맹의 이야기",
        "type": "LEARNING",
        "background": "마을 광장",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "부여에는 영고가 있었는데 여기는?"
          },
          {
            "speaker": "무진",
            "text": "동맹이라는 제천 행사가 있지."
          },
          {
            "speaker": "주인공",
            "text": "시기는 언제야?"
          },
          {
            "speaker": "무진",
            "text": "열 번째 달에 열리는 행사야."
          },
          {
            "speaker": "단",
            "text": "나라마다 이름과 시기가 다르군."
          },
          {
            "speaker": "주인공",
            "text": "지금은 겨울이니까 10월 동맹에 직접 온 건 아니네."
          },
          {
            "speaker": "무진",
            "text": "그렇지. 오늘은 그 행사에 관해 설명하는 것이다."
          },
          {
            "speaker": "단",
            "text": "부여의 영고는 12월, 고구려의 동맹은 10월이네."
          },
          {
            "speaker": "주인공",
            "text": "라온이 사람들 사이를 다녔다면, 우리도 소문이 어디서 나온 건지 확인하며 가자."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 7,
          "topic": "고구려 정치·사회·제천 행사"
        }
      },
      {
        "number": 12,
        "title": "사라진 교역단의 기록",
        "type": "STORY",
        "background": "성 안 교역소",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "이 표식, 우리 수레에서 본 거랑 같아."
          },
          {
            "speaker": "단",
            "text": "맞아. 라온이 지나간 게 분명해."
          },
          {
            "speaker": "교역상",
            "text": "그 젊은이는 남쪽 바다 쪽으로 떠났소."
          },
          {
            "speaker": "단",
            "text": "손을 뻗으면 닿을 것 같더니 또 먼 길이군."
          },
          {
            "speaker": "교역상",
            "text": "혼자 끌려간 모습은 아니었소. 다른 상인들과 길을 나눠 갔지."
          },
          {
            "speaker": "주인공",
            "text": "옥저에서 멈추면 소식을 남겨 달라고 전해 줄 수 있어?"
          },
          {
            "speaker": "교역상",
            "text": "같은 길을 가는 이에게 부탁해 보겠소. 반드시 만난다고 약속할 수는 없지만."
          }
        ],
        "choices": [
          {
            "label": "그 교역상에게 조금 더 물어보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "교역상",
                "text": "그 표식의 일행은 남쪽 바다로 갔소. 직접 본 길은 거기까지요."
              }
            ]
          },
          {
            "label": "라온의 물건이 맞는지 다시 확인하자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "매듭의 모양은 같네. 하지만 물건만 보고 지금의 안전까지 단정할 수는 없지."
              }
            ]
          },
          {
            "label": "단, 그 편지는 무슨 내용이야?",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "아직 말하기가 어렵군. 다만 라온의 이름을 함부로 알리고 싶지 않았네."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 13,
        "title": "산성에서의 밤",
        "type": "CINEMATIC",
        "background": "산성 야경",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "너 아까 왜 동생이 없다고 했어?"
          },
          {
            "speaker": "단",
            "text": "……그 아이가 누군가에게 쫓기고 있을지도 모르기 때문이야."
          },
          {
            "speaker": "주인공",
            "text": "누구한테?"
          },
          {
            "speaker": "단",
            "text": "그걸 알기 위해 여기까지 온 거다."
          },
          {
            "speaker": "주인공",
            "text": "나한테도 숨기는 게 있어?"
          },
          {
            "speaker": "단",
            "text": "……미안하다."
          },
          {
            "speaker": "주인공",
            "text": "같이 여행하는 사이잖아."
          },
          {
            "speaker": "단",
            "text": "알고 있다. 그래서 더 미안하군."
          },
          {
            "speaker": "단",
            "text": "다시 만나면 미안하다는 말부터 하고 싶네."
          },
          {
            "speaker": "주인공",
            "text": "그 말은 라온에게 남겨 둬. 지금은 다음 길을 함께 확인하자."
          }
        ],
        "choices": [],
        "directions": [
          "단의 거짓말은 무진에게 특정 정보를 노출하지 않으려는 행동이었다는 복선을 유지하되, 실제 위험의 정체는 이후 밝혀지도록 한다."
        ]
      },
      {
        "number": 14,
        "title": "고구려를 떠나며",
        "type": "LEARNING",
        "background": "산성 출구",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "주몽 이야기부터 여기 사람들의 풍습까지, 정말 많이 배웠네."
          },
          {
            "speaker": "단",
            "text": "그만큼 이 나라도 오랜 시간을 지나왔겠지."
          },
          {
            "speaker": "주인공",
            "text": "다음에는 어디로 가?"
          },
          {
            "speaker": "단",
            "text": "옥저로 가자."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 8,
          "topic": "초기 고구려 종합"
        }
      }
    ]
  },
  {
    "number": 4,
    "title": "바다에 남겨진 사람",
    "scenes": [
      {
        "number": 1,
        "title": "바다가 보이는 길",
        "type": "STORY",
        "background": "옥저 해안",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "고구려의 산길에서 동쪽 교역로로 내려와 여러 숙영지를 지났다. 겨울 바다에 닿기까지는 다시 수주가 걸렸다."
          },
          {
            "speaker": "주인공",
            "text": "와, 바다다!"
          },
          {
            "speaker": "단",
            "text": "이곳이 옥저다."
          },
          {
            "speaker": "주인공",
            "text": "부여나 고구려랑 완전히 다르네."
          }
        ],
        "choices": [
          {
            "label": "해안에 남은 흔적부터 살펴보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "배와 소금 짐이 많군. 사람들에게 소식을 물어보세."
              }
            ]
          },
          {
            "label": "마을로 가서 사람들에게 물어보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "소하",
                "text": "우리 마을에 들러도 좋아. 찾는 사람을 설명해 줘."
              }
            ]
          },
          {
            "label": "단, 바다를 보니까 어떤 생각이 들어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "바다는 탁 트였는데 마음은 아직 막혀 있군."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 2,
        "title": "소하와의 만남",
        "type": "STORY",
        "background": "해안 마을",
        "dialogues": [
          {
            "speaker": "소하",
            "text": "처음 보는 사람들이네."
          },
          {
            "speaker": "단",
            "text": "사람을 찾고 있습니다."
          },
          {
            "speaker": "소하",
            "text": "혹시 철을 다루던 젊은이?"
          },
          {
            "speaker": "단",
            "text": "……그를 아십니까?"
          }
        ],
        "choices": [
          {
            "label": "라온은 손으로 무언가 만드는 걸 좋아하는 젊은이야.",
            "result": "",
            "dialogues": [
              {
                "speaker": "소하",
                "text": "그렇다면 내가 본 젊은이와 닮았네. 쇠붙이를 만지곤 했어."
              }
            ]
          },
          {
            "label": "이 매듭을 본 적 있어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "소하",
                "text": "같은 모양을 보았어. 그 젊은이가 손으로 만지작거렸지."
              }
            ]
          },
          {
            "label": "그 젊은이가 어디로 갔는지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "소하",
                "text": "이곳에서 쉬었다가 더 남쪽으로 갔어."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 3,
        "title": "바닷가 사람들의 삶",
        "type": "LEARNING",
        "background": "해안 작업장",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "여기 사람들은 주로 뭘 하면서 살아?"
          },
          {
            "speaker": "소하",
            "text": "농사도 짓고 바다에서 물고기도 잡지."
          },
          {
            "speaker": "단",
            "text": "바다에서 나는 물건도 교역에 쓰이겠군."
          },
          {
            "speaker": "소하",
            "text": "그렇지."
          },
          {
            "speaker": "주인공",
            "text": "저 소금과 어물은 전부 다른 마을에 파는 거야?"
          },
          {
            "speaker": "소하",
            "text": "교역에 쓰는 것도 있지만 고구려에 공납하는 것도 있어."
          },
          {
            "speaker": "단",
            "text": "옥저가 고구려의 지배를 받으며 소금과 어물을 바쳤다는 특징이군."
          },
          {
            "speaker": "소하",
            "text": "라온도 이 짐을 옮기는 사람들에게 남쪽 길을 물었어."
          },
          {
            "speaker": "주인공",
            "text": "물건이 움직이는 길이 소식이 이어지는 길이기도 하네."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 4,
        "title": "어린 신부의 이야기",
        "type": "LEARNING",
        "background": "마을",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "이곳의 혼인 풍습은 다른 곳과 달라?"
          },
          {
            "speaker": "소하",
            "text": "어린 여자아이를 미리 데려와 기르는 풍습이 전해져."
          },
          {
            "speaker": "주인공",
            "text": "그게 민며느리제구나."
          },
          {
            "speaker": "단",
            "text": "시대에 따라 다른 관습이 있었던 것이지."
          },
          {
            "speaker": "소하",
            "text": "민며느리제에서는 어린 여자아이가 장차 혼인할 남자의 집에서 자랐다가, 성장한 뒤 혼인하지."
          },
          {
            "speaker": "주인공",
            "text": "신랑이 신부 집의 서옥에 머무는 고구려의 서옥제와 방향부터 다르네."
          },
          {
            "speaker": "소하",
            "text": "라온은 우리 집에서 잠시 쉬었어. 길을 오래 걸어서 지쳐 있었지."
          },
          {
            "speaker": "단",
            "text": "많이 아팠습니까?"
          },
          {
            "speaker": "소하",
            "text": "쉬고 음식을 먹은 뒤에는 스스로 바닷가까지 걸어갔어. 내 눈으로 본 모습이야."
          },
          {
            "speaker": "단",
            "text": "살아서 여기까지 왔다는 거군요… 그 말을 얼마나 기다렸는지 모르겠습니다."
          }
        ],
        "choices": [
          {
            "label": "민며느리제가 어떤 풍습인지 더 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "비류",
                "text": "어릴 때 신랑 집에서 자란 뒤 성인이 되면 친정으로 돌아가고, 혼인 때 신랑이 예물을 치르는 민며느리제라고 전해져."
              }
            ]
          },
          {
            "label": "고구려의 서옥제와 어떻게 다른지 비교해 보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "비류",
                "text": "옥저의 민며느리제는 어린 신부가 신랑 집에서 자랐고, 고구려 서옥제는 신랑이 신부 집 뒤 서옥에서 살았다는 점을 비교해 봐."
              }
            ]
          },
          {
            "label": "오늘날의 기준과 당시의 관습은 구분해서 생각해야겠네.",
            "result": "",
            "dialogues": [
              {
                "speaker": "주인공",
                "text": "나는 어린아이의 선택을 생각하면 마음이 불편해. 그 감정과 당시 사료에 기록된 관습은 구분해서 이해해야겠어."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 5,
        "title": "가족의 무덤",
        "type": "LEARNING",
        "background": "공동 무덤",
        "dialogues": [
          {
            "speaker": "소하",
            "text": "우리 마을에서는 가족의 뼈를 한곳에 모아 두기도 해."
          },
          {
            "speaker": "주인공",
            "text": "가족 공동 무덤이라는 거네."
          },
          {
            "speaker": "소하",
            "text": "가족을 기억하는 방식이지."
          },
          {
            "speaker": "단",
            "text": "……가족이라는 말이 오늘따라 무겁군."
          },
          {
            "speaker": "소하",
            "text": "기록에는 사람이 죽으면 임시로 묻었다가 뼈를 추려 가족의 나무 곽에 함께 모았다고 해. 옥저에는 강한 왕이 없이 읍군·삼로 같은 군장이 있었지."
          },
          {
            "speaker": "단",
            "text": "남쪽 삼한에는 신지·읍차 같은 지배자와 제사를 맡는 천군, 신성 지역인 소도가 있다고 들었네. 옥저와 비교하면 제사와 정치의 모습도 다르군."
          },
          {
            "speaker": "주인공",
            "text": "가족을 기억하는 방식도 시대마다 다르구나."
          },
          {
            "speaker": "단",
            "text": "같이 있었던 시간만 생각했지, 동생이 앞으로 살고 싶은 삶은 잘 묻지 않았네."
          },
          {
            "speaker": "주인공",
            "text": "만나면 그 앞으로의 시간도 물어보자."
          }
        ],
        "choices": [],
        "directions": [
          "옥저 직접 관련 후보는 2문항뿐이므로, 원문 검증 후 옥저 2문항과 혼인·장례 풍습 비교 1문항을 우선 검토한다. 확보하지 못하면 2문항만 제공하고 부족 사실을 보고한다."
        ],
        "checkpoint": {
          "number": 9,
          "topic": "옥저와 주변 나라 비교"
        }
      },
      {
        "number": 6,
        "title": "기다리던 청년",
        "type": "STORY",
        "background": "소하의 집",
        "dialogues": [
          {
            "speaker": "소하",
            "text": "그 젊은이는 누군가를 기다리고 있었어."
          },
          {
            "speaker": "단",
            "text": "누구를?"
          },
          {
            "speaker": "소하",
            "text": "자기 형이라고 했지."
          },
          {
            "speaker": "주인공",
            "text": "형을 피한다더니 기다렸다고?"
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 7,
        "title": "라온이 남긴 말",
        "type": "STORY",
        "background": "소하의 집",
        "dialogues": [
          {
            "speaker": "소하",
            "text": "다시 만나면 꼭 할 말이 있다고 했어."
          },
          {
            "speaker": "단",
            "text": "……."
          },
          {
            "speaker": "주인공",
            "text": "무슨 말을 하려던 걸까?"
          },
          {
            "speaker": "소하",
            "text": "그건 본인에게 직접 들어야겠지."
          },
          {
            "speaker": "소하",
            "text": "형에게 자기는 괜찮다고 전해 달라는 말은 분명히 했어."
          },
          {
            "speaker": "단",
            "text": "내 소식을 기다린 적도 있었다니… 처음으로 숨이 놓이는군요."
          },
          {
            "speaker": "주인공",
            "text": "부여에서 두려웠던 마음이 여기서는 조금 달라졌나 봐."
          },
          {
            "speaker": "소하",
            "text": "그 마음을 대신 해석하기보다 직접 만나서 들어 줘."
          },
          {
            "speaker": "단",
            "text": "그래야겠지요. 찾아서 데려오는 것만이 답은 아니겠군요."
          }
        ],
        "choices": [
          {
            "label": "단, 라온도 너에게 할 말을 준비하고 있었나 봐.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 그 말을 들을 수만 있다면 좋겠네."
              }
            ]
          },
          {
            "label": "라온이 남긴 단서가 더 있는지 찾아보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "소하",
                "text": "남쪽 길을 물었다는 건 기억해. 그 밖의 일은 지어 말할 수 없구나."
              }
            ]
          },
          {
            "label": "단, 라온과 예전에 무슨 일이 있었어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "내가 그 아이의 선택을 막았던 적이 있네. 이제는 말해야겠군."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 8,
        "title": "형의 기억",
        "type": "CINEMATIC",
        "background": "단의 과거 회상",
        "dialogues": [
          {
            "speaker": "어린 라온",
            "text": "형, 나 철을 다루는 일을 배우고 싶어."
          },
          {
            "speaker": "과거의 단",
            "text": "그런 위험한 일은 안 된다."
          },
          {
            "speaker": "어린 라온",
            "text": "왜 내 말은 안 들어?"
          },
          {
            "speaker": "과거의 단",
            "text": "가족을 위해서야."
          },
          {
            "speaker": "현재 단",
            "text": "그때 나는 그 아이의 말을 끝까지 듣지 않았어."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 9,
        "title": "처음 털어놓는 후회",
        "type": "STORY",
        "background": "해안 절벽",
        "dialogues": [
          {
            "speaker": "단",
            "text": "사실 동생은 내 뜻을 거스르고 떠났어."
          },
          {
            "speaker": "주인공",
            "text": "무슨 뜻?"
          },
          {
            "speaker": "단",
            "text": "그 아이는 자기 삶을 살고 싶어 했지. 나는 그걸 인정하지 못했어."
          }
        ],
        "choices": [
          {
            "label": "라온의 마음도 이해해 봐.",
            "result": "단: \"그래야겠지.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래야겠지."
              }
            ]
          },
          {
            "label": "너도 걱정했으니까 그런 거잖아.",
            "result": "단: \"걱정이 전부를 정당화하진 않겠지.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "걱정이 전부를 정당화하진 않겠지."
              }
            ]
          },
          {
            "label": "직접 만나서 사과해.",
            "result": "단: \"……그럴 수 있다면.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "……그럴 수 있다면."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 10,
        "title": "남쪽을 향해",
        "type": "CINEMATIC",
        "background": "해안길",
        "dialogues": [
          {
            "speaker": "소하",
            "text": "그 젊은이는 더 남쪽으로 갔어."
          },
          {
            "speaker": "단",
            "text": "고맙습니다."
          },
          {
            "speaker": "주인공",
            "text": "이번에는 꼭 만나자."
          },
          {
            "speaker": "단",
            "text": "그래. 이번에는 도망치지 않을 거야."
          },
          {
            "speaker": "주인공",
            "text": "남쪽이라면 동예 쪽 길부터 확인하면 되겠네."
          },
          {
            "speaker": "소하",
            "text": "해안의 읍락마다 경계를 존중해야 해. 마음이 급해도 길 안내부터 구하렴."
          }
        ],
        "choices": [],
        "directions": []
      }
    ]
  },
  {
    "number": 5,
    "title": "넘지 말아야 할 경계",
    "scenes": [
      {
        "number": 1,
        "title": "낯선 경계",
        "type": "STORY",
        "background": "동예의 숲길",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "동해안을 따라 남쪽으로 걸었다. 해빙을 기다리며 쉬어 간 끝에 봄의 동예 읍락에 닿았다."
          },
          {
            "speaker": "주인공",
            "text": "이 길로 가면 빠르다며?"
          },
          {
            "speaker": "단",
            "text": "그럴 텐데…."
          },
          {
            "speaker": "해루",
            "text": "멈춰라!"
          },
          {
            "speaker": "주인공",
            "text": "또 왜?!"
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 2,
        "title": "책화",
        "type": "LEARNING",
        "background": "읍락 경계",
        "dialogues": [
          {
            "speaker": "해루",
            "text": "다른 읍락의 경계를 함부로 넘었군!"
          },
          {
            "speaker": "주인공",
            "text": "길인데 지나가면 안 돼?"
          },
          {
            "speaker": "해루",
            "text": "배상해야 한다!"
          },
          {
            "speaker": "단",
            "text": "……책화로군."
          },
          {
            "speaker": "주인공",
            "text": "책화?"
          },
          {
            "speaker": "단",
            "text": "동예에서는 다른 읍락의 경계를 침범하면 배상을 요구하는 풍습이 있다."
          },
          {
            "speaker": "주인공",
            "text": "모르고 들어왔다고 그냥 넘어갈 일은 아니구나. 어느 경계를 넘었는지 설명해 줘."
          },
          {
            "speaker": "해루",
            "text": "책화는 다른 읍락의 영역을 침범했을 때 소나 말 같은 것으로 배상하게 하는 관습이다."
          },
          {
            "speaker": "단",
            "text": "라온을 찾겠다고 남의 질서를 무시할 수는 없겠지. 먼저 배상 문제를 해결하세."
          }
        ],
        "choices": [
          {
            "label": "경계를 넘어서 미안해. 배상 방법을 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "해루",
                "text": "경계를 침범하면 소나 말 같은 것으로 배상하는 것이 책화다."
              }
            ]
          },
          {
            "label": "길인 줄 알고 왔어. 경계 규칙을 설명해 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "해루",
                "text": "각 읍락의 영역이니 마음대로 넘을 수 없다. 먼저 길을 물었어야지."
              }
            ]
          },
          {
            "label": "단, 책화가 어떤 풍습인지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "책화는 다른 읍락의 경계를 침범했을 때 배상하는 풍습이네."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 3,
        "title": "책임을 지다",
        "type": "STORY",
        "background": "경계 초소",
        "dialogues": [
          {
            "speaker": "해루",
            "text": "누가 먼저 경계를 넘었느냐?"
          },
          {
            "speaker": "단",
            "text": "내가 길을 잘못 안내했다. 책임은 내게 있다."
          },
          {
            "speaker": "주인공",
            "text": "잠깐, 같이 온 거잖아."
          }
        ],
        "choices": [
          {
            "label": "내가 먼저 들어갔어.",
            "result": "단: \"왜 자네가 나서는가?\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "왜 자네가 나서는가?"
              }
            ]
          },
          {
            "label": "둘 다 책임질게.",
            "result": "해루: \"그렇다면 배상에 관해 이야기하자.\"",
            "dialogues": [
              {
                "speaker": "해루",
                "text": "그렇다면 배상에 관해 이야기하자."
              }
            ]
          },
          {
            "label": "배상 방법부터 알려줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "해루",
                "text": "경계를 넘은 사실을 확인한 뒤 소나 말 같은 배상 물품을 정한다."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 4,
        "title": "마을의 규칙",
        "type": "LEARNING",
        "background": "동예 마을",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "마을마다 경계를 그렇게 중요하게 생각해?"
          },
          {
            "speaker": "해루",
            "text": "서로의 영역을 존중해야 분쟁을 막을 수 있으니까."
          },
          {
            "speaker": "단",
            "text": "규칙에는 나름의 이유가 있는 법이지."
          },
          {
            "speaker": "해루",
            "text": "너희가 찾는 젊은이도 길을 물었다. 경계를 알려 주자 돌아서 갔지."
          },
          {
            "speaker": "단",
            "text": "혹시 형에 관한 말은 하지 않았습니까?"
          },
          {
            "speaker": "해루",
            "text": "형이 찾으러 오면 남쪽에서 철을 배우러 간다는 소식을 전해 달라고 했다."
          },
          {
            "speaker": "주인공",
            "text": "이제는 숨겨 달라는 부탁이 아니네. 만날 수 있도록 길을 남겼어."
          },
          {
            "speaker": "단",
            "text": "나도 그 길을 존중하며 가야겠군."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 5,
        "title": "혼인 풍습",
        "type": "LEARNING",
        "background": "마을",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "여기는 혼인 풍습도 달라?"
          },
          {
            "speaker": "해루",
            "text": "같은 씨족 안에서는 혼인하지 않는 풍습이 있지."
          },
          {
            "speaker": "주인공",
            "text": "족외혼이네."
          },
          {
            "speaker": "단",
            "text": "나라별 특징을 구분해 두면 좋겠군."
          },
          {
            "speaker": "해루",
            "text": "10월에는 무천을 열어. 단궁·과하마·반어피도 우리 고장의 물산이지. 천군과 소도를 둔 삼한과는 다르다네."
          },
          {
            "speaker": "주인공",
            "text": "같은 씨족 안에서 혼인하지 않는 족외혼과, 경계를 침범하면 배상하는 책화는 서로 다른 풍습이네."
          },
          {
            "speaker": "해루",
            "text": "그렇지. 둘을 하나의 혼인 규칙으로 생각하면 안 된다."
          },
          {
            "speaker": "단",
            "text": "사람과 사람 사이에도 저마다 지켜야 할 선이 있다는 걸 배우는군."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 10,
          "topic": "동예의 사회 풍습"
        }
      },
      {
        "number": 6,
        "title": "무천의 이야기",
        "type": "LEARNING",
        "background": "마을 광장",
        "dialogues": [
          {
            "speaker": "해루",
            "text": "우리에게는 무천이라는 제천 행사가 있다."
          },
          {
            "speaker": "주인공",
            "text": "부여는 영고였는데 여긴 무천이네."
          },
          {
            "speaker": "해루",
            "text": "열 번째 달에 하늘에 제사를 지내지."
          },
          {
            "speaker": "단",
            "text": "서로 다른 풍습이 있지만 모두 자신의 삶을 이어가는 사람들이지."
          },
          {
            "speaker": "주인공",
            "text": "봄에 온 우리는 무천에 직접 참여한 게 아니라 10월 행사 이야기를 듣는 거구나."
          },
          {
            "speaker": "해루",
            "text": "맞다. 떠날 때가 급하더라도 오늘이 무천인 것처럼 생각하지는 마라."
          }
        ],
        "choices": [],
        "directions": [
          "행사에 직접 참여하는 시점이 아니라면 주민의 설명으로 처리한다."
        ]
      },
      {
        "number": 7,
        "title": "동예의 특산물",
        "type": "LEARNING",
        "background": "교역장",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "저 물건들은 뭐야?"
          },
          {
            "speaker": "해루",
            "text": "우리 지역에서 나는 귀한 물건들이지."
          },
          {
            "speaker": "단",
            "text": "단궁, 과하마, 반어피 같은 것이 알려져 있네."
          },
          {
            "speaker": "주인공",
            "text": "이름이 특이해서 오히려 기억나겠다."
          },
          {
            "speaker": "주인공",
            "text": "과하마는 어떤 말이야?"
          },
          {
            "speaker": "해루",
            "text": "과수나무 아래를 지날 만큼 작은 말이라는 뜻으로 알려졌지. 단궁은 활, 반어피는 바다에서 얻는 가죽 물산이야."
          },
          {
            "speaker": "단",
            "text": "이 물산을 나르는 상인들이 삼한으로도 가겠군요."
          },
          {
            "speaker": "해루",
            "text": "남쪽 교역장으로 가는 길을 물어보면 된다. 라온도 그 길을 택했다."
          },
          {
            "speaker": "주인공",
            "text": "이번에는 길이 분명해졌어. 가서 기다리는 마음부터 전하자."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 8,
        "title": "떠나는 사람의 마음",
        "type": "STORY",
        "background": "숲길",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "단, 라온도 자기만의 경계를 지키고 싶었던 걸까?"
          },
          {
            "speaker": "단",
            "text": "……그럴지도."
          },
          {
            "speaker": "주인공",
            "text": "네가 그 경계를 넘은 거고?"
          },
          {
            "speaker": "단",
            "text": "듣기 아프지만 틀린 말은 아니군."
          }
        ],
        "choices": [
          {
            "label": "너무 자책하지는 마.",
            "result": "단: \"고맙다.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "고맙다."
              }
            ]
          },
          {
            "label": "이제라도 존중하면 되잖아.",
            "result": "단: \"그럴 수 있기를.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그럴 수 있기를."
              }
            ]
          },
          {
            "label": "라온에게 직접 물어봐.",
            "result": "단: \"그래. 이번에는 꼭.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 이번에는 꼭."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 9,
        "title": "다시 길 위에서",
        "type": "STORY",
        "background": "남쪽 교역로",
        "dialogues": [
          {
            "speaker": "해루",
            "text": "남쪽으로 가면 여러 교역상이 모이는 곳이 있어."
          },
          {
            "speaker": "단",
            "text": "그곳에 철을 다루는 사람도 있겠습니까?"
          },
          {
            "speaker": "해루",
            "text": "그럴 가능성이 높지."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 10,
        "title": "인정",
        "type": "CINEMATIC",
        "background": "저녁 숲길",
        "dialogues": [
          {
            "speaker": "단",
            "text": "나는 동생을 지킨다고 생각했어."
          },
          {
            "speaker": "주인공",
            "text": "……."
          },
          {
            "speaker": "단",
            "text": "하지만 어쩌면 그 아이의 길을 막고 있었던 건지도 모르지."
          },
          {
            "speaker": "주인공",
            "text": "그걸 이제라도 알았으면 된 거 아닐까?"
          },
          {
            "speaker": "단",
            "text": "……너는 참 쉽게 말하는군."
          },
          {
            "speaker": "주인공",
            "text": "나도 쉬운 건 아니거든."
          },
          {
            "speaker": "단",
            "text": "하하. 그래. 이제는 나도 달라져야겠지."
          }
        ],
        "choices": [],
        "directions": []
      }
    ]
  },
  {
    "number": 6,
    "title": "철을 가진 사람들",
    "scenes": [
      {
        "number": 1,
        "title": "남쪽의 교역장",
        "type": "STORY",
        "background": "삼한 교역장",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "산길과 해안길을 오가며 몇 주 더 이동했다. 남쪽의 여러 소국을 잇는 교역장에서 철을 두드리는 소리가 들렸다."
          },
          {
            "speaker": "주인공",
            "text": "여긴 사람들이 엄청 많네."
          },
          {
            "speaker": "단",
            "text": "삼한의 여러 소국이 교역하는 곳이다."
          },
          {
            "speaker": "비류",
            "text": "철을 구하러 왔나?"
          },
          {
            "speaker": "단",
            "text": "아니. 사람을 찾고 있소."
          }
        ],
        "choices": [
          {
            "label": "시장에서 철 교역 소식을 물어볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "비류",
                "text": "변한의 철은 멀리 낙랑과 왜로도 나가지."
              }
            ]
          },
          {
            "label": "비류, 이 매듭을 본 적 있어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "비류",
                "text": "그 매듭이라면 기억나네. 찾는 사람이 철을 배우던 젊은이인가?"
              }
            ]
          },
          {
            "label": "철을 두드리는 소리가 나는 작업장을 찾아보자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "비류",
                "text": "화덕 가까이는 위험해. 작업을 방해하지 않고 이 길로 가게."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 2,
        "title": "삼한의 여러 소국",
        "type": "LEARNING",
        "background": "교역 지도",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "삼한이면 세 나라야?"
          },
          {
            "speaker": "비류",
            "text": "마한·진한·변한이라고 부르지만, 각각 여러 소국으로 이루어져 있지."
          },
          {
            "speaker": "단",
            "text": "지역마다 유력자가 있겠군."
          },
          {
            "speaker": "주인공",
            "text": "그냥 세 왕국이라고 생각하면 안 되겠네."
          },
          {
            "speaker": "주인공",
            "text": "그러면 삼한 전체에 왕 한 명이 있는 구조도 아니네."
          },
          {
            "speaker": "비류",
            "text": "그렇지. 마한·진한·변한의 여러 소국과 각 소국의 지배자를 구분해야 하네."
          },
          {
            "speaker": "단",
            "text": "여기에서 라온의 매듭을 알아보는 사람이 있을까?"
          },
          {
            "speaker": "비류",
            "text": "서두르지 말고 작업장과 소도를 잇는 길부터 살펴보게."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 3,
        "title": "소국의 지배자",
        "type": "LEARNING",
        "background": "취락",
        "dialogues": [
          {
            "speaker": "비류",
            "text": "소국마다 신지나 읍차 같은 지배자가 있지."
          },
          {
            "speaker": "주인공",
            "text": "이름이 낯설다."
          },
          {
            "speaker": "단",
            "text": "여러 나라를 다니다 보니 통치 방식도 다양하군."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 4,
        "title": "철을 만드는 사람들",
        "type": "LEARNING",
        "background": "제철 작업장",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "와, 저걸 직접 만드는 거야?"
          },
          {
            "speaker": "비류",
            "text": "철을 다루는 기술이 있어야 농기구와 무기도 만들 수 있지."
          },
          {
            "speaker": "단",
            "text": "라온이 배우고 싶어 하던 일이군."
          },
          {
            "speaker": "주인공",
            "text": "그럼 정말 여기 있을지도 몰라."
          },
          {
            "speaker": "비류",
            "text": "변한에서는 철을 생산해 낙랑과 왜에 수출하며 교환에도 썼다고 하지. 삼한의 소국에는 신지·읍차 같은 정치 지도자가 있고, 천군은 신성 지역 소도에서 제사를 맡는다네."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 11,
          "topic": "삼한의 정치·경제"
        }
      },
      {
        "number": 5,
        "title": "철의 가치",
        "type": "STORY",
        "background": "교역장",
        "dialogues": [
          {
            "speaker": "비류",
            "text": "철은 먼 지역으로도 나가네."
          },
          {
            "speaker": "주인공",
            "text": "바다 건너까지?"
          },
          {
            "speaker": "비류",
            "text": "그렇지."
          },
          {
            "speaker": "단",
            "text": "이런 기술이 있으면 많은 사람이 찾아오겠군."
          },
          {
            "speaker": "주인공",
            "text": "낙랑과 왜에서도 철을 구하러 왔다면, 시장에 다른 말과 물건도 많이 오갔겠다."
          },
          {
            "speaker": "비류",
            "text": "철은 변한의 중요한 생산물이자 교역품이었으니까."
          },
          {
            "speaker": "단",
            "text": "라온이 왜 이곳으로 오고 싶어 했는지 이제 조금 알겠군."
          },
          {
            "speaker": "주인공",
            "text": "찾은 뒤에는 어디로 데려갈지보다 어떤 일을 배우고 있는지부터 물어보자."
          }
        ],
        "choices": [
          {
            "label": "철을 어디로 교역하는지 알려 줘.",
            "result": "",
            "dialogues": [
              {
                "speaker": "비류",
                "text": "변한에서 생산한 철은 낙랑과 왜로 나갔다고 전해져. 덩이쇠를 교환 수단으로도 썼지."
              }
            ]
          },
          {
            "label": "철로 만든 농기구는 어디에 써?",
            "result": "",
            "dialogues": [
              {
                "speaker": "비류",
                "text": "철제 농기구는 땅을 갈고 작물을 거두는 일을 도왔네. 농업 생산에도 중요한 기술이지."
              }
            ]
          },
          {
            "label": "무기는 어떤 과정을 거쳐 만들어?",
            "result": "",
            "dialogues": [
              {
                "speaker": "비류",
                "text": "뜨겁게 달군 철을 두드려 모양을 잡네. 자네는 위험하니 화덕에서 물러서 있게."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 6,
        "title": "천군과 소도",
        "type": "LEARNING",
        "background": "신성 구역",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "저곳은 왜 분위기가 달라?"
          },
          {
            "speaker": "비류",
            "text": "소도라는 신성한 장소이지."
          },
          {
            "speaker": "주인공",
            "text": "천군이 제사를 주관한다는 곳?"
          },
          {
            "speaker": "비류",
            "text": "그렇지."
          },
          {
            "speaker": "단",
            "text": "정치와 제사의 역할이 구분되는 모습이군."
          },
          {
            "speaker": "주인공",
            "text": "신지·읍차는 정치, 천군은 제사를 맡는 제정 분리라는 특징이네."
          },
          {
            "speaker": "비류",
            "text": "소도는 신성한 곳이어서 정치 지배자의 권력이 함부로 미치지 못한다고 하지."
          },
          {
            "speaker": "단",
            "text": "라온도 이곳에서 쉬었습니까?"
          },
          {
            "speaker": "비류",
            "text": "이 근처를 다니는 건 보았네. 건강한 모습이었지. 지금 어디 있는지는 작업장 사람들에게 직접 묻게."
          },
          {
            "speaker": "단",
            "text": "이제 정말 가까워졌군. 만나도 말을 재촉하지 않아야 할 텐데."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 7,
        "title": "제사의 의미",
        "type": "STORY",
        "background": "소도 주변",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "이곳에서는 왜 천군이 중요한 거야?"
          },
          {
            "speaker": "비류",
            "text": "제사를 주관하는 사람이기 때문이지."
          },
          {
            "speaker": "단",
            "text": "우리가 부여와 동예에서 들은 행사와도 비교할 수 있겠군."
          },
          {
            "speaker": "주인공",
            "text": "논에서는 사람들이 함께 일하던데?"
          },
          {
            "speaker": "비류",
            "text": "벼농사에는 함께 힘을 모으는 일이 중요하지. 삼한의 공동 노동 풍습은 두레의 기원과 연결해 배우기도 하네. 후대 두레의 조직이 그대로 있었다고 단정하는 건 조심해야 하고."
          },
          {
            "speaker": "단",
            "text": "5월 씨뿌리기를 마친 뒤와 10월 추수 뒤에는 제천 행사도 열었다지."
          },
          {
            "speaker": "주인공",
            "text": "부여 영고는 12월, 고구려 동맹과 동예 무천은 10월, 삼한은 5월과 10월이구나."
          },
          {
            "speaker": "비류",
            "text": "밭일을 도운 젊은이가 철을 배우러 갔다는 소식도 들었네. 매듭을 보여 주면 누군가는 알아볼 걸세."
          },
          {
            "speaker": "단",
            "text": "고맙소. 이번에는 그 아이의 말을 들으러 가겠소."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 12,
          "topic": "천군·소도·삼한의 특징"
        }
      },
      {
        "number": 8,
        "title": "익숙한 매듭",
        "type": "STORY",
        "background": "철 작업장 앞",
        "dialogues": [
          {
            "speaker": "단",
            "text": "이 매듭을 가진 젊은이를 본 적 있소?"
          },
          {
            "speaker": "비류",
            "text": "……아, 그 사람."
          },
          {
            "speaker": "단",
            "text": "알고 있소?!"
          },
          {
            "speaker": "비류",
            "text": "그 사람이라면 이곳에서 철을 다루는 일을 배웠지."
          },
          {
            "speaker": "주인공",
            "text": "지금 어디 있어?"
          },
          {
            "speaker": "비류",
            "text": "그건 본인에게 직접 물어보는 게 좋겠군."
          },
          {
            "speaker": "주인공",
            "text": "매듭에서 시작해서 여기까지 이어졌네."
          },
          {
            "speaker": "단",
            "text": "물건의 흔적만 찾았는데, 그 길에는 라온의 선택도 남아 있었군."
          },
          {
            "speaker": "주인공",
            "text": "이제 문 앞까지 가보자. 나도 함께 있을게."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 9,
        "title": "문 앞에서",
        "type": "CINEMATIC",
        "background": "작업장 문",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "단, 왜 안 들어가?"
          },
          {
            "speaker": "단",
            "text": "……겁이 나는군."
          },
          {
            "speaker": "주인공",
            "text": "동생이 없을까 봐?"
          },
          {
            "speaker": "단",
            "text": "아니. 만나면 무슨 말을 해야 할지 모르겠어."
          }
        ],
        "choices": [
          {
            "label": "그냥 보고 싶었다고 해.",
            "result": "단: \"그 말부터 해야겠군.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그 말부터 해야겠군."
              }
            ]
          },
          {
            "label": "먼저 사과해.",
            "result": "단: \"그래. 그래야겠지.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 그래야겠지."
              }
            ]
          },
          {
            "label": "내가 먼저 들어갈까?",
            "result": "단: \"아니. 내가 가겠다.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "아니. 내가 가겠다."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 10,
        "title": "마침내 만나다",
        "type": "CINEMATIC",
        "background": "철 작업장",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "작업장 안쪽에서 한 청년이 걸어 나왔다."
          },
          {
            "speaker": "단",
            "text": "……라온?"
          },
          {
            "speaker": "라온",
            "text": "형."
          },
          {
            "speaker": "단",
            "text": "살아 있었구나."
          },
          {
            "speaker": "라온",
            "text": "……응."
          },
          {
            "speaker": "단",
            "text": "왜 돌아오지 않았어?"
          },
          {
            "speaker": "라온",
            "text": "돌아가면 형은 또 내게 상단 일을 하라고 할 거잖아."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 11,
        "title": "형제의 갈등",
        "type": "STORY",
        "background": "작업장",
        "dialogues": [
          {
            "speaker": "단",
            "text": "나는 네가 걱정돼서……."
          },
          {
            "speaker": "라온",
            "text": "형은 한 번도 내가 무엇을 하고 싶은지 묻지 않았어."
          },
          {
            "speaker": "단",
            "text": "……."
          },
          {
            "speaker": "라온",
            "text": "나는 내 삶을 살고 싶었어."
          }
        ],
        "choices": [
          {
            "label": "단에게 라온의 이야기를 들어보라고 한다",
            "result": "단: \"그래. 이번에는 네가 먼저 말해 보아라.\"",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 이번에는 네가 먼저 말해 보아라."
              }
            ]
          },
          {
            "label": "라온에게 단의 걱정을 설명한다",
            "result": "라온: \"알아. 하지만 내 선택도 존중받고 싶어.\"",
            "dialogues": [
              {
                "speaker": "라온",
                "text": "알아. 하지만 내 선택도 존중받고 싶어."
              }
            ]
          },
          {
            "label": "자리를 비켜준다",
            "result": "두 형제가 단둘이 대화를 시작한다.",
            "dialogues": [
              {
                "speaker": "나레이션",
                "text": "두 형제가 단둘이 대화를 시작한다."
              }
            ]
          }
        ],
        "directions": []
      },
      {
        "number": 12,
        "title": "라온이 떠난 이유",
        "type": "CINEMATIC",
        "background": "작업장",
        "dialogues": [
          {
            "speaker": "라온",
            "text": "부여에서는 형을 만나기가 두려웠어."
          },
          {
            "speaker": "단",
            "text": "그래서 아린에게 말하지 말라고 했구나."
          },
          {
            "speaker": "라온",
            "text": "그런데 옥저에 갔을 때는 마음이 달라졌어."
          },
          {
            "speaker": "단",
            "text": "……."
          },
          {
            "speaker": "라온",
            "text": "형이 내 말을 들어줄지도 모른다고 생각했거든."
          },
          {
            "speaker": "단",
            "text": "수레 곁에서 찾은 이 편지에는 상단 사람이 너를 데려오겠다는 말이 있었어. 내가 너를 돌아오게 하라고 보냈던 사람이지. 그래서 성문에서 네 이름을 숨겼다."
          },
          {
            "speaker": "라온",
            "text": "교역단이 흩어진 뒤 다른 상인과 함께 남쪽으로 왔어. 도적에게 잡힌 건 아니야. 형을 만나면 다시 내 뜻을 꺾을까 봐 두려웠어."
          },
          {
            "speaker": "단",
            "text": "내가 만든 두려움을 남의 위협이라고만 생각했구나. 미안하다. 이제 네 말을 끝까지 듣겠다."
          }
        ],
        "choices": [],
        "directions": [
          "이 대사로 CH.02의 '형을 피했다'와 CH.04의 '형을 기다렸다'는 증언을 자연스럽게 연결한다."
        ]
      },
      {
        "number": 13,
        "title": "각자의 삶",
        "type": "STORY",
        "background": "작업장 앞",
        "dialogues": [
          {
            "speaker": "단",
            "text": "라온, 네가 이곳에서 살고 싶다면 그렇게 해라."
          },
          {
            "speaker": "라온",
            "text": "……정말?"
          },
          {
            "speaker": "단",
            "text": "대신 가끔 소식은 전해다오."
          },
          {
            "speaker": "라온",
            "text": "응. 약속할게."
          },
          {
            "speaker": "주인공",
            "text": "이제 좀 형제 같네."
          },
          {
            "speaker": "라온",
            "text": "형은 원래 이렇게 고집이 셌어."
          },
          {
            "speaker": "단",
            "text": "네가 할 말은 아니지."
          },
          {
            "speaker": "주인공",
            "text": "ㅋㅋ 둘이 똑같네."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 14,
        "title": "철을 가진 사람들",
        "type": "LEARNING",
        "background": "교역장 석양",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "철이 사람의 삶을 바꾼다는 말, 이제 알 것 같아."
          },
          {
            "speaker": "단",
            "text": "라온에게는 새로운 삶을 선택하게 해 준 기술이었겠지."
          },
          {
            "speaker": "비류",
            "text": "이곳에서 많은 사람이 각자의 일을 배워 가네."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 13,
          "topic": "삼한 종합"
        }
      }
    ]
  },
  {
    "number": 7,
    "title": "마지막 갈림길",
    "scenes": [
      {
        "number": 1,
        "title": "여행의 끝",
        "type": "STORY",
        "background": "교역로",
        "dialogues": [
          {
            "speaker": "단",
            "text": "우리는 참 많은 곳을 다녔군."
          },
          {
            "speaker": "주인공",
            "text": "부여도 가고, 고구려도 가고, 바다도 보고."
          },
          {
            "speaker": "단",
            "text": "그때마다 자네는 이상한 질문을 했지."
          },
          {
            "speaker": "주인공",
            "text": "야! 배우는 중이었다고."
          },
          {
            "speaker": "단",
            "text": "하하. 알고 있다."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 2,
        "title": "부여와 고구려의 기억",
        "type": "LEARNING",
        "background": "회상",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "영고는 부여, 동맹은 고구려."
          },
          {
            "speaker": "단",
            "text": "그리고 고구려를 세운 왕은?"
          },
          {
            "speaker": "주인공",
            "text": "주몽! 동명성왕!"
          },
          {
            "speaker": "단",
            "text": "이제 제법 아는군."
          },
          {
            "speaker": "주인공",
            "text": "처음부터 잘 알았거든?"
          },
          {
            "speaker": "단",
            "text": "동예의 무천도 10월이지. 삼한은 씨뿌리기를 마친 5월과 추수를 마친 10월에 제사를 지낸다고 전해진다네. 우리는 겨울 영고를 보았지만, 동맹과 무천은 주민의 설명으로 들었지."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 14,
          "topic": "부여·고구려 종합"
        }
      },
      {
        "number": 3,
        "title": "바다와 경계의 기억",
        "type": "STORY",
        "background": "회상",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "옥저에서는 가족 공동 무덤도 봤지."
          },
          {
            "speaker": "단",
            "text": "동예에서는 책화 때문에 곤란한 일을 겪었고."
          },
          {
            "speaker": "주인공",
            "text": "그때 네가 책임지겠다고 했잖아."
          },
          {
            "speaker": "단",
            "text": "그 여행에서 배운 것이 많았지."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 4,
        "title": "마지막 역사 시험",
        "type": "LEARNING",
        "background": "교역 지도",
        "dialogues": [
          {
            "speaker": "주인공",
            "text": "이제 원삼국 시대는 꽤 잘 알 것 같아."
          },
          {
            "speaker": "단",
            "text": "그렇다면 마지막으로 기억을 정리해 보겠나?"
          },
          {
            "speaker": "주인공",
            "text": "뭐야, 갑자기 시험 보는 기분인데?"
          },
          {
            "speaker": "단",
            "text": "부여의 사출도·영고, 고구려의 제가 회의·서옥제·동맹, 옥저의 민며느리제·가족 공동 무덤, 동예의 책화·족외혼·무천·특산물, 삼한의 천군·소도·철 교역을 떠올려 보게."
          }
        ],
        "choices": [],
        "directions": [],
        "checkpoint": {
          "number": 15,
          "topic": "원삼국 전체 종합"
        }
      },
      {
        "number": 5,
        "title": "돌아갈 길",
        "type": "STORY",
        "background": "갈림길",
        "dialogues": [
          {
            "speaker": "단",
            "text": "이제 어디로 갈 생각이냐?"
          },
          {
            "speaker": "주인공",
            "text": "글쎄. 나도 내가 어디로 가야 하는지 모르겠어."
          },
          {
            "speaker": "단",
            "text": "처음 만났을 때와 똑같군."
          },
          {
            "speaker": "주인공",
            "text": "야, 그건 좀 너무한 거 아니야?"
          },
          {
            "speaker": "단",
            "text": "하하. 농담이다."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 6,
        "title": "마지막 부탁",
        "type": "STORY",
        "background": "갈림길",
        "dialogues": [
          {
            "speaker": "단",
            "text": "너와 함께한 여행은 참 이상했어."
          },
          {
            "speaker": "주인공",
            "text": "왜?"
          },
          {
            "speaker": "단",
            "text": "처음에는 아무것도 모르는 사람인 줄 알았는데, 가끔은 모든 것을 아는 사람처럼 굴더군."
          },
          {
            "speaker": "주인공",
            "text": "……."
          },
          {
            "speaker": "단",
            "text": "하지만 가장 중요한 건 자네에게 배웠어."
          },
          {
            "speaker": "주인공",
            "text": "뭔데?"
          },
          {
            "speaker": "단",
            "text": "사람은 각자 다른 길을 갈 수 있다는 것."
          },
          {
            "speaker": "주인공",
            "text": "……그런 걸 내가 알려줬나?"
          },
          {
            "speaker": "단",
            "text": "그렇지. 자네는 기억하지 못하는 모양이지만."
          }
        ],
        "choices": [],
        "directions": []
      },
      {
        "number": 7,
        "title": "마지막 선택",
        "type": "CHOICE",
        "background": "갈림길",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "갈림길 앞에서 단과 마지막 인사를 나눈다."
          }
        ],
        "choices": [
          {
            "label": "언젠가 다시 만나자.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 다음에는 내가 자네를 찾아가도록 하지."
              },
              {
                "speaker": "주인공",
                "text": "약속이다?"
              }
            ]
          },
          {
            "label": "그동안 고마웠어. 잘 살아.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "고마운 것은 나다. 자네가 없었다면 아직도 동생을 찾아 헤매고 있었을 테니."
              },
              {
                "speaker": "주인공",
                "text": "……잘 가, 단."
              }
            ]
          },
          {
            "label": "나도 내 길을 찾아볼게.",
            "result": "",
            "dialogues": [
              {
                "speaker": "단",
                "text": "그래. 누구의 길도 아닌, 자네만의 길을 찾아라."
              },
              {
                "speaker": "주인공",
                "text": "너도."
              }
            ]
          }
        ],
        "directions": [
          "선택에 따라 마지막 표정과 작별 대사가 달라진다."
        ]
      },
      {
        "number": 8,
        "title": "에필로그",
        "type": "CINEMATIC",
        "background": "해 질 무렵의 길",
        "dialogues": [
          {
            "speaker": "나레이션",
            "text": "두 사람은 서로 다른 방향으로 걸어갔다."
          },
          {
            "speaker": "나레이션",
            "text": "뒤돌아보았을 때 단은 아직 그 자리에 서 있었다."
          },
          {
            "speaker": "주인공(속마음)",
            "text": "이상하다. 처음에는 집에 돌아갈 생각뿐이었는데."
          },
          {
            "speaker": "주인공(속마음)",
            "text": "이제는 이곳에서 만난 사람들이 자꾸 생각난다."
          }
        ],
        "choices": [],
        "directions": [
          "단이 멀어지는 장면으로 마무리한다.",
          "단의 사망, 노년화, 강제 재회 장면을 추가하지 않는다."
        ]
      }
    ]
  }
];
const PROTO_EXAM_ASSIGNMENTS=[[1,6,["64-basic-02"]],[1,9,["70-advanced-02"]],[2,3,["60-advanced-02","62-advanced-02"]],[2,6,["64-advanced-02","66-basic-02"]],[2,11,["61-basic-03","68-advanced-03","73-basic-02"]],[3,6,[]],[3,11,["57-advanced-03"]],[3,14,["76-advanced-02"]],[4,5,["66-advanced-02","67-basic-02","73-advanced-04"]],[5,5,["69-advanced-03","77-advanced-03"]],[6,4,["61-advanced-02","77-basic-02"]],[6,7,["78-advanced-03"]],[6,14,[]],[7,2,["67-advanced-02"]],[7,4,["57-basic-02","63-advanced-02","79-advanced-02"]]];

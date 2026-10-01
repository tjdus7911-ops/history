# CH.02 에셋 사용 명세

CH.02 신규 에셋은 CH.01의 `chapter-02-teaser`, `future-flow`, 도윤·주인공 포트레이트를 직접 스타일 기준으로 사용했습니다. 공통 기준은 **선화가 보이는 2D 한국 웹툰 일러스트, 셀 채색, 짙은 네이비·아이보리·따뜻한 금색, 하단 UI 여백**입니다. 사진·실사·3D 질감은 사용하지 않습니다.

| assetId | sceneId / character | expression / background | 설명 | 상태 |
|---|---|---|---|---|
| `ch02-gaegyeong-market` | `ch02_transition`, `ch02_market`, `ch02_life_path` | 949년 개경 시장 | 통일 뒤 성장한 시장과 백성의 생활, 도윤의 상단 꿈 | 사용 |
| `ch02-slave-dispute` | `ch02_dispute`, `ch02_trust` | 956년 시장 | 양인 출신 남자와 귀족 집안 관리인의 충돌 | 사용 |
| `chapter-02-teaser` | `ch02_inspection` | 관청 문서 조사 | CH.01에서 제작한 문서 조사 장면 재사용 | 재사용 |
| `ch02-freed-citizen` | `ch02_policy_reason`, `ch02_policy_memory` | 신분 회복 | 조사 뒤 양인 신분을 되찾는 순간 | 사용 |
| `ch02-nobles-night` | `ch02_noble_night`, `ch02_exam_eve` | 야간 상점 | 광종의 정책에 반발하는 귀족들과 시험 전날의 긴장 | 사용 |
| `ch02-exam-notice` | `ch02_exam_notice`, `ch02_three_way`, `ch02_ssanggi` | 958년 관청 거리 | 과거제 시행 소식, 현우 등장과 세 사람의 첫 케미 | 사용 |
| `ch02-exam-yard` | `ch02_exam_day`와 응원 선택 결과 | 과거 시험장 | 자신의 꿈을 걸고 시험장으로 들어가는 현우 | 사용 |
| `ch02-reign-titles` | `ch02_reign_titles`, `ch02_reign_followup` | 광덕·준풍 상징 | 독자적 연호와 왕의 권위 | 사용 |
| `ch02-purge-night` | `ch02_purge` | 960년 긴장된 밤 | 호족 숙청의 두려움을 비폭력적으로 표현 | 사용 |
| `ch02-complete` | CH.02 결과/홈 썸네일 | 개경 새벽 | 정책과 왕권 강화의 흐름을 회수 | 사용 |
| `ch03-teaser` | CH.03 티저 | 성종 대 궁궐 | 최승로가 시무 28조를 올리는 다음 이야기 | 사용 |
| `hyunwoo_neutral` | 현우 | `neutral`, 투명 | 차분한 기본 표정, 연녹색 포와 책 | 사용 |
| `hyunwoo_worried` | 현우 | `worried`, 투명 | 시험 직전 긴장 | 사용 |
| `hyunwoo_smile` | 현우 | `smile`, 투명 | 격려 뒤 안도하는 미소 | 사용 |
| `player_goryeo_*` 7종 | 주인공 | 투명 포트레이트 | CH.01 평민복 획득 이후 동일 얼굴·머리와 고려 복식 유지 | 신규 사용 |

단역 NPC의 독립 포트레이트는 아직 `ASSET_REQUIRED`이며, 현재 장면에서는 인물이 포함된 완성 일러스트로 표현합니다. 세부 목록은 `CHARACTER_ASSET_REQUIRED.md`에 기록했습니다.

CH.02의 노화 미스터리 장면은 서사 진행 속도 조정에 따라 삭제했습니다. 주인공의 외형 변화에 관한 복선은 CH.04~05 이후 충분한 시간 경과가 생긴 뒤 별도 에셋 계획으로 다시 검토합니다.

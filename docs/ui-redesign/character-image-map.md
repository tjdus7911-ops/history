# 캐릭터 이미지 백업 및 매핑

이번 Preview 작업에서 원본 파일은 덮어쓰거나 삭제하지 않았습니다. 백업 파일은 되돌리기용으로 별도 보관합니다.

| 원본 | 백업 | 상태 |
|---|---|---|
| `dist/media/proto-v4/player.webp` | `docs/ui-redesign/character-backup/player.webp` | 원본 유지, 프로토타입 스토리 캐릭터 이미지 |
| `dist/media/proto-v4/player-v2.png` | `docs/ui-redesign/character-backup/player-v2.png` | 원본 유지, 이전 프로토타입 캐릭터 시안 |
| `dist/media/proto-v4/player-v3.png` | `docs/ui-redesign/character-backup/player-v3.png` | 원본 유지, 이전 프로토타입 캐릭터 시안 |
| `dist/icons/icon-source.png` | 해당 없음 | 저장소에 이미 있던 신규 마스코트 원본. 채점 결과 화면에 사용 |
| `dist/icons/icon-192.png` | 해당 없음 | 홈 학습 응원 영역에 사용. 원본 유지 |

`dist/data.js`가 참조하는 `assets/characters/player_*` 원본 파일은 이 체크아웃의 `dist/assets/`에 포함되어 있지 않습니다. 해당 파일을 수정하지 않았으며, 시대별 스토리의 의상별 주인공 교체는 원본 리소스 확보 후 적용해야 합니다.

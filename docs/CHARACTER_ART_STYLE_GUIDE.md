# PROJECT CHARACTER ART STYLE GUIDE

이 문서는 `눈떠보니 한국사`의 모든 시대·주인공·NPC에 공통으로 적용하는 캐릭터 제작 기준이다. 시대에 따라 복식과 인물은 달라져도, 캐릭터는 모두 같은 게임에서 나온 것처럼 보여야 한다.

## 1. 기준 자산

새 캐릭터를 만들기 전에 아래 원격 저장소 자산을 반드시 함께 확인한다. 이 파일들은 스타일 기준이며, 기존 고려편 자산을 재생성하거나 덮어쓰지 않는다.

- `dist/assets/v2/characters/player-goryeo-neutral.webp`
- `dist/assets/v2/characters/doyun-young-neutral.webp`
- `dist/assets/v2/characters/hyunwoo-neutral.webp`
- `dist/assets/v2/characters/yeon-neutral.webp`
- 조선 여자 주인공 기준형: `dist/assets/editorial/protagonists/joseon-neutral.webp`

기준에서 읽어야 할 요소는 선 굵기, 얼굴 단순화, 눈·코·입의 표현, 피부와 의상의 셀 셰이딩, 색감, 인체 비율, 전신 크롭, 투명 배경 가장자리다. 기준 인물의 얼굴이나 포즈를 복제하는 용도로 사용하지 않는다.

## 2. 필수 스타일

- 깔끔한 2D 애니메이션/한국 웹툰 중간 스타일
- 멀리서도 읽히는 일관된 선화와 분명한 실루엣
- 피부는 단순한 평면색과 2~3단계의 부드러운 셀 셰이딩
- 눈·코·입은 실제 사람처럼 묘사하지 않고 명확하게 스타일화
- 의상 재질과 문양은 모바일 화면에서 뭉개지지 않을 정도로 단순화
- 주인공은 충분한 디테일을 유지하고, NPC는 같은 시각 언어 안에서 디테일을 조금 줄일 수 있음
- 역사 인물은 복식·연령·역할을 참고하되 초상화 복제가 아닌 게임 캐릭터로 재해석
- 캐릭터 스프라이트는 투명 배경, 투명 모서리, 배경·빛무리·비네트·그림자·문자 없음
- 기본 납품 규격은 세로형 2:3, 640×960 WebP. 별도 UI 요구가 있으면 같은 비율과 시각 밀도를 유지

## 3. 금지 스타일

다음 특성이 하나라도 강하면 최종 자산으로 사용하지 않는다.

- photorealistic / semi-photorealistic portrait
- 모공·피부 결·사진 조명처럼 보이는 실제 사람 얼굴
- 사진을 일러스트 필터로 변환한 듯한 질감
- 3D 렌더, 시네마틱 실사 인물, 광택이 강한 AI 모델 초상
- 중국 무협 모바일 게임 또는 여성향 로맨스 게임풍 과장
- 역사적 근거가 없는 판타지 갑옷·장식·무기
- 기존 캐릭터와 얼굴·머리·실루엣이 사실상 중복되는 신규 인물
- 불투명 배경, 검은 배경, 색 번짐, 후광, 배경 잔상

## 4. 조선 여자 주인공 연속성

중립 표정의 단일 기준형은 `dist/assets/editorial/protagonists/joseon-neutral.webp`이다. 아래 15개 상태는 모두 동일한 얼굴형, 눈·코·입 비율, 머리와 땋은 머리, 붉은 리본, 저고리·치마, 가방과 소지품을 유지한다. 얼굴이 다른 사람처럼 변하면 실패다.

- neutral
- confused
- surprised
- smile
- laugh
- worried
- sad
- crying
- angry
- determined
- fear
- shock
- thinking
- tired
- relieved

표정 파생 작업은 기준형을 첫 번째 참조로 사용하고, 프롬프트에 "identity, costume, hairstyle, crop를 고정하고 표정만 변경"을 명시한다. 중립 파일을 다른 폴더에 복제하지 않고 canonical 파일 하나만 사용한다.

## 5. NPC 제작 규칙

1. 역할, 연령, 얼굴형, 눈썹, 머리, 체형, 색 팔레트를 먼저 정의한다.
2. 스타일 참조와 인물 정체성 참조를 구분한다. 스타일 참조 인물의 얼굴을 새 NPC에 복제하지 않는다.
3. 관리·상인·선비·농민·군인·궁궐 인물·전쟁 인물·후기 인물은 복식과 실루엣만으로도 구분되어야 한다.
4. 같은 역할의 인물이 여러 명이면 얼굴형, 연령, 주조색, 소지품 중 최소 두 항목을 다르게 한다.
5. 실존 인물은 대표적인 연령·복식·직무 특징만 반영하고, 사진·영정의 피부 질감이나 얼굴을 그대로 복제하지 않는다.

## 6. 생성 프롬프트 체크리스트

필수 문구:

- `clean 2D Korean webtoon/anime illustration`
- `prominent consistent line art`
- `stylized eyes, nose, and mouth`
- `flat simplified skin and soft cel shading in 2-3 tonal steps`
- `clear mobile-readable silhouette`
- `truly transparent empty background with transparent corners`

필수 부정 문구:

- `no photorealism, semi-real portrait, realistic skin, pores, photo texture`
- `no 3D render, cinematic human, glossy AI portrait`
- `no wuxia mobile game, otome romance style, glamour, or fantasy`
- `no glow, vignette, gradient, shadow, scenery, or text`

## 7. 저장 전 QA

- 기준 자산과 나란히 놓았을 때 선화·얼굴 단순화·명암 단계가 같은가?
- 모바일 축소 화면에서도 얼굴과 역할이 구분되는가?
- 새 인물이 기존 인물의 복제처럼 보이지 않는가?
- 동일 인물의 표정 세트가 같은 얼굴·복식·머리를 유지하는가?
- 투명 모서리와 알파 가장자리가 정상이며 배경 잔상이 없는가?
- 파일명, 역할, 시대, 표현명이 자산 맵과 일치하는가?
- 교체 전 파일의 코드 참조를 확인했는가?
- 교체 후 누락 참조, 예전 경로, 중복 파일이 없는가?
- `npm run build`와 `npm test`가 모두 통과하는가?

배경은 별도 원칙을 따른다. 역사 환경 배경은 painterly하고 상세할 수 있지만, 그 위에 놓이는 캐릭터는 반드시 이 문서의 2D 셀 셰이딩 기준을 지킨다.

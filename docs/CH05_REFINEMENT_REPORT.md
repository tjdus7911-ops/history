# CH.05 개선 검수 보고서

기준 main: 503f7920759dc2f575953ee8c34f9d37f41231de.

연 전용 캐릭터 assets/characters/ch05-yeon-traveler.webp를 신규 제작했다. 청록색 여행복·갈색 머리띠·짐가방으로 현우와 구별한다. CH.05의 모든 연 발화/선택 결과에서 동일 이미지를 사용한다. CH.06 이후 연과 기존 주인공/도윤/현우 매핑은 그대로 유지했다.

## 실제 기출

회차 | 급수 | 번호 | 정답 | PDF 페이지 | 배치 scene | 원본 확인
---|---|---|---|---|---|---
67 | 기본 | 13 | ① | 4 | ch05_builders | 서희 담판 연표, 문제지·정답표 확인
73 | 기본 | 11 | ① | 3 | ch05_terms | 서희 인물 자료, 문제지·정답표 확인
77 | 기본 | 12 | ④ | 3 | ch05_memory | 담판 이후 사건 순서, 문제지·정답표 확인

기존 9개 연습 문항을 삭제하지 않고 실제 기출 3개를 추가했다. 최종 12문제 = 기출 3 + 심화 연습 9. 기존 3문항 세트 3개와 신규 기출 1문항 세트 3개를 이야기 사이에 배치했다. 문제 이미지 전체와 4개 선택 버튼, 정답/오답, 해설, 역사 키워드, 스토리 복귀는 기존 공통 UI를 사용한다.

제공된 14회차 PDF의 키워드와 고려 대외 관계 문항을 재검색했다. 67·73·77회 기본 PDF는 D:에 없어 국사편찬위원회 공식 시험 자료실에서 원본 문제지/정답표를 추가 확보했다. 초조대장경·몽골·윤관 문제나 서희가 단순 오답 보기인 문항을 CH.05 직접 기출로 부풀리지 않았다. 다른 챕터의 미확인 기출은 이 작업에서 수정하지 않았다.

- 제67회: https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000029979
  - 문제지 SHA-256: 641980cef3a53061cc6eb677d15def23663ed381b594b7d58377dcd116df606b
  - 정답표 SHA-256: baedd11e1b5365c8c56a3c77a7a6013afbd8035fa6322e9cac51cd6d0d719ed6
  - 이미지: assets/exams/ch05/67-basic-13.webp (580×777)
- 제73회: https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030051
  - 문제지 SHA-256: f7298700bf31c5a423de5de5d4fe433d68ff0a945c8b872097e9b6673f3f4e7d
  - 정답표 SHA-256: a70ecf88728e4423f6cb880f27f469caba38a3a61a8ce97082a4610aec40ec4f
  - 이미지: assets/exams/ch05/73-basic-11.webp (572×613)
- 제77회: https://www.historyexam.go.kr/pst/view.do?bbs=dat&pst_sno=1000030109
  - 문제지 SHA-256: 6f1c581280de0369fd7a060cc8e9ef40648eaa630d7da3d5f838e88bfa755563
  - 정답표 SHA-256: a5c299275098c3559bfb86075bad164ff6e57f3fab4bdbd59f8bddce6f7f9f75
  - 이미지: assets/exams/ch05/77-basic-12.webp (582×684)

## 배경

신규 768×1152 WebP 4개: ch05-frontier-invasion.webp(남하하는 거란과 방어선), ch05-council-crisis.webp(긴장한 고려 조정), ch05-khitan-withdrawal.webp(북쪽으로 멀어지는 철수 기병), ch05-gangdong-fortifications.webp(압록강 동쪽의 성벽·공사·마을). 기존 route-caravan(북방 장터), ch05-seohui-negotiation(담판 군영), late-night(1009년 정변 전후 개경)을 재사용했다. 장면 12개의 매핑은 dist/ch05-refinement.js의 CH05_BACKGROUND_MAP에 기록했다. 기존 이미지 파일을 덮어쓰거나 삭제하지 않았다.

## 생성 방식과 프롬프트 세트

내장 image_gen 도구 사용. 기존 게임에 맞춘 2:3 세로, 사실적인 회화 배경/반실사 캐릭터, 현대 건물·조선 궁궐 장식·일본풍·문자 제외.

- frontier: 993 Goryeo northern frontier north of Cheongcheon river, distant Khitan mounted army approaches, foreground stone/earth fortress and Goryeo sentries, tense autumn afternoon.
- council: 993 Goryeo royal council in Gaegyeong, ministers debating territorial concessions in a tenth-century timber hall, cloudy daylight, empty foreground for portraits.
- gangdong: 994 east of Yalu River, Gangdong six fortified prefectures, workers constructing rough stone/earth walls and timber palisades, recovering farms and village, calm morning.
- withdrawal: late 993 Khitan cavalry peacefully withdraws north from border gate. Final edit: every rider/horse shown from behind, moving away towards upper-center mountain pass; keep foreground Goryeo sentries stationary.
- yeon: transparent 19-year-old Goryeo traveler, broad round face, thick eyebrows, brown cloth headband/topknot, muted teal-green travel robe, russet sash, satchel, relaxed serious closed mouth; semi-realistic painted Korean visual novel portrait.

## 보존 및 테스트

CH.01–04/CH.06–12의 모든 장면과 기존 문제 데이터를 JSON 비교해 동일함을 확인했다. CH.05 대사·ID·연도·장면 순서·분기 대사는 모두 유지했다. 저장 버전 15, 캐릭터 기본 매핑, 기존 문제 ID/보기/정답/해설도 유지했다. 공통 app.js의 변경은 CH.05 조건으로 제한한 연 portrait 선택·심화 연습 라벨·완료 화면 세트 명칭이다.

- npm test: 통과
- npm run build: 통과, 신규 데이터 및 전체 에셋 존재 검사 포함
- 전 12장면/12문제 정답·오답·해설·복귀·저장 호환성 테스트: 통과
- 실제 브라우저 390×844 CH.05 전체 플레이: 기출 3/연습 9 모두 등장, CHAPTER CLEAR 및 CH.06 안내 확인
- 375/390/430px: 기출 이미지 로딩, 원문 전체 crop, 4개 선택지, 가로 넘침 없음 확인
- 375px 확대: 900px 원본을 모달 안에서 스크롤, 페이지 가로 넘침 없음, 닫기 및 정답·해설 정상
- 사용자 기존 저장에 영향을 주지 않도록 별도 포트/메모리 저장 검수 페이지 사용

## 수정 파일

dist/ch05-refinement.js, app.js, index.html, sw.js; assets/characters/ch05-yeon-traveler.webp; assets/scenes/ch05-*.webp 신규 4개; assets/exams/ch05/*.webp 3개; package.json; tests/ch05-refinement-test.cjs, build.cjs, late-goryeo-ui-test.cjs, official-image-ui-test.cjs, official-image-mobile-test.cjs; 이 보고서.

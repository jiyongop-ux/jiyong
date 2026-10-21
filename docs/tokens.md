# tokens.json 읽는 법 (기획자용)

> `tokens.json`은 JSON 형식이라 파일 안에 주석을 넣을 수 없어요. 그래서 설명을 이 문서에 따로 적었어요.
> 원본 `tokens.json`은 한 글자도 바꾸지 않았어요.
> "쓰는 곳"은 [Design.md](Design.md)를 기준으로 적었어요.

## 이 파일이 하는 일

화면에 쓰는 **색·글자 크기·간격·모서리 둥글기**를 이름표를 붙여 모아 둔 목록이에요.
화면을 만들 때는 `#FF2E98` 같은 값을 직접 쓰지 않고 `fill/primary` 같은 이름표로 불러 써요.
그래서 색을 바꿀 때 이 파일 한 곳만 고치면 모든 화면에 함께 반영돼요.

파일은 5묶음으로 나뉘어 있어요.

| 묶음 | 뜻 |
|---|---|
| `primitive` | 색 팔레트 원본이에요. "회색 900번", "분홍 500번"처럼 색 자체에 붙인 이름이에요. |
| `semantic` | 쓰임새별 색이에요. "본문 글자색", "주요 버튼 색"처럼 **어디에 쓰는지**로 붙인 이름이고, 각각 primitive 색 하나를 가리켜요. |
| `typography` | 글꼴과 글자 크기예요. |
| `spacing` | 요소 사이 간격이에요. |
| `radius` | 모서리를 얼마나 둥글게 할지예요. |

---

## 1. primitive — 색 팔레트 원본

숫자가 클수록 진한 색이에요. (gray/0은 흰색, gray/950은 검정)

| 이름 | 값 | 설명 |
|---|---|---|
| gray/950 | #000000 | 검정 |
| gray/900 | #181A1B | 가장 진한 회색이에요. 제목·본문 글자에 써요. |
| gray/800 | #2D2D2D | 진한 회색 |
| gray/600 | #66707A | 보조 글자, 아이콘 |
| gray/500 | #878787 | 부가 설명 글자 |
| gray/400 | #B7BDC4 | 입력란 안내 글자(placeholder) |
| gray/300 | #D9DCDF | 테두리, 눌리지 않는 버튼 |
| gray/200 | #EFF1F3 | 옅은 배경, 구분선 |
| gray/100 | #F7F7F7 | 가장 옅은 회색 배경 |
| gray/0 | #FFFFFF | 흰색 |
| pink/500 | #FF2E98 | **브랜드 대표 분홍**이에요. 주요 버튼, 로고, 강조에 써요. |
| pink/600 | #E6007E | 진한 분홍이에요. 주요 버튼에 마우스를 올렸을 때 써요. |
| pink/50 | #FFF5FA | 아주 옅은 분홍이에요. 할인·프로모션 칩 배경에 써요. |
| pink/25 | #FFF8F5 | 아주 옅은 분홍이에요. 쓰는 곳이 정해져 있지 않아요. (아래 "발견 사항" 참고) |
| red/500 | #E30036 | 오류 빨강 |
| red/50 | #FFF0F3 | 아주 옅은 빨강 |
| black/10 | #0000001A | 10% 투명한 검정이에요. 얇은 경계선에 써요. |

---

## 2. semantic — 쓰임새별 색

화면을 만들 때는 이 이름을 써요. 원본 파일의 순서와 상관없이 쓰임새별로 묶었어요.
"확인 안 됨"은 이름표는 있지만 현재 컴포넌트에서 쓰는 곳이 확인되지 않은 색이에요.

### 글자색 (text)

| 이름 | 가리키는 색 | 쓰는 곳 |
|---|---|---|
| text/primary | gray/900 | 제목, 요금, 일반 본문 |
| text/secondary | gray/600 | 보조 설명, List/Row 라벨, 추천 Tag 글자 |
| text/tertiary | gray/500 | Card/Price 라벨, 부가 설명 |
| text/accent | pink/500 | 강조 글자 (할인율, 강조 값) |
| text/on-dark | gray/0 | 진한 배경 위 흰 글자 (주요 버튼, 선택된 필터 칩) |
| text/error | red/500 | 입력 오류 문구 (예: "이름을 입력해 주세요.") |
| text/placeholder | gray/400 | 입력란이 비어 있을 때 보이는 안내 글자 |
| text/on-disabled | gray/600 | 입력할 수 없는 입력란의 글자 |

### 배경색 (bg, surface)

| 이름 | 가리키는 색 | 쓰는 곳 |
|---|---|---|
| bg/surface | gray/0 | 화면 기본 배경, Header, 하단 버튼 영역, 요금제 카드 |
| surface/default | gray/0 | 보조 버튼 배경 (bg/surface와 색은 같지만 다른 이름표예요) |
| bg/default | gray/100 | 월 요금 카드(Card/Price), 선택된 선택지 배경 |
| bg/subtle | gray/200 | 입력할 수 없는 입력란, 혜택 칩 배경 |
| bg/accent-subtle | pink/50 | 할인·프로모션 칩 배경 (예: "24개월 할인") |
| bg/inverse | gray/800 | 확인 안 됨 |
| bg/error-subtle | red/50 | 확인 안 됨 |

### 채움색 (fill, brand) — 버튼·선택 표시처럼 면을 칠하는 색

| 이름 | 가리키는 색 | 쓰는 곳 |
|---|---|---|
| fill/primary | pink/500 | 주요 버튼 (예: '구독 신청하기'), 체크 표시, 완료 마크 |
| fill/primary-hover | pink/600 | 주요 버튼에 마우스를 올렸을 때 |
| fill/secondary | gray/900 | 선택된 필터 칩 (선택 상태를 분홍이 아니라 진한 회색으로 보여줘요) |
| fill/disabled | gray/300 | 눌리지 않는 버튼 (예: 입력을 다 채우기 전의 '신청하기') |
| brand/primary | pink/500 | 로고 |
| fill/accent | pink/600 | 확인 안 됨 |
| fill/tertiary | gray/200 | 확인 안 됨 |
| fill/disabled-strong | gray/400 | 확인 안 됨 |

### 테두리색 (border)

| 이름 | 가리키는 색 | 쓰는 곳 |
|---|---|---|
| border/default | gray/300 | 입력란·카드·보조 버튼의 기본 테두리 |
| border/subtle | gray/200 | 목록 행 사이 구분선, 하단 버튼 영역 위쪽 선, 추천 Tag 배경 |
| border/medium | gray/600 | 선택된 카드·선택지의 테두리 |
| border/focus | pink/500 | 입력 중인 입력란의 테두리 |
| border/error | red/500 | 오류가 난 입력란의 테두리 |
| border/divider | black/10 | 디자인 파일 안에서 정리용 섹션을 나누는 선 (제품 화면의 구분선과는 달라요) |
| border/strong | gray/900 | 확인 안 됨 |

### 아이콘색 (icon)

| 이름 | 가리키는 색 | 쓰는 곳 |
|---|---|---|
| icon/default | gray/600 | 뒤로가기·체크 아이콘 |
| icon/accent | pink/500 | 강조 점, 할인·프로모션 칩 글자 |
| icon/on-dark | gray/0 | 완료 마크 안의 흰 모양 |
| icon/error | red/500 | 입력 오류 아이콘 |
| icon/strong | gray/900 | 확인 안 됨 |
| icon/primary | gray/950 | 확인 안 됨 |
| icon/disabled | gray/300 | 확인 안 됨 |

### 효과 (effect)

| 이름 | 값 | 설명 |
|---|---|---|
| effect/shadow-subtle | #0000000D | 5% 투명한 검정이에요. 그림자 색만 정해져 있고, 그림자 위치와 번짐 정도는 정해져 있지 않아요. 팔레트 원본(primitive)을 가리키지 않고 값을 직접 적은 유일한 색이에요. |

---

## 3. typography — 글꼴과 글자 크기

- 글꼴: **Noto Sans KR**
- 이 파일에는 **글자 크기만** 있어요. 줄 간격과 글자 굵기는 [Design.md](Design.md) 2장 "타이포 스케일"에 따로 정리되어 있어요.

| 이름 | 크기(px) | 쓰는 곳 |
|---|---:|---|
| font-size/heading-h1 | 32 | 가장 큰 제목 (현재 화면에서는 쓰지 않아요) |
| font-size/heading-h2 | 28 | 월 요금 카드의 큰 금액 |
| font-size/heading-h3 | 24 | 화면 제목, 섹션 제목, "구독 신청이 완료됐어요" |
| font-size/heading-h4 | 20 | 첫 화면(요금제 목록) Header 제목 |
| font-size/subtitle | 18 | 요금제 이름·가격, 하단 버튼 영역 금액 |
| font-size/body | 16 | 버튼 글자, 입력한 글자 |
| font-size/body-small | 14 | 카드 설명, 목록 행, 오류 문구, 필터 칩 |
| font-size/caption | 13 | 추천 Tag, 할인 칩, 작은 부가 설명 |
| font-size/12 | 12 | 작은 보조 정보 |
| font-size/caption-mini | 10 | 혜택·패키지 칩 |

---

## 4. spacing — 간격

요소 사이를 몇 px 띄울지 정해 둔 값이에요. 이름 뒤 숫자가 곧 px 값이에요. (예: spacing/16 = 16px)
원본 파일에는 순서가 섞여 있어요. 여기서는 작은 값부터 적었어요.

| 값(px) | 주로 쓰는 곳 |
|---:|---|
| 0, 2, 6, 10 | 따로 정해진 쓰임새가 없어요 |
| 4 | 아주 작은 내부 간격, Header 위아래 여백 |
| 8 | 카드 안 요소 사이, 버튼 사이 |
| 12 | 섹션 안 간격, 목록 행 위아래 여백 |
| 16 | 기본 화면 여백 (구독 신청·신청 완료 화면), Header 좌우 여백 |
| 20 | 요금제 카드·월 요금 카드 안쪽 여백 |
| 24 | 화면 여백 (요금제 목록·상세 화면), 버튼 좌우 여백 |
| 32 | 하단 버튼 영역 아래 여백 (홈 화면 표시줄을 피하는 공간) |
| 28, 40, 48, 56, 60, 64, 80 | 따로 정해진 쓰임새가 없어요 |

---

## 5. radius — 모서리 둥글기

숫자가 클수록 더 둥글어요. 0은 각진 모서리예요.

| 값 | 쓰는 곳 |
|---:|---|
| 0 | Header, 입력란 (각진 모서리) |
| 4 | 혜택·패키지 칩 |
| 6 | 할인 칩 |
| 8 | 버튼 |
| 12 | 월 요금 카드, 선택지(OptionItem) |
| 16 | 요금제 카드 |
| 999 | 추천 Tag (양 끝이 완전히 둥근 알약 모양) |
| full (9999) | 필터 칩, 체크 표시, 완료 마크 (알약 모양이나 동그라미) |
| 2, 5, 10, 20, 24, 32, 40 | 따로 정해진 쓰임새가 없어요 |

---

## 발견 사항

`tokens.json`은 고치지 않았어요. 아래는 확인이 필요한 부분이에요.

1. **pink/25(#FFF8F5)는 Design.md에 없어요.** 이 색을 가리키는 쓰임새별 색(semantic)도 없어요.
2. **글자 줄 간격과 굵기가 이 파일에 없어요.** 화면을 만들 때는 Design.md 2장을 함께 봐야 해요.
3. **이름표만 있고 쓰는 곳이 확인되지 않은 색이 9개예요.** bg/inverse, bg/error-subtle, fill/accent, fill/tertiary, fill/disabled-strong, border/strong, icon/strong, icon/primary, icon/disabled

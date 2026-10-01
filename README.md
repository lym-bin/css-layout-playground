# CSS Layout Playground

Flexbox랑 Grid 속성을 직접 바꿔보면서 레이아웃이 어떻게 변하는지 확인할 수 있는 플레이그라운드입니다.
슬라이더/드롭다운으로 값을 바꾸면 미리보기 박스 배치가 바로 바뀌고, 그 상태의 HTML/CSS 코드도 같이 출력돼서 복사해 쓸 수 있습니다.

배포 주소: https://css-layout-playground.vercel.app

## 만들게 된 이유

처음에는 코드나 Figma 스크린샷을 넣으면 레이아웃 문제(고정 px, 이미지 비율 깨짐, div 남용 같은 것)를 자동으로 찾아서 고쳐주는 도구를 생각했었는데,
PostCSS, parse5, babel 같은 파서가 다 필요해져서 범위가 너무 커졌습니다.

그래서 범위를 줄여서, 파서 없이 React state만으로 스타일을 관리하는 레이아웃 플레이그라운드로 방향을 바꿨습니다.

## 기능

### 컨테이너 속성
- Flexbox / Grid 모드 전환 (모드를 바꿔도 각 모드 설정은 유지)
- Flexbox: `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `gap`
- Grid
  - `grid-template-columns`: 개수 고정 / `auto-fill` / `auto-fit` (+ 최소 너비) / 직접 입력 (`200px 1fr` 등)
  - `grid-template-rows`: 개수 고정 / `auto`
  - `justify-items`, `align-items`, `gap`
- 직접 입력한 열 템플릿은 `CSS.supports()`로 검사해서 잘못된 값이면 경고 표시
- 박스 개수 조절 (1~8개), Reset으로 초기화

### 박스별 속성
- 미리보기에서 박스를 클릭해서 선택 (키보드 Tab / Enter도 가능)
- Flexbox: `flex-grow`, `align-self`
- Grid: `grid-column` (`span N` / 전체 폭 `1 / -1`), `grid-row: span N`
- 바뀐 박스만 CSS에 `.item:nth-child(n)` 규칙으로 출력

### 실무 패턴 프리셋
버튼 한 번으로 자주 쓰는 레이아웃을 불러옵니다. 불러온 다음 값을 바꿔보면서 왜 그렇게 되는지 볼 수 있습니다.

- 가운데 정렬
- 네비게이션 바
- 푸터 하단 고정
- 반응형 카드 그리드
- 헤더 · 사이드바 · 푸터
- 대표 카드 강조

### 미리보기 너비
- 모바일(375) / 태블릿(768) / 가득 버튼 + 슬라이더로 미리보기 너비 조절
- `auto-fill`이나 `flex-wrap`이 너비에 따라 어떻게 바뀌는지 확인할 수 있습니다
- 브라우저 창 크기는 그대로라서 `@media` 쿼리는 이 슬라이더에 반응하지 않습니다

### 코드 출력
- 미리보기와 같은 구조의 HTML + CSS를 나란히 출력
- 각각 복사 버튼

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Vercel 배포 (main에 push하면 자동 배포)

## 실행 방법

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 폴더 구조

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── layout-playground/
│       ├── LayoutPlayground.tsx   # 상태 관리 + 전체 조립 (use client)
│       ├── PresetPanel.tsx        # 프리셋 버튼 목록
│       ├── ControlPanel.tsx       # 모드 토글, 컨테이너 속성 조절
│       ├── ItemPanel.tsx          # 선택한 박스의 개별 속성 조절
│       ├── PreviewCanvas.tsx      # 미리보기 + 너비 조절
│       ├── CodeOutput.tsx         # 코드 출력 + 복사 (HTML/CSS 공용)
│       └── controls/
│           ├── RangeControl.tsx
│           ├── SelectControl.tsx
│           └── TextControl.tsx
└── lib/
    └── layout/
        ├── types.ts               # 상태 타입
        ├── constants.ts           # 선택지 목록, 슬라이더 범위, 기본값
        ├── presets.ts             # 실무 패턴 프리셋 데이터
        ├── generateCss.ts         # 상태 -> style 객체 / CSS 문자열
        └── generateHtml.ts        # 상태 -> HTML 문자열
```

## 구조 잡을 때 신경 쓴 부분

- 레이아웃 상태는 `LayoutPlayground` 한 곳에서만 들고 있고, 나머지 컴포넌트는 props로 받아서 씁니다. 미리보기 / HTML / CSS가 전부 같은 상태에서 만들어져서 따로 동기화할 필요가 없습니다.
- 그래서 프리셋도 새 로직 없이 "상태 하나"로 정의했고, 적용은 `setState(preset.state)` 한 줄입니다.
- 반대로 미리보기 너비처럼 출력 코드와 상관없는 값은 `PreviewCanvas` 안에서만 관리합니다.
- 미리보기 style 객체와 출력 CSS 문자열은 `generateCss.ts`에서 같은 함수(`toColumnsTemplate` 등)를 같이 써서 만들기 때문에, 화면이랑 코드가 서로 안 맞는 일이 없습니다.
- Grid 열 설정처럼 종류마다 필요한 값이 다른 경우는 `kind`로 구분하는 판별 유니언 타입을 써서, 말이 안 되는 조합이 아예 만들어지지 않게 했습니다.
- `"use client"`는 `LayoutPlayground`에만 붙이고 `page.tsx`는 서버 컴포넌트로 뒀습니다.
- 박스 개수를 줄여서 선택한 박스가 사라지는 경우는 `useEffect`로 맞추지 않고, 렌더링할 때 계산하는 값으로 처리했습니다.

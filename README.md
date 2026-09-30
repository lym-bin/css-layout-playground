# CSS Layout Playground

Flexbox랑 Grid 속성을 직접 바꿔보면서 레이아웃이 어떻게 변하는지 확인할 수 있는 플레이그라운드입니다.
슬라이더/드롭다운으로 값을 바꾸면 미리보기 박스 배치가 바로 바뀌고, 그 상태의 CSS 코드도 같이 출력돼서 복사해 쓸 수 있습니다.

배포 주소: https://css-layout-playground.vercel.app

## 만들게 된 이유

처음에는 코드나 Figma 스크린샷을 넣으면 레이아웃 문제(고정 px, 이미지 비율 깨짐, div 남용 같은 것)를 자동으로 찾아서 고쳐주는 도구를 생각했었는데,
PostCSS, parse5, babel 같은 파서가 다 필요해져서 범위가 너무 커졌습니다.

그래서 범위를 줄여서, 파서 없이 React state만으로 스타일을 관리하는 레이아웃 플레이그라운드로 방향을 바꿨습니다.

## 기능

- Flexbox / Grid 모드 전환
- Flexbox: `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `gap`
- Grid: 열/행 개수(`grid-template-columns`, `grid-template-rows`), `justify-items`, `align-items`, `gap`
- 박스 개수 조절 (1~8개)
- 미리보기 영역 너비를 드래그로 줄여서 wrap 동작 확인
- 현재 설정의 CSS 코드 출력 + 복사 버튼
- 모드를 바꿔도 각 모드 설정은 유지, Reset으로 초기화

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

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
│       ├── ControlPanel.tsx       # 모드 토글, 속성 조절 UI
│       ├── PreviewCanvas.tsx      # 박스 미리보기
│       ├── CodeOutput.tsx         # CSS 출력 + 복사
│       └── controls/
│           ├── RangeControl.tsx
│           └── SelectControl.tsx
└── lib/
    └── layout/
        ├── types.ts               # 상태 타입
        ├── constants.ts           # 선택지 목록, 슬라이더 범위, 초기값
        └── generateCss.ts         # 상태 -> style 객체 / CSS 문자열
```

## 구조 잡을 때 신경 쓴 부분

- 상태는 `LayoutPlayground` 한 곳에서만 들고 있고, 나머지 컴포넌트는 props로 받아서 씁니다.
- 미리보기에 들어가는 style 객체와 출력되는 CSS 문자열을 `generateCss.ts` 한 파일에서 같은 상태로 만들어서, 화면이랑 코드가 서로 안 맞는 일이 없게 했습니다.
- `"use client"`는 `LayoutPlayground`에만 붙이고 `page.tsx`는 서버 컴포넌트로 뒀습니다.
- 선택지 값들은 문자열 유니언 타입으로 제한해서 오타가 컴파일 단계에서 걸리게 했습니다.

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

### 콘텐츠 모드
- 미리보기를 숫자 박스 / 예시 콘텐츠(이미지, 제목, 설명) 중에서 골라서 볼 수 있습니다
- 프리셋마다 패턴에 맞는 예시 내용이 들어 있습니다 (네비게이션 바는 로고·메뉴·버튼, 카드 그리드는 상품 카드 등)
- 숫자 박스에서는 안 보이던, 내용 길이 때문에 생기는 레이아웃 차이를 확인할 수 있습니다

### 코드 출력
- 미리보기와 같은 구조의 HTML + CSS를 나란히 출력
- 콘텐츠 모드에서는 HTML에 `img` / `strong` / `p` 마크업이 들어가고, CSS에 이미지 비율 규칙(`width: 100%`, `height: auto`, `aspect-ratio`)이 같이 출력됩니다
- 콘텐츠 문자열은 이스케이프해서 HTML에 넣습니다
- 각각 복사 버튼

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Vitest (코드 생성 함수 테스트)
- Vercel 배포 (main에 push하면 자동 배포)

## 실행 방법

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

```bash
npm run test       # 감시 모드 (저장할 때마다 다시 실행)
npm run test:run   # 한 번만 실행
```

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
        ├── generateCss.test.ts
        ├── generateHtml.ts        # 상태 -> HTML 문자열
        └── generateHtml.test.ts
```

## 구조 잡을 때 신경 쓴 부분

- 레이아웃 상태는 `LayoutPlayground` 한 곳에서만 들고 있고, 나머지 컴포넌트는 props로 받아서 씁니다. 미리보기 / HTML / CSS가 전부 같은 상태에서 만들어져서 따로 동기화할 필요가 없습니다.
- 그래서 프리셋도 새 로직 없이 "상태 하나"로 정의했고, 적용은 `setState(preset.state)` 한 줄입니다.
- 반대로 미리보기 너비처럼 출력 코드와 상관없는 값은 `PreviewCanvas` 안에서만 관리합니다. 숫자/콘텐츠 보기 방식도 처음에는 `PreviewCanvas` 안에 있었는데, HTML/CSS 출력도 이 값을 알아야 하게 되면서 `LayoutPlayground`로 올렸습니다.
- 미리보기 너비는 처음에 CSS `resize`로 드래그해서 조절했는데, 브라우저가 직접 바꾸는 너비와 React 상태가 따로 놀 수 있어서 슬라이더 + React 상태 하나로 통일했습니다.
- 미리보기 style 객체와 출력 CSS 문자열은 `generateCss.ts`에서 같은 함수(`toColumnsTemplate` 등)를 같이 써서 만들기 때문에, 화면이랑 코드가 서로 안 맞는 일이 없습니다.
- Grid 열 설정처럼 종류마다 필요한 값이 다른 경우는 `kind`로 구분하는 판별 유니언 타입을 써서, 말이 안 되는 조합이 아예 만들어지지 않게 했습니다.
- `"use client"`는 `LayoutPlayground`에만 붙이고 `page.tsx`는 서버 컴포넌트로 뒀습니다.
- 박스 개수를 줄여서 선택한 박스가 사라지는 경우는 `useEffect`로 맞추지 않고, 렌더링할 때 계산하는 값으로 처리했습니다.
- `CSS.supports()`는 브라우저에만 있는 API라서, `"use client"` 컴포넌트가 서버에서 먼저 렌더링될 때는 검사를 건너뛰게 했습니다.
- Tailwind는 빌드할 때 소스에 그대로 적힌 클래스만 만들기 때문에, `bg-${color}-400`처럼 조합하지 않고 완성된 클래스 문자열 배열을 썼습니다.

## 트러블슈팅

### 1. 박스 8개 + 콘텐츠 모드에서 화면이 멈춤

**문제**
기본 상태에서 박스를 8개로 늘리고 콘텐츠 모드로 바꾸면 에러가 나면서 화면이 멈췄습니다. 프리셋 중에서는 카드 그리드만 8개를 다 채워놔서, 프리셋만 눌러봐서는 안 보였습니다.

**원인**
기본 콘텐츠 배열에 항목이 하나 빠져서 7개였고, 8번째 박스에서 `contents[7]`이 `undefined`였습니다.
TypeScript는 기본 설정에서 배열 인덱스로 꺼낸 값이 항상 있다고 보기 때문에(`noUncheckedIndexedAccess` 꺼짐) 컴파일할 때는 안 걸렸습니다.

**해결**
기본 콘텐츠를 8개로 맞췄고, 프리셋은 `makeContents()`로 앞에서 정의한 개수 뒤의 칸을 기본 콘텐츠로 채우게 했습니다.

**배운 점**
손으로 적은 배열은 개수가 맞는지 타입이 확인해주지 않습니다. 개수가 정해진 배열은 `Array.from({ length })`처럼 만들거나 직접 세어봐야 합니다.

### 2. 빌드는 통과하는데 출력된 HTML/CSS가 깨짐

**문제**
`tsc`, lint, build가 다 통과했는데 출력 코드를 복사해서 붙여넣으면 레이아웃이 적용되지 않았습니다.

**원인**
코드를 문자열로 만드는 부분의 실수는 어떤 도구도 검사하지 않습니다. 실제로 나왔던 것들입니다.
- CSS 선언 끝에 `;` 대신 `:` → 다음 줄과 붙어서 둘 다 무시됨
- 템플릿 리터럴에 `${columns}` 대신 `$(columns)` → 값이 아니라 글자 그대로 출력
- `class=container"` (따옴표 하나 빠짐) → 클래스 이름이 `container"`가 되어 CSS와 연결 안 됨
- 닫는 태그 `</div`에 `>` 빠짐, CSS 규칙에서 선택자 줄 누락

**해결**
처음에는 출력 결과를 화면에서 직접 읽어보면서 고쳤습니다. 같은 실수가 계속 나와서, 코드를 만드는 순수 함수(`generateCss`, `generateHtml`)에 Vitest 테스트를 붙였습니다.
- 대표 상태 몇 개는 출력 문자열 전체를 정확히 비교
- 모든 프리셋 × 숫자/콘텐츠 모드에 대해 규칙 검사
  - CSS 선언 줄은 `  속성: 값;` 형태인지, 선택자 줄은 `선택자 {` 형태인지, 중괄호 짝이 맞는지
  - HTML은 `<div>`와 `</div>` 개수, `</div` 뒤 `>` 누락, `class=` 뒤 따옴표
- 이스케이프(`&`, `<`, `>`, `"`) 결과 비교

위에 적은 실수들은 전부 이 테스트에 걸리게 했고, 테스트를 붙인 직후에도 눈으로 보고 넘어갔던 선택자 줄 공백(` .item img{`)을 하나 더 잡았습니다.

**배운 점**
컴파일러는 타입이 맞는지만 보지 의도대로인지는 모릅니다. 문자열을 만드는 함수는 테스트가 필요한 곳이고, 버그를 고칠 때 같은 실수를 막는 테스트를 같이 남기면 다시 생기지 않습니다.

### 3. 타입을 바꿨는데 컴파일 에러가 하나도 안 남

**문제**
Grid 열 설정을 `number`에서 `kind`로 구분하는 판별 유니언으로 바꾸려고 새 타입을 만들고 `tsc`를 돌렸는데 에러가 하나도 안 났습니다.

**원인**
새 타입을 선언만 하고, 실제 상태 타입(`GridSettings.columns`)은 여전히 `number`였습니다. 쓰는 곳이 없으니 검사할 것도 없었습니다.

**해결**
상태 타입을 새 타입으로 바꾸자 고쳐야 할 곳이 에러 목록으로 나왔고, 그 목록을 따라 수정했습니다.

**배운 점**
구조를 바꿀 때는 타입을 먼저 바꾸면 에러 목록이 곧 할 일 목록이 됩니다. 다만 템플릿 리터럴 안에 객체를 넣는 것처럼 에러 없이 통과하는 경우도 있어서, 목록만 믿으면 안 됩니다.

### 4. Vitest 설치 시 의존성 충돌 (ERESOLVE)

**문제**
`npm install -D vitest`를 실행하면 `ERESOLVE could not resolve` 에러가 나면서 설치가 안 됐습니다.

**원인**
create-next-app이 `@types/node`를 `^20`으로 설치해뒀는데, vitest 5는 `@types/node` 22 이상 또는 24 이상을 요구했습니다.
확인해보니 실제로 쓰는 Node는 v24라서, 실행 환경은 24인데 타입은 20을 쓰고 있던 상태였습니다.

**해결**
에러 메시지에 나온 `--force`, `--legacy-peer-deps`는 충돌 검사를 끄는 옵션이라 쓰지 않았습니다. 대신 타입을 실행 환경에 맞춰 올리면서 같이 설치했습니다.

```bash
npm install -D @types/node@24 vitest
```

**배운 점**
의존성 충돌은 옵션으로 덮지 말고, 어느 패키지가 무슨 버전을 요구하는지 에러 메시지를 읽고 맞춰야 합니다. 이번에는 오히려 원래 어긋나 있던 타입 버전을 바로잡는 계기가 됐습니다.

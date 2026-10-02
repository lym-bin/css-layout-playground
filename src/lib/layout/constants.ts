// src/lib/layout/constants.ts
// 변하지 않는 설정 값 모음.
// - 드롭다운 선택지 배열(type은 런타임에 사라지므로 실제 값 배열이 필요)
// - 슬라이더 최솟값/최댓값 (LIMITS)
// - 초기 상태 (INITIAL_STATE) -> useState 시작값 + Reset 버튼에서 사용
// - 미디어쿼리 구간 (BREAKPOINTS, BREAKPOINT_MIN_WIDTH, BREAKPOINT_LABELS)

// 타입만 가져오기
import type {
  BoxContent,
  FlexAlignItems,
  FlexAlignSelf,
  FlexDirection,
  FlexWrap,
  GridAlign,
  GridColumns,
  GridColumnsKind,
  GridItemColumn,
  GridItemColumnKind,
  GridRows,
  GridRowsKind,
  ItemSettings,
  JustifyContent,
  PlaygroundState,
  ContainerTag,
  ItemTag,
  Breakpoint,
  BreakpointOverride,
  MediaBreakpoint,
} from "./types";

export const FLEX_DIRECTIONS: readonly FlexDirection[] = [
  "row",
  "row-reverse",
  "column",
  "column-reverse",
];

export const FLEX_WRAPS: readonly FlexWrap[] = [
  "nowrap",
  "wrap",
  "wrap-reverse",
];

export const JUSTIFY_CONTENTS: readonly JustifyContent[] = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
];

export const FLEX_ALIGN_ITEMS: readonly FlexAlignItems[] = [
  "stretch",
  "flex-start",
  "flex-end",
  "center",
  "baseline",
];
export const FLEX_ALIGN_SELFS: readonly FlexAlignSelf[] = [
  "auto",
  ...FLEX_ALIGN_ITEMS,
];

export const GRID_ALIGNS: readonly GridAlign[] = [
  "stretch",
  "start",
  "end",
  "center",
];

export const GRID_COLUMNS_KINDS: readonly GridColumnsKind[] = [
  "count",
  "auto-fill",
  "auto-fit",
  "custom",
];

export const GRID_ROWS_KINDS: readonly GridRowsKind[] = ["count", "auto"];

// 드롭다운에서 종류를 바꿨을 때 들어갈 기본 값
export const DEFAULT_GRID_COLUMNS: Record<GridColumnsKind, GridColumns> = {
  count: { kind: "count", count: 3 },
  "auto-fill": { kind: "auto-fill", minWidth: 120 },
  "auto-fit": { kind: "auto-fit", minWidth: 120 },
  custom: { kind: "custom", template: "200px 1fr" },
};

export const DEFAULT_GRID_ROWS: Record<GridRowsKind, GridRows> = {
  count: { kind: "count", count: 2 },
  auto: { kind: "auto" },
};
export const GRID_ITEM_COLUMN_KINDS: readonly GridItemColumnKind[] = [
  "span",
  "full",
];
export const CONTAINER_TAGS: readonly ContainerTag[] = [
  "div",
  "header",
  "nav",
  "section",
  "ul",
];
export const ITEM_TAGS: readonly ItemTag[] = [
  "div",
  "header",
  "nav",
  "main",
  "aside",
  "footer",
  "section",
  "article",
  "li",
  "a",
];

// 콘텐츠에 tag가 없으면 이 값으로 본다.
export const DEFAULT_ITEM_TAG: ItemTag = "div";

export const DEFAULT_GRID_ITEM_COLUMN: Record<
  GridItemColumnKind,
  GridItemColumn
> = {
  span: { kind: "span", span: 1 },
  full: { kind: "full" },
};

// 아무 속성도 안 준 박스 = CSS 기본 동작과 같은 값
export const DEFAULT_ITEM: ItemSettings = {
  flex: { grow: 0, alignSelf: "auto" },
  grid: { column: DEFAULT_GRID_ITEM_COLUMN.span, rowSpan: 1 },
};

// 프리셋을 고르지 않았을 때의 콘텐츠, 길이를 일부로 제각각으로 둔다.
export const DEFAULT_CONTENTS: BoxContent[] = [
  { title: "카드 제목", body: "짧은 설명", image: true },
  {
    title: "제목이 조금 더 긴 카드는 줄바꿈이 생깁니다.",
    body: "본문이 두세 줄 정도 되는 카드 입니다. 내용 길이에 따라 높이가 달라집니다.",
    image: true,
  },
  { title: "이미지 없는 카드", body: "텍스트만 있는 경우" },
  {
    title: "링크가 긴 카드",
    body: "https://example.com/a-very-long-url-without-any-spaces-that-breaks-layouts",
  },
  {
    title: "짧음",
  },
  {
    title: "보통 길이 제목",
    body: "설명 한 줄",
    image: true,
  },
  {
    title: "버튼",
  },
  {
    title: "마지막 카드",
    body: "끝까지 확인해보세요.",
    image: true,
  },
];

// 미디어쿼리 구간 순서 (작은 폭 -> 큰 폭). 덮어쓰기는 이 순서대로 쌓인다
export const BREAKPOINTS: readonly Breakpoint[] = ["base", "md", "lg"];

// 각 구간이 시작되는 폭, @media (min-width: ...)에 그대로 들어간다.
export const BREAKPOINT_MIN_WIDTH: Record<MediaBreakpoint, number> = {
  md: 768,
  lg: 1024,
};

export const BREAKPOINT_LABELS: Record<Breakpoint, string> = {
  base: "기본",
  md: "768px 이상",
  lg: "1024px 이상",
};

// 아무것도 덮어쓰지 않은 구간
export const EMPTY_OVERRIDE: BreakpointOverride = { flex: {}, grid: {} };

// 슬라이더 최솟값과 최댓값
// as const로 설정값 명시
export const LIMITS = {
  boxCount: { min: 1, max: 8 },
  gap: { min: 0, max: 48 },
  columns: { min: 1, max: 6 },
  rows: { min: 1, max: 4 },
  minWidth: { min: 60, max: 240 },
  grow: { min: 0, max: 3 },
  span: { min: 1, max: 4 },
  rowSpan: { min: 1, max: 3 },
  viewport: { min: 280, max: 1280 },
} as const;

export const INITIAL_STATE: PlaygroundState = {
  mode: "flex",
  boxCount: 5,
  flex: {
    direction: "row",
    wrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: 12,
  },
  grid: {
    columns: DEFAULT_GRID_COLUMNS.count,
    rows: DEFAULT_GRID_ROWS.count,
    gap: 12,
    justifyItems: "stretch",
    alignItems: "stretch",
  },
  items: Array.from({ length: LIMITS.boxCount.max }, () => DEFAULT_ITEM),
  contents: DEFAULT_CONTENTS,
  // 기본은 꺼둠 = 브라우저 기본 동작 그대로 (버그가 보이는 상태)
  safeguards: { minWidthZero: false, wrapAnywhere: false },
  containerTag: "div",
  // 처음엔 모든 구간이 비어 있음 = 미디어쿼리 없음
  responsive: { md: EMPTY_OVERRIDE, lg: EMPTY_OVERRIDE },
};

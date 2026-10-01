// src/lib/layout/constants.ts

// 변하지 않는 설정 값 모음.
// - 드롭다운 선택지 배열(type은 런타임에 사라지므로 실제 값 배열이 필요)
// - 슬라이더 최솟값/최댓값 (LIMITS)
// - 초기 상태 (INITIAL_STATE) -> useState 시작값 + Reset 버튼에서 사용

// 타입만 가져오기
import type {
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
};

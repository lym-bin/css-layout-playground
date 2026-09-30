// src/lib/layout/constants.ts

// 변하지 않는 설정 값 모음.
// - 드롭다운 선택지 배열(type은 런타임에 사라지므로 실제 값 배열이 필요)
// - 슬라이더 최솟값/최댓값 (LIMITS)
// - 초기 상태 (INITIAL_STATE) -> useState 시작값 + Reset 버튼에서 사용

// 타입만 가져오기
import type {
  FlexAlignItems,
  FlexDirection,
  FlexWrap,
  GridAlign,
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

export const GRID_ALIGNS: readonly GridAlign[] = [
  "stretch",
  "start",
  "end",
  "center",
];
// 슬라이더 최솟값과 최댓값
// as const로 설정값 명시
export const LIMITS = {
  boxCount: { min: 1, max: 8 },
  gap: { min: 0, max: 48 },
  columns: { min: 1, max: 6 },
  rows: { min: 1, max: 4 },
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
    columns: 3,
    rows: 2,
    gap: 12,
    justifyItems: "stretch",
    alignItems: "stretch",
  },
};

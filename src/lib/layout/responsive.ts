// src/lib/layout/responsive.ts
// 미디어쿼리 구간 계산용 순수 함수 모음.
// - breakpointAt: 미리보기 폭이 어느 구간에 속하는지
// - resolveState: 그 구간까지의 덮어쓰기를 base 설정 위에 차례로 쌓은 "최종 상태"
// - 결과가 PlaygroundState 그대로라서 toContainerStyle 등 기존 함수를 수정 없이 재사용한다.

import {
  BREAKPOINTS,
  BREAKPOINT_MIN_WIDTH,
  MEDIA_BREAKPOINTS,
} from "./constants";
import type { Breakpoint, PlaygroundState } from "./types";

// 폭이 min-width 이상인 구간 중 가장 큰 구간. 어느 것도 아니면 base.
export function breakpointAt(width: number): Breakpoint {
  let current: Breakpoint = "base";
  for (const bp of MEDIA_BREAKPOINTS) {
    if (width >= BREAKPOINT_MIN_WIDTH[bp]) current = bp;
  }
  return current;
}

// base → md → lg 순서로, 지정한 구간까지의 덮어쓰기만 차례로 합친다.
// 예) lg 면 base 위에 md 를 덮고, 그 위에 lg 를 덮는다. (CSS 미디어쿼리가 쌓이는 방식과 같음)
export function resolveState(
  state: PlaygroundState,
  breakpoint: Breakpoint,
): PlaygroundState {
  const last = BREAKPOINTS.indexOf(breakpoint);
  let flex = state.flex;
  let grid = state.grid;

  for (const bp of MEDIA_BREAKPOINTS) {
    if (BREAKPOINTS.indexOf(bp) > last) break;
    flex = { ...flex, ...state.responsive[bp].flex };
    grid = { ...grid, ...state.responsive[bp].grid };
  }

  return { ...state, flex, grid };
}

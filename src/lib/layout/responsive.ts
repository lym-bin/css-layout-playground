// src/lib/layout/responsive.ts
// 미디어쿼리 구간 계산용 순수 함수 모음.
// - breakpointAt: 미리보기 폭이 어느 구간에 속하는지
// - resolveState: 그 구간까지의 덮어쓰기를 base 설정 위에 차례로 쌓은 "최종 상태"
// - 결과가 PlaygroundState 그대로라서 toContainerStyle 등 기존 함수를 수정 없이 재사용한다.
// - updateSetting / clearOverride: 편집 중인 구간에 값을 쓰거나, 덮어쓴 값을 지운다.
// - isOverridden / overrideCount: 화면에 "이 구간에서 바꾼 값" 표시용

import {
  BREAKPOINTS,
  BREAKPOINT_MIN_WIDTH,
  MEDIA_BREAKPOINTS,
} from "./constants";
import type {
  Breakpoint,
  BreakpointOverride,
  MediaBreakpoint,
  PlaygroundState,
} from "./types";

// 구간별로 덮어쓸 수 있는 설정 묶음 이름 ("flex" | "grid")
export type ContainerSection = keyof BreakpointOverride;

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

// base 를 편집 중이면 원래 설정(flex / grid)을, md / lg 면 그 구간의 덮어쓰기를 바꾼다.
export function updateSetting<
  S extends ContainerSection,
  K extends keyof PlaygroundState[S],
>(
  state: PlaygroundState,
  bp: Breakpoint,
  section: S,
  key: K,
  value: PlaygroundState[S][K],
): PlaygroundState {
  if (bp === "base") {
    return { ...state, [section]: { ...state[section], [key]: value } };
  }

  const override = state.responsive[bp];
  return {
    ...state,
    responsive: {
      ...state.responsive,
      [bp]: { ...override, [section]: { ...override[section], [key]: value } },
    },
  };
}

// 덮어쓴 값을 지워서 앞 구간 값을 그대로 쓰게 한다.
// undefined 를 넣으면 스프레드할 때 앞 값을 undefined 로 덮어버리므로, 키 자체를 지운다.
export function clearOverride<S extends ContainerSection>(
  state: PlaygroundState,
  bp: MediaBreakpoint,
  section: S,
  key: keyof BreakpointOverride[S],
): PlaygroundState {
  const override = state.responsive[bp];
  const values = { ...override[section] };
  delete values[key];
  return {
    ...state,
    responsive: {
      ...state.responsive,
      [bp]: { ...override, [section]: values },
    },
  };
}

export function isOverridden<S extends ContainerSection>(
  state: PlaygroundState,
  bp: Breakpoint,
  section: S,
  key: keyof BreakpointOverride[S],
): boolean {
  return bp !== "base" && key in state.responsive[bp][section];
}

// 현재 모드에서 그 구간에 덮어쓴 속성 개수 (탭 옆 숫자 표시용)
export function overrideCount(
  state: PlaygroundState,
  bp: MediaBreakpoint,
): number {
  return Object.keys(state.responsive[bp][state.mode]).length;
}

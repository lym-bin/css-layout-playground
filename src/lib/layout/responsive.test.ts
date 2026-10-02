// src/lib/layout/responsive.test.ts
// breakpointAt / resolveState / updateSetting / clearOverride 테스트.
// - 구간 경계값(767 / 768, 1023 / 1024)은 실수하기 쉬워서 표로 전부 검사한다.
// - 덮어쓰기가 "쌓이는지", 원본 상태를 건드리지 않는지 확인한다.

import { describe, expect, test } from "vitest";
import { DEFAULT_GRID_COLUMNS, INITIAL_STATE } from "./constants";
import {
  breakpointAt,
  clearOverride,
  isOverridden,
  overrideCount,
  resolveState,
  updateSetting,
} from "./responsive";
import type { PlaygroundState } from "./types";

// md 에서 방향을, lg 에서 gap 을 바꾼 상태
const stacked: PlaygroundState = {
  ...INITIAL_STATE,
  responsive: {
    md: { flex: { direction: "column" }, grid: {} },
    lg: { flex: { gap: 24 }, grid: {} },
  },
};

describe("breakpointAt", () => {
  test.each([
    [280, "base"],
    [767, "base"],
    [768, "md"],
    [1023, "md"],
    [1024, "lg"],
    [1280, "lg"],
  ] as const)("%ipx → %s", (width, expected) => {
    expect(breakpointAt(width)).toBe(expected);
  });
});

describe("resolveState", () => {
  test("덮어쓰기가 없으면 base 값 그대로", () => {
    expect(resolveState(INITIAL_STATE, "lg")).toEqual(INITIAL_STATE);
  });

  test("base 구간은 덮어쓰기를 적용하지 않는다", () => {
    const flex = resolveState(stacked, "base").flex;
    expect(flex.direction).toBe("row");
    expect(flex.gap).toBe(12);
  });

  test("md 구간은 md 덮어쓰기까지만", () => {
    const flex = resolveState(stacked, "md").flex;
    expect(flex.direction).toBe("column");
    expect(flex.gap).toBe(12);
  });

  test("lg 구간은 md 위에 lg 가 쌓인다", () => {
    const flex = resolveState(stacked, "lg").flex;
    expect(flex.direction).toBe("column");
    expect(flex.gap).toBe(24);
  });

  test("덮어쓰지 않은 속성은 base 값 유지", () => {
    expect(resolveState(stacked, "lg").flex.wrap).toBe(INITIAL_STATE.flex.wrap);
  });

  test("grid 열은 객체 통째로 교체된다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      responsive: {
        ...INITIAL_STATE.responsive,
        md: { flex: {}, grid: { columns: DEFAULT_GRID_COLUMNS["auto-fill"] } },
      },
    };
    expect(resolveState(state, "md").grid.columns).toEqual({
      kind: "auto-fill",
      minWidth: 120,
    });
  });

  test("원본 상태를 바꾸지 않는다", () => {
    resolveState(stacked, "lg");
    expect(stacked.flex).toEqual(INITIAL_STATE.flex);
  });
});

describe("updateSetting", () => {
  test("base 를 편집하면 원래 설정을 바꾸고 덮어쓰기는 그대로", () => {
    const next = updateSetting(INITIAL_STATE, "base", "flex", "gap", 20);
    expect(next.flex.gap).toBe(20);
    expect(next.responsive).toEqual(INITIAL_STATE.responsive);
  });

  test("md 를 편집하면 그 구간 덮어쓰기에만 들어간다", () => {
    const next = updateSetting(INITIAL_STATE, "md", "flex", "gap", 20);
    expect(next.flex.gap).toBe(INITIAL_STATE.flex.gap);
    expect(next.responsive.md.flex).toEqual({ gap: 20 });
    expect(next.responsive.lg.flex).toEqual({});
  });

  test("같은 기본 객체를 공유하던 다른 구간이 같이 바뀌지 않는다", () => {
    updateSetting(INITIAL_STATE, "md", "grid", "gap", 20);
    expect(INITIAL_STATE.responsive.md.grid).toEqual({});
    expect(INITIAL_STATE.responsive.lg.grid).toEqual({});
  });
});

describe("clearOverride", () => {
  test("키 자체를 지워서 앞 구간 값이 다시 보인다", () => {
    const cleared = clearOverride(stacked, "md", "flex", "direction");
    expect("direction" in cleared.responsive.md.flex).toBe(false);
    expect(resolveState(cleared, "md").flex.direction).toBe("row");
  });

  test("다른 구간의 덮어쓰기는 남는다", () => {
    const cleared = clearOverride(stacked, "md", "flex", "direction");
    expect(cleared.responsive.lg.flex).toEqual({ gap: 24 });
  });
});

describe("isOverridden / overrideCount", () => {
  test("덮어쓴 키만 true, base 는 항상 false", () => {
    expect(isOverridden(stacked, "md", "flex", "direction")).toBe(true);
    expect(isOverridden(stacked, "md", "flex", "gap")).toBe(false);
    expect(isOverridden(stacked, "base", "flex", "direction")).toBe(false);
  });

  test("현재 모드의 덮어쓰기만 센다", () => {
    expect(overrideCount(stacked, "md")).toBe(1);
    expect(overrideCount({ ...stacked, mode: "grid" }, "md")).toBe(0);
  });
});

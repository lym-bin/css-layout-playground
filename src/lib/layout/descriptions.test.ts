// src/lib/layout/descriptions.test.ts
// flexAxes 테스트. 미리보기의 축 화살표와 컨트롤 이름 옆 표시가 이 값을 그대로 쓴다.

import { describe, expect, test } from "vitest";
import { flexAxes } from "./descriptions";
import type { FlexDirection, FlexWrap } from "./types";

describe("flexAxes", () => {
  test.each([
    ["row", "nowrap", "가로 →", "세로 ↓"],
    ["row-reverse", "nowrap", "가로 ←", "세로 ↓"],
    ["column", "nowrap", "세로 ↓", "가로 →"],
    ["column-reverse", "nowrap", "세로 ↑", "가로 →"],
    ["row", "wrap-reverse", "가로 →", "세로 ↑"],
    ["column", "wrap-reverse", "세로 ↓", "가로 ←"],
  ] as [FlexDirection, FlexWrap, string, string][])(
    "%s + %s → 주축 %s / 교차축 %s",
    (direction, wrap, main, cross) => {
      const axes = flexAxes(direction, wrap);
      expect(`${axes.main.name} ${axes.main.arrow}`).toBe(main);
      expect(`${axes.cross.name} ${axes.cross.arrow}`).toBe(cross);
    },
  );
});

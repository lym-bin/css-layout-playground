// src/lib/layout/generateCss.test.ts
// generateCss / toColumnsTemplate / appliedMediaLines 테스트.
// - 문자열로 코드를 만드는 함수는 tsc 가 내용을 검사하지 않으므로 테스트로 지킨다.
// - 정확한 출력 비교(몇 가지 대표 상태) + 모든 프리셋에 대한 문법 규칙 검사를 같이 둔다.

import { describe, expect, test } from "vitest";
import { INITIAL_STATE } from "./constants";
import {
  appliedMediaLines,
  generateCss,
  toColumnsTemplate,
} from "./generateCss";
import { PRESETS } from "./presets";
import type { GridColumns, PlaygroundState } from "./types";

const gridState: PlaygroundState = { ...INITIAL_STATE, mode: "grid" };

// md 에서 gap 16, lg 에서 gap 24 로 덮어쓴 flex 상태
const twoMedia: PlaygroundState = {
  ...INITIAL_STATE,
  responsive: {
    md: { flex: { gap: 16 }, grid: {} },
    lg: { flex: { gap: 24 }, grid: {} },
  },
};

// 빈 줄, 선택자 줄("... {"), 닫는 줄("}")을 뺀 나머지 = 선언 줄
// @media 안은 한 단계 더 들여쓰므로 trim 해서 비교한다.
function declarationLines(css: string): string[] {
  return css
    .split("\n")
    .filter(
      (line) =>
        line.trim() !== "" && line.trim() !== "}" && !line.endsWith("{"),
    );
}

function selectorLines(css: string): string[] {
  return css.split("\n").filter((line) => line.endsWith("{"));
}

describe("generateCss", () => {
  test("flex 기본 상태", () => {
    expect(generateCss(INITIAL_STATE, false)).toBe(
      [
        ".container {",
        "  display: flex;",
        "  flex-direction: row;",
        "  flex-wrap: nowrap;",
        "  justify-content: flex-start;",
        "  align-items: stretch;",
        "  gap: 12px;",
        "}",
      ].join("\n"),
    );
  });

  test("grid 행이 auto 면 grid-template-rows 를 출력하지 않는다", () => {
    const state: PlaygroundState = {
      ...gridState,
      grid: { ...gridState.grid, rows: { kind: "auto" } },
    };
    expect(generateCss(state, false)).not.toContain("grid-template-rows");
  });

  test("바뀐 박스만 :nth-child 규칙이 생긴다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      items: INITIAL_STATE.items.map((item, i) =>
        i === 1 ? { ...item, flex: { ...item.flex, grow: 1 } } : item,
      ),
    };
    const css = generateCss(state, false);
    expect(css).toContain(".item:nth-child(2) {\n  flex-grow: 1;\n}");
    expect(css.match(/:nth-child/g)).toHaveLength(1);
  });

  test("콘텐츠 모드에서 이미지가 있으면 .item img 규칙을 붙인다", () => {
    expect(generateCss(INITIAL_STATE, true)).toContain(".item img {");
    expect(generateCss(INITIAL_STATE, false)).not.toContain(".item img");
  });

  test("넘침 방지 옵션을 켜면 .item 공통 규칙이 생긴다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      safeguards: { minWidthZero: true, wrapAnywhere: true },
    };
    expect(generateCss(state, false)).toContain(
      ".item {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}",
    );
    expect(generateCss(INITIAL_STATE, false)).not.toContain(".item {");
  });

  test("컨테이너가 ul 이면 목록 기본 스타일을 지운다", () => {
    const css = generateCss({ ...INITIAL_STATE, containerTag: "ul" }, false);
    expect(css).toContain(
      "  list-style: none;\n  margin: 0;\n  padding: 0;\n}",
    );
  });

  test("<a> 박스가 있으면 링크 기본 스타일을 되돌린다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      contents: [
        { title: "LOGO", tag: "a" },
        ...INITIAL_STATE.contents.slice(1),
      ],
    };
    expect(generateCss(state, false)).toContain(
      "a.item {\n  color: inherit;",
    );
    expect(generateCss(INITIAL_STATE, false)).not.toContain("a.item");
  });

  test("구간 덮어쓰기는 바뀐 속성만 @media 안에 출력한다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      responsive: {
        ...INITIAL_STATE.responsive,
        md: { flex: { direction: "column", gap: 24 }, grid: {} },
      },
    };
    expect(generateCss(state, false)).toContain(
      [
        "@media (min-width: 768px) {",
        "  .container {",
        "    flex-direction: column;",
        "    gap: 24px;",
        "  }",
        "}",
      ].join("\n"),
    );
  });

  test("덮어쓴 값이 없으면 @media 를 출력하지 않는다", () => {
    expect(generateCss(INITIAL_STATE, false)).not.toContain("@media");
  });

  test("다른 모드의 덮어쓰기는 출력하지 않는다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      responsive: {
        ...INITIAL_STATE.responsive,
        md: { flex: {}, grid: { gap: 24 } },
      },
    };
    expect(generateCss(state, false)).not.toContain("@media");
  });

  test("@media 는 작은 폭부터, 기본 .container 뒤에 나온다", () => {
    const css = generateCss(twoMedia, false);
    expect(css.indexOf(".container {")).toBeLessThan(css.indexOf("768px"));
    expect(css.indexOf("768px")).toBeLessThan(css.indexOf("1024px"));
  });

  test("grid 행을 auto 로 덮어쓰면 none 으로 되돌린다", () => {
    const state: PlaygroundState = {
      ...gridState,
      responsive: {
        ...INITIAL_STATE.responsive,
        md: { flex: {}, grid: { rows: { kind: "auto" } } },
      },
    };
    expect(generateCss(state, false)).toContain(
      "    grid-template-rows: none;",
    );
  });
});

describe("appliedMediaLines", () => {
  // 적용되는 줄만 모아서 비교하면 어느 블록이 잡혔는지 바로 보인다.
  function appliedText(width: number): string[] {
    const css = generateCss(twoMedia, false);
    const lines = appliedMediaLines(css, width);
    return css.split("\n").filter((_, i) => lines.has(i));
  }

  test("768px 미만이면 적용되는 @media 가 없다", () => {
    expect(appliedText(767)).toEqual([]);
  });

  test("768px 이상이면 md 블록 전체(여는 줄 ~ 닫는 줄)", () => {
    expect(appliedText(800)).toEqual([
      "@media (min-width: 768px) {",
      "  .container {",
      "    gap: 16px;",
      "  }",
      "}",
    ]);
  });

  test("1024px 이상이면 md 와 lg 블록 둘 다", () => {
    const text = appliedText(1024);
    expect(text).toContain("    gap: 16px;");
    expect(text).toContain("    gap: 24px;");
    expect(text).not.toContain(".container {");
  });
});

describe("toColumnsTemplate", () => {
  const cases: [GridColumns, string][] = [
    [{ kind: "count", count: 3 }, "repeat(3, 1fr)"],
    [
      { kind: "auto-fill", minWidth: 120 },
      "repeat(auto-fill, minmax(120px, 1fr))",
    ],
    [{ kind: "auto-fit", minWidth: 80 }, "repeat(auto-fit, minmax(80px, 1fr))"],
    [{ kind: "custom", template: "200px 1fr" }, "200px 1fr"],
  ];

  test.each(cases)("%o → %s", (columns, expected) => {
    expect(toColumnsTemplate(columns)).toBe(expected);
  });
});

describe("모든 프리셋의 CSS 문법 규칙", () => {
  // 두 모드 모두 @media 가 나오도록 양쪽에 덮어쓰기를 넣은 값
  const responsive: PlaygroundState["responsive"] = {
    md: {
      flex: { direction: "column" },
      grid: { columns: { kind: "count", count: 2 } },
    },
    lg: { flex: { gap: 24 }, grid: { rows: { kind: "auto" } } },
  };

  const cases = PRESETS.flatMap((preset) => [
    { name: `${preset.name} (숫자)`, css: generateCss(preset.state, false) },
    { name: `${preset.name} (콘텐츠)`, css: generateCss(preset.state, true) },
    {
      name: `${preset.name} (넘침 방지)`,
      css: generateCss(
        {
          ...preset.state,
          safeguards: { minWidthZero: true, wrapAnywhere: true },
        },
        true,
      ),
    },
    {
      name: `${preset.name} (미디어쿼리)`,
      css: generateCss({ ...preset.state, responsive }, true),
    },
  ]);

  test.each(cases)("$name", ({ css }) => {
    // 여는 중괄호와 닫는 중괄호 개수가 같아야 한다
    expect(css.split("{").length).toBe(css.split("}").length);

    // 선택자 줄: 들여쓰기 0칸(최상위) 또는 2칸(@media 안) + 공백 아닌 글자로 시작, " {" 로 끝
    for (const line of selectorLines(css)) {
      expect(line).toMatch(/^(?: {2})?\S.* \{$/);
    }

    // 선언 줄: 공백 2칸(최상위) 또는 4칸(@media 안) + 속성 이름 + ": " + 값 + ";"
    for (const line of declarationLines(css)) {
      expect(line).toMatch(/^(?: {2}){1,2}[a-z-]+: [^;]+;$/);
    }
  });
});

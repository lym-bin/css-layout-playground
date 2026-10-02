// src/lib/layout/generateCss.test.ts
// generateCss / toColumnsTemplate 테스트.
// - 문자열로 코드를 만드는 함수는 tsc 가 내용을 검사하지 않으므로 테스트로 지킨다.
// - 정확한 출력 비교(몇 가지 대표 상태) + 모든 프리셋에 대한 문법 규칙 검사를 같이 둔다.

import { describe, expect, test } from "vitest";
import { INITIAL_STATE } from "./constants";
import { generateCss, toColumnsTemplate } from "./generateCss";
import { PRESETS } from "./presets";
import type { GridColumns, PlaygroundState } from "./types";

const gridState: PlaygroundState = { ...INITIAL_STATE, mode: "grid" };

// 빈 줄, 선택자 줄("... {"), 닫는 줄("}")을 뺀 나머지 = 선언 줄
function declarationLines(css: string): string[] {
  return css
    .split("\n")
    .filter((line) => line !== "" && line !== "}" && !line.endsWith("{"));
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
  ]);

  test.each(cases)("$name", ({ css }) => {
    // 여는 중괄호와 닫는 중괄호 개수가 같아야 한다
    expect(css.split("{").length).toBe(css.split("}").length);

    // 선택자 줄: 맨 앞 공백 없이 시작하고 " {" 로 끝난다
    for (const line of selectorLines(css)) {
      expect(line).toMatch(/^\S.* \{$/);
    }

    // 선언 줄: 공백 2칸 + 속성 이름 + ": " + 값 + ";"
    for (const line of declarationLines(css)) {
      expect(line).toMatch(/^ {2}[a-z-]+: [^;]+;$/);
    }
  });
});

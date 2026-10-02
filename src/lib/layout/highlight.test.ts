// src/lib/layout/highlight.test.ts
// highlightCssLine / highlightHtmlLine 테스트.
// - 조각을 이어 붙이면 원래 줄과 같아야 한다 (모든 프리셋의 출력 코드로 검사)
// - 대표적인 줄은 어떤 종류로 나뉘는지 정확히 비교한다.

import { describe, expect, test } from "vitest";
import { generateCss } from "./generateCss";
import { generateHtml } from "./generateHtml";
import { highlightCssLine, highlightHtmlLine, type Token } from "./highlight";
import { PRESETS } from "./presets";
import type { PlaygroundState } from "./types";

const join = (tokens: Token[]) => tokens.map((t) => t.text).join("");
const types = (tokens: Token[]) => tokens.map((t) => [t.type, t.text]);

describe("highlightCssLine", () => {
  test("선언 줄: 속성 / 값 / 구두점", () => {
    expect(types(highlightCssLine("  gap: 12px;"))).toEqual([
      ["plain", "  "],
      ["property", "gap"],
      ["punct", ": "],
      ["value", "12px"],
      ["punct", ";"],
    ]);
  });

  test("선택자 줄", () => {
    expect(types(highlightCssLine(".item:nth-child(2) {"))).toEqual([
      ["selector", ".item:nth-child(2)"],
      ["punct", " {"],
    ]);
  });

  test("@media 줄", () => {
    expect(types(highlightCssLine("@media (min-width: 768px) {"))).toEqual([
      ["atrule", "@media"],
      ["value", " (min-width: 768px)"],
      ["punct", " {"],
    ]);
  });

  test("빈 줄은 조각이 없다", () => {
    expect(highlightCssLine("")).toEqual([]);
  });
});

describe("highlightHtmlLine", () => {
  test("속성이 있는 여는 태그 + 글자 + 닫는 태그", () => {
    expect(types(highlightHtmlLine('  <a class="item" href="#">1</a>'))).toEqual(
      [
        ["plain", "  "],
        ["punct", "<"],
        ["tag", "a"],
        ["plain", " "],
        ["attr", "class"],
        ["punct", "="],
        ["string", '"item"'],
        ["plain", " "],
        ["attr", "href"],
        ["punct", "="],
        ["string", '"#"'],
        ["punct", ">"],
        ["plain", "1"],
        ["punct", "</"],
        ["tag", "a"],
        ["punct", ">"],
      ],
    );
  });

  test("이스케이프된 글자는 그대로 둔다", () => {
    const line = "<p>a &lt; b &amp; c</p>";
    expect(join(highlightHtmlLine(line))).toBe(line);
  });
});

describe("모든 프리셋 출력은 조각을 이으면 원래 줄과 같다", () => {
  const responsive: PlaygroundState["responsive"] = {
    md: { flex: { gap: 20 }, grid: { columns: { kind: "count", count: 2 } } },
    lg: { flex: {}, grid: {} },
  };
  const cases = PRESETS.map((preset) => {
    const state = { ...preset.state, responsive };
    return {
      name: preset.name,
      css: generateCss(state, true),
      html: generateHtml(state, true),
    };
  });

  test.each(cases)("$name", ({ css, html }) => {
    for (const line of css.split("\n")) {
      expect(join(highlightCssLine(line))).toBe(line);
    }
    for (const line of html.split("\n")) {
      expect(join(highlightHtmlLine(line))).toBe(line);
    }
  });

  test.each(cases)("$name: CSS 에 분류 안 된 줄이 없다", ({ css }) => {
    for (const line of css.split("\n").filter((l) => l !== "")) {
      expect(highlightCssLine(line).some((t) => t.type !== "plain")).toBe(
        true,
      );
    }
  });
});

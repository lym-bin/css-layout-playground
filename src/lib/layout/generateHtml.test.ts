// src/lib/layout/generateHtml.test.ts
// generateHtml 테스트.
// - 숫자/콘텐츠 모드의 정확한 출력, HTML 이스케이프, 모든 프리셋의 태그 짝을 검사한다.

import { describe, expect, test } from "vitest";
import { INITIAL_STATE } from "./constants";
import { generateHtml } from "./generateHtml";
import { PRESETS } from "./presets";
import type { PlaygroundState } from "./types";

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

describe("generateHtml", () => {
  test("숫자 모드는 박스 개수만큼 번호가 들어간 item 을 만든다", () => {
    const state: PlaygroundState = { ...INITIAL_STATE, boxCount: 3 };
    expect(generateHtml(state, false)).toBe(
      [
        '<div class="container">',
        '  <div class="item">1</div>',
        '  <div class="item">2</div>',
        '  <div class="item">3</div>',
        "</div>",
      ].join("\n"),
    );
  });
  test("컨테이너 / 박스 태그를 반영한다", () => {
    const list: PlaygroundState = {
      ...INITIAL_STATE,
      containerTag: "ul",
      boxCount: 2,
      contents: [
        { title: "A", tag: "li" },
        { title: "B", tag: "li" },
      ],
    };
    expect(generateHtml(list, false)).toBe(
      [
        '<ul class="container">',
        '  <li class="item">1</li>',
        '  <li class="item">2</li>',
        "</ul>",
      ].join("\n"),
    );
  });
  test("<a> 에는 href 를 붙인다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      boxCount: 1,
      contents: [{ title: "LOGO", tag: "a" }],
    };
    expect(generateHtml(state, false)).toContain(
      '<a class="item" href="#">1</a>',
    );
  });

  test("콘텐츠 모드는 이미지 / 제목 / 설명 마크업을 넣는다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      boxCount: 1,
      contents: [{ title: "카드", body: "설명", image: true }],
    };
    expect(generateHtml(state, true)).toBe(
      [
        '<div class="container">',
        '  <div class="item">',
        '    <img src="image.jpg" alt="" width="640" height="360">',
        "    <strong>카드</strong>",
        "    <p>설명</p>",
        "  </div>",
        "</div>",
      ].join("\n"),
    );
  });

  test("콘텐츠 문자열의 특수문자를 이스케이프한다", () => {
    const state: PlaygroundState = {
      ...INITIAL_STATE,
      boxCount: 1,
      contents: [{ title: 'A & <b>"B"</b>' }],
    };
    expect(generateHtml(state, true)).toContain(
      "<strong>A &amp; &lt;b&gt;&quot;B&quot;&lt;/b&gt;</strong>",
    );
  });
});

// 여는 태그 이름마다 닫는 태그 개수가 같은지 확인하고, 안 맞는 태그 이름을 돌려준다.
// <img> 는 닫는 태그가 없는 태그라 제외한다.
function unbalancedTags(html: string): string[] {
  const opened = [...html.matchAll(/<([a-z]+)[ >]/g)]
    .map((m) => m[1])
    .filter((t) => t !== "img");
  return [...new Set(opened)].filter(
    (tag) =>
      countMatches(html, new RegExp(`<${tag}[ >]`, "g")) !==
      countMatches(html, new RegExp(`</${tag}>`, "g")),
  );
}
describe("모든 프리셋의 HTML 태그 규칙", () => {
  const cases = PRESETS.flatMap((preset) => [
    { name: `${preset.name} (숫자)`, html: generateHtml(preset.state, false) },
    { name: `${preset.name} (콘텐츠)`, html: generateHtml(preset.state, true) },
  ]);

  test.each(cases)("$name", ({ html }) => {
    // 모든 태그의 여는 / 닫는 개수가 맞아야 한다
    expect(unbalancedTags(html)).toEqual([]);
    // 닫는 태그 뒤에 ">" 가 빠진 곳이 없어야 한다
    expect(html).not.toMatch(/<\/[a-z]+(?![a-z>])/);
    // class 값은 항상 따옴표로 시작해야 한다
    expect(html).not.toMatch(/class=(?!")/);
  });
});

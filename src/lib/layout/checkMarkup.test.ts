// src/lib/layout/checkMarkup.test.ts
// checkMarkup 테스트
// - 규칙마다 걸리는 경우를 하나씩 만들어 id로 확인한다. (문구가 바뀌어도 테스트는 그대로)
// - 모든 프리셋은 마크업 오류가 없어야 한다. (프리셋 데이터 자체를 지킨다.)

import { describe } from "node:test";
import { checkMarkup } from "./checkMarkup";
import { INITIAL_STATE } from "./constants";
import { ContainerTag, ItemTag, PlaygroundState } from "./types";
import { expect, test } from "vitest";
import { PRESETS } from "./presets";

// 컨테이너 태그와 박스 태그 목록만으로 상태를 만든다.
function stateWith(
  containerTag: ContainerTag,
  tags: ItemTag[],
): PlaygroundState {
  return {
    ...INITIAL_STATE,
    containerTag,
    boxCount: tags.length,
    contents: tags.map((tag) => ({ title: "박스", tag })),
  };
}

function issueIds(state: PlaygroundState): string[] {
  return checkMarkup(state).map((issue) => issue.id);
}

describe("checkMarkup", () => {
  test("기본 상태는 div 남용 힌트만 나온다", () => {
    expect(issueIds(INITIAL_STATE)).toEqual(["all-div"]);
  });

  test("<ul> 안에 <li>가 아닌 박스가 있으면 오류", () => {
    expect(issueIds(stateWith("ul", ["li", "div"]))).toContain("ul-only-li");
  });

  test("<li>가 목록 밖에 있으면 오류", () => {
    expect(issueIds(stateWith("div", ["li", "li"]))).toContain(
      "li-outside-list",
    );
  });

  test("<main>이 두 개면 오류", () => {
    expect(issueIds(stateWith("div", ["main", "main"]))).toContain(
      "single-main",
    );
  });

  test("<main> 이 div가 아닌 컨테이너 안에 있으면 오류", () => {
    expect(issueIds(stateWith("section", ["main"]))).toContain(
      "main-placement",
    );
  });

  test("<header> 안에 <footer>가 있으면 오류", () => {
    expect(issueIds(stateWith("header", ["a", "footer"]))).toContain(
      "header-nesting",
    );
  });

  test("박스가 하나 뿐이면 div 남용 힌트를 내지 않는다", () => {
    expect(issueIds(stateWith("div", ["div"]))).toEqual([]);
  });
});

describe("모든 프리셋은 마크업 오류가 없다", () => {
  test.each(PRESETS)("$name", (preset) => {
    const errors = checkMarkup(preset.state).filter(
      (issue) => issue.level === "error",
    );
    expect(errors).toEqual([]);
  });
});

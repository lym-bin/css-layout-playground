// src/lib/layout/checkMarkup.ts
// 상태(PlayGroundState)의 컨테이너/박스 태그 조합이 HTML 규칙에 맞는지 검사
// - error: HTML 규칙 위반 (브라우저는 그려주지만 스크린리더, 검색엔진이 구조를 잘못 이해함)
// - hint: 규칙 위반은 아니지만 개선을 권하는 것 (div 남용)
// 문자열을 파싱하지 않고 이미 구조화된 상태 데이터를 바로 검사한다.

import { DEFAULT_ITEM_TAG } from "./constants";
import type { PlaygroundState } from "./types";

export type MarkupIssueId =
  | "ul-only-li"
  | "li-outside-list"
  | "single-main"
  | "main-placement"
  | "header-nesting"
  | "all-div";

export interface MarkupIssue {
  id: MarkupIssueId;
  level: "error" | "hint";
  message: string;
}

export function checkMarkup(state: PlaygroundState): MarkupIssue[] {
  const container = state.containerTag;
  const tags = state.contents
    .slice(0, state.boxCount)
    .map((content) => content.tag ?? DEFAULT_ITEM_TAG);
  const issues: MarkupIssue[] = [];

  if (container === "ul" && tags.some((tag) => tag !== "li")) {
    issues.push({
      id: "ul-only-li",
      level: "error",
      message: "<ul> 바로 안에는 <li>만 넣을 수 있습니다.",
    });
  }

  if (container !== "ul" && tags.includes("li")) {
    issues.push({
      id: "li-outside-list",
      level: "error",
      message: "<li>는 <ul>이나 <ol> 바로 안에 있어야 합니다.",
    });
  }

  if (tags.filter((tag) => tag === "main").length > 1) {
    issues.push({
      id: "single-main",
      level: "error",
      message: "<main>은 한 페이지에 하나만 있어야 합니다.",
    });
  }

  if (container !== "div" && tags.includes("main")) {
    issues.push({
      id: "main-placement",
      level: "error",
      message: `<main>은 <${container}> 안에 넣을 수 없습니다. 페이지 뼈대(div, body)바로 아래에 둡니다.`,
    });
  }

  if (
    container === "header" &&
    tags.some((tag) => tag === "header" || tag === "footer")
  ) {
    issues.push({
      id: "header-nesting",
      level: "error",
      message: "<header> 안에는 <header>나 <footer>를 넣을 수 없습니다.",
    });
  }

  if (
    container === "div" &&
    tags.length > 1 &&
    tags.every((tag) => tag === "div")
  ) {
    issues.push({
      id: "all-div",
      level: "hint",
      message:
        "모든 요소가 <div> 입니다. 헤더, 메뉴, 목록처럼 역할이 있는 영역이면 그에 맞는 태그를 써보세요.",
    });
  }

  return issues;
}

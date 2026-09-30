// src/lib/layout/generateCss.ts
// 상태(PlaygroundState)를 받아 두 가지 결과물을 만드는 순수 함수 모음.
// - toContainerStyle: 미리보기 컨테이너에 넣을 React style 객체
// - generateCss: 화면에 보여줄 CSS 코드 문자열
// 두 함수가 같은 상태에서 출발하므로 미리보기와 출력 코드가 항상 일치한다.

import type { CSSProperties } from "react";
import type { PlaygroundState } from "./types";

export function toContainerStyle(state: PlaygroundState): CSSProperties {
  if (state.mode === "flex") {
    const { direction, wrap, justifyContent, alignItems, gap } = state.flex;
    return {
      display: "flex",
      flexDirection: direction,
      flexWrap: wrap,
      justifyContent,
      alignItems,
      gap,
    };
  }

  const { columns, rows, gap, justifyItems, alignItems } = state.grid;
  return {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    justifyItems,
    alignItems,
    gap,
  };
}

export function generateCss(state: PlaygroundState): string {
  if (state.mode === "flex") {
    const { direction, wrap, justifyContent, alignItems, gap } = state.flex;
    return [
      ".container {",
      "  display: flex;",
      `  flex-direction: ${direction};`,
      `  flex-wrap: ${wrap};`,
      `  justify-content: ${justifyContent};`,
      `  align-items: ${alignItems};`,
      `  gap: ${gap}px;`,
      "}",
    ].join("\n");
  }

  const { columns, rows, gap, justifyItems, alignItems } = state.grid;
  return [
    ".container {",
    "  display: grid;",
    `  grid-template-columns: repeat(${columns}, 1fr);`,
    `  grid-template-rows: repeat(${rows}, 1fr);`,
    `  justify-items: ${justifyItems};`,
    `  align-items: ${alignItems};`,
    `  gap: ${gap}px;`,
    "}",
  ].join("\n");
}

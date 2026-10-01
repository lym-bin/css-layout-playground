// src/lib/layout/generateCss.ts
// 상태(PlaygroundState)를 받아 두 가지 결과물을 만드는 순수 함수 모음.
// - toContainerStyle: 미리보기 컨테이너에 넣을 React style 객체
// - generateCss: 화면에 보여줄 CSS 코드 문자열
// - toColumnsTemplate / toRowsTemplate: 두 함수가 같이 쓰는 Grid 템플릿 문자열
// 두 함수가 같은 상태에서 출발하므로 미리보기와 출력 코드가 항상 일치한다.

import type { CSSProperties } from "react";
import type { GridColumns, GridRows, PlaygroundState } from "./types";

export function toColumnsTemplate(columns: GridColumns): string {
  switch (columns.kind) {
    case "count":
      return `repeat(${columns.count}, 1fr)`;
    case "auto-fill":
    case "auto-fit":
      return `repeat(${columns.kind}, minmax(${columns.minWidth}px, 1fr))`;
    case "custom":
      return columns.template;
  }
}
// auto는 CSS 기본 동작이라 따로 출력하지 않는다 -> undefined
export function toRowsTemplate(rows: GridRows): string | undefined {
  return rows.kind === "count" ? `repeat(${rows.count}, 1fr)` : undefined;
}

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
    gridTemplateColumns: toColumnsTemplate(columns),
    gridTemplateRows: toRowsTemplate(rows),
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
  const rowsTemplate = toRowsTemplate(rows);
  return [
    ".container {",
    "  display: grid;",
    `  grid-template-columns: ${toColumnsTemplate(columns)};`,
    ...(rowsTemplate ? [` grid-template-rows: ${rowsTemplate};`] : []),
    `  justify-items: ${justifyItems};`,
    `  align-items: ${alignItems};`,
    `  gap: ${gap}px;`,
    "}",
  ].join("\n");
}

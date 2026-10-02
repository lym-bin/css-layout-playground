// src/lib/layout/generateCss.ts
// 상태(PlaygroundState)를 받아 미리보기 style 과 출력 CSS 를 만드는 순수 함수 모음.
// - toContainerStyle / toItemStyle: 미리보기에 넣을 React style 객체
// - generateCss: 화면에 보여줄 CSS 코드 문자열 (컨테이너 + 바뀐 박스의 :nth-child 규칙)
// - to...Template / to...Value: 위 두 쪽이 같이 쓰는 값 문자열
// 모두 같은 상태에서 출발하므로 미리보기와 출력 코드가 항상 일치한다.
// - // - generateCss: 화면에 보여줄 CSS 코드 문자열 (컨테이너 + .item 공통 + 바뀐 박스의 :nth-child 규칙)

import type { CSSProperties } from "react";
import type {
  FlexItemSettings,
  GridColumns,
  GridItemColumn,
  GridItemSettings,
  GridRows,
  PlaygroundState,
} from "./types";

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

// auto 는 CSS 기본 동작이라 따로 출력하지 않는다 → undefined
export function toRowsTemplate(rows: GridRows): string | undefined {
  return rows.kind === "count" ? `repeat(${rows.count}, 1fr)` : undefined;
}

// span 1 은 기본 동작이라 출력하지 않는다 → undefined
export function toGridColumnValue(column: GridItemColumn): string | undefined {
  if (column.kind === "full") return "1 / -1";
  return column.span > 1 ? `span ${column.span}` : undefined;
}

export function toGridRowValue(rowSpan: number): string | undefined {
  return rowSpan > 1 ? `span ${rowSpan}` : undefined;
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

export function toItemStyle(
  state: PlaygroundState,
  index: number,
): CSSProperties {
  const item = state.items[index];
  const { minWidthZero, wrapAnywhere } = state.safeguards;
  const safeguardStyle: CSSProperties = {
    minWidth: minWidthZero ? 0 : undefined,
    overflowWrap: wrapAnywhere ? "anywhere" : undefined,
  };

  if (state.mode === "flex") {
    return {
      ...safeguardStyle,
      flexGrow: item.flex.grow,
      alignSelf: item.flex.alignSelf,
    };
  }

  return {
    ...safeguardStyle,
    gridColumn: toGridColumnValue(item.grid.column),
    gridRow: toGridRowValue(item.grid.rowSpan),
  };
}

function containerLines(state: PlaygroundState): string[] {
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
    ];
  }

  const { columns, rows, gap, justifyItems, alignItems } = state.grid;
  const rowsTemplate = toRowsTemplate(rows);
  return [
    ".container {",
    "  display: grid;",
    `  grid-template-columns: ${toColumnsTemplate(columns)};`,
    ...(rowsTemplate ? [`  grid-template-rows: ${rowsTemplate};`] : []),
    `  justify-items: ${justifyItems};`,
    `  align-items: ${alignItems};`,
    `  gap: ${gap}px;`,
    "}",
  ];
}

// 넘침 방지 옵션이 하나라도 켜져 있으면 모든 박스에 적용되는 .item 규칙을 만든다.
function safeguardLines(state: PlaygroundState): string[] {
  const { minWidthZero, wrapAnywhere } = state.safeguards;
  const lines = [
    ...(minWidthZero ? ["  min-width: 0;"] : []),
    ...(wrapAnywhere ? ["  overflow-wrap: anywhere;"] : []),
  ];
  return lines.length === 0 ? [] : ["", ".item {", ...lines, "}"];
}
function flexItemLines(item: FlexItemSettings): string[] {
  return [
    ...(item.grow !== 0 ? [`  flex-grow: ${item.grow};`] : []),
    ...(item.alignSelf !== "auto" ? [`  align-self: ${item.alignSelf};`] : []),
  ];
}

function gridItemLines(item: GridItemSettings): string[] {
  const column = toGridColumnValue(item.column);
  const row = toGridRowValue(item.rowSpan);
  return [
    ...(column ? [`  grid-column: ${column};`] : []),
    ...(row ? [`  grid-row: ${row};`] : []),
  ];
}

// 기본값에서 바뀐 속성이 있는 박스만 규칙을 만든다.
function itemRuleLines(state: PlaygroundState): string[] {
  return state.items.slice(0, state.boxCount).flatMap((item, i) => {
    const lines =
      state.mode === "flex"
        ? flexItemLines(item.flex)
        : gridItemLines(item.grid);
    return lines.length === 0
      ? []
      : ["", `.item:nth-child(${i + 1}) {`, ...lines, "}"];
  });
}

// 이미지가 있는 박스가 하나라도 있으면 이미지 기본 규칙을 붙인다.
// 미리보기의 이미지 자리(aspect-video)와 같은 16:9 비율,
function contentRuleLines(state: PlaygroundState): string[] {
  const hasImage = state.contents
    .slice(0, state.boxCount)
    .some((content) => content.image);
  if (!hasImage) return [];

  return [
    "",
    ".item img {",
    "  display: block;",
    "  width: 100%;",
    "  height: auto;",
    "  aspect-ratio: 16 / 9;",
    "  object-fit: cover;",
    "}",
  ];
}

export function generateCss(
  state: PlaygroundState,
  withContent: boolean,
): string {
  return [
    ...containerLines(state),
    ...safeguardLines(state),
    ...itemRuleLines(state),
    ...(withContent ? contentRuleLines(state) : []),
  ].join("\n");
}

// src/lib/layout/generateCss.ts
// 상태(PlaygroundState)를 받아 미리보기 style 과 출력 CSS 를 만드는 순수 함수 모음.
// - toContainerStyle / toItemStyle: 미리보기에 넣을 React style 객체
// - generateCss: 화면에 보여줄 CSS 코드 문자열
//   (컨테이너 + 구간별 @media + .item 공통 + 바뀐 박스의 :nth-child 규칙)
// - appliedMediaLines: 출력 CSS 중 지금 미리보기 폭에 적용되는 @media 줄 번호
// - to...Template / to...Value: 위 쪽들이 같이 쓰는 값 문자열
// 모두 같은 상태에서 출발하므로 미리보기와 출력 코드가 항상 일치한다.

import type { CSSProperties } from "react";
import { BREAKPOINT_MIN_WIDTH, MEDIA_BREAKPOINTS } from "./constants";
import type {
  FlexItemSettings,
  GridColumns,
  GridItemColumn,
  GridItemSettings,
  GridRows,
  MediaBreakpoint,
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
  // <ul>은 브라우저 기본으로 글머리 기호와 안쪽 여백이 붙어서 레이아웃용으로 쓸 때는 지움
  const listReset =
    state.containerTag === "ul"
      ? ["  list-style: none;", "  margin: 0;", "  padding: 0;"]
      : [];
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
      ...listReset,
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
    ...listReset,
    "}",
  ];
}

// 값이 있을 때만 선언 줄 하나를 만든다. (덮어쓰지 않은 속성은 undefined → 줄 없음)
function decl(property: string, value: string | undefined): string[] {
  return value === undefined ? [] : [`  ${property}: ${value};`];
}

function px(value: number | undefined): string | undefined {
  return value === undefined ? undefined : `${value}px`;
}

// 한 구간에서 덮어쓴 속성만 선언 줄로 만든다. 현재 모드(flex / grid) 것만 출력한다.
function overrideLines(state: PlaygroundState, bp: MediaBreakpoint): string[] {
  const override = state.responsive[bp];

  if (state.mode === "flex") {
    const { direction, wrap, justifyContent, alignItems, gap } = override.flex;
    return [
      ...decl("flex-direction", direction),
      ...decl("flex-wrap", wrap),
      ...decl("justify-content", justifyContent),
      ...decl("align-items", alignItems),
      ...decl("gap", px(gap)),
    ];
  }

  const { columns, rows, gap, justifyItems, alignItems } = override.grid;
  return [
    ...decl("grid-template-columns", columns && toColumnsTemplate(columns)),
    // base 에서는 auto 면 줄을 생략하지만, 여기서는 앞 구간의 값을 되돌려야 하므로 none 을 적는다.
    ...decl("grid-template-rows", rows && (toRowsTemplate(rows) ?? "none")),
    ...decl("justify-items", justifyItems),
    ...decl("align-items", alignItems),
    ...decl("gap", px(gap)),
  ];
}

// 덮어쓴 값이 있는 구간만 @media 블록을 만든다. 작은 폭 → 큰 폭 순서.
function mediaLines(state: PlaygroundState): string[] {
  return MEDIA_BREAKPOINTS.flatMap((bp) => {
    const lines = overrideLines(state, bp);
    if (lines.length === 0) return [];
    return [
      "",
      `@media (min-width: ${BREAKPOINT_MIN_WIDTH[bp]}px) {`,
      "  .container {",
      ...lines.map((line) => `  ${line}`),
      "  }",
      "}",
    ];
  });
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

// <a> 는 기본으로 파란 밑줄 글자라, 카드 안 글자색을 그대로 쓰도록 되돌린다.
function linkRuleLines(state: PlaygroundState): string[] {
  const hasLink = state.contents
    .slice(0, state.boxCount)
    .some((content) => content.tag === "a");
  if (!hasLink) return [];
  return ["", "a.item {", "  color: inherit;", "  text-decoration: none;", "}"];
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
    // .container 기본 규칙보다 "뒤에" 있어야 덮어쓴다 (선택자 우선순위가 같으면 나중 규칙이 이김)
    ...mediaLines(state),
    ...safeguardLines(state),
    ...linkRuleLines(state),
    ...itemRuleLines(state),
    ...(withContent ? contentRuleLines(state) : []),
  ].join("\n");
}

// 출력 CSS 에서 지금 폭(width)에 적용되는 @media 블록의 줄 번호(0부터).
// 최상위 "}" 를 만나면 블록이 끝난 것 (@media 안의 닫는 줄은 "  }" 라 구분된다).
export function appliedMediaLines(css: string, width: number): Set<number> {
  const result = new Set<number>();
  let inside = false;
  css.split("\n").forEach((line, i) => {
    const match = line.match(/^@media \(min-width: (\d+)px\) \{$/);
    if (match) inside = width >= Number(match[1]);
    if (inside) result.add(i);
    if (line === "}") inside = false;
  });
  return result;
}

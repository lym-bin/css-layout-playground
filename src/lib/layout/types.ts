// src/lib/layout/types.ts
// 플레이그라운드 상태의 "모양"을 정의하는 type 모음
// - Flex / Grid 속성에 들어갈 수 있는 값들을 유니언 타입으로 제한
// Grid 열/행은 "종류에 따라 필요한 값이 달라서 판별 유니언으로 표현"
// - 전체 상태(PlaygroundState) 구조 정의
// 런타임 코드는 없고 컴파일 타임 검사용
// - 박스별 개별 속성(ItemSettings) 정의
export type LayoutMode = "flex" | "grid";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type FlexAlignItems =
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline";
export type GridAlign = "stretch" | "start" | "end" | "center";

export type GridColumns =
  | { kind: "count"; count: number }
  | { kind: "auto-fill"; minWidth: number }
  | { kind: "auto-fit"; minWidth: number }
  | { kind: "custom"; template: string };

export type GridColumnsKind = GridColumns["kind"];
export type GridRows = { kind: "count"; count: number } | { kind: "auto" };
export type GridRowsKind = GridRows["kind"];
export type FlexAlignSelf = "auto" | FlexAlignItems;
export type GridItemColumn = { kind: "span"; span: number } | { kind: "full" };
export type GridItemColumnKind = GridItemColumn["kind"];

export interface FlexSettings {
  direction: FlexDirection;
  wrap: FlexWrap;
  justifyContent: JustifyContent;
  alignItems: FlexAlignItems;
  gap: number;
}

export interface GridSettings {
  columns: GridColumns;
  rows: GridRows;
  gap: number;
  justifyItems: GridAlign;
  alignItems: GridAlign;
}
export interface FlexItemSettings {
  grow: number;
  alignSelf: FlexAlignSelf;
}
export interface GridItemSettings {
  column: GridItemColumn;
  rowSpan: number;
}
// 박스 하나의 개별속성. 모드를 바꿔도 각 모드 설정이 남도록 둘 다 보관.
export interface ItemSettings {
  flex: FlexItemSettings;
  grid: GridItemSettings;
}
// 콘텐츠 모드에서 박스 안에 보여줄 내용, 레이아웃(CSS)에는 영향이 없다.
export interface BoxContent {
  title: string;
  body?: string;
  image?: boolean;
}
export interface PlaygroundState {
  mode: LayoutMode;
  boxCount: number;
  flex: FlexSettings;
  grid: GridSettings;
  items: ItemSettings[];
  contents: BoxContent[];
}

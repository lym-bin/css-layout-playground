// src/lib/layout/types.ts
// 플레이그라운드 상태의 "모양"을 정의하는 type 모음
// - Flex / Grid 속성에 들어갈 수 있는 값들을 유니언 타입으로 제한
// Grid 열/행은 "종류에 따라 필요한 값이 달라서 판별 유니언으로 표현"
// - 전체 상태(PlaygroundState) 구조 정의
// 런타임 코드는 없고 컴파일 타임 검사용
// - 박스별 개별 속성(ItemSettings) 정의
// - 미디어쿼리 구간(Breakpoint)과 구간별 덮어쓰기(BreakpointOverride) 정의

export type LayoutMode = "flex" | "grid";
// 미리보기를 숫자로 "ㅇ볼지, 예시 콘텐츠로 볼지, 출력 HTML/CSS도 이 값에 따라 달라잔다.
export type PreviewView = "number" | "content";
// 출력 HTML에 쓸 태그, 역할에 맞는 태그를 고르면 의미가 드러나는 마크업이 된다.
export type ContainerTag = "div" | "header" | "nav" | "section" | "ul";
export type ItemTag =
  | "div"
  | "header"
  | "nav"
  | "main"
  | "aside"
  | "footer"
  | "section"
  | "article"
  | "li"
  | "a";
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
  tag?: ItemTag;
}
// 콘텐츠가 길 때 박스를 뚫고 나가지 않게 하는 .item 공통 규칙
export interface SafeguardSettings {
  minWidthZero: boolean;
  wrapAnywhere: boolean;
}
// 미디어쿼리 구간, 모바일 우선(mobile-first)이라 base(미디어 쿼리 없음)가 기본이고
// md / lg는 "이 폭 이상" 일 때 base 위에 값을 덮어 쓴다.
export type Breakpoint = "base" | "md" | "lg";

// 덮어쓰기가 가능한 구간, base는 원래 설정(flex / grid) 그 자체라 뺀다.
export type MediaBreakpoint = Exclude<Breakpoint, "base">;

// 한 구간에서 "바꾼 컨테이너 값만" 담는다.
// 비어 있으면 ({}) 그 구간은 미디어쿼리를 출력하지 않는다.
export interface BreakpointOverride {
  flex: Partial<FlexSettings>;
  grid: Partial<GridSettings>;
}
export interface PlaygroundState {
  mode: LayoutMode;
  boxCount: number;
  flex: FlexSettings;
  grid: GridSettings;
  items: ItemSettings[];
  contents: BoxContent[];
  safeguards: SafeguardSettings;
  containerTag: ContainerTag;
  // 구간별 덮어쓰기, base 값은 위의 flex / grid를 그대로 쓴다.
  responsive: Record<MediaBreakpoint, BreakpointOverride>;
}

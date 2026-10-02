// src/lib/layout/descriptions.ts
// 컨트롤 아래에 보여줄 "지금 고른 값이 무슨 뜻인지" 한 줄 설명 모음.
// - 선택지마다 Record 로 적어서, 선택지가 늘면 설명이 빠졌다고 컴파일 에러가 난다.
// - 화면 문구일 뿐 레이아웃 계산에는 쓰지 않는다.

import type {
  ContainerTag,
  FlexAlignItems,
  FlexAlignSelf,
  FlexDirection,
  FlexWrap,
  GridAlign,
  GridColumnsKind,
  GridItemColumnKind,
  GridRowsKind,
  ItemTag,
  JustifyContent,
} from "./types";

// flex-direction 에 따라 주축 / 교차축이 가로인지 세로인지
export function flexAxes(direction: FlexDirection): {
  main: string;
  cross: string;
} {
  return direction.startsWith("row")
    ? { main: "가로", cross: "세로" }
    : { main: "세로", cross: "가로" };
}

export const FLEX_DIRECTION_HINTS: Record<FlexDirection, string> = {
  row: "왼쪽 → 오른쪽으로 가로 배치합니다.",
  "row-reverse": "오른쪽 → 왼쪽으로, 순서를 뒤집어 가로 배치합니다.",
  column: "위 → 아래로 세로 배치합니다.",
  "column-reverse": "아래 → 위로, 순서를 뒤집어 세로 배치합니다.",
};

export const FLEX_WRAP_HINTS: Record<FlexWrap, string> = {
  nowrap: "한 줄에 모두 놓습니다. 자리가 모자라면 박스가 줄어들거나 넘칩니다.",
  wrap: "자리가 모자라면 다음 줄로 넘깁니다.",
  "wrap-reverse": "다음 줄로 넘기되, 줄이 반대 방향으로 쌓입니다.",
};

export const JUSTIFY_CONTENT_HINTS: Record<JustifyContent, string> = {
  "flex-start": "주축의 시작 쪽으로 모읍니다.",
  "flex-end": "주축의 끝 쪽으로 모읍니다.",
  center: "주축의 가운데로 모읍니다.",
  "space-between": "양 끝에 붙이고, 사이 간격을 똑같이 나눕니다.",
  "space-around": "박스마다 양옆에 같은 여백을 줍니다. 양 끝 여백은 사이의 절반입니다.",
  "space-evenly": "양 끝 여백과 사이 간격을 모두 똑같이 나눕니다.",
};

export const FLEX_ALIGN_ITEMS_HINTS: Record<FlexAlignItems, string> = {
  stretch: "교차축 방향으로 늘려서 꽉 채웁니다. (크기를 정하지 않은 박스만)",
  "flex-start": "교차축의 시작 쪽에 붙입니다.",
  "flex-end": "교차축의 끝 쪽에 붙입니다.",
  center: "교차축의 가운데에 맞춥니다.",
  baseline: "박스 안 첫 줄 글자의 밑선을 맞춥니다.",
};

export const FLEX_ALIGN_SELF_HINTS: Record<FlexAlignSelf, string> = {
  auto: "컨테이너의 align-items 를 그대로 따릅니다.",
  stretch: "이 박스만 교차축 방향으로 꽉 채웁니다.",
  "flex-start": "이 박스만 교차축의 시작 쪽에 붙입니다.",
  "flex-end": "이 박스만 교차축의 끝 쪽에 붙입니다.",
  center: "이 박스만 교차축의 가운데에 맞춥니다.",
  baseline: "이 박스만 글자 밑선을 다른 박스와 맞춥니다.",
};

export const GRID_JUSTIFY_ITEMS_HINTS: Record<GridAlign, string> = {
  stretch: "칸의 가로 폭을 꽉 채웁니다.",
  start: "칸 안에서 왼쪽에 붙입니다.",
  end: "칸 안에서 오른쪽에 붙입니다.",
  center: "칸 안에서 가로 가운데에 둡니다.",
};

export const GRID_ALIGN_ITEMS_HINTS: Record<GridAlign, string> = {
  stretch: "칸의 세로 높이를 꽉 채웁니다.",
  start: "칸 안에서 위쪽에 붙입니다.",
  end: "칸 안에서 아래쪽에 붙입니다.",
  center: "칸 안에서 세로 가운데에 둡니다.",
};

export const GRID_COLUMNS_HINTS: Record<GridColumnsKind, string> = {
  count: "열 개수를 정하고 폭을 똑같이 나눕니다. repeat(N, 1fr)",
  "auto-fill": "최소 너비 이상으로 들어갈 만큼 열을 만듭니다. 박스가 적으면 빈 열이 남습니다.",
  "auto-fit": "auto-fill 과 같지만, 박스가 적으면 빈 열을 없애고 박스를 늘립니다.",
  custom: "열 너비를 직접 적습니다. 예) 200px 1fr = 200px 고정 + 나머지 전부",
};

export const GRID_ROWS_HINTS: Record<GridRowsKind, string> = {
  count: "행 개수를 정하고 높이를 똑같이 나눕니다.",
  auto: "내용 높이만큼 행이 자동으로 생깁니다.",
};

export const GRID_ITEM_COLUMN_HINTS: Record<GridItemColumnKind, string> = {
  span: "열을 정한 칸 수만큼 차지합니다.",
  full: "첫 열부터 마지막 열까지 전체 폭을 차지합니다. (1 / -1)",
};

export const CONTAINER_TAG_HINTS: Record<ContainerTag, string> = {
  div: "의미 없이 묶기만 하는 상자입니다.",
  header: "페이지나 구역의 머리 부분입니다.",
  nav: "주요 링크(메뉴)를 묶습니다.",
  section: "주제가 있는 하나의 구역입니다.",
  ul: "순서 없는 목록입니다. 바로 안에는 <li> 만 둡니다.",
};

export const ITEM_TAG_HINTS: Record<ItemTag, string> = {
  div: "의미 없이 묶기만 하는 상자입니다.",
  header: "페이지나 구역의 머리 부분입니다.",
  nav: "주요 링크(메뉴)를 묶습니다.",
  main: "페이지의 핵심 내용입니다. 한 페이지에 하나만 둡니다.",
  aside: "본문 옆의 곁다리 내용입니다. (사이드바 등)",
  footer: "페이지나 구역의 꼬리 정보입니다.",
  section: "주제가 있는 하나의 구역입니다.",
  article: "따로 떼어내도 의미가 통하는 글이나 카드입니다.",
  li: "목록의 항목입니다. <ul> / <ol> 안에서만 씁니다.",
  a: "다른 곳으로 이동하는 링크입니다.",
};

export function flexGrowHint(grow: number): string {
  return grow === 0
    ? "남는 공간을 가져가지 않습니다."
    : `남는 공간을 다른 박스의 grow 값과 비율(${grow})로 나눠 가집니다.`;
}

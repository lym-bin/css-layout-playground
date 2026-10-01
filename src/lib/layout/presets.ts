// src/lib/layout/presets.ts
//  레이아웃 패턴을 "상태 스냅샷"으로 정의한 목록.
// - 프리셋 하나 = PlaygroundState 하나. 적용은 setState(preset.state) 한 줄이면 된다.
// - INITIAL_STATE 를 바탕으로 필요한 값만 덮어써서 만든다.
// - 화면(UI)과 상관없는 순수 데이터라 lib 에 둔다.

import { INITIAL_STATE } from "./constants";
import type {
  FlexItemSettings,
  GridItemSettings,
  ItemSettings,
  PlaygroundState,
} from "./types";

export interface Preset {
  id: string;
  name: string;
  description: string;
  state: PlaygroundState;
}

interface ItemOverride {
  flex?: Partial<FlexItemSettings>;
  grid?: Partial<GridItemSettings>;
}

// 바꿀 박스만 { 인덱스(0부터): 덮어쓸 값 } 으로 넘기면 나머지는 기본값으로 채운다.
function makeItems(overrides: Record<number, ItemOverride>): ItemSettings[] {
  return INITIAL_STATE.items.map((item, i) => {
    const override = overrides[i];
    if (!override) return item;
    return {
      flex: { ...item.flex, ...override.flex },
      grid: { ...item.grid, ...override.grid },
    };
  });
}

export const PRESETS: readonly Preset[] = [
  {
    id: "center",
    name: "가운데 정렬",
    description: "박스 하나를 가로·세로 정중앙에",
    state: {
      ...INITIAL_STATE,
      mode: "flex",
      boxCount: 1,
      flex: {
        ...INITIAL_STATE.flex,
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
  {
    id: "navbar",
    name: "네비게이션 바",
    description: "로고 · 메뉴 · 버튼을 양 끝으로",
    state: {
      ...INITIAL_STATE,
      mode: "flex",
      boxCount: 3,
      flex: {
        ...INITIAL_STATE.flex,
        justifyContent: "space-between",
        alignItems: "center",
      },
    },
  },
  {
    id: "sticky-footer",
    name: "푸터 하단 고정",
    description: "본문(2번)이 남은 높이를 채움",
    state: {
      ...INITIAL_STATE,
      mode: "flex",
      boxCount: 3,
      flex: { ...INITIAL_STATE.flex, direction: "column", gap: 8 },
      items: makeItems({ 1: { flex: { grow: 1 } } }),
    },
  },
  {
    id: "card-grid",
    name: "반응형 카드 그리드",
    description: "너비에 맞춰 열 개수가 바뀜",
    state: {
      ...INITIAL_STATE,
      mode: "grid",
      boxCount: 8,
      grid: {
        ...INITIAL_STATE.grid,
        columns: { kind: "auto-fill", minWidth: 140 },
        rows: { kind: "auto" },
        gap: 16,
      },
    },
  },
  {
    id: "holy-grail",
    name: "헤더 · 사이드바 · 푸터",
    description: "헤더/푸터는 전체 폭",
    state: {
      ...INITIAL_STATE,
      mode: "grid",
      boxCount: 4,
      grid: {
        ...INITIAL_STATE.grid,
        columns: { kind: "custom", template: "160px 1fr" },
        rows: { kind: "auto" },
      },
      items: makeItems({
        0: { grid: { column: { kind: "full" } } },
        3: { grid: { column: { kind: "full" } } },
      }),
    },
  },
  {
    id: "featured",
    name: "대표 카드 강조",
    description: "첫 카드만 2×2 칸 차지",
    state: {
      ...INITIAL_STATE,
      mode: "grid",
      boxCount: 7,
      grid: {
        ...INITIAL_STATE.grid,
        columns: { kind: "count", count: 3 },
        rows: { kind: "auto" },
      },
      items: makeItems({
        0: { grid: { column: { kind: "span", span: 2 }, rowSpan: 2 } },
      }),
    },
  },
];

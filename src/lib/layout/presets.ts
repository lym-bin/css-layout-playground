// src/lib/layout/presets.ts
// 실무에서 자주 쓰는 레이아웃 패턴을 "상태 스냅샷"으로 정의한 목록.
// - 프리셋 하나 = PlaygroundState 하나. 적용은 setState(preset.state) 한 줄이면 된다.
// - INITIAL_STATE 를 바탕으로 필요한 값만 덮어써서 만든다.
// - 콘텐츠 모드에서 보일 박스 내용과, 실무에서 쓰는 HTML 태그도 패턴에 맞게 같이 정의한다.
// - 화면(UI)과 상관없는 순수 데이터라 lib 에 둔다.

import { DEFAULT_CONTENTS, INITIAL_STATE } from "./constants";
import type {
  BoxContent,
  FlexItemSettings,
  GridItemSettings,
  ItemSettings,
  ItemTag,
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

// 앞에서부터 박스 내용만 넘기면 나머지 칸은 기본 콘텐츠로 채운다.
function makeContents(contents: BoxContent[]): BoxContent[] {
  return [...contents, ...DEFAULT_CONTENTS.slice(contents.length)];
}

// 넘긴 콘텐츠 전부에 같은 태그를 붙인다. (상품 목록의 li, 기사 목록의 article 등)
function tagged(tag: ItemTag, contents: BoxContent[]): BoxContent[] {
  return contents.map((content) => ({ ...content, tag }));
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
      contents: makeContents([
        {
          title: "결제가 완료되었습니다",
          body: "주문 내역은 마이페이지에서 확인할 수 있어요.",
          tag: "section",
        },
      ]),
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
      containerTag: "header",
      contents: makeContents([
        { title: "LOGO", tag: "a" },
        { title: "홈 · 소개 · 블로그", tag: "nav" },
        { title: "로그인", tag: "a" },
      ]),
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
      contents: makeContents([
        { title: "헤더", tag: "header" },
        {
          title: "본문",
          body: "내용이 짧아도 이 영역이 남은 높이를 채워서 푸터가 바닥에 붙습니다.",
          tag: "main",
        },
        { title: "푸터", body: "© 2026 My Site", tag: "footer" },
      ]),
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
      containerTag: "ul",
      contents: makeContents(
        tagged("li", [
          { title: "무선 이어폰", body: "89,000원", image: true },
          {
            title: "기계식 키보드 (갈축, 텐키리스)",
            body: "129,000원",
            image: true,
          },
          { title: "마우스", body: "39,000원", image: true },
          { title: "모니터 받침대", body: "45,000원", image: true },
          { title: "USB-C 허브 7in1", body: "52,000원", image: true },
          { title: "노트북 파우치", body: "24,000원", image: true },
          { title: "데스크 매트 (900x400)", body: "19,000원", image: true },
          { title: "웹캠", body: "68,000원", image: true },
        ]),
      ),
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
      contents: makeContents([
        { title: "헤더", tag: "header" },
        { title: "사이드바", body: "대시보드 · 주문 · 설정", tag: "aside" },
        {
          title: "본문",
          body: "사이드바는 160px 고정, 본문은 남은 너비를 전부 씁니다.",
          tag: "main",
        },
        { title: "푸터", tag: "footer" },
      ]),
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
      containerTag: "section",
      contents: makeContents(
        tagged("article", [
          {
            title: "이번 주 대표 기사",
            body: "첫 카드만 2×2 칸을 차지해서 시선을 먼저 끕니다. 뉴스나 매거진 메인에서 흔히 쓰는 배치입니다.",
            image: true,
          },
          { title: "두 번째 기사", body: "짧은 요약", image: true },
          { title: "세 번째 기사", body: "짧은 요약", image: true },
          { title: "네 번째 기사", image: true },
          { title: "다섯 번째 기사", image: true },
          { title: "여섯 번째 기사", image: true },
          { title: "일곱 번째 기사", image: true },
        ]),
      ),
    },
  },
  {
    id: "overflow-bug",
    name: "넘침 버그 재현",
    description: "긴 링크가 칸을 뚫고 나감",
    state: {
      ...INITIAL_STATE,
      mode: "flex",
      boxCount: 3,
      contents: makeContents([
        { title: "짧은 카드", body: "보통 내용" },
        {
          title: "긴 링크",
          body: "https://example.com/a-very-long-url-without-any-spaces-that-breaks-layouts",
        },
        { title: "짧은 카드", body: "보통 내용" },
      ]),
    },
  },
];

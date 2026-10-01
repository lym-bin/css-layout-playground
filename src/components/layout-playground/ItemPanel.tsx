// src/components/layout-playground/ItemPanel.tsx
// 왼쪽 아래 "선택한 박스" 개별 속성 패널.
// - 선택이 없으면 안내 문구만 표시
// - Flex: flex-grow, align-self / Grid: grid-column, grid-row(span)
// - 상태는 부모(LayoutPlayground)의 state.items 배열에서 선택한 칸만 바꾼다.

import type { Dispatch, SetStateAction } from "react";
import {
  DEFAULT_GRID_ITEM_COLUMN,
  DEFAULT_ITEM,
  FLEX_ALIGN_SELFS,
  GRID_ITEM_COLUMN_KINDS,
  LIMITS,
} from "@/lib/layout/constants";
import type {
  FlexItemSettings,
  GridItemSettings,
  ItemSettings,
  PlaygroundState,
} from "@/lib/layout/types";
import RangeControl from "./controls/RangeControl";
import SelectControl from "./controls/SelectControl";

const PANEL_CLASS =
  "flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950";

interface ItemPanelProps {
  state: PlaygroundState;
  setState: Dispatch<SetStateAction<PlaygroundState>>;
  selectedIndex: number | null;
}

export default function ItemPanel({
  state,
  setState,
  selectedIndex,
}: ItemPanelProps) {
  if (selectedIndex === null) {
    return (
      <aside className={PANEL_CLASS}>
        <p className="text-sm text-zinc-500">
          미리보기에서 박스를 클릭하면 그 박스만의 속성을 조절할 수 있습니다.
        </p>
      </aside>
    );
  }

  const index = selectedIndex;
  const item = state.items[index];
  const { column } = item.grid;

  const updateItem = (update: (item: ItemSettings) => ItemSettings) =>
    setState((s) => ({
      ...s,
      items: s.items.map((it, i) => (i === index ? update(it) : it)),
    }));

  const setFlexItem = <K extends keyof FlexItemSettings>(
    key: K,
    value: FlexItemSettings[K],
  ) => updateItem((it) => ({ ...it, flex: { ...it.flex, [key]: value } }));

  const setGridItem = <K extends keyof GridItemSettings>(
    key: K,
    value: GridItemSettings[K],
  ) => updateItem((it) => ({ ...it, grid: { ...it.grid, [key]: value } }));

  return (
    <aside className={PANEL_CLASS}>
      <h2 className="text-sm font-semibold">박스 {index + 1} 개별 속성</h2>

      {state.mode === "flex" ? (
        <>
          <RangeControl
            label="flex-grow"
            value={item.flex.grow}
            min={LIMITS.grow.min}
            max={LIMITS.grow.max}
            onChange={(v) => setFlexItem("grow", v)}
          />
          <SelectControl
            label="align-self"
            value={item.flex.alignSelf}
            options={FLEX_ALIGN_SELFS}
            onChange={(v) => setFlexItem("alignSelf", v)}
          />
        </>
      ) : (
        <>
          <SelectControl
            label="grid-column"
            value={column.kind}
            options={GRID_ITEM_COLUMN_KINDS}
            onChange={(kind) =>
              setGridItem("column", DEFAULT_GRID_ITEM_COLUMN[kind])
            }
          />
          {column.kind === "span" && (
            <RangeControl
              label="column span"
              value={column.span}
              min={LIMITS.span.min}
              max={LIMITS.span.max}
              onChange={(span) => setGridItem("column", { kind: "span", span })}
            />
          )}
          <RangeControl
            label="row span"
            value={item.grid.rowSpan}
            min={LIMITS.rowSpan.min}
            max={LIMITS.rowSpan.max}
            onChange={(v) => setGridItem("rowSpan", v)}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => updateItem(() => DEFAULT_ITEM)}
        className="rounded-md border border-zinc-300 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      >
        이 박스 초기화
      </button>
    </aside>
  );
}

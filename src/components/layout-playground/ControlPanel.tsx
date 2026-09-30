// src/components/layout-playground/ControlPanel.tsx
// 왼쪽 조작 패널.
// - Flexbox / Grid 모드 토글
// - 박스 개수 슬라이더 (두 모드 공통)
// - 현재 모드에 맞는 속성 컨트롤들
// - Reset 버튼
// 상태는 직접 갖지 않고, 부모(LayoutPlayground)의 state / setState 를 받아서 쓴다.

import type { Dispatch, SetStateAction } from "react";
import {
  FLEX_ALIGN_ITEMS,
  FLEX_DIRECTIONS,
  FLEX_WRAPS,
  GRID_ALIGNS,
  INITIAL_STATE,
  JUSTIFY_CONTENTS,
  LIMITS,
} from "@/lib/layout/constants";
import type {
  FlexSettings,
  GridSettings,
  LayoutMode,
  PlaygroundState,
} from "@/lib/layout/types";
import RangeControl from "./controls/RangeControl";
import SelectControl from "./controls/SelectControl";

const MODES: readonly LayoutMode[] = ["flex", "grid"];

interface ControlPanelProps {
  state: PlaygroundState;
  setState: Dispatch<SetStateAction<PlaygroundState>>;
}

export default function ControlPanel({ state, setState }: ControlPanelProps) {
  const setFlex = <K extends keyof FlexSettings>(
    key: K,
    value: FlexSettings[K],
  ) => setState((s) => ({ ...s, flex: { ...s.flex, [key]: value } }));

  const setGrid = <K extends keyof GridSettings>(
    key: K,
    value: GridSettings[K],
  ) => setState((s) => ({ ...s, grid: { ...s.grid, [key]: value } }));

  return (
    <aside className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
        {MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={state.mode === mode}
            onClick={() => setState((s) => ({ ...s, mode }))}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              state.mode === mode
                ? "bg-white shadow-sm dark:bg-zinc-700"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {mode === "flex" ? "Flexbox" : "Grid"}
          </button>
        ))}
      </div>

      <RangeControl
        label="Box count"
        value={state.boxCount}
        min={LIMITS.boxCount.min}
        max={LIMITS.boxCount.max}
        onChange={(boxCount) => setState((s) => ({ ...s, boxCount }))}
      />

      {state.mode === "flex" ? (
        <>
          <SelectControl
            label="flex-direction"
            value={state.flex.direction}
            options={FLEX_DIRECTIONS}
            onChange={(v) => setFlex("direction", v)}
          />
          <SelectControl
            label="flex-wrap"
            value={state.flex.wrap}
            options={FLEX_WRAPS}
            onChange={(v) => setFlex("wrap", v)}
          />
          <SelectControl
            label="justify-content"
            value={state.flex.justifyContent}
            options={JUSTIFY_CONTENTS}
            onChange={(v) => setFlex("justifyContent", v)}
          />
          <SelectControl
            label="align-items"
            value={state.flex.alignItems}
            options={FLEX_ALIGN_ITEMS}
            onChange={(v) => setFlex("alignItems", v)}
          />
          <RangeControl
            label="gap"
            unit="px"
            value={state.flex.gap}
            min={LIMITS.gap.min}
            max={LIMITS.gap.max}
            onChange={(v) => setFlex("gap", v)}
          />
        </>
      ) : (
        <>
          <RangeControl
            label="columns"
            value={state.grid.columns}
            min={LIMITS.columns.min}
            max={LIMITS.columns.max}
            onChange={(v) => setGrid("columns", v)}
          />
          <RangeControl
            label="rows"
            value={state.grid.rows}
            min={LIMITS.rows.min}
            max={LIMITS.rows.max}
            onChange={(v) => setGrid("rows", v)}
          />
          <SelectControl
            label="justify-items"
            value={state.grid.justifyItems}
            options={GRID_ALIGNS}
            onChange={(v) => setGrid("justifyItems", v)}
          />
          <SelectControl
            label="align-items"
            value={state.grid.alignItems}
            options={GRID_ALIGNS}
            onChange={(v) => setGrid("alignItems", v)}
          />
          <RangeControl
            label="gap"
            unit="px"
            value={state.grid.gap}
            min={LIMITS.gap.min}
            max={LIMITS.gap.max}
            onChange={(v) => setGrid("gap", v)}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => setState(INITIAL_STATE)}
        className="rounded-md border border-zinc-300 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      >
        Reset
      </button>
    </aside>
  );
}

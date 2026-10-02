// src/components/layout-playground/ControlPanel.tsx
// 왼쪽 조작 패널.
// - Flexbox / Grid 모드 토글
// - 박스 개수 슬라이더 (두 모드 공통)
// - 현재 모드에 맞는 속성 컨트롤들
// - Reset 버튼
// 상태는 직접 갖지 않고, 부모(LayoutPlayground)의 state / setState 를 받아서 쓴다.

import type { Dispatch, SetStateAction } from "react";
import {
  DEFAULT_GRID_COLUMNS,
  DEFAULT_GRID_ROWS,
  FLEX_ALIGN_ITEMS,
  FLEX_DIRECTIONS,
  FLEX_WRAPS,
  GRID_ALIGNS,
  GRID_COLUMNS_KINDS,
  GRID_ROWS_KINDS,
  INITIAL_STATE,
  JUSTIFY_CONTENTS,
  LIMITS,
} from "@/lib/layout/constants";
import type {
  FlexSettings,
  GridSettings,
  LayoutMode,
  PlaygroundState,
  SafeguardSettings,
} from "@/lib/layout/types";
import RangeControl from "./controls/RangeControl";
import SelectControl from "./controls/SelectControl";
import TextControl from "./controls/TextControl";
import CheckboxControl from "./controls/CheckboxControl";

const MODES: readonly LayoutMode[] = ["flex", "grid"];

// 서버에서 미리 렌더링할 때는 CSS 객체가 없으므로 통과시킨다.
const isValidColumnsTemplate = (template: string) =>
  typeof CSS === "undefined" || CSS.supports("grid-template-columns", template);

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

  const setSafeguards = <K extends keyof SafeguardSettings>(
    key: K,
    value: SafeguardSettings[K],
  ) =>
    setState((s) => ({ ...s, safeguards: { ...s.safeguards, [key]: value } }));
  const { columns, rows } = state.grid;
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
          <SelectControl
            label="grid-template-columns"
            value={columns.kind}
            options={GRID_COLUMNS_KINDS}
            onChange={(kind) => setGrid("columns", DEFAULT_GRID_COLUMNS[kind])}
          />
          {columns.kind === "count" && (
            <RangeControl
              label="columns"
              value={columns.count}
              min={LIMITS.columns.min}
              max={LIMITS.columns.max}
              onChange={(count) => setGrid("columns", { kind: "count", count })}
            />
          )}
          {(columns.kind === "auto-fill" || columns.kind === "auto-fit") && (
            <RangeControl
              label="min width"
              unit="px"
              value={columns.minWidth}
              min={LIMITS.minWidth.min}
              max={LIMITS.minWidth.max}
              onChange={(minWidth) =>
                setGrid("columns", { ...columns, minWidth })
              }
            />
          )}
          {columns.kind === "custom" && (
            <TextControl
              label="template"
              value={columns.template}
              placeholder="200px 1fr"
              error={
                isValidColumnsTemplate(columns.template)
                  ? undefined
                  : "유효하지 않는 값이라 브라우저가 무시합니다"
              }
              onChange={(template) =>
                setGrid("columns", { kind: "custom", template })
              }
            />
          )}

          <SelectControl
            label="grid-template-rows"
            value={rows.kind}
            options={GRID_ROWS_KINDS}
            onChange={(kind) => setGrid("rows", DEFAULT_GRID_ROWS[kind])}
          />
          {rows.kind === "count" && (
            <RangeControl
              label="rows"
              value={rows.count}
              min={LIMITS.rows.min}
              max={LIMITS.rows.max}
              onChange={(count) => setGrid("rows", { kind: "count", count })}
            />
          )}
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
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-xs font-semibold text-zinc-500">
          콘텐츠 넘침 방지 (.item)
        </legend>
        <CheckboxControl
          label="min-width: 0"
          description="내용보다 작게 줄어들 수 있게"
          checked={state.safeguards.minWidthZero}
          onChange={(v) => setSafeguards("minWidthZero", v)}
        />
        <CheckboxControl
          label="overflow-wrap: anywhere"
          description="띄어쓰기 없는 긴 단어도 줄바꿈"
          checked={state.safeguards.wrapAnywhere}
          onChange={(v) => setSafeguards("wrapAnywhere", v)}
        />
      </fieldset>
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

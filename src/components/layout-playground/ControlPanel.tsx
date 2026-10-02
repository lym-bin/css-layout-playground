// src/components/layout-playground/ControlPanel.tsx
// 왼쪽 조작 패널.
// - Flexbox / Grid 모드 토글
// - 박스 개수 슬라이더 (두 모드 공통)
// - 편집 구간 탭 (기본 / 768px 이상 / 1024px 이상) → 아래 컨테이너 속성이 어느 구간 값인지 정함
// - 현재 모드에 맞는 속성 컨트롤들 (구간에서 덮어쓴 값은 파란 선 + 되돌리기 버튼으로 표시)
// - Reset 버튼
// 상태는 직접 갖지 않고, 부모(LayoutPlayground)의 state / setState 를 받아서 쓴다.

import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  BREAKPOINT_LABELS,
  BREAKPOINTS,
  CONTAINER_TAGS,
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
import {
  clearOverride,
  isOverridden,
  overrideCount,
  resolveState,
  updateSetting,
  type ContainerSection,
} from "@/lib/layout/responsive";
import type {
  Breakpoint,
  BreakpointOverride,
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

const BREAKPOINT_HINTS: Record<Breakpoint, string> = {
  base: "모든 화면 폭에 적용되는 기본값입니다.",
  md: "화면 폭 768px 이상에서만 바꿀 값입니다. 바꾼 값만 CSS의 @media 안에 출력됩니다.",
  lg: "화면 폭 1024px 이상에서만 바꿀 값입니다. 768px 이상 구간 값 위에 덮어씁니다.",
};

// 서버에서 미리 렌더링할 때는 CSS 객체가 없으므로 통과시킨다.
const isValidColumnsTemplate = (template: string) =>
  typeof CSS === "undefined" || CSS.supports("grid-template-columns", template);

interface ControlPanelProps {
  state: PlaygroundState;
  setState: Dispatch<SetStateAction<PlaygroundState>>;
  editing: Breakpoint;
  onEditingChange: (bp: Breakpoint) => void;
}

export default function ControlPanel({
  state,
  setState,
  editing,
  onEditingChange,
}: ControlPanelProps) {
  // 편집 중인 구간에서 실제로 적용되는 값 (앞 구간 덮어쓰기까지 반영)
  const shown = resolveState(state, editing);
  const media = editing === "base" ? null : editing;

  const setFlex = <K extends keyof FlexSettings>(
    key: K,
    value: FlexSettings[K],
  ) => setState((s) => updateSetting(s, editing, "flex", key, value));

  const setGrid = <K extends keyof GridSettings>(
    key: K,
    value: GridSettings[K],
  ) => setState((s) => updateSetting(s, editing, "grid", key, value));

  const setSafeguards = <K extends keyof SafeguardSettings>(
    key: K,
    value: SafeguardSettings[K],
  ) =>
    setState((s) => ({ ...s, safeguards: { ...s.safeguards, [key]: value } }));

  // 컨트롤 하나를 감싸서, 이 구간에서 덮어쓴 값이면 표시 + 되돌리기 버튼을 붙인다.
  const field = <S extends ContainerSection>(
    section: S,
    key: keyof BreakpointOverride[S],
    control: ReactNode,
  ) => (
    <OverrideField
      editingBase={media === null}
      overridden={isOverridden(state, editing, section, key)}
      onReset={() => {
        if (media) setState((s) => clearOverride(s, media, section, key));
      }}
    >
      {control}
    </OverrideField>
  );

  const { columns, rows } = shown.grid;
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
      <SelectControl
        label="컨테이너 태그"
        value={state.containerTag}
        options={CONTAINER_TAGS}
        onChange={(containerTag) => setState((s) => ({ ...s, containerTag }))}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xs font-semibold text-zinc-500">
          편집할 화면 구간 (@media)
        </legend>
        <div className="flex gap-1">
          {BREAKPOINTS.map((bp) => {
            const count = bp === "base" ? 0 : overrideCount(state, bp);
            return (
              <button
                key={bp}
                type="button"
                aria-pressed={editing === bp}
                onClick={() => onEditingChange(bp)}
                className={`flex-1 rounded-md border px-1 py-1.5 text-xs transition-colors ${
                  editing === bp
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                {BREAKPOINT_LABELS[bp]}
                {count > 0 && ` (${count})`}
              </button>
            );
          })}
        </div>
        <p className="text-xs leading-5 text-zinc-500">
          {BREAKPOINT_HINTS[editing]}
        </p>
      </fieldset>

      {state.mode === "flex" ? (
        <>
          {field(
            "flex",
            "direction",
            <SelectControl
              label="flex-direction"
              value={shown.flex.direction}
              options={FLEX_DIRECTIONS}
              onChange={(v) => setFlex("direction", v)}
            />,
          )}
          {field(
            "flex",
            "wrap",
            <SelectControl
              label="flex-wrap"
              value={shown.flex.wrap}
              options={FLEX_WRAPS}
              onChange={(v) => setFlex("wrap", v)}
            />,
          )}
          {field(
            "flex",
            "justifyContent",
            <SelectControl
              label="justify-content"
              value={shown.flex.justifyContent}
              options={JUSTIFY_CONTENTS}
              onChange={(v) => setFlex("justifyContent", v)}
            />,
          )}
          {field(
            "flex",
            "alignItems",
            <SelectControl
              label="align-items"
              value={shown.flex.alignItems}
              options={FLEX_ALIGN_ITEMS}
              onChange={(v) => setFlex("alignItems", v)}
            />,
          )}
          {field(
            "flex",
            "gap",
            <RangeControl
              label="gap"
              unit="px"
              value={shown.flex.gap}
              min={LIMITS.gap.min}
              max={LIMITS.gap.max}
              onChange={(v) => setFlex("gap", v)}
            />,
          )}
        </>
      ) : (
        <>
          {field(
            "grid",
            "columns",
            <div className="flex flex-col gap-5">
              <SelectControl
                label="grid-template-columns"
                value={columns.kind}
                options={GRID_COLUMNS_KINDS}
                onChange={(kind) =>
                  setGrid("columns", DEFAULT_GRID_COLUMNS[kind])
                }
              />
              {columns.kind === "count" && (
                <RangeControl
                  label="columns"
                  value={columns.count}
                  min={LIMITS.columns.min}
                  max={LIMITS.columns.max}
                  onChange={(count) =>
                    setGrid("columns", { kind: "count", count })
                  }
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
            </div>,
          )}
          {field(
            "grid",
            "rows",
            <div className="flex flex-col gap-5">
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
            </div>,
          )}
          {field(
            "grid",
            "justifyItems",
            <SelectControl
              label="justify-items"
              value={shown.grid.justifyItems}
              options={GRID_ALIGNS}
              onChange={(v) => setGrid("justifyItems", v)}
            />,
          )}
          {field(
            "grid",
            "alignItems",
            <SelectControl
              label="align-items"
              value={shown.grid.alignItems}
              options={GRID_ALIGNS}
              onChange={(v) => setGrid("alignItems", v)}
            />,
          )}
          {field(
            "grid",
            "gap",
            <RangeControl
              label="gap"
              unit="px"
              value={shown.grid.gap}
              min={LIMITS.gap.min}
              max={LIMITS.gap.max}
              onChange={(v) => setGrid("gap", v)}
            />,
          )}
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

// 덮어쓴 값 표시용 테두리.
// 덮어쓰기 여부와 상관없이 항상 같은 div 로 감싼다. 표시할 때만 div 를 붙이면
// 트리 구조가 바뀌어 안쪽 input 이 다시 만들어지고, 슬라이더를 끌던 중에 손을 놓친다.
function OverrideField({
  editingBase,
  overridden,
  onReset,
  children,
}: {
  editingBase: boolean;
  overridden: boolean;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={
        editingBase
          ? "flex flex-col gap-1"
          : `flex flex-col gap-1 border-l-2 pl-3 ${
              overridden ? "border-sky-500" : "border-transparent"
            }`
      }
    >
      {children}
      {overridden && (
        <button
          type="button"
          onClick={onReset}
          className="self-start text-xs text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
        >
          이 구간에서 바꾼 값 되돌리기
        </button>
      )}
    </div>
  );
}

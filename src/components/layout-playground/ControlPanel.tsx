// src/components/layout-playground/ControlPanel.tsx
// 왼쪽 패널의 "레이아웃" 탭 내용. (Flexbox / Grid 전환은 맨 위 헤더에 있음)
// - 박스 개수 슬라이더 (두 모드 공통)
// - 편집 구간 탭 (기본 / 768px 이상 / 1024px 이상) → 아래 컨테이너 속성이 어느 구간 값인지 정함
// - 현재 모드에 맞는 속성 컨트롤들 (구간에서 덮어쓴 값은 파란 선 + 되돌리기 버튼으로 표시)
//   이름은 한국어 + CSS 속성 태그, 아래에 지금 고른 값의 뜻(descriptions.ts)을 한 줄로 보여준다.
//   선택지는 알약 버튼(ChoiceControl)으로 전부 펼치고, 방향 / 정렬 / 간격처럼 구역(Section)으로 묶는다.
// - 덜 쓰는 설정(콘텐츠 넘침 방지)은 "더 알아보기"에 접어둔다.
// - 처음 상태로 되돌리기 버튼
// 상태는 직접 갖지 않고, 부모(LayoutPlayground)의 state / setState 를 받아서 쓴다.

import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  BREAKPOINT_LABELS,
  BREAKPOINTS,
  DEFAULT_GRID_COLUMNS,
  DEFAULT_GRID_ROWS,
  FLEX_ALIGN_ITEMS,
  FLEX_DIRECTIONS,
  FLEX_WRAPS,
  GRID_ALIGNS,
  GRID_COLUMNS_KINDS,
  GRID_ROWS_KINDS,
  JUSTIFY_CONTENTS,
  LIMITS,
} from "@/lib/layout/constants";
import {
  FLEX_ALIGN_ITEMS_HINTS,
  FLEX_DIRECTION_HINTS,
  FLEX_WRAP_HINTS,
  flexAxes,
  GRID_ALIGN_ITEMS_HINTS,
  GRID_COLUMNS_HINTS,
  GRID_JUSTIFY_ITEMS_HINTS,
  GRID_ROWS_HINTS,
  JUSTIFY_CONTENT_HINTS,
} from "@/lib/layout/descriptions";
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
  PlaygroundState,
  SafeguardSettings,
} from "@/lib/layout/types";
import RangeControl from "./controls/RangeControl";
import ChoiceControl from "./controls/ChoiceControl";
import TextControl from "./controls/TextControl";
import CheckboxControl from "./controls/CheckboxControl";

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
  onReset: () => void;
}

export default function ControlPanel({
  state,
  setState,
  editing,
  onEditingChange,
  onReset,
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
  const axes = flexAxes(shown.flex.direction, shown.flex.wrap);
  const safeguardOn =
    state.safeguards.minWidthZero || state.safeguards.wrapAnywhere;
  return (
    <div className="flex flex-col gap-5">
      <RangeControl
        label="박스 개수"
        value={state.boxCount}
        min={LIMITS.boxCount.min}
        max={LIMITS.boxCount.max}
        onChange={(boxCount) => setState((s) => ({ ...s, boxCount }))}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          편집할 화면 구간{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] font-normal text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            @media
          </code>
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
          <Section title="방향">
            {field(
              "flex",
              "direction",
              <ChoiceControl
                label="배치 방향"
                code="flex-direction"
                hint={FLEX_DIRECTION_HINTS[shown.flex.direction]}
                value={shown.flex.direction}
                options={FLEX_DIRECTIONS}
                onChange={(v) => setFlex("direction", v)}
              />,
            )}
            {field(
              "flex",
              "wrap",
              <ChoiceControl
                label="줄바꿈"
                code="flex-wrap"
                hint={FLEX_WRAP_HINTS[shown.flex.wrap]}
                value={shown.flex.wrap}
                options={FLEX_WRAPS}
                onChange={(v) => setFlex("wrap", v)}
              />,
            )}
          </Section>
          <Section title="정렬">
            {field(
              "flex",
              "justifyContent",
              <ChoiceControl
                label="주축 정렬"
                axis={{ axis: axes.main, tone: "main" }}
                code="justify-content"
                hint={JUSTIFY_CONTENT_HINTS[shown.flex.justifyContent]}
                value={shown.flex.justifyContent}
                options={JUSTIFY_CONTENTS}
                onChange={(v) => setFlex("justifyContent", v)}
              />,
            )}
            {field(
              "flex",
              "alignItems",
              <ChoiceControl
                label="교차축 정렬"
                axis={{ axis: axes.cross, tone: "cross" }}
                code="align-items"
                hint={FLEX_ALIGN_ITEMS_HINTS[shown.flex.alignItems]}
                value={shown.flex.alignItems}
                options={FLEX_ALIGN_ITEMS}
                onChange={(v) => setFlex("alignItems", v)}
              />,
            )}
          </Section>
          <Section title="간격">
            {field(
              "flex",
              "gap",
              <RangeControl
                label="박스 사이 간격"
                code="gap"
                hint="박스와 박스 사이만 벌어집니다. 바깥 여백은 생기지 않습니다."
                unit="px"
                value={shown.flex.gap}
                min={LIMITS.gap.min}
                max={LIMITS.gap.max}
                onChange={(v) => setFlex("gap", v)}
              />,
            )}
          </Section>
        </>
      ) : (
        <>
          <Section title="칸 나누기">
            {field(
              "grid",
              "columns",
              <div className="flex flex-col gap-5">
                <ChoiceControl
                  label="열 나누기"
                  code="grid-template-columns"
                  hint={GRID_COLUMNS_HINTS[columns.kind]}
                  value={columns.kind}
                  options={GRID_COLUMNS_KINDS}
                  onChange={(kind) =>
                    setGrid("columns", DEFAULT_GRID_COLUMNS[kind])
                  }
                />
                {columns.kind === "count" && (
                  <RangeControl
                    label="열 개수"
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
                    label="열 최소 너비"
                    hint="열 하나가 이보다 좁아지지 않습니다. 화면이 좁아지면 열 개수가 줄어듭니다."
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
                    label="열 너비 직접 입력"
                    hint="fr 은 남은 공간을 나눠 갖는 비율입니다. 예) 1fr 2fr = 1 : 2"
                    value={columns.template}
                    placeholder="200px 1fr"
                    error={
                      isValidColumnsTemplate(columns.template)
                        ? undefined
                        : "올바르지 않은 값이라 브라우저가 무시합니다."
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
                <ChoiceControl
                  label="행 나누기"
                  code="grid-template-rows"
                  hint={GRID_ROWS_HINTS[rows.kind]}
                  value={rows.kind}
                  options={GRID_ROWS_KINDS}
                  onChange={(kind) => setGrid("rows", DEFAULT_GRID_ROWS[kind])}
                />
                {rows.kind === "count" && (
                  <RangeControl
                    label="행 개수"
                    value={rows.count}
                    min={LIMITS.rows.min}
                    max={LIMITS.rows.max}
                    onChange={(count) => setGrid("rows", { kind: "count", count })}
                  />
                )}
              </div>,
            )}
          </Section>
          <Section title="칸 안 정렬">
            {field(
              "grid",
              "justifyItems",
              <ChoiceControl
                label="칸 안 가로 정렬"
                code="justify-items"
                hint={GRID_JUSTIFY_ITEMS_HINTS[shown.grid.justifyItems]}
                value={shown.grid.justifyItems}
                options={GRID_ALIGNS}
                onChange={(v) => setGrid("justifyItems", v)}
              />,
            )}
            {field(
              "grid",
              "alignItems",
              <ChoiceControl
                label="칸 안 세로 정렬"
                code="align-items"
                hint={GRID_ALIGN_ITEMS_HINTS[shown.grid.alignItems]}
                value={shown.grid.alignItems}
                options={GRID_ALIGNS}
                onChange={(v) => setGrid("alignItems", v)}
              />,
            )}
          </Section>
          <Section title="간격">
            {field(
              "grid",
              "gap",
              <RangeControl
                label="칸 사이 간격"
                code="gap"
                hint="칸과 칸 사이만 벌어집니다. 바깥 여백은 생기지 않습니다."
                unit="px"
                value={shown.grid.gap}
                min={LIMITS.gap.min}
                max={LIMITS.gap.max}
                onChange={(v) => setGrid("gap", v)}
              />,
            )}
          </Section>
        </>
      )}
      {/* 처음 배우는 사람에게는 덜 중요한 설정이라 접어둔다.
          open 을 상태로 묶으면 체크를 끄는 순간 닫혀버려서, 열고 닫기는 브라우저에 맡기고
          접힌 상태에서도 켜짐 / 꺼짐을 보여준다. */}
      <details className="group rounded-lg border border-zinc-200 dark:border-zinc-800">
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          <span>
            더 알아보기 · 콘텐츠 넘침 방지{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] font-normal text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              .item
            </code>
          </span>
          <span className="flex items-center gap-2 text-xs font-normal text-zinc-500">
            {safeguardOn ? "켜짐" : "꺼짐"}
            <span
              aria-hidden
              className="text-base text-zinc-400 transition-transform group-open:rotate-90"
            >
              ›
            </span>
          </span>
        </summary>
        <div className="flex flex-col gap-3 border-t border-zinc-200 px-3 py-3 dark:border-zinc-800">
          <CheckboxControl
            label="내용보다 작게 줄어들기"
            code="min-width: 0"
            description="flex / grid 박스는 기본으로 안의 가장 긴 단어보다 작아지지 않습니다."
            checked={state.safeguards.minWidthZero}
            onChange={(v) => setSafeguards("minWidthZero", v)}
          />
          <CheckboxControl
            label="긴 단어도 줄바꿈"
            code="overflow-wrap: anywhere"
            description="띄어쓰기 없는 긴 링크나 단어를 칸 안에서 끊어 줍니다."
            checked={state.safeguards.wrapAnywhere}
            onChange={(v) => setSafeguards("wrapAnywhere", v)}
          />
        </div>
      </details>
      <button
        type="button"
        onClick={onReset}
        className="rounded-md border border-zinc-300 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      >
        처음 상태로 되돌리기
      </button>
    </div>
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

// 관련 있는 컨트롤끼리 묶는 구역. 위쪽 구분선 + 작은 제목으로 덩어리를 나눠서
// 컨트롤이 한 줄로 길게 이어져 보이지 않게 한다.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-t border-zinc-200 pt-5 dark:border-zinc-800">
      <h3 className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

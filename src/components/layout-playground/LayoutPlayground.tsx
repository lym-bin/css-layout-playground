// src/components/layout-playground/LayoutPlayground.tsx
// 플레이그라운드 전체를 조립하는 클라이언트 컴포넌트.
// - 레이아웃 상태(PlaygroundState), 선택한 박스(selectedIndex), 보기 방식(view),
//   미리보기 폭(width), 편집 중인 @media 구간(editing), 왼쪽 패널 탭(panelTab),
//   마지막으로 불러온 프리셋(presetId)을 여기서 보관
// - 화면 배치
//   - 맨 위: 제목 + Flexbox / Grid 전환 → 프리셋 칩 줄
//   - 넓은 화면: 왼쪽 패널(레이아웃 / 박스 / 마크업 탭) | 오른쪽 미리보기 → 진단 + 코드
//   - 좁은 화면: 미리보기를 먼저 두고, 패널을 조작하는 동안 위에 고정(sticky)
// - "use client" 경계는 이 파일 하나. 여기서 import하는 컴포넌트는 자동으로 클라이언트에 포함된다.

"use client";

import { useState } from "react";
import { checkMarkup } from "@/lib/layout/checkMarkup";
import {
  BREAKPOINT_LABELS,
  BREAKPOINT_PREVIEW_WIDTH,
  INITIAL_STATE,
  MEDIA_BREAKPOINTS,
} from "@/lib/layout/constants";
import { appliedMediaLines, generateCss } from "@/lib/layout/generateCss";
import { generateHtml } from "@/lib/layout/generateHtml";
import { PRESETS, type Preset } from "@/lib/layout/presets";
import { overrideCount } from "@/lib/layout/responsive";
import type {
  Breakpoint,
  LayoutMode,
  PlaygroundState,
  PreviewView,
} from "@/lib/layout/types";
import CodeOutput from "./CodeOutput";
import ControlPanel from "./ControlPanel";
import ItemPanel from "./ItemPanel";
import MarkupCheck from "./MarkupCheck";
import MarkupPanel from "./MarkupPanel";
import PresetPanel from "./PresetPanel";
import PreviewCanvas from "./PreviewCanvas";
import SidePanel, { type PanelTab } from "./SidePanel";

const MODES: readonly { mode: LayoutMode; label: string; sub: string }[] = [
  { mode: "flex", label: "Flexbox", sub: "한 줄 배치" },
  { mode: "grid", label: "Grid", sub: "바둑판 배치" },
];

export default function LayoutPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [view, setView] = useState<PreviewView>("number");
  // 미리보기 폭은 원래 PreviewCanvas 안에만 있었는데,
  // 편집 구간 탭이 폭을 바꾸고 CSS 출력이 적용 중인 @media 를 강조해야 해서 여기로 올렸다.
  const [width, setWidth] = useState(BREAKPOINT_PREVIEW_WIDTH.md);
  const [editing, setEditing] = useState<Breakpoint>("base");
  const [panelTab, setPanelTab] = useState<PanelTab>("layout");
  const [presetId, setPresetId] = useState<string | null>(null);

  // 박스 개수를 줄여서 선택한 박스가 사라졌으면 "선택 없음"으로 취급
  const activeIndex =
    selectedIndex !== null && selectedIndex < state.boxCount
      ? selectedIndex
      : null;

  const withContent = view === "content";
  const issues = checkMarkup(state);
  const css = generateCss(state, withContent);

  // 프리셋을 불러온 뒤 값을 바꿨는지: 프리셋 상태 객체를 그대로 쓰고 있으면 안 바뀐 것.
  // (불변 업데이트라 값이 하나라도 바뀌면 새 객체가 된다)
  const activePreset = PRESETS.find((preset) => preset.id === presetId);
  const presetModified =
    activePreset !== undefined && state !== activePreset.state;

  // 구간 탭이나 기기 버튼을 고르면 미리보기도 그 구간 폭으로 맞춰서, 바꾸는 값이 바로 보이게 한다.
  const editBreakpoint = (bp: Breakpoint) => {
    setEditing(bp);
    setWidth(BREAKPOINT_PREVIEW_WIDTH[bp]);
  };

  // 박스를 고르면 바로 조절할 수 있게 "박스" 탭을 연다.
  const selectBox = (index: number | null) => {
    setSelectedIndex(index);
    if (index !== null) setPanelTab("box");
  };

  // @media 가 하나도 없을 때, 어떻게 만드는지 CSS 출력 아래에 안내한다.
  const hasMedia = MEDIA_BREAKPOINTS.some((bp) => overrideCount(state, bp) > 0);
  const mediaNote = hasMedia
    ? undefined
    : editing === "base"
      ? "아직 @media 가 없습니다. 미리보기의 태블릿 / 데스크톱 버튼(또는 레이아웃 탭의 '편집할 화면 구간')을 누른 뒤 값을 바꾸면 그 구간의 @media 블록이 여기에 추가됩니다."
      : `${BREAKPOINT_LABELS[editing]} 구간을 편집 중입니다. 레이아웃 탭에서 값을 바꾸면 이 구간의 @media 블록이 여기에 추가됩니다.`;

  // 프리셋은 박스 구성이 통째로 바뀌므로 이전 선택은 의미가 없어 해제한다.
  const applyPreset = (preset: Preset) => {
    setState(preset.state);
    setPresetId(preset.id);
    setSelectedIndex(null);
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setPresetId(null);
    setSelectedIndex(null);
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <header className="flex flex-wrap items-end justify-between gap-4 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            CSS Layout Playground
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            값을 바꾸면 미리보기와 HTML / CSS 코드가 바로 바뀝니다.
          </p>
        </div>
        <div className="flex rounded-lg bg-zinc-200 p-1 dark:bg-zinc-900">
          {MODES.map(({ mode, label, sub }) => (
            <button
              key={mode}
              type="button"
              aria-pressed={state.mode === mode}
              onClick={() => setState((s) => ({ ...s, mode }))}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                state.mode === mode
                  ? "bg-white shadow-sm dark:bg-zinc-700"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {label}
              <span className="ml-1.5 font-normal text-zinc-500 dark:text-zinc-400">
                · {sub}
              </span>
            </button>
          ))}
        </div>
      </header>

      <div className="lg:col-span-2">
        <PresetPanel
          activeId={presetId}
          modified={presetModified}
          onApply={applyPreset}
        />
      </div>

      {/* 좁은 화면에서는 이 묶음 안에서만 미리보기가 고정된다(패널을 다 내리면 같이 올라감).
          넓은 화면에서는 lg:contents 로 묶음 자체가 사라지고 두 자식이 바깥 grid 칸에 직접 놓인다. */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:contents">
        <div className="sticky top-0 z-10 -mx-4 bg-zinc-100/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:col-start-2 lg:row-start-3 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none dark:bg-black/95 lg:dark:bg-transparent">
          <PreviewCanvas
            state={state}
            selectedIndex={activeIndex}
            onSelect={selectBox}
            view={view}
            onViewChange={setView}
            width={width}
            onWidthChange={setWidth}
            onDevicePick={editBreakpoint}
          />
        </div>

        <SidePanel
          tab={panelTab}
          onTabChange={setPanelTab}
          selectedIndex={activeIndex}
          className="lg:sticky lg:top-6 lg:col-start-1 lg:row-span-2 lg:row-start-3 lg:max-h-[calc(100dvh-3rem)] lg:self-start lg:overflow-y-auto"
        >
          {panelTab === "layout" && (
            <ControlPanel
              state={state}
              setState={setState}
              editing={editing}
              onEditingChange={editBreakpoint}
              onReset={reset}
            />
          )}
          {panelTab === "box" && (
            <ItemPanel
              state={state}
              setState={setState}
              selectedIndex={activeIndex}
            />
          )}
          {panelTab === "markup" && (
            <MarkupPanel state={state} setState={setState} />
          )}
        </SidePanel>
      </div>

      <section className="flex min-w-0 flex-col gap-4 lg:col-start-2 lg:row-start-4">
        <MarkupCheck issues={issues} />
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pt-2">
          <h2 className="text-base font-semibold">결과 코드</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            미리보기와 똑같이 나오는 코드입니다. 복사해서 바로 쓸 수 있습니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <CodeOutput
            title="HTML"
            language="html"
            code={generateHtml(state, withContent)}
          />
          <CodeOutput
            title="CSS"
            language="css"
            code={css}
            highlighted={appliedMediaLines(css, width)}
            highlightLabel={`미리보기 ${width}px 에 적용 중`}
            note={mediaNote}
          />
        </div>
      </section>
    </div>
  );
}

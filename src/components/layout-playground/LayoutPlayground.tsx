// src/components/layout-playground/LayoutPlayground.tsx
// 플레이그라운드 전체를 조립하는 클라이언트 컴포넌트.
// - 레이아웃 상태(PlaygroundState), 선택한 박스(selectedIndex), 보기 방식(view),
//   미리보기 폭(width), 편집 중인 @media 구간(editing)을 여기서 보관
// - 왼쪽: PresetPanel + ControlPanel + ItemPanel / 오른쪽: PreviewCanvas + MarkupCheck + CodeOutput(HTML, CSS)
// - "use client" 경계는 이 파일 하나. 여기서 import하는 컴포넌트는 자동으로 클라이언트에 포함된다.

"use client";

import { useState } from "react";
import {
  BREAKPOINT_LABELS,
  BREAKPOINT_PREVIEW_WIDTH,
  INITIAL_STATE,
  MEDIA_BREAKPOINTS,
} from "@/lib/layout/constants";
import { appliedMediaLines, generateCss } from "@/lib/layout/generateCss";
import { generateHtml } from "@/lib/layout/generateHtml";
import type { Preset } from "@/lib/layout/presets";
import { overrideCount } from "@/lib/layout/responsive";
import type {
  Breakpoint,
  PlaygroundState,
  PreviewView,
} from "@/lib/layout/types";
import CodeOutput from "./CodeOutput";
import ControlPanel from "./ControlPanel";
import ItemPanel from "./ItemPanel";
import PresetPanel from "./PresetPanel";
import PreviewCanvas from "./PreviewCanvas";
import { checkMarkup } from "@/lib/layout/checkMarkup";
import MarkupCheck from "./MarkupCheck";

export default function LayoutPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [view, setView] = useState<PreviewView>("number");
  // 미리보기 폭은 원래 PreviewCanvas 안에만 있었는데,
  // 편집 구간 탭이 폭을 바꾸고 CSS 출력이 적용 중인 @media 를 강조해야 해서 여기로 올렸다.
  const [width, setWidth] = useState(BREAKPOINT_PREVIEW_WIDTH.md);
  const [editing, setEditing] = useState<Breakpoint>("base");

  // 박스 개수를 줄여서 선택한 박스가 사라졌으면 "선택 없음"으로 취급
  const activeIndex =
    selectedIndex !== null && selectedIndex < state.boxCount
      ? selectedIndex
      : null;

  const withContent = view === "content";
  const issues = checkMarkup(state);
  const css = generateCss(state, withContent);

  // 구간 탭이나 기기 버튼을 고르면 미리보기도 그 구간 폭으로 맞춰서, 바꾸는 값이 바로 보이게 한다.
  const editBreakpoint = (bp: Breakpoint) => {
    setEditing(bp);
    setWidth(BREAKPOINT_PREVIEW_WIDTH[bp]);
  };

  // @media 가 하나도 없을 때, 어떻게 만드는지 CSS 출력 아래에 안내한다.
  const hasMedia = MEDIA_BREAKPOINTS.some((bp) => overrideCount(state, bp) > 0);
  const mediaNote = hasMedia
    ? undefined
    : editing === "base"
      ? "아직 @media 가 없습니다. 미리보기의 태블릿 / 데스크톱 버튼(또는 왼쪽 '편집할 화면 구간')을 누른 뒤 값을 바꾸면 그 구간의 @media 블록이 여기에 추가됩니다."
      : `${BREAKPOINT_LABELS[editing]} 구간을 편집 중입니다. 왼쪽에서 값을 바꾸면 이 구간의 @media 블록이 여기에 추가됩니다.`;

  // 프리셋은 박스 구성이 통째로 바뀌므로 이전 선택은 의미가 없어 해제한다.
  const applyPreset = (preset: Preset) => {
    setState(preset.state);
    setSelectedIndex(null);
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="flex flex-col gap-6">
        <PresetPanel onApply={applyPreset} />
        <ControlPanel
          state={state}
          setState={setState}
          editing={editing}
          onEditingChange={editBreakpoint}
        />
        <ItemPanel
          state={state}
          setState={setState}
          selectedIndex={activeIndex}
        />
      </div>

      <section className="flex min-w-0 flex-col gap-6">
        <PreviewCanvas
          state={state}
          selectedIndex={activeIndex}
          onSelect={setSelectedIndex}
          view={view}
          onViewChange={setView}
          width={width}
          onWidthChange={setWidth}
          onDevicePick={editBreakpoint}
        />
        <MarkupCheck issues={issues} />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <CodeOutput title="HTML" code={generateHtml(state, withContent)} />
          <CodeOutput
            title="CSS"
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

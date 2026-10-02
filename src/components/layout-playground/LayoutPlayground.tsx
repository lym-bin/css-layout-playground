// src/components/layout-playground/LayoutPlayground.tsx
// 플레이그라운드 전체를 조립하는 클라이언트 컴포넌트.
// - 레이아웃 상태(PlaygroundState), 선택한 박스(selectedIndex), 보기 방식(view)을 여기서 보관
// - 왼쪽: PresetPanel + ControlPanel + ItemPanel / 오른쪽: PreviewCanvas + CodeOutput(HTML, CSS)
// - "use client" 경계는 이 파일 하나. 여기서 import하는 컴포넌트는 자동으로 클라이언트에 포함된다.

"use client";

import { useState } from "react";
import { INITIAL_STATE } from "@/lib/layout/constants";
import { generateCss } from "@/lib/layout/generateCss";
import { generateHtml } from "@/lib/layout/generateHtml";
import type { Preset } from "@/lib/layout/presets";
import type { PlaygroundState, PreviewView } from "@/lib/layout/types";
import CodeOutput from "./CodeOutput";
import ControlPanel from "./ControlPanel";
import ItemPanel from "./ItemPanel";
import PresetPanel from "./PresetPanel";
import PreviewCanvas from "./PreviewCanvas";

export default function LayoutPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [view, setView] = useState<PreviewView>("number");

  // 박스 개수를 줄여서 선택한 박스가 사라졌으면 "선택 없음"으로 취급
  const activeIndex =
    selectedIndex !== null && selectedIndex < state.boxCount
      ? selectedIndex
      : null;

  const withContent = view === "content";

  // 프리셋은 박스 구성이 통째로 바뀌므로 이전 선택은 의미가 없어 해제한다.
  const applyPreset = (preset: Preset) => {
    setState(preset.state);
    setSelectedIndex(null);
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-6">
        <PresetPanel onApply={applyPreset} />
        <ControlPanel state={state} setState={setState} />
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
        />
        <div className="grid gap-6 xl:grid-cols-2">
          <CodeOutput title="HTML" code={generateHtml(state, withContent)} />
          <CodeOutput title="CSS" code={generateCss(state, withContent)} />
        </div>
      </section>
    </div>
  );
}

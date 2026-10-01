// src/components/layout-playground/LayoutPlayground.tsx
// 플레이그라운드 전체를 조립하는 클라이언트 컴포넌트.
// - 레이아웃 상태(PlaygroundState)와 선택한 박스(seletedIndex)를 여기서만 보관
// - 왼쪽: ControlPanel + ItemPanel / 오른쪽: PreviewCanvas + CodeOutput(HTML, CSS)
// - "use client" 경계는 이 파일 하나. 여기서 import하는 컴포넌트는 자동으로 클라이언트에 포함된다.

"use client";

import { useState } from "react";
import { INITIAL_STATE } from "@/lib/layout/constants";
import { generateCss } from "@/lib/layout/generateCss";
import { generateHtml } from "@/lib/layout/generateHtml";
import type { PlaygroundState } from "@/lib/layout/types";
import ControlPanel from "./ControlPanel";
import PreviewCanvas from "./PreviewCanvas";
import ItemPanel from "./ItemPanel";
import CodeOutput from "./CodeOutput";

export default function LayoutPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);
  const [selectedIndex, setSeletedIndex] = useState<number | null>(null);

  // 박스 개수를 줄여서 선택한 박스가 사라졌으면 "선택 없음"으로 취급
  const activeIndex =
    selectedIndex !== null && selectedIndex < state.boxCount
      ? selectedIndex
      : null;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-6">
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
          onSelect={setSeletedIndex}
        />
        <div className="grid gap-6 xl:grid-cols-2">
          <CodeOutput title="HTML" code={generateHtml(state)} />
          <CodeOutput title="CSS" code={generateCss(state)} />
        </div>
      </section>
    </div>
  );
}

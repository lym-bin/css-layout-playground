// src/components/layout-playground/LayoutPlayground.tsx
// 플레이그라운드 전체를 조립하는 클라이언트 컴포넌트.
// - 상태(PlaygroundState)를 여기 한 곳에서만 보관
// - 왼쪽: ControlPanel / 오른쪽: 미리보기 + CSS 출력
// - 미리보기와 CSS 출력은 이후 PreviewCanvas / CodeOutput 으로 교체 예정

"use client";

import { useState } from "react";
import { INITIAL_STATE } from "@/lib/layout/constants";
import { generateCss, toContainerStyle } from "@/lib/layout/generateCss";
import type { PlaygroundState } from "@/lib/layout/types";
import ControlPanel from "./ControlPanel";

export default function LayoutPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <ControlPanel state={state} setState={setState} />

      <section className="flex min-w-0 flex-col gap-6">
        {/* TODO: PreviewCanvas 로 교체 */}
        <div
          className="min-h-80 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
          style={toContainerStyle(state)}
        >
          {Array.from({ length: state.boxCount }, (_, i) => (
            <div
              key={i}
              className="rounded-lg bg-sky-400 p-4 font-bold text-white"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* TODO: CodeOutput 으로 교체 */}
        <pre className="overflow-x-auto rounded-xl bg-zinc-900 p-5 font-mono text-sm leading-6 text-zinc-100">
          {generateCss(state)}
        </pre>
      </section>
    </div>
  );
}

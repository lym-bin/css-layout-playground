// src/components/layout-playground/LayoutPlayground.tsx
// 플레이그라운드 전체를 조립하는 클라이언트 컴포넌트.
// - 상태(PlaygroundState)를 여기 한 곳에서만 보관
// - 지금은 임시 뼈대: 컨트롤 몇 개 + 미리보기 + CSS 출력을 직접 그림
// - 이후 ControlPanel / PreviewCanvas / CodeOutput 으로 하나씩 교체 예정

"use client";

import { useState } from "react";
import { FLEX_DIRECTIONS, INITIAL_STATE, LIMITS } from "@/lib/layout/constants";
import { generateCss, toContainerStyle } from "@/lib/layout/generateCss";
import type { PlaygroundState } from "@/lib/layout/types";
import RangeControl from "./controls/RangeControl";
import SelectControl from "./controls/SelectControl";

export default function LayoutPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-6 lg:grid-cols-[320px_1fr]">
      {/* TODO: ControlPanel 로 교체 */}
      <aside className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <button
          type="button"
          onClick={() =>
            setState((s) => ({
              ...s,
              mode: s.mode === "flex" ? "grid" : "flex",
            }))
          }
          className="rounded-md border border-zinc-300 py-1.5 text-sm dark:border-zinc-700"
        >
          모드: {state.mode} (클릭해서 전환)
        </button>

        <RangeControl
          label="Box count"
          value={state.boxCount}
          min={LIMITS.boxCount.min}
          max={LIMITS.boxCount.max}
          onChange={(boxCount) => setState((s) => ({ ...s, boxCount }))}
        />

        <SelectControl
          label="flex-direction"
          value={state.flex.direction}
          options={FLEX_DIRECTIONS}
          onChange={(direction) =>
            setState((s) => ({ ...s, flex: { ...s.flex, direction } }))
          }
        />
      </aside>

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

// src/components/layout-playground/LayoutPlayground.tsx
// 플레이그라운드 전체를 조립하는 클라이언트 컴포넌트.
// - 상태(PlaygroundState)를 여기 한 곳에서만 보관
// - 왼쪽: ControlPanel / 오른쪽: 미리보기 + CSS 출력
// - CSS 출력은 이후 CodeOutput 으로 교체 예정

"use client";

import { useState } from "react";
import { INITIAL_STATE } from "@/lib/layout/constants";
import { generateCss } from "@/lib/layout/generateCss";
import type { PlaygroundState } from "@/lib/layout/types";
import ControlPanel from "./ControlPanel";
import PreviewCanvas from "./PreviewCanvas";

export default function LayoutPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <ControlPanel state={state} setState={setState} />

      <section className="flex min-w-0 flex-col gap-6">
        <PreviewCanvas state={state} />

        {/* TODO: CodeOutput으로 교체*/}
        <pre className="overflow-x-auto rounded-xl bg-zinc-900 p-5 font-mono text-sm leading-6 text-zinc-100">
          {generateCss(state)}
        </pre>
      </section>
    </div>
  );
}

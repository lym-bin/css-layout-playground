// src/components/layout-playground/LayoutPlayground.tsx
// 플레이그라운드 전체를 조립하는 클라이언트 컴포넌트.
// - 상태(PlaygroundState)를 여기 한 곳에서만 보관
// - 왼쪽: ControlPanel / 오른쪽: PreviewCanvas + CodeOutput(HTML, CSS)
// - "use client" 경계는 이 파일 하나. 여기서 import하는 컴포넌트는 자동으로 클라이언트에 포함된다.

"use client";

import { useState } from "react";
import { INITIAL_STATE } from "@/lib/layout/constants";
import { generateCss } from "@/lib/layout/generateCss";
import { generateHtml } from "@/lib/layout/generateHtml";
import type { PlaygroundState } from "@/lib/layout/types";
import ControlPanel from "./ControlPanel";
import PreviewCanvas from "./PreviewCanvas";
import CodeOutput from "./CodeOutput";

export default function LayoutPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <ControlPanel state={state} setState={setState} />

      <section className="flex min-w-0 flex-col gap-6">
        <PreviewCanvas state={state} />
        <div className="grid gap-6 xl:grid-cols-2">
          <CodeOutput title="HTML" code={generateHtml(state)} />
          <CodeOutput title="CSS" code={generateCss(state)} />
        </div>
      </section>
    </div>
  );
}

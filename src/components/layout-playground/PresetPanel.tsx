// src/components/layout-playground/PresetPanel.tsx
// 맨 위 프리셋 칩 한 줄 + 지금 불러온 프리셋 설명.
// - 칩을 누르면 onApply(preset) 로 부모에게 알리기만 한다. 실제로 상태를 바꾸는 건 부모의 몫.
// - 불러온 뒤 값을 바꿨는지(modified)는 부모가 계산해서 넘겨준다.
// - 좁은 화면에서는 칩을 가로로 스크롤하고, 넓은 화면에서는 줄바꿈한다.

import { PRESETS } from "@/lib/layout/presets";
import type { Preset } from "@/lib/layout/presets";

interface PresetPanelProps {
  activeId: string | null;
  modified: boolean;
  onApply: (preset: Preset) => void;
}

export default function PresetPanel({
  activeId,
  modified,
  onApply,
}: PresetPanelProps) {
  const active = PRESETS.find((preset) => preset.id === activeId);

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold">
          자주 쓰는 레이아웃으로 시작하기
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          누르면 값이 한 번에 바뀌고, 이어서 직접 고쳐볼 수 있습니다.
        </p>
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:flex-wrap sm:overflow-visible">
        {PRESETS.map((preset) => {
          const selected = preset.id === activeId;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onApply(preset)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                selected
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              }`}
            >
              {preset.name}
              {preset.id === "overflow-bug" && (
                <span className="rounded bg-rose-100 px-1 text-[11px] text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  버그
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {active ? (
          <>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {active.name}
            </span>
            {" · "}
            {active.description}
            {modified && " · 불러온 뒤 값을 바꿨습니다."}
          </>
        ) : (
          "아직 불러온 레이아웃이 없습니다. 기본 상태에서 시작합니다."
        )}
      </p>
    </section>
  );
}

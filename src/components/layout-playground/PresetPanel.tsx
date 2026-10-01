// src/components/layout-playground/PresetPanel.tsx
// 왼쪽 맨 위 프리셋 버튼 목록.
// - 버튼을 누르면 onApply(preset) 로 부모에게 알리기만 한다
// - 실제로 상태를 바꾸는 건 부모(LayoutPlayground)의 몫.

import { PRESETS } from "@/lib/layout/presets";
import type { Preset } from "@/lib/layout/presets";

interface PresetPanelProps {
  onApply: (preset: Preset) => void;
}

export default function PresetPanel({ onApply }: PresetPanelProps) {
  return (
    <aside className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-sm font-semibold">실무적 패턴 프리셋</h2>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApply(preset)}
            className="flex flex-col gap-0.5 rounded-md border border-zinc-300 px-2.5 py-2 text-left hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <span className="text-xs font-medium">{preset.name}</span>
            <span className="text-[11px] leading-4 text-zinc-500">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

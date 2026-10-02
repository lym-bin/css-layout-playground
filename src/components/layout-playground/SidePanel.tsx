// src/components/layout-playground/SidePanel.tsx
// 왼쪽 조작 패널의 탭 틀. (레이아웃 / 박스 / 마크업)
// - 한 번에 한 탭 내용만 보여줘서 패널이 길어지지 않게 한다.
// - 탭 내용은 부모가 children 으로 넘긴다. 이 컴포넌트는 탭 버튼과 틀만 그린다.
// - 박스를 선택하면 "박스" 탭 옆에 몇 번 박스인지 표시한다.

import type { ReactNode } from "react";

export type PanelTab = "layout" | "box" | "markup";

const TABS: readonly { id: PanelTab; label: string }[] = [
  { id: "layout", label: "레이아웃" },
  { id: "box", label: "박스" },
  { id: "markup", label: "마크업" },
];

interface SidePanelProps {
  tab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  selectedIndex: number | null;
  className?: string;
  children: ReactNode;
}

export default function SidePanel({
  tab,
  onTabChange,
  selectedIndex,
  className = "",
  children,
}: SidePanelProps) {
  return (
    <aside
      className={`flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
    >
      <div
        role="tablist"
        aria-label="조작 패널"
        className="flex border-b border-zinc-200 px-2 dark:border-zinc-800"
      >
        {TABS.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`panel-tab-${id}`}
              aria-selected={active}
              aria-controls="panel-body"
              onClick={() => onTabChange(id)}
              className={`-mb-px flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-3 text-sm font-medium transition-colors ${
                active
                  ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {label}
              {id === "box" && selectedIndex !== null && (
                <span className="rounded-full bg-sky-600 px-1.5 py-0.5 text-[11px] leading-none text-white">
                  {selectedIndex + 1}번
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id="panel-body"
        aria-labelledby={`panel-tab-${tab}`}
        className="p-5"
      >
        {children}
      </div>
    </aside>
  );
}

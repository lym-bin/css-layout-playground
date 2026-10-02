// src/components/layout-playground/controls/ControlLabel.tsx
// 컨트롤 위의 이름 줄과 아래의 설명 줄. (Range / Select / Text 컨트롤이 같이 씀)
// - 이름은 한국어로 크게, 실제 CSS 속성 이름(code)은 옆에 작은 태그로
// - 설명(hint)은 지금 고른 값이 무슨 뜻인지 한 줄

import type { ReactNode } from "react";

export function ControlLabel({
  label,
  code,
  children,
}: {
  label: string;
  code?: string;
  children?: ReactNode;
}) {
  return (
    <span className="flex items-baseline justify-between gap-2">
      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
          {label}
        </span>
        {code && (
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {code}
          </code>
        )}
      </span>
      {children}
    </span>
  );
}

export function ControlHint({ hint }: { hint?: string }) {
  if (!hint) return null;
  return (
    <span className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
      {hint}
    </span>
  );
}

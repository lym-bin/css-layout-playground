// src/components/layout-playground/controls/ControlLabel.tsx
// 컨트롤 위의 이름 줄과 아래의 설명 줄. (Range / Select / Choice / Text 컨트롤이 같이 씀)
// - 이름은 한국어로 굵게, 실제 CSS 속성 이름(code)은 옆에 작은 태그로
// - axis 가 있으면 "→ 가로" 같은 축 배지를 미리보기 화살표와 같은 색으로 붙인다.
// - 설명(hint)은 지금 고른 값이 무슨 뜻인지 한 줄. 연한 배경 상자에 넣어서
//   바로 아래 다음 컨트롤의 이름과 섞여 보이지 않게 한다.

import type { ReactNode } from "react";
import type { Axis } from "@/lib/layout/descriptions";
import { AXIS_BADGE, type AxisTone } from "../axisTone";

export interface AxisBadge {
  axis: Axis;
  tone: AxisTone;
}

export function ControlLabel({
  label,
  code,
  axis,
  children,
}: {
  label: string;
  code?: string;
  axis?: AxisBadge;
  children?: ReactNode;
}) {
  return (
    <span className="flex items-baseline justify-between gap-2">
      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {label}
        </span>
        {axis && (
          <span
            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${AXIS_BADGE[axis.tone]}`}
          >
            {axis.axis.arrow} {axis.axis.name}
          </span>
        )}
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
    <span className="rounded-md bg-zinc-50 px-2.5 py-1.5 text-xs leading-5 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
      {hint}
    </span>
  );
}

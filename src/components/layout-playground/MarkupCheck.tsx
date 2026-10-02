// src/components/layout-playground/MarkupCheck.tsx
// 마크업 진단 결과 표시.
// - 문제가 없으면 "문제 없음" 한 줄, 있으면 오류(빨강) / 참고(노랑) 목록
// - role="status" 라서 결과가 바뀌면 스크린리더가 알려준다.

import type { MarkupIssue } from "@/lib/layout/checkMarkup";

const LEVEL_STYLE: Record<
  MarkupIssue["level"],
  { label: string; className: string }
> = {
  error: {
    label: "오류",
    className:
      "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200",
  },
  hint: {
    label: "참고",
    className:
      "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
};

interface MarkupCheckProps {
  issues: MarkupIssue[];
}

export default function MarkupCheck({ issues }: MarkupCheckProps) {
  return (
    <div role="status" className="flex flex-col gap-2">
      {issues.length === 0 ? (
        <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          마크업 진단: 문제 없음
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {issues.map((issue) => {
            const style = LEVEL_STYLE[issue.level];
            return (
              <li
                key={issue.id}
                className={`rounded-lg border px-4 py-2 text-sm ${style.className}`}
              >
                <span className="mr-2 font-semibold">{style.label}</span>
                {issue.message}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

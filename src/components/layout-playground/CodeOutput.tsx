// src/components/layout-playground/CodeOutput.tsx
// 코드 출력 영역 (HTML / CSS에 각각 하나씩 사용)
// - 상단 바: 제목 + 복사 버튼
// - 코드는 줄마다 색칠(highlight.ts)하고, 왼쪽에 줄 번호를 붙인다.
//   줄 번호는 select-none 이라 드래그해서 복사해도 코드에 섞이지 않는다.
// - 복사 버튼: 클립보드에 원래 코드 문자열을 복사하고 잠깐 "복사됨" / "복사 실패" 표시 후 원래대로
// - highlighted 로 받은 줄 번호는 배경색으로 강조 (CSS 에서 지금 적용 중인 @media 블록 표시용)
// - note 가 있으면 코드 아래에 안내 한 줄 (예: @media 가 아직 없을 때 만드는 방법)

import { useRef, useState } from "react";
import {
  highlightCssLine,
  highlightHtmlLine,
  type TokenType,
} from "@/lib/layout/highlight";

type CopyStatus = "idle" | "copied" | "failed";

const STATUS_LABEL: Record<CopyStatus, string> = {
  idle: "복사",
  copied: "복사됨",
  failed: "복사 실패",
};

// 어두운 배경에서 서로 구분되는 밝은 색. 구두점(괄호, 콜론)은 한 단계 어둡게 눌러서 내용이 먼저 보이게 한다.
const TOKEN_COLOR: Record<TokenType, string> = {
  plain: "text-zinc-100",
  punct: "text-zinc-500",
  selector: "text-emerald-300",
  atrule: "text-fuchsia-300",
  property: "text-sky-300",
  value: "text-amber-200",
  tag: "text-pink-300",
  attr: "text-sky-300",
  string: "text-amber-200",
};

const HIGHLIGHTERS = {
  html: highlightHtmlLine,
  css: highlightCssLine,
};

interface CodeOutputProps {
  title: string;
  language: keyof typeof HIGHLIGHTERS;
  code: string;
  highlighted?: ReadonlySet<number>;
  highlightLabel?: string;
  note?: string;
}

export default function CodeOutput({
  title,
  language,
  code,
  highlighted,
  highlightLabel,
  note,
}: CodeOutputProps) {
  const hasHighlight = highlighted !== undefined && highlighted.size > 0;
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlight = HIGHLIGHTERS[language];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    // 연속 클릭 시 이전 타이머가 새 표시를 일찍 지우지 않도록 먼저 취소
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), 1500);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
          <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-100">
            {title}
          </span>
          {hasHighlight && highlightLabel && (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-sky-500/40" aria-hidden />
              {highlightLabel}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md bg-zinc-700 px-3 py-1 text-xs font-medium hover:bg-zinc-600"
        >
          {STATUS_LABEL[status]}
        </button>
      </div>
      <pre className="overflow-x-auto py-4 pr-5 font-mono text-[13px] leading-6">
        <code className="block w-fit min-w-full">
          {code.split("\n").map((line, i) => (
            <span
              key={i}
              className={`flex ${highlighted?.has(i) ? "bg-sky-500/15" : ""}`}
            >
              <span
                aria-hidden
                className="w-10 shrink-0 select-none pr-4 text-right text-zinc-600"
              >
                {i + 1}
              </span>
              {/* 빈 줄은 높이가 0이 되지 않게 공백 하나를 넣는다. */}
              <span className="whitespace-pre">
                {line === ""
                  ? " "
                  : highlight(line).map((token, j) => (
                      <span key={j} className={TOKEN_COLOR[token.type]}>
                        {token.text}
                      </span>
                    ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
      {note && (
        <p className="border-t border-zinc-800 bg-zinc-900 px-4 py-3 text-xs leading-5 text-zinc-400">
          {note}
        </p>
      )}
    </div>
  );
}

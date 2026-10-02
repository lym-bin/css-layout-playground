// src/components/layout-playground/CodeOutput.tsx
// 코드 출력 영역 (HTML / CSS에 각각 하나씩 사용)
// - 상단 바: 제목 + 복사 버튼
// - 넘겨 받은 코드 문자열을 그대로 보여줌 (어떤 코드인지는 모름 -> 재사용 가능)
// - 복사 버튼: 클립보드에 복사하고 잠깐 "복사됨" / "복사 실패" 표시 후 원래대로
// - highlighted 로 받은 줄 번호는 배경색으로 강조 (CSS 에서 지금 적용 중인 @media 블록 표시용)
// - note 가 있으면 코드 아래에 안내 한 줄 (예: @media 가 아직 없을 때 만드는 방법)

import { useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

const STATUS_LABEL: Record<CopyStatus, string> = {
  idle: "복사",
  copied: "복사됨",
  failed: "복사 실패",
};

interface CodeOutputProps {
  title: string;
  code: string;
  highlighted?: ReadonlySet<number>;
  highlightLabel?: string;
  note?: string;
}

export default function CodeOutput({
  title,
  code,
  highlighted,
  highlightLabel,
  note,
}: CodeOutputProps) {
  const hasHighlight = highlighted !== undefined && highlighted.size > 0;
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div className="rounded-xl bg-zinc-900 text-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-2">
        <span className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="font-mono">{title}</span>
          {hasHighlight && highlightLabel && (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-sky-500/30" aria-hidden />
              {highlightLabel}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md bg-zinc-700 px-3 py-1 text-xs hover:bg-zinc-600"
        >
          {STATUS_LABEL[status]}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-sm leading-6">
        {/* 줄마다 span 으로 나눠야 줄 단위 배경을 칠할 수 있다. 빈 줄은 높이가 0이 되지 않게 공백 하나를 넣는다. */}
        <code className="block w-fit min-w-full">
          {code.split("\n").map((line, i) => (
            <span
              key={i}
              className={`-mx-2 block px-2 ${
                highlighted?.has(i) ? "rounded-sm bg-sky-500/20" : ""
              }`}
            >
              {line === "" ? " " : line}
            </span>
          ))}
        </code>
      </pre>
      {note && (
        <p className="border-t border-zinc-800 px-5 py-3 text-xs leading-5 text-zinc-400">
          {note}
        </p>
      )}
    </div>
  );
}

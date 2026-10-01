// src/components/layout-playground/CodeOutput.tsx
// 코드 출력 영역 (HTML / CSS에 각각 하나씩 사용)
// - 상단 바: 제목 + 복사 버튼
// - 넘겨 받은 코드 문자열을 그대로 보여줌 (어떤 코드인지는 모름 -> 재사용 가능)
// - 복사 버튼: 클립보드에 복사하고 잠깐 "Copied!" / "Failed" 표시 후 원래대로

import { useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

const STATUS_LABEL: Record<CopyStatus, string> = {
  idle: "Copy",
  copied: "Copied!",
  failed: "Failed",
};

interface CodeOutputProps {
  title: string;
  code: string;
}

export default function CodeOutput({ title, code }: CodeOutputProps) {
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
        <span className="font-mono text-xs text-zinc-400">{title}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md bg-zinc-700 px-3 py-1 text-xs hover:bg-zinc-600"
        >
          {STATUS_LABEL[status]}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// src/components/layout-playground/PreviewCanvas.tsx
// 오른쪽 위 미리보기 영역.
// - 상태를 style 객체로 바꿔 컨테이너(toContainerStyle)와 각 박스(toItemStyle)에 적용
// - 박스마다 색/높이를 다르게 줘서 정렬·순서 변화가 눈에 보이게 함
// - 박스를 클릭하면 선택(다시 클릭하면 해제) → ItemPanel 에서 개별 속성 조절
// - 바깥 테두리를 좌우로 드래그해 너비를 줄여볼 수 있음 (wrap 확인용)

import { toContainerStyle, toItemStyle } from "@/lib/layout/generateCss";
import type { PlaygroundState } from "@/lib/layout/types";

// Tailwind는 소스 코드에 "완성된 문자열"로 적힌 클래스만 CSS로 만든다.
// `bg-${color}-400` 처럼 조합하면 빌드 결과에 포함되지 않으므로 전부 풀어서 적는다.
const BOX_COLORS = [
  "bg-rose-400",
  "bg-amber-400",
  "bg-lime-500",
  "bg-sky-400",
  "bg-violet-400",
  "bg-pink-400",
  "bg-teal-400",
  "bg-orange-400",
];

// 높이가 들쭉날쭉해야 align-items 차이가 보인다.
const BOX_MIN_HEIGHTS = [56, 88, 64, 104, 72, 96, 60, 80];

interface PreviewCanvasProps {
  state: PlaygroundState;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
}

export default function PreviewCanvas({
  state,
  selectedIndex,
  onSelect,
}: PreviewCanvasProps) {
  return (
    <div className="resize-x overflow-auto rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="min-h-80" style={toContainerStyle(state)}>
        {Array.from({ length: state.boxCount }, (_, i) => {
          const selected = i === selectedIndex;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={selected}
              aria-label={`박스 ${i + 1} 선택`}
              onClick={() => onSelect(selected ? null : i)}
              className={`${BOX_COLORS[i % BOX_COLORS.length]} flex min-w-16 cursor-pointer items-center justify-center rounded-lg px-4 font-mono text-lg font-bold text-white shadow ${
                selected
                  ? "ring-4 ring-zinc-900 ring-offset-2 dark:ring-white dark:ring-offset-zinc-900"
                  : ""
              }`}
              style={{
                minHeight: BOX_MIN_HEIGHTS[i % BOX_MIN_HEIGHTS.length],
                ...toItemStyle(state, i),
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

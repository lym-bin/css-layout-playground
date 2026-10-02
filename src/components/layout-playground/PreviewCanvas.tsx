// src/components/layout-playground/PreviewCanvas.tsx
// 오른쪽 위 미리보기 영역.
// - 위: 보기 전환(숫자 / 콘텐츠) + 미리보기 너비 툴바 (기기 너비 버튼 + 슬라이더)
// - 아래: 정해진 너비의 프레임 안에 레이아웃 컨테이너와 박스를 그림
// - 상태를 style 객체로 바꿔 컨테이너(toContainerStyle)와 각 박스(toItemStyle)에 적용
// - 박스를 클릭하면 선택(다시 클릭하면 해제) → ItemPanel 에서 개별 속성 조절
// - 보기 방식(숫자/콘텐츠)은 출력 코드에도 영향을 주므로 부모에게서 받는다.

import { useState } from "react";
import { DEFAULT_ITEM_TAG, LIMITS } from "@/lib/layout/constants";
import { toContainerStyle, toItemStyle } from "@/lib/layout/generateCss";
import type {
  BoxContent,
  ItemTag,
  PlaygroundState,
  PreviewView,
} from "@/lib/layout/types";

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

// 숫자 모드에서는 높이가 들쭉날쭉해야 align-items 차이가 보인다.
const BOX_MIN_HEIGHTS = [56, 88, 64, 104, 72, 96, 60, 80];

// null = 고정 너비 없이 영역을 가득 채움
const VIEWPORT_PRESETS = [
  { label: "모바일", width: 375 },
  { label: "태블릿", width: 768 },
  { label: "가득", width: null },
] as const;

const VIEW_OPTIONS = [
  { value: "number", label: "숫자" },
  { value: "content", label: "콘텐츠" },
] as const;

const TOOLBAR_BUTTON =
  "rounded-md border px-2.5 py-1 text-xs transition-colors";
const TOOLBAR_ON =
  "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900";
const TOOLBAR_OFF =
  "border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900";

interface PreviewCanvasProps {
  state: PlaygroundState;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  view: PreviewView;
  onViewChange: (view: PreviewView) => void;
}

export default function PreviewCanvas({
  state,
  selectedIndex,
  onSelect,
  view,
  onViewChange,
}: PreviewCanvasProps) {
  const [width, setWidth] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={view === option.value}
            onClick={() => onViewChange(option.value)}
            className={`${TOOLBAR_BUTTON} ${view === option.value ? TOOLBAR_ON : TOOLBAR_OFF}`}
          >
            {option.label}
          </button>
        ))}

        <span
          className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-700"
          aria-hidden
        />

        {VIEWPORT_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            aria-pressed={width === preset.width}
            onClick={() => setWidth(preset.width)}
            className={`${TOOLBAR_BUTTON} ${width === preset.width ? TOOLBAR_ON : TOOLBAR_OFF}`}
          >
            {preset.label}
            {preset.width !== null && ` ${preset.width}`}
          </button>
        ))}
        <input
          type="range"
          aria-label="미리보기 너비"
          min={LIMITS.viewport.min}
          max={LIMITS.viewport.max}
          value={width ?? LIMITS.viewport.max}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="min-w-32 flex-1 accent-zinc-800 dark:accent-zinc-200"
        />
        <span className="w-14 text-right font-mono text-xs text-zinc-500">
          {width === null ? "가득" : `${width}px`}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div
          className={`mx-auto transition-[width] duration-200 ${
            width === null ? "" : "ring-1 ring-zinc-300 dark:ring-zinc-700"
          }`}
          style={{ width: width ?? "100%" }}
        >
          <div className="min-h-80" style={toContainerStyle(state)}>
            {Array.from({ length: state.boxCount }, (_, i) => {
              const selected = i === selectedIndex;
              const color = BOX_COLORS[i % BOX_COLORS.length];
              const tag = state.contents[i].tag ?? DEFAULT_ITEM_TAG;
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`박스 ${i + 1} 선택`}
                  onClick={() => onSelect(selected ? null : i)}
                  className={`flex cursor-pointer rounded-lg shadow ${
                    view === "number"
                      ? `${color} min-w-16 items-center justify-center px-4 font-mono text-lg font-bold text-white`
                      : "flex-col bg-white text-left text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                  } ${
                    selected
                      ? "ring-4 ring-zinc-900 ring-offset-2 dark:ring-white dark:ring-offset-zinc-900"
                      : ""
                  }`}
                  style={{
                    minHeight:
                      view === "number"
                        ? BOX_MIN_HEIGHTS[i % BOX_MIN_HEIGHTS.length]
                        : undefined,
                    ...toItemStyle(state, i),
                  }}
                >
                  {view === "number" ? (
                    <span className="flex flex-col items-center leading-tight">
                      {i + 1}
                      {tag !== "div" && (
                        <span className="font-mono text-[10px] font-normal opacity-80">
                          &lt;{tag}&gt;
                        </span>
                      )}
                    </span>
                  ) : (
                    <ContentBody
                      content={state.contents[i]}
                      color={color}
                      tag={tag}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// <button> 안에는 <div>/<p> 같은 블록 요소를 넣을 수 없어서 전부 <span> 에 block 클래스로 그린다.
function ContentBody({
  content,
  color,
  tag,
}: {
  content: BoxContent;
  color: string;
  tag: ItemTag;
}) {
  return (
    <>
      <span className={`block h-1.5 w-full rounded-t-lg ${color}`} />
      {content.image && (
        <span className="block aspect-video w-full bg-zinc-200 dark:bg-zinc-700" />
      )}
      <span className="flex flex-col gap-1 p-3">
        {tag !== "div" && (
          <span className="font-mono text-[10px] text-zinc-400">
            &lt;{tag}&gt;
          </span>
        )}
        <span className="text-sm font-semibold">{content.title}</span>
        {content.body && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {content.body}
          </span>
        )}
      </span>
    </>
  );
}

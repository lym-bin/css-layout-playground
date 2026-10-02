// src/components/layout-playground/PreviewCanvas.tsx
// 오른쪽 위 미리보기 영역. (흰 카드 하나로 감싸서 패널 / 코드 영역과 경계를 나눈다)
// - 위: 보기 전환(숫자 / 콘텐츠) + 미리보기 너비 툴바 (기기 너비 버튼 + 슬라이더)
// - 아래: 정해진 너비의 프레임 안에 레이아웃 컨테이너와 박스를 그림
// - 상태를 style 객체로 바꿔 컨테이너(toContainerStyle)와 각 박스(toItemStyle)에 적용
// - 컨테이너는 미리보기 폭이 속한 구간(@media)의 덮어쓰기까지 반영한 상태(resolveState)로 그린다.
//   진짜 @media 는 브라우저 창 폭에 반응해서, 미리보기 폭에 맞춘 결과를 JS 로 계산한다.
// - 박스를 클릭하면 선택(다시 클릭하면 해제) → "박스" 탭(ItemPanel)에서 개별 속성 조절
// - 보기 방식(숫자/콘텐츠)과 미리보기 폭은 출력 코드 / 편집 구간에도 쓰이므로 부모에게서 받는다.
// - 기기 버튼(모바일 / 태블릿 / 데스크톱)은 @media 구간과 1:1 이라, 누르면 편집 구간도 같이 바뀐다.
//   슬라이더는 폭만 바꾸고 편집 구간은 그대로 둔다.

import {
  BREAKPOINT_LABELS,
  BREAKPOINT_PREVIEW_WIDTH,
  BREAKPOINTS,
  DEFAULT_ITEM_TAG,
  LIMITS,
} from "@/lib/layout/constants";
import { toContainerStyle, toItemStyle } from "@/lib/layout/generateCss";
import { breakpointAt, resolveState } from "@/lib/layout/responsive";
import type {
  BoxContent,
  Breakpoint,
  ItemTag,
  PlaygroundState,
  PreviewView,
} from "@/lib/layout/types";

// Tailwind는 소스 코드에 "완성된 문자열"로 적힌 클래스만 CSS로 만든다.
// `bg-${color}-400` 처럼 조합하면 빌드 결과에 포함되지 않으므로 전부 풀어서 적는다.
// 흰 숫자가 잘 읽히도록 진한 색(흰 글자와 명도 대비 4.5 : 1 이상)만 쓴다.
const BOX_COLORS = [
  "bg-rose-600",
  "bg-amber-700",
  "bg-green-700",
  "bg-sky-700",
  "bg-violet-600",
  "bg-pink-700",
  "bg-teal-700",
  "bg-orange-700",
];

// 숫자 모드에서는 높이가 들쭉날쭉해야 align-items 차이가 보인다.
const BOX_MIN_HEIGHTS = [56, 88, 64, 104, 72, 96, 60, 80];

// 기기 버튼 이름. 폭은 BREAKPOINT_PREVIEW_WIDTH (375 / 768 / 1280) 를 쓴다.
// 데스크톱(1280)이 칸보다 넓으면 프레임 안에서 가로 스크롤 된다.
const DEVICE_LABELS: Record<Breakpoint, string> = {
  base: "모바일",
  md: "태블릿",
  lg: "데스크톱",
};

const VIEW_OPTIONS = [
  { value: "number", label: "숫자 박스" },
  { value: "content", label: "실제 콘텐츠" },
] as const;

const TOOLBAR_GROUP_LABEL = "text-xs font-medium text-zinc-500 dark:text-zinc-400";

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
  width: number;
  onWidthChange: (width: number) => void;
  onDevicePick: (bp: Breakpoint) => void;
}

export default function PreviewCanvas({
  state,
  selectedIndex,
  onSelect,
  view,
  onViewChange,
  width,
  onWidthChange,
  onDevicePick,
}: PreviewCanvasProps) {
  const applied = breakpointAt(width);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4 dark:border-zinc-800 dark:bg-zinc-950">
      {/* 좁은 화면에서는 위에 고정되므로 제목을 빼서 높이를 아낀다. */}
      <h2 className="hidden text-base font-semibold sm:block">미리보기</h2>
      <div className="flex flex-wrap items-center gap-2">
        <span className={TOOLBAR_GROUP_LABEL}>보기</span>
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

        <span className={TOOLBAR_GROUP_LABEL}>화면 너비</span>
        {BREAKPOINTS.map((bp) => {
          const deviceWidth = BREAKPOINT_PREVIEW_WIDTH[bp];
          return (
            <button
              key={bp}
              type="button"
              aria-pressed={width === deviceWidth}
              onClick={() => onDevicePick(bp)}
              className={`${TOOLBAR_BUTTON} ${width === deviceWidth ? TOOLBAR_ON : TOOLBAR_OFF}`}
            >
              {DEVICE_LABELS[bp]} {deviceWidth}
            </button>
          );
        })}
        <input
          type="range"
          aria-label="미리보기 너비"
          min={LIMITS.viewport.min}
          max={LIMITS.viewport.max}
          value={width}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          className="min-w-32 flex-1 accent-zinc-800 dark:accent-zinc-200"
        />
        <span className="w-14 text-right font-mono text-xs text-zinc-500">
          {width}px
        </span>
      </div>

      <p className="text-xs text-zinc-500">
        이 폭에 적용되는 구간:{" "}
        <span
          className={
            applied === "base"
              ? "font-medium text-zinc-700 dark:text-zinc-300"
              : "font-medium text-sky-700 dark:text-sky-400"
          }
        >
          {applied === "base"
            ? "기본 (미디어쿼리 없음)"
            : `@media ${BREAKPOINT_LABELS[applied]}`}
        </span>
      </p>

      {/* 박스 클릭 기능은 눈에 안 띄어서, 미리보기 바로 위에서 알려준다. */}
      {/* 좁은 화면에서는 미리보기가 고정되므로 괄호 속 부연 설명은 숨겨서 한 줄로 줄인다. */}
      <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs text-sky-900 sm:py-2 sm:text-sm dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
        {selectedIndex === null ? (
          <>
            박스를 클릭하면 그 박스만 따로 바꿀 수 있습니다.
            <span className="hidden sm:inline">
              {" "}
              (태그, 남는 공간 차지, 차지할 칸 수 등)
            </span>
          </>
        ) : (
          <>
            박스 {selectedIndex + 1}번 선택됨 · &quot;박스&quot; 탭에서 조절하세요.
            <span className="hidden sm:inline">
              {" "}
              다시 클릭하면 선택이 풀립니다.
            </span>
          </>
        )}
      </p>

      <div className="overflow-x-auto rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div
          className="mx-auto ring-1 ring-zinc-300 transition-[width] duration-200 dark:ring-zinc-700"
          style={{ width }}
        >
          {/* 좁은 화면에서는 미리보기가 위에 고정되므로 높이를 줄여 조작 패널 자리를 남긴다. */}
          <div
            className="min-h-48 sm:min-h-80"
            style={toContainerStyle(resolveState(state, applied))}
          >
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

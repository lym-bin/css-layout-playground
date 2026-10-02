// src/components/layout-playground/MarkupPanel.tsx
// "마크업" 탭 내용. HTML 태그만 모아서 고른다.
// - 컨테이너 태그 + 박스마다 태그 (박스를 하나씩 클릭하지 않고 한 번에 정할 수 있게)
// - 태그는 CSS 레이아웃에는 영향이 없고, HTML 출력과 마크업 진단에만 반영된다.

import type { Dispatch, SetStateAction } from "react";
import {
  CONTAINER_TAGS,
  DEFAULT_ITEM_TAG,
  ITEM_TAGS,
} from "@/lib/layout/constants";
import { CONTAINER_TAG_HINTS } from "@/lib/layout/descriptions";
import type { ItemTag, PlaygroundState } from "@/lib/layout/types";
import ChoiceControl from "./controls/ChoiceControl";

interface MarkupPanelProps {
  state: PlaygroundState;
  setState: Dispatch<SetStateAction<PlaygroundState>>;
}

export default function MarkupPanel({ state, setState }: MarkupPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        태그는 배치(CSS)를 바꾸지 않습니다. HTML 출력과 마크업 진단에만
        반영됩니다.
      </p>
      <ChoiceControl
        label="컨테이너 태그"
        hint={CONTAINER_TAG_HINTS[state.containerTag]}
        value={state.containerTag}
        options={CONTAINER_TAGS}
        onChange={(containerTag) => setState((s) => ({ ...s, containerTag }))}
      />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          박스 태그
        </legend>
        {state.contents.slice(0, state.boxCount).map((content, i) => (
          <label key={i} className="flex items-center justify-between gap-3">
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              박스 {i + 1}
            </span>
            <select
              value={content.tag ?? DEFAULT_ITEM_TAG}
              onChange={(e) => {
                const tag = e.target.value as ItemTag;
                setState((s) => ({
                  ...s,
                  contents: s.contents.map((c, j) =>
                    j === i ? { ...c, tag } : c,
                  ),
                }));
              }}
              className="w-32 rounded-md border border-zinc-300 bg-white px-2 py-1 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {ITEM_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
        ))}
      </fieldset>
    </div>
  );
}

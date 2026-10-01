// src/lib/layout/generateHtml.ts
// 상태(PlaygroundState)를 받아 미리보기와 같은 구조의 HTML 코드 문자열을 만드는 순수 함수.
// - 출력되는 class 이름(container / item)은 generateCss의 선택자와 맞춰야 한다.
// - 지금은 박스 개수만 반영. 이후 아이템별 속성이 생기면 여기서 같이 출력한다.

import type { PlaygroundState } from "./types";

export function generateHtml(state: PlaygroundState): string {
  const items = Array.from(
    { length: state.boxCount },
    (_, i) => `  <div class="item">${i + 1}</div>`,
  );

  return [`<div class="container">`, ...items, "</div>"].join("\n");
}

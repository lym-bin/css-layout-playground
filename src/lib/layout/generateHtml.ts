// src/lib/layout/generateHtml.ts
// 상태(PlaygroundState)를 받아 미리보기와 같은 구조의 HTML 코드 문자열을 만드는 순수 함수.
// - 출력되는 class 이름(container / item)은 generateCss 의 선택자와 맞춰야 한다.
// - 아이템별 속성은 CSS 의 :nth-child 규칙으로 표현하므로 HTML 구조는 그대로 둔다.
// - 컨테이너와 각 박스는 지정한 태그(containerTag / content.tag)로 출력한다.
// - withContent 가 true 면 박스 안에 숫자 대신 예시 콘텐츠(이미지/제목/설명) 마크업을 넣는다.

import { DEFAULT_ITEM_TAG } from "./constants";
import type { BoxContent, ItemTag, PlaygroundState } from "./types";

// 문자열을 HTML 안에 넣을 때는 특수문자를 바꿔야 태그로 해석되지 않는다.
// & 를 가장 먼저 바꿔야 뒤에서 만든 &lt; 의 & 가 다시 바뀌지 않는다.
function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// <a> 는 href 가 있어야 링크로 동작한다. 예시라 "#" 을 넣는다.
function openTag(tag: ItemTag): string {
  return tag === "a" ? '<a class="item" href="#">' : `<${tag} class="item">`;
}

function contentLines(content: BoxContent): string[] {
  return [
    ...(content.image
      ? ['    <img src="image.jpg" alt="" width="640" height="360">']
      : []),
    `    <strong>${escapeHtml(content.title)}</strong>`,
    ...(content.body ? [`    <p>${escapeHtml(content.body)}</p>`] : []),
  ];
}

export function generateHtml(
  state: PlaygroundState,
  withContent: boolean,
): string {
  const items = state.contents
    .slice(0, state.boxCount)
    .flatMap((content, i) => {
      const tag = content.tag ?? DEFAULT_ITEM_TAG;
      return withContent
        ? [`  ${openTag(tag)}`, ...contentLines(content), `  </${tag}>`]
        : [`  ${openTag(tag)}${i + 1}</${tag}>`];
    });

  const container = state.containerTag;
  return [`<${container} class="container">`, ...items, `</${container}>`].join(
    "\n",
  );
}

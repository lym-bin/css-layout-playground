// src/lib/layout/highlight.ts
// 출력 코드(HTML / CSS) 한 줄을 색칠용 조각(Token)으로 나누는 순수 함수.
// - 범용 하이라이터가 아니라, generateCss / generateHtml 이 만드는 정해진 모양만 다룬다.
//   (CSS 는 한 줄에 선택자 / 선언 / 닫는 괄호 중 하나, HTML 은 태그와 글자)
// - 조각을 다시 이어 붙이면 원래 줄과 똑같아야 한다. (색만 입히고 글자는 건드리지 않음)
// - changedLines: 코드가 바뀌었을 때 새로 생기거나 달라진 줄 찾기 ("방금 바뀜" 표시)

export type TokenType =
  | "plain"
  | "punct"
  | "selector"
  | "atrule"
  | "property"
  | "value"
  | "tag"
  | "attr"
  | "string";

export interface Token {
  type: TokenType;
  text: string;
}

// 빈 문자열 조각은 만들지 않는다.
function tokens(...parts: [TokenType, string][]): Token[] {
  return parts
    .filter(([, text]) => text !== "")
    .map(([type, text]) => ({ type, text }));
}

export function highlightCssLine(line: string): Token[] {
  // @media (min-width: 768px) {
  const media = line.match(/^(\s*)(@[a-z-]+)( .*)( \{)$/);
  if (media) {
    const [, indent, rule, condition, brace] = media;
    return tokens(
      ["plain", indent],
      ["atrule", rule],
      ["value", condition],
      ["punct", brace],
    );
  }

  // 선택자 {   (예: .container {   .item:nth-child(2) {   a.item {)
  const selector = line.match(/^(\s*)(.+)( \{)$/);
  if (selector) {
    const [, indent, name, brace] = selector;
    return tokens(["plain", indent], ["selector", name], ["punct", brace]);
  }

  // 속성: 값;
  const declaration = line.match(/^(\s*)([a-z-]+)(: )(.*)(;)$/);
  if (declaration) {
    const [, indent, property, colon, value, semi] = declaration;
    return tokens(
      ["plain", indent],
      ["property", property],
      ["punct", colon],
      ["value", value],
      ["punct", semi],
    );
  }

  // }
  const close = line.match(/^(\s*)(\})$/);
  if (close) {
    return tokens(["plain", close[1]], ["punct", close[2]]);
  }

  return tokens(["plain", line]);
}

// 태그 하나: <  /?  이름  속성들  >
const TAG_PATTERN = /(<\/?)([a-z][a-z0-9]*)((?:\s+[a-z-]+(?:="[^"]*")?)*)(\s*\/?>)/g;
const ATTR_PATTERN = /(\s+)([a-z-]+)(?:(=)("[^"]*"))?/g;

function attributeTokens(attrs: string): Token[] {
  return Array.from(attrs.matchAll(ATTR_PATTERN)).flatMap(
    ([, space, name, equals = "", value = ""]) =>
      tokens(
        ["plain", space],
        ["attr", name],
        ["punct", equals],
        ["string", value],
      ),
  );
}

export function highlightHtmlLine(line: string): Token[] {
  const result: Token[] = [];
  let last = 0;

  for (const match of line.matchAll(TAG_PATTERN)) {
    const [whole, open, name, attrs, close] = match;
    const start = match.index;
    // 태그 사이의 글자 (콘텐츠, 들여쓰기)
    result.push(...tokens(["plain", line.slice(last, start)]));
    result.push(...tokens(["punct", open], ["tag", name]));
    result.push(...attributeTokens(attrs));
    result.push(...tokens(["punct", close]));
    last = start + whole.length;
  }

  result.push(...tokens(["plain", line.slice(last)]));
  return result;
}

// 이전 코드에 없던 줄의 번호(새 코드 기준, 0부터). "방금 바뀜" 표시용.
// 값만 바뀐 줄(gap: 12px → gap: 16px)도 글자가 달라서 새 줄로 잡힌다.
export function changedLines(prev: string, next: string): Set<number> {
  if (prev === next) return new Set();
  const before = new Set(prev.split("\n"));
  const result = new Set<number>();
  next.split("\n").forEach((line, i) => {
    if (line.trim() !== "" && !before.has(line)) result.add(i);
  });
  return result;
}

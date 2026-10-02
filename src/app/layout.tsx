// src/app/layout.tsx
// 모든 페이지를 감싸는 루트 레이아웃.
// - <html>, <body> 와 전역 CSS, 폰트 설정
//   - 본문: IBM Plex Sans KR (한글 UI 가독성), 코드: JetBrains Mono (0 / O, 1 / l 구분이 쉬움)
//   - next/font 가 빌드할 때 글꼴 파일을 받아서 같은 도메인에서 내려준다 (외부 요청 없음)
//   - CSS 변수(--font-plex-sans-kr 등)로 넘기고, globals.css 의 @theme 에서 font-sans / font-mono 로 연결
// - 브라우저 탭 제목/설명(metadata)

import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 가변 글꼴이 아니라서 쓰는 굵기를 직접 고른다. (본문 400, 강조 500 / 600, 제목 700)
// 한글 글자 파일은 unicode-range 로 잘게 나뉘어 있어서, 화면에 나온 글자가 든 파일만 내려받는다.
const plexSansKr = IBM_Plex_Sans_KR({
  variable: "--font-plex-sans-kr",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSS Layout Playground",
  description:
    "Flexbox / Grid 속성을 조절하면서 레이아웃과 CSS 코드를 실시간으로 확인하는 플레이그라운드",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${plexSansKr.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

// src/app/layout.tsx
// 모든 페이지를 감싸는 루트 레이아웃.
// - <html>, <body> 와 전역 CSS, 폰트 설정
// - 브라우저 탭 제목/설명(metadata)

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

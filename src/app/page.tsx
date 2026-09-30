// src/app/page.tsx
// 루트 페이지("/"). 서버 컴포넌트.
// 제목을 보여주고, 상호작용이 필요한 LayoutPlayground(클라이언트)를 올리기만 한다.

import LayoutPlayground from "@/components/layout-playground/LayoutPlayground";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-100 dark:bg-black">
      <header className="mx-auto w-full max-w-6xl px-6 pt-8">
        <h1 className="text-2xl font-bold tracking-tight">
          CSS Layout Playground
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Flexbox / Grid 속성을 조절하면 레이아웃과 CSS 코드가 실시간으로
          바뀝니다.
        </p>
      </header>
      <LayoutPlayground />
    </main>
  );
}

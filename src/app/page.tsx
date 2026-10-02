// src/app/page.tsx
// 루트 페이지("/"). 서버 컴포넌트.
// 상호작용이 필요한 LayoutPlayground(클라이언트)를 올리기만 한다.
// 제목은 Flexbox / Grid 전환 버튼과 한 줄에 두려고 LayoutPlayground 안으로 옮겼다.

import LayoutPlayground from "@/components/layout-playground/LayoutPlayground";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <LayoutPlayground />
    </main>
  );
}

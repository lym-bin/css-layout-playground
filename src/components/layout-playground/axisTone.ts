// src/components/layout-playground/axisTone.ts
// 주축 / 교차축 색. 미리보기의 축 화살표와 컨트롤 이름 옆 배지가 같은 색을 써서
// "이 컨트롤이 저 화살표 방향을 바꾼다"는 연결이 눈에 보이게 한다.
// - 주축: 파랑, 교차축: 주황 (색약이 있어도 구분되기 쉬운 조합)
// - 실제 색 값은 globals.css 의 --axis-main / --axis-cross 토큰에 있고, 다크 모드 값도 거기서 바뀐다.

export type AxisTone = "main" | "cross";

export const AXIS_TEXT: Record<AxisTone, string> = {
  main: "text-axis-main",
  cross: "text-axis-cross",
};

export const AXIS_BADGE: Record<AxisTone, string> = {
  main: "bg-axis-main/10 text-axis-main ring-1 ring-axis-main/30",
  cross: "bg-axis-cross/10 text-axis-cross ring-1 ring-axis-cross/30",
};

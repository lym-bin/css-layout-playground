// src/components/layout-playground/axisTone.ts
// 주축 / 교차축 색. 미리보기의 축 화살표와 컨트롤 이름 옆 배지가 같은 색을 써서
// "이 컨트롤이 저 화살표 방향을 바꾼다"는 연결이 눈에 보이게 한다.
// - 주축: 파랑, 교차축: 주황 (색약이 있어도 구분되기 쉬운 조합)

export type AxisTone = "main" | "cross";

export const AXIS_TEXT: Record<AxisTone, string> = {
  main: "text-blue-700 dark:text-blue-400",
  cross: "text-orange-700 dark:text-orange-400",
};

export const AXIS_BADGE: Record<AxisTone, string> = {
  main: "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900",
  cross:
    "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:ring-orange-900",
};

// src/components/layout-playground/controls/SelectControl.tsx
// 정해진 선택지 중 하나를 고르는 드롭다운 한 세트.
// - 이름(한국어) + CSS 속성 태그 + <select> + 지금 고른 값의 한 줄 설명
// - 선택지는 실제 CSS 값 그대로 보여준다. (출력 코드와 같은 글자를 익히도록)
// - 제네릭 T로 선택지 타입을 받아서, onChange도 같은 타입으로 돌려준다.

import { ControlHint, ControlLabel } from "./ControlLabel";

interface SelectControlProps<T extends string> {
  label: string;
  code?: string;
  hint?: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

export default function SelectControl<T extends string>({
  label,
  code,
  hint,
  value,
  options,
  onChange,
}: SelectControlProps<T>) {
  return (
    <label className="flex flex-col gap-1.5">
      <ControlLabel label={label} code={code} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ControlHint hint={hint} />
    </label>
  );
}

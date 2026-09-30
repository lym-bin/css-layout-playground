// src/components/layout-playground/controls/RangeControl.tsx
// 숫자 값을 조절하는 슬라이더 한 세트.
// - 라벨 + 현재 값 표시 + <input type="range">
// - 값은 부모가 가지고 있고, 바뀌면 onChange로 알려준다 (제어 컴포넌트).

interface RangeControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
}

export default function RangeControl({
  label,
  value,
  min,
  max,
  unit = "",
  onChange,
}: RangeControlProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex justify-between font-mono text-xs text-zinc-500">
        {label}
        <span className="text-zinc-800 dark:text-zinc-200">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-zinc-800 dark:accent-zinc-200"
      />
    </label>
  );
}

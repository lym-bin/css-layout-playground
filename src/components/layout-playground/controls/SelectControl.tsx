// src/components/layout-playground/controls/SelectControl.tsx
// 정해진 선택지 중 하나를 고르는 드롭다운 한 세트.
// - 라벨 + <select>
// - 제네릭 T로 선택지 타입을 받아서, onChange도 같은 타입으로 돌려준다.

interface SelectControlProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

export default function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectControlProps<T>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

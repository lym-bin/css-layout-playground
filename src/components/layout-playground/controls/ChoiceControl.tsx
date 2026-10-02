// src/components/layout-playground/controls/ChoiceControl.tsx
// 선택지가 몇 개 안 되는 값을 알약(pill) 버튼으로 한 번에 펼쳐 보여주는 컨트롤.
// - 드롭다운은 눌러야 선택지가 보이지만, 이건 고를 수 있는 값이 전부 보여서 비교하기 쉽다.
// - 이름(한국어) + (있으면) 축 배지 + CSS 속성 태그 + 알약 버튼들 + 지금 고른 값의 한 줄 설명
// - 라디오 버튼과 같은 역할이라 role="radiogroup" / "radio" 와 aria-checked 를 붙인다.

import { ControlHint, ControlLabel, type AxisBadge } from "./ControlLabel";

interface ChoiceControlProps<T extends string> {
  label: string;
  code?: string;
  axis?: AxisBadge;
  hint?: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

export default function ChoiceControl<T extends string>({
  label,
  code,
  axis,
  hint,
  value,
  options,
  onChange,
}: ChoiceControlProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <ControlLabel label={label} code={code} axis={axis} />
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const checked = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(option)}
              className={`rounded-full border px-2.5 py-1 font-mono text-xs transition-colors ${
                checked
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <ControlHint hint={hint} />
    </div>
  );
}

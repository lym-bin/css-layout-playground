// src/components/layout-playground/controls/CheckboxControl.tsx
// 켜고 끄는 옵션 한 세트.
// - 체크박스 + 이름(한국어) + CSS 코드 태그 + (있으면) 짧은 설명
// - 값은 부모가 가지고 있고, 바뀌면 onChange로 알려준다. (제어 컴포넌트)

interface CheckboxControlProps {
  label: string;
  code?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CheckboxControl({
  label,
  code,
  description,
  checked,
  onChange,
}: CheckboxControlProps) {
  return (
    <label className="flex cursor-pointer items-start gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-zinc-800 dark:accent-zinc-200"
      />
      <span className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
          {label}
        </span>
        {code && (
          <code className="self-start rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {code}
          </code>
        )}
        {description && (
          <span className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

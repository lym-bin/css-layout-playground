// src/components/layout-playground/controls/CheckboxConyrol.tsx
// 켜고 끄는 옵션 한 세트.
// - 체크박스 + 라벨(코드) + (있으면) 짧은 설명
// - 값은 부모가 가지고 있고, 바뀌면 onChange로 알려준다. (제어 컴포넌트)

interface CheckboxControlProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CheckboxControl({
  label,
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
        className="mt-0.5 accent-zinc-800 dark:accent-zinc-200"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-mono text-xs">{label}</span>
        {description && (
          <span className="text-[11px] leading-4 text-zinc-500">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

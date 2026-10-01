// src/components/layout-playground/controls/TextControl.tsx
// 자유롭게 문자열을 입력하는 텍스트 입력 한 세트.
// - 라벨 + <input type="text"> + (있으면) 에러 메시지
// - 값 검증은 부모가 하고, 결과 메시지만 error로 넘겨 받는다.

interface TextControlProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function TextControl({
  label,
  value,
  placeholder,
  error,
  onChange,
}: TextControlProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-md border bg-white px-2 py-1.5 font-mono text-sm dark:bg-zinc-900 ${error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"}`}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </label>
  );
}

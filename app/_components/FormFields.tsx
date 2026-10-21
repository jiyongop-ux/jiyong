/**
 * 입력란(Input)과 동의 체크(Checkbox) — 구독 신청 화면에서 써요.
 * 입력란은 오류가 있으면 빨간 테두리(caution)로 바뀌고 아래에 안내 문구가 보여요.
 * 관련: US5 / 판정 규칙 6
 */
import type { InputHTMLAttributes } from "react";
import { CheckIcon } from "./Icons";

export function TextInput({
  id,
  label,
  error,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string | null;
}) {
  const messageId = `${id}-message`;

  return (
    <div className="flex w-full flex-col gap-8">
      <label htmlFor={id} className="text-body-small-medium text-text-secondary">
        {label}
      </label>
      <div className="flex flex-col gap-12">
        <input
          {...rest}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : undefined}
          className={`w-full rounded-0 border bg-surface-default px-16 py-16 text-body-strong text-text-primary placeholder:text-text-placeholder focus:outline-none ${
            error ? "border-border-error" : "border-border-default focus:border-border-focus"
          }`}
        />
        {/* 오류 안내 문구: 입력란 바로 아래에 보여요. */}
        {error && (
          <p id={messageId} className="text-caption-medium text-text-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

// 동의 체크: 체크하면 분홍 바탕에 체크 표시가 보여요.
export function Checkbox({
  id,
  label,
  checked,
  onChange,
  error,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
}) {
  return (
    <div className="flex flex-col gap-12">
      <label htmlFor={id} className="flex items-center gap-8">
        <span className="relative flex size-[24px] shrink-0 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className={`peer size-[24px] appearance-none rounded-4 border ${
              checked ? "border-fill-primary bg-fill-primary" : "border-border-default bg-surface-default"
            }`}
          />
          {checked && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <CheckIcon className="text-icon-on-dark" />
            </span>
          )}
        </span>
        <span className="text-body-medium text-text-primary">{label}</span>
      </label>
      {/* 동의 안내 문구: 동의 항목 바로 아래에 보여요. */}
      {error && <p className="text-caption-medium text-text-error">{error}</p>}
    </div>
  );
}

/**
 * 버튼 (Button) — 화면 곳곳의 버튼이에요.
 * Primary(분홍)는 주요 동작, Secondary(흰 바탕·테두리)는 보조 동작에 써요.
 * 크기 xl은 하단 큰 버튼, sm은 카드 안 '자세히' 같은 작은 버튼이에요.
 */
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";
type Size = "xl" | "sm";

function buttonClass(variant: Variant, size: Size, disabled = false): string {
  const base = "flex items-center justify-center rounded-8 px-24";
  const sizeClass =
    size === "xl" ? "h-[52px] w-full" : variant === "primary" ? "h-[40px]" : "h-[42px]";
  // 눌리지 않는 상태일 때는 회색 바탕으로 보여줘요.
  if (disabled) {
    return `${base} ${sizeClass} bg-fill-disabled text-text-on-disabled ${
      variant === "primary" ? "text-body-medium" : "text-body-strong"
    }`;
  }
  const look =
    variant === "primary"
      ? "bg-fill-primary text-text-on-dark text-body-strong hover:bg-fill-primary-hover"
      : "bg-surface-default border border-border-default text-text-primary text-body-strong hover:bg-bg-subtle";
  return `${base} ${sizeClass} ${look}`;
}

// 누르면 다른 화면으로 이동하는 버튼이에요.
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "xl",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size)}>
      {children}
    </Link>
  );
}

// 누르면 화면 안에서 동작(예: 신청 저장)을 하는 버튼이에요.
export function Button({
  children,
  variant = "primary",
  size = "xl",
  disabled = false,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button {...rest} disabled={disabled} className={buttonClass(variant, size, disabled)}>
      {children}
    </button>
  );
}

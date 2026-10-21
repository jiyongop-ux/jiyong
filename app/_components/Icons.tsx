/**
 * 아이콘 모음 — 뒤로(icon/arrowLeft), 체크(icon/check), 완료 표시(icon/doneMark)예요.
 * 아이콘은 모양만 담당하고, 누르면 어디로 가는지는 아이콘을 쓰는 화면에서 정해요.
 */
export function ArrowLeftIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[24px] text-icon-strong"
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`size-[24px] ${className}`}
    >
      <path d="M6 12.5l4 4 8-9" />
    </svg>
  );
}

// 완료 표시: 분홍 원 안에 흰 체크가 있어요. 신청 완료 화면에서 써요.
export function DoneMarkIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-[64px] items-center justify-center rounded-full bg-fill-primary"
    >
      <CheckIcon className="text-icon-on-dark" />
    </span>
  );
}

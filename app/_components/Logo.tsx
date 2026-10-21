/**
 * 로고 (Logo) — 요금제 목록 헤더 오른쪽의 브랜드 표시예요.
 * 실제 로고 파일이 없어 임시 모양으로 그렸어요. (확인 필요)
 */
export function Logo() {
  return (
    <svg
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="currentColor"
      role="img"
      aria-label="로고"
      className="h-24 w-32 text-brand-primary"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M26 6h2v5h4v2h-4v5h-2v-5h-4v-2h4z" />
    </svg>
  );
}

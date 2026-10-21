/**
 * 작은 표시 배지 — Tag와 Chip이에요.
 * Tag: '추천' 같은 짧은 표시. 요금제 목록에선 추천 요금제 1개에만 붙어요. (판정 규칙 2)
 * Chip(sale): '24개월 할인' 같은 할인 표시. 할인 있는 요금제에만 붙어요. (US4)
 */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-999 bg-border-subtle px-12 py-4 text-caption-bold text-text-secondary">
      {children}
    </span>
  );
}

export function SaleChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[24px] items-center rounded-6 bg-bg-accent-subtle px-8 text-caption-bold text-text-accent">
      {children}
    </span>
  );
}

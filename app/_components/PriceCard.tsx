/**
 * 월 요금 영역 (Card/Price) — 요금제 상세 화면의 가격 요약이에요.
 * '매달 내는 금액' 1개와, 할인 있는 요금제만 '25개월째부터 ○원'을 보여줘요. 정가·할인가·프로모션가를 함께 놓지 않아요.
 * 관련: US4 / 판정 규칙 3, 4
 */
import { afterDiscountText, formatWon, type Plan } from "@/app/_lib/plans";

export function PriceCard({ plan }: { plan: Plan }) {
  const after = afterDiscountText(plan);

  return (
    <section
      data-testid="price-area"
      className="flex w-full flex-col gap-4 rounded-12 bg-bg-default p-20"
    >
      <span className="text-caption-medium text-text-tertiary">매달 내는 금액</span>
      <span className="text-heading-h2 text-text-primary">{formatWon(plan.monthly_price)}</span>
      {/* 할인 종료 후 금액: 할인 있는 요금제(무제한 라이트)일 때만 보여요. 나머지 요금제는 이 줄이 없어요. */}
      {after && (
        <span data-testid="price-after" className="text-caption-medium text-text-tertiary">
          {after}
        </span>
      )}
    </section>
  );
}

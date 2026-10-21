/**
 * 요금제 카드 (Card/Plan) — 요금제 목록 화면에서 요금제 1개를 보여줘요.
 * 이름·한 줄 설명·기본 데이터량·소진 후 속도·매달 내는 금액·'자세히' 버튼을 담아요.
 * 금액은 매달 내는 금액 1개 + 할인 종료 후 금액 최대 1개만 보여주고, 정가·취소선은 없어요.
 * 관련: US1, US3, US4 / 판정 규칙 2~5
 */
import {
  afterDiscountText,
  discountChipText,
  formatWon,
  speedText,
  type Plan,
} from "@/app/_lib/plans";
import { SaleChip, Tag } from "./Badges";
import { ButtonLink } from "./Button";

export function PlanCard({ plan }: { plan: Plan }) {
  const after = afterDiscountText(plan);
  const chip = discountChipText(plan);

  return (
    <article
      data-testid="plan-card"
      data-plan-id={plan.id}
      className="flex w-full flex-col gap-8 rounded-16 border border-border-default bg-surface-default p-20"
    >
      {/* 이름 줄: 추천 Tag는 데일리 50GB에만(판정 규칙 2), '24개월 할인' Chip은 할인 있는 무제한 라이트에만 보여요. (US4) */}
      <div className="flex items-center gap-8">
        <h2 className="text-subtitle-bold text-text-primary">{plan.name}</h2>
        {plan.recommended && <Tag>추천</Tag>}
        {chip && <SaleChip>{chip}</SaleChip>}
      </div>
      <p className="text-body-small-medium text-text-secondary">{plan.description}</p>
      {/* 데이터 줄: 기본 데이터량과 '소진 후 ○Mbps로 제한' 또는 '속도 제한 없음'을 보여줘요. (US1, US3, 판정 규칙 5) */}
      <div className="flex flex-wrap gap-8 text-body-small-strong text-text-primary">
        <span>{plan.data}</span>
        <span aria-hidden="true" className="text-text-tertiary">
          ·
        </span>
        <span>{speedText(plan)}</span>
      </div>
      {/* 금액 줄: 매달 내는 금액 1개, 할인 있는 요금제만 '25개월째부터 ○원'을 한 줄 더 보여줘요. (US4, 판정 규칙 3·4) */}
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-caption-medium text-text-tertiary">매달 내는 금액</span>
          <span className="text-subtitle-bold text-text-primary">
            {formatWon(plan.monthly_price)}
          </span>
          {after && (
            <span data-testid="price-after" className="text-caption-medium text-text-tertiary">
              {after}
            </span>
          )}
        </div>
        {/* '자세히' 버튼: 누르면 이 요금제의 요금제 상세 화면으로 이동해요. (US5) */}
        <ButtonLink href={`/plans/${plan.id}`} variant="secondary" size="sm">
          자세히
        </ButtonLink>
      </div>
    </article>
  );
}

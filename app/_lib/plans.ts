import prd from "@/harness/out/01-prd.json";

export type Plan = {
  id: string;
  name: string;
  monthly_price: number;
  data: string;
  throttle_after: string | null;
  price_after_discount: number | null;
  discount_months: number | null;
  description: string;
  recommended: boolean;
};

export type PlanFilter = {
  label: string;
  plan_ids: string[];
};

export type Message = {
  situation: string;
  text: string;
  where: string;
};

export const plans: Plan[] = [...(prd.plans as Plan[])].sort(
  (a, b) => a.monthly_price - b.monthly_price,
);

export const filters: PlanFilter[] = prd.filters as PlanFilter[];

const messageList: Message[] = prd.messages as Message[];

export const messages = {
  nameRequired: messageList[0].text,
  phoneInvalid: messageList[1].text,
  agreeRequired: messageList[2].text,
  saveFailed: messageList[3].text,
};

export function getPlan(id: string | null | undefined): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function speedText(plan: Plan): string {
  return plan.throttle_after ? `소진 후 ${plan.throttle_after}` : "속도 제한 없음";
}

export function afterDiscountText(plan: Plan): string | null {
  if (plan.price_after_discount == null || plan.discount_months == null) return null;
  return `${plan.discount_months + 1}개월째부터 ${formatWon(plan.price_after_discount)}`;
}

export function discountChipText(plan: Plan): string | null {
  return plan.discount_months != null ? `${plan.discount_months}개월 할인` : null;
}

export type Subscription = {
  id: string;
  name: string;
  phone: string;
  plan_id: string;
  monthly_price: number;
  agreed_privacy: boolean;
  created_at: string;
};

export const SUBSCRIPTION_KEY = "subscription";

export function saveSubscription(subscription: Subscription): void {
  window.sessionStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
}

// 신청 번호와 신청 일시는 저장하는 순간에 만들어요.
export function createSubscription(
  input: Omit<Subscription, "id" | "created_at">,
): Subscription {
  const now = new Date();
  return {
    ...input,
    id: `S${now.getTime().toString(36).toUpperCase()}`,
    created_at: now.toISOString(),
  };
}

export function readSubscriptionRaw(): string | null {
  try {
    return window.sessionStorage.getItem(SUBSCRIPTION_KEY);
  } catch {
    return null;
  }
}

export function parseSubscription(raw: string | null): Subscription | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Subscription;
  } catch {
    return null;
  }
}

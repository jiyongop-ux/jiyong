/**
 * 신청 완료 내용 — 신청 완료 화면(/complete)의 본문이에요.
 * 구독 신청 화면에서 이 브라우저 창에 저장한 신청 1건을 읽어 완료 표시와 신청 내역을 보여줘요.
 * 관련: US5 / 판정 규칙 7
 */
"use client";

import { useMemo, useSyncExternalStore } from "react";
import { formatWon, getPlan } from "@/app/_lib/plans";
import { parseSubscription, readSubscriptionRaw } from "@/app/_lib/subscription";
import { DoneMarkIcon } from "./Icons";
import { ListRow } from "./ListRow";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

const getServerSnapshot = () => null;

export function CompleteView() {
  const raw = useSyncExternalStore(subscribe, readSubscriptionRaw, getServerSnapshot);
  const subscription = useMemo(() => parseSubscription(raw), [raw]);

  // 저장된 신청이 없으면 아무것도 보여주지 않아요. (빈 상태 화면은 확인 필요)
  if (!subscription) return null;

  const plan = getPlan(subscription.plan_id);

  return (
    <div className="flex flex-col gap-16">
      {/* 완료 표시(icon/doneMark): 완료 아이콘과 '구독 신청이 완료됐어요' 문구예요. */}
      <div className="flex flex-col items-center gap-12 py-24">
        <DoneMarkIcon />
        <h2 className="text-heading-h3 text-text-primary">구독 신청이 완료됐어요</h2>
      </div>
      {/* 신청 내역(List/Row): 신청 번호·요금제 이름·매달 내는 금액·신청 일시·신청자 이름. 요금제와 금액은 신청 때 고른 값 그대로예요. (판정 규칙 7) */}
      <section className="flex flex-col gap-12">
        <h3 className="text-subtitle-bold text-text-primary">신청 내역</h3>
        <div className="flex flex-col rounded-12 border border-border-default px-16 py-4">
          <ListRow label="신청 번호" value={subscription.id} />
          <ListRow label="요금제" value={plan?.name ?? subscription.plan_id} />
          <ListRow label="매달 내는 금액" value={formatWon(subscription.monthly_price)} />
          <ListRow
            label="신청 일시"
            value={new Date(subscription.created_at).toLocaleString("ko-KR")}
          />
          <ListRow label="신청자 이름" value={subscription.name} />
        </div>
      </section>
    </div>
  );
}

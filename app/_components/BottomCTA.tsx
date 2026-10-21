/**
 * 하단 동작 영역 (BottomCTA) — 화면 맨 아래에 붙어 있는 버튼 영역이에요.
 * single: 버튼만 있어요(구독 신청·신청 완료).
 * price: 금액 요약 줄 + 버튼이에요(요금제 상세의 '매달 내는 금액' + '구독 신청하기').
 */
export function BottomCTA({
  children,
  amountLabel,
  amount,
  notice,
}: {
  children: React.ReactNode;
  amountLabel?: string;
  amount?: string;
  notice?: React.ReactNode;
}) {
  const isPrice = amount !== undefined;

  return (
    <div
      className={`sticky bottom-0 flex w-full flex-col bg-bg-surface px-16 pb-32 ${
        isPrice ? "gap-12 pt-16" : "gap-8 pt-12"
      }`}
    >
      {/* 안내 문구 자리: 구독 신청에서 저장 실패 문구를 버튼 위에 보여줄 때 써요. */}
      {notice}
      {/* 금액 요약 줄: price 형태일 때만 보여요. */}
      {isPrice && (
        <div className="flex items-center justify-between gap-8">
          <span className="text-body-small-medium text-text-secondary">{amountLabel}</span>
          <span className="text-subtitle-bold text-text-primary">{amount}</span>
        </div>
      )}
      {children}
    </div>
  );
}

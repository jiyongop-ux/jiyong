/**
 * 정보 행 (List/Row) — 왼쪽에 항목 이름, 오른쪽에 값을 나란히 보여줘요.
 * 요금제 상세의 기본 제공 항목, 구독 신청의 요금제 요약, 신청 완료의 신청 내역에 써요.
 */
export function ListRow({
  label,
  value,
  testId,
}: {
  label: string;
  value: React.ReactNode;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className="flex w-full items-start justify-between gap-12 px-4 py-12"
    >
      <span className="shrink-0 text-body-small-medium text-text-secondary">{label}</span>
      <span className="text-right text-body-small-strong text-text-primary">{value}</span>
    </div>
  );
}

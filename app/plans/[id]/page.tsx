/**
 * 요금제 상세 화면 (/plans/[id])
 * 고른 요금제의 매달 내는 금액, 할인 종료 후 금액(할인 있는 요금제만), 기본 데이터량·소진 후 속도를 보여줘요.
 * 아래 '구독 신청하기'로 고른 요금제를 가지고 구독 신청 화면으로 넘어가요.
 * 관련: US3, US4, US5 / 판정 규칙 3, 4, 5
 */
import { notFound } from "next/navigation";
import { Tag } from "@/app/_components/Badges";
import { BottomCTA } from "@/app/_components/BottomCTA";
import { ButtonLink } from "@/app/_components/Button";
import { Header } from "@/app/_components/Header";
import { ListRow } from "@/app/_components/ListRow";
import { PriceCard } from "@/app/_components/PriceCard";
import { formatWon, getPlan, plans, speedText } from "@/app/_lib/plans";

// 요금제 4개(p01~p04)의 상세 화면을 미리 만들어 둬요.
export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }));
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = getPlan(id);
  // 없는 요금제 주소로 들어오면 '페이지 없음' 화면을 보여줘요. (에러 상태 화면은 PRD에서 확인 필요)
  if (!plan) notFound();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-bg-surface">
      {/* 헤더: 제목은 요금제 이름이에요. 뒤로 아이콘을 누르면 요금제 목록으로 이동해요. */}
      <Header title={plan.name} backHref="/plans" />
      <main className="flex flex-1 flex-col gap-24 p-24">
        {/* 추천 Tag: 목록에서 추천된 요금제(데일리 50GB)일 때만 보여요. */}
        {plan.recommended && (
          <div>
            <Tag>추천</Tag>
          </div>
        )}
        {/* 월 요금(Card/Price): 매달 내는 금액 1개와, 할인 있는 요금제만 '25개월째부터 ○원'을 보여줘요. (US4, 판정 규칙 3·4) */}
        <PriceCard plan={plan} />
        {/* 기본 제공 항목(List/Row): 기본 데이터량과 소진 후 속도를 보여줘요. 통화·문자 등 다른 행은 확인 필요예요. (US1, US3, 판정 규칙 5) */}
        {/* 포함 혜택(OptionItem)은 내용이 확인 필요라서 확정 전까지 비워 뒀어요. */}
        <section className="flex flex-col gap-12">
          <h2 className="text-subtitle-bold text-text-primary">기본 제공</h2>
          <div className="flex flex-col">
            <ListRow label="기본 데이터" value={plan.data} />
            <ListRow label="소진 후 속도" value={speedText(plan)} />
          </div>
        </section>
      </main>
      {/* 신청 영역(BottomCTA): 매달 내는 금액과 '구독 신청하기' 버튼이에요. 누르면 고른 요금제를 가지고 구독 신청 화면으로 이동해요. (US5) */}
      <BottomCTA amountLabel="매달 내는 금액" amount={formatWon(plan.monthly_price)}>
        <ButtonLink href={`/apply?plan=${plan.id}`}>구독 신청하기</ButtonLink>
      </BottomCTA>
    </div>
  );
}

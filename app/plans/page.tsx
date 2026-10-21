/**
 * 요금제 목록 화면 (/plans)
 * 요금제 4개(p01~p04)를 카드로 보여주고, 고객이 데이터량·소진 후 속도·매달 내는 금액을 비교해 고르게 해요.
 * 카드는 매달 내는 금액이 낮은 순으로 놓여요. (기본 정렬은 PRD에서 확인 필요, 실습 기준으로 둠)
 * 관련: US1, US2, US3, US4 / 판정 규칙 1~5
 */
import { Header } from "@/app/_components/Header";
import { PlanCard } from "@/app/_components/PlanCard";
import { PlanFilter } from "@/app/_components/PlanFilter";
import { filters, plans } from "@/app/_lib/plans";

export default function PlansPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-bg-surface">
      {/* 헤더(Header root): 뒤로 아이콘 없이 왼쪽에 '요금제' 제목, 오른쪽에 Logo를 보여줘요. */}
      <Header type="root" title="요금제" />
      <main className="flex flex-1 flex-col gap-24 p-24">
        {/* 필터 칩과 요금제 카드: 처음엔 '전체'가 선택되어 카드 4개가 모두 보여요. 칩을 누르면 조건에 맞는 카드만 남아요. (US2, 판정 규칙 1) */}
        <PlanFilter
          filters={filters}
          items={plans.map((plan) => ({ id: plan.id, card: <PlanCard plan={plan} /> }))}
        />
      </main>
    </div>
  );
}

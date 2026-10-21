/**
 * 신청 완료 화면 (/complete)
 * 방금 저장한 신청 1건(신청 번호, 요금제 이름, 매달 내는 금액, 신청 일시, 신청자 이름)을 보여줘요.
 * 요금제 이름과 매달 내는 금액은 구독 신청 화면에서 고른 요금제와 같아요.
 * 관련: US5 / 판정 규칙 7
 */
import { BottomCTA } from "@/app/_components/BottomCTA";
import { ButtonLink } from "@/app/_components/Button";
import { CompleteView } from "@/app/_components/CompleteView";
import { Header } from "@/app/_components/Header";

export default function CompletePage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-bg-surface">
      {/* 헤더: 뒤로 아이콘을 누르면 요금제 목록으로 이동해요. 목적지는 PRD에 없어 확인 필요예요(임시로 요금제 목록). */}
      <Header title="신청 완료" backHref="/plans" />
      <main className="flex flex-1 flex-col gap-16 p-16">
        {/* 완료 표시와 신청 내역: 저장된 신청이 없으면 비어 있어요. (빈 상태 화면은 확인 필요) */}
        <CompleteView />
      </main>
      {/* '요금제 더 보기'(BottomCTA): 누르면 요금제 목록으로 이동해요. 목적지는 PRD에 없어 확인 필요예요(임시로 요금제 목록). */}
      <BottomCTA>
        <ButtonLink href="/plans">요금제 더 보기</ButtonLink>
      </BottomCTA>
    </div>
  );
}

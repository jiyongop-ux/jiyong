/**
 * 구독 신청 화면 (/apply)
 * 상세 화면에서 고른 요금제를 요약해 보여주고, 이름·휴대폰 번호·개인정보 동의를 받아 신청 1건을 저장해요.
 * 저장은 이 브라우저 창 안에만 해요(백엔드는 범위 밖). 저장이 끝나면 신청 완료 화면으로 이동해요.
 * 관련: US4, US5 / 판정 규칙 6, 7
 */
import { Suspense } from "react";
import { ApplyForm } from "@/app/_components/ApplyForm";
import { Header } from "@/app/_components/Header";

export default function ApplyPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-bg-surface">
      {/* 주소에 담긴 요금제 정보를 읽는 동안은 헤더만 먼저 보여주고, 다 읽으면 신청 입력 화면을 보여줘요. */}
      <Suspense fallback={<Header title="구독 신청" backHref="/plans" />}>
        <ApplyForm />
      </Suspense>
    </div>
  );
}

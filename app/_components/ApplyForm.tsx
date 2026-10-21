/**
 * 구독 신청 입력 영역 — 구독 신청 화면(/apply)의 본문이에요.
 * 상세 화면에서 넘겨받은 요금제를 요약하고, 이름·휴대폰 번호·개인정보 동의를 받아 신청 1건을 저장해요.
 * 안내 문구 4가지는 PRD 문구를 그대로 써요.
 * 관련: US4, US5 / 판정 규칙 6, 7
 */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { afterDiscountText, formatWon, getPlan, messages } from "@/app/_lib/plans";
import { createSubscription, saveSubscription } from "@/app/_lib/subscription";
import { BottomCTA } from "./BottomCTA";
import { Button, ButtonLink } from "./Button";
import { Checkbox, TextInput } from "./FormFields";
import { Header } from "./Header";
import { ListRow } from "./ListRow";

// 휴대폰 번호는 숫자 11자리여야 해요.
const PHONE_PATTERN = /^\d{11}$/;

export function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 상세 화면에서 넘겨받은 요금제 id로 고른 요금제를 찾아요.
  const plan = getPlan(searchParams.get("plan"));

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [agreeTouched, setAgreeTouched] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  // 요금제 정보 없이 들어오면 요금제 목록으로 돌아가는 버튼만 보여줘요. (이 경우의 화면은 PRD에서 확인 필요)
  if (!plan) {
    return (
      <>
        <Header title="구독 신청" backHref="/plans" />
        <main className="flex flex-1 flex-col gap-16 p-16">
          <ButtonLink href="/plans">요금제 목록으로</ButtonLink>
        </main>
      </>
    );
  }

  const nameValid = name.trim().length > 0;
  const phoneValid = PHONE_PATTERN.test(phone);
  // '신청하기'는 이름 입력 + 휴대폰 번호 숫자 11자리 + 동의 체크, 세 가지를 모두 채워야 눌려요. (판정 규칙 6)
  const canSubmit = nameValid && phoneValid && agreed;

  const nameError = nameTouched && !nameValid ? messages.nameRequired : null;
  const phoneError = phoneTouched && !phoneValid ? messages.phoneInvalid : null;
  // 동의 안내 문구는 동의를 풀었을 때, 또는 이름·번호를 다 채우고 동의만 남았을 때 보여줘요.
  // (버튼이 눌리지 않는 상태라 '동의 없이 신청 시도'를 이렇게 대신 판단해요. 확인 필요)
  const agreeError =
    !agreed && (agreeTouched || (nameValid && phoneValid)) ? messages.agreeRequired : null;

  const after = afterDiscountText(plan);
  const detailHref = `/plans/${plan.id}`;

  // '신청하기'를 누르면 신청 1건(신청 번호·일시는 이때 만들어요)을 저장하고 신청 완료 화면으로 이동해요.
  // 저장에 실패하면 버튼 위에 저장 실패 안내 문구를 보여주고 이 화면에 머물러요.
  function handleSubmit() {
    if (!plan || !canSubmit) return;
    try {
      saveSubscription(
        createSubscription({
          name: name.trim(),
          phone,
          plan_id: plan.id,
          monthly_price: plan.monthly_price,
          agreed_privacy: true,
        }),
      );
    } catch {
      setSaveFailed(true);
      return;
    }
    setSaveFailed(false);
    router.push("/complete");
  }

  return (
    <>
      {/* 헤더: 뒤로 아이콘을 누르면 고른 요금제의 상세 화면으로 이동해요. 입력값 유지 여부는 확인 필요예요(지금은 유지 안 함). */}
      <Header title="구독 신청" backHref={detailHref} />
      <main className="flex flex-1 flex-col gap-16 p-16">
        {/* 선택한 요금제 요약(List/Row): 요금제 이름, 매달 내는 금액, 할인 있는 요금제만 할인 종료 후 금액을 보여줘요. (US4) */}
        <section className="flex flex-col gap-12">
          <h2 className="text-subtitle-bold text-text-primary">신청 내용</h2>
          <div className="flex flex-col rounded-12 border border-border-default px-16 py-4">
            <ListRow label="요금제" value={plan.name} />
            <ListRow label="매달 내는 금액" value={formatWon(plan.monthly_price)} />
            {after && <ListRow label="할인 종료 후" value={after} />}
          </div>
        </section>

        <section className="flex flex-col gap-16">
          <h2 className="text-subtitle-bold text-text-primary">신청자 정보</h2>
          {/* 이름 입력란: 비운 채 다음 입력란으로 넘어가면 아래에 '이름을 입력해 주세요.'가 보여요. */}
          <TextInput
            id="apply-name"
            label="이름"
            placeholder="이름"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            error={nameError}
          />
          {/* 휴대폰 번호 입력란: 숫자 11자리가 아니면 입력란을 벗어날 때 아래에 '휴대폰 번호 11자리를 숫자로 입력해 주세요.'가 보여요. */}
          <TextInput
            id="apply-phone"
            label="휴대폰 번호"
            placeholder="숫자만 입력"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setPhoneTouched(true)}
            error={phoneError}
          />
          {/* 개인정보 수집·이용 동의(Checkbox): 처음엔 체크되어 있지 않아요. */}
          <Checkbox
            id="apply-agree"
            label="개인정보 수집·이용 동의"
            checked={agreed}
            onChange={(next) => {
              setAgreed(next);
              setAgreeTouched(true);
            }}
            error={agreeError}
          />
        </section>
      </main>

      {/* 하단 버튼(BottomCTA): '신청하기'는 세 조건을 채우기 전엔 눌리지 않아요. '취소'는 요금제 상세 화면으로 이동해요. */}
      <BottomCTA
        notice={
          saveFailed ? (
            <p role="alert" className="text-caption-medium text-text-error">
              {messages.saveFailed}
            </p>
          ) : null
        }
      >
        <Button type="button" disabled={!canSubmit} onClick={handleSubmit}>
          신청하기
        </Button>
        <ButtonLink href={detailHref} variant="secondary">
          취소
        </ButtonLink>
      </BottomCTA>
    </>
  );
}

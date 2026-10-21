/**
 * 요금제 필터 (FilterChip) — 요금제 목록 화면의 칩 3개와 카드 목록이에요.
 * 전체: 카드 4개 / 50GB 이상: 3개 / 속도 제한 없음: 1개 (칩 항목은 하네스 인터뷰에서 정한 값)
 * 카드 자체는 처음부터 화면에 들어 있고, 칩을 누를 때 보이는 카드만 바뀌어요.
 * 관련: US2 / 판정 규칙 1
 */
"use client";

import { useState } from "react";
import type { PlanFilter as Filter } from "@/app/_lib/plans";

export function PlanFilter({
  filters,
  items,
}: {
  filters: Filter[];
  items: { id: string; card: React.ReactNode }[];
}) {
  // 지금 선택된 칩을 기억해요. 처음엔 '전체'예요.
  const [selected, setSelected] = useState(filters[0]?.label ?? "");
  const current = filters.find((f) => f.label === selected) ?? filters[0];
  const visible = current ? items.filter((item) => current.plan_ids.includes(item.id)) : items;

  return (
    <div className="flex flex-col gap-24">
      {/* 필터 칩: 누른 칩만 선택 상태(진한 회색)로 바뀌고, 한 번에 하나만 선택돼요. */}
      <div role="group" aria-label="요금제 필터" className="flex flex-wrap gap-8">
        {filters.map((filter) => {
          const isSelected = filter.label === selected;
          return (
            <button
              key={filter.label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(filter.label)}
              className={
                isSelected
                  ? "flex h-[40px] items-center rounded-full bg-fill-secondary px-16 py-8 text-body-small-strong text-text-on-dark"
                  : "flex h-[40px] items-center rounded-full border border-border-default bg-surface-default px-16 py-8 text-body-small-medium text-text-primary"
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      {/* 카드 목록: 선택한 칩 조건에 맞는 요금제 카드만 보여줘요. '전체'면 4개 모두예요. */}
      <div className="flex flex-col gap-16">
        {visible.map((item) => (
          <div key={item.id}>{item.card}</div>
        ))}
      </div>
    </div>
  );
}

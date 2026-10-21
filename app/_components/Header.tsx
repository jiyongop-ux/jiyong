/**
 * 헤더 (Header) — 모든 화면 맨 위의 제목 줄이에요.
 * root: 요금제 목록처럼 첫 화면에서 써요. 왼쪽 제목 + 오른쪽 Logo, 뒤로 아이콘이 없어요.
 * default: 하위 화면에서 써요. 뒤로 아이콘(icon/arrowLeft) + 가운데 제목이에요.
 */
import Link from "next/link";
import { ArrowLeftIcon } from "./Icons";
import { Logo } from "./Logo";

type HeaderProps =
  | { type: "root"; title: string }
  | { type?: "default"; title: string; backHref: string };

export function Header(props: HeaderProps) {
  if (props.type === "root") {
    return (
      <header className="flex h-56 w-full items-center justify-between gap-12 px-16 py-4 bg-bg-surface">
        <h1 className="text-heading-h4 text-text-primary">{props.title}</h1>
        <Logo />
      </header>
    );
  }

  return (
    <header className="flex h-56 w-full items-center gap-8 px-16 py-4 bg-bg-surface">
      {/* 뒤로 아이콘: 누르면 각 화면이 정해 준 곳으로 이동해요. */}
      <Link
        href={props.backHref}
        aria-label="뒤로"
        className="flex size-[24px] shrink-0 items-center justify-center"
      >
        <ArrowLeftIcon />
      </Link>
      <h1 className="flex-1 text-center text-subtitle-default text-text-primary">
        {props.title}
      </h1>
      <span aria-hidden="true" className="size-[24px] shrink-0" />
    </header>
  );
}

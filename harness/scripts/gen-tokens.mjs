#!/usr/bin/env node
// 하네스 ③단계: docs/tokens.json → app/tokens.css (Tailwind v4 테마 변수)
// 텍스트 스타일(크기·줄 간격·굵기 묶음)만 docs/Design.md 2장 표에서 읽는다.
// 같은 입력이면 항상 같은 결과가 나온다. 사용: node harness/scripts/gen-tokens.mjs
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { p, read } from "./lib/paths.mjs";

const kebab = (key) => key.replace(/\//g, "-");
const byNumber = ([, a], [, b]) => a - b;

export function buildTokensCss() {
  const t = JSON.parse(read("docs/tokens.json"));
  const design = read("docs/Design.md");

  // | heading/h1 | 32 / 44 | Bold 700 | … |
  const styles = [...design.matchAll(/^\|\s*([a-z]+\/[a-z0-9-]+)\s*\|\s*(\d+)\s*\/\s*(\d+)\s*\|\s*[A-Za-z]+\s+(\d{3})\s*\|/gm)];
  if (!styles.length) throw new Error("Design.md에서 텍스트 스타일 표를 찾지 못했어요.");

  const sizes = new Set(Object.values(t.typography).filter((v) => typeof v === "number"));
  for (const [, name, size] of styles) {
    if (!sizes.has(Number(size))) throw new Error(`Design.md 텍스트 스타일 ${name}의 크기 ${size}가 tokens.json에 없어요.`);
  }

  const L = [];
  L.push("/* 자동 생성 파일이에요. 직접 고치지 마세요.");
  L.push(" * 만드는 법: node harness/scripts/gen-tokens.mjs");
  L.push(" * 원본: docs/tokens.json (텍스트 스타일 묶음만 docs/Design.md 2장) */");
  L.push("@theme {");
  L.push("  /* Tailwind 기본값을 지우고 토큰만 남겨요. */");
  for (const ns of ["color", "spacing", "radius", "text", "font-weight", "leading"]) L.push(`  --${ns}-*: initial;`);
  L.push("");
  L.push(`  --font-sans: var(--font-noto-sans-kr), "${t.typography["font-family/family-font"]}", sans-serif;`);
  L.push("");
  L.push("  /* 색 (semantic 토큰만) */");
  for (const [key, { value }] of Object.entries(t.semantic).sort(([a], [b]) => a.localeCompare(b))) {
    L.push(`  --color-${kebab(key)}: ${value};`);
  }
  L.push("");
  L.push("  /* 간격 (클래스 숫자 = px) */");
  for (const [key, v] of Object.entries(t.spacing).sort(byNumber)) L.push(`  --spacing-${key.split("/").pop()}: ${v}px;`);
  L.push("");
  L.push("  /* 모서리 */");
  for (const [key, v] of Object.entries(t.radius).sort(byNumber)) L.push(`  --radius-${key.split("/").pop()}: ${v}px;`);
  L.push("");
  L.push("  /* 텍스트 스타일 (크기 / 줄 간격 / 굵기 묶음) */");
  for (const [, name, size, lh, weight] of styles) {
    const n = kebab(name);
    L.push(`  --text-${n}: ${size}px;`);
    L.push(`  --text-${n}--line-height: ${lh}px;`);
    L.push(`  --text-${n}--font-weight: ${weight};`);
  }
  L.push("}");
  return L.join("\n") + "\n";
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  fs.writeFileSync(p("app/tokens.css"), buildTokensCss());
  console.log("app/tokens.css를 만들었어요.");
}

#!/usr/bin/env node
// 하네스 판정 스크립트. 기계가 셀 수 있는 조건만 본다.
// 사용: node harness/scripts/gate.mjs <1|2|3|scan|4|5|all> [...]
//   all 은 전부 돌리고 harness/out/05-verify.md 를 쓴다. 하나라도 실패하면 종료 코드 1.
import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { ROOT, p, read, readJson, today, walk } from "./lib/paths.mjs";
import { readPrd } from "./lib/prd.mjs";
import { checkCode, formatViolations } from "./lib/token-rules.mjs";
import { buildTokensCss } from "./gen-tokens.mjs";

const CODE_EXT = /\.(tsx?|jsx?|mjs|css)$/;

const GATES = {
  1: {
    title: "G1 PRD 읽기",
    blocks: "요금제 수가 PRD와 다르거나 필수 항목이 빈 01-prd.json",
    back: "①",
    run() {
      const prd = readPrd();
      const out = readJson("harness/out/01-prd.json");
      const errs = [];
      const plans = Array.isArray(out.plans) ? out.plans : [];
      if (plans.length !== prd.plans.length) errs.push(`요금제 수가 달라요: PRD ${prd.plans.length}개, 01-prd.json ${plans.length}개`);
      const ids = new Set(prd.plans.map((x) => x.id));
      for (const pl of plans) if (!ids.has(pl.id)) errs.push(`PRD에 없는 요금제 id가 있어요: ${pl.id}`);
      plans.forEach((pl, i) => {
        const who = pl.id ?? `${i + 1}번째`;
        for (const k of ["id", "name", "monthly_price", "data", "description"]) {
          if (pl[k] === undefined || pl[k] === null || pl[k] === "") errs.push(`${who} 요금제의 ${k}가 비어 있어요`);
        }
        for (const k of ["throttle_after", "price_after_discount", "discount_months", "recommended"]) {
          if (!(k in pl)) errs.push(`${who} 요금제에 ${k} 항목이 없어요(없으면 null로 적어야 해요)`);
        }
      });
      const routes = Array.isArray(out.routes) ? out.routes : [];
      if (routes.length !== prd.screens.length) errs.push(`라우트 수가 달라요: PRD ${prd.screens.length}개, 01-prd.json ${routes.length}개`);
      return errs;
    },
  },

  2: {
    title: "G2 페이지 나누기",
    blocks: "라우트 수가 PRD 화면 수와 다르거나 오늘 화면 명세가 없는 상태",
    back: "②",
    run() {
      const prd = readPrd();
      const pages = readJson("harness/out/02-pages.json").pages ?? [];
      const want = prd.screens.map((s) => s.route);
      const got = pages.map((x) => x.route);
      const errs = [];
      if (got.length !== want.length) errs.push(`라우트 수가 달라요: PRD ${want.length}개, 02-pages.json ${got.length}개`);
      for (const r of want) if (!got.includes(r)) errs.push(`PRD 라우트 ${r}가 02-pages.json에 없어요`);
      for (const r of got) if (!want.includes(r)) errs.push(`PRD에 없는 라우트 ${r}가 02-pages.json에 있어요`);
      const spec = `docs/${today()}-spec.md`;
      if (!fs.existsSync(p(spec))) errs.push(`오늘 날짜 화면 명세(${spec})가 없어요`);
      return errs;
    },
  },

  3: {
    title: "G3 토큰 적용",
    blocks: "tokens.json과 어긋난 app/tokens.css (손으로 고친 경우 포함)",
    back: "③",
    run() {
      if (!fs.existsSync(p("app/tokens.css"))) return ["app/tokens.css가 없어요"];
      const want = buildTokensCss().split("\n");
      const have = read("app/tokens.css").replace(/\r\n/g, "\n").split("\n");
      let diff = Math.abs(want.length - have.length);
      for (let i = 0; i < Math.min(want.length, have.length); i++) if (want[i] !== have[i]) diff++;
      return diff ? [`다시 만든 결과와 ${diff}줄 달라요. gen-tokens.mjs로 다시 만들어야 해요`] : [];
    },
  },

  scan: {
    title: "토큰 밖 값 검사",
    blocks: "app/ 코드의 임의값·직접 색/px·기본 팔레트·토큰 밖 간격/모서리·줄 간격/굵기 단독 지정",
    back: "③",
    run() {
      return walk("app")
        .filter((f) => CODE_EXT.test(f) && f !== "app/tokens.css")
        .flatMap((f) => formatViolations(f, checkCode(read(f))));
    },
  },

  4: {
    title: "G4 화면 구현",
    blocks: "화면 수 ≠ 라우트 수, 루트가 /plans로 이동하지 않음, build·lint 오류",
    back: "④",
    run() {
      const errs = [];
      const routes = (readJson("harness/out/02-pages.json").pages ?? []).map((x) => x.route);
      const files = walk("app").filter((f) => /\/page\.(t|j)sx?$/.test(f) && !f.split("/").some((s) => s.startsWith("_")));
      const root = files.find((f) => /^app\/page\./.test(f));
      const screens = files.filter((f) => f !== root);
      const toRoute = (f) =>
        "/" + f.replace(/^app\//, "").replace(/\/?page\.\w+$/, "").split("/").filter((s) => s && !/^\(.*\)$/.test(s)).join("/");
      const got = screens.map(toRoute);
      if (got.length !== routes.length) {
        errs.push({ msg: `화면 수가 라우트 수와 달라요: 라우트 ${routes.length}개, 화면 파일 ${got.length}개 (${got.join(", ") || "없음"})`, back: "②" });
      }
      for (const r of routes) if (!got.includes(r)) errs.push(`라우트 ${r}의 화면 파일이 없어요`);
      if (!root) errs.push("루트 화면(app/page.tsx)이 없어요");
      else if (!/redirect\(\s*["'`]\/plans["'`]\s*\)/.test(read(root))) errs.push("루트 화면(/)이 /plans로 이동하지 않아요");

      for (const script of ["build", "lint"]) {
        const r = spawnSync("npm", ["run", script], { cwd: ROOT, shell: true, encoding: "utf8" });
        if (r.status !== 0) {
          const tail = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim().split(/\r?\n/).slice(-15).join("\n    ");
          errs.push(`npm run ${script} 실패:\n    ${tail}`);
        }
      }
      return errs;
    },
  },

  5: {
    title: "G5 ★금액 규칙",
    blocks: "카드·상세 가격 영역에 금액 3개 이상, 할인 없는 요금제의 할인 종료 후 금액, 취소선 정가",
    back: "④",
    async run() {
      const plans = readJson("harness/out/01-prd.json").plans ?? [];
      if (!fs.existsSync(p(".next/BUILD_ID"))) return ["빌드 결과가 없어요. G4(build)를 먼저 통과해야 해요"];
      const errs = [];
      const port = 3100;
      const base = `http://localhost:${port}`;
      const server = spawn("npx", ["next", "start", "-p", String(port)], {
        cwd: ROOT, shell: true, stdio: "ignore", detached: process.platform !== "win32",
      });
      try {
        await waitFor(`${base}/plans`);
        const list = await (await fetch(`${base}/plans`)).text();
        const cards = byTestId(list, "plan-card");
        if (cards.length !== plans.length) errs.push(`요금제 목록에서 plan-card가 ${plans.length}개여야 하는데 ${cards.length}개예요`);
        for (const card of cards) {
          const id = attr(card.open, "data-plan-id");
          const plan = plans.find((x) => x.id === id);
          if (!plan) errs.push(`요금제 목록 카드의 data-plan-id(${id ?? "없음"})가 01-prd.json에 없어요`);
          else checkPriceRegion(`요금제 목록 카드 ${id}`, card, plan, errs);
        }
        for (const plan of plans) {
          const res = await fetch(`${base}/plans/${plan.id}`);
          if (res.status !== 200) {
            errs.push(`요금제 상세 /plans/${plan.id}가 열리지 않아요(상태 ${res.status})`);
            continue;
          }
          const areas = byTestId(await res.text(), "price-area");
          if (areas.length !== 1) errs.push(`요금제 상세 ${plan.id}에서 price-area가 1개여야 하는데 ${areas.length}개예요`);
          else checkPriceRegion(`요금제 상세 ${plan.id} 가격 영역`, areas[0], plan, errs);
        }
      } finally {
        if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
        else try { process.kill(-server.pid); } catch {}
      }
      return errs;
    },
  },
};

// ★ R1 "어기면 안 되는 것": 금액 ≤2개, 할인 종료 후 금액은 할인 있는 요금제에만, 취소선 0개
function checkPriceRegion(label, region, plan, errs) {
  const text = region.inner.replace(/<[^>]*>/g, "");
  const prices = text.match(/\d{1,3}(?:,\d{3})+\s*원/g) ?? [];
  if (prices.length > 2) errs.push(`${label}: 금액이 ${prices.length}개예요(최대 2개) — ${prices.join(", ")}`);
  const hasAfter = byTestId(region.html, "price-after").length > 0;
  const shouldAfter = plan.price_after_discount != null;
  if (hasAfter && !shouldAfter) errs.push(`${label}: 할인이 없는 요금제인데 할인 종료 후 금액이 있어요`);
  if (!hasAfter && shouldAfter) errs.push(`${label}: 할인이 있는 요금제인데 할인 종료 후 금액(price-after)이 없어요`);
  const strikes = region.html.match(/<s[\s>]|<del[\s>]|line-through/g) ?? [];
  if (strikes.length) errs.push(`${label}: 취소선이 ${strikes.length}개 있어요(0개여야 해요)`);
}

// data-testid="id"인 요소를 여는 태그부터 닫는 태그까지 찾는다.
function byTestId(html, id) {
  const out = [];
  const open = new RegExp(`<([a-zA-Z][\\w-]*)\\b[^>]*\\bdata-testid="${id}"[^>]*>`, "g");
  let m;
  while ((m = open.exec(html))) {
    if (m[0].endsWith("/>")) {
      out.push({ open: m[0], inner: "", html: m[0] });
      continue;
    }
    const tag = new RegExp(`<(/?)${m[1]}\\b[^>]*?(/?)>`, "g");
    tag.lastIndex = open.lastIndex;
    let depth = 1, t, innerEnd = html.length, end = html.length;
    while ((t = tag.exec(html))) {
      if (t[2] === "/") continue;
      depth += t[1] ? -1 : 1;
      if (depth === 0) { innerEnd = t.index; end = tag.lastIndex; break; }
    }
    out.push({ open: m[0], inner: html.slice(open.lastIndex, innerEnd), html: html.slice(m.index, end) });
  }
  return out;
}

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

async function waitFor(url, ms = 60000) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try { if ((await fetch(url)).status < 500) return; } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`서버(${url})가 ${ms / 1000}초 안에 뜨지 않았어요`);
}

// ---- 실행 ----
const ORDER = ["1", "2", "3", "scan", "4", "5"];
const args = process.argv.slice(2);
const all = args.length === 0 || args.includes("all");
const ids = all ? ORDER : args;
const results = [];

for (const id of ids) {
  const g = GATES[id];
  if (!g) {
    console.error(`알 수 없는 게이트: ${id} (가능: ${ORDER.join(", ")}, all)`);
    process.exit(2);
  }
  if (id === "5" && results.find((r) => r.id === "4" && !r.ok)) {
    results.push({ id, g, ok: false, skipped: true, errs: [{ msg: "G4가 실패해서 건너뛰었어요", back: g.back }] });
    continue;
  }
  let errs;
  try { errs = await g.run(); } catch (e) { errs = [e.message]; }
  errs = errs.map((e) => (typeof e === "string" ? { msg: e, back: g.back } : e));
  results.push({ id, g, ok: errs.length === 0, errs });
}

for (const r of results) {
  const backs = [...new Set(r.errs.map((e) => e.back))].join("·");
  console.log(r.ok ? `✅ ${r.g.title} — 통과` : `${r.skipped ? "⏭" : "❌"} ${r.g.title} — ${r.skipped ? "건너뜀" : `실패 ${r.errs.length}건`} → ${backs} 단계로 돌아가요`);
  for (const e of r.errs.slice(0, 30)) console.log(`   - ${e.msg}`);
}

if (all) {
  const L = [
    "# 검증 보고서",
    "",
    `> ${new Date().toLocaleString("ko-KR")} · \`node harness/scripts/gate.mjs all\`이 자동으로 쓴 파일이에요.`,
    "",
    "| 게이트 | 결과 | 막는 것 | 돌아갈 단계 |",
    "|---|---|---|---|",
    ...results.map((r) => `| ${r.g.title} | ${r.ok ? "✅ 통과" : r.skipped ? "⏭ 건너뜀" : `❌ 실패 ${r.errs.length}건`} | ${r.g.blocks} | ${r.ok ? "-" : [...new Set(r.errs.map((e) => e.back))].join("·")} |`),
    "",
  ];
  for (const r of results.filter((x) => !x.ok)) {
    L.push(`## ${r.g.title}`, "", ...r.errs.map((e) => `- ${e.msg.replace(/\n/g, "\n  ")}`), "");
  }
  fs.mkdirSync(p("harness/out"), { recursive: true });
  fs.writeFileSync(p("harness/out/05-verify.md"), L.join("\n"));
  console.log("\nharness/out/05-verify.md를 썼어요.");
}

process.exit(results.every((r) => r.ok) ? 0 : 1);

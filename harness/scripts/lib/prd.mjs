// docs/PRD.md에서 판정에 필요한 표 두 개(요금제 데이터, 화면 구조)를 읽는다.
// PRD가 바뀌어도 판정 기준이 따라 바뀌도록, 값은 코드에 적지 않고 매번 PRD에서 읽는다.
import { read } from "./paths.mjs";

const cells = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());

function tableAfter(lines, isHeader) {
  const i = lines.findIndex(isHeader);
  if (i < 0) return null;
  const rows = [];
  // i+1 은 |---| 구분선
  for (let j = i + 2; j < lines.length && lines[j].trim().startsWith("|"); j++) rows.push(cells(lines[j]));
  return rows;
}

const won = (s) => {
  const m = s.match(/([\d,]+)\s*원/);
  return m ? Number(m[1].replace(/,/g, "")) : null;
};

export function readPrd() {
  const lines = read("docs/PRD.md").split(/\r?\n/);

  const planRows = tableAfter(lines, (l) => /^\|\s*id\s*\|/.test(l));
  if (!planRows) throw new Error("PRD.md에서 요금제 데이터 표(| id | 이름 | …)를 찾지 못했어요.");

  const screenRows = tableAfter(lines, (l) => /^\|\s*순서\s*\|\s*화면 이름\s*\|\s*라우트/.test(l));
  if (!screenRows) throw new Error("PRD.md에서 화면 구조 표(| 순서 | 화면 이름 | 라우트 | …)를 찾지 못했어요.");

  const plans = planRows.map((r) => ({
    id: r[0],
    name: r[1],
    monthly_price: won(r[2]),
    data: r[3],
    throttle_after: /제한 없음/.test(r[4]) ? null : r[4],
    price_after_discount: /할인 없음/.test(r[5]) ? null : won(r[5]),
  }));

  const screens = screenRows.map((r) => ({ name: r[1], route: r[2].replace(/`/g, "") }));

  return { plans, screens };
}

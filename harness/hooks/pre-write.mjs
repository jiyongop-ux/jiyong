#!/usr/bin/env node
// 프로젝트 공통 PreToolUse 훅 (Write·Edit·MultiEdit·NotebookEdit 직전).
// 1) docs/·reference/ 쓰기를 막는다. 예외: docs/YYYY-MM-DD-spec.md (screen-spec 결과)
// 2) app/tokens.css 손 편집을 막는다. gen-tokens.mjs로만 만든다.
// 3) app/ 코드에 토큰 밖 값이 있으면 저장을 막는다(규칙: harness/scripts/lib/token-rules.mjs).
// 막을 때는 종료 코드 2 + 이유(stderr)를 돌려준다. Claude는 이 이유를 보고 고친다.
import fs from "node:fs";
import { p, rel } from "../scripts/lib/paths.mjs";
import { checkCode } from "../scripts/lib/token-rules.mjs";

const block = (msg) => {
  process.stderr.write(msg + "\n");
  process.exit(2);
};

const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
const ti = input.tool_input ?? {};
const file = ti.file_path ?? ti.notebook_path;
if (!file) process.exit(0);
const r = rel(file);

if (/^(docs|reference)\//.test(r)) {
  if (/^docs\/\d{4}-\d{2}-\d{2}-spec\.md$/.test(r)) process.exit(0);
  block(`[하네스] ${r}: docs/와 reference/는 읽기 전용이에요. (예외: docs/YYYY-MM-DD-spec.md)`);
}

if (r === "app/tokens.css") {
  block("[하네스] app/tokens.css는 직접 고칠 수 없어요. node harness/scripts/gen-tokens.mjs로만 만들어요.");
}

if (/^app\/.*\.(tsx?|jsx?|mjs|css)$/.test(r)) {
  const next = nextContent(input.tool_name, ti, p(r));
  if (next != null) {
    const v = checkCode(next);
    if (v.length) {
      block(
        [
          `[하네스] 토큰 밖 값이 있어서 ${r} 저장을 막았어요.`,
          ...v.slice(0, 20).map((x) => `- ${x.line}줄 ${x.rule}: ${x.hit}`),
          "app/tokens.css에 있는 클래스만 쓰세요. (고정 크기 예외: w/h/min/max/size-[22·24·40·42·48·52·64·342·358·390px])",
        ].join("\n"),
      );
    }
  }
}

process.exit(0);

// 저장된 뒤 파일 전체 내용을 만든다. 파일 전체를 검사한다.
function nextContent(tool, ti, abs) {
  if (tool === "Write") return ti.content ?? "";
  const edits = tool === "MultiEdit" ? (ti.edits ?? []) : tool === "Edit" ? [ti] : null;
  if (!edits) return null;
  let s = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : "";
  for (const e of edits) {
    if (e.old_string == null) continue;
    const to = e.new_string ?? "";
    s = e.replace_all ? s.split(e.old_string).join(to) : s.replace(e.old_string, () => to);
  }
  return s;
}

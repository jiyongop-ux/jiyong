#!/usr/bin/env node
// 에이전트별 편집 범위 훅. 에이전트 frontmatter의 PreToolUse에서 부른다.
// 사용: node harness/hooks/scope.mjs <허용 경로...> [--allow-tmp]
//   "app/"처럼 /로 끝나면 그 폴더 아래 전부, 아니면 그 파일 하나만 허용한다.
//   허용 경로가 없으면 모든 쓰기를 막는다(읽기 전용 판정자).
//   --allow-tmp: OS 임시 폴더 쓰기 허용(planner-comments 스킬의 원본 보관용).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { rel } from "../scripts/lib/paths.mjs";

const args = process.argv.slice(2);
const allowed = args.filter((a) => !a.startsWith("--"));
const allowTmp = args.includes("--allow-tmp");

const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
const ti = input.tool_input ?? {};
const file = ti.file_path ?? ti.notebook_path;
if (!file) process.exit(0);

// 8.3 짧은 이름(예: CHOJIY~1)과 긴 이름을 맞추기 위해 실제 경로로 바꾼다.
const real = (f) => {
  try { return fs.realpathSync.native(f); } catch {}
  try { return path.join(fs.realpathSync.native(path.dirname(f)), path.basename(f)); } catch {}
  return path.resolve(f);
};
const inside = (base, f) => {
  const r = path.relative(base, f);
  return r !== "" && !r.startsWith("..") && !path.isAbsolute(r);
};

const abs = real(path.resolve(file));
if (allowTmp && inside(real(os.tmpdir()), abs)) process.exit(0);

const r = rel(abs);
if (allowed.some((a) => (a.endsWith("/") ? r.startsWith(a) : r === a))) process.exit(0);

process.stderr.write(`[하네스] 이 에이전트는 ${allowed.join(", ") || "(어떤 파일도)"}만 고칠 수 있어요. 막은 파일: ${r}\n`);
process.exit(2);

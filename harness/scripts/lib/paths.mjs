// 하네스 스크립트가 함께 쓰는 경로 도우미.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 프로젝트 루트: harness/scripts/lib 에서 세 단계 위
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

export const p = (...parts) => path.join(ROOT, ...parts);

// 프로젝트 루트 기준 상대 경로(슬래시 구분). 루트 밖이면 "../"로 시작한다.
export const rel = (file) => path.relative(ROOT, path.resolve(ROOT, file)).split(path.sep).join("/");

export const read = (file) => fs.readFileSync(p(file), "utf8");

export function readJson(file) {
  if (!fs.existsSync(p(file))) throw new Error(`${file} 파일이 없어요.`);
  return JSON.parse(read(file));
}

// 오늘 날짜(로컬) YYYY-MM-DD
export function today() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

// dir 아래 파일을 루트 기준 상대 경로로 모두 돌려준다.
export function walk(dir) {
  const abs = p(dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
    const r = `${dir}/${e.name}`;
    return e.isDirectory() ? walk(r) : [r];
  });
}

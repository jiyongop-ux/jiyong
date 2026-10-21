// 토큰 밖 값 검사 규칙. 훅(harness/hooks/pre-write.mjs)과 판정 스크립트(gate.mjs scan)가 같이 쓴다.
// 허용 값은 docs/tokens.json에서 읽는다(SSOT). 예외는 Design.md 고정 크기 하나뿐이다.
import { read } from "./paths.mjs";

const tokens = JSON.parse(read("docs/tokens.json"));
const suffix = (key) => key.split("/").pop();

export const SPACING = new Set(Object.values(tokens.spacing).map(String));
export const RADIUS = new Set(Object.keys(tokens.radius).map(suffix));

// Design.md에 적힌 컴포넌트 고정 크기(px): 화면 폭 390, 콘텐츠 폭 342·358, 버튼 높이 40·42·48·52,
// 선택 표시 22, 아이콘 24·64. 너비·높이 임의값에서만 허용한다.
export const FIXED_SIZES = new Set(["22", "24", "40", "42", "48", "52", "64", "342", "358", "390"]);
const SIZE_UTILS = new Set(["w", "h", "min-w", "min-h", "max-w", "max-h", "size"]);

// 클래스 앞에 올 수 있는 글자(시작, 공백, 따옴표, 백틱, 변형의 콜론, 괄호)
const B = String.raw`(?<=^|[\s"'\x60:{(])`;

const COLOR_UTILS = "bg|text|border|border-[trblxy]|ring|ring-offset|fill|stroke|from|via|to|outline|divide|placeholder|decoration|accent|caret|shadow";
const PALETTE = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white";
const SPACE_UTILS = "space-x|space-y|gap-x|gap-y|inset-x|inset-y|translate-x|translate-y|min-w|min-h|max-w|max-h|gap|inset|size|top|right|bottom|left|start|end|px|py|pt|pr|pb|pl|ps|pe|mx|my|mt|mr|mb|ml|ms|me|p|m|w|h";

const RE = {
  arbitrary: /([a-z][\w:-]*)-\[([^\]]+)\]|(?<![\w-])\[([a-z-]+:[^\]]+)\]/g,
  hex: /(?<![\w&])#[0-9a-fA-F]{3,8}(?![\w-])/g,
  colorFn: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g,
  px: /\b\d+(?:\.\d+)?px\b/g,
  palette: new RegExp(`${B}-?(?:${COLOR_UTILS})-(?:${PALETTE})(?:-\\d{2,3})?(?:\\/\\d+)?(?![\\w-])`, "g"),
  textSize: new RegExp(`${B}text-(?:xs|sm|base|lg|xl|[2-9]xl)(?![\\w-])`, "g"),
  spacing: new RegExp(`${B}-?(${SPACE_UTILS})-(\\d+(?:\\.\\d+)?)(?![\\w./%-])`, "g"),
  radius: new RegExp(`${B}rounded(?:-(?:tl|tr|br|bl|ss|se|es|ee|t|r|b|l|s|e))?(?:-([\\w.]+))?(?![\\w-])`, "g"),
  typeSolo: new RegExp(`${B}(?:leading-[\\w.]+|font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\\d{3}))(?![\\w-])`, "g"),
  styleProp: /\b(?:fontWeight|lineHeight)\s*:/g,
};

export const RULES = {
  arbitrary: "① 임의값 클래스",
  color: "② 색·px 직접 값",
  palette: "③ Tailwind 기본 색·글자 크기",
  spacing: "④ 토큰 밖 간격",
  radius: "⑤ 토큰 밖 모서리",
  type: "⑥ 줄 간격·굵기 단독 지정",
};

// text 안의 위반을 [{ line, rule, hit }]로 돌려준다.
export function checkCode(text) {
  const out = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = i + 1;
    const add = (rule, hit) => out.push({ line, rule: RULES[rule], hit });

    // ① 임의값: 고정 크기 예외만 통과시키고, 통과한 것은 지운 뒤 나머지 규칙을 본다.
    let s = raw.replace(RE.arbitrary, (m, util, value, prop) => {
      if (prop) return add("arbitrary", m), " ";
      const name = util.split(":").pop().replace(/^-/, "");
      const px = value.match(/^(\d+)px$/);
      if (SIZE_UTILS.has(name) && px && FIXED_SIZES.has(px[1])) return " ";
      add("arbitrary", m);
      return " ";
    });

    for (const m of s.matchAll(RE.hex)) add("color", m[0]);
    for (const m of s.matchAll(RE.colorFn)) add("color", m[0]);
    for (const m of s.matchAll(RE.px)) add("color", m[0]);
    for (const m of s.matchAll(RE.palette)) add("palette", m[0]);
    for (const m of s.matchAll(RE.textSize)) add("palette", m[0]);
    for (const m of s.matchAll(RE.spacing)) if (!SPACING.has(m[2])) add("spacing", m[0]);
    for (const m of s.matchAll(RE.radius)) if (m[1] === undefined || !RADIUS.has(m[1])) add("radius", m[0]);
    for (const m of s.matchAll(RE.typeSolo)) add("type", m[0]);
    for (const m of s.matchAll(RE.styleProp)) add("type", m[0]);
  });
  return out;
}

export const formatViolations = (file, list) => list.map((v) => `${file}:${v.line} ${v.rule} "${v.hit}"`);

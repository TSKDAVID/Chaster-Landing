// Enforces the copy slot limits (DESIGN-GUIDELINES §1.15) and the typography rules (§1.7, §1.15) on ka + en.
// Run: node --no-warnings scripts/check-copy.ts
import { CHAT_LIMITS, LIMITS } from "../src/content/limits.ts";
import { en } from "../src/content/en.ts";
import { ka } from "../src/content/ka.ts";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

// same defaults the pages use; tokens are resolved before measuring
const SAMPLE: Record<string, string> = { days: "14", from: "20 ₾", min: "10", name: "კატალოგი", n: "10" };
const fill = (s: string) => s.replace(/\{(\w+)\}/g, (m, k: string) => SAMPLE[k] ?? m);

function flatten(v: Json, prefix = "", out: [string, string][] = []): [string, string][] {
  if (typeof v === "string") out.push([prefix, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => flatten(x, prefix ? `${prefix}.${i}` : String(i), out));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) flatten(x, prefix ? `${prefix}.${k}` : k, out);
  return out;
}

function limitFor(path: string): number | undefined {
  const parts = path.split(".");
  let best: { limit: number; wild: number } | undefined;
  for (const [pattern, limit] of Object.entries(LIMITS)) {
    const pp = pattern.split(".");
    if (pp.length !== parts.length) continue;
    let wild = 0;
    const ok = pp.every((seg, i) => {
      if (seg === "*") {
        wild++;
        return true;
      }
      return seg === parts[i];
    });
    if (ok && (!best || wild < best.wild)) best = { limit, wild };
  }
  return best?.limit;
}

const EMOJI = /\p{Extended_Pictographic}/u;
let problems = 0;
const report = (locale: string, path: string, msg: string) => {
  problems++;
  console.log(`  ${locale}  ${path}  ${msg}`);
};

for (const [locale, copy] of [["ka", ka], ["en", en]] as const) {
  console.log(`\n${locale}`);
  const flat = flatten(copy as unknown as Json);
  let measured = 0;
  for (const [path, raw] of flat) {
    const text = fill(raw);
    const limit = limitFor(path);
    if (limit !== undefined) {
      measured++;
      if (text.length > limit) report(locale, path, `${text.length} > ${limit}  "${text}"`);
    }
    // typography rules
    if (path.startsWith("legal")) continue;
    if (/!/.test(text)) report(locale, path, `exclamation mark: "${text}"`);
    if (EMOJI.test(text)) report(locale, path, `emoji: "${text}"`);
    if (locale === "ka" && /["']/.test(text)) report(locale, path, `straight quote in Georgian (use „ “): "${text}"`);
    if (locale === "ka" && /[\u10D0-\u10FF][\u2000-\u200A]?\s{2,}/.test(text)) report(locale, path, `double space: "${text}"`);
    // hype words banned in §1.15 (Georgian)
    if (locale === "ka" && /(რევოლუციური|ინოვაციური|უნიკალური|ჭკვიანი გადაწყვეტა)/.test(text)) report(locale, path, `banned hype word: "${text}"`);
  }

  // chat messages in hero threads: per-speaker limits; results limited via LIMITS
  for (const [type, thread] of Object.entries(copy.hero.threads)) {
    thread.messages.forEach((m, i) => {
      measured++;
      const limit = CHAT_LIMITS[m.from];
      if (m.text.length > limit) report(locale, `hero.threads.${type}.messages.${i}.text`, `${m.text.length} > ${limit} (${m.from})  "${m.text}"`);
    });
    if (thread.messages.length < 2 || thread.messages.length > 5) report(locale, `hero.threads.${type}.messages`, `${thread.messages.length} messages (want 2-5)`);
    if (thread.messages[0].from !== "customer") report(locale, `hero.threads.${type}.messages.0`, "first message must be the customer's");
  }

  // structural counts from the spec
  if (copy.faq.items.length !== 8) report(locale, "faq.items", `${copy.faq.items.length} items (want 8)`);
  if (copy.rules.items.length !== 7) report(locale, "rules.items", `${copy.rules.items.length} rules (want 7)`);
  if (copy.desk.callouts.length !== 3) report(locale, "desk.callouts", `${copy.desk.callouts.length} callouts (want 3)`);
  if (copy.setup.steps.length !== 5) report(locale, "setup.steps", `${copy.setup.steps.length} steps (want 5)`);

  console.log(`  ${measured} slots measured, ${flat.length} strings scanned`);
}

// English must not be wider than the slot's Georgian limit; the same limits apply, so a clean run covers it.
if (problems) {
  console.error(`\n${problems} problem(s)`);
  process.exit(1);
}
console.log("\nCopy OK.");

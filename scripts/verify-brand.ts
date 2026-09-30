// Proves that the generated mark geometry is identical to the brand kit (DESIGN-GUIDELINES §1.13: "Mark").
// Run: node scripts/verify-brand.ts   (Node 24 strips the types natively)
import { markRingPath, markSignalPath, markWhitePath } from "../src/brand/geometry.ts";
import { KIT_REFERENCE, LOCKUP_CUSTOM_R, LOCKUP_STANDARD } from "../src/brand/lockups.generated.ts";

let failed = 0;
const check = (name: string, got: string, want: string) => {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) {
    let i = 0;
    while (i < got.length && got[i] === want[i]) i++;
    console.log(`      first difference at char ${i}\n      got : …${got.slice(Math.max(0, i - 30), i + 40)}\n      want: …${want.slice(Math.max(0, i - 30), i + 40)}`);
  }
};

check("six white cells == kit symbol (dark)", markWhitePath(), KIT_REFERENCE.darkWhite);
check("signal cell == kit symbol (dark)", markSignalPath(), KIT_REFERENCE.darkSignal);
check("six white cells + outline slot == kit symbol (mono)", markWhitePath() + markRingPath([2, 0]), KIT_REFERENCE.monoAll);
check("lockup standard mark white == kit", markWhitePath(), LOCKUP_STANDARD.markWhiteD);
check("lockup standard mark signal == kit", markSignalPath(), LOCKUP_STANDARD.markSignalD);
check("lockup custom-r mark white == kit", markWhitePath(), LOCKUP_CUSTOM_R.markWhiteD);
check("lockup custom-r mark signal == kit", markSignalPath(), LOCKUP_CUSTOM_R.markSignalD);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nBrand geometry matches the kit.");

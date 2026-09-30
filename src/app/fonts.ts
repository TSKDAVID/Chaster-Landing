import localFont from "next/font/local";

/**
 * Chaster Sans = the FiraGO subset from design/tools/build_fonts.py (Georgian, Latin, ₾; ~23 KB per weight).
 *
 * §2.2 asks to preload SemiBold only, because the H1 (the LCP element) uses it. `next/font/local` has a `preload` flag
 * per call but not per weight, so the weights are split across two calls:
 *   --ff-semibold  600, preloaded        used by headings, <strong> and the primary CTA (`.fw6`)
 *   --ff-text      400 + 500, not preloaded   used by everything else
 * They are deliberately different families (a family list can't pick by weight), so any element set in 600 must
 * switch to `--ff-semibold`; globals.css does that for h1-h4, strong, b and the `.fw6` utility.
 * `adjustFontFallback` gives each a metric-matched Arial fallback so the swap causes almost no layout shift.
 */
export const semibold = localFont({
  src: [{ path: "../fonts/chaster-sans-600.woff2", weight: "600", style: "normal" }],
  variable: "--ff-semibold",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const text = localFont({
  src: [
    { path: "../fonts/chaster-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/chaster-sans-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--ff-text",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
});

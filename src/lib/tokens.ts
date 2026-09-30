import { formatPrice, pricing } from "@/config/pricing";
import { SETUP_MINUTES } from "@/config/site";

/** Resolve {days} {from} {min} (and any extras) so numbers in copy can never drift from the config. */
export function fillTokens(text: string, extra: Record<string, string | number> = {}): string {
  const tokens: Record<string, string | number> = {
    days: pricing.trialDays,
    from: formatPrice(pricing.base.monthly),
    min: SETUP_MINUTES,
    ...extra,
  };
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in tokens ? String(tokens[k]) : m));
}

/** Typography rules from §1.7 that every string must obey, applied once when copy loads. */
export function typo(text: string): string {
  return text.replace(/(\d) ₾/g, "$1\u00A0₾"); // a price never breaks before the lari sign
}

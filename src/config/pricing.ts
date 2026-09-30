import type { AddonId, ModuleId } from "./modules";

/**
 * Single source for the builder, the JSON-LD offer and FAQ price answers (DESIGN-GUIDELINES §1.14).
 * All placeholders render exactly like real prices so the layout is tested with them.
 */
export const pricing = {
  currency: "GEL",
  base: {
    monthly: 20, // from the owner: "from 20 ₾". OWNER: confirm what the base includes.
    includes: ["inbox", "knowledge", "hours"] as readonly ModuleId[],
  },
  trialDays: 14, // PLACEHOLDER (OWNER)
  addons: {
    catalog: { monthly: 10, requires: null }, // PLACEHOLDER (OWNER)
    media: { monthly: 5, requires: "catalog" }, // PLACEHOLDER (OWNER)
    bookings: { monthly: 15, requires: null }, // PLACEHOLDER (OWNER)
    resources: { monthly: 10, requires: "bookings" }, // PLACEHOLDER (OWNER)
  } as const satisfies Record<AddonId, { monthly: number; requires: AddonId | null }>,
  vatIncluded: true, // PLACEHOLDER (OWNER)
} as const;

export function planTotal(addons: readonly AddonId[]): number {
  return addons.reduce<number>((sum, id) => sum + pricing.addons[id].monthly, pricing.base.monthly);
}

/** `20 ₾` with a non-breaking space, as required by §1.7. */
export const formatPrice = (n: number): string => `${n}\u00A0₾`;

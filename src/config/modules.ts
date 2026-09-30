/** Modules, dependencies, business types and presets (DESIGN-GUIDELINES §1.1, §1.11, §1.14). */

export const MODULE_IDS = [
  "inbox",
  "knowledge",
  "hours",
  "catalog",
  "media",
  "bookings",
  "resources",
] as const;
export type ModuleId = (typeof MODULE_IDS)[number];

export const CORE_MODULES = ["inbox", "knowledge", "hours"] as const satisfies readonly ModuleId[];
export const ADDON_MODULES = ["catalog", "media", "bookings", "resources"] as const satisfies readonly ModuleId[];
export type AddonId = (typeof ADDON_MODULES)[number];

/** Verified in the product code: media sends catalog photos; resources only activate once bookings exist. */
export const REQUIRES: Readonly<Partial<Record<AddonId, AddonId>>> = {
  media: "catalog",
  resources: "bookings",
};

/** Signal tokens: the colour of the one coloured cell. `missed` is a state, not a module. */
export type SignalId = ModuleId | "missed";
export const signalVar = (id: SignalId): string => `var(--sig-${id})`;

export const BUSINESS_TYPES = ["shop", "beauty", "stay", "food", "clinic", "other"] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];
export const DEFAULT_BUSINESS_TYPE: BusinessType = "shop"; // „ფასი?“ is the ad's hook

export const isBusinessType = (v: unknown): v is BusinessType =>
  typeof v === "string" && (BUSINESS_TYPES as readonly string[]).includes(v);

/** Preset add-ons per business type (§1.11). */
export const PRESETS: Readonly<Record<BusinessType, readonly AddonId[]>> = {
  shop: ["catalog", "media"],
  beauty: ["bookings", "resources"],
  stay: ["bookings", "resources", "catalog", "media"],
  food: ["bookings", "catalog"],
  clinic: ["bookings", "resources"],
  other: [],
};

/**
 * Toggle an add-on, applying dependencies in both directions.
 * Returns the new set and which dependency (if any) moved, so the UI can announce it.
 */
export function toggleAddon(
  current: readonly AddonId[],
  id: AddonId,
): { next: AddonId[]; dep: { id: AddonId; on: boolean } | null } {
  const set = new Set<AddonId>(current);
  let dep: { id: AddonId; on: boolean } | null = null;
  if (set.has(id)) {
    set.delete(id);
    // turning a prerequisite off also turns its dependants off
    for (const [child, parent] of Object.entries(REQUIRES) as [AddonId, AddonId][]) {
      if (parent === id && set.has(child)) {
        set.delete(child);
        dep = { id: child, on: false };
      }
    }
  } else {
    set.add(id);
    const parent = REQUIRES[id];
    if (parent && !set.has(parent)) {
      set.add(parent);
      dep = { id: parent, on: true };
    }
  }
  // stable, grid order
  return { next: ADDON_MODULES.filter((m) => set.has(m)), dep };
}

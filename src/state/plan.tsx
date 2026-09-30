"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { PRESETS, toggleAddon, type AddonId } from "@/config/modules";
import { planTotal } from "@/config/pricing";
import { connectUrl, type Locale } from "@/config/site";
import { track } from "@/lib/analytics";
import { useBusinessType } from "./business-type";

type Ctx = {
  addons: readonly AddonId[];
  /** True once the visitor edits modules by hand; from then on changing the business type no longer overwrites the plan. */
  dirty: boolean;
  total: number;
  toggle: (id: AddonId) => void;
  /** The last dependency that moved on its own, for the aria-live announcement. `n` makes repeats announce again. */
  announce: { id: AddonId; on: boolean; n: number } | null;
  /** Connect URL carrying the plan and business type (§1.11). */
  href: string;
};
const PlanContext = createContext<Ctx | null>(null);

export function PlanProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const { type } = useBusinessType();
  // `null` = untouched, follow the preset. No effect needed: the plan is derived.
  const [custom, setCustom] = useState<AddonId[] | null>(null);
  const [announce, setAnnounce] = useState<Ctx["announce"]>(null);

  const addons = custom ?? PRESETS[type];

  const toggle = useCallback(
    (id: AddonId) => {
      const { next, dep } = toggleAddon(addons, id);
      setCustom(next);
      setAnnounce(dep ? { id: dep.id, on: dep.on, n: (announce?.n ?? 0) + 1 } : null);
      track("module_toggle", { module: id, on: next.includes(id) });
    },
    [addons, announce],
  );

  const value = useMemo<Ctx>(
    () => ({
      addons,
      dirty: custom !== null,
      total: planTotal(addons),
      toggle,
      announce,
      href: connectUrl({ modules: addons, businessType: type, locale }),
    }),
    [addons, custom, toggle, announce, type, locale],
  );
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): Ctx {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside <PlanProvider>");
  return ctx;
}

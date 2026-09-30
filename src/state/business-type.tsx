"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_BUSINESS_TYPE, isBusinessType, type BusinessType } from "@/config/modules";
import { track } from "@/lib/analytics";

type Ctx = { type: BusinessType; setType: (t: BusinessType) => void };
const BusinessTypeContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "ch_for";

/**
 * `businessType` (§1.11): read from `?for=` (so an ad can deep-link a segment), then sessionStorage, then the default.
 * The page is statically rendered with the default; a deep link swaps the demo thread once, right after hydration,
 * before the thread has started playing.
 */
export function BusinessTypeProvider({ children }: { children: React.ReactNode }) {
  const [type, setTypeState] = useState<BusinessType>(DEFAULT_BUSINESS_TYPE);

  useEffect(() => {
    let next: BusinessType | null = null;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("for");
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (isBusinessType(fromUrl)) {
        next = fromUrl;
        window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
      } else if (isBusinessType(stored)) next = stored;
    } catch {
      /* storage blocked: stay on the default */
    }
    // a one-time sync from an external source (URL + storage) that does not exist during static rendering
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (next && next !== DEFAULT_BUSINESS_TYPE) setTypeState(next);
  }, []);

  const setType = useCallback((t: BusinessType) => {
    setTypeState(t);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
    track("type_tab_change", { type: t });
  }, []);

  const value = useMemo(() => ({ type, setType }), [type, setType]);
  return <BusinessTypeContext.Provider value={value}>{children}</BusinessTypeContext.Provider>;
}

export function useBusinessType(): Ctx {
  const ctx = useContext(BusinessTypeContext);
  if (!ctx) throw new Error("useBusinessType must be used inside <BusinessTypeProvider>");
  return ctx;
}

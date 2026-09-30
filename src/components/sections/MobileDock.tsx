"use client";

import { useEffect, useState } from "react";
import { CORE_MODULES, MODULE_IDS, type AddonId, type ModuleId } from "@/config/modules";
import { formatPrice } from "@/config/pricing";
import type { Copy } from "@/content";
import { usePlan } from "@/state/plan";
import { Cell } from "../cell/Cell";
import { CtaButton } from "../ui/CtaButton";

/**
 * The global mobile dock (§1.12): thumb-zone CTA that appears once the hero CTA has scrolled away. Inside S5 it becomes
 * the plan dock (strip, price, CTA), because the plan panel doesn't exist on mobile; inside S8 it hides, since the final
 * call is already the whole screen. Respects the in-app browser's safe area.
 */
export function MobileDock({ copy }: { copy: Copy }) {
  const { addons, total, dirty } = usePlan();
  const [ctaOut, setCtaOut] = useState(false);
  const [inBuild, setInBuild] = useState(false);
  const [inFinal, setInFinal] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const watch = (id: string, cb: (e: IntersectionObserverEntry) => void) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(([e]) => cb(e));
      io.observe(el);
      observers.push(io);
    };
    // "out" means scrolled past (above the viewport), not merely not yet reached
    watch("hero-cta", (e) => setCtaOut(!e.isIntersecting && e.boundingClientRect.top < 0));
    watch("build", (e) => setInBuild(e.isIntersecting));
    watch("final", (e) => setInFinal(e.isIntersecting));
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const mode = inFinal ? "hidden" : inBuild ? "plan" : ctaOut ? "cta" : "hidden";
  const showPrice = mode === "plan" || (mode === "cta" && dirty);
  const inPlan = MODULE_IDS.filter((id) => (CORE_MODULES as readonly ModuleId[]).includes(id) || addons.includes(id as AddonId));

  return (
    <div className="dock" data-mode={mode} aria-hidden={mode === "hidden"} inert={mode === "hidden"}>
      {showPrice ? (
        <div className="dock__info">
          <div className="dock__strip" aria-hidden="true">
            {inPlan.map((id) => (
              <Cell key={id} size={10} state={{ kind: "signal", id }} />
            ))}
          </div>
          <p className="dock__price">
            <span className="tnum">{formatPrice(total)}</span> <span className="dock__per">{copy.build.plan.per}</span>
          </p>
        </div>
      ) : null}
      <CtaButton section="dock" size="md" full={!showPrice} className="dock__cta">
        {showPrice ? copy.cta.short : copy.cta.primary}
      </CtaButton>
    </div>
  );
}

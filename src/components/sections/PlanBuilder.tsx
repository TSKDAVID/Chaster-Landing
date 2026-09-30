"use client";

import { useEffect, useRef, useState } from "react";
import { ADDON_MODULES, CORE_MODULES, MODULE_IDS, REQUIRES, type AddonId, type ModuleId } from "@/config/modules";
import { formatPrice, pricing } from "@/config/pricing";
import type { Copy } from "@/content";
import { fillTokens } from "@/lib/tokens";
import { usePlan } from "@/state/plan";
import { Cell } from "../cell/Cell";
import { Mark } from "../cell/Mark";
import { Pictogram } from "../cell/Pictogram";
import { MessageRow } from "../thread/parts";
import { CellToggle } from "../ui/CellToggle";
import { CtaButton } from "../ui/CtaButton";
import { TypeTabs } from "../ui/TypeTabs";

/** Which `build.dep.*` message explains a dependency that moved by itself. */
const DEP_KEY: Record<AddonId, "media" | "resources"> = {
  catalog: "media",
  media: "media",
  bookings: "resources",
  resources: "resources",
};

/**
 * S5: modules and price in one section (§1.12). Modules are flat rows, not cards. The preset for the active business
 * type is applied on load, so the total, the plan strip and the CTA are meaningful before the visitor touches anything:
 * configuring is optional play, never required work (zero-interaction rule).
 */
export function PlanBuilder({ copy }: { copy: Copy }) {
  const b = copy.build;
  const { addons, total, toggle, announce } = usePlan();
  const [preview, setPreview] = useState<ModuleId | null>(null);
  const [touched, setTouched] = useState<ModuleId | null>(null);
  const [open, setOpen] = useState<ModuleId | null>(null);
  const touchTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (touchTimer.current) window.clearTimeout(touchTimer.current);
    },
    [],
  );

  const flash = (id: ModuleId) => {
    setTouched(id);
    if (touchTimer.current) window.clearTimeout(touchTimer.current);
    touchTimer.current = window.setTimeout(() => setTouched(null), 1600); // returns to lavender when idle
  };

  const onToggle = (id: AddonId) => {
    const turningOn = !addons.includes(id);
    toggle(id);
    flash(id);
    if (turningOn) setOpen(id); // show what the customer will see
  };

  const depText = announce
    ? b.dep[DEP_KEY[announce.id]][announce.on ? "on" : "off"]
    : "";

  const inPlan = MODULE_IDS.filter((id) => (CORE_MODULES as readonly ModuleId[]).includes(id) || addons.includes(id as AddonId));

  return (
    <section id="build" aria-labelledby="build-h2" className="surface-paper sec sec--standard sec--paper-top">
      <div className="wrap">
        <div className="build__head lg:grid lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8">
          <h2 id="build-h2" className="t-h2 lg:col-span-4">
            {b.h2}
          </h2>
          <p className="t-lead build__lead lg:col-span-3">{b.lead}</p>
        </div>

        <div className="lg:grid lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8">
          <div className="build__list lg:col-span-4">
            <TypeTabs labels={copy.types} className="build__tabs" />

            <div className="build__group">
              <div className="build__group-head">
                <h3 className="t-h3">{b.coreTitle}</h3>
                <p className="t-meta">{b.coreNote}</p>
              </div>
              <ul className="module-rows">
                {CORE_MODULES.map((id) => (
                  <li key={id} className="module-row module-row--core" data-on="true">
                    <div className="module-row__main">
                      <Pictogram id={id} cell={5} className="module-row__icon" />
                      <div className="module-row__head module-row__head--static">
                        <span className="t-h3 module-row__name">{b.modules[id].name}</span>
                        {/* the base modules are explained by the sections above, so the description is kept for screen readers
                            and the row stays compact: the add-ons, which the visitor chooses between, get the room */}
                        <span className="sr-only">{b.modules[id].line}</span>
                      </div>
                      <span className="module-row__price t-meta">{b.plan.included}</span>
                      <span className="module-row__solid">
                        <Cell size={24} state={{ kind: "signal", id }} />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="build__group">
              <div className="build__group-head">
                <h3 className="t-h3">{b.addonsTitle}</h3>
                <p className="t-meta">{b.addonsNote}</p>
              </div>
              <ul className="module-rows">
                {ADDON_MODULES.map((id) => {
                  const on = addons.includes(id);
                  const isOpen = open === id;
                  const m = b.modules[id];
                  const req = REQUIRES[id];
                  const regionId = `ex-${id}`;
                  return (
                    <li key={id} className="module-row" data-on={on} data-open={isOpen}>
                      <div className="module-row__main">
                        <Pictogram id={id} cell={5} className="module-row__icon" />
                        <button
                          type="button"
                          className="module-row__head"
                          aria-expanded={isOpen}
                          aria-controls={regionId}
                          onClick={() => setOpen(isOpen ? null : id)}
                        >
                          <span className="t-h3 module-row__name">{m.name}</span>
                          <span className="module-row__line">{m.line}</span>
                          {req ? (
                            <span className="t-meta module-row__needs">
                              {fillTokens(b.needs, { name: b.modules[req].name })}
                            </span>
                          ) : null}
                        </button>
                        <span className="module-row__price tnum">+{formatPrice(pricing.addons[id].monthly)}</span>
                        <CellToggle
                          module={id}
                          label={m.name}
                          checked={on}
                          onChange={() => onToggle(id)}
                          onPreview={setPreview}
                        />
                      </div>
                      <div id={regionId} role="region" aria-label={m.name} hidden={!isOpen} className="module-row__example">
                        <p className="t-meta module-row__example-label">{b.example}</p>
                        <div className="module-row__convo">
                          <MessageRow msg={{ from: "customer", text: m.q, time: "" }} />
                          <MessageRow
                            msg={{ from: "chaster", text: m.a, time: "", photo: id === "media" }}
                            photoLabel={copy.ui.photo}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* announces why a prerequisite moved; always present so the page never shifts */}
              <p className="build__dep t-meta" aria-live="polite">
                {depText}
              </p>
            </div>
          </div>

          <aside className="ticket-wrap lg:col-span-3" aria-label={b.plan.title}>
            <div className="ticket">
              <div className="ticket__top">
                <Mark size={64} signal={preview ?? touched ?? undefined} />
                <p className="ticket__title">{b.plan.title}</p>
              </div>
              <div className="plan-strip" role="img" aria-label={`${b.plan.stripLabel}: ${inPlan.map((id) => b.modules[id].name).join(", ")}`}>
                {inPlan.map((id) => (
                  <Cell key={id} size={14} state={{ kind: "signal", id }} />
                ))}
              </div>
              <p className="ticket__price" aria-live="polite" aria-atomic="true">
                <span className="price tnum">{formatPrice(total)}</span>
                <span className="ticket__per">{b.plan.per}</span>
              </p>
              <p className="ticket__trial">{fillTokens(b.plan.trial)}</p>
              <CtaButton section="plan" full>
                {copy.cta.primary}
              </CtaButton>
              <p className="t-meta ticket__reassure">{b.plan.reassure}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

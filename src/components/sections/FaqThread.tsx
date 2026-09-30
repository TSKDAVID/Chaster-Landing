"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import type { Copy } from "@/content";
import { track } from "@/lib/analytics";
import { TypingCells } from "../thread/parts";
import { ArrowRight } from "../ui/Icons";

type Phase = "typing" | "open";

/**
 * S7. The FAQ is the Knowledge module at work (§1.12): each question is an incoming bubble and its answer an outgoing
 * bubble from Chaster, revealed with the Type motion. A disclosure pattern underneath (`button` + `aria-expanded` +
 * `aria-controls`), several answers can be open at once, and there are no chevrons.
 */
export function FaqThread({ copy }: { copy: Copy }) {
  const f = copy.faq;
  const [phase, setPhase] = useState<Record<number, Phase>>({});
  const timers = useRef<Record<number, number>>({});

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach((id) => window.clearTimeout(id));
  }, []);

  const toggle = (i: number) => {
    if (phase[i]) {
      window.clearTimeout(timers.current[i]);
      setPhase((p) => {
        const next = { ...p };
        delete next[i];
        return next;
      });
      return;
    }
    track("faq_open", { index: i });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase((p) => ({ ...p, [i]: "open" }));
      return;
    }
    setPhase((p) => ({ ...p, [i]: "typing" }));
    timers.current[i] = window.setTimeout(() => setPhase((p) => ({ ...p, [i]: "open" })), 650);
  };

  return (
    <section id="faq" aria-labelledby="faq-h2" className="surface-paper sec sec--standard">
      <div className="wrap lg:grid lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8">
        <div className="lg:col-span-2">
          <h2 id="faq-h2" className="t-h2">
            {f.h2}
          </h2>
          <p className="t-lead faq__lead">{f.lead}</p>
          <a
            href={site.messengerUrl}
            target="_blank"
            rel="noopener"
            className="text-link faq__alt"
            data-track="demo_click"
            data-section="faq"
          >
            {f.alt}
            <ArrowRight size={16} />
          </a>
        </div>

        <ul className="faq lg:col-start-3 lg:col-span-4">
          {f.items.map((it, i) => {
            const ph = phase[i];
            const open = Boolean(ph);
            return (
              <li key={it.q} className="faq-item" data-phase={ph ?? "closed"}>
                <button
                  id={`faq-q-${i}`}
                  type="button"
                  className="faq-q"
                  aria-expanded={open}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => toggle(i)}
                >
                  {it.q}
                </button>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!open} className="faq-a">
                  {ph === "typing" ? (
                    <div className="faq-a__typing" aria-hidden="true">
                      <TypingCells />
                    </div>
                  ) : (
                    <div className="faq-a__bubble">{it.a}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

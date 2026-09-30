"use client";

import { useRef } from "react";
import { BUSINESS_TYPES } from "@/config/modules";
import type { Copy } from "@/content";
import { useBusinessType } from "@/state/business-type";
import { Cell } from "../cell/Cell";

/**
 * The business-type selector, shared by the hero and the builder (one state, §1.11). Underline tabs; the active one
 * gets a small signal cell before its label. Implemented as a radio group (arrow keys move and select), because the
 * choice changes content in two places rather than swapping one panel.
 */
export function TypeTabs({ labels, className = "" }: { labels: Copy["types"]; className?: string }) {
  const { type, setType } = useBusinessType();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (to: number) => {
    const i = (to + BUSINESS_TYPES.length) % BUSINESS_TYPES.length;
    setType(BUSINESS_TYPES[i]);
    refs.current[i]?.focus();
  };

  return (
    <div className={`type-tabs ${className}`}>
      <span className="type-tabs__label" id="type-tabs-label">
        {labels.label}
      </span>
      <div role="radiogroup" aria-labelledby="type-tabs-label" className="type-tabs__list">
        {BUSINESS_TYPES.map((t, i) => {
          const active = t === type;
          return (
            <button
              key={t}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              className="type-tab"
              data-active={active}
              onClick={() => setType(t)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  move(i + 1);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  move(i - 1);
                } else if (e.key === "Home") {
                  e.preventDefault();
                  move(0);
                } else if (e.key === "End") {
                  e.preventDefault();
                  move(BUSINESS_TYPES.length - 1);
                }
              }}
            >
              <span className="type-tab__cell">
                <Cell state={{ kind: "signal", id: "inbox" }} size={10} />
              </span>
              {labels[t]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

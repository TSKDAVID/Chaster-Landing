"use client";

import { useEffect, useRef } from "react";
import type { Copy } from "@/content";
import { Cell } from "../cell/Cell";
import { CellNumerals } from "../cell/CellNumerals";

/**
 * A timed list of real minutes, not "1-2-3" circles (§1.12 S4). Each row's cell fills in a discrete step (the "Tick"
 * motion, driven by scroll position, never a count-up) as the row enters the viewport. The class goes straight onto the
 * DOM node so nothing re-renders, and without JavaScript the rows simply read as done.
 */
export function SetupTimeline({
  steps,
  times,
  unit,
  clockLabel,
}: {
  steps: Copy["setup"]["steps"];
  times: readonly number[];
  unit: string;
  clockLabel: string;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const rows = ref.current?.querySelectorAll<HTMLElement>(".tl-row");
    if (!rows?.length) return;
    rows.forEach((r) => r.classList.add("tl-pending"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.remove("tl-pending");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.6 },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className="timeline">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const t = times[i];
        return (
          <li key={s.title} className="tl-row">
            <span className="tl-clock">
              <CellNumerals text={String(t)} cell={3.2} label={clockLabel.replace("{n}", String(t))} />
              <span className="tl-unit t-meta" aria-hidden="true">
                {unit}
              </span>
            </span>
            <span className="tl-cell">
              {/* outline until the row is reached, then solid; the last row takes the brand signal colour */}
              <Cell state={{ kind: "outline" }} size={18} className="tl-cell__off" />
              <Cell state={last ? { kind: "signal", id: "inbox" } : { kind: "solid" }} size={18} className="tl-cell__on" />
            </span>
            <div className="tl-text">
              <h3 className="t-h3 tl-title">{s.title}</h3>
              <p className="tl-body">{s.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

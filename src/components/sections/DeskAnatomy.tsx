"use client";

import { useState } from "react";
import type { Copy } from "@/content";
import { CellField } from "../cell/CellField";

/**
 * Who is answering. One switch, nothing else: the hero already shows a live chat, so this does not
 * rebuild the inbox. The active side lights emerald; the other goes grey.
 */
export function DeskAnatomy({ copy }: { copy: Copy }) {
  const d = copy.desk;
  const [mode, setMode] = useState<"ai" | "human">("ai");

  return (
    <section id="desk" aria-labelledby="desk-h2" className="surface-ink sec sec--tight handover-sec">
      <CellField variant="edges" />
      <div className="wrap handover">
        <h2 id="desk-h2" className="t-h2">
          {d.h2}
        </h2>
        <p className="t-lead handover__lead">{d.lead}</p>
        <div className="switch" role="group" aria-label={d.h2}>
          <button type="button" className="switch__opt" data-on={mode === "ai"} aria-pressed={mode === "ai"} onClick={() => setMode("ai")}>
            {d.switchAi}
          </button>
          <button
            type="button"
            className="switch__opt"
            data-on={mode === "human"}
            aria-pressed={mode === "human"}
            onClick={() => setMode("human")}
          >
            {d.switchHuman}
          </button>
        </div>
      </div>
    </section>
  );
}

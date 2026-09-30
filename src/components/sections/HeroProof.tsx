"use client";

import { useCallback, useState } from "react";
import type { BusinessType } from "@/config/modules";
import type { Copy } from "@/content";
import { useBusinessType } from "@/state/business-type";
import { Thread } from "../thread/Thread";
import { TypeTabs } from "../ui/TypeTabs";

/**
 * The hero's right side: the business-type tabs and a thread that plays for that type. Changing the tab remounts the
 * thread (via `key`), which replays the Type motion.
 *
 * The spec also lit one field cell behind the panel when the result landed (§1.12 S1). Reviewed on a real screen it read
 * as a stray gold square, because the field is deliberately cleared around the panel, so it is switched off (logged in
 * DESIGN-GUIDELINES §2.10). `LitCell` and the `data-lit` hook remain for a version that lights a cell on the field.
 */
export function HeroProof({ copy }: { copy: Copy }) {
  const { type } = useBusinessType();
  const t = copy.hero.threads[type];
  const [litFor, setLitFor] = useState<BusinessType | null>(null);
  const onResult = useCallback(() => setLitFor(type), [type]);
  const lit = litFor === type;

  return (
    <div className="hero-proof" data-lit={lit ? "1" : "0"}>
      <TypeTabs labels={copy.types} className="hero-proof__tabs" />
      <div className="hero-proof__panel">
        <Thread
          key={type}
          messages={t.messages}
          name={t.name}
          channel={t.channel}
          meta={t.channel === "instagram" ? copy.ui.instagram : copy.ui.messenger}
          status={copy.ui.aiAnswering}
          result={t.result}
          autoplay="mount"
          startDelay={900}
          onResult={onResult}
          photoLabel={copy.ui.photo}
          logLabel={t.name}
        />
      </div>
      <p className="t-meta hero-proof__note">{copy.hero.threadNote}</p>
    </div>
  );
}

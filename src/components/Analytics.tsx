"use client";

import { useEffect, useSyncExternalStore } from "react";
import { CONSENT_EVENT, getConsent, loadPixel, setConsent, track } from "@/lib/analytics";
import { site } from "@/config/site";
import type { Copy } from "@/content";

function subscribeConsent(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb);
  return () => window.removeEventListener(CONSENT_EVENT, cb);
}

/**
 * Loads the pixel once tracking is allowed, turns `data-track` clicks into events (so links can stay server
 * components), and shows the consent bar only when a pixel exists and consent is required.
 */
export function Analytics({ copy }: { copy: Copy["consent"] }) {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null);
  // storage is only readable in the browser, so the bar can't be server-rendered: false on the server, true on the client
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    loadPixel();
    const onConsent = () => loadPixel();
    window.addEventListener(CONSENT_EVENT, onConsent);
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      track(el.dataset.track as string, el.dataset.section ? { section: el.dataset.section } : {});
    };
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (!ready || !site.pixelId || !site.consentRequired || consent !== null) return null;
  return (
    <div className="consent" role="region" aria-label={copy.text}>
      <p>{copy.text}</p>
      <div className="consent__actions">
        <button type="button" className="consent__btn" onClick={() => setConsent("granted")}>
          {copy.accept}
        </button>
        <button type="button" className="consent__btn" onClick={() => setConsent("denied")}>
          {copy.decline}
        </button>
      </div>
    </div>
  );
}

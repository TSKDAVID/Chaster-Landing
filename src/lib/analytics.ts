import { site } from "@/config/site";

/**
 * Measurement (DESIGN-GUIDELINES §2.4). Events: cta_click, demo_click, module_toggle, type_tab_change, faq_open,
 * video_play. Nothing leaves the browser without a Pixel ID, and nothing fires before consent when consent is required.
 */

export type ConsentState = "granted" | "denied" | null;
const KEY = "ch_consent";
export const CONSENT_EVENT = "ch-consent";

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
const getFbq = (): Fbq | undefined => (window as unknown as { fbq?: Fbq }).fbq;

export function getConsent(): ConsentState {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: "granted" | "denied") {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* storage blocked (some in-app browsers): the choice simply lasts for this page view */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function trackingAllowed(): boolean {
  return Boolean(site.pixelId) && (!site.consentRequired || getConsent() === "granted");
}

export type EventProps = Record<string, string | number | boolean>;

export function track(event: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props);
  if (!trackingAllowed()) return;
  getFbq()?.("trackCustom", event, props);
}

/** The standard Meta Pixel bootstrap, loaded only once tracking is allowed. */
export function loadPixel() {
  if (typeof window === "undefined" || !trackingAllowed() || getFbq()) return;
  const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq };
  const n: Fbq = function (...args: unknown[]) {
    // queue until fbevents.js takes over
    (n.queue as unknown[]).push(args);
  } as Fbq;
  n.queue = [];
  n.loaded = true;
  w.fbq = n;
  w._fbq = n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  n("init", site.pixelId);
  n("track", "PageView");
}

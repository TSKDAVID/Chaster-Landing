/** Site-wide settings. Everything environment-specific comes from env vars; see `.env.example`. */

export const LOCALES = ["ka", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ka";
export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

/**
 * Sub-path the site is served from. Empty in normal deployments; "/Chaster-Landing" on GitHub Pages, where the site
 * lives at owner.github.io/Chaster-Landing. `next.config.ts` sets Next's own `basePath` from the same variable, which
 * prefixes `_next` assets and `<Link>`; plain `<a href>`, `<img src>` and `<video src>` are not touched by Next, so
 * internal ones go through `withBase`. Metadata paths do not need it: `metadataBase` already carries the sub-path.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBase = (path: string): string => `${BASE_PATH}${path}`;

/** Path for a locale: Georgian lives at `/`, English at `/en` (§1.11). */
export function localePath(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  return locale === DEFAULT_LOCALE ? clean || "/" : `/en${clean}`;
}

export const site = {
  // TODO(OWNER): real domain. The default is a reserved documentation TLD so nothing points at a stranger's site.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://chaster.example").replace(/\/$/, ""),
  // TODO(OWNER): where „დააკავშირე გვერდი“ lands, and confirm it reads ?modules= ?for= ?lang= (§1.18 #1).
  appUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "https://app.chaster.example").replace(/\/$/, ""),
  // TODO(OWNER): Chaster's own Facebook page and Instagram handle (§1.18 #5). Used by the live demo and the QR code.
  messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL ?? "https://m.me/chaster.example",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/chaster.example",
  // Measurement (§2.4). No ID means no pixel and no events leave the browser.
  pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  // Until a lawyer says otherwise, events wait for consent (§1.18 #13).
  consentRequired: process.env.NEXT_PUBLIC_CONSENT_REQUIRED !== "false",
  name: "Chaster",
} as const;

/**
 * Minutes from "connect" to the first answered message, one per timeline row (§1.12 S4).
 * PLACEHOLDER (OWNER, §1.18 #8): never promise a number that has not been measured.
 */
export const SETUP_TIMES = [0, 1, 4, 8, 10] as const;
export const SETUP_MINUTES = SETUP_TIMES[SETUP_TIMES.length - 1];

export type ConnectParams = {
  modules: readonly string[];
  businessType: string;
  locale: Locale;
};

/** Every CTA carries the plan and business type: `APP_URL/connect?modules=catalog,media&for=shop&lang=ka` (§1.11). */
export function connectUrl({ modules, businessType, locale }: ConnectParams): string {
  const q = new URLSearchParams();
  if (modules.length > 0) q.set("modules", modules.join(",")); // core-only plans carry no add-ons
  q.set("for", businessType);
  q.set("lang", locale);
  // keep the comma readable: URLSearchParams encodes it as %2C, which the app decodes identically
  return `${site.appUrl}/connect?${q.toString().replace(/%2C/g, ",")}`;
}

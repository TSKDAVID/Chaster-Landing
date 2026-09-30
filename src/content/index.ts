import type { Locale } from "@/config/site";
import { typo } from "@/lib/tokens";
import { en } from "./en";
import { ka } from "./ka";
import type { Copy } from "./types";

/** Apply the typography rules (§1.7) to every string once, so individual strings can't forget them. */
function normalise<T>(value: T): T {
  if (typeof value === "string") return typo(value) as T;
  if (Array.isArray(value)) return value.map(normalise) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalise(v)])) as T;
  }
  return value;
}

const copies: Record<Locale, Copy> = { ka: normalise(ka), en: normalise(en) };

export const getCopy = (locale: Locale): Copy => copies[locale];
export type { Copy } from "./types";

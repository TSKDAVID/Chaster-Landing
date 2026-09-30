import type { MetadataRoute } from "next";
import { localePath, site } from "@/config/site";

const PAGES = ["", "/privacy", "/terms", "/data-deletion"] as const;

/** Every page in both languages, each entry carrying its hreflang alternates. `lastModified` is the build time. */
// required for the static export (GitHub Pages build)
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap((p) =>
    (["ka", "en"] as const).map((locale) => ({
      url: `${site.url}${localePath(locale, p)}`,
      lastModified,
      changeFrequency: p === "" ? ("weekly" as const) : ("yearly" as const),
      priority: p === "" ? 1 : 0.3,
      alternates: {
        languages: {
          ka: `${site.url}${localePath("ka", p)}`,
          en: `${site.url}${localePath("en", p)}`,
        },
      },
    })),
  );
}

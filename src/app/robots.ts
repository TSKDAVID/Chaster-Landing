import type { MetadataRoute } from "next";
import { BASE_PATH, site } from "@/config/site";

// required for the static export (GitHub Pages build)
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // /system is the sign-off page for the cell system: reachable, not indexed
    rules: [{ userAgent: "*", allow: "/", disallow: [`${BASE_PATH}/system`, `${BASE_PATH}/en/system`] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

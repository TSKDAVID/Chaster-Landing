import type { NextConfig } from "next";

/**
 * Two ways to run this site:
 *
 * 1. Normal (Vercel, `next start`, dev): Georgian lives at `/`, English at `/en` (§1.11). Internally both are
 *    `app/[lang]`, so the Georgian public paths are rewritten to `/ka/...` (before files, so it is handled at the routing
 *    layer with no function invocation) and the internal `/ka/...` URLs redirect back to the canonical unprefixed ones.
 *
 * 2. GitHub Pages (`GITHUB_PAGES=true`): Pages serves static files only, so the site is exported. Rewrites, redirects and
 *    headers do not exist there, so `scripts/pages-postbuild.mjs` copies the Georgian pages from `/ka` to the site root
 *    after the build. The site is served from a sub-path, so `basePath` is set, and the same value is exposed to the
 *    code as NEXT_PUBLIC_BASE_PATH for plain links and media (see `withBase` in src/config/site.ts).
 */
const isPages = process.env.GITHUB_PAGES === "true";
const BASE_PATH = isPages ? "/Chaster-Landing" : "";

const GEORGIAN_PAGES = ["/", "/privacy", "/terms", "/data-deletion", "/system"];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  // lets the dev server be opened through a Cloudflare quick tunnel (phone testing)
  allowedDevOrigins: ["*.trycloudflare.com"],
  experimental: {
    // the root layout sits inside [lang], so unmatched URLs have no layout to compose a 404 from (docs: not-found.md)
    globalNotFound: true,
  },
  ...(isPages
    ? {
        output: "export" as const,
        basePath: BASE_PATH,
        trailingSlash: true, // /en/ -> en/index.html, which Pages serves without configuration
        images: { unoptimized: true },
      }
    : {
        async redirects() {
          return [
            { source: "/ka", destination: "/", permanent: true },
            { source: "/ka/:path*", destination: "/:path*", permanent: true },
          ];
        },
        async rewrites() {
          return {
            beforeFiles: GEORGIAN_PAGES.map((p) => ({ source: p, destination: `/ka${p === "/" ? "" : p}` })),
            afterFiles: [],
            fallback: [],
          };
        },
        async headers() {
          const security = [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ];
          return [
            { source: "/:path*", headers: security },
            // media is replaced by filename, so a week is safe and keeps repeat visits off the network
            { source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
            { source: "/og/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
          ];
        },
      }),
};

export default nextConfig;

# Chaster landing page

Georgian-first (with English) marketing site for Chaster, built with Next.js and Tailwind.
The design system, the plan and every decision are in [`DESIGN-GUIDELINES.md`](DESIGN-GUIDELINES.md).

Live: https://tskdavid.github.io/Chaster-Landing/ (English at `/en/`)

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # copy limits, brand geometry vs the kit, types, lint
npm run build        # normal production build
```

Copy `.env.example` to `.env.local` to change links (app URL, Messenger page, Pixel ID).
Facts only the owner can give (founder, company, legal details) live in `src/config/owner.ts`.

## GitHub Pages

Pushing to `main` runs `.github/workflows/pages.yml`, which builds a static export
(`GITHUB_PAGES=true`, sub-path `/Chaster-Landing`), moves the Georgian pages to the site root
(`scripts/pages-postbuild.mjs`) and deploys it. To rehearse locally:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://tskdavid.github.io/Chaster-Landing npm run build
node scripts/pages-postbuild.mjs     # output in ./out
```

The static export has no server, so the redirects and headers of `next.config.ts` apply only to normal deployments.

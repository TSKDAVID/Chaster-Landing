// After `GITHUB_PAGES=true next build` (static export to ./out): make the export deployable on GitHub Pages.
//
//  1. Georgian is the default language and lives at the site root, but the export puts it at /ka/. Copy it up so that
//     owner.github.io/Chaster-Landing/, /privacy/, /terms/ and /data-deletion/ are Georgian (English stays at /en/).
//  2. Add .nojekyll, or Pages' Jekyll step would ignore the `_next` folder and break every asset.
//  3. Pages serves 404.html for unknown URLs; use the site's own "a block is missing" page.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
if (!fs.existsSync(path.join(out, "ka", "index.html"))) {
  console.error("out/ka/index.html not found: run `GITHUB_PAGES=true npm run build` first");
  process.exit(1);
}

fs.cpSync(path.join(out, "ka"), out, { recursive: true, force: true });
fs.writeFileSync(path.join(out, ".nojekyll"), "");

const candidates = ["404.html", "_not-found.html", path.join("_not-found", "index.html")];
const found = candidates.map((c) => path.join(out, c)).find((p) => fs.existsSync(p));
if (found && path.basename(found) !== "404.html") fs.copyFileSync(found, path.join(out, "404.html"));
if (!fs.existsSync(path.join(out, "404.html"))) {
  console.warn("no not-found page in the export; falling back to the home page for 404s");
  fs.copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));
}

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) (e.isDirectory() ? walk : (p) => files.push(p))(path.join(d, e.name));
})(out);
console.log(`Pages export ready: ${files.length} files, 404.html from ${found ? path.relative(out, found) : "home page"}`);

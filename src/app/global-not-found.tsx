import type { Metadata } from "next";
import { CellSprite } from "@/components/cell/CellSprite";
import { CellNumerals } from "@/components/cell/CellNumerals";
import { Mark } from "@/components/cell/Mark";
import { withBase } from "@/config/site";
import { getCopy } from "@/content";
import { semibold, text } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { title: "404 · Chaster" };

/**
 * The 404 (§1.11): "A block is missing", the mark with its signal cell as an empty outline, and the page number in cell
 * numerals (a small accent where a misread costs nothing). The locale of an unmatched URL is unknown, so the Georgian
 * text leads and an English line follows. `global-not-found` bypasses the layout, hence the imports here.
 */
export default function GlobalNotFound() {
  const ka = getCopy("ka").notFound;
  const en = getCopy("en").notFound;
  return (
    <html lang="ka" className={`${semibold.variable} ${text.variable}`}>
      <body>
        <CellSprite />
        <main className="nf">
          <div className="nf__inner">
            <Mark size={96} signal="outline" />
            <CellNumerals text="404" cell={4} />
            <h1 className="t-h2" style={{ color: "#fff" }}>
              {ka.title}
            </h1>
            <p className="t-lead">{ka.body}</p>
            {/* plain anchors on purpose: the locales have different root layouts, so this must be a full page load */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href={withBase("/")} className="text-link" style={{ color: "#fff" }}>
              {ka.link}
            </a>
            <p lang="en" className="t-meta" style={{ marginTop: 12 }}>
              {en.title}. {en.body}{" "}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href={withBase("/en")} style={{ textDecoration: "underline", color: "#fff" }}>
                {en.link}
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}

import { companyReady, isDev, owner } from "@/config/owner";
import { localePath, site, withBase, type Locale } from "@/config/site";
import type { Copy } from "@/content";
import { Lockup } from "../cell/Lockup";

/** S9. A single band, not four columns (§1.12, §1.16): lockup, legal line, contact, legal links, language, copyright. */
export function Footer({ copy, locale }: { copy: Copy; locale: Locale }) {
  const c = owner.company;
  const other: Locale = locale === "ka" ? "en" : "ka";
  const idLabel = locale === "ka" ? "ს/კ" : "ID";
  const legal = companyReady
    ? [c.legalName, `${idLabel} ${c.idCode}`, c.address].filter(Boolean).join(", ")
    : isDev
      ? copy.footer.legalMissing
      : null;

  return (
    <footer className="surface-ink footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <Lockup height={24} />
          {legal ? <p className="t-meta footer__legal">{legal}</p> : null}
        </div>

        <div className="footer__contact">
          <span className="t-meta footer__label">{copy.footer.contact}</span>
          {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : null}
          {c.phone ? (
            <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="tnum">
              {c.phone}
            </a>
          ) : null}
          <a href={site.messengerUrl} target="_blank" rel="noopener" data-track="demo_click" data-section="footer">
            Messenger
          </a>
        </div>

        <nav className="footer__links" aria-label={copy.footer.privacy}>
          <a href={withBase(localePath(locale, "/privacy"))}>{copy.footer.privacy}</a>
          <a href={withBase(localePath(locale, "/terms"))}>{copy.footer.terms}</a>
          <a href={withBase(localePath(locale, "/data-deletion"))}>{copy.footer.deletion}</a>
          <a href={withBase(localePath(other))} hrefLang={other} lang={other}>
            {copy.nav.langOtherName}
          </a>
        </nav>

        <p className="t-meta footer__rights">
          © 2026 Chaster · {copy.footer.rights}
        </p>
      </div>
    </footer>
  );
}

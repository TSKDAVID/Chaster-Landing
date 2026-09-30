"use client";

import { useEffect, useRef, useState } from "react";
import { localePath, withBase, type Locale } from "@/config/site";
import type { Copy } from "@/content";
import { Lockup } from "../cell/Lockup";
import { Close, Menu } from "../ui/Icons";
import { CtaButton } from "../ui/CtaButton";

const LINKS = [
  { id: "desk", key: "how" },
  { id: "build", key: "modules" },
  { id: "faq", key: "faq" },
] as const;

/**
 * S0. A solid ink bar with a bottom hairline: no blur, no glass (§1.12). It hides on scroll down and returns on scroll
 * up, but never while a control inside it has keyboard focus. On mobile the menu is a full-screen ink sheet.
 */
export function Nav({
  copy,
  locale,
  linkBase = "",
}: {
  copy: Pick<Copy, "a11y" | "nav" | "cta">;
  locale: Locale;
  /** Prefix for the section anchors: empty on the landing page, the locale's home path on other pages. */
  linkBase?: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const d = y - last;
        if (y < 80 || d < -6) setHidden(false);
        else if (d > 6) setHidden(true);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // the mobile sheet: scroll lock, Escape, and a focus trap
  useEffect(() => {
    if (!open) return;
    const opener = openRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !sheetRef.current) return;
      const f = sheetRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  const other: Locale = locale === "ka" ? "en" : "ka";
  // the language switch keeps the current section and the ?for= segment (§1.12 S0)
  const keepContext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const a = e.currentTarget;
    a.href = a.href.split("#")[0].split("?")[0] + window.location.search + window.location.hash;
  };

  return (
    <>
      <header className={`nav ${hidden && !open ? "nav--hidden" : ""}`}>
        <div className="wrap nav__inner">
          <a href={withBase(localePath(locale))} className="nav__logo" aria-label="Chaster">
            <Lockup height={28} assemble="session" className="nav__lockup" />
          </a>

          <nav aria-label={copy.a11y.mainNav} className="nav__links">
            {LINKS.map((l) => (
              <a key={l.id} href={`${linkBase}#${l.id}`} className="nav__link">
                {copy.nav[l.key]}
              </a>
            ))}
          </nav>

          <div className="nav__end">
            <a
              href={withBase(localePath(other))}
              hrefLang={other}
              lang={other}
              className="nav__lang"
              aria-label={copy.nav.langOtherName}
              onClick={keepContext}
            >
              <span aria-hidden="true" className="nav__lang-self">
                {copy.nav.langSelf}
              </span>
              <span aria-hidden="true" className="nav__lang-sep">
                /
              </span>
              <span aria-hidden="true">{copy.nav.langOther}</span>
            </a>
            <CtaButton section="nav" size="md" className="nav__cta nav__cta--long">
              {copy.cta.primary}
            </CtaButton>
            <CtaButton section="nav" size="md" className="nav__cta nav__cta--short">
              {copy.cta.short}
            </CtaButton>
            <button
              ref={openRef}
              type="button"
              className="nav__burger"
              aria-label={copy.a11y.openMenu}
              aria-expanded={open}
              aria-controls="menu-sheet"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="menu-sheet"
          ref={sheetRef}
          className="menu-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={copy.a11y.mainNav}
        >
          <div className="wrap menu-sheet__top">
            <Lockup height={24} />
            <button ref={closeRef} type="button" className="nav__burger" aria-label={copy.a11y.closeMenu} onClick={() => setOpen(false)}>
              <Close />
            </button>
          </div>
          <nav className="wrap menu-sheet__links" aria-label={copy.a11y.mainNav}>
            {LINKS.map((l) => (
              <a key={l.id} href={`${linkBase}#${l.id}`} className="menu-sheet__link" onClick={() => setOpen(false)}>
                {copy.nav[l.key]}
              </a>
            ))}
            <a href={withBase(localePath(other))} hrefLang={other} lang={other} className="menu-sheet__link" onClick={keepContext}>
              {copy.nav.langOtherName}
            </a>
          </nav>
          <div className="wrap menu-sheet__cta">
            <CtaButton section="menu" full>
              {copy.cta.primary}
            </CtaButton>
          </div>
        </div>
      ) : null}
    </>
  );
}

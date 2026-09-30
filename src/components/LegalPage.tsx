import { isDev, owner } from "@/config/owner";
import { localePath, site, withBase, type Locale } from "@/config/site";
import { getCopy } from "@/content";
import { LEGAL, type LegalDoc } from "@/content/legal";
import { Analytics } from "./Analytics";
import { Footer } from "./sections/Footer";
import { Nav } from "./sections/Nav";
import { BusinessTypeProvider } from "@/state/business-type";
import { PlanProvider } from "@/state/plan";

/** Replace {contact} with a real link and {company} with the owner's company name (or a dev-only marker). */
function withTokens(text: string): React.ReactNode[] {
  const company = owner.company.legalName || (isDev ? "[OWNER: company name]" : "Chaster");
  const email = owner.company.email;
  const contact = email ? (
    <a key="c" href={`mailto:${email}`}>
      {email}
    </a>
  ) : (
    <a key="c" href={site.messengerUrl} target="_blank" rel="noopener">
      Messenger
    </a>
  );
  return text
    .replaceAll("{company}", company)
    .split("{contact}")
    .flatMap((part, i, arr) => (i < arr.length - 1 ? [part, contact] : [part]));
}

/** Legal pages (§1.11): the same type and tokens on paper, a single column, no field. */
export function LegalPage({ locale, doc }: { locale: Locale; doc: LegalDoc }) {
  const copy = getCopy(locale);
  const set = LEGAL[locale];
  return (
    <BusinessTypeProvider>
      <PlanProvider locale={locale}>
        <Nav copy={copy} locale={locale} linkBase={withBase(localePath(locale))} />
        <main id="main" className="surface-paper legal">
          <article className="wrap legal__inner">
            <h1>{doc.title}</h1>
            {!owner.legalReviewed ? <p className="legal__draft">{set.draftNote}</p> : null}
            <p className="t-meta" style={{ marginTop: 16 }}>
              {set.updatedLabel}: {set.updated}
            </p>
            <p style={{ marginTop: 24 }}>{withTokens(doc.intro)}</p>
            {doc.sections.map((s) => (
              <section key={s.h} id={s.id}>
                <h2>{s.h}</h2>
                {s.p?.map((p) => <p key={p}>{withTokens(p)}</p>)}
                {s.list ? (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{withTokens(li)}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </main>
        <Footer copy={copy} locale={locale} />
        <Analytics copy={copy.consent} />
      </PlanProvider>
    </BusinessTypeProvider>
  );
}

import { founderReady, isDev, owner } from "@/config/owner";
import { site } from "@/config/site";
import type { Copy } from "@/content";
import { Cell } from "../cell/Cell";
import { Mark } from "../cell/Mark";
import { ArrowRight } from "../ui/Icons";

/**
 * S6: the seven house rules, then the founder band (§1.12, v1.2). The rules state how the product behaves, taken only
 * from verified product truths, each with a signal cell in the matching module's colour. The founder band is the human
 * trust layer the honesty rules would otherwise leave empty.
 */
export function Rules({ copy }: { copy: Copy }) {
  const r = copy.rules;
  return (
    <section id="rules" aria-labelledby="rules-h2" className="surface-paper sec sec--tight">
      <div className="wrap">
        <div className="lg:grid lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8">
          <div className="lg:col-span-3">
            <h2 id="rules-h2" className="t-h2">
              {r.h2}
            </h2>
            <p className="t-lead rules__lead">{r.lead}</p>
          </div>
          <ol className="rules lg:col-span-4">
            {r.items.map((it) => (
              <li key={it.rule} className="rule-row">
                <Cell size={14} state={{ kind: "signal", id: it.signal }} className="rule-row__cell" />
                <div>
                  <h3 className="t-h3 rule-row__rule">{it.rule}</h3>
                  <p className="t-meta rule-row__proof">{it.proof}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <FounderBand copy={copy} />
      </div>
    </section>
  );
}

/**
 * Real name, role and photo come from the owner (src/config/owner.ts). Nothing is invented: until they exist the band is
 * omitted in production, and shown as a clearly-marked placeholder in development so the layout can be reviewed.
 */
function FounderBand({ copy }: { copy: Copy }) {
  if (!founderReady && !isDev) return null;
  const f = owner.founder;
  const c = copy.founder;
  const messenger = f.messengerUrl || site.messengerUrl;
  return (
    <div className="founder" data-placeholder={!founderReady}>
      <div className="founder__photo">
        {f.photo ? (
          // a real photograph: unstyled, no filters, structure radius (§1.10)
          // eslint-disable-next-line @next/next/no-img-element
          <img src={f.photo} alt={c.photoAlt} width={320} height={400} loading="lazy" decoding="async" />
        ) : (
          <div className="founder__photo-empty" aria-hidden="true">
            <Mark size={56} />
          </div>
        )}
      </div>
      <div className="founder__text">
        <p className="t-h3 founder__who">
          {founderReady ? (
            <>
              {f.name}
              <span className="founder__role"> · {f.role}</span>
            </>
          ) : (
            <span className="founder__todo">OWNER: name, role and photo (src/config/owner.ts)</span>
          )}
        </p>
        <p className="founder__body">{c.body}</p>
      </div>
      <div className="founder__contact">
        <a
          href={messenger}
          target="_blank"
          rel="noopener"
          className="text-link"
          data-track="demo_click"
          data-section="founder"
        >
          {c.cta}
          <ArrowRight size={16} />
        </a>
        {f.phone ? (
          <a href={`tel:${f.phone.replace(/\s/g, "")}`} className="founder__phone tnum">
            {f.phone}
          </a>
        ) : null}
      </div>
    </div>
  );
}

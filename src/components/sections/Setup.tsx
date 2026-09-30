import { SETUP_TIMES, site } from "@/config/site";
import type { Copy } from "@/content";
import { fillTokens } from "@/lib/tokens";
import { ArrowRight } from "../ui/Icons";
import { CtaButton } from "../ui/CtaButton";
import { SetupTimeline } from "./SetupTimeline";

/**
 * S4. "Live in minutes, no developer" as a timeline of real minutes (§1.12). It resolves into the page's only mid-page
 * CTA band (v1.2): the "it's this easy" beat, and the desktop mid-page, where the mobile dock doesn't exist.
 * The minute values are placeholders until onboarding is timed (§1.18 #8).
 */
export function Setup({ copy }: { copy: Copy }) {
  const s = copy.setup;
  return (
    <section id="setup" aria-labelledby="setup-h2" className="surface-ink sec sec--standard">
      <div className="wrap lg:grid lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8">
        <div className="lg:col-span-3">
          <h2 id="setup-h2" className="t-h2">
            {fillTokens(s.h2)}
          </h2>
          <p className="t-lead setup__lead">{s.lead}</p>
        </div>
        <div className="lg:col-span-4 setup__timeline">
          <SetupTimeline steps={s.steps} times={SETUP_TIMES} unit={s.unit} clockLabel={s.clockLabel} />
          <div className="mid-cta">
            <p className="t-h3 mid-cta__line">{fillTokens(copy.cta.mid)}</p>
            <div className="mid-cta__actions">
              <CtaButton section="mid">{copy.cta.primary}</CtaButton>
              <a
                href={site.messengerUrl}
                target="_blank"
                rel="noopener"
                className="text-link"
                data-track="demo_click"
                data-section="mid"
              >
                {copy.hero.alt}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import type { Copy } from "@/content";
import { fillTokens } from "@/lib/tokens";
import { CellField } from "../cell/CellField";
import { ArrowRight } from "../ui/Icons";
import { CtaButton } from "../ui/CtaButton";
import { HeroProof } from "./HeroProof";

/**
 * S1. Asymmetric 4 + 3 split, no badge above the H1, nothing centred (§1.12). The headline and CTA sit left; the proof,
 * a live conversation for the visitor's own business type, sits right. The H1 is the LCP element, so it is plain text
 * in the preloaded SemiBold and nothing blocks it.
 */
export function Hero({ copy }: { copy: Copy; locale: Locale }) {
  return (
    <section id="hero" aria-labelledby="hero-h1" className="surface-ink hero">
      <CellField variant="edges" />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <h1 id="hero-h1" className="t-display">
            {copy.hero.h1}
          </h1>
          <p className="t-lead hero__lead">{copy.hero.lead}</p>
          <div className="hero__cta" id="hero-cta">
            <CtaButton section="hero" fullMobile>
              {copy.cta.primary}
            </CtaButton>
          </div>
          <p className="t-meta hero__note">{fillTokens(copy.hero.note)}</p>
          <a
            href={site.messengerUrl}
            target="_blank"
            rel="noopener"
            className="text-link hero__alt"
            data-track="demo_click"
            data-section="hero"
          >
            {copy.hero.alt}
            <ArrowRight size={16} />
          </a>
        </div>
        <HeroProof copy={copy} />
      </div>
    </section>
  );
}

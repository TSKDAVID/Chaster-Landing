import { site } from "@/config/site";
import type { Copy } from "@/content";
import { fillTokens } from "@/lib/tokens";
import { CellField } from "../cell/CellField";
import { CellQR } from "../cell/CellQR";
import { Lockup } from "../cell/Lockup";
import { ChannelMark } from "../thread/parts";
import { CtaButton } from "../ui/CtaButton";
import { ViewOnce } from "../ui/ViewOnce";

/**
 * S8. The ad's end card, and the only centred composition on the page, on purpose (§1.12). The lockup assembles the first
 * time it scrolls into view, exactly as in the outro. "Message us and Chaster will answer" is the proof: the visitor
 * tries the real product. The QR opens Chaster's own Messenger page (desktop only).
 */
export function FinalCall({ copy }: { copy: Copy }) {
  const f = copy.final;
  return (
    <section id="final" aria-labelledby="final-h2" className="surface-ink final">
      <CellField variant="edges" />
      <ViewOnce className="wrap final__inner">
        <Lockup variant="customR" height={64} assemble="view" className="final__lockup" title="Chaster" />
        <h2 id="final-h2" className="t-h2 final__h2">
          {f.h2}
        </h2>
        <div className="final__cta">
          <CtaButton section="final">{copy.cta.primary}</CtaButton>
        </div>
        <p className="final__note">{fillTokens(f.note)}</p>

        <hr className="final__rule" />

        <p className="t-meta final__alt-title">{f.altTitle}</p>
        <div className="final__alt">
          <div className="final__channels">
            <a
              href={site.messengerUrl}
              target="_blank"
              rel="noopener"
              className="channel-btn"
              data-track="demo_click"
              data-section="final"
            >
              <ChannelMark channel="messenger" size={20} />
              {f.messenger}
            </a>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener"
              className="channel-btn"
              data-track="demo_click"
              data-section="final"
            >
              <ChannelMark channel="instagram" size={20} />
              {f.instagram}
            </a>
          </div>
          <figure className="final__qr">
            <CellQR value={site.messengerUrl} label={f.altQr} size={152} />
            <figcaption className="t-meta">{f.altQr}</figcaption>
          </figure>
        </div>
      </ViewOnce>
    </section>
  );
}

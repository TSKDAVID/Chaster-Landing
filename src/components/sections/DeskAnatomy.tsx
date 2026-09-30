import { site } from "@/config/site";
import type { Copy } from "@/content";
import { ArrowRight } from "../ui/Icons";
import { DeskFrame, Marker } from "./DeskFrame";

/**
 * S3. You stay in control (§1.12, v1.2). Losing control of their page is the visitor's biggest fear about any
 * automation; this section exists to kill it. From 1280 px the callouts sit beside the frame (5 + 2 columns), so the
 * whole section fits a laptop window; below that they follow it. They are a list rather than three equal columns,
 * which is the banned "three identical cards" layout.
 */
export function DeskAnatomy({ copy }: { copy: Copy }) {
  const d = copy.desk;
  return (
    <section id="desk" aria-labelledby="desk-h2" className="surface-ink sec sec--tight">
      <div className="wrap">
        <div className="lg:grid lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8">
          <h2 id="desk-h2" className="t-h2 lg:col-span-4">
            {d.h2}
          </h2>
          <p className="t-lead desk__lead lg:col-span-3">{d.lead}</p>
        </div>

        <div className="desk__layout xl:grid xl:grid-cols-7 xl:gap-x-8">
          <div className="xl:col-span-5">
            <DeskFrame copy={copy} />
            <p className="t-meta desk__hint">{d.hint}</p>
          </div>

          <aside className="desk__aside xl:col-span-2">
            <ol className="callouts">
              {d.callouts.map((c, i) => (
                <li key={c.title} className="callout">
                  <Marker n={i + 1} />
                  <div>
                    <h3 className="t-h3 callout__title">{c.title}</h3>
                    <p className="callout__body">{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href={site.messengerUrl}
              target="_blank"
              rel="noopener"
              className="text-link text-link--lg desk__demo"
              data-track="demo_click"
              data-section="desk"
            >
              {d.demo}
              <ArrowRight size={18} />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

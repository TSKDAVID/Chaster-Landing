import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cell } from "@/components/cell/Cell";
import { CellMatrix } from "@/components/cell/CellMatrix";
import { CellNumerals } from "@/components/cell/CellNumerals";
import { Lockup } from "@/components/cell/Lockup";
import { Mark } from "@/components/cell/Mark";
import { Pictogram } from "@/components/cell/Pictogram";
import { composeText } from "@/components/cell/bitmaps";
import { CellButton } from "@/components/ui/CellButton";
import { MessageRow, ResultLine, Status, ThreadFrame } from "@/components/thread/parts";
import { MODULE_IDS, type SignalId } from "@/config/modules";
import { isLocale } from "@/config/site";
import { getCopy } from "@/content";

export const metadata: Metadata = { title: "Cell system · Chaster", robots: { index: false, follow: false } };

const COLORS: [string, string][] = [
  ["ink", "#0D0A1B"],
  ["surface", "#181529"],
  ["raised", "#1D192F"],
  ["line", "#322E4B"],
  ["text", "#EEEDF6"],
  ["text-2", "#BDBBD0"],
  ["muted", "#9D99C2"],
  ["white", "#FFFFFF"],
  ["paper", "#F7F6FB"],
  ["paper-2", "#EBEAF3"],
  ["line-paper", "#D9D7E5"],
  ["ink-2", "#4D4962"],
  ["brand", "#AB97FF"],
  ["brand-deep", "#6447E1"],
];
const SIGNALS: SignalId[] = [...MODULE_IDS, "missed"];

/** Sign-off page for the whole cell system (§2.5 step 1). Not linked anywhere, not indexed. */
export default async function SystemPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getCopy(lang);
  const sample = copy.hero.threads.shop;

  return (
    <main id="main" className="surface-ink sys">
      <div className="wrap">
        <h1 className="t-display" style={{ fontSize: 44 }}>
          Cell system
        </h1>
        <p className="t-lead" style={{ marginTop: 12 }}>
          Geometry is verified against the brand kit by <code>scripts/verify-brand.ts</code>.
        </p>

        <h2 className="t-h2">Colour tokens</h2>
        <div className="sys__grid">
          {COLORS.map(([n, v]) => (
            <div key={n} className="sys__swatch">
              <i style={{ background: v }} />
              <span>
                {n}
                <br />
                {v}
              </span>
            </div>
          ))}
        </div>

        <h2 className="t-h2">Signal cells (on dark) and module marks</h2>
        <div className="sys__grid">
          {SIGNALS.map((s) => (
            <div key={s} className="sys__item">
              {s === "missed" ? <Cell size={64} state={{ kind: "signal", id: s }} /> : <Mark size={64} signal={s} />}
              {s}
            </div>
          ))}
          <div className="sys__item">
            <Mark size={64} signal="outline" />
            outline slot
          </div>
          <div className="sys__item">
            <Mark size={64} />
            brand (kit-exact)
          </div>
        </div>

        <h2 className="t-h2">Cell states</h2>
        <div className="sys__grid">
          <div className="sys__item"><Cell size={40} /> arrived</div>
          <div className="sys__item"><Cell size={40} state={{ kind: "outline" }} /> yours</div>
          <div className="sys__item"><Cell size={40} state={{ kind: "signal", id: "inbox" }} /> answered</div>
          <div className="sys__item"><Cell size={40} state={{ kind: "signal", id: "missed" }} /> missed</div>
        </div>

        <h2 className="t-h2">Lockups</h2>
        <div className="sys__grid" style={{ alignItems: "center" }}>
          <Lockup height={28} />
          <Lockup height={56} />
          <Lockup variant="customR" height={56} />
        </div>

        <h2 className="t-h2">Pictograms (7 × 7, one signal cell each)</h2>
        <div className="sys__grid">
          {MODULE_IDS.map((id) => (
            <div key={id} className="sys__item">
              <Pictogram id={id} cell={8} />
              {id}
            </div>
          ))}
        </div>

        <h2 className="t-h2">Cell numerals (accent only, never prices)</h2>
        <div className="sys__grid" style={{ alignItems: "center" }}>
          <CellNumerals text="0123456789" cell={5} />
          <CellNumerals text="404" cell={6} />
          <CellMatrix rows={composeText("20₾")} cell={5} label="20 lari" />
        </div>

        <h2 className="t-h2">Buttons</h2>
        <div className="sys__grid" style={{ alignItems: "center" }}>
          <CellButton href="#" surface="ink">{copy.cta.primary}</CellButton>
          <CellButton href="#" surface="ink" size="md">{copy.cta.short}</CellButton>
        </div>
        <div className="surface-paper" style={{ marginTop: 20, padding: 24, borderRadius: 4 }}>
          <CellButton href="#" surface="paper">{copy.cta.primary}</CellButton>
        </div>

        <h2 className="t-h2">Thread parts</h2>
        <div style={{ maxWidth: 520 }}>
          <ThreadFrame name={sample.name} channel={sample.channel} status={copy.ui.aiAnswering} logLabel="sample">
            {sample.messages.map((m, i) => (
              <MessageRow key={i} msg={m} photoLabel={copy.ui.photo} />
            ))}
            <ResultLine text={sample.result.text} signal={sample.result.signal} />
          </ThreadFrame>
          <p style={{ marginTop: 16, display: "flex", gap: 24 }}>
            <Status text={copy.ui.aiAnswering} />
            <Status text={copy.ui.youAnswering} outline />
          </p>
        </div>

        <h2 className="t-h2">Type</h2>
        <p className="t-display">{copy.hero.h1}</p>
        <p className="t-h2" style={{ marginTop: 16 }}>{copy.day.h2}</p>
        <p className="t-h3" style={{ marginTop: 16 }}>{copy.desk.callouts[0].title}</p>
        <p className="t-lead" style={{ marginTop: 16, maxWidth: "34rem" }}>{copy.hero.lead}</p>
        <p style={{ marginTop: 16, maxWidth: "34rem" }}>{copy.setup.lead}</p>
        <p className="t-meta" style={{ marginTop: 16 }}>{copy.hero.threadNote} · 14:30 · 20&nbsp;₾ · 5&thinsp;000</p>
      </div>
    </main>
  );
}

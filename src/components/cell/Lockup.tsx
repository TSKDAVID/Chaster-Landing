import { LOCKUP_CUSTOM_R, LOCKUP_STANDARD } from "@/brand/lockups.generated";
import { MarkCells } from "./Mark";

type Props = {
  /** `standard` is the recommended primary (nav, footer). `customR` is used once, on the final call (§1.13). */
  variant?: "standard" | "customR";
  /** Height in CSS pixels; this is also the mark's height. The kit requires at least 24 px. */
  height?: number;
  /**
   * `session`: assembles on the first visit of a session (an inline head script adds `ch-a` to <html>).
   * `view`: assembles when a <ViewOnce> ancestor first scrolls into view.
   */
  assemble?: "session" | "view";
  className?: string;
  title?: string;
};

/**
 * The official horizontal lockup, dark variant. The mark is regenerated from the verified kit geometry so its cells can
 * animate; the wordmark is the kit's outlines, carried verbatim. The kit's 28-unit clear space is cropped here because
 * the layout supplies its own.
 */
export function Lockup({ variant = "standard", height = 28, assemble, className, title = "Chaster" }: Props) {
  const L = variant === "standard" ? LOCKUP_STANDARD : LOCKUP_CUSTOM_R;
  return (
    <svg
      viewBox={`0 0 ${L.width} ${L.height}`}
      width={+((height * L.width) / L.height).toFixed(2)}
      height={height}
      role="img"
      aria-label={title}
      className={`lockup ${className ?? ""}`}
      data-assemble={assemble}
    >
      <MarkCells assemble={Boolean(assemble)} />
      <g transform={`translate(${L.wordmark.x} ${L.wordmark.y})`} className="lk-word">
        <path d={L.wordmark.d} fill="#FFFFFF" />
        {variant === "customR" && L.wordmarkCell ? <path d={L.wordmarkCell} fill="#AB97FF" /> : null}
      </g>
    </svg>
  );
}

/**
 * The background grid of empty cells (§1.5 "The cell field"). Pure CSS: a tiled SVG cell, masked so it clears under
 * all text and shows only at the edges. Costs no JavaScript.
 *
 * `edges`  the hero / final call: radial clearing in the middle, field at the edges
 * `band`   a horizontal band of field at the top of a section
 */
export function CellField({
  variant = "edges",
  className = "",
  children,
}: {
  variant?: "edges" | "band";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div aria-hidden="true" className={`field field--${variant} ${className}`}>
      {children}
    </div>
  );
}

/**
 * A lit field cell. It marks a real event (the moment a conversation turns into a booking or a price quote),
 * so it stays dark until an ancestor sets `data-lit="1"`. Snapped to the field pitch by `--col` / `--row`.
 */
export function LitCell({ col, row, signal = "inbox" }: { col: number; row: number; signal?: string }) {
  return (
    <span
      className="lit"
      style={{ "--col": col, "--row": row, "--lit": `var(--sig-${signal})` } as React.CSSProperties}
    />
  );
}

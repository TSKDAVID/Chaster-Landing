/**
 * Chaster cell geometry, ported 1:1 from the brand kit (`final/src/geom.py`).
 * Do not tune these numbers: `scripts/verify-brand.ts` proves the output is identical to the kit SVGs.
 *
 * No imports on purpose, so the verify script can run under plain `node` (type stripping).
 */

export type Radii = readonly [number, number, number, number]; // tl, tr, br, bl

/** Mirrors Python's ("%.3f" % v).rstrip("0").rstrip("."), with "-0" normalised. */
const f = (v: number): string => {
  const s = v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  return s === "-0" || s === "" ? "0" : s;
};

/**
 * Rounded rect with per-corner radii, one cubic per corner.
 * t > 0 gives a "continuous" (squircle-like) corner: it starts t*r further along each edge
 * while keeping the same apex as the circular corner.
 */
export function srrect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | Radii,
  t = 0,
): string {
  const rad: Radii = typeof r === "number" ? [r, r, r, r] : r;
  const big = Math.max(...rad);
  const ad = (rv: number): [number, number] => {
    if (rv <= 0) return [0, 0];
    // sweeping corners (larger than half the cell) stay circular
    const tt = rv === big && rv > Math.min(w, h) / 2 ? 0 : t;
    const a = rv <= Math.min(w, h) / 2 ? Math.min(rv * (1 + tt), w / 2, h / 2) : rv;
    const d = Math.max((2.3431 * rv - a) / 3, 0); // keeps the cubic midpoint on the circle's apex
    return [a, d];
  };
  const [a0, d0] = ad(rad[0]);
  const [a1, d1] = ad(rad[1]);
  const [a2, d2] = ad(rad[2]);
  const [a3, d3] = ad(rad[3]);
  const p: string[] = [`M${f(x + a0)} ${f(y)}H${f(x + w - a1)}`];
  if (a1) p.push(`C${f(x + w - d1)} ${f(y)} ${f(x + w)} ${f(y + d1)} ${f(x + w)} ${f(y + a1)}`);
  p.push(`V${f(y + h - a2)}`);
  if (a2) p.push(`C${f(x + w)} ${f(y + h - d2)} ${f(x + w - d2)} ${f(y + h)} ${f(x + w - a2)} ${f(y + h)}`);
  p.push(`H${f(x + a3)}`);
  if (a3) p.push(`C${f(x + d3)} ${f(y + h)} ${f(x)} ${f(y + h - d3)} ${f(x)} ${f(y + h - a3)}`);
  p.push(`V${f(y + a0)}`);
  if (a0) p.push(`C${f(x)} ${f(y + d0)} ${f(x + d0)} ${f(y)} ${f(x + a0)} ${f(y)}`);
  return p.join("") + "Z";
}

// ---- the mark (96 x 96 box: 3 x 3 grid, cell 28, gap 6) --------------------------------------
export const CELL = 28;
export const GAP = 6;
export const PITCH = CELL + GAP; // 34
export const MARK_SIZE = 3 * CELL + 2 * GAP; // 96
export const R_CELL = 7; // 25% of the cell side
export const R_SWEEP = 19; // outer sweep corners: top-left of (0,0), bottom-left of (0,2)
export const T_CONT = 0.28; // continuous-corner factor
export const RING = 5.5; // outline-slot stroke on the large master

export type CellPos = readonly [col: number, row: number];

/** Cells of the C, in the kit's order. (2,0) is the signal cell and is drawn separately. */
export const WHITE_CELLS: readonly CellPos[] = [
  [0, 0],
  [1, 0],
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];
export const SIGNAL_CELL: CellPos = [2, 0];

export function markCellPath([col, row]: CellPos): string {
  const rad: Radii = [
    col === 0 && row === 0 ? R_SWEEP : R_CELL,
    R_CELL,
    R_CELL,
    col === 0 && row === 2 ? R_SWEEP : R_CELL,
  ];
  return srrect(col * PITCH, row * PITCH, CELL, CELL, rad, T_CONT);
}

/** The signal cell as an outline slot (the one-colour logo treatment): outer path + inner path, use evenodd. */
export function markRingPath([col, row]: CellPos, ring = RING): string {
  const x = col * PITCH;
  const y = row * PITCH;
  const inner = Math.max(R_CELL - ring, 0.5);
  return (
    srrect(x, y, CELL, CELL, R_CELL, T_CONT) +
    srrect(x + ring, y + ring, CELL - 2 * ring, CELL - 2 * ring, [inner, inner, inner, inner], T_CONT)
  );
}

export const markWhitePath = (): string => WHITE_CELLS.map(markCellPath).join("");
export const markSignalPath = (): string => markCellPath(SIGNAL_CELL);

/** A plain cell on the 28-unit grid, used by the `<use>` sprite for bitmaps, toggles and numerals. */
export const SPRITE_CELL_D = srrect(0, 0, CELL, CELL, R_CELL, T_CONT);
/** A single cell as an outline slot (evenodd), for toggles and the CTA's inner cell. Ring is in 28-grid units. */
export function cellRingPath(ring = 4): string {
  const inner = Math.max(R_CELL - ring, 0.5);
  return (
    srrect(0, 0, CELL, CELL, R_CELL, T_CONT) +
    srrect(ring, ring, CELL - 2 * ring, CELL - 2 * ring, [inner, inner, inner, inner], T_CONT)
  );
}

/** Sprite variants with the swept outer corner, for marks drawn from `<use>` where needed. */
export const SPRITE_CELL_TL_D = srrect(0, 0, CELL, CELL, [R_SWEEP, R_CELL, R_CELL, R_CELL], T_CONT);
export const SPRITE_CELL_BL_D = srrect(0, 0, CELL, CELL, [R_CELL, R_CELL, R_CELL, R_SWEEP], T_CONT);

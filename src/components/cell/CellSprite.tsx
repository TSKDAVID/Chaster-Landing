import { SPRITE_CELL_D } from "@/brand/geometry";

/**
 * One hidden sprite per page. Every bitmap (pictograms, numerals, the QR) draws its cells as
 * `<use href="#ch-cell">`, so a 7 x 7 pictogram costs ~1 KB of HTML instead of ~8 KB of paths.
 */
export function CellSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <path id="ch-cell" d={SPRITE_CELL_D} />
      </defs>
    </svg>
  );
}

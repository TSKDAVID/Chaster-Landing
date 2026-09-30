import { CellMatrix } from "./CellMatrix";
import { composeText } from "./bitmaps";

/**
 * Small decorative numerals drawn in cells (404 page, the setup timeline clock).
 * Never for prices or any number the visitor acts on (§1.5): a decorative font at the moment of decision is friction.
 * The real text travels as the accessible name.
 */
export function CellNumerals({
  text,
  cell = 4,
  on,
  className,
  label,
}: {
  text: string;
  cell?: number;
  on?: string;
  className?: string;
  label?: string;
}) {
  return <CellMatrix rows={composeText(text)} cell={cell} on={on} className={className} label={label ?? text} />;
}

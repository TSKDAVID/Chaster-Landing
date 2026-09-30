import { SPRITE_CELL_D, cellRingPath } from "@/brand/geometry";
import { signalVar, type SignalId } from "@/config/modules";

export type CellState =
  | { kind: "solid"; color?: string } // a cell in an explicit CSS colour (defaults to the surface cell colour)
  | { kind: "outline"; color?: string } // the empty outline slot: "yours", "off"
  | { kind: "signal"; id: SignalId }; // the one coloured cell

type Props = {
  state?: CellState;
  /** Size in CSS pixels. */
  size?: number;
  className?: string;
  title?: string;
};

/**
 * The atom (§1.13). Everything else composes this. States: outline (empty slot), solid, signal.
 * Colour comes only through `signal` (law 2) or the surface's own `--cell`.
 */
export function Cell({ state = { kind: "solid" }, size = 12, className, title }: Props) {
  let d = SPRITE_CELL_D;
  let fill = "var(--cell)";
  let rule: "nonzero" | "evenodd" = "nonzero";
  if (state.kind === "outline") {
    d = cellRingPath(4);
    rule = "evenodd";
    fill = state.color ?? "var(--cell)";
  } else if (state.kind === "signal") {
    fill = signalVar(state.id);
  } else if (state.color) {
    fill = state.color;
  }
  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={d} fill={fill} fillRule={rule} />
    </svg>
  );
}

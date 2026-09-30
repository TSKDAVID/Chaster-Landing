import {
  MARK_SIZE,
  SIGNAL_CELL,
  WHITE_CELLS,
  markCellPath,
  markRingPath,
  markSignalPath,
} from "@/brand/geometry";
import { signalVar, type SignalId } from "@/config/modules";

/**
 * Where each white cell comes from when the mark assembles (§1.9): at most ±2 pitches (±68 units) away and at most
 * 15° of tilt, in flight only. Deterministic so server and client agree. Order follows the kit's cell order.
 */
const FLIGHT = [
  { dx: -58, dy: -44, rot: -12 }, // (0,0)
  { dx: 40, dy: -62, rot: 9 }, // (1,0)
  { dx: -64, dy: 6, rot: 14 }, // (0,1)
  { dx: -46, dy: 52, rot: -8 }, // (0,2)
  { dx: 12, dy: 66, rot: 11 }, // (1,2)
  { dx: 60, dy: 48, rot: -14 }, // (2,2)
] as const;

type CellsProps = {
  /** Colour of the signal cell. Omitted means the kit's brand lavender, exactly as in the official logo. */
  signal?: SignalId | "outline";
  assemble?: boolean;
};

/** The seven cells as an SVG group in the 96-unit box. Shared by `Mark` and `Lockup`. */
export function MarkCells({ signal, assemble = false }: CellsProps) {
  const fill = signal && signal !== "outline" ? signalVar(signal) : "#AB97FF";
  return (
    <g className="mk">
      {WHITE_CELLS.map((pos, i) => (
        <path
          key={`${pos[0]}${pos[1]}`}
          d={markCellPath(pos)}
          fill="#FFFFFF"
          className="mk-cell"
          style={
            assemble
              ? ({
                  "--dx": `${FLIGHT[i].dx}px`,
                  "--dy": `${FLIGHT[i].dy}px`,
                  "--rot": `${FLIGHT[i].rot}deg`,
                  "--delay": `${i * 50}ms`,
                } as React.CSSProperties)
              : undefined
          }
        />
      ))}
      {signal === "outline" ? (
        <path d={markRingPath(SIGNAL_CELL)} fill="#FFFFFF" fillRule="evenodd" />
      ) : assemble ? (
        <>
          {/* lands as an empty outline, then fills with colour, as in the outro */}
          <path d={markRingPath(SIGNAL_CELL)} fill={fill} fillRule="evenodd" className="mk-ring" />
          <path d={markSignalPath()} fill={fill} className="mk-fill" />
        </>
      ) : (
        <path d={markSignalPath()} fill={fill} className="mk-sig" />
      )}
    </g>
  );
}

type MarkProps = CellsProps & {
  /** Height and width in CSS pixels. The kit requires at least 32 px for the large master (§1.5). */
  size?: number;
  className?: string;
  title?: string;
};

/**
 * The seven-cell mark. With no `signal` it is pixel-identical to the kit symbol (verified by scripts/verify-brand.ts).
 * A recoloured `signal` makes it a *module mark*, a separate asset class (brand amendment, §1.5).
 */
export function Mark({ size = 96, className, title, signal, assemble }: MarkProps) {
  return (
    <svg
      viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <MarkCells signal={signal} assemble={assemble} />
    </svg>
  );
}

import { CELL, GAP, PITCH } from "@/brand/geometry";
import { signalVar, type SignalId } from "@/config/modules";

type Props = {
  rows: readonly string[];
  /** Cell size in CSS pixels. The 6:28 gap ratio of the mark is preserved. */
  cell: number;
  /** Colour of the `*` cell. */
  signal?: SignalId;
  /** Colour of `#` cells. Defaults to the surface's cell colour (`--cell`). */
  on?: string;
  className?: string;
  /** Accessible name. Omit for purely decorative bitmaps. */
  label?: string;
};

/** Renders a bitmap as cells on the 28-unit grid. Server component: no JS shipped. */
export function CellMatrix({ rows, cell, signal, on = "var(--cell)", className, label }: Props) {
  const cols = Math.max(...rows.map((r) => r.length));
  const vbW = cols * PITCH - GAP;
  const vbH = rows.length * PITCH - GAP;
  const k = cell / CELL;
  const uses: React.ReactNode[] = [];
  rows.forEach((row, j) => {
    [...row].forEach((ch, i) => {
      if (ch === ".") return;
      uses.push(
        <use
          key={`${i}-${j}`}
          href="#ch-cell"
          x={i * PITCH}
          y={j * PITCH}
          fill={ch === "*" ? (signal ? signalVar(signal) : on) : on}
        />,
      );
    });
  });
  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      width={+(vbW * k).toFixed(2)}
      height={+(vbH * k).toFixed(2)}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {uses}
    </svg>
  );
}

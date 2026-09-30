import qrcode from "qrcode-generator";
import { GAP, PITCH, srrect } from "@/brand/geometry";

/**
 * A QR code drawn in cells (§1.12 S8). Data modules are the brand cell; the three finder patterns are drawn as solid
 * connected shapes so scanners still lock on. Rendered on the server, so the generator ships no client JS.
 * It must be test-scanned on real phones before launch (§1.12).
 */
export function CellQR({
  value,
  size = 176,
  label,
}: {
  value: string;
  size?: number;
  label: string;
}) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 3; // modules of quiet zone on the plate (spec asks for 4; 3 holds up with the solid finders)
  const side = (n + 2 * quiet) * PITCH - GAP;

  const inFinder = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (inFinder(r, c) || !qr.isDark(r, c)) continue;
      cells.push(<use key={`${r}-${c}`} href="#ch-cell" x={(c + quiet) * PITCH} y={(r + quiet) * PITCH} />);
    }
  }

  // finder pattern: outer ring (7 modules), hole (5), centre block (3), all on the module grid
  const finder = (mr: number, mc: number) => {
    const x = (mc + quiet) * PITCH;
    const y = (mr + quiet) * PITCH;
    const span = (k: number) => k * PITCH - GAP;
    return (
      srrect(x, y, span(7), span(7), 14, 0.28) +
      srrect(x + PITCH, y + PITCH, span(5), span(5), 7, 0.28) +
      srrect(x + 2 * PITCH, y + 2 * PITCH, span(3), span(3), 9, 0.28)
    );
  };
  const finders = finder(0, 0) + finder(0, n - 7) + finder(n - 7, 0);

  return (
    <svg
      viewBox={`0 0 ${side} ${side}`}
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className="qr"
      shapeRendering="geometricPrecision"
    >
      <rect width={side} height={side} fill="#FFFFFF" />
      <g fill="#0D0A1B">
        {cells}
        <path d={finders} fillRule="evenodd" />
      </g>
    </svg>
  );
}

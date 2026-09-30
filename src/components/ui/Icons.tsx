/**
 * The tiny UI glyph set (§1.10): 24 px grid, 1.75 px stroke, square caps. No icon library, no emoji.
 * Module icons are the cell pictograms, not these.
 */
type P = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  viewBox: "0 0 24 24",
  width: size,
  height: size,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  className,
  "aria-hidden": true as const,
  focusable: "false" as const,
});

export const ArrowRight = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const Menu = ({ size = 24, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const Close = ({ size = 24, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const External = ({ size = 16, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M8 6h10v10M18 6L6 18" />
  </svg>
);

export const Play = ({ size = 24, className }: P) => (
  <svg {...base(size, className)} fill="currentColor">
    <path d="M8 5l11 7-11 7z" />
  </svg>
);

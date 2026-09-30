import { SPRITE_CELL_D, cellRingPath } from "@/brand/geometry";

type Props = Omit<React.ComponentPropsWithoutRef<"a">, "children"> & {
  /** Which surface the button sits on: white button on ink, ink button on paper (§1.12 S1). */
  surface?: "ink" | "paper";
  size?: "md" | "lg";
  /** Full width at every size. */
  full?: boolean;
  /** Full width on phones only (the hero CTA: thumb-sized on mobile, natural width beside the headline on desktop). */
  fullMobile?: boolean;
  children: React.ReactNode;
};

/**
 * The primary CTA. One visual style, two surfaces. A cell sits inside the button as an empty outline and lights
 * (fills with lavender, the "Light" motion) on hover, press or keyboard focus. This is the only place lavender meets a
 * button, and it is still just a cell (law 2). See `.cell-btn` in globals.css.
 */
export function CellButton({ surface = "ink", size = "lg", full, fullMobile, className = "", children, ...rest }: Props) {
  return (
    <a
      {...rest}
      className={`cell-btn cell-btn--${surface} ${size === "lg" ? "cell-btn--lg" : ""} ${full ? "w-full" : ""} ${fullMobile ? "max-md:w-full" : ""} ${className}`}
    >
      <svg className="cell-btn__cell" viewBox="0 0 28 28" width="20" height="20" aria-hidden="true" focusable="false">
        <path className="cb-ring" d={cellRingPath(4)} fillRule="evenodd" />
        <path className="cb-fill" d={SPRITE_CELL_D} />
      </svg>
      <span>{children}</span>
    </a>
  );
}

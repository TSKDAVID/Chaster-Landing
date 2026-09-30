"use client";

import { SPRITE_CELL_D, cellRingPath } from "@/brand/geometry";
import { signalVar, type ModuleId } from "@/config/modules";

/**
 * A switch built from a cell (§1.12 S5): an empty outline means off, a solid cell in the module's signal colour means
 * on. Accessible as a switch named after the module.
 */
export function CellToggle({
  module: id,
  label,
  checked,
  onChange,
  onPreview,
  describedBy,
}: {
  module: ModuleId;
  label: string;
  checked: boolean;
  onChange: () => void;
  /** Hover and focus report the module so the plan panel's mark can show its colour. */
  onPreview?: (id: ModuleId | null) => void;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      className="cell-toggle"
      data-on={checked}
      onClick={onChange}
      onMouseEnter={() => onPreview?.(id)}
      onMouseLeave={() => onPreview?.(null)}
      onFocus={() => onPreview?.(id)}
      onBlur={() => onPreview?.(null)}
    >
      <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true" focusable="false">
        <path className="ct-ring" d={cellRingPath(3.5)} fillRule="evenodd" />
        <path className="ct-fill" d={SPRITE_CELL_D} style={{ fill: signalVar(id) }} />
      </svg>
    </button>
  );
}

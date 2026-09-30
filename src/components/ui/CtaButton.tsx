"use client";

import { track } from "@/lib/analytics";
import { usePlan } from "@/state/plan";
import { CellButton } from "./CellButton";

/** The connect CTA. Its href always carries the current plan and business type (§1.11), so every CTA is a client island. */
export function CtaButton({
  section,
  surface,
  size,
  full,
  fullMobile,
  className,
  children,
}: {
  section: string;
  surface?: "ink" | "paper";
  size?: "md" | "lg";
  full?: boolean;
  fullMobile?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const { href } = usePlan();
  return (
    <CellButton
      href={href}
      surface={surface}
      size={size}
      full={full}
      fullMobile={fullMobile}
      className={className}
      data-section={section}
      onClick={() => track("cta_click", { section })}
    >
      {children}
    </CellButton>
  );
}

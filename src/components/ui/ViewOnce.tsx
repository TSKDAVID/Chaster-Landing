"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `is-in` the first time the element enters the viewport (§1.9 "Assemble" on the final call).
 * Below the fold it sets `is-waiting` first so the cells start hidden; if JavaScript never runs the content simply shows.
 * The class changes go straight to the DOM, so nothing re-renders.
 */
export function ViewOnce({
  children,
  className = "",
  threshold = 0.4,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.classList.add("is-in");
      return;
    }
    el.classList.add("is-waiting");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.remove("is-waiting");
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

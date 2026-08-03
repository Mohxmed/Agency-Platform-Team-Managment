"use client";

import { useLayoutEffect, useRef, useState } from "react";

/* =========================================================
   Seamless infinite marquee
   - Slides are sized to the container / visible-count so:
     mobile shows 1, tablet 2, desktop 3.
   - The track renders two identical copies and animates a
     transform (GPU) from 0 → -50% (exactly one copy), so the
     loop is pixel-perfect and never jumps, stalls or jitters.
   - All slides stretch to the tallest one → equal card heights.
========================================================= */

const SLOT_SECONDS = 7;

function getVisibleCount() {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 768px)").matches) return 2;
  return 1;
}

export default function Marquee({
  children,
  duration = null,
  slideClassName = "",
}) {
  const items = Array.isArray(children) ? children : [children];
  const containerRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(null);
  const [loopSeconds, setLoopSeconds] = useState(21);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const width = container.getBoundingClientRect().width;
      const visible = getVisibleCount();
      setSlideWidth(width > 0 ? width / visible : null);
      setLoopSeconds(visible * SLOT_SECONDS);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  if (items.length === 0) return null;

  const trackDuration = duration ?? loopSeconds;

  return (
    <div ref={containerRef} className="marquee">
      <div
        className="marquee-track"
        style={{ animationDuration: `${trackDuration}s` }}
      >
        {items.map((child, index) => (
          <div
            key={`a-${index}`}
            className={`marquee-slide ${slideClassName}`}
            style={{ width: slideWidth ?? undefined }}
          >
            {child}
          </div>
        ))}

        {items.map((child, index) => (
          <div
            key={`b-${index}`}
            aria-hidden
            className={`marquee-slide ${slideClassName}`}
            style={{ width: slideWidth ?? undefined }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

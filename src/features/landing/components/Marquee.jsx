"use client";

export default function Marquee({
  children,
  duration = 30,
  slideClassName = "",
}) {
  const items = Array.isArray(children) ? children : [children];

  if (items.length === 0) return null;

  return (
    <div className="marquee">
      <div
        className="marquee-track"
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {items.map((child, index) => (
          <div
            key={`a-${index}`}
            className={`marquee-slide ${slideClassName}`}
          >
            {child}
          </div>
        ))}

        {items.map((child, index) => (
          <div
            key={`b-${index}`}
            aria-hidden
            className={`marquee-slide ${slideClassName}`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

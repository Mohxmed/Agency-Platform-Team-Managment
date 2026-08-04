import React from "react";

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 -z-20 h-125 w-5xl -translate-x-1/2 rounded-full [background:radial-gradient(ellipse_at_center,rgba(217,4,41,0.20),transparent_60%)]" />
  );
}

export default BackgroundGlow;

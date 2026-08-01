import React from "react";

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 -z-20 h-125 w-5xl -translate-x-1/2 rounded-full bg-primary-500/20 blur-[120px]" />
  );
}

export default BackgroundGlow;

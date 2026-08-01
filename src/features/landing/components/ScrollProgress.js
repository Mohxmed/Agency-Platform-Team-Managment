"use client";
import { useEffect, useState } from "react";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      setProgress(scrollPercentage);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className=" fixed top-0 left-0 z-[999] w-full h-[3px] bg-transparent">
      <div
        className="h-full bg-primary-700 transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
export default ScrollProgress;

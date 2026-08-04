"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

function parseNumericValue(value) {
  const str = String(value).trim();
  const suffixMatch = str.match(/^([\d.,]+)([KM%]?)$/);
  if (!suffixMatch) return { num: 0, suffix: "", prefix: "" };

  let prefix = "";
  let numStr = suffixMatch[1];
  const suffix = suffixMatch[2];

  if (str.startsWith("+")) {
    prefix = "+";
    numStr = numStr.replace("+", "");
  }

  const num = parseFloat(numStr.replace(/,/g, ""));
  return { num, suffix, prefix };
}

function formatNumber(num, suffix) {
  if (suffix === "K") {
    return (num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, "") + "K" : num.toLocaleString()) + "+";
  }
  if (suffix === "M") {
    return (num >= 1000000 ? (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M" : num.toLocaleString()) + "+";
  }
  if (suffix === "%") {
    return num.toFixed(1).replace(/\.0$/, "") + "%";
  }
  return num.toLocaleString() + "+";
}

export default function AnimatedCounter({
  value,
  className = "",
  duration = 2000,
  delay = 0,
  easing = [0.22, 1, 0.36, 1],
  prefix = "",
  suffix = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const startedRef = useRef(false);
  const [displayValue, setDisplayValue] = useState("0");

  const { num: targetNum, suffix: parsedSuffix, prefix: parsedPrefix } = parseNumericValue(value);
  const finalPrefix = prefix || parsedPrefix;
  const finalSuffix = suffix || parsedSuffix;

  useEffect(() => {
    if (!isInView || startedRef.current) return;

    startedRef.current = true;
    const startTime = Date.now() + delay;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentNum = targetNum * eased;
      setDisplayValue(`${finalPrefix}${formatNumber(currentNum, finalSuffix)}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(`${finalPrefix}${formatNumber(targetNum, finalSuffix)}`);
      }
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, targetNum, duration, delay, finalPrefix, finalSuffix]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
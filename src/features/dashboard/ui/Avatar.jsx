"use client";

import { useState } from "react";

export default function Avatar({
  user = null,
  name = "",
  src = "",
  size = 32,
  className = "",
  ring = false,
}) {
  const [error, setError] = useState(false);

  const userName = name || user?.name || "";
  const photoSrc = src || user?.photoURL || "";

  const hasPhoto = Boolean(photoSrc) && !error;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/70 font-black text-white select-none ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      title={userName}
    >
      {hasPhoto ? (
        <img
          src={photoSrc}
          alt={userName}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <span className="drop-shadow-sm">
          {(userName || "؟").slice(0, 1)}
        </span>
      )}

      {ring && (
        <span className="absolute inset-0 rounded-full ring-2 ring-white/80 dark:ring-black/40" />
      )}
    </span>
  );
}

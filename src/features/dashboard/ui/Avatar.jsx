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
  const imageSrc = src || user?.logo || user?.photoURL || "";

  const avatarSeed =
    user?.name || userName || user?.email || user?.id || "user";

  // Gender-neutral cartoon avatar (Discord/Apple-style) based on a stable seed.
  const fallbackSrc = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(
    avatarSeed,
  )}&backgroundColor=b6e3f4,c0aede,ffd5dc,ffdfbf`;

  const hasPhoto = Boolean(imageSrc) && !error;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/70 font-black text-white select-none ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      title={userName}
    >
      {hasPhoto ? (
        <img
          src={imageSrc}
          alt={userName}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <img
          src={fallbackSrc}
          alt={userName}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}

      {ring && (
        <span className="absolute inset-0 rounded-full ring-2 ring-white/80 dark:ring-black/40" />
      )}
    </span>
  );
}

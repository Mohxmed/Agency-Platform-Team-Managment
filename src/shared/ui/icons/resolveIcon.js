import * as Icons from "lucide-react";

export function resolveIcon(name, fallback) {
  const fallbackIcon = fallback || Icons.Sparkles;
  if (typeof name === "string" && Icons[name]) {
    return Icons[name];
  }
  return fallbackIcon;
}

// Centralized className merging utility.
// Wraps clsx so every component imports className logic from one place,
// making it trivial to swap/extend (e.g. adding tailwind-merge) later.

import clsx from "clsx";

export function cn(...inputs) {
  return clsx(...inputs);
}

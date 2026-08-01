"use client";

import { usePathname } from "next/navigation";

import { getPageTheme } from "@/constants/pageThemes";

export function usePageTheme() {
  const pathname = usePathname();

  return getPageTheme(pathname);
}

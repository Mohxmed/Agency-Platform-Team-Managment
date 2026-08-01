"use client";

import { useEffect } from "react";
import { initConsole } from "@/lib";

export default function AppInitializer() {
  useEffect(() => {
    initConsole();
  }, []);

  return null;
}

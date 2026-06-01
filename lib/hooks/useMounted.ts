"use client";
import { useEffect, useState } from "react";

// Client-only mount guard. Returns false on the server and on the first client
// paint, then true — so components can render SSR-safe defaults before reading
// localStorage, avoiding hydration mismatches.
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

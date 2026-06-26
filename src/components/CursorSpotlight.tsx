"use client";

import { useEffect } from "react";

/** A global cursor spotlight overlay that follows the mouse, for arcade mood. */
export function CursorSpotlight() {
  useEffect(() => {
    const el = document.getElementById("cursor-spotlight");
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div id="cursor-spotlight" className="spotlight hidden sm:block" />;
}
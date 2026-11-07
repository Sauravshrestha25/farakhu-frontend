"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

let smoother: ScrollSmoother | null = null;
let resolveReady: (s: ScrollSmoother | null) => void;
export const smootherReady = new Promise<ScrollSmoother | null>((r) => (resolveReady = r));
export const getSmoother = () => smoother;

// Fixed UI (nav, preloader) must live outside this wrapper: ScrollSmoother transforms the content.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (history.scrollRestoration) history.scrollRestoration = "manual";
    scrollTo(0, 0);
    gsap.defaults({ ease: "none" });
    gsap.config({ force3D: true });
    // Two frames so every section has registered its triggers first.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const desktop = matchMedia("(hover: hover) and (pointer: fine)").matches;
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (desktop && !reduce) {
          // ponytail: no normalizeScroll. It swallows pointerdown page-wide and broke drag strips (What's on).
          smoother = ScrollSmoother.create({ wrapper: "#smooth-wrapper", content: "#smooth-content", smooth: 1, effects: false });
        }
        ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
        resolveReady(smoother);
      }),
    );
    return () => {
      cancelAnimationFrame(id);
      smoother?.kill();
      smoother = null;
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}

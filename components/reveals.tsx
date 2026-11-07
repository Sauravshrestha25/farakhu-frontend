"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

// [data-heading]: lines rise in at 80%, reset when scrolled back below the fold. [data-body]: fades.
export function Reveals() {
  useGSAP(() => {
    const split = SplitText.create("[data-heading]", { type: "lines", mask: "lines", linesClass: "line" });
    gsap.set(split.lines, { paddingTop: "0.1em", paddingBottom: "0.1em", marginTop: "-0.1em" });
    const arm = (el: Element, tl: gsap.core.Timeline) => {
      ScrollTrigger.create({ trigger: el, start: "top bottom", onLeaveBack: () => tl.progress(0).pause() });
      ScrollTrigger.create({ trigger: el, start: "top 80%", onEnter: () => tl.play() });
    };
    gsap.utils.toArray<HTMLElement>("[data-heading]").forEach((el) =>
      arm(el, gsap.timeline({ paused: true }).from(el.querySelectorAll(".line"), { yPercent: 100, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.05 })),
    );
    gsap.utils.toArray<HTMLElement>("[data-body]").forEach((el) =>
      arm(el, gsap.timeline({ paused: true }).from(el, { opacity: 0, duration: 1, ease: "power4.out" })),
    );
    return () => split.revert();
  });
  return null;
}

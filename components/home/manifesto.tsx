"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".meaning-word", {
      yPercent: 110,
      stagger: 0.12,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: root.current, start: "top 72%" },
    });
    gsap.from(".meaning-copy", {
      opacity: 0,
      y: 24,
      duration: 0.8,
      scrollTrigger: { trigger: root.current, start: "top 55%" },
    });
  }, { scope: root });

  return (
    <section ref={root} id="about" className="bg-bone px-5 py-28 md:px-8 md:py-44">
      <div className="grid gap-14 md:grid-cols-12 md:gap-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] md:col-span-2">Meaning:</p>
        <div className="md:col-span-8 md:col-start-4">
          <div className="mb-20 flex items-end gap-4 border-b border-teal/30 pb-4">
            <span className="diamond size-4 bg-teal" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Farak Chu</span>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <div className="overflow-hidden border-t border-teal/30 pt-4">
              <h2 className="meaning-word font-display text-[clamp(4.5rem,10vw,10rem)] font-black uppercase leading-[0.76] tracking-[-0.06em]">Farak</h2>
              <p className="meaning-copy mt-8 max-w-xs text-lg leading-tight">Different. Not the same as the rest of the room.</p>
            </div>
            <div className="overflow-hidden border-t border-teal/30 pt-4">
              <h2 className="meaning-word font-display text-[clamp(4.5rem,10vw,10rem)] font-black uppercase leading-[0.76] tracking-[-0.06em]">Chu</h2>
              <p className="meaning-copy mt-8 max-w-xs text-lg leading-tight">I am. Said with your chest.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

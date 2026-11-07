"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { lately, site } from "@/content/site";

export function Lately() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".project-row", {
      clipPath: "inset(0 0 100% 0)",
      stagger: 0.12,
      duration: 1.1,
      ease: "expo.inOut",
      scrollTrigger: { trigger: root.current, start: "top 68%" },
    });
  }, { scope: root });

  return (
    <section ref={root} className="bg-bone px-5 pb-28 md:px-8 md:pb-44">
      <div className="grid gap-14 md:grid-cols-12 md:gap-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] md:col-span-2">The house / 01</p>
        <div className="md:col-span-9 md:col-start-4">
          <a href={site.instagram} target="_blank" rel="noreferrer" className="project-row group block border-t border-teal/30 py-5 md:py-8">
            <div className="grid items-center gap-5 md:grid-cols-12">
              <div className="md:col-span-7"><p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em]">Entertainment / Explore</p><h2 className="font-display text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.05em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3">The nights</h2></div>
              <Image src={lately[3].image.src} alt={lately[3].image.alt} width={540} height={360} className="h-48 w-full object-cover grayscale transition-transform duration-1000 ease-out-expo group-hover:scale-105 md:col-span-5 md:h-64" />
            </div>
          </a>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="project-row group block border-t border-teal/30 py-5 md:py-8">
            <div className="grid items-center gap-5 md:grid-cols-12">
              <div className="md:col-span-7"><p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em]">Gaming Zone / Explore</p><h2 className="font-display text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.05em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3">The games</h2></div>
              <Image src={lately[0].image.src} alt={lately[0].image.alt} width={540} height={360} className="h-48 w-full object-cover grayscale transition-transform duration-1000 ease-out-expo group-hover:scale-105 md:col-span-5 md:h-64" />
            </div>
          </a>
        </div>
      </div>
      <p className="mt-28 max-w-4xl text-[clamp(2.2rem,4.5vw,5rem)] leading-[0.94] tracking-[-0.04em] md:ml-[25%]">Farakchu is a home in Samakhusi for people who would rather not blend in. We throw the nights, run the brackets, print the threads and pour the coffee.</p>
    </section>
  );
}

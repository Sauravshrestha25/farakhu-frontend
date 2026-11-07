"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { home } from "@/content/site";

export function House() {
  const root = useRef<HTMLElement>(null);
  const { heading, steps, conclusion, conclusionBody } = home.house;

  useGSAP(
    () => {
      const imgs = gsap.utils.toArray<HTMLElement>(".h-img");
      const show = (i: number) =>
        imgs.forEach((el, j) =>
          gsap.to(el, { clipPath: j <= i ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)", duration: 0.9, ease: "expo.inOut", overwrite: true }),
        );
      gsap.utils.toArray<HTMLElement>(".h-step").forEach((step, i) => {
        ScrollTrigger.create({ trigger: step, start: "top 60%", end: "bottom 60%", onToggle: (s) => s.isActive && show(i) });
        gsap.fromTo(step, { opacity: 0.2 }, { opacity: 1, scrollTrigger: { trigger: step, start: "top 75%", end: "top 50%", scrub: true } });
      });
      gsap.from(".h-c", {
        yPercent: 100,
        stagger: 0.1,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".h-conc", start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="house" className="relative z-10 bg-bone px-5 py-28 text-teal md:px-8 md:py-40">
      <h2 className="font-wide max-w-[14ch] text-[clamp(2.6rem,6.5vw,7rem)] leading-[0.88]">{heading}</h2>

      <div className="mt-20 grid gap-10 md:mt-32 md:grid-cols-2 md:gap-8">
        <div className="hidden md:block">
          <div className="sticky top-[12vh] aspect-[4/5] w-full max-w-[560px] overflow-hidden">
            {steps.map((s, i) => (
              <div key={s.title} className="h-img absolute inset-0" style={{ clipPath: i ? "inset(100% 0 0 0)" : "inset(0% 0 0 0)" }}>
                <Image src={s.image} alt="" fill sizes="40vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <ol>
          {steps.map((s, i) => (
            <li key={s.title} className="h-step grid grid-cols-[3rem_1fr] gap-4 border-t border-teal/25 py-10 md:min-h-[42vh]">
              <span className="font-wide text-sm">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-serif text-5xl leading-none md:text-7xl">{s.title}</h3>
                <p className="mt-5 max-w-md text-justify text-xs uppercase leading-snug md:text-sm">{s.body}</p>
                <div className="relative mt-6 aspect-[4/3] overflow-hidden md:hidden">
                  <Image src={s.image} alt="" fill sizes="90vw" className="object-cover" />
                </div>
              </div>
            </li>
          ))}
          <li className="h-conc border-t border-teal/25 pt-10">
            <p className="font-wide text-[clamp(2rem,3.9vw,4.4rem)] leading-[0.9]">
              {conclusion.map((c) => (
                <span key={c} className="block overflow-hidden">
                  <span className="h-c block">{c}</span>
                </span>
              ))}
            </p>
            <p className="mt-8 max-w-sm text-justify text-xs uppercase leading-snug md:text-sm">{conclusionBody}</p>
          </li>
        </ol>
      </div>
    </section>
  );
}

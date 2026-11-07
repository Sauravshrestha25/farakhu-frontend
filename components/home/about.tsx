"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { home } from "@/content/site";

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=180%", pin: true, scrub: 1 },
      });
      tl.fromTo(".a-img", { scale: 1.2 }, { scale: 1, ease: "none", duration: 1 }, 0)
        .fromTo(".a-w", { opacity: 0.12 }, { opacity: 1, stagger: 0.04, ease: "none", duration: 0.6 }, 0.05)
        .fromTo(".a-p", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, 0.65)
        .to(".a-tint", { opacity: 0.75, ease: "none", duration: 0.3 }, 0.7);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative h-svh overflow-hidden bg-teal-deep text-bone">
      <Image src={home.about.image.src} alt={home.about.image.alt} fill sizes="100vw" className="a-img object-cover" />
      <div className="a-tint absolute inset-0 bg-teal-deep opacity-45" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center md:px-10">
        <h2 className="font-wide max-w-[17ch] text-[clamp(2rem,5.2vw,5.6rem)] leading-[0.95]">
          {home.about.heading.split(" ").map((w, i) => (
            <span key={i} className="a-w">
              {w}{" "}
            </span>
          ))}
        </h2>
        <p className="a-p mt-10 max-w-sm text-justify text-xs uppercase leading-snug md:text-sm">{home.about.body}</p>
      </div>
    </section>
  );
}

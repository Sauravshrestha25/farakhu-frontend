"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { home } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// One pinned scene: hero photo -> thin column -> tilted strip between Farak/Chu -> splits into two full-height panels.
// ponytail: animates width/height/left/top (layout props). Fine for 3 boxes; switch to transforms if it janks on low-end phones.
export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const W = () => innerWidth;
      const H = () => innerHeight;
      const mobile = () => innerWidth < 768;
      const box = (l: number, t: number, w: number, h: number, r = 0) => ({
        left: () => W() * l,
        top: () => H() * t,
        width: () => W() * w,
        height: () => H() * h,
        rotate: r,
      });

      const start = () => (mobile() ? box(0.12, 0, 0.76, 1) : box(0.3, 0, 0.4, 1));
      gsap.set(".i-p", start());
      gsap.set(".i-a", { ...box(0.29, 0.435, 0.21, 0.13, -12), autoAlpha: 0 });
      gsap.set(".i-b", { ...box(0.5, 0.435, 0.21, 0.13, -12), autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".i-h", { yPercent: -30, autoAlpha: 0, duration: 0.8 }, 0)
        .to(".i-p", { ...box(0.42, 0, 0.16, 1), duration: 1 }, 0)
        .fromTo(".i-m", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, 0.6)
        .to(".i-p", { ...box(0.29, 0.435, 0.42, 0.13, -12), duration: 1 }, 1)
        .set([".i-a", ".i-b"], { autoAlpha: 1 }, 2)
        .set(".i-p", { autoAlpha: 0 }, 2)
        .to(".i-a", { ...box(0, 0, 0.5, 0.36), duration: 0.9 }, 2)
        .to(".i-b", { ...box(0.5, 0.64, 0.5, 0.36), duration: 0.9 }, 2)
        .to(".i-m1", { x: () => (mobile() ? 0 : W() * 0.2), duration: 0.9 }, 2)
        .to(".i-m2", { x: () => (mobile() ? 0 : -W() * 0.2), duration: 0.9 }, 2)
        .to(".i-a", { ...box(0, 0, 0.5, 1), duration: 1 }, 3)
        .to(".i-b", { ...box(0.5, 0, 0.5, 1), duration: 1 }, 3)
        .to(".i-m", { autoAlpha: 0, duration: 0.4 }, 3)
        .fromTo(".i-f", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5 }, 3.6)
        .to({}, { duration: 0.6 });

      gsap.from(".i-h-line", { yPercent: 100, duration: 1.3, stagger: 0.1, ease: "expo.out", delay: 2.6 }); // after preloader
      gsap.from(".i-p-img", { scale: 1.25, duration: 2, ease: "expo.out", delay: 2.4 });
    },
    { scope: root },
  );

  const [m1, m2] = home.meaning;

  return (
    <section ref={root} id="top" className="relative h-svh overflow-hidden bg-bone text-teal">
      <div className="i-p absolute overflow-hidden will-change-transform">
        <Image src={home.hero.image.src} alt={home.hero.image.alt} fill priority sizes="40vw" className="i-p-img object-cover" />
      </div>

      {home.films.map((f, i) => (
        <a
          key={f.no}
          href={f.href}
          target="_blank"
          rel="noreferrer"
          className={`${i ? "i-b" : "i-a"} group absolute block overflow-hidden`}
        >
          <Image src={f.image.src} alt={f.image.alt} fill sizes="50vw" className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-b from-teal-deep/60 via-transparent to-teal-deep/50" />
          <span className="absolute inset-x-6 top-24 font-serif text-[clamp(3rem,7vw,7.5rem)] leading-[0.85] text-bone md:inset-x-10">
            {f.title.map((t) => (
              <span key={t} className="i-f block">
                {t}
              </span>
            ))}
          </span>
          <span className="i-f absolute bottom-8 left-6 font-wide text-sm text-bone md:left-10">{f.no}</span>
          <span className="i-f absolute bottom-6 right-6 rounded-full bg-bone px-6 py-3 font-wide text-xs text-teal transition-colors group-hover:bg-teal group-hover:text-bone md:right-10">
            Explore
          </span>
        </a>
      ))}

      <div className="i-m i-m1 absolute left-5 top-[20%] w-[42vw] md:left-[5vw] md:top-[38%] md:w-[20vw]">
        <h2 className="font-serif text-[clamp(4rem,8vw,8rem)] leading-[0.85]">{m1.word}</h2>
        <p className="mt-6 text-justify text-xs uppercase leading-snug md:text-sm">{m1.body}</p>
      </div>
      <div className="i-m i-m2 absolute right-5 top-[62%] w-[42vw] md:right-[5vw] md:top-[38%] md:w-[20vw]">
        <h2 className="font-serif text-[clamp(4rem,8vw,8rem)] leading-[0.85]">{m2.word}</h2>
        <p className="mt-6 text-justify text-xs uppercase leading-snug md:text-sm">{m2.body}</p>
      </div>

      <h1 className="i-h pointer-events-none absolute inset-x-0 bottom-4 px-4 md:bottom-6 md:px-8">
        <span className="sr-only">Farakchu. {home.hero.lines.join(" ")}.</span>
        {home.hero.lines.map((line, i) => (
          <span key={line} className="block overflow-hidden" aria-hidden>
            <svg viewBox="0 0 1000 128" className="i-h-line block w-full overflow-visible">
              <text
                x="0"
                y="118"
                textLength={i ? 880 : 1000}
                lengthAdjust="spacingAndGlyphs"
                className="fill-teal"
                style={{ fontFamily: "var(--font-sans)", fontStretch: "125%", fontWeight: 900, fontSize: 150 }}
              >
                {line.toUpperCase()}
              </text>
            </svg>
          </span>
        ))}
      </h1>
    </section>
  );
}

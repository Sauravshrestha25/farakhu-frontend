"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "../logo-mark";
import { getSmoother } from "../smooth-scroll";
import { divisions, events, guests, site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

/* ───────────── Hero: emblem + giant wordmark over the house (Il Capo) ───────────── */

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.fromTo(q(".h3-photo"), { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: st });
      gsap.to(q(".h3-word"), { yPercent: -35, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative h-svh overflow-hidden bg-teal-deep text-bone">
      <div className="h3-photo absolute inset-0">
        <Image src={site.hero.src} alt={site.hero.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-deep/60 via-teal-deep/20 to-teal-deep/80" />
      </div>

      <LogoMark className="absolute left-1/2 top-[14svh] size-[clamp(5rem,9vw,8rem)] -translate-x-1/2 text-lime" title="" />
      <p className="absolute left-1/2 top-[calc(14svh+clamp(5rem,9vw,8rem)+1.25rem)] -translate-x-1/2 whitespace-nowrap font-serif text-xl lg:text-2xl">
        Farak Chu. I am different.
      </p>

      <h1 data-hero className="h3-word absolute inset-x-0 -bottom-[0.18em] text-center font-wide text-[15.6vw] leading-none text-lime">
        Farakchu
      </h1>
    </section>
  );
}

/* ───────────── Index: one strip of moments, a diamond lens, a list that follows (Obys) ───────────── */

// Posters and people, alternating.
const posters = events.map((e) => ({ title: e.title, meta: e.meta, side: "On the big screen", image: e.image }));
const people = guests.map((g) => ({ title: g.name, meta: g.note, side: "Who's been", image: g.image }));
const moments = posters.flatMap((p, i) => (people[i] ? [p, people[i]] : [p]));

export function IndexStrip() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      // ponytail: GSAP pin, not CSS sticky (ScrollSmoother's transform breaks sticky).
      ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", pin: ".ix-frame", pinSpacing: false });
      const thumbs = gsap.utils.toArray<HTMLElement>(".ix-thumb", root.current);
      thumbs.forEach((t, i) =>
        ScrollTrigger.create({ trigger: t, start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setActive(i) }),
      );
    },
    { scope: root },
  );

  const go = (i: number) => {
    const el = root.current?.querySelectorAll<HTMLElement>(".ix-thumb")[i];
    if (!el) return;
    const s = getSmoother();
    if (s) s.scrollTo(el, true, "center center");
    else el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const m = moments[active];

  return (
    <section ref={root} id="whats-on" className="relative bg-teal-deep text-bone">
      {/* Fixed frame: list, lens, meta. Strip scrolls under it. */}
      <div className="ix-frame pointer-events-none relative z-10 h-svh">
        <ol className="pointer-events-auto absolute left-4 top-1/2 hidden -translate-y-1/2 lg:left-8 lg:block">
          {moments.map((x, i) => (
            <li key={x.title}>
              <button
                type="button"
                onClick={() => go(i)}
                className={`text-left text-sm leading-[1.35] transition-colors duration-300 hover:text-lime ${i === active ? "text-bone" : "text-bone/25"}`}
              >
                {x.title}
              </button>
            </li>
          ))}
        </ol>

        {/* Diamond lens: two chevrons framing the centre thumbnail. */}
        <div className="absolute left-1/2 top-1/2 flex h-[30svh] w-[min(52vw,30rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-between max-lg:w-[86vw]">
          {[0, 1].map((k) => (
            <svg key={k} viewBox="0 0 40 100" className="h-full w-auto text-lime" fill="none" aria-hidden>
              <path d={k ? "M4 2 L36 50 L4 98" : "M36 2 L4 50 L36 98"} stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
          ))}
        </div>

        <div className="absolute left-[calc(50%-min(26vw,15rem)-2rem)] top-1/2 hidden -translate-x-full -translate-y-1/2 text-right text-sm lg:block">{m.side}</div>
        <div className="absolute left-[calc(50%+min(26vw,15rem)+2rem)] top-1/2 hidden max-w-[15rem] -translate-y-1/2 text-sm lg:block">
          {m.meta}
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-wide text-[0.625rem] tabular-nums lg:right-8">
          {String(active + 1).padStart(2, "0")}
        </div>

        <div className="absolute inset-x-4 bottom-8 text-center lg:hidden">
          <p className="font-serif text-2xl">{m.title}</p>
          <p className="mt-1 text-xs text-bone/60">{m.meta}</p>
        </div>
      </div>

      <div className="relative -mt-[100svh] flex flex-col items-center gap-2 py-[50svh]">
        {moments.map((x, i) => (
          <button
            key={x.title}
            type="button"
            onClick={() => go(i)}
            aria-label={x.title}
            className={`ix-thumb relative w-[min(17vw,13rem)] overflow-hidden transition-[filter,opacity] duration-500 max-lg:w-[42vw] ${i % 3 === 1 ? "aspect-[4/3]" : "aspect-[4/5]"} ${i === active ? "" : "opacity-60 grayscale"}`}
          >
            <Image src={x.image.src} alt={x.image.alt} fill sizes="(min-width: 992px) 13rem, 42vw" className="object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Columns: the four domains drift past the wordmark at their own speed (ViV) ───────────── */

const ig = (d: string, ns: number[]) => ns.map((n) => `/images/ig/${d}/${String(n).padStart(2, "0")}.jpg`);
const columns = [
  { id: "cafe", photos: ig("cafe", [2, 3, 17, 18, 22, 24, 9]), speed: 1 },
  { id: "entertainment", photos: ig("entertainment", [13, 22, 25, 29, 16, 24, 33]), speed: 1.35 },
  { id: "gamingzone", photos: ig("gamezone", [10, 14, 15, 9, 17, 16, 12]), speed: 0.8 },
  { id: "apparel", photos: ig("apparel", [5, 7, 12, 25, 17, 9, 28]), speed: 1.15 },
].map((c) => ({ ...c, d: divisions.find((d) => d.id === c.id)! }));

export function Columns() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", pin: ".cl-stage", pinSpacing: false });
      const cols = gsap.utils.toArray<HTMLElement>(".cl-col", root.current);
      cols.forEach((col, i) =>
        gsap.fromTo(
          col,
          { y: () => innerHeight * 0.85 },
          {
            y: () => -(col.offsetHeight * columns[i].speed - innerHeight * 0.2),
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
          },
        ),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="films" className="relative h-[260svh] bg-bone text-teal">
      <div className="cl-stage relative h-svh overflow-hidden">
        <div className="absolute inset-x-4 top-[30svh] flex flex-col items-center gap-6 lg:inset-x-8 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
          <h2 className="font-wide text-[15vw] leading-[0.85] lg:text-[13vw]">
            Farak<br />Chu
          </h2>
          <p className="max-w-[17rem] text-lg leading-snug lg:mt-[1.2vw] lg:text-2xl">
            Coffee, nights, games and <span className="hl px-1">threads.</span> One house in Samakhusi.
          </p>
        </div>

        <div className="absolute inset-x-2 top-0 flex justify-between lg:inset-x-8">
          {columns.map((c) => (
            <div key={c.id} className="cl-col flex w-[23%] flex-col gap-2 will-change-transform lg:w-[15vw] lg:gap-[1.5vw]">
              {c.photos.map((src, j) => (
                <div key={src} className={`relative overflow-hidden bg-teal ${j % 2 ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
                  <Image src={src} alt={`${c.d.name} at Farakchu`} fill sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
          ))}
        </div>

        <ul className="absolute inset-x-2 bottom-4 flex justify-between text-[0.6875rem] lg:inset-x-8 lg:bottom-6 lg:text-sm">
          {columns.map((c) => (
            <li key={c.id} className="w-[23%] lg:w-[15vw]">
              <a href={c.d.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-bone px-2 py-1 transition-colors hover:bg-lime">
                {c.d.name} <span aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

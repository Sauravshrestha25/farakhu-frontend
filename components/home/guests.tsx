"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { guests } from "@/content/site";

gsap.registerPlugin(Draggable, ScrollTrigger);

// Desktop scatter: left %, top %, rotation. Everything sits right of the heading column (left ~32vw).
const spots = [
  { l: 34, t: 6, r: -6 },
  { l: 50, t: 2, r: 5 },
  { l: 66, t: 8, r: -4 },
  { l: 82, t: 3, r: 6 },
  { l: 40, t: 52, r: 4 },
  { l: 58, t: 48, r: -7 },
  { l: 75, t: 53, r: 5 },
];

// One screen of polaroids. They drop in on scroll, straighten on hover, and can be dragged around (desktop).
export function Guests() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q(".gw-card") as HTMLElement[];
      const [wall] = q(".gw-wall") as HTMLElement[];

      gsap.from(q(".gw-head-line"), {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 992px)", () => {
        cards.forEach((c, i) => gsap.set(c, { rotation: spots[i % spots.length].r }));
        // Drop in from above, tumbling, one after another.
        gsap.from(cards, {
          y: () => -innerHeight * 0.9,
          rotation: (i) => spots[i % spots.length].r + (i % 2 ? 40 : -40),
          opacity: 0,
          duration: 1.2,
          stagger: 0.09,
          ease: "bounce.out",
          scrollTrigger: { trigger: root.current, start: "top 55%" },
        });

        let z = 10;
        const drags = Draggable.create(cards, {
          bounds: wall,
          dragClickables: true,
          zIndexBoost: false,
          onPress() {
            gsap.set(this.target, { zIndex: ++z });
          },
          onDragStart() {
            gsap.to(this.target, { scale: 1.06, rotation: 0, duration: 0.3, ease: "power3.out" });
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, duration: 0.5, ease: "back.out(2)" });
          },
        });
        const hover = (c: HTMLElement, i: number, on: boolean) => {
          if (on) gsap.set(c, { zIndex: ++z });
          gsap.to(c, { rotation: on ? 0 : spots[i % spots.length].r, scale: on ? 1.08 : 1, duration: 0.5, ease: "back.out(1.8)", overwrite: "auto" });
        };
        const offs = cards.map((c, i) => {
          const en = () => hover(c, i, true);
          const lv = () => hover(c, i, false);
          c.addEventListener("pointerenter", en);
          c.addEventListener("pointerleave", lv);
          return () => (c.removeEventListener("pointerenter", en), c.removeEventListener("pointerleave", lv));
        });
        return () => {
          drags.forEach((d) => d.kill());
          offs.forEach((o) => o());
        };
      });

      mm.add("(max-width: 991px)", () => {
        gsap.from(cards, { y: 60, opacity: 0, stagger: 0.07, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: wall, start: "top 80%" } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="guests" className="relative overflow-hidden bg-teal-deep px-4 py-24 text-bone lg:h-svh lg:min-h-[680px] lg:px-8 lg:py-0">
      <div className="relative z-20 lg:absolute lg:left-8 lg:top-28 lg:w-[30vw]">
        <h2 className="font-wide text-[clamp(2.6rem,5.2vw,5.5rem)] leading-[0.92]">
          <span className="block overflow-hidden">
            <span className="gw-head-line block">Who&apos;s been</span>
          </span>
          <span className="block overflow-hidden pt-[0.08em]">
            <span className="gw-head-line block">
              <span className="hl">through.</span>
            </span>
          </span>
        </h2>
        <p className="mt-6 max-w-[21.5rem] text-justify text-xs uppercase leading-[1.25] tracking-[0.025rem] text-bone/70">
          Bands, fighters, filmmakers and friends who pulled up, played, premiered or celebrated at the house.
          <span className="hidden lg:inline"> Go on, move them around.</span>
        </p>
      </div>

      <ul className="gw-wall relative mt-12 grid grid-cols-2 gap-5 lg:absolute lg:inset-0 lg:mt-0 lg:block">
        {guests.map((g, i) => {
          const s = spots[i % spots.length];
          return (
            <li
              key={g.name}
              className="gw-card group relative w-full cursor-grab touch-pan-y bg-bone p-2 pb-3 text-teal shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] active:cursor-grabbing max-lg:odd:rotate-[-3deg] max-lg:even:rotate-[3deg] lg:absolute lg:w-[15vw] lg:max-w-[240px] lg:p-2.5 lg:pb-4"
              style={{ left: `${s.l}%`, top: `${s.t}%` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-teal">
                <Image src={g.image.src} alt={g.image.alt} fill sizes="(min-width: 992px) 240px, 45vw" draggable={false} className="pointer-events-none object-cover" />
              </div>
              <div className="mt-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg leading-none lg:text-xl">{g.name}</h3>
                  <p className="mt-1 text-[0.625rem] uppercase leading-[1.25] tracking-[0.025rem] text-teal/60 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:max-h-12 lg:group-hover:opacity-100">
                    {g.note}
                  </p>
                </div>
                <a
                  href={g.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${g.name} on Instagram`}
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-teal text-xs text-lime transition-colors hover:bg-lime hover:text-teal"
                >
                  ↗
                </a>
              </div>
              {/* Tape strip */}
              <span aria-hidden className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-4deg] bg-lime/80" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cafe, site, visit } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// Deterministic barcode bar widths (no Math.random: SSR must match the client).
const BARS = "3121412213114231121341221312411321231431".split("").map(Number);

const Rule = () => <div aria-hidden className="my-3 border-t border-dashed border-teal/40" />;

// The cafe as a thermal receipt that feeds out of a printer slot as you scroll (scrubbed, no pin).
export function Cafe() {
  const root = useRef<HTMLElement>(null);
  const [peek, setPeek] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Paper slides down out of the slot; clip keeps it hidden above the slot line.
        gsap.fromTo(
          q(".rc-paper"),
          { yPercent: -100 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: q(".rc-feed")[0], start: "top 95%", end: "top 30%", scrub: 0.6 } },
        );
        // Slight paper wobble while printing.
        gsap.fromTo(q(".rc-paper"), { rotation: -0.6 }, { rotation: 0.6, ease: "sine.inOut", repeat: 5, yoyo: true, scrollTrigger: { trigger: q(".rc-feed")[0], start: "top 95%", end: "top 30%", scrub: 0.6 } });
      });
      gsap.from(q(".rc-head-line"), {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(q(".rc-fade"), { opacity: 0, y: 20, stagger: 0.08, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 60%" } });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="cafe" className="relative overflow-hidden bg-teal-deep px-4 py-24 text-bone lg:px-8 lg:py-28">
      <div className="grid items-center gap-14 lg:min-h-[calc(100svh-14rem)] lg:grid-cols-12 lg:gap-8">
        {/* Copy + actions */}
        <div className="lg:col-span-4 lg:self-center">
          <h2 className="font-wide text-[clamp(2.6rem,4.6vw,5rem)] leading-[0.92]">
            <span className="block overflow-hidden">
              <span className="rc-head-line block">Pour, sit,</span>
            </span>
            <span className="block overflow-hidden pt-[0.08em]">
              <span className="rc-head-line block">
                <span className="hl">stay.</span>
              </span>
            </span>
          </h2>
          <p className="rc-fade mt-6 max-w-[22rem] text-justify text-xs uppercase leading-[1.25] tracking-[0.025rem] text-bone/70">
            Coffee by day, a bar by night, every big game on the big screen. Here&apos;s what a usual evening at the cafe adds up to.
          </p>
          <div className="rc-fade mt-8 flex flex-wrap items-center gap-3">
            <a href={visit.directions} target="_blank" rel="noreferrer" className="rounded-[50%] bg-lime px-7 py-3 font-wide text-[0.625rem] text-teal transition-colors hover:bg-bone">
              Get directions
            </a>
            <a href={site.phoneHref} className="rounded-[50%] border border-bone/40 px-7 py-3 font-wide text-[0.625rem] transition-colors hover:border-lime hover:bg-lime hover:text-teal">
              Book a table
            </a>
            <a href="https://ig.me/m/farakchu.cafe" target="_blank" rel="noreferrer" className="text-sm underline-offset-4 hover:text-lime hover:underline">
              DM the cafe →
            </a>
          </div>

        </div>


          {/* Fanned photo deck. Hovering a receipt line shuffles that photo to the front. */}
        <div className="relative mx-auto h-[46svh] max-h-[460px] w-full max-w-[420px] lg:col-span-4 lg:h-[56svh] lg:max-h-[520px] lg:self-center">
          {cafe.items.map((it, i) => {
            const n = cafe.items.length;
            const front = peek ?? n - 1;
            const depth = (i - front + n) % n; // 0 = front card
            const fan = [
              { x: 0, y: 0, r: -3 },
              { x: 34, y: 10, r: 7 },
              { x: -30, y: 14, r: -11 },
              { x: 62, y: 22, r: 13 },
              { x: -56, y: 26, r: -16 },
              { x: 8, y: 30, r: 3 },
            ][depth];
            return (
              <figure
                key={it.name}
                className="absolute left-[14%] top-0 aspect-[4/5] h-[86%] bg-bone p-2 pb-8 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.65)] transition-[transform,filter] duration-700 ease-out-expo"
                style={{
                  zIndex: n - depth,
                  transform: `translate(${fan.x}px, ${fan.y}px) rotate(${fan.r}deg) scale(${1 - depth * 0.04})`,
                  filter: depth ? `brightness(${1 - depth * 0.08})` : "none",
                }}
              >
                <div className="relative size-full overflow-hidden bg-teal">
                  <Image src={it.image.src} alt={it.image.alt} fill sizes="320px" className="object-cover" />
                </div>
                <figcaption className="absolute inset-x-2 bottom-2 font-mono text-[0.625rem] uppercase text-teal">1x {it.name}</figcaption>
              </figure>
            );
          })}
        </div>

        {/* Printer + receipt */}
        <div className="rc-feed relative mx-auto w-full max-w-[400px] lg:col-span-4">
          <div className="relative z-10 h-5 rounded-full bg-black shadow-[inset_0_-3px_0_rgb(255_255_255/0.08)]" aria-hidden />
          <div className="-mt-2.5 overflow-hidden px-3 pt-2.5">
            <div
              className="rc-paper relative bg-[#f6f1e6] px-6 pb-10 pt-6 font-mono text-[0.75rem] uppercase leading-relaxed text-teal shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]"
              style={{
                // Zigzag tear along the bottom edge.
                mask: "conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50% / 14px 100%",
                WebkitMask: "conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50% / 14px 100%",
              }}
            >
              <p className="text-center text-base font-bold tracking-widest">Farak Chu</p>
              <p className="text-center">Cafe &amp; Bar</p>
              <p className="mt-2 text-center text-[0.6875rem] normal-case">
                {visit.lines[0]}, {visit.lines[1]}
                <br />
                Kathmandu · {site.phone}
              </p>
              <Rule />
              <div className="flex justify-between">
                <span>Order #0601</span>
                <span>Dine in</span>
              </div>
              <div className="flex justify-between">
                <span>Date: today</span>
                <span>Time: now</span>
              </div>
              <Rule />
              <ul onPointerLeave={() => setPeek(null)}>
                {cafe.items.map((it, i) => (
                  <li key={it.name}>
                    <button
                      type="button"
                      onPointerEnter={() => setPeek(i)}
                      onFocus={() => setPeek(i)}
                      onBlur={() => setPeek(null)}
                      className={`flex w-full items-baseline gap-2 py-0.5 text-left uppercase transition-colors ${peek === i ? "bg-lime" : ""}`}
                    >
                      <span>1x</span>
                      <span className="shrink-0">{it.name}</span>
                      <span aria-hidden className="mx-1 flex-1 translate-y-[-0.2em] border-b border-dotted border-teal/50" />
                      <span className="font-bold">{it.price}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Rule />
              <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>One good evening</span>
              </div>
              <div className="flex justify-between text-[0.6875rem]">
                <span>Paid with</span>
                <span>Good vibes</span>
              </div>
              <Rule />
              <a href={visit.directions} target="_blank" rel="noreferrer" aria-label="Get directions to Farak Chu" className="group mx-auto mt-2 block w-fit">
                <span className="flex h-14 items-stretch gap-[2px]" aria-hidden>
                  {BARS.map((w, i) => (
                    <span key={i} className={`${i % 2 ? "bg-transparent" : "bg-teal group-hover:bg-teal-soft"}`} style={{ width: w * 1.6 }} />
                  ))}
                </span>
                <span className="mt-1 block text-center text-[0.625rem] tracking-[0.3em]">scan · directions</span>
              </a>
              <p className="mt-5 text-center font-bold tracking-widest">Thank you · Come different</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

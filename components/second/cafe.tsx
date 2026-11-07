"use client";

import { useState } from "react";
import Image from "next/image";
import { cafe, site, visit } from "@/content/site";

// Deterministic barcode bar widths (no Math.random: SSR must match the client).
const BARS = "3121412213114231121341221312411321231431".split("").map(Number);

const Rule = () => <div aria-hidden className="my-3 border-t border-dashed border-teal/40" />;

// Static thermal receipt with a photo preview for each line.
export function Cafe() {
  const [peek, setPeek] = useState<number | null>(null);

  return (
    <section id="cafe" className="relative overflow-hidden bg-teal-deep px-4 py-24 text-bone lg:px-8 lg:py-28">
      <div className="grid items-center gap-14 lg:min-h-[calc(100svh-14rem)] lg:grid-cols-12 lg:gap-8">
        {/* Copy + actions */}
        <div className="lg:col-span-4 lg:self-center">
          <h2 className="font-wide text-[clamp(2.6rem,4.6vw,5rem)] leading-[0.92]">
            <span className="block overflow-hidden">
              <span className="rc-head-line block">Pour, sit,</span>
            </span>
            <span className="block overflow-hidden pt-[0.08em]">
              <span className="rc-head-line block">
                stay.
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


        {/* ponytail: one stationary frame; receipt focus and hover only crossfade photos. */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden bg-teal lg:col-span-4">
          {cafe.items.map((it, i) => (
            <Image key={it.name} src={it.image.src} alt={it.image.alt} fill sizes="(min-width: 1024px) 30vw, 90vw"
              aria-hidden={i !== (peek ?? cafe.items.length - 1)}
              className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${i === (peek ?? cafe.items.length - 1) ? "opacity-100" : "opacity-0"}`} />
          ))}
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
                      onClick={() => setPeek(i)}
                      onBlur={() => setPeek(null)}
                      className={`flex w-full items-baseline gap-2 py-0.5 text-left uppercase transition-colors ${peek === i ? "bg-teal/10" : ""}`}
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

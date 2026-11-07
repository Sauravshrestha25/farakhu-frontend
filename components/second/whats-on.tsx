"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { events, site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// Native horizontal scroll and buttons keep vertical wheel input on the page.
export function WhatsOn() {
  const root = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q("h2"), {
          y: 20, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const step = (dir: 1 | -1) => {
    const el = strip.current!;
    const card = el.querySelector<HTMLElement>(".wo-card");
    const by = (card?.offsetWidth ?? 300) + 32;
    el.scrollBy({ left: dir * by, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <section ref={root} id="whats-on" className="relative flex min-h-svh flex-col justify-center gap-10 overflow-hidden bg-teal py-24 text-bone lg:flex-row lg:items-center lg:gap-0 lg:py-0">
      <div className="flex shrink-0 flex-col justify-between gap-10 px-4 lg:h-[72svh] lg:w-[34vw] lg:px-8">
        <h2 className="font-wide text-[clamp(2.6rem,5.6vw,6rem)] leading-[0.92]">
          <span className="block overflow-hidden">
            <span className="wo-head-line block">Big screens.</span>
          </span>
          <span className="block overflow-hidden pt-[0.08em]">
            <span className="wo-head-line block">
              Bigger nights.
            </span>
          </span>
        </h2>
        <div className="flex flex-col gap-6">
          <p className="max-w-[21.5rem] text-justify text-xs uppercase leading-[1.25] tracking-[0.025rem] text-bone/80">
            Watch parties, brackets and drops from the last few months at the house. The next one lands on Instagram first. Tables go fast.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={site.phoneHref} className="rounded-[50%] bg-lime px-7 py-3 font-wide text-[0.625rem] text-teal transition-colors hover:bg-bone">
              Book a table · {site.phone}
            </a>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="text-sm underline-offset-4 hover:text-lime hover:underline">
              Catch the next one →
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => step(-1)} aria-label="Previous posters" className="grid size-11 place-items-center rounded-full border border-bone/30 transition-colors hover:border-lime hover:bg-lime hover:text-teal">
              ←
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next posters" className="grid size-11 place-items-center rounded-full border border-bone/30 transition-colors hover:border-lime hover:bg-lime hover:text-teal">
              →
            </button>

          </div>
        </div>
      </div>

      <div
        ref={strip}
        tabIndex={0}
        role="region"
        aria-label="Recent event posters"
        className="min-w-0 flex-1 select-none snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] lg:snap-none [&::-webkit-scrollbar]:hidden"
      >
        {/* Single row of cards inside the scroll strip. */}
        <div className="flex w-max gap-8 px-4 pb-4 pt-6 lg:pl-4 lg:pr-[8vw]">
        {events.map((e, i) => (
          <a
            key={e.title}
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            draggable={false}
            className="wo-card group relative flex h-[58svh] shrink-0 snap-start flex-col gap-4 lg:h-[72svh]"
            style={{ aspectRatio: "4 / 5.6" }}
          >
            <div className="relative flex-1 overflow-hidden bg-teal-deep">
              <Image src={e.image.src} alt={e.image.alt} fill draggable={false} sizes="(min-width: 768px) 40vh, 70vw" className="pointer-events-none object-cover transition-transform duration-500 motion-reduce:transition-none ease-out-expo motion-safe:group-hover:scale-[1.03]" />
            </div>
            <span className="absolute -left-2 -top-3 z-[2] bg-bone px-3 py-1.5 font-wide text-sm text-teal lg:text-base">
              {e.tag}
            </span>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl leading-none lg:text-3xl">{e.title}</h3>
                <p className="mt-2 max-w-[16rem] text-xs uppercase leading-[1.25] tracking-[0.025rem] text-bone/70">{e.meta}</p>
              </div>
              <span className="font-wide text-[0.625rem] text-bone/50">{String(i + 1).padStart(2, "0")}</span>
            </div>
          </a>
        ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { events, site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// No scroll-jacking: one screen. Posters live in a strip you drag/flick (desktop) or swipe (touch, native snap).
export function WhatsOn() {
  const root = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const el = strip.current!;
      const cards = q(".wo-card") as HTMLElement[];
      const [count] = q(".wo-count") as HTMLElement[];
      const [bar] = q(".wo-bar") as HTMLElement[];

      const sync = () => {
        const max = el.scrollWidth - el.clientWidth || 1;
        const p = el.scrollLeft / max;
        gsap.set(bar, { scaleX: Math.max(0.08, p) });
        const i = Math.round(p * (cards.length - 1)) + 1;
        count.textContent = `${String(i).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      };
      el.addEventListener("scroll", sync, { passive: true });
      sync();

      // Desktop: grab-to-drag with a momentum glide. Touch keeps native swipe + snap.
      // ponytail: hand-rolled (Draggable fought ScrollSmoother's normalizeScroll).
      let down = false, moved = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, v = 0;
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        down = true;
        moved = false;
        startX = lastX = e.clientX;
        startLeft = el.scrollLeft;
        lastT = e.timeStamp;
        v = 0;
        gsap.killTweensOf(el);
        el.style.cursor = "grabbing";
      };
      const onMove = (e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) moved = true;
        el.scrollLeft = startLeft - dx;
        const dt = Math.max(1, e.timeStamp - lastT);
        v = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastT = e.timeStamp;
      };
      const onUp = () => {
        if (!down) return;
        down = false;
        el.style.cursor = "grab";
        gsap.to(el, { scrollLeft: el.scrollLeft - v * 320, duration: 0.9, ease: "power3.out" });
      };
      const onClick = (e: MouseEvent) => {
        if (!moved) return;
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      };
      el.style.cursor = "grab";
      el.addEventListener("pointerdown", onDown);
      addEventListener("pointermove", onMove);
      addEventListener("pointerup", onUp);
      el.addEventListener("click", onClick, true);

      // Entrance: cards deal in from the right, tilted, once.
      gsap.from(cards, {
        x: 160,
        rotation: (i) => (i % 2 ? -8 : 8),
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      gsap.from(q(".wo-head-line"), {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      return () => {
        el.removeEventListener("scroll", sync);
        el.removeEventListener("pointerdown", onDown);
        removeEventListener("pointermove", onMove);
        removeEventListener("pointerup", onUp);
        el.removeEventListener("click", onClick, true);
      };
    },
    { scope: root },
  );

  const step = (dir: 1 | -1) => {
    const el = strip.current!;
    const card = el.querySelector<HTMLElement>(".wo-card");
    const by = (card?.offsetWidth ?? 300) + 32;
    gsap.to(el, { scrollLeft: el.scrollLeft + dir * by, duration: 0.8, ease: "power3.inOut", overwrite: true });
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
              <span className="hl">Bigger nights.</span>
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
            <span className="wo-count ml-2 font-wide text-[0.625rem] tabular-nums">01 / {String(events.length).padStart(2, "0")}</span>
            <span className="relative h-px w-24 bg-bone/20">
              <span className="wo-bar absolute inset-0 origin-left bg-lime" />
            </span>
          </div>
        </div>
      </div>

      <div
        ref={strip}
        data-drag
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
              <Image src={e.image.src} alt={e.image.alt} fill draggable={false} sizes="(min-width: 768px) 40vh, 70vw" className="pointer-events-none object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
            </div>
            <span className="absolute -left-2 -top-3 z-[2] -rotate-6 bg-lime px-3 py-1.5 font-wide text-sm text-teal shadow-[4px_4px_0_var(--color-teal-deep)] transition-transform duration-300 group-hover:rotate-0 lg:text-base">
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

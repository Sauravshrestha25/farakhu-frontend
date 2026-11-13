"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "../logo-mark";
import { home } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Rect clip anchored top/bottom. Width in % so panels can resize (hover split) after the reveal.
function rect(bh: number, h: number, anchor: "top" | "bottom") {
  const y = anchor === "top" ? -1 : bh - h + 1;
  return `polygon(-1px ${y - 1}px, calc(100% + 1px) ${y - 1}px, calc(100% + 1px) ${y + h + 1}px, -1px ${y + h + 1}px)`;
}

// Full rect (t=0) -> Farakchu diamond of radius r (t=1). Corners swing to the diamond points: TL->top, TR->right, BR->bottom, BL->left.
function diamond(bw: number, bh: number, t: number, r: number) {
  const cx = bw / 2;
  const cy = bh / 2;
  const lerp = (a: number, b: number) => a + (b - a) * t;
  const pts = [
    [lerp(-1, cx), lerp(-1, cy - r)],
    [lerp(bw + 1, cx + r), lerp(-1, cy)],
    [lerp(bw + 1, cx), lerp(bh + 1, cy + r)],
    [lerp(-1, cx - r), lerp(bh + 1, cy)],
  ];
  return `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
}

// Logo artboard: outer diamond points span ~96% of the 1080 box.
const markSize = (r: number) => (r * 2) / 0.963;

/**
 * One pinned scene (1 timeline unit = 100vh of scroll):
 * 0 hero folds into the Farakchu diamond -> 1 shrinks to the logo, lettering lands, Farak/Chu close in ->
 * 2 About photo fades in inside the diamond -> 2.5 diamond opens to full bleed, logo flies to the About heading ->
 * 3.5 About statement fills in -> 4.5 film panels wipe in -> 5.5 pin releases (films then scroll away normally).
 * Nav offsets in components/nav.tsx depend on these positions.
 */
export function HeroStack() {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [hero] = q(".hs-hero") as HTMLElement[];
      const films = q(".hs-film") as HTMLElement[];
      const [mark] = q(".hs-mark") as HTMLElement[];
      const [slot] = q(".hs-slot") as HTMLElement[];
      const [vv1, vv2] = q(".hs-vv") as HTMLElement[];

      // Toggle-played reveals, fired from timeline progress.
      const filmSplit = SplitText.create(q(".hs-film-heading"), { type: "lines", mask: "lines", linesClass: "line" });
      const filmHead = gsap.fromTo(filmSplit.lines, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power4.inOut", duration: 0.8, stagger: 0.05, paused: true });
      const filmBody = gsap.fromTo(q(".hs-film-body"), { opacity: 0 }, { opacity: 1, ease: "power4.inOut", duration: 1.5, delay: 0.5, paused: true });
      const toggle = (anim: gsap.core.Animation[], on: boolean) => anim.forEach((a) => (on ? a.play() : a.reverse()));
      let filmsOn = false;

      gsap.set(q(".hs-bg"), { scale: 1.05 });
      // Centre via xPercent/yPercent (GSAP freezes CSS translate into px, which breaks once the mark resizes).
      gsap.set(mark, { xPercent: -50, yPercent: -50 });

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 992px)", mobile: "(max-width: 991px)" }, (ctx) => {
        const desktop = ctx.conditions!.desktop;
        const box = { w: 0, h: 0, fh: [] as number[], slotY: 0, slotS: 80 };
        const measure = () => {
          box.w = hero.offsetWidth;
          box.h = hero.offsetHeight;
          box.fh = films.map((f) => f.offsetHeight);
          // Where the logo lands above the About heading (offset from centre; both live in the same pinned box).
          const s = slot.getBoundingClientRect();
          const h = hero.getBoundingClientRect();
          box.slotY = s.top + s.height / 2 - (h.top + h.height / 2);
          box.slotS = markSize(s.width / 2);
        };
        measure();

        const rFull = () => Math.min(box.h, box.w) * 0.5;
        const rLogo = () => Math.min(box.h * 0.34, box.w * 0.36);
        const m: Record<string, number> = { t: 0, r: rFull(), ms: markSize(rFull()) };
        films.forEach((_, i) => (m[`f${i}`] = 0));
        // Perf: only touch the DOM when a value actually changed (each clip change repaints a full-screen layer).
        const last: Record<string, string | number> = {};
        const setIf = (key: string, v: string | number, apply: () => void) => {
          if (last[key] === v) return;
          last[key] = v;
          apply();
        };
        // Mark renders once at its largest size and is scaled on the GPU (resizing the traced SVG each frame was the main jank).
        const paint = () => {
          const base = Math.round(markSize(Math.max(box.h, box.w) * 0.5));
          setIf("base", base, () => (mark.style.width = mark.style.height = `${base}px`));
          const d = diamond(box.w, box.h, m.t, m.r);
          setIf("hero", d, () => (hero.style.clipPath = d));
          const sc = +(m.ms / base).toFixed(4);
          setIf("mark", sc, () => gsap.set(mark, { scale: sc }));
          // Panels wipe in alternately from the top and from the bottom.
          films.forEach((f, i) => {
            const c = rect(box.fh[i], m[`f${i}`], i % 2 ? "bottom" : "top");
            setIf(`f${i}`, c, () => (f.style.clipPath = c));
          });
        };
        ScrollTrigger.addEventListener("refreshInit", measure);
        paint();

        const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
        const close = (el: HTMLElement) => (box.w - 8 * rem()) / 2 - el.getBoundingClientRect().width;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: () => {
            paint();
            const time = tl.time();
            if (time > 4.9 !== filmsOn) toggle([filmHead, filmBody], (filmsOn = time > 4.9));
          },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=550%",
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefresh: (self) => {
              self.animation?.progress(self.progress);
              paint();
            },
          },
        });

        // 0-1: fold into the diamond
        tl.fromTo(m, { t: 0, r: () => rFull() }, { duration: 1, t: 1, ease: "power2.inOut" }, 0)
          .to(q(".hs-bg"), { duration: 1, scale: 1 }, 0)
          .to(q(".hs-heading"), { duration: 0.98, opacity: 0 }, 0.02)
          .to(q(".hs-first"), { duration: 0.98, x: desktop ? 100 : 10 }, 0.02)
          .to(q(".hs-third"), { duration: 0.98, x: desktop ? -100 : -10 }, 0.02)
          // 1-2: shrink to the logo, lettering lands
          .fromTo(m, { r: () => rFull(), ms: () => markSize(rFull()) }, { duration: 1, r: () => rLogo(), ms: () => markSize(rLogo()), ease: "power2.inOut" }, 1)
          .fromTo(mark, { opacity: 0 }, { duration: 0.5, opacity: 1 }, 1.5);
        if (desktop) tl.to(vv1, { duration: 1, x: () => close(vv1) }, 1).to(vv2, { duration: 1, x: () => -close(vv2) }, 1);

        // 2-2.5: About photo inside the diamond
        tl.to(q(".hs-about-bg"), { duration: 0.5, opacity: 1 }, 2)
          // 2.5-3.5: open to full bleed, logo flies to the heading
          .to(m, { duration: 1, t: 0, ms: () => box.slotS, ease: "power2.inOut" }, 2.5)
          .to(mark, { duration: 1, y: () => box.slotY, ease: "power2.inOut" }, 2.5)
          .to(q(".hs-about-tint"), { duration: 1, opacity: 0.55 }, 2.5)
          .fromTo(q(".hs-about-photo"), { scale: 1.15 }, { duration: 2, scale: 1 }, 2.5)
          // 3.5-4.5: statement fills in
          .fromTo(q(".hs-aw"), { opacity: 0 }, { opacity: 1, stagger: 0.06, duration: 0.3 }, 3.3)
          .fromTo(q(".hs-about-body"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 4.1);
        // 4.5-5.3: the four domain panels wipe in over About, staggered
        films.forEach((_, i) =>
          tl.fromTo(m, { [`f${i}`]: 0 }, { duration: 0.8, [`f${i}`]: () => box.fh[i] + 1, immediateRender: false }, 4.5 + i * 0.08),
        );
        tl
          .fromTo(films, { pointerEvents: "none" }, { pointerEvents: "auto", duration: 0 }, 5.3)
          .to({}, { duration: 0.2 }, 5.3);

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", measure);
          gsap.set([hero, ...films], { clearProps: "clipPath" });
        };
      });


      // Lime "Explore" badge follows the pointer inside each panel (desktop).
      const offs: (() => void)[] = [];
      films.forEach((film) => {
        const badge = film.querySelector<HTMLElement>(".hs-cursor");
        if (!badge) return;
        gsap.set(badge, { xPercent: -50, yPercent: -50, scale: 0 });
        const x = gsap.quickTo(badge, "x", { duration: 0.3, ease: "power3.out" });
        const y = gsap.quickTo(badge, "y", { duration: 0.3, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = film.getBoundingClientRect();
          x(e.clientX - r.left);
          y(e.clientY - r.top);
        };
        const enter = (e: PointerEvent) => {
          const r = film.getBoundingClientRect();
          gsap.set(badge, { x: e.clientX - r.left, y: e.clientY - r.top });
          gsap.to(badge, { scale: 1, duration: 0.5, ease: "back.out(2)" });
        };
        const leave = () => gsap.to(badge, { scale: 0, duration: 0.3, ease: "power2.in" });
        film.addEventListener("pointermove", move);
        film.addEventListener("pointerenter", enter);
        film.addEventListener("pointerleave", leave);
        offs.push(() => (film.removeEventListener("pointermove", move), film.removeEventListener("pointerenter", enter), film.removeEventListener("pointerleave", leave)));
      });
      gsap.set(films, { pointerEvents: "none" });

      // After the pin: films darken + drift as the next section scrolls in.
      gsap.to(q(".hs-films-overlay"), { opacity: 0.85, ease: "none", scrollTrigger: { trigger: "#whats-on", start: "top bottom", end: "top top", scrub: true } });
      gsap.to(q(".hs-film-img"), { yPercent: 15, ease: "none", scrollTrigger: { trigger: "#whats-on", start: "top bottom", end: "top top", scrub: true } });

      return () => {
        offs.forEach((off) => off());
        filmSplit.revert();
      };
    },
    { scope: root },
  );

  const [m1, m2] = home.meaning;
  const words = home.about.heading.split(" ");

  return (
    <div ref={root} id="top" className="relative grid h-svh overflow-hidden">
      {/* Layer 0: meaning */}
      <section id="vv" className="relative flex h-svh items-center justify-between bg-teal px-4 text-bone [grid-area:1/1] md:px-8 max-lg:flex-col max-lg:py-24">
        {[m1, m2].map((m, i) => (
          <div key={m.word} className={`hs-vv flex w-[11.75rem] flex-col gap-4 lg:w-[17.625rem] ${i ? "max-lg:ml-auto" : "max-lg:mr-auto"}`}>
            <h2 data-heading className="font-serif text-[4rem] leading-none lg:text-[6rem]">{m.word}</h2>
            <p data-body className="text-justify text-xs uppercase leading-[1.2] tracking-[0.025rem]">{m.body}</p>
          </div>
        ))}
      </section>

      {/* Layer 1: hero -> diamond -> About */}
      <section className="hs-hero relative z-[1] h-svh overflow-hidden bg-teal [grid-area:1/1]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={home.hero.image.src}
          aria-hidden="true"
          className="hs-bg absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero_video" type="video/mp4" />
        </video>

        <div id="about" className="hs-about-bg absolute inset-0 z-[1] opacity-0">
          <div className="hs-about-photo absolute inset-0">
            <Image src={home.about.image.src} alt={home.about.image.alt} fill sizes="100vw" className="object-cover object-top" />
          </div>
          <div className="hs-about-tint absolute inset-0 bg-teal-deep opacity-0" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-4 text-bone lg:px-8">
            {/* The flying logo lands on this slot. */}
            <div className="hs-slot size-16 lg:size-20" aria-hidden />
            <h2 className="font-wide max-w-[22ch] text-center text-[1.375rem] leading-[0.95] md:text-[3rem] lg:text-[4rem]">
              {words.map((w, i) => {
                const hl = /^(lifestyle|hospitality)$/i.test(w);
                return (
                  <span key={i} className="hs-aw">
                    {hl ? <span className="hl">{w}</span> : w}{" "}
                  </span>
                );
              })}
            </h2>
            <p className="hs-about-body w-[9.5rem] text-justify text-xs uppercase leading-[1.2] tracking-[0.025rem] md:w-[15.9375rem] lg:w-[21.5rem]">
              {home.about.body}
            </p>
          </div>
        </div>

        <LogoMark className="hs-mark pointer-events-none absolute left-1/2 top-1/2 z-[3] text-bone opacity-0 will-change-transform" />

        <div className="relative z-[2] flex h-full flex-col justify-end px-4 py-4 text-bone lg:px-8 lg:py-8">
          <h1 data-hero className="hs-heading flex flex-col gap-[0.06em] font-wide text-[9.2vw] leading-[0.92] lg:text-[9.5vw]">
            <span className="flex justify-between">
              <span className="hs-first">The</span>
              <span>Art</span>
              <span className="hs-third">Of</span>
            </span>
            <span className="block whitespace-nowrap text-center">
              <span className="hl">Difference</span>
            </span>
          </h1>
        </div>
      </section>

      {/* Layer 2: film panels */}
      <section id="films" className="hs-films relative z-[2] flex h-svh [grid-area:1/1] max-lg:flex-col">
        <div className="hs-films-overlay pointer-events-none absolute inset-0 z-[6] bg-teal-deep opacity-0" />
        {home.films.map((f, i) => {
          const on = hover === i;
          const off = hover !== null && !on;
          return (
            <a
              key={f.id}
              href={f.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${f.name}: ${f.blurb}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={`hs-film group relative block min-h-0 w-full flex-1 overflow-hidden px-4 py-4 text-bone [clip-path:polygon(0_0,0_0,0_0,0_0)] lg:w-auto lg:min-w-0 lg:flex-none lg:basis-0 lg:cursor-none lg:px-6 lg:pb-8 lg:pt-[5.25rem] lg:transition-[flex-grow] lg:duration-[900ms] lg:ease-out-expo ${
                on ? "lg:grow-[11]" : off ? "lg:grow-[3]" : "lg:grow-[5]"
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={f.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 992px) 55vw, 100vw"
                  style={{ objectPosition: f.focus }}
                  className={`hs-film-img origin-top object-cover transition-[filter,scale] duration-[900ms] ease-out-expo ${on ? "scale-[1.04]" : ""} ${off ? "grayscale brightness-[0.45]" : ""}`}
                />
              </div>
              <div className={`absolute inset-0 z-[2] bg-teal/20 mix-blend-multiply transition-opacity duration-700 ${on ? "opacity-0" : ""}`} />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-teal-deep/95 via-teal-deep/40 via-35% to-transparent to-60%" />
              {i < home.films.length - 1 && <span className="absolute inset-y-0 right-0 z-[5] hidden w-px bg-bone/20 lg:block" />}

              {/* Collapsed state: name runs up the spine */}
              <span
                className={`pointer-events-none absolute bottom-8 left-1/2 z-[3] hidden origin-center -translate-x-1/2 whitespace-nowrap font-wide text-[clamp(1.5rem,2.4vw,2.5rem)] [writing-mode:vertical-rl] rotate-180 transition-opacity duration-500 lg:block ${
                  off ? "opacity-100 delay-200" : "opacity-0"
                }`}
              >
                {f.name}
              </span>

              <div className={`relative z-[3] flex h-full flex-col justify-end transition-opacity duration-300 ${off ? "lg:opacity-0" : ""}`}>
                {/* Division badge + number, kept clear of the fixed nav */}
                <div className="mb-4 flex items-center gap-3 lg:mb-6">
                  <Image src={f.logo} alt="" width={56} height={56} className="size-9 rounded-full object-cover ring-1 ring-bone/30 lg:size-12" />
                  <span className="font-wide text-[0.625rem] text-bone/70">{f.no}</span>
                </div>
                <h3 className="hs-film-heading whitespace-nowrap font-serif text-[2rem] leading-[1] lg:text-[clamp(2.4rem,3.4vw,4.5rem)]">
                  <span className="block">{f.title[0]}</span>
                  <span className="mt-1.5 block">
                    <span className="hl font-wide text-[0.82em]">{f.title[1]}</span>
                  </span>
                </h3>
                <div className={`hs-film-body mt-4 flex items-end justify-between gap-4 border-t border-bone/20 pt-4 lg:mt-6 lg:pt-5`}>
                  <p className={`max-w-[19rem] text-justify text-[0.6875rem] uppercase leading-[1.25] tracking-[0.025rem] text-bone/80 transition-[opacity,max-height] duration-500 max-lg:line-clamp-2 lg:text-xs ${hover === null || on ? "" : "lg:opacity-0"}`}>
                    {f.blurb}
                  </p>
                  <span className="shrink-0 rounded-[50%] bg-lime px-5 py-2.5 font-wide text-[0.625rem] text-teal lg:hidden">Explore</span>
                </div>
              </div>

              <span className="hs-cursor pointer-events-none absolute left-0 top-0 z-[7] hidden size-28 place-items-center rounded-full bg-lime text-center font-wide text-[0.625rem] leading-tight text-teal lg:grid">
                {f.name}
                <br />↗
              </span>
            </a>
          );
        })}
      </section>

    </div>
  );
}

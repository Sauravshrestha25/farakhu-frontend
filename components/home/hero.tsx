"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// The logo's diamond is a window into Farakchu. Scroll opens it to full bleed.
function diamond(r: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  return `polygon(${cx}px ${cy - r}px, ${cx + r}px ${cy}px, ${cx}px ${cy + r}px, ${cx - r}px ${cy}px)`;
}

function Word({ text, className }: { text: string; className: string }) {
  return (
    <svg viewBox={`0 0 ${text.length * 150} 170`} className={className} role="presentation" aria-hidden>
      <g filter="url(#fc-warp)">
        <text
          x="0"
          y="150"
          textLength={text.length * 150}
          lengthAdjust="spacingAndGlyphs"
          className="fill-teal"
          style={{ fontFamily: "var(--font-sans)", fontStretch: "125%", fontWeight: 900, fontSize: 190 }}
        >
          {text}
        </text>
      </g>
    </svg>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const win = el.querySelector<HTMLElement>(".hx-window")!;
      const disp = el.querySelector("feDisplacementMap")!;
      const turb = el.querySelector("feTurbulence")!;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      const shape = { r: 0 };
      const rest = () => Math.min(innerHeight * 0.36, innerWidth * 0.4);
      const full = () => innerWidth / 2 + innerHeight / 2;
      const paint = () => (win.style.clipPath = diamond(shape.r, innerWidth, innerHeight));

      const warp = { base: 0, s: 0 };
      const applyWarp = () => disp.setAttribute("scale", String(warp.base + warp.s));

      if (reduce) {
        shape.r = rest();
        paint();
        return;
      }

      // Intro: diamond grows from a point, words rise and settle out of a warp.
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(shape, { r: 0 }, { r: rest, duration: 1.6, ease: "expo.inOut", onUpdate: paint })
        .fromTo(".hx-img", { scale: 1.5 }, { scale: 1.25, duration: 2, ease: "expo.out" }, 0)
        .fromTo(warp, { base: 160 }, { base: 0, duration: 2, ease: "expo.out", onUpdate: applyWarp }, 0.3)
        .from(".hx-word", { yPercent: 60, opacity: 0, duration: 1.4, stagger: 0.1, ease: "expo.out" }, 0.3)
        .from(".hx-foot", { opacity: 0, y: 16, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.9);

      // Scroll: window opens to full bleed, words part, caption lands.
      const scroll = gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=160%", pin: true, scrub: 1, invalidateOnRefresh: true },
        })
        .fromTo(shape, { r: rest }, { r: full, ease: "power2.in", onUpdate: paint, immediateRender: false }, 0)
        .to(".hx-img", { scale: 1, ease: "none" }, 0)
        .to(".hx-left", { xPercent: -120, ease: "power2.in" }, 0)
        .to(".hx-right", { xPercent: 120, ease: "power2.in" }, 0)
        .to(".hx-foot", { opacity: 0, y: -20, ease: "none", duration: 0.3 }, 0)
        .to(".hx-tint", { opacity: 0.55, ease: "none" }, 0.4)
        .from(".hx-cap", { yPercent: 110, stagger: 0.08, ease: "expo.out", duration: 0.4 }, 0.6);

      const start = () => intro.play().then(() => scroll.scrollTrigger?.refresh());
      if ((window as Window & { __fcLoaded?: boolean }).__fcLoaded) start();
      else window.addEventListener("fc:loaded", start, { once: true });

      gsap.to(turb, { attr: { baseFrequency: "0.012 0.04" }, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut" });
      let last = { x: 0, y: 0, t: 0 };
      const onMove = (e: PointerEvent) => {
        const v = Math.hypot(e.clientX - last.x, e.clientY - last.y) / Math.max(16, e.timeStamp - last.t);
        last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
        gsap.to(warp, { s: Math.min(v * 40, 90), duration: 0.3, overwrite: true, onUpdate: applyWarp });
        gsap.to(warp, { s: 0, duration: 1.6, delay: 0.3, ease: "power2.out", onUpdate: applyWarp });
      };
      el.addEventListener("pointermove", onMove);

      return () => {
        el.removeEventListener("pointermove", onMove);
        window.removeEventListener("fc:loaded", start);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative h-svh min-h-[600px] overflow-hidden bg-bone text-teal">
      <svg className="absolute size-0" aria-hidden>
        <filter id="fc-warp" x="-5%" y="-30%" width="110%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="hx-window absolute inset-0" style={{ clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" }}>
        <Image src={site.hero.src} alt={site.hero.alt} fill priority sizes="100vw" className="hx-img object-cover" />
        <div className="hx-tint absolute inset-0 bg-teal-deep opacity-0" />
        <p className="absolute inset-x-0 bottom-[12vh] px-5 text-center font-serif text-[clamp(2.5rem,6vw,6.5rem)] italic leading-[0.95] text-bone">
          <span className="block overflow-hidden pb-[0.1em]">
            <span className="hx-cap block">Not a concert. Not just a café.</span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span className="hx-cap block">A whole vibe.</span>
          </span>
        </p>
      </div>

      <h1 className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4 md:px-8">
        <span className="sr-only">Farakchu. Farak chu, I am different.</span>
        <span className="hx-left block w-[44vw]">
          <Word text="FARAK" className="hx-word w-full overflow-visible" />
        </span>
        <span className="hx-right block w-[28vw]">
          <Word text="CHU" className="hx-word w-full overflow-visible" />
        </span>
      </h1>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-6 md:px-8 md:pb-8">
        <p className="hx-foot font-serif text-4xl italic leading-none md:text-6xl">I am different.</p>
        <p className="hx-foot max-w-[17rem] text-right text-sm leading-snug md:text-base">
          Events, gaming, apparel and coffee under one diamond. {site.address.line1}, Kathmandu.
        </p>
      </div>
    </section>
  );
}

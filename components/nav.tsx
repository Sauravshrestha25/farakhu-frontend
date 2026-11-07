"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "./logo-mark";
import { RollLabel } from "./roll-label";
import { getSmoother } from "./smooth-scroll";
import { divisions, events, home, site } from "@/content/site";

const apparel = divisions.find((d) => d.id === "apparel")!;

// Anchor -> scroll position. Pinned scenes need an offset into the pin.
const targets: Record<string, { el: string; vh: { desktop: number; mobile: number } }> = {
  "#top": { el: "body", vh: { desktop: 0, mobile: 0 } },
  // Inside the HeroStack pin: 1 timeline unit = 1vh of scroll (see hero-stack.tsx).
  "#about": { el: "#top", vh: { desktop: 4.2, mobile: 4.2 } },
  "#films": { el: "#top", vh: { desktop: 5.5, mobile: 5.5 } },
  "#cafe": { el: "#cafe", vh: { desktop: 0, mobile: 0 } },
  "#contact": { el: "#contact", vh: { desktop: 0, mobile: 0 } },
};

export function scrollToAnchor(hash: string) {
  const t = targets[hash];
  const el = document.querySelector(t?.el ?? hash) as HTMLElement | null;
  if (!el) return;
  const extra = innerHeight * (t ? (innerWidth >= 992 ? t.vh.desktop : t.vh.mobile) : 0);
  const s = getSmoother();
  if (s) gsap.to(s, { scrollTop: s.offset(el, "top top") + extra, duration: 2, ease: "expo.inOut", overwrite: true });
  else gsap.to(window, { scrollTo: el.getBoundingClientRect().top + scrollY + extra, duration: 2, ease: "expo.inOut", overwrite: true });
}

const links = [
  { label: "Home", alt: "Back to top", href: "#top", image: home.hero.image.src },
  { label: "About", alt: "Who we are", href: "#about", image: home.about.image.src },
  { label: "What we do", alt: "Four ways", href: "#films", image: divisions[0].image.src },
  { label: "What's on", alt: "Big nights", href: "#whats-on", image: events[1].image.src },
  { label: "Who's been", alt: "Big names", href: "#guests", image: "/images/guests/chumbak.jpg" },
  { label: "Apparel", alt: "Wear it", href: "#apparel", image: "/images/apparel/ch01-navy.jpg" },
  { label: "Cafe", alt: "Pull up a seat", href: "#cafe", image: "/images/cafe/matcha-latte.jpg" },
  { label: "Contact", alt: "Say hi", href: "#contact", image: home.hero.image.src },
];

export function Nav() {
  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0); // photo preview (sticky)
  const [roll, setRoll] = useState<number | null>(null); // label currently rolled

  useGSAP(
    () => {
      // Clip the whole panel (bg + content) so nothing shows outside the dropping sheet.
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power4.inOut", duration: 0.8 } })
        .set(panel.current, { visibility: "visible" })
        .fromTo(panel.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
        .fromTo(".o-link", { yPercent: 105 }, { yPercent: 0, stagger: 0.04, duration: 0.7 }, 0.3)
        .fromTo(".o-photo", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9 }, 0.35)
        .fromTo(".o-foot", { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6 }, 0.5);
    },
    { scope: panel },
  );

  useEffect(() => {
    const s = getSmoother();
    if (open) {
      tl.current?.timeScale(1).play();
      s?.paused(true);
      panel.current?.querySelector<HTMLElement>(".o-link")?.focus();
    } else {
      tl.current?.timeScale(1.4).reverse();
      s?.paused(false);
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href")!;
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    // Wait for the panel to lift before gliding.
    setTimeout(() => scrollToAnchor(href), 450);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-bone">
      {/* Bar sits above the overlay so the logo never moves. data-nav lives here, not on <header>:
          a transform on header would trap the fixed overlay inside the bar's box. */}
      <div data-nav className="relative z-[2] flex items-center justify-between px-4 py-3 lg:px-6">
        <a href="#top" onClick={go} aria-label="Farakchu home" className="[filter:drop-shadow(0_0_1px_var(--color-teal-deep))_drop-shadow(0_0_1px_var(--color-teal-deep))_drop-shadow(0_0_6px_rgb(0_31_31/0.5))]">
          <LogoMark className="size-16 lg:size-20" />
        </a>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="fc-menu"
          className="group flex items-center gap-3 rounded-full bg-lime py-2.5 pl-5 pr-4 font-wide text-[0.6875rem] text-teal transition-transform duration-300 hover:scale-105"
        >
          {/* Both labels share one grid cell, so the pill fits the wider word. */}
          <span className="grid h-4 overflow-hidden">
            <span className={`[grid-area:1/1] transition-transform duration-500 ease-out-expo ${open ? "-translate-y-full" : ""}`}>Menu</span>
            <span className={`[grid-area:1/1] transition-transform duration-500 ease-out-expo ${open ? "" : "translate-y-full"}`}>Close</span>
          </span>
          <span className="relative block size-3">
            <span className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-teal transition-transform duration-500 ease-out-expo ${open ? "rotate-45" : ""}`} />
            <span className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-teal transition-transform duration-500 ease-out-expo ${open ? "-rotate-45" : "rotate-90"}`} />
          </span>
        </button>
      </div>

      <div ref={panel} id="fc-menu" role="dialog" aria-modal="true" aria-label="Menu" inert={!open} className="invisible fixed inset-0 z-[1]">
        <div className="absolute inset-0 bg-teal-deep" />
        <div className="relative flex h-full flex-col px-4 pb-6 pt-28 lg:px-6 lg:pb-8 lg:pt-32">
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-12">
            <nav aria-label="Main" className="lg:col-span-7">
              <ul>
                {links.map((l, i) => (
                  <li key={l.href} className="overflow-hidden">
                    <a
                      href={l.href}
                      onClick={go}
                      onMouseEnter={() => (setHover(i), setRoll(i))}
                      onMouseLeave={() => setRoll(null)}
                      onFocus={(e) => (setHover(i), e.currentTarget.matches(":focus-visible") && setRoll(i))}
                      onBlur={() => setRoll(null)}
                      className="o-link group flex items-baseline gap-4 py-1 outline-none"
                    >
                      <span className="w-8 font-wide text-[0.625rem] text-bone/50">{String(i + 1).padStart(2, "0")}</span>
                      <RollLabel
                        text={l.label}
                        alt={l.alt}
                        on={roll === i}
                        className="whitespace-nowrap font-wide text-[clamp(2rem,min(4.6vw,7.2vh),4.75rem)] leading-[0.95]"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="o-photo relative hidden aspect-[4/5] max-h-[62vh] w-full justify-self-end overflow-hidden lg:col-span-4 lg:col-start-9 lg:block">
              {links.map((l, i) => (
                <Image
                  key={l.href}
                  src={l.image}
                  alt=""
                  fill
                  sizes="30vw"
                  className={`object-cover transition-[opacity,transform] duration-700 ease-out-expo ${hover === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 items-end gap-6 border-t border-bone/15 pt-6 text-sm lg:grid-cols-4">
            <p className="o-foot text-bone/70">
              {site.address.line1}
              <br />
              {site.address.line2}
            </p>
            <a className="o-foot w-fit hover:text-lime" href={site.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <p className="o-foot font-serif text-2xl italic max-lg:hidden">Limited drop.</p>
            <a
              href={apparel.href}
              target="_blank"
              rel="noreferrer"
              className="o-foot w-fit justify-self-end rounded-[50%] bg-lime px-8 py-3 font-wide text-[0.625rem] text-teal transition-colors hover:bg-bone"
            >
              Shop apparel
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

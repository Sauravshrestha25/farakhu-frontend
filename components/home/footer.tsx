"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "../logo-mark";
import { scrollToAnchor } from "../nav";
import { WebxLogoSparkles } from "../ui/webx-logo-sparkles";
import { apparelDrop, divisions, site, visit } from "@/content/site";

const explore = [
  { label: "About", href: "#about" },
  { label: "What we do", href: "#films" },
  { label: "What's on", href: "#whats-on" },
  { label: "Who's been", href: "#guests" },
  { label: "Apparel", href: "#apparel" },
  { label: "Cafe", href: "#cafe" },
];

const Col = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="f-col">
    <h3 className="mb-4 font-serif text-2xl text-bone">{title}</h3>
    <div className="flex flex-col gap-2 text-sm text-bone/70">{children}</div>
  </div>
);

const linkCls = "w-fit transition-colors hover:text-lime";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      // Nav slides away while the footer is on screen.
      gsap.to(document.querySelectorAll("[data-nav]"), {
        yPercent: -200,
        duration: 0.6,
        ease: "power4.inOut",
        scrollTrigger: { trigger: root.current, start: "top 20%", toggleActions: "play none none reverse" },
      });
      gsap.from(q(".f-head-line"), { yPercent: 100, stagger: 0.08, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
      gsap.from(q(".f-col, .f-form"), { y: 30, opacity: 0, stagger: 0.07, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 60%" } });

      // Wordmark melts on enter + with pointer speed.
      const disp = q("feDisplacementMap")[0];
      const text = q(".f-mark text")[0];
      const warp = { s: 0 };
      // Perf: the turbulence filter costs every paint, even at scale 0. Attach it only while warping.
      const apply = () => {
        disp.setAttribute("scale", warp.s.toFixed(2));
        if (warp.s < 0.2) text.removeAttribute("filter");
        else if (!text.hasAttribute("filter")) text.setAttribute("filter", "url(#f-warp)");
      };
      const pulse = (v: number) => {
        gsap.to(warp, { s: v, duration: 0.25, overwrite: true, onUpdate: apply });
        gsap.to(warp, { s: 0, duration: 1.6, delay: 0.25, ease: "power2.out", onUpdate: apply });
      };
      const mark = q(".f-mark")[0] as HTMLElement;
      gsap.from(mark, { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: mark, start: "top 95%", onEnter: () => pulse(110) } });
      const onMove = (e: PointerEvent) => pulse(Math.min(100, 15 + Math.hypot(e.movementX, e.movementY) * 4));
      mark.addEventListener("pointermove", onMove);
      return () => mark.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  // ponytail: no form backend yet. Copies the message and opens Instagram DM. Swap for a real endpoint later.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await navigator.clipboard?.writeText(`${data.get("message")}\n\n${data.get("email")}`).catch(() => {});
    setSent(true);
    window.open(site.contactHref, "_blank", "noopener");
  };

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href")!;
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollToAnchor(href);
  };

  return (
    <footer ref={root} id="contact" className="relative z-10 overflow-hidden bg-teal-deep px-4 pt-24 text-bone lg:px-8 lg:pt-32">
      {/* Giant faint diamond behind everything */}
      <LogoMark className="pointer-events-none absolute -right-[12vw] -top-[10vw] size-[60vw] text-bone/[0.03]" title="" />

      {/* CTA + form */}
      <div className="relative grid gap-12 border-b border-bone/15 pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-20">
        <h2 className="font-wide text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.92] lg:col-span-7">
          <span className="block overflow-hidden">
            <span className="f-head-line block">See you at</span>
          </span>
          <span className="block overflow-hidden pt-[0.08em]">
            <span className="f-head-line block">
              the <span className="hl">house.</span>
            </span>
          </span>
        </h2>

        <form onSubmit={submit} className="f-form flex flex-col gap-6 lg:col-span-5 lg:col-start-8 lg:self-end">
          <p className="text-xs uppercase leading-[1.25] tracking-[0.025rem] text-bone/70">Book an event, ask about a drop, or just say hi.</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-bone/70">
              Email*
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors focus:border-lime"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-bone/70">
              Message
              <input name="message" className="border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors focus:border-lime" />
            </label>
          </div>
          <div className="flex items-center gap-5">
            <button type="submit" disabled={!email.trim()} className="rounded-[50%] bg-lime px-8 py-3 font-wide text-[0.625rem] text-teal transition-[background-color,opacity] hover:bg-bone disabled:opacity-40">
              Send
            </button>
            <p aria-live="polite" className="text-xs text-bone/60">
              {sent && "Copied. Paste it into the DM that just opened."}
            </p>
          </div>
        </form>
      </div>

      {/* Columns */}
      <div className="relative grid grid-cols-2 gap-10 py-16 lg:grid-cols-4 lg:gap-8">
        <Col title="Visit">
          {visit.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
          <a className={`${linkCls} mt-2 text-bone`} href={site.phoneHref}>
            {site.phone}
          </a>
          <a className={`${linkCls} text-bone`} href={visit.directions} target="_blank" rel="noreferrer">
            Get directions ↗
          </a>
        </Col>
        <Col title="Follow">
          <a className={linkCls} href={site.instagram} target="_blank" rel="noreferrer">
            @farakchu
          </a>
          {divisions.map((d) => (
            <a key={d.id} className={linkCls} href={d.href} target="_blank" rel="noreferrer">
              {d.handle}
            </a>
          ))}
        </Col>
        <Col title="Explore">
          {explore.map((l) => (
            <a key={l.href} className={linkCls} href={l.href} onClick={go}>
              {l.label}
            </a>
          ))}
        </Col>
        <Col title="Shop">
          <a className={linkCls} href={apparelDrop.dm} target="_blank" rel="noreferrer">
            DM to order apparel
          </a>
          <a className={linkCls} href={apparelDrop.merch} target="_blank" rel="noreferrer">
            Official Nepal merch ↗
          </a>
          <a className={`${linkCls} mt-2 w-fit rounded-[50%] bg-lime px-6 py-2.5 font-wide text-[0.625rem] text-teal hover:bg-bone hover:text-teal`} href={divisions[2].href} target="_blank" rel="noreferrer">
            Limited drop
          </a>
        </Col>
      </div>

      {/* Warped wordmark */}
      <svg viewBox="0 0 1000 190" className="f-mark relative block w-full overflow-visible" role="img" aria-label="Farakchu">
        <filter id="f-warp" x="-15%" y="-50%" width="130%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <text
          x="500"
          y="170"
          textAnchor="middle"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          className="fill-bone"
          style={{ fontFamily: "var(--font-sans)", fontStretch: "125%", fontWeight: 900, fontSize: 210 }}
        >
          FARAKCHU
        </text>
      </svg>

      {/* Bottom bar */}
      <div className="relative mt-6 flex flex-col gap-6 border-t border-bone/15 py-6 text-xs text-bone/60 lg:flex-row lg:items-center lg:justify-between">
        <span>© 2026 Farakchu · {site.address.line1}, Kathmandu · Farak Chu, I am different.</span>
        <a href="#top" onClick={go} className="w-fit font-wide text-[0.625rem] text-bone transition-colors hover:text-lime">
          Back to top ↑
        </a>
        <span className="flex items-center gap-4">
          <span className="uppercase tracking-[0.025rem]">Designed &amp; Developed by</span>
          <WebxLogoSparkles width={96} particleDensity={420} />
        </span>
      </div>
    </footer>
  );
}

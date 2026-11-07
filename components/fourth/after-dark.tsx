"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoMark } from "@/components/logo-mark";
import { WebxLogoSparkles } from "@/components/ui/webx-logo-sparkles";
import { apparelDrop, cafe, divisions, home, site, visit } from "@/content/site";
import "./after-dark.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stops = [
  { id: "cafe", hour: "4", period: "PM", name: "Cafe & Bar", line: "Good coffee is an art.\nSharing it is a lifestyle.", action: "Come for a coffee", href: divisions[3].href, image: cafe.items[0].image, focus: "50% 45%" },
  { id: "apparel", hour: "7", period: "PM", name: "Apparel", line: "Wear the difference.", action: "Find your next fit", href: apparelDrop.dm, image: home.films[2].image, focus: home.films[2].focus },
  { id: "gaming", hour: "9", period: "PM", name: "Gaming Zone", line: "“Ek game matrai”\nturns into three hours.", action: "Bring your squad", href: divisions[1].href, image: home.films[1].image, focus: home.films[1].focus },
  { id: "entertainment", hour: "11", period: "PM", name: "Entertainment", line: "Live sessions, watch parties\nand nights people talk about.", action: "Find the next night", href: divisions[0].href, image: divisions[0].image, focus: "50% 30%" },
  { id: "contact", hour: "2", period: "AM", name: "Samakhusi, Kathmandu", line: "See you tomorrow night.", action: "Find the house", href: visit.directions, image: visit.image, focus: "50% 50%" },
];

const clockHours = ["4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM", "12 AM", "1 AM", "2 AM"];

export function AfterDark() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const night = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
      });
      // ponytail: keep gradient stops still; tint and opacity carry the temperature shift.
      night.to(`.temperature`, { backgroundColor: "var(--color-teal-deep)", opacity: .6, duration: 4 }, 0);
      night.to(`.clockRoll`, {
        keyframes: [
          { yPercent: -300 / 11, duration: 1, ease: "none" },
          { yPercent: -500 / 11, duration: 1, ease: "none" },
          { yPercent: -700 / 11, duration: 1, ease: "none" },
          { yPercent: -1000 / 11, duration: 1, ease: "none" },
        ],
        ease: "none",
      }, 0);
      night.to(`.railProgress`, { scaleY: 1, duration: 4 }, 0);
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <div ref={root} className={`house font-sans`} id="top">
      <a className="skip" href="#night">Skip to the night</a>
      <header className="header">
        <a href="#top" className="brand" aria-label="Farakchu, back to top">
          <LogoMark className="logo" />
          <span className="font-wide">Farakchu<span className="brandDot">.</span></span>
        </a>
        <span className="headerNote">One house. A whole night.</span>
        <a href={site.contactHref} className="headerLink">Come through <span aria-hidden="true">↗</span></a>
      </header>

      <div className="temperature" aria-hidden="true" />
      <aside className="clock" aria-label="Follow the night">
        <div className="clockWindow" aria-hidden="true">
          <div className="clockRoll">
            {clockHours.map((time) => <div className="clockFace" key={time}><span className="font-wide">{time.split(" ")[0]}:00</span><span>{time.split(" ")[1]}</span></div>)}
          </div>
        </div>
        <nav className="rail" aria-label="Hours at the house">
          <span className="railProgress" aria-hidden="true" />
          {stops.map((stop) => <a key={stop.id} href={`#${stop.id}`} aria-label={`${stop.hour} ${stop.period}, ${stop.name}`}><span className="railDot" /><span>{stop.hour} {stop.period.toLowerCase()}</span></a>)}
        </nav>
      </aside>

      <main id="night">
        {stops.map((stop, index) => (
          <section key={stop.id} id={stop.id} className={`slot ${index === 0 ? "opening" : ""}`} aria-labelledby={`${stop.id}-heading`}>
            <Image src={stop.image.src} alt={stop.image.alt} fill sizes="100vw" preload={index === 0} className="photo" style={{ objectPosition: stop.focus }} />
            <div className="shade" aria-hidden="true" />
            <div className={`time font-wide`} aria-hidden="true">{stop.hour}<span>{stop.period.toLowerCase()}</span></div>
            <div className="copy">
              {index === 0 ? <>
                <h1 id={`${stop.id}-heading`} className="font-serif">Farak Chu.<br /><span>Open till late.</span></h1>
                <p className="heroLine">Coffee first. See where the night goes.</p>
              </> : <h2 id={`${stop.id}-heading`} className="font-serif">{stop.line}</h2>}
              <a href={stop.href} className="action">{stop.action}<span aria-hidden="true">↗</span></a>
              {index === 4 && <address className="address">{visit.lines.map((line) => <span key={line}>{line}</span>)}<a href={site.phoneHref}>{site.phone}</a></address>}
            </div>
            <div className="slotBottom"><span>{stop.name}</span><span>{index === 0 ? "The house after dark" : `${stop.hour}:00 ${stop.period}`}</span></div>
            {index === 4 && <footer className="footer"><span>© {site.name} · {site.devanagari}</span><div className="credit"><span>Designed &amp; Developed by</span><span className="sparkles"><WebxLogoSparkles width={96} particleDensity={420} particleColor="currentColor" /></span><span className="staticCredit">WebX</span></div></footer>}
          </section>
        ))}
      </main>
    </div>
  );
}

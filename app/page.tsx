import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Reveals } from "@/components/reveals";
import { HeroStack } from "@/components/home/hero-stack";
import { WhatsOn } from "@/components/home/whats-on";
import { Guests } from "@/components/home/guests";
import { ApparelDrop } from "@/components/home/apparel-drop";
import { Cafe } from "@/components/home/cafe";
import { Footer } from "@/components/home/footer";
import { LogoMark } from "@/components/logo-mark";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <SmoothScroll>
        <main>
          <HeroStack />
          <section aria-label="Together at Farakchu" className="relative flex min-h-[36svh] flex-col items-center justify-center gap-6 overflow-hidden bg-lime px-6 py-16 text-center text-teal lg:py-20">
            <div aria-hidden="true" className="flex w-full max-w-64 items-center gap-5">
              <span className="h-px flex-1 bg-teal/25" />
              <LogoMark className="size-10 shrink-0" title="" />
              <span className="h-px flex-1 bg-teal/25" />
            </div>
            <p className="max-w-[24ch] font-serif text-[clamp(2.75rem,5.5vw,5rem)] leading-[1.15]">
              Come for the game.<br />Stay for the people.
            </p>
            <p className="text-xs tracking-wide text-teal/75">Farakchu · Samakhusi, Kathmandu</p>
          </section>
          <WhatsOn />
          <Guests />
          <ApparelDrop />
          <Cafe />
        </main>
        <Footer />
        <Reveals />
      </SmoothScroll>
    </>
  );
}

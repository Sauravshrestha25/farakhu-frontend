import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Reveals } from "@/components/reveals";
import { HeroStack } from "@/components/home/hero-stack";
import { WhatsOn } from "@/components/second/whats-on";
import { Guests } from "@/components/second/guests";
import { ApparelDrop } from "@/components/second/apparel";
import { Cafe } from "@/components/second/cafe";
import { Footer } from "@/components/second/footer";

export default function Second() {
  return (
    <>
      <Preloader />
      <Nav />
      <SmoothScroll>
        <main>
          <HeroStack />
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

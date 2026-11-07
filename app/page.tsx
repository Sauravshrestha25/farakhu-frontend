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

export default function Home() {
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

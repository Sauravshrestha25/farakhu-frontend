import type { Metadata } from "next";
import { Mona_Sans, Arizonia, Space_Mono } from "next/font/google";
import "./globals.css";

const mona = Mona_Sans({ variable: "--font-mona", subsets: ["latin"], axes: ["wdth"] });
const mono = Space_Mono({ variable: "--font-spacemono", subsets: ["latin"], weight: ["400", "700"] });
const serif = Arizonia({ variable: "--font-arizonia", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Farakchu — Farak Chu. I am different.",
  description:
    "Events, gaming, apparel and coffee under one diamond. Farakchu, Samakhusi, Kathmandu.",
  icons: { icon: "/images/logo/logo.jpg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mona.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}

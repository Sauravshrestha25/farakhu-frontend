import type { Metadata } from "next";
import { AfterDark } from "@/components/fourth/after-dark";

export const metadata: Metadata = {
  title: "The House After Dark | Farakchu",
  description: "One night, four sides of Farakchu. Coffee, apparel, gaming and live nights in Samakhusi, Kathmandu.",
};

export default function FourthPage() {
  return <AfterDark />;
}

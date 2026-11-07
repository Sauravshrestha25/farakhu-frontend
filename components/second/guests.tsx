import Image from "next/image";
import { guests } from "@/content/site";

export function Guests() {
  return (
    <section id="guests" className="bg-teal-deep px-4 py-20 text-bone lg:px-8">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="font-wide text-[clamp(2.6rem,5.2vw,5.5rem)] leading-[0.98]">Who&apos;s been through.</h2>
        <p className="max-w-[24rem] text-sm leading-relaxed text-bone/80">
          Bands, fighters, filmmakers and friends who pulled up, played, premiered or celebrated at the house.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
        {guests.map((guest) => (
          <li key={guest.name}>
            <a href={guest.href} target="_blank" rel="noreferrer" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-teal">
                <Image src={guest.image.src} alt={guest.image.alt} fill sizes="(min-width: 1024px) 24vw, 46vw"
                  className="object-cover transition-transform duration-500 motion-reduce:transition-none motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]" />
              </div>
              <h3 className="mt-3 font-serif text-xl lg:text-2xl">{guest.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-bone/80 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100">{guest.note}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

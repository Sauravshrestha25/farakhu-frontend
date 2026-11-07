import Image from "next/image";
import { apparelDrop } from "@/content/site";

export function ApparelDrop() {
  return (
    <section id="apparel" className="relative overflow-hidden bg-bone px-4 py-24 text-teal lg:px-8 lg:py-32">
      <div className="relative mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
        <h2 className="font-wide text-[clamp(2.6rem,6vw,6rem)] leading-[0.92]">
          <span className="block overflow-hidden">
            <span className="ad-head-line block">Wear the</span>
          </span>
          <span className="block overflow-hidden pt-[0.08em]">
            <span className="ad-head-line block">
              <span className="inline-block bg-teal px-[0.08em] leading-[0.9] text-lime">difference.</span>
            </span>
          </span>
        </h2>
        <div className="flex max-w-[24rem] flex-col gap-5">
          <p className="text-justify text-xs uppercase leading-[1.25] tracking-[0.025rem] text-teal/75">
            Unisex hoodies in premium anti-peel brushed fleece. Small runs, numbered chapters, gone when they&apos;re gone.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={apparelDrop.dm} target="_blank" rel="noreferrer" className="rounded-[50%] bg-teal px-7 py-3 font-wide text-[0.625rem] text-lime transition-colors hover:bg-lime hover:text-teal">
              DM to order
            </a>
            <a href={apparelDrop.merch} target="_blank" rel="noreferrer" className="text-sm underline-offset-4 hover:underline">
              Official Nepal merch →
            </a>
          </div>
        </div>
      </div>

      <ul className="relative grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {apparelDrop.items.map((it, i) => (
          <li key={it.name} className="ad-card">
            <a href={apparelDrop.dm} target="_blank" rel="noreferrer" aria-label={`${it.name}, ${it.chapter}. DM to order`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-bone-dim">
                <Image src={it.image} alt={it.desc} fill sizes="(min-width: 992px) 24vw, 48vw" className="object-cover transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-0 group-focus-visible:opacity-0" />
                <Image src={it.alt} alt="" fill sizes="(min-width: 992px) 24vw, 48vw" className="object-cover opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100" />
                {it.tag && (
                  <span className="absolute left-3 top-3 bg-bone px-2.5 py-1 font-wide text-[0.625rem] text-teal">
                    {it.tag}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl leading-none lg:text-2xl">{it.name}</h3>
                  <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.025rem] text-teal/60">{it.chapter}</p>
                </div>
                <span className="font-wide text-[0.625rem] text-teal/40">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

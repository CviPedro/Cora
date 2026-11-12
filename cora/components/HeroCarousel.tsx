"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  image?: string; // quando houver arte, é só preencher
};

const slides: Slide[] = [
  {
    title: "Natal Cora",
    subtitle: "Presentes impressos em 3D para quem você ama",
    cta: "Ver produtos natalinos",
    href: "/loja?tag=natalino",
    bg: "bg-vinho",
  },
  {
    title: "Banner 2",
    subtitle: "Espaço reservado para arte",
    cta: "Ver loja",
    href: "/loja",
    bg: "bg-brasa",
  },
  {
    title: "Banner 3",
    subtitle: "Espaço reservado para arte",
    cta: "Ver loja",
    href: "/loja",
    bg: "bg-nuvem",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 8000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section aria-label="Destaques" className="relative mx-auto max-w-6xl py-2">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-3 flex">
          {slides.map((s) => (
            <div key={s.title} className="min-w-0 flex-[0_0_88%] pl-2 md:flex-[0_0_80%]">
              <div
                className={`${s.bg} relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl px-6 text-center text-linho md:aspect-[21/9]`}
              >
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )} 
                <div className="relative max-w-xl">
                  <h2 className="text-2xl font-bold md:text-5xl">{s.title}</h2>
                  <p className="mt-1 text-sm md:mt-3 md:text-lg">{s.subtitle}</p>
                  <Link
                    href={s.href}
                    className="mt-3 inline-block rounded-full bg-linho px-4 py-2 text-sm font-semibold text-vinho md:mt-5"
                  >
                    {s.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Ir para o banner ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 w-2 rounded-full ${i === selected ? "bg-linho" : "bg-linho/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
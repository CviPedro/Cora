"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import type { CardProduct } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type Props = {
  title: string;
  products: CardProduct[];
  linkHref?: string;
  linkLabel?: string;
};

export default function ProductCarousel({ title, products, linkHref, linkLabel }: Props) {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });

  if (products.length === 0) return null;

  return (
    <section aria-label={title} className="mx-auto max-w-6xl px-3 py-6">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-xl font-bold text-vinho md:text-2xl">{title}</h2>
        {linkHref && (
          <Link href={linkHref} className="text-sm font-medium text-brasa">
            {linkLabel}
          </Link>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-3 flex">
          {products.map((p) => (
            <div key={p.id} className="min-w-0 flex-[0_0_42%] pl-3 sm:flex-[0_0_30%] md:flex-[0_0_16.66%]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
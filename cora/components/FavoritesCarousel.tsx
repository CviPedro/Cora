"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import type { CardProduct } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function FavoritesCarousel({ products }: { products: CardProduct[] }) {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });

  if (products.length === 0) return null;

  return (
    <section aria-labelledby="preferidos" className="mx-auto max-w-6xl px-3 py-6">
      <div className="mb-3 flex items-end justify-between">
        <h2 id="preferidos" className="text-xl font-bold text-vinho md:text-2xl">
          Preferidos da galera
        </h2>
        <Link href="/loja?ordem=mais-vendidos" className="text-sm font-medium text-brasa">
          Ir para os favoritos →
        </Link>
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
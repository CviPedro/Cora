"use client";

import { useEffect, useState } from "react";
import ProductCarousel from "@/components/ProductCarousel";
import { readCart } from "@/lib/cart";
import { recommendedAction } from "@/lib/actions";
import type { CardProduct } from "@/lib/products";

export default function RecommendedSection() {
  const [products, setProducts] = useState<CardProduct[] | null>(null);

  useEffect(() => {
    const ids = readCart().map((i) => i.productId);
    recommendedAction(ids)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  if (!products) return <div className="mx-auto h-64 max-w-6xl px-3 py-6" />;
  return <ProductCarousel title="Recomendados" products={products} />;
}
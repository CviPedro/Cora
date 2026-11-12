import { Suspense } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import RecommendedSection from "@/components/RecommendedSection";
import CartSection from "@/components/CartSection";
import { getBestSellers } from "@/lib/products";

async function Favorites() {
  const favorites = await getBestSellers(16);
  return (
    <ProductCarousel
      title="Preferidos da galera"
      products={favorites}
      linkHref="/loja?ordem=mais-vendidos"
      linkLabel="Ir para os favoritos →"
    />
  );
}

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <Suspense fallback={<div className="mx-auto h-64 max-w-6xl px-3 py-6" />}>
        <Favorites />
      </Suspense>
      <RecommendedSection />
      <CartSection />
    </main>
  );
}
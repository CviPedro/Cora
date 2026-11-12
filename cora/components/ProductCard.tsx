import Link from "next/link";
import type { CardProduct } from "@/lib/products";
import { brl } from "@/lib/format";

export default function ProductCard({ product }: { product: CardProduct }) {
  return (
    <Link
      href={`/produto/${product.slug}`}
      className="block overflow-hidden rounded-2xl border border-cacau/10 bg-white/60"
    >
      <div className="aspect-square bg-rosa-argila/30">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-cacau/70">{product.description}</p>
        <p className="mt-2 text-sm font-bold text-vinho">{brl(product.priceCents)}</p>
      </div>
    </Link>
  );
}
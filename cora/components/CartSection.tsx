"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";
import { cartProductsAction } from "@/lib/actions";
import { brl } from "@/lib/format";
import type { CardProduct } from "@/lib/products";

type Line = { product: CardProduct; quantity: number };

export default function CartSection() {
  const [lines, setLines] = useState<Line[] | null>(null);

  useEffect(() => {
  const cart = readCart();
  const ids = cart.map((i) => i.productId);

  const request: Promise<CardProduct[]> =
    ids.length > 0 ? cartProductsAction(ids) : Promise.resolve([]);

  request
    .then((products) => {
      const byId = new Map(products.map((p) => [p.id, p]));
      setLines(
        cart.flatMap((c) => {
          const product = byId.get(c.productId);
          return product ? [{ product, quantity: c.quantity }] : [];
        })
      );
    })
    .catch(() => setLines([]));
    }, []);

  if (!lines) return null;

  const total = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);

  return (
    <section aria-label="Seu carrinho" className="mx-auto max-w-6xl px-3 py-6">
      <div className="rounded-2xl border border-cacau/10 bg-white/60 p-4">
        <h2 className="text-xl font-bold text-vinho md:text-2xl">Seu carrinho</h2>

        {lines.length === 0 ? (
          <p className="mt-2 text-sm">
            Seu carrinho está vazio.{" "}
            <Link href="/loja" className="font-medium text-brasa">
              Ver a loja
            </Link>
          </p>
        ) : (
          <>
            <ul className="mt-3 divide-y divide-cacau/10">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-3 py-2">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-rosa-argila/30">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <span className="flex-1 text-sm">{product.name}</span>
                  <span className="text-sm">
                    {quantity} × {brl(product.priceCents)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-bold">Total: {brl(total)}</p>
              <Link
                href="/carrinho"
                className="rounded-full bg-vinho px-5 py-2 text-sm font-semibold text-linho"
              >
                Ir para o carrinho
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
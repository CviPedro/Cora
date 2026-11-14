"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { readCart, subscribeCart, subscribeCartOpen } from "@/lib/cart";
import { cartProductsAction } from "@/lib/actions";
import { brl } from "@/lib/format";
import type { CardProduct } from "@/lib/products";

type Line = { product: CardProduct; quantity: number };

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[] | null>(null);
  const [cep, setCep] = useState("");
  const [freteMsg, setFreteMsg] = useState("");

  const load = useCallback(() => {
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

  // abre quando alguém chama openCart()
  useEffect(() => subscribeCartOpen(() => setOpen(true)), []);

  // enquanto aberto, carrega os itens e se atualiza quando o carrinho muda
  useEffect(() => {
    if (!open) return;
    load();
    return subscribeCart(load);
  }, [open, load]);

  // Esc fecha e a página de trás não rola
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function calcularFrete(e: FormEvent) {
    e.preventDefault();
    const digits = cep.replace(/\D/g, "");
    setFreteMsg(
      digits.length === 8 ? "Cálculo de frete em breve." : "Digite um CEP válido (8 números)."
    );
  }

  const items = lines ?? [];
  const total = items.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-cacau/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        className={`fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-sm flex-col bg-linho shadow-xl transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-cacau/10 p-4">
          <h2 className="text-lg font-bold text-vinho">Seu carrinho</h2>
          <button type="button" aria-label="Fechar carrinho" onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {lines === null ? (
            <p className="py-6 text-sm">Carregando...</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-sm">Seu carrinho está vazio.</p>
          ) : (
            <ul className="divide-y divide-cacau/10">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-3 py-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-rosa-argila/30">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-cacau/70">
                      {quantity} × {brl(product.priceCents)}
                    </p>
                  </div>
                  <p className="text-sm font-bold">{brl(product.priceCents * quantity)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-cacau/10 p-4">
          <form onSubmit={calcularFrete} className="flex gap-2">
            <input
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              inputMode="numeric"
              maxLength={9}
              placeholder="Calcular frete (CEP)"
              className="min-w-0 flex-1 rounded-full border border-cacau/20 bg-white/60 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-acafrao"
            />
            <button
              type="submit"
              className="rounded-full border border-vinho px-4 py-2 text-sm font-medium text-vinho"
            >
              Calcular
            </button>
          </form>
          {freteMsg && <p className="mt-1 text-xs text-cacau/70">{freteMsg}</p>}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm">Total</span>
            <span className="text-lg font-bold">{brl(total)}</span>
          </div>

          {items.length > 0 ? (
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full bg-vinho py-3 text-center font-semibold text-linho"
            >
              Compre agora
            </Link>
          ) : (
            <span className="mt-3 block rounded-full bg-cacau/20 py-3 text-center font-semibold text-cacau/50">
              Compre agora
            </span>
          )}
        </div>
      </aside>
    </>
  );
}
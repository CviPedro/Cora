"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { openCart } from "@/lib/cart";
import { openAuth } from "@/lib/ui";
import { useCartCount } from "@/lib/useCartCount";
import { useAuthUser } from "@/lib/useAuthUser";
import UserMenu from "@/components/UserMenu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartCount();
  const user = useAuthUser();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 20 : y > 60));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-vinho text-linho transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 p-3 md:flex-nowrap md:gap-6">
        <Link
          href="/"
          className={`flex items-center justify-center rounded border border-dashed border-linho/60 text-xs ${
            scrolled ? "h-8 w-20" : "h-10 w-28"
          }`}
        >
          LOGO
        </Link>

        <form
          action="/loja"
          method="get"
          role="search"
          className={scrolled ? "flex-1" : "order-last w-full md:order-none md:flex-1"}
        >
          <input
            type="search"
            name="q"
            placeholder="Buscar produtos"
            className="w-full rounded-full bg-linho px-4 py-2 text-sm text-cacau placeholder:text-cacau/60 focus:outline-none focus:ring-2 focus:ring-acafrao"
          />
        </form>

        <nav className="ml-auto flex items-center gap-4">
          {/* carrinho: só no computador (no celular fica no rodapé) */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrinho${cartCount > 0 ? ` (${cartCount} itens)` : ""}`}
            className="relative hidden md:block"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-acafrao px-1 text-center text-[10px] font-bold leading-4 text-cacau">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* coleções: só para quem está logado */}
          {user && (
            <Link href="/colecoes" aria-label="Minhas coleções">
              <Heart className="h-6 w-6" />
            </Link>
          )}

          {/* conta */}
          {user === undefined ? (
            <span className="h-9 w-9" aria-hidden />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="text-sm font-medium hover:underline"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
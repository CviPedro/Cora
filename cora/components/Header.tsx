"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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

        <nav className={scrolled ? "ml-auto hidden gap-2 md:flex" : "ml-auto flex gap-2"}>
          <Link href="/cadastro" className="rounded-full border border-linho px-3 py-1.5 text-sm">
            Cadastre-se
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-acafrao px-3 py-1.5 text-sm font-medium text-cacau"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
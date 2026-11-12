"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { House, ShoppingCart, User } from "lucide-react";
import { getCartCount, subscribeCart } from "@/lib/cart";

const items = [
  { href: "/", label: "Início", icon: House, match: (p: string) => p === "/", badge: false },
  { href: "/perfil", label: "Perfil", icon: User, match: (p: string) => p.startsWith("/perfil"), badge: false },
  { href: "/carrinho", label: "Carrinho", icon: ShoppingCart, match: (p: string) => p.startsWith("/carrinho"), badge: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const cartCount = useSyncExternalStore(subscribeCart, getCartCount, () => 0);
  const activeIndex = items.findIndex((item) => item.match(pathname));

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-cacau/10 bg-linho pb-[env(safe-area-inset-bottom)]"
    >
      <div className="relative mx-auto max-w-6xl">
        {/* barra única que desliza entre os itens */}
        <span
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 flex w-1/3 justify-center transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
            activeIndex === -1 ? "opacity-0" : "opacity-100"
          }`}
          style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
        >
          <span className="h-1 w-10 rounded-b-full bg-vinho" />
        </span>

        <ul className="grid grid-cols-3">
          {items.map(({ href, label, icon: Icon, badge }, i) => {
            const active = i === activeIndex;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                    active ? "font-semibold text-vinho" : "text-cacau/60"
                  }`}
                >
                  <span className="relative">
                    <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 2} />
                    {badge && cartCount > 0 && (
                      <span className="absolute -right-2 -top-1 min-w-4 rounded-full bg-brasa px-1 text-center text-[10px] font-bold leading-4 text-linho">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>
                  {label}
                  {badge && cartCount > 0 && (
                    <span className="sr-only"> ({cartCount} itens)</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
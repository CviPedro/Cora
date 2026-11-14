"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ShoppingCart, User } from "lucide-react";
import { openCart } from "@/lib/cart";
import { useCartCount } from "@/lib/useCartCount";

const items = [
  { key: "home", href: "/", label: "Início", icon: House, match: (p: string) => p === "/" },
  { key: "perfil", href: "/perfil", label: "Perfil", icon: User, match: (p: string) => p.startsWith("/perfil") },
  { key: "cart", href: null, label: "Carrinho", icon: ShoppingCart, match: () => false },
];

export default function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const activeIndex = items.findIndex((item) => item.match(pathname));

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-cacau/10 bg-linho pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="relative mx-auto max-w-6xl">
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
          {items.map(({ key, href, label, icon: Icon }, i) => {
            const active = i === activeIndex;
            const className = `flex w-full flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
              active ? "font-semibold text-vinho" : "text-cacau/60"
            }`;
            const content = (
              <>
                <span className="relative">
                  <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 2} />
                  {key === "cart" && cartCount > 0 && (
                    <span className="absolute -right-2 -top-1 min-w-4 rounded-full bg-brasa px-1 text-center text-[10px] font-bold leading-4 text-linho">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>
                {label}
              </>
            );

            return (
              <li key={key}>
                {href ? (
                  <Link href={href} aria-current={active ? "page" : undefined} className={className}>
                    {content}
                  </Link>
                ) : (
                  <button type="button" onClick={openCart} aria-haspopup="dialog" className={className}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
import { useSyncExternalStore } from "react";
import { getCartCount, subscribeCart } from "@/lib/cart";

export function useCartCount() {
  return useSyncExternalStore(subscribeCart, getCartCount, () => 0);
}
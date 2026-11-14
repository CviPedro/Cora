export type CartItem = { productId: number; quantity: number };

const KEY = "cora-cart";
const EVENT = "cora-cart-change";
const OPEN_EVENT = "cora-cart-open";

function notify() {
  window.dispatchEvent(new Event(EVENT));
}

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data)
      ? data.filter((i) => Number.isInteger(i?.productId) && Number.isInteger(i?.quantity))
      : [];
  } catch {
    return [];
  }
}

export function addToCart(productId: number, quantity = 1) {
  const cart = readCart();
  const found = cart.find((i) => i.productId === productId);
  if (found) found.quantity += quantity;
  else cart.push({ productId, quantity });
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
    notify();
  } catch {}
}

export function getCartCount(): number {
  return readCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function subscribeCart(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // mudanças em outras abas
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function openCart() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function subscribeCartOpen(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}
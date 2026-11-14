export type AuthMode = "login" | "signup";

const AUTH_EVENT = "cora-auth-open";

export function openAuth(mode: AuthMode = "login") {
  window.dispatchEvent(new CustomEvent<AuthMode>(AUTH_EVENT, { detail: mode }));
}

export function subscribeAuthOpen(callback: (mode: AuthMode) => void) {
  const handler = (e: Event) => callback((e as CustomEvent<AuthMode>).detail ?? "login");
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}
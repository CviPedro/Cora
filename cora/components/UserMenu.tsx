"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

function displayName(user: User) {
  const meta = user.user_metadata as { name?: string; full_name?: string } | undefined;
  return (meta?.name ?? meta?.full_name ?? user.email ?? "?").trim();
}

export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const name = displayName(user);
  const initial = name.charAt(0).toUpperCase() || "?";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function logout() {
    setOpen(false);
    await createClient().auth.signOut();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Menu da conta"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-acafrao text-sm font-bold text-cacau"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 rounded-xl border border-cacau/10 bg-linho p-2 text-cacau shadow-lg">
          <p className="truncate px-3 pt-2 text-sm font-semibold">{name}</p>
          <p className="truncate px-3 pb-2 text-xs text-cacau/60">{user.email}</p>
          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm hover:bg-vinho/10"
          >
            Meu perfil
          </Link>
          <button
            type="button"
            onClick={logout}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-vinho/10"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
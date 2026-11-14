"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { subscribeAuthOpen, type AuthMode } from "@/lib/ui";
import { signUpAction } from "@/lib/auth-actions";
import { createClient } from "@/lib/supabase/client";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<null | { needsConfirmation: boolean }>(null);

  useEffect(
    () =>
      subscribeAuthOpen((m) => {
        setError("");
        setInfo("");
        setDone(null);
        setPassword("");
        setMode(m);
        setOpen(true);
      }),
    []
  );

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

  function switchTo(next: AuthMode) {
    setError("");
    setInfo("");
    setDone(null);
    setPassword("");
    setMode(next);
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
        const { error } = await createClient().auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        });

        if (error) {
            console.error("login error:", error.code, error.message);
            if (error.code === "invalid_credentials") setError("E-mail ou senha incorretos.");
            else if (error.code === "email_not_confirmed") setError("Confirme seu e-mail antes de entrar.");
            else if (error.code === "over_request_rate_limit") setError("Muitas tentativas. Aguarde um pouco.");
            else setError("Não foi possível entrar. Tente novamente.");
        } else {
            setPassword("");
            setOpen(false);
        }
    } catch {
        setError("Erro de conexão. Tente novamente.");
    } finally {
        setPending(false);
    }
    }

  async function onSignup(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const res = await signUpAction({ name, email, password });
      if (res.ok) {
        setDone({ needsConfirmation: res.needsConfirmation });
        setPassword("");
      } else {
        setError(res.error);
      }
    } catch (err) {
    console.error("Erro no cadastro (navegador):", err);
    setError(
        process.env.NODE_ENV === "production"
        ? "Erro de conexão. Tente novamente."
        : `Erro (modo dev): ${err instanceof Error ? err.message : String(err)}`
    );

    } finally {
      setPending(false);
    }
  }

  const input =
    "w-full rounded-xl border border-cacau/20 bg-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-acafrao";
  const linkBtn = "font-medium text-brasa underline";

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-[opacity,visibility] duration-200 ${
        open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-cacau/50" onClick={() => setOpen(false)} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "login" ? "Login" : "Cadastre-se"}
        className="relative w-full max-w-md rounded-2xl bg-linho p-6 shadow-xl"
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4"
        >
          <X className="h-6 w-6" />
        </button>

        {mode === "login" ? (
          <form onSubmit={onLogin} className="space-y-3">
            <h2 className="pr-8 text-xl font-bold text-vinho">Identifique-se para continuar</h2>

            <input
              className={input}
              type="email"
              placeholder="E-mail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={input}
              type="password"
              placeholder="Senha"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
                <p role="alert" className="text-sm text-brasa">
                    {error}
                </p>
                )}

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-full bg-vinho py-3 font-semibold text-linho disabled:opacity-60"
                >
                    {pending ? "Entrando..." : "Entrar"}
                </button>

            <p className="pt-1 text-center text-sm">
              Não possui uma conta?{" "}
              <button type="button" onClick={() => switchTo("signup")} className={linkBtn}>
                Cadastre-se
              </button>
            </p>
          </form>
        ) : done ? (
          <div className="py-4 text-center">
            <h2 className="text-xl font-bold text-vinho">Conta criada!</h2>
            <p className="mt-2 text-sm">
              {done.needsConfirmation
                ? `Enviamos um e-mail de confirmação para ${email}. Confirme para ativar sua conta.`
                : "Sua conta foi criada com sucesso."}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-full bg-vinho px-6 py-2 text-sm font-semibold text-linho"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={onSignup} className="space-y-3">
            <h2 className="pr-8 text-xl font-bold text-vinho">Cadastre-se</h2>

            <input
              className={input}
              placeholder="Nome"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className={input}
              type="email"
              placeholder="E-mail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={input}
              type="password"
              placeholder="Senha (mínimo 8 caracteres)"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p role="alert" className="text-sm text-brasa">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-vinho py-3 font-semibold text-linho disabled:opacity-60"
            >
              {pending ? "Criando conta..." : "Criar conta"}
            </button>

            <p className="pt-1 text-center text-sm">
              Já possui uma conta?{" "}
              <button type="button" onClick={() => switchTo("login")} className={linkBtn}>
                Entrar
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
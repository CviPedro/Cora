"use server";

import { createClient } from "@supabase/supabase-js";

type Result = { ok: true; needsConfirmation: boolean } | { ok: false; error: string };

export async function signUpAction(input: {
  name: string;
  email: string;
  password: string;
}): Promise<Result> {
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim().toLowerCase();
  const password = input.password ?? "";

  if (name.length < 2) return { ok: false, error: "Informe seu nome." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Informe um e-mail válido." };
  if (password.length < 8) {
    return { ok: false, error: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin;

  const supabase = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    console.error("signUp error:", error.code, error.status, error.message);

    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return { ok: false, error: "Este e-mail já está cadastrado. Tente entrar." };
    }
    if (error.code === "weak_password") {
      return { ok: false, error: "Senha fraca. Misture letras, números e símbolos." };
    }
    if (error.code === "over_email_send_rate_limit") {
      return { ok: false, error: "Muitas tentativas. Aguarde um pouco e tente de novo." };
    }
    return {
      ok: false,
      error:
        process.env.NODE_ENV === "production"
          ? "Não foi possível criar a conta. Tente novamente."
          : `Erro (modo dev): ${error.message}`,
    };
  }

  // com confirmação ligada, e-mail repetido volta sem erro e sem identidades
  if (data.user && data.user.identities?.length === 0) {
    return { ok: false, error: "Este e-mail já está cadastrado. Tente entrar." };
  }

  return { ok: true, needsConfirmation: !data.session };
}
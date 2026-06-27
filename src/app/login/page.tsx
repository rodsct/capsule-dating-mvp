"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { useGame } from "@/lib/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { login } = useGame();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Escribe tu nombre de usuario.");
      return;
    }
    const u = login(trimmed);
    if (!u) {
      setError("No existe esa cuenta. Regístrate primero o entra con Google.");
      return;
    }
    setBusy(true);
    const res = await signIn("credentials", {
      username: trimmed,
      redirect: false,
    });
    setBusy(false);
    if (!res || res.error) {
      setError("No se pudo iniciar sesión. Intenta con Google.");
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="glass rounded-2xl p-6">
        <h1 className="font-display text-xl font-bold">Bienvenido de vuelta</h1>
        <p className="mt-1 text-xs text-white/55">
          Entra con Google para comprar o publicar tu cápsula. Tus créditos y
          cápsulas se guardan en este navegador.
        </p>

        <div className="mt-5">
          <GoogleSignInButton callbackUrl={next} label="Entra con Google" />
        </div>

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-white/35">
          <span className="h-px flex-1 bg-white/10" /> O usa tu usuario
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-white/60">
              Nombre de usuario
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="p. ej. zorro_neon"
              disabled={busy}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-cyber-neon disabled:opacity-60"
            />
          </div>
          {error && <p className="text-sm text-cyber-neon">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyber-neon px-6 py-3 text-sm font-bold text-black hover:shadow-neon disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" /> {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-white/50">
          ¿Nuevo aquí?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="text-cyber-cyan underline"
          >
            Crea una cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-24 text-sm text-white/50">
          Cargando…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
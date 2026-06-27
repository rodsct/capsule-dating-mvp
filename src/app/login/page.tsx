"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useGame } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { login } = useGame();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError("Escribe tu nombre de usuario.");
      return;
    }
    const u = login(username.trim());
    if (!u) {
      setError("No existe esa cuenta. Regístrate primero.");
      return;
    }
    router.push(next);
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="glass rounded-2xl p-6">
        <h1 className="font-display text-xl font-bold">Bienvenido de vuelta</h1>
        <p className="mt-1 text-xs text-white/55">
          Inicia sesión con tu nombre de usuario para guardar tus créditos y
          cápsulas. (Datos simulados en tu navegador.)
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-white/60">
              Nombre de usuario
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="p. ej. zorro_neon"
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-cyber-neon"
            />
          </div>
          {error && <p className="text-sm text-cyber-neon">{error}</p>}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyber-neon px-6 py-3 text-sm font-bold text-black hover:shadow-neon"
          >
            <LogIn className="h-4 w-4" /> Entrar
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
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useGame } from "@/lib/auth";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { register } = useGame();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (username.trim().length < 2) {
      setError("Elige al menos 2 caracteres.");
      return;
    }
    register(username.trim());
    router.push(next);
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="glass rounded-2xl p-6">
        <h1 className="font-display text-xl font-bold">Únete a la sala</h1>
        <p className="mt-1 text-xs text-white/55">
          Elige un nombre de usuario para empezar con monedas demo.
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyber-cyan px-6 py-3 text-sm font-bold text-black hover:shadow-neon-cyan"
          >
            <UserPlus className="h-4 w-4" /> Crear cuenta
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-white/50">
          ¿Ya tienes cuenta?{" "}
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="text-cyber-cyan underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-24 text-sm text-white/50">
          Cargando…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
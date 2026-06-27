"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { UserPlus } from "lucide-react";
import { useGame } from "@/lib/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { register } = useGame();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError("Elige al menos 2 caracteres.");
      return;
    }
    register(trimmed);
    setBusy(true);
    const res = await signIn("credentials", {
      username: trimmed,
      redirect: false,
    });
    setBusy(false);
    if (!res || res.error) {
      setError("No se pudo crear la sesión. Intenta con Google.");
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="glass rounded-2xl p-6">
        <h1 className="font-display text-xl font-bold">Únete a la sala</h1>
        <p className="mt-1 text-xs text-white/55">
          Entra con Google y empieza con 1 crédito de cortesía (1 crédito =
          $29 MXN). Compra más créditos en tu perfil.
        </p>

        <div className="mt-5">
          <GoogleSignInButton callbackUrl={next} label="Entra con Google" />
        </div>

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-white/35">
          <span className="h-px flex-1 bg-white/10" /> O crea tu usuario
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyber-cyan px-6 py-3 text-sm font-bold text-black hover:shadow-neon-cyan disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" /> {busy ? "Creando…" : "Crear cuenta"}
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
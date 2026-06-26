"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, Heart, LogOut, Sparkles, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getPerson } from "@/data/mock-data";
import { NeonButton } from "@/components/NeonButton";

export default function MyProfilePage() {
  const { user, ready, matches, logout, addCredits } = useAuth();

  if (!ready) {
    return (
      <div className="grid place-items-center py-32 text-white/50 text-sm">
        Cargando…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <User className="w-10 h-10 text-cyber-neon mx-auto mb-4" />
        <h1 className="font-display font-bold text-2xl mb-3">No has iniciado sesión</h1>
        <p className="text-white/60 text-sm mb-6">
          Se crea una cuenta demo automática en la primera visita, pero puedes
          salir y crear tu propio coleccapsulista.
        </p>
        <div className="flex justify-center gap-3">
          <NeonButton href="/register">Únete gratis</NeonButton>
          <NeonButton href="/login" variant="ghost">
            Entrar
          </NeonButton>
        </div>
      </div>
    );
  }

  const isDemo = user.username.startsWith("demo_");

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 sm:p-8 relative scanlines"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
<div>
              <span className="text-xs uppercase tracking-widest text-cyber-neon mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Tu cuenta de cápsulas
                {isDemo && (
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-cyber-lime/20 text-cyber-lime font-bold tracking-widest">
                    MODO DEMO
                  </span>
                )}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl">
                @{user.username}
              </h1>
              <p className="text-white/50 text-xs mt-1">
                Te uniste {new Date(user.createdAt).toLocaleDateString("es-MX")}
              </p>
            </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-full glass border border-cyber-lime/40 text-cyber-lime text-sm font-semibold flex items-center gap-1.5">
              <Coins className="w-4 h-4" /> {user.credits} monedas
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-full glass text-white/70 hover:text-cyber-neon text-xs inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/70 mb-3">
            ¿Sin monedas? En este MVP puedes tomar una recarga para seguir tirando
            en las máquinas (simulado — sin pago real).
          </p>
          <div className="flex gap-2">
            {[3, 5, 10].map((n) => (
              <button
                key={n}
                onClick={() => addCredits(n)}
                className="px-4 py-2 rounded-full bg-cyber-cyan text-black text-xs font-semibold hover:shadow-neon-cyan transition-all"
              >
                +{n} monedas
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mt-8">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-cyber-neon" /> Tus tirones de cápsula
        </h2>

        {matches.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-white/60 text-sm">
            Aún no has tirado ninguna cápsula.{" "}
            <Link href="/lobby" className="text-cyber-cyan underline">
              Entra a la sala →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {matches.map((m, i) => {
              const p = getPerson(m.personId);
              if (!p) return null;
              return (
                <motion.div
                  key={`${m.personId}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/profile/${p.id}`}
                    className="flex items-center gap-3 glass rounded-2xl p-3 hover:-translate-y-0.5 hover:shadow-neon transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {p.emoji} {p.name}, {p.age}
                      </div>
                      <div className="text-xs text-white/50">
                        {new Date(m.openedAt).toLocaleString("es-MX")}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
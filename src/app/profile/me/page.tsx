"use client";

import Link from "next/link";
import { Boxes, Coins, LogOut, MessageCircle, Trash2, Plus } from "lucide-react";
import { useGame } from "@/lib/auth";
import { getProfile } from "@/data/mock-data";
import { formatMXN, photoGradient, SLOTS_PER_MACHINE } from "@/lib/utils";

const ADD_AMOUNTS = [29, 100, 500];

export default function MyProfilePage() {
  const {
    ready,
    user,
    placements,
    purchases,
    chats,
    ownCapsule,
    removeOwnPlacement,
    addMonedas,
    logout,
  } = useGame();

  if (!ready) {
    return (
      <div className="grid place-items-center py-24 text-sm text-white/50">
        Cargando…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-sm py-16 text-center">
        <h1 className="font-display text-xl font-bold">No has iniciado sesión</h1>
        <p className="mt-1 text-sm text-white/55">
          La cuenta demo se crea automáticamente. Puedes crear una propia.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link
            href="/register"
            className="rounded-full bg-cyber-neon px-5 py-2.5 text-sm font-bold text-black"
          >
            Crear cuenta
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold"
          >
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  const mine = placements.filter((p) => p.profileId === "me");
  const recentChats = Object.entries(chats)
    .filter(([, list]) => list.length > 0)
    .sort(
      (a, b) =>
        (b[1][b[1].length - 1]?.at ?? 0) - (a[1][a[1].length - 1]?.at ?? 0),
    )
    .slice(0, 5);

  return (
    <div className="py-2 space-y-6">
      {/* Account card */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-cyber-neon">
              Mi cuenta
            </span>
            <h1 className="font-display text-xl font-bold">@{user.username}</h1>
            <p className="text-[11px] text-white/45">
              Te uniste {new Date(user.createdAt).toLocaleDateString("es-MX")}
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-cyber-neon"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-cyber-lime/40 bg-white/5 px-3 py-1.5 text-sm font-semibold text-cyber-lime">
            <Coins className="h-4 w-4" /> {user.monedas} monedas
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {ADD_AMOUNTS.map((n) => (
            <button
              key={n}
              onClick={() => addMonedas(n)}
              className="inline-flex items-center gap-1 rounded-full bg-cyber-cyan px-3 py-1.5 text-xs font-bold text-black hover:shadow-neon-cyan"
            >
              <Plus className="h-3.5 w-3.5" /> {n} monedas
            </button>
          ))}
        </div>
      </div>

      {/* Mis cápsulas publicadas */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
          <Boxes className="h-4 w-4 text-cyber-lime" /> Mis cápsulas publicadas
        </h2>
        {mine.length === 0 ? (
          <div className="glass rounded-2xl p-5 text-center text-xs text-white/55">
            No has publicado ninguna cápsula. Entra a una máquina y elige un
            espacio libre.{" "}
            <Link href="/lobby" className="text-cyber-cyan underline">
              Ir a la sala
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {mine.map((p) => (
              <div
                key={`${p.machineId}-${p.slot}`}
                className="glass flex items-center justify-between gap-3 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{ownCapsule?.emoji ?? "🫧"}</span>
                  <div>
                    <div className="text-sm font-semibold">
                      {ownCapsule?.firstName ?? "Tú"} · {p.machineId} · espacio{" "}
                      {p.slot + 1}
                    </div>
                    <div className="text-[10px] text-white/45">
                      {SLOTS_PER_MACHINE} slots por máquina
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeOwnPlacement(p.machineId, p.slot)}
                  className="inline-flex items-center gap-1 rounded-full border border-cyber-neon/40 bg-cyber-neon/10 px-3 py-1.5 text-xs text-cyber-neon hover:bg-cyber-neon/20"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cápsulas compradas */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
          <Coins className="h-4 w-4 text-cyber-neon" /> Cápsulas compradas
        </h2>
        {purchases.length === 0 ? (
          <div className="glass rounded-2xl p-5 text-center text-xs text-white/55">
            Aún no has comprado cápsulas.{" "}
            <Link href="/lobby" className="text-cyber-cyan underline">
              Explorar máquinas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {purchases.map((pr) => {
              const profile = getProfile(pr.profileId);
              if (!profile) return null;
              return (
                <Link
                  key={pr.profileId}
                  href={`/profile/${pr.profileId}`}
                  className="glass rounded-xl p-3 text-center hover:-translate-y-0.5"
                >
                  <div
                    className="mx-auto grid h-12 w-12 place-items-center rounded-full text-lg"
                    style={{ background: photoGradient(profile.photoGradient) }}
                  >
                    {profile.emoji}
                  </div>
                  <div className="mt-2 truncate text-sm font-semibold">
                    {profile.firstName}, {profile.age}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-white/45">
                    {new Date(pr.boughtAt).toLocaleDateString("es-MX")}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Mis chats */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
          <MessageCircle className="h-4 w-4 text-cyber-cyan" /> Mis chats
        </h2>
        {recentChats.length === 0 ? (
          <div className="glass rounded-2xl p-5 text-center text-xs text-white/55">
            Sin chats todavía.{" "}
            <Link href="/chats" className="text-cyber-cyan underline">
              Ver chats
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentChats.map(([profileId, list]) => {
              const profile = getProfile(profileId);
              const last = list[list.length - 1];
              return (
                <Link
                  key={profileId}
                  href={`/chat/${profileId}`}
                  className="glass flex items-center gap-3 rounded-xl p-3 hover:-translate-y-0.5"
                >
                  <span className="text-lg">{profile?.emoji ?? "🫧"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {profile?.fullName ?? profileId}
                    </div>
                    <div className="truncate text-[11px] text-white/50">
                      {last.mine ? "Tú: " : ""}
                      {last.text}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <p className="pt-2 text-center text-[10px] text-white/35">
        Demo · monedas y datos simulados · {formatMXN(29)} por acción
      </p>
    </div>
  );
}
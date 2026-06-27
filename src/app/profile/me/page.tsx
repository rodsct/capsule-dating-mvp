"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Boxes, Coins, LogOut, MessageCircle, Trash2, Plus } from "lucide-react";
import { useGame } from "@/lib/auth";
import { getProfile, CREDIT_PACKS, CREDIT_PRICE } from "@/data/mock-data";
import { formatMXN, capsuleGradient, classNames } from "@/lib/utils";

export default function MyProfilePage() {
  const { data: session } = useSession();
  const {
    ready,
    status,
    user,
    placements,
    purchases,
    chats,
    ownCapsule,
    removeOwnPlacement,
    addCredits,
    logout,
  } = useGame();

  if (!ready || status === "loading") {
    return (
      <div className="grid place-items-center py-24 text-sm text-white/50">
        Cargando…
      </div>
    );
  }

  if (!user || status !== "authenticated") {
    return (
      <div className="mx-auto max-w-sm py-16 text-center">
        <h1 className="font-display text-xl font-bold">No has iniciado sesión</h1>
        <p className="mt-1 text-sm text-white/55">
          Entra con Google para comprar o publicar tu cápsula y guardar tus
          créditos.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link
            href="/login"
            className="rounded-full bg-cyber-neon px-5 py-2.5 text-sm font-bold text-black"
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

  const handleLogout = () => {
    // Clear local state first, then end the NextAuth session (redirects home).
    logout();
    void signOut({ callbackUrl: "/" });
  };

  const profileImage = session?.user?.image ?? null;
  const profileName = session?.user?.name ?? user.username;
  const profileEmail = session?.user?.email ?? null;
  const isGoogle = !!profileEmail && !profileEmail.endsWith("@local");

  return (
    <div className="py-2 space-y-6">
      {/* Account card */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt={profileName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold">
                  {profileName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-cyber-neon">
                Mi cuenta
              </span>
              <h1 className="font-display text-xl font-bold">
                {isGoogle ? profileName : `@${user.username}`}
              </h1>
              {isGoogle && profileEmail && (
                <p className="text-[11px] text-white/55">{profileEmail}</p>
              )}
              {!isGoogle && (
                <p className="text-[11px] text-white/45">
                  Cuenta local · te uniste{" "}
                  {new Date(user.createdAt).toLocaleDateString("es-MX")}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-cyber-neon"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-cyber-lime/40 bg-white/5 px-3 py-1.5 text-sm font-semibold text-cyber-lime">
            <Coins className="h-4 w-4" /> Tienes {user.credits}{" "}
            {user.credits === 1 ? "crédito" : "créditos"}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-white/45">
          1 crédito = 1 compra o 1 publicación. Todos los créditos valen lo mismo
          ({formatMXN(CREDIT_PRICE)} cada uno).
        </p>

        {/* Credit packs */}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {CREDIT_PACKS.map((pack) => (
            <button
              key={pack.credits}
              onClick={() => addCredits(pack.credits)}
              className={classNames(
                "glass flex items-center justify-between gap-2 rounded-xl p-3 text-left transition hover:-translate-y-0.5",
              )}
            >
              <span className="flex flex-col">
                <span className="text-sm font-bold">
                  {pack.label} — {formatMXN(pack.price)}
                </span>
                <span className="text-[10px] text-white/55">
                  {pack.savings > 0
                    ? `ahorras ${formatMXN(pack.savings)} · ${formatMXN(Math.round(pack.price / pack.credits))}/crédito`
                    : `${formatMXN(pack.price)}/crédito`}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-cyber-cyan px-3 py-1.5 text-xs font-bold text-black hover:shadow-neon-cyan">
                <Plus className="h-3.5 w-3.5" /> Agregar
              </span>
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
            No has publicado ninguna cápsula.{" "}
            <Link href="/" className="text-cyber-cyan underline">
              Ve a la máquina y elige un espacio libre.
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
                  <div
                    className="grid h-9 w-9 place-items-center rounded-full text-base"
                    style={{
                      background: ownCapsule
                        ? capsuleGradient(ownCapsule.capsuleGradient)
                        : undefined,
                    }}
                  >
                    {ownCapsule?.emoji ?? "🫧"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {ownCapsule?.firstName ?? "Tú"} · {ownCapsule?.alcaldia} ·
                      espacio {p.slot + 1}
                    </div>
                    <div className="text-[10px] text-white/45">
                      Máquina CDMX
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
            <Link href="/" className="text-cyber-cyan underline">
              Explorar la máquina
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
                    style={{ background: capsuleGradient(profile.capsuleGradient) }}
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
        1 crédito = {formatMXN(CREDIT_PRICE)} · créditos y datos simulados en
        este navegador
      </p>
    </div>
  );
}
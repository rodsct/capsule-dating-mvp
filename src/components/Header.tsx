"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Coins, Sparkles, UserCircle2 } from "lucide-react";
import { useGame } from "@/lib/auth";

export function Header() {
  const { data: session } = useSession();
  const { user, ready, status } = useGame();

  const showCredits = ready && status === "authenticated" && user;
  const showEntrar = ready && status === "unauthenticated";
  const image = session?.user?.image ?? null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass-strong">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyber-neon drop-shadow-[0_0_6px_rgba(255,43,214,0.7)]" />
          <span className="font-display text-base font-bold tracking-tight">
            Capsule<span className="text-cyber-neon neon-text">CDMX</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {showCredits && (
            <Link
              href="/profile/me"
              aria-label="Tus créditos"
              className="inline-flex items-center gap-1 rounded-full border border-cyber-lime/40 bg-white/5 px-2.5 py-1 text-xs font-bold text-cyber-lime hover:shadow-neon"
            >
              <Coins className="h-3.5 w-3.5" />
              {user!.credits}{" "}
              {user!.credits === 1 ? "crédito" : "créditos"}
            </Link>
          )}
          {showEntrar ? (
            <Link
              href="/login"
              className="inline-flex items-center gap-1 rounded-full bg-cyber-neon px-3.5 py-1.5 text-xs font-bold text-black hover:shadow-neon"
            >
              Entrar
            </Link>
          ) : (
            <Link
              href="/profile/me"
              aria-label="Mi perfil"
              className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-cyber-neon"
            >
              <Avatar user={user} image={image} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * Shows the session / profile image when available, otherwise the user
 * initials, otherwise a fallback icon. Kept tiny so the header stays clean.
 */
function Avatar({
  user,
  image,
}: {
  user: { username: string } | null;
  image: string | null | undefined;
}) {
  const name = user?.username ?? "?";
  const initials = name.charAt(0).toUpperCase();
  return (
    <span className="grid h-4 w-4 place-items-center leading-none">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold">
          {/^[A-Za-z0-9]/.test(initials) ? (
            initials
          ) : (
            <UserCircle2 className="h-4 w-4" />
          )}
        </span>
      )}
    </span>
  );
}
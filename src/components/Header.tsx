"use client";

import Link from "next/link";
import { Coins, Sparkles, UserCircle2 } from "lucide-react";
import { useGame } from "@/lib/auth";

export function Header() {
  const { user, ready } = useGame();
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
          {ready && user && (
            <Link
              href="/profile/me"
              className="inline-flex items-center gap-1 rounded-full border border-cyber-lime/40 bg-white/5 px-2.5 py-1 text-xs font-bold text-cyber-lime hover:shadow-neon"
            >
              <Coins className="h-3.5 w-3.5" />
              {user.credits} {user.credits === 1 ? "crédito" : "créditos"}
            </Link>
          )}
          <Link
            href="/profile/me"
            aria-label="Mi perfil"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-cyber-neon"
          >
            <UserCircle2 className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
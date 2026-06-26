"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Credits } from "@/components/Credits";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, ready, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-6 h-6 text-cyber-neon drop-shadow-[0_0_6px_rgba(255,43,214,0.7)] group-hover:rotate-90 transition-transform" />
          <span className="font-display font-bold text-lg tracking-tight">
            Capsule<span className="text-cyber-neon neon-text">Dating</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 text-sm">
          <Link
            href="/lobby"
            className="hidden sm:inline-block text-white/70 hover:text-white transition"
          >
            Sala
          </Link>
          {ready && user ? (
            <>
              <Credits count={user.credits} />
              <Link
                href="/profile/me"
                className="px-3 py-1.5 rounded-full glass text-white/90 hover:text-white text-xs font-medium"
              >
                @{user.username}
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full text-xs text-white/60 hover:text-cyber-neon transition"
              >
                Salir
              </button>
            </>
          ) : ready ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-full text-xs text-white/80 hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cyber-neon text-black hover:shadow-neon transition"
              >
                Únete gratis
              </Link>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
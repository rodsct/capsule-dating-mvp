"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getProfile } from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { photoGradient } from "@/lib/utils";

export default function ChatsPage() {
  const { chats, ready } = useGame();
  const entries = Object.entries(chats).filter(([, list]) => list.length > 0);

  return (
    <div className="py-2">
      <h1 className="mb-4 font-display text-xl font-bold">Chats</h1>

      {!ready ? (
        <p className="text-sm text-white/50">Cargando…</p>
      ) : entries.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-white/40" />
          <p className="mt-3 text-sm text-white/60">
            Aún no tienes chats. Compra una cápsula para empezar.
          </p>
          <Link
            href="/lobby"
            className="mt-4 inline-block rounded-full bg-cyber-neon px-5 py-2.5 text-sm font-bold text-black"
          >
            Ir a la sala
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(([profileId, list]) => {
            const profile = getProfile(profileId);
            const last = list[list.length - 1];
            return (
              <Link
                key={profileId}
                href={`/chat/${profileId}`}
                className="glass flex items-center gap-3 rounded-2xl p-3 hover:-translate-y-0.5"
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg"
                  style={
                    profile
                      ? { background: photoGradient(profile.photoGradient) }
                      : undefined
                  }
                >
                  {profile?.emoji ?? "🫧"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-sm">
                      {profile?.fullName ?? profileId}
                    </span>
                    <span className="shrink-0 text-[10px] text-white/40">
                      {new Date(last.at).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="truncate text-xs text-white/50">
                    {last.mine ? "Tú: " : ""}
                    {last.text}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
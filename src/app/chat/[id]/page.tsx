"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { getProfile } from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { capsuleGradient } from "@/lib/utils";

const REPLIES = [
  "¡Hola! Me late tu mensaje 😊",
  "Qué chido, cuéntame más 👀",
  "Jaja sí, totale. ¿Y qué planes tienes este fin?",
  "Me encanta tu vibra, platicamos pronto ✨",
];

function ChatInner() {
  const params = useParams<{ id: string }>();
  const { chats, sendMessage, addReply, ready } = useGame();
  const profile = getProfile(params.id);
  const [text, setText] = useState("");
  const list = chats[params.id] ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [list.length]);

  if (!profile) return notFound();

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    sendMessage(params.id, t);
    setText("");
    setTimeout(() => {
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      addReply(params.id, reply);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col py-2">
      <Link
        href="/chats"
        className="mb-3 inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Chats
      </Link>

      <div className="glass flex items-center gap-3 rounded-2xl p-3">
        <div
          className="grid h-11 w-11 place-items-center rounded-full text-lg"
          style={{ background: capsuleGradient(profile.capsuleGradient) }}
        >
          {profile.emoji}
        </div>
        <div>
          <div className="font-display text-sm font-bold">
            {profile.fullName}
          </div>
          <div className="text-[11px] text-white/50">
            {profile.age} años · {profile.alcaldia}
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1"
      >
        {!ready && (
          <p className="text-center text-xs text-white/50">Cargando…</p>
        )}
        {ready && list.length === 0 && (
          <p className="py-8 text-center text-xs text-white/45">
            Aún no hay mensajes. Rompe el hielo 👋
          </p>
        )}
        {list.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
                m.mine
                  ? "rounded-br-sm bg-cyber-cyan text-black"
                  : "rounded-bl-sm glass text-white"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje…"
          className="flex-1 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-cyber-neon"
        />
        <button
          type="submit"
          aria-label="Enviar"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cyber-neon text-black hover:shadow-neon"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-24 text-sm text-white/50">
          Cargando…
        </div>
      }
    >
      <ChatInner />
    </Suspense>
  );
}
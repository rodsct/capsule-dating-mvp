"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Coins,
  CheckCircle2,
  Music2,
  Heart,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import type { MachineId, CapsuleProfile } from "@/lib/types";
import { getMachine, getProfile } from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { formatMXN, photoGradient } from "@/lib/utils";
import { SlotCard } from "@/components/SlotCard";

type Stage = "preview" | "opening" | "revealed" | "insufficient";

function RevealInner() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { user, ready, placements, buy } = useGame();

  const machine = getMachine(params.id as MachineId);
  const slot = Number(search.get("slot") ?? "0");

  const placement = placements.find(
    (p) => p.machineId === machine?.id && p.slot === slot,
  );
  const profile: CapsuleProfile | undefined = placement
    ? getProfile(placement.profileId)
    : undefined;

  const [stage, setStage] = useState<Stage>("preview");

  useEffect(() => {
    if (ready && !placement) {
      router.replace(`/machine/${params.id}`);
    }
  }, [ready, placement, router, params.id]);

  if (!machine) return notFound();
  if (!ready || !placement || (!profile && placement.profileId !== "me")) {
    return (
      <div className="grid place-items-center py-24 text-sm text-white/50">
        Cargando…
      </div>
    );
  }

  const onBuy = () => {
    const result = buy(machine.id, slot);
    if (!result.ok) {
      setStage(result.reason === "monedas" ? "insufficient" : "insufficient");
      return;
    }
    setStage("opening");
    setTimeout(() => setStage("revealed"), 1300);
  };

  if (!profile) {
    return (
      <div className="py-16 text-center text-sm text-white/55">
        Esta cápsula no tiene un perfil demo disponible.
      </div>
    );
  }

  return (
    <div className="py-2">
      <Link
        href={`/machine/${machine.id}`}
        className="mb-4 inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a {machine.name}
      </Link>

      <AnimatePresence mode="wait">
        {stage === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-xs text-center"
          >
            <SlotCard
              slot={slot}
              kind="occupied"
              profile={profile}
              signColor={machine.signColor}
              gradient={machine.gradient}
            />
            <h1 className="mt-5 font-display text-lg font-bold">
              Antes de abrirla…
            </h1>
            <p className="mt-1 text-sm text-white/55">
              Paga {formatMXN(machine.price)} para abrir la cápsula y revelar el
              perfil completo de {profile.firstName}.
            </p>
            <button
              onClick={onBuy}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyber-neon px-6 py-3 text-sm font-bold text-black hover:shadow-neon"
            >
              <ShoppingBag className="h-4 w-4" /> Comprar cápsula por{" "}
              {formatMXN(machine.price)}
            </button>
            {user && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-cyber-lime">
                <Coins className="h-3.5 w-3.5" /> Tienes {user.monedas} monedas
              </p>
            )}
          </motion.div>
        )}

        {stage === "opening" && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: [0, 8, -8, 0] }}
            exit={{ opacity: 0 }}
            className="mx-auto grid max-w-xs place-items-center py-10"
          >
            <motion.div
              animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2 }}
              className="cap-orb grid h-24 w-24 place-items-center rounded-full text-3xl"
              style={
                {
                  "--cap-top": profile.photoGradient[0],
                  "--cap-bot": profile.photoGradient[1],
                  "--cap-glow": `${machine.signColor}88`,
                } as React.CSSProperties
              }
            >
              <span className="leading-none">{profile.emoji}</span>
            </motion.div>
            <p className="mt-6 animate-flicker font-display text-sm font-bold neon-text">
              Abriendo cápsula…
            </p>
          </motion.div>
        )}

        {stage === "revealed" && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-white/10"
              style={{
                background: photoGradient(profile.photoGradient),
                height: 220,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg/85 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="text-2xl font-display font-bold">
                  {profile.emoji} {profile.fullName}
                </div>
                <div className="text-xs text-white/70">
                  {profile.age} años · {machine.name}
                </div>
              </div>
            </div>

            <p className="text-sm text-white/75">{profile.bio}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              <Info label="Canción" value={profile.song} icon={Music2} />
              <Info
                label="Lenguaje del amor"
                value={profile.loveLanguage}
                icon={Heart}
              />
              <Info
                label="Busca"
                value={profile.lookingFor}
                icon={CheckCircle2}
                full
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href={`/chat/${profile.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-cyber-cyan px-5 py-2.5 text-sm font-bold text-black hover:shadow-neon-cyan"
              >
                <MessageCircle className="h-4 w-4" /> Enviar mensaje
              </Link>
              <Link
                href="/lobby"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                Volver a la sala
              </Link>
            </div>
          </motion.div>
        )}

        {stage === "insufficient" && (
          <motion.div
            key="insufficient"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-sm text-center"
          >
            <div className="glass rounded-2xl p-6">
              <Coins className="mx-auto h-8 w-8 text-cyber-neon" />
              <h1 className="mt-3 font-display text-lg font-bold">
                Monedas insuficientes
              </h1>
              <p className="mt-1 text-sm text-white/55">
                Necesitas {formatMXN(machine.price)} para abrir esta cápsula.
                Añade monedas demo desde tu perfil.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Link
                  href="/profile/me"
                  className="rounded-full bg-cyber-neon px-5 py-2.5 text-sm font-bold text-black"
                >
                  + monedas
                </Link>
                <Link
                  href={`/machine/${machine.id}`}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold"
                >
                  Volver
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({
  label,
  value,
  icon: Icon,
  full,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  full?: boolean;
}) {
  return (
    <div className={`glass rounded-xl p-3 ${full ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm text-white/90">{value}</div>
    </div>
  );
}

export default function RevealPage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-24 text-sm text-white/50">
          Cargando…
        </div>
      }
    >
      <RevealInner />
    </Suspense>
  );
}
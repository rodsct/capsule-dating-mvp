"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  Heart,
  ImageIcon,
  MapPin,
  MessageCircle,
  Music2,
  PackageOpen,
  Plus,
  RefreshCw,
  UserCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import type { CapsuleProfile } from "@/lib/types";
import { MACHINE, ACTION_COST_CREDITS, CREDIT_PRICE, genderInfo, getProfile } from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { MachineGrid } from "@/components/MachineGrid";
import { Keypad } from "@/components/Keypad";
import { DispenseTray } from "@/components/DispenseTray";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import {
  classNames,
  formatMXN,
  formatSlotCode,
  parseSlotCode,
} from "@/lib/utils";

type Phase = "idle" | "dropping" | "revealed";
type Msg = { text: string; tone: "warn" | "info" } | null;

const INVALID_MSG: Msg = { text: "Inválido", tone: "warn" };
const EMPTY_MSG: Msg = { text: "Vacío", tone: "info" };

export default function HomePage() {
  const { status: authStatus } = useSession();
  const { user, ready, placements, ownCapsule, buy } = useGame();
  const viewOnly = authStatus === "unauthenticated";

  const [typed, setTyped] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [buying, setBuying] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [revealed, setRevealed] = useState<{
    slot: number;
    profile: CapsuleProfile;
  } | null>(null);
  const [dispense, setDispense] = useState<{
    emoji: string;
    gradient: [string, string];
    ring: string;
  } | null>(null);

  const occupied = placements.filter((p) => p.machineId === MACHINE.id).length;
  const free = MACHINE.slots - occupied;

  // derived selected slot from typed keypad value
  const selectedSlot = useMemo<number | null>(() => parseSlotCode(typed), [typed]);

  // transient message timer
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1400);
    return () => clearTimeout(t);
  }, [msg, setMsg]);

  const placementFor = (slot: number) =>
    placements.find((p) => p.machineId === MACHINE.id && p.slot === slot);

  const displayText = () => {
    if (msg) return msg.text;
    if (typed.length === 0) return "--";
    return typed.padStart(2, "0");
  };

  const handleKey = (k: string) => {
    if (phase !== "idle") return;
    if (k === "clear") {
      setTyped("");
      setMsg(null);
      return;
    }
    setMsg(null);
    setTyped((prev) => {
      const next = prev.length >= 2 ? k : prev + k;
      return next.slice(-2);
    });
  };

  const handleSlotClick = (
    slot: number,
    kind: "occupied" | "empty" | "mine",
  ) => {
    if (phase !== "idle") return;
    setMsg(null);
    setTyped(formatSlotCode(slot));
    if (kind === "mine") {
      setMsg({ text: "Tu cápsula", tone: "info" });
    } else if (kind === "empty") {
      setMsg(EMPTY_MSG);
    }
  };

  const runBuy = () => {
    if (phase !== "idle") return;
    if (viewOnly) {
      setMsg({ text: "Entra con Google para comprar", tone: "warn" });
      return;
    }
    const slot = parseSlotCode(typed);
    if (slot === null) {
      setMsg(INVALID_MSG);
      return;
    }
    const placement = placementFor(slot);
    const profileId = placement?.profileId;

    if (!profileId) {
      setMsg(EMPTY_MSG);
      return;
    }
    if (profileId === "me") {
      setMsg({ text: "Tu cápsula", tone: "info" });
      return;
    }

    const profile = getProfile(profileId);
    if (!profile) {
      setMsg(INVALID_MSG);
      return;
    }
    if (!user) {
      setMsg(INVALID_MSG);
      return;
    }
    if (user.credits < ACTION_COST_CREDITS) {
      setMsg({ text: "Sin créditos", tone: "warn" });
      return;
    }

    setBuying(true);
    const ring = genderInfo(profile.genderCode)?.color ?? "#ff2bd6";
    const result = buy(MACHINE.id, slot);
    setBuying(false);

    if (!result.ok) {
      setMsg({ text: "Sin créditos", tone: "warn" });
      return;
    }

    setDispense({
      emoji: profile.emoji,
      gradient: profile.capsuleGradient,
      ring,
    });
    setPhase("dropping");
    setTimeout(() => {
      setPhase("revealed");
      setRevealed({ slot, profile });
    }, 1200);
  };

  const resetBack = () => {
    setPhase("idle");
    setRevealed(null);
    setTyped("");
    setDispense(null);
    setMsg(null);
  };

  const displayValue = displayText();

  return (
    <div className="py-2">
      {/* Hero title */}
      <div className="mb-4 text-center">
        <h1 className="font-display text-2xl font-bold neon-text">
          {MACHINE.name}
        </h1>
        <p className="mt-1 text-xs text-white/55">
          {MACHINE.subtitle} · {MACHINE.description}
        </p>
        <div className="mt-2 inline-flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/50">
          <span className="inline-flex items-center gap-1 rounded-full border border-cyber-lime/40 bg-white/5 px-2.5 py-0.5 font-semibold text-cyber-lime">
            {free} espacios libres
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-cyber-neon/40 bg-white/5 px-2.5 py-0.5 font-semibold text-cyber-neon">
            <Coins className="h-3 w-3" /> 1 crédito = {formatMXN(CREDIT_PRICE)}
          </span>
          {user && (
            <span className="inline-flex items-center gap-1 rounded-full border border-cyber-neon/40 bg-white/5 px-2.5 py-0.5 font-semibold text-cyber-neon">
              {user.credits} {user.credits === 1 ? "crédito" : "créditos"}
            </span>
          )}
        </div>
      </div>

      {/* Unauthenticated CTA — view-only mode */}
      {viewOnly && (
        <div className="mb-4 glass-strong rounded-2xl p-4 text-center">
          <p className="text-sm font-semibold text-white/90">
            Estás viendo la máquina en modo vista previa.
          </p>
          <p className="mt-1 text-xs text-white/55">
            Entra con Google para comprar o publicar tu cápsula.
          </p>
          <div className="mt-3 flex justify-center">
            <GoogleSignInButton callbackUrl="/" label="Entra con Google" />
          </div>
        </div>
      )}

      {/* The vending machine body */}
      <div className="vm-chrome relative rounded-3xl p-3 sm:p-4">
        {/* illuminated sign */}
        <div
          className="vm-sign animate-signpulse mb-3 rounded-xl px-4 py-2 text-center"
          style={
            {
              "--sign-ring": "rgba(255,43,214,0.7)",
              "--sign-glow": "rgba(255,43,214,0.55)",
            } as React.CSSProperties
          }
        >
          <div className="font-display text-sm font-extrabold uppercase tracking-[0.25em] text-cyber-neon">
            Cápsulas · CDMX
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/50">
            Elige un número · {MACHINE.slots} espacios
          </div>
        </div>

        {/* layout: grid (left/above) + control panel (right/below) */}
        <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr] lg:gap-4">
          {/* glass interior with slot grid */}
          <div>
            <MachineGrid
              machine={MACHINE}
              placements={placements}
              ownCapsule={ownCapsule}
              selectedSlot={selectedSlot}
              onSlotClick={handleSlotClick}
            />
          </div>

          {/* control panel */}
          <div className="vm-panel rounded-2xl p-3 sm:p-4">
            {/* digital display */}
            <div className="mb-3">
              <div className="vm-display flex h-16 items-center justify-between rounded-lg px-3">
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  Núm.
                </span>
                <span
                  className={classNames(
                    "vm-display-text text-2xl font-bold",
                    !msg && typed.length === 0 && "dim",
                  )}
                >
                  {displayValue}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/30">
                  {selectedSlot !== null ? "✓" : "--"}
                </span>
              </div>
              <div className="mt-1.5 flex min-h-4 items-center justify-center text-center text-[10px]">
                {msg ? (
                  <span
                    className={classNames(
                      "font-semibold uppercase tracking-wider",
                      msg.tone === "warn" ? "text-cyber-neon" : "text-cyber-lime",
                    )}
                  >
                    {msg.text}
                  </span>
                ) : selectedSlot !== null ? (
                  <span className="text-white/50">
                    Espacio {formatSlotCode(selectedSlot)} seleccionado
                  </span>
                ) : (
                  <span className="text-white/35">
                    Teclea 01–{formatSlotCode(MACHINE.slots - 1)} y presiona Comprar
                  </span>
                )}
              </div>
            </div>

            {/* keypad */}
            <Keypad
              onKey={handleKey}
              onBuy={viewOnly ? undefined : runBuy}
              buying={buying}
              buyDisabled={phase !== "idle" || selectedSlot === null}
              buyLabel={
                selectedSlot === null
                  ? "Comprar"
                  : placementFor(selectedSlot)?.profileId === "me"
                    ? "Tu cápsula"
                    : placementFor(selectedSlot)
                      ? `Comprar (1 crédito)`
                      : "Colocar cápsula"
              }
            />

            {/* slot-state CTA under the keypad */}
            <div className="mt-3 min-h-9 text-[11px]">
              {viewOnly ? (
                <ViewOnlyCTA />
              ) : selectedSlot === null ? (
                <p className="text-white/40">
                  Toca una cápsula o escribe su número (01–
                  {formatSlotCode(MACHINE.slots - 1)}).
                </p>
              ) : !placementFor(selectedSlot) ? (
                <EmptySlotCTA
                  slot={selectedSlot}
                  canAfford={!!user && user.credits >= ACTION_COST_CREDITS}
                />
              ) : placementFor(selectedSlot)?.profileId === "me" ? (
                <MineSlotCTA slot={selectedSlot} />
              ) : user && user.credits < ACTION_COST_CREDITS ? (
                <NoCreditsCTA />
              ) : (
                <p className="text-white/55">
                  Presiona <span className="font-semibold text-cyber-neon">Comprar</span>{" "}
                  para abrir la cápsula {formatSlotCode(selectedSlot)} por 1 crédito.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* dispense tray */}
        <div className="mt-3">
          <DispenseTray
            dropping={phase === "dropping" ? dispense : null}
            resting={phase === "revealed" ? dispense : null}
          />
        </div>
      </div>

      {/* Reveal panel — full profile */}
      <AnimatePresence>
        {phase === "revealed" && revealed && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <RevealPanel profile={revealed.profile} onClose={resetBack} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* small legend tips row */}
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-white/45">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-white/30" />{" "}
          Libre — coloca tu cápsula
        </span>
        <span className="inline-flex items-center gap-1">
          <PackageOpen className="h-3 w-3" /> Toca una cápsula para ver su número
        </span>
      </div>

      {(!ready || authStatus === "loading") && (
        <div className="grid place-items-center py-16 text-sm text-white/50">
          Cargando máquina…
        </div>
      )}
    </div>
  );
}

/* -------------- sub-CTA helpers -------------- */

function EmptySlotCTA({
  slot,
  canAfford,
}: {
  slot: number;
  canAfford: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-white/55">
        Espacio <span className="font-semibold text-cyber-lime">{formatSlotCode(slot)}</span>{" "}
        vacío — coloca aquí tu cápsula por 1 crédito.
      </p>
      {canAfford ? (
        <Link
          href={`/place/cdmx?slot=${slot}`}
          className="inline-flex w-fit items-center gap-1 rounded-full bg-cyber-lime px-3 py-1.5 text-[11px] font-bold text-black hover:brightness-110"
        >
          <Plus className="h-3 w-3" /> Publicar mi cápsula aquí (1 crédito)
        </Link>
      ) : (
        <NoCreditsCTA />
      )}
    </div>
  );
}

function MineSlotCTA({ slot }: { slot: number }) {
  return (
    <p className="text-white/55">
      La cápsula {formatSlotCode(slot)} es tuya. Edítala o quítala desde tu perfil.
    </p>
  );
}

function NoCreditsCTA() {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-cyber-neon">No tienes créditos. Recarga en tu perfil.</p>
      <Link
        href="/profile/me"
        className="inline-flex w-fit items-center gap-1 rounded-full border border-cyber-neon/40 bg-cyber-neon/10 px-3 py-1.5 text-[11px] font-bold text-cyber-neon hover:bg-cyber-neon/20"
      >
        <Coins className="h-3 w-3" /> Recargar créditos
      </Link>
    </div>
  );
}

function ViewOnlyCTA() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-white/55">
        Inicia sesión para comprar esta cápsula o publicar la tuya.
      </p>
      <div className="w-full">
        <GoogleSignInButton
          callbackUrl="/"
          label="Entra con Google"
          fullWidth={false}
        />
      </div>
    </div>
  );
}

/* -------------- reveal panel -------------- */

function RevealPanel({
  profile,
  onClose,
}: {
  profile: CapsuleProfile;
  onClose: () => void;
}) {
  const ring = genderInfo(profile.genderCode)?.color ?? "#ff2bd6";
  return (
    <div className="glass-strong rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Otra cápsula
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
        >
          <RefreshCw className="h-3 w-3" /> Seguir comprando
        </button>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photoUrl}
          alt={`Regalo de ${profile.firstName}`}
          className="h-56 w-full object-cover"
        />
        <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
          <ImageIcon className="h-3 w-3" /> Regalo
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyber-bg/90 via-transparent to-transparent p-4">
          <div className="text-xl font-display font-bold">
            {profile.emoji} {profile.fullName}
          </div>
          <div className="text-xs text-white/75">
            {profile.age} años · {profile.alcaldia} <MapPinInline />
          </div>
          <span
            className="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: `${ring}33`, color: ring }}
          >
            {genderInfo(profile.genderCode)?.label}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm text-white/80">{profile.bio}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Info label="Canción" value={profile.song} icon={Music2} />
        <Info label="Lenguaje del amor" value={profile.loveLanguage} icon={Heart} />
        <Info label="Busca" value={profile.lookingFor} icon={CheckCircle2} full />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/chat/${profile.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-cyber-cyan px-5 py-2.5 text-sm font-bold text-black hover:shadow-neon-cyan"
        >
          <MessageCircle className="h-4 w-4" /> Enviar mensaje
        </Link>
        <Link
          href={`/profile/${profile.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
        >
          <UserCircle2 className="h-4 w-4" /> Ver perfil
        </Link>
      </div>
    </div>
  );
}

function MapPinInline() {
  return (
    <span className="inline-flex items-center gap-0.5">
      <MapPin className="h-3 w-3" />
    </span>
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
    <div
      className={classNames(
        "glass rounded-xl p-3",
        full && "sm:col-span-2",
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm text-white/90">{value}</div>
    </div>
  );
}


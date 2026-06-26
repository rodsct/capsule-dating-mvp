"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Coins,
  Zap,
} from "lucide-react";
import {
  getMachine,
  getCapsulesForMachine,
  getPerson,
} from "@/data/mock-data";
import { pickRandom, rarityColor, rarityLabel, classNames, formatMXN } from "@/lib/utils";
import type { MachineId } from "@/lib/types";
import { NeonButton } from "@/components/NeonButton";
import { useAuth } from "@/lib/auth";
import { VendingMachineCab } from "@/components/VendingMachineCab";

export default function MachineDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const machine = getMachine(params.id as MachineId);

  if (!machine) return notFound();

  const capsules = getCapsulesForMachine(machine.id);
  const credits = user?.credits ?? 0;
  const lucky = pickRandom(capsules, capsules.length);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(800px 400px at 50% -10%, ${machine.boxColor}55, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/lobby"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al callejón
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-[340px_1fr] gap-8 items-center mb-8"
        >
          {/* Close-up machine */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <VendingMachineCab
                machine={machine}
                size="lg"
                selected
                href={`/machine/${machine.id}/reveal`}
              />
            </motion.div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-cyber-neon mb-2">
              <span
                className="px-2 py-0.5 rounded-md font-bold tracking-widest"
                style={{
                  background: `${machine.signColor}22`,
                  color: machine.signColor,
                }}
              >
                {machine.kanji}
              </span>
              <span className="text-white/40 tracking-widest">
                {machine.romaji}
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight">
              {machine.name}
            </h1>
            <p
              className="text-sm font-medium mt-2"
              style={{ color: machine.signColor }}
            >
              {machine.tagline}
            </p>
            <p className="text-white/70 text-sm mt-4 max-w-xl leading-relaxed">
              {machine.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <NeonButton href={`/machine/${machine.id}/reveal`}>
                <Sparkles className="w-4 h-4" /> Inserta {formatMXN(machine.price)} y tira
              </NeonButton>
              <span className="glass px-3 py-2 rounded-full text-xs text-white/70 inline-flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-cyber-lime" /> Tienes{" "}
                <span className="text-cyber-lime font-semibold">{credits}</span>{" "}
                monedas
              </span>
              <span className="text-xs text-white/40">
                {capsules.length} cápsulas en existencia
              </span>
            </div>
          </div>
        </motion.header>

        {/* Coin slot / credit banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 scanlines"
        >
          <p className="text-sm text-white/70">
            {user ? (
              <>
                Inserta{" "}
                <span className="text-cyber-gold font-semibold">{formatMXN(machine.price)}</span>{" "}
                = <span className="text-cyber-lime font-semibold">1 moneda</span>.
                Cada tirada dispensa una cápsula aleatoria de {machine.name}.
              </>
            ) : (
              <>Necesitas 1 moneda para tirar. La cuenta demo se precarga con 10.</>
            )}
          </p>
          {!user && (
            <NeonButton href="/register" variant="ghost" className="py-2 px-4 text-sm">
              Consigue monedas gratis
            </NeonButton>
          )}
          {user && credits <= 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs text-cyber-neon">
              <Lock className="w-3.5 h-3.5" /> Sin monedas — recarga en tu perfil
            </span>
          )}
        </motion.div>

        {/* Capsules grid */}
        <div className="flex items-center gap-2 mb-4 text-sm text-white/60">
          <Zap className="w-4 h-4 text-cyber-lime" /> Inventario de cápsulas en esta máquina
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {capsules.map((c, i) => {
            const person = getPerson(c.personId)!;
            const isLucky = c.id === lucky?.id;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link
                  href={`/machine/${machine.id}/reveal`}
                  className={classNames(
                    "block glass rounded-2xl p-4 h-full transition-all group",
                    credits > 0
                      ? "hover:-translate-y-1 hover:shadow-neon"
                      : "opacity-70",
                  )}
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className="vm-capsule relative rounded-full overflow-hidden"
                      style={
                        {
                          "--cap-top": c.color,
                          "--cap-bot": machine.gradient[1],
                          "--cap-glow": `${rarityColor(c.rarity)}66`,
                          width: 64,
                          height: 80,
                          borderRadius: 999,
                        } as React.CSSProperties
                      }
                    >
                      <span className="absolute inset-0 grid place-items-center text-2xl opacity-90">
                        {person.emoji}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span
                      className="px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${rarityColor(c.rarity)}22`,
                        color: rarityColor(c.rarity),
                      }}
                    >
                      {rarityLabel(c.rarity)}
                    </span>
                    {isLucky && (
                      <span className="text-cyber-lime">⚡ tirada de la suerte</span>
                    )}
                  </div>

                  <div className="text-center text-xs text-white/50 italic">
                    “{person.hints[0]}”
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center text-xs text-white/40">
          Los perfiles se randomizan en cada tirada — la cápsula que abras es una sorpresa.
        </div>
      </div>
    </div>
  );
}
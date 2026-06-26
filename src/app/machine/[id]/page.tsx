"use client";

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import {
  getMachine,
  getCapsulesForMachine,
  getPerson,
} from "@/data/mock-data";
import { pickRandom, rarityColor, rarityLabel, classNames } from "@/lib/utils";
import type { MachineId } from "@/lib/types";
import { NeonButton } from "@/components/NeonButton";
import { useAuth } from "@/lib/auth";

export default function MachineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const machine = getMachine(params.id as MachineId);

  if (!machine) return notFound();

  const capsules = getCapsulesForMachine(machine.id);
  const credits = user?.credits ?? 0;

  // show one "lucky" capsule pre-selected for flavor only
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
          <ArrowLeft className="w-4 h-4" /> Back to lobby
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl grid place-items-center text-3xl shrink-0"
              style={{
                background: `linear-gradient(135deg, ${machine.gradient[0]}, ${machine.gradient[1]})`,
                boxShadow: `0 0 20px ${machine.boxColor}88`,
              }}
            >
              {machine.emoji}
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl">
                {machine.name}
              </h1>
              <p className="text-cyber-neon text-sm font-medium mt-1">
                {machine.tagline}
              </p>
              <p className="text-white/60 text-sm mt-2 max-w-xl">
                {machine.description}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end gap-3">
            <span className="text-xs text-white/50">
              {capsules.length} capsules in stock
            </span>
            <NeonButton href={`/machine/${machine.id}/reveal`}>
              <Sparkles className="w-4 h-4" /> Pull random capsule
            </NeonButton>
          </div>
        </motion.header>

        {/* Credit banner */}
        <div className="mb-8 glass rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm text-white/70">
            {user ? (
              <>
                You have <span className="text-cyber-lime font-semibold">{credits}</span> credits.
                Each pull costs 1.{" "}
              </>
            ) : (
              <>You need 1 credit to pull a capsule. New accounts start with 3 free.</>
            )}
          </p>
          {!user && (
            <NeonButton href="/register" variant="ghost" className="py-2 px-4 text-sm">
              Get 3 free
            </NeonButton>
          )}
          {user && credits <= 0 && (
            <NeonButton
              variant="cyan"
              className="py-2 px-4 text-sm"
              href={`/machine/${machine.id}`}
              onClick={() => {}}
            >
              <Lock className="w-3.5 h-3.5" /> Out of credits (demo)
            </NeonButton>
          )}
        </div>

        {/* Capsules grid */}
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
                <div className="glass rounded-2xl p-4 h-full hover:-translate-y-1 transition-all hover:shadow-neon group">
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-20 h-28 rounded-full relative overflow-hidden shadow-neon"
                      style={{
                        background: `linear-gradient(135deg, ${c.color}, ${machine.gradient[1]})`,
                      }}
                    >
                      <div className="absolute inset-x-0 top-1/2 h-px bg-white/40" />
                      <div className="absolute inset-0 grid place-items-center text-2xl opacity-80">
                        {person.emoji}
                      </div>
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
                      <span className="text-cyber-lime">⚡ lucky pull</span>
                    )}
                  </div>

                  <div className="text-center text-xs text-white/50 italic">
                    “{person.hints[0]}”
                  </div>

                  {/* Each capsule opens the random reveal page */}
                  <div className="mt-4">
                    <Link
                      href={`/machine/${machine.id}/reveal`}
                      className={classNames(
                        "block text-center text-xs font-semibold py-2.5 rounded-full transition-all group-hover:shadow-neon",
                        credits > 0
                          ? "bg-cyber-neon text-black hover:-translate-y-0.5"
                          : "glass text-white/50 cursor-not-allowed",
                      )}
                    >
                      {credits > 0 ? "Open capsule" : "Need a credit"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center text-xs text-white/40">
          Profiles are randomized on every pull — the capsule you click is a
          surprise.
        </div>
      </div>
    </div>
  );
}
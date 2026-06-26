"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Coins,
  Heart,
  ShieldCheck,
  Dices,
  DoorOpen,
} from "lucide-react";
import { MACHINES } from "@/data/mock-data";
import { NeonButton } from "@/components/NeonButton";
import { VendingMachineCab } from "@/components/VendingMachineCab";

const FEATURES = [
  {
    icon: Dices,
    title: "Themed vending machines",
    body: "Otaku, rock, fitness, artsy, hustle. Walk the neon street, pick a vibe.",
  },
  {
    icon: Coins,
    title: "10 free credits",
    body: "Demo accounts start with 10 credits pre-loaded. Pull capsules right away.",
  },
  {
    icon: ShieldCheck,
    title: "Gradual reveal",
    body: "Personality first, photo later. Mutual interest unlocks the rest.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* animated grid bg */}
      <div className="pointer-events-none absolute inset-0 cyber-grid animate-gridmove opacity-30" />
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyber-neon/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyber-cyan/30 blur-[120px]" />

      {/* Hero: cinematic street entrance */}
      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 sm:pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-cyber-lime mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          渋谷 · A dating arcade from the year 2099
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display font-bold text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight"
        >
          Capsule Dating:
          <br />
          <span className="bg-gradient-to-r from-cyber-neon via-cyber-purple to-cyber-cyan bg-clip-text text-transparent">
            ガチャ恋の街
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-2xl mx-auto text-white/70 text-base sm:text-lg"
        >
          Step into a neon-soaked Tokyo backstreet of glowing vending machines.
          Drop a coin, crank the dial, crack open a person-capsule. Personality
          first — photo later. Romance, but make it arcade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <NeonButton href="/lobby" className="px-8 py-3.5 text-base">
            <DoorOpen className="w-4 h-4" /> Enter the arcade
          </NeonButton>
          <NeonButton href="/register" variant="ghost" className="px-8 py-3.5 text-base">
            Create a free account
          </NeonButton>
        </motion.div>

        {/* Cinematic street row of machines */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative mt-20 mb-6"
        >
          <div className="absolute inset-x-0 -bottom-6 h-24 cyber-floor opacity-50 [mask-image:linear-gradient(to_top,black,transparent)]" />
          <div className="relative flex items-end justify-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar pb-6">
            {MACHINES.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.12 }}
                className="shrink-0"
              >
                <Link href={`/machine/${m.id}`}>
                  <VendingMachineCab machine={m} size="sm" />
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40 tracking-widest">
            ← scroll the street →
          </p>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center font-display font-bold text-2xl sm:text-3xl mb-10">
          How the arcade works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-5 hover:border-cyber-neon/40 transition-colors"
            >
              <f.icon className="w-7 h-7 text-cyber-neon mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-white/60">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 sm:p-12 relative scanlines"
        >
          <Heart className="w-10 h-10 text-cyber-neon mx-auto mb-4 animate-flicker" />
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">
            Your next someone is in a capsule.
          </h2>
          <p className="text-white/60 mb-6 max-w-xl mx-auto">
            Drop in a coin, crank the dial, let fate roll. You&apos;re demo-logged-in —
            10 credits are waiting.
          </p>
          <NeonButton href="/lobby" variant="cyan" className="px-8 py-3.5 text-base">
            Walk the neon street <ArrowRight className="w-4 h-4" />
          </NeonButton>
        </motion.div>
      </section>
    </div>
  );
}
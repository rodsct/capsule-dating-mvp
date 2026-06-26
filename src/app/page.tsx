"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Boxes,
  ArrowRight,
  Coins,
  Heart,
  ShieldCheck,
  Dices,
} from "lucide-react";
import { MACHINES } from "@/data/mock-data";
import { NeonButton } from "@/components/NeonButton";

const FEATURES = [
  {
    icon: Boxes,
    title: "Themed vending machines",
    body: "Otaku, rock, fitness, artsy, hustle. Walk the lobby, pick a vibe.",
  },
  {
    icon: Dices,
    title: "Random capsule reveal",
    body: "Crack open a capsule and meet a stranger who matches your scene.",
  },
  {
    icon: Coins,
    title: "3 free credits",
    body: "Every new member starts with 3 free opens. Earn more, or top up later.",
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
      <div className="pointer-events-none absolute inset-0 cyber-grid animate-gridmove opacity-40" />
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyber-neon/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyber-cyan/30 blur-[120px]" />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-cyber-lime mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          A dating playground from the year 2099
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display font-bold text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight"
        >
          Find your match
          <br />
          <span className="bg-gradient-to-r from-cyber-neon via-cyber-purple to-cyber-cyan bg-clip-text text-transparent">
            in a vending machine.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-2xl mx-auto text-white/70 text-base sm:text-lg"
        >
          Step into a neon-soaked lobby, wander past themed vending machines,
          and crack open a person-capsule. Personality first, photo later.
          Romance, but make it arcade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <NeonButton href="/lobby" className="px-8 py-3.5 text-base">
            Enter the lobby <ArrowRight className="w-4 h-4" />
          </NeonButton>
          <NeonButton href="/register" variant="ghost" className="px-8 py-3.5 text-base">
            Create a free account
          </NeonButton>
        </motion.div>

        {/* Hero art: floating capsules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 flex justify-center gap-3 sm:gap-6"
        >
          {MACHINES.map((m, i) => (
            <motion.div
              key={m.id}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full relative shadow-neon-cyan animate-float"
              style={{
                background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})`,
                animationDelay: `${i * 0.6}s`,
              }}
              title={m.name}
            >
              <div className="absolute inset-0 grid place-items-center text-lg sm:text-2xl">
                {m.emoji}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-center font-display font-bold text-2xl sm:text-3xl mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Machines preview */}
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl">
            Pick your scene
          </h2>
          <Link
            href="/lobby"
            className="text-sm text-cyber-cyan hover:underline flex items-center gap-1"
          >
            See them in 3D <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {MACHINES.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/machine/${m.id}`}
                className="block glass rounded-2xl p-4 h-full hover:-translate-y-1 hover:shadow-neon transition-all"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl mb-3 grid place-items-center text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})`,
                  }}
                >
                  {m.emoji}
                </div>
                <div className="font-semibold text-sm">{m.name}</div>
                <div className="text-xs text-white/50 mt-0.5 leading-snug">
                  {m.tagline}
                </div>
              </Link>
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
            Spin up a personality in five clicks. Start free, stay weird.
          </p>
          <NeonButton href="/lobby" variant="cyan" className="px-8 py-3.5 text-base">
            Step into the lobby <ArrowRight className="w-4 h-4" />
          </NeonButton>
        </motion.div>
      </section>
    </div>
  );
}
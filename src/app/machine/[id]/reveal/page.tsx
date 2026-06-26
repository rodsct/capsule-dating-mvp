"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Coins,
  Sparkles,
  CheckCircle2,
  Heart,
  Eye,
  Gift,
} from "lucide-react";
import { getMachine, getCapsulesForMachine, getPerson } from "@/data/mock-data";
import { rarityColor, pickRandom } from "@/lib/utils";
import { MACHINES } from "@/data/mock-data";
import { useAuth } from "@/lib/auth";
import type { MachineId, Person } from "@/lib/types";
import { NeonButton } from "@/components/NeonButton";

type Stage = "prompt" | "spinning" | "hints" | "photo";

const REEL_EMOJIS = ["🌸", "🎸", "💪", "🎨", "🚀", "💖", "🎲", "⭐"];

export default function RevealPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, ready, spendCredit, recordMatch } = useAuth();

  const [stage, setStage] = useState<Stage>("prompt");
  const [person, setPerson] = useState<Person | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [dropped, setDropped] = useState(false);
  const [reelFinal, setReelFinal] = useState<string[]>(["?", "?", "?"]);

  const machine = getMachine(params.id as MachineId);
  const credits = user?.credits ?? 0;
  const capsules = useMemo(
    () => (machine ? getCapsulesForMachine(machine.id) : []),
    [machine],
  );

  // precompute some random reel stops for flavor
  const stopEmojis = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) =>
        pickRandom(REEL_EMOJIS, (i + 1) * 7),
      ),
    [],
  );

  if (!machine) return notFound();

  const startReveal = () => {
    setError(null);
    if (!user) {
      router.push(`/login?next=/machine/${machine.id}/reveal`);
      return;
    }
    if (credits <= 0) {
      setError(
        "You're out of credits. Top up on your profile or log out and make a friend?",
      );
      return;
    }
    const ok = spendCredit();
    if (!ok) {
      setError("Couldn't spend a credit.");
      return;
    }
    const pick = getPerson(pickRandom(capsules).personId)!;
    setPerson(pick);
    recordMatch(pick.id);
    setUnlocked(false);
    setDropped(false);
    setReelFinal(["?", "?", "?"]);
    setStage("spinning");
    // stagger reel stops
    stopEmojis.forEach((e, i) =>
      setTimeout(() => setReelFinal((r) => {
        const n = [...r];
        n[i] = e;
        return n;
      }), 500 + i * 450),
    );
    // capsule drops at end of spin
    setTimeout(() => setDropped(true), 500 + stopEmojis.length * 450 + 250);
    // move to hints
    setTimeout(() => setStage("hints"), 500 + stopEmojis.length * 450 + 1400);
  };

  const unlockPhoto = () => {
    setUnlocked(true);
    setStage("photo");
  };

  if (!ready) {
    return (
      <div className="grid place-items-center py-32 text-white/50 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(800px 420px at 50% -10%, ${machine.boxColor}55, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 py-8">
        <Link
          href={`/machine/${machine.id}`}
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {machine.name}
        </Link>

        <AnimatePresence mode="wait">
          {/* ---------- PROMPT ---------- */}
          {stage === "prompt" && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-12"
            >
              <SlotMachine
                machine={machine}
                reels={["?", "?", "?"]}
                spinning={false}
                dropped={false}
                dropEmoji={machine.emoji}
              />
              <h1 className="font-display font-bold text-2xl sm:text-3xl mt-8 mb-3">
                Drop a coin &amp; pull?
              </h1>
              <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">
                One credit cranks the dial, spins the reels, and dispenses a
                random {machine.name} capsule. You&apos;ll see personality hints
                first — reveal the photo when you&apos;re vibing.
              </p>

              <div className="flex items-center justify-center gap-3 mb-6 text-xs">
                <span className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-cyber-lime" />
                  Cost: ¥{machine.price} (1 credit)
                </span>
                <span className="glass px-3 py-1.5 rounded-full">
                  You have:{" "}
                  <span className="text-cyber-lime font-semibold">
                    {user ? credits : "—"}
                  </span>
                </span>
              </div>

              {error && (
                <div className="mb-4 text-sm text-cyber-neon">{error}</div>
              )}

              <NeonButton onClick={startReveal} className="px-8 py-3.5 text-base">
                <Sparkles className="w-4 h-4" /> Insert ¥{machine.price} &amp; pull
              </NeonButton>

              {!user && (
                <p className="mt-4 text-xs text-white/40">
                  You&apos;ll need to{" "}
                  <Link href="/register" className="text-cyber-cyan underline">
                    create a free account
                  </Link>{" "}
                  first.
                </p>
              )}
            </motion.div>
          )}

          {/* ---------- SPINNING ---------- */}
          {stage === "spinning" && (
            <motion.div
              key="spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <SlotMachine
                machine={machine}
                reels={reelFinal}
                spinning
                dropped={dropped}
                dropEmoji={person?.emoji ?? machine.emoji}
              />
              <p className="mt-8 neon-text animate-flicker font-display font-bold text-xl">
                {dropped ? "Cracking open…" : "Spinning the reels…"}
              </p>
            </motion.div>
          )}

          {/* ---------- HINTS ---------- */}
          {stage === "hints" && person && (
            <motion.div
              key="hints"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-white/40">
                  You pulled a capsule from {machine.name}
                </span>
                <h1 className="mt-2 font-display font-bold text-3xl">
                  {person.emoji} {person.name.split(" ")[0]}, {person.age}
                </h1>
                <p className="text-white/50 text-sm mt-1">
                  {person.pronouns} · {person.location}
                </p>
              </div>

              <div className="glass rounded-2xl p-6 mb-6 scanlines">
                <h2 className="text-sm font-semibold text-cyber-neon mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Personality hints
                </h2>
                <ul className="space-y-3">
                  {person.hints.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.25 }}
                      className="flex items-start gap-3 text-white/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyber-lime mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="text-xs text-white/40 mb-2">Into</div>
                  <div className="flex flex-wrap gap-2">
                    {person.interests.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs glass"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-white/60 mb-4">
                  Liking what you see? Unlock the photo &amp; full profile. (Demo:
                  free mutual-interest unlock.)
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <NeonButton onClick={unlockPhoto} variant="cyan">
                    <Eye className="w-4 h-4" /> Reveal photo (mutual interest)
                  </NeonButton>
                  <button
                    type="button"
                    onClick={startReveal}
                    className="inline-flex items-center justify-center gap-2 font-semibold rounded-full px-6 py-3 text-sm glass hover:bg-white/10"
                  >
                    Pull again →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- PHOTO ---------- */}
          {stage === "photo" && person && unlocked && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                <motion.div
                  initial={{ scale: 0.9, filter: "blur(18px)" }}
                  animate={{ scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.7 }}
                  className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-neon scanlines border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-2xl font-display font-bold">
                      {person.emoji} {person.name}, {person.age}
                    </div>
                    <div className="text-xs text-white/60">
                      {person.pronouns} · {person.location}
                    </div>
                  </div>
                </motion.div>

                <div>
                  <h1 className="font-display font-bold text-2xl mb-1">
                    It&apos;s a match-worthy capsule ✨
                  </h1>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {person.bio}
                  </p>

                  <dl className="space-y-3 text-sm">
                    <Info label="Love language" value={person.loveLanguage} />
                    <Info label="Looking for" value={person.lookingFor} />
                    <Info label="On repeat" value={person.song} />
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <NeonButton href={`/profile/${person.id}`} variant="neon">
                      <Heart className="w-4 h-4" /> View full profile
                    </NeonButton>
                    <button
                      type="button"
                      onClick={() => router.push("/profile/me")}
                      className="inline-flex items-center justify-center gap-2 font-semibold rounded-full px-6 py-3 text-sm glass hover:bg-white/10"
                    >
                      <Gift className="w-4 h-4" /> Saved to your matches
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <dt className="text-[11px] uppercase tracking-wider text-white/40">
        {label}
      </dt>
      <dd className="text-white/90">{value}</dd>
    </div>
  );
}

/** A small slot-machine + dispense bin visual. */
function SlotMachine({
  machine,
  reels,
  spinning,
  dropped,
  dropEmoji,
}: {
  machine: (typeof MACHINES)[number];
  reels: string[];
  spinning: boolean;
  dropped: boolean;
  dropEmoji: string;
}) {
  const [g0, g1] = machine.gradient;
  return (
    <div className="relative mx-auto" style={{ width: 300 }}>
      {/* stand glow */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 blur-xl rounded-full"
        style={{ width: 220, height: 30, background: machine.signColor, opacity: 0.5 }}
      />
      <div className="vm-chrome rounded-2xl p-4 pt-3 relative" style={{ width: 300 }}>
        {/* marquee */}
        <div
          className="vm-sign h-10 mb-3 grid place-items-center text-lg font-display font-bold animate-signpulse"
          style={
            {
              "--sign-ring": `${machine.signColor}aa`,
              "--sign-glow": `${machine.signColor}cc`,
              color: machine.signColor,
            } as React.CSSProperties
          }
        >
          {machine.kanji} · {machine.name.toUpperCase()}
        </div>

        {/* 3 reels */}
        <div className="vm-glass relative rounded-md p-3 h-32 flex items-center justify-center gap-3">
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${g0}22, ${g1}11)` }}
          />
          {reels.map((r, i) => (
            <Reel key={i} symbol={r} spinning={spinning} accent={machine.signColor} />
          ))}
          {/* center payline */}
          <div
            className="absolute left-2 right-2 h-px"
            style={{ top: "50%", background: machine.signColor, opacity: 0.5 }}
          />
        </div>

        {/* coin slot line */}
        <div className="flex items-center justify-between mt-3 mb-2">
          <div className="vm-coin-slot h-1.5 w-16 rounded-sm" />
          <span className="text-[9px] text-cyber-gold/80 tracking-widest">
            ¥{machine.price}
          </span>
          <div className="vm-button rounded-full" style={
            {
              "--btn-hi": "#ffe9f6",
              "--btn-lo": machine.signColor,
              "--btn-glow": `${machine.signColor}cc`,
              width: 18,
              height: 18,
            } as React.CSSProperties
          } />
        </div>

        {/* dispense bin */}
        <div className="vm-bin relative h-24 rounded-md overflow-hidden grid place-items-center">
          {!dropped ? (
            <span className="text-[9px] text-white/30 tracking-widest">
              ▲ 自動販売 WAITING ▲
            </span>
          ) : (
            <motion.div
              className="vm-capsule relative rounded-full grid place-items-center text-lg"
              onAnimationComplete={() => {}}
              style={
                {
                  "--cap-top": machine.boxColor,
                  "--cap-bot": g1,
                  "--cap-glow": `${rarityColor("legendary")}66`,
                  width: 64,
                  height: 76,
                  borderRadius: 999,
                } as React.CSSProperties
              }
            >
              <span className="animate-capsule-drop">{dropEmoji}</span>
            </motion.div>
          )}
          <span className="absolute bottom-1 text-[8px] text-white/30 tracking-widest">
            取出口 EXIT
          </span>
        </div>
      </div>
    </div>
  );
}

function Reel({
  symbol,
  spinning,
  accent,
}: {
  symbol: string;
  spinning: boolean;
  accent: string;
}) {
  return (
    <div
      className="relative w-16 h-16 rounded-md bg-black/70 border overflow-hidden grid place-items-center text-3xl"
      style={{ borderColor: `${accent}55`, boxShadow: `inset 0 0 12px ${accent}33` }}
    >
      {spinning ? (
        <motion.div
          className="absolute inset-x-0 flex flex-col items-center"
          animate={{ y: [0, -100] }}
          transition={{ duration: 0.18, repeat: Infinity, ease: "linear" }}
        >
          {REEL_EMOJIS.concat(REEL_EMOJIS).map((e, i) => (
            <span key={i} className="h-16 leading-[4rem] text-center">
              {e}
            </span>
          ))}
        </motion.div>
      ) : (
        <span
          className="animate-signpulse"
          style={{ filter: `drop-shadow(0 0 6px ${accent}aa)` }}
        >
          {symbol}
        </span>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Music2, MapPin, Sparkles } from "lucide-react";
import { getPerson, getMachine } from "@/data/mock-data";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const person = getPerson(params.id);
  if (!person) return notFound();
  const machine = getMachine(person.machineId);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(700px 400px at 50% -10%, ${machine?.boxColor ?? "#ff2bd6"}55, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/lobby"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-[280px_1fr] gap-6"
        >
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-neon scanlines border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={person.photo}
              alt={person.name}
              className="w-full h-full object-cover"
            />
            {machine && (
              <span
                className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold tracking-widest"
                style={{
                  background: `${machine.signColor}22`,
                  color: machine.signColor,
                }}
              >
                {machine.kanji} · {machine.name}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-cyber-neon mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Capsule profile
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl">
              {person.emoji} {person.name}, {person.age}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60 mt-2">
              <span>{person.pronouns}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {person.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Music2 className="w-3.5 h-3.5" /> {person.song}
              </span>
            </div>

            <p className="mt-5 text-white/80 leading-relaxed">{person.bio}</p>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-white/40 mb-2">
                Interests
              </div>
              <div className="flex flex-wrap gap-2">
                {person.interests.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs glass"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <Stat label="Love language" value={person.loveLanguage} />
              <Stat label="Looking for" value={person.lookingFor} />
            </div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-white/40 mb-2">
                Hints they left
              </div>
              <ul className="space-y-2 text-sm text-white/80">
                {person.hints.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <Heart className="w-4 h-4 text-cyber-neon mt-0.5 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[11px] uppercase tracking-wider text-white/40">
        {label}
      </div>
      <div className="text-white/90 text-sm">{value}</div>
    </div>
  );
}
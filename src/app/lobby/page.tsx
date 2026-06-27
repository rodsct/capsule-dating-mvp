"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MACHINES, ACTION_PRICE } from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { classNames, formatMXN } from "@/lib/utils";

export default function LobbyPage() {
  const { placements } = useGame();

  return (
    <div className="py-2">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold neon-text">
          El callejón de las cápsulas
        </h1>
        <p className="mt-1 text-xs text-white/55">
          5 máquinas · {formatMXN(ACTION_PRICE)} por cápsula · CDMX
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MACHINES.map((m, i) => {
          const occupied = placements.filter(
            (p) => p.machineId === m.id,
          ).length;
          const [g0, g1] = m.gradient;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/machine/${m.id}`}
                className="glass group block rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl text-xl"
                      style={{
                        background: `linear-gradient(135deg, ${g0}33, ${g1}55)`,
                        border: `1px solid ${m.signColor}55`,
                      }}
                    >
                      {m.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-widest"
                          style={{
                            background: `${m.signColor}22`,
                            color: m.signColor,
                          }}
                        >
                          {m.kanji}
                        </span>
                        <span
                          className="font-display text-sm font-bold"
                          style={{ color: m.signColor }}
                        >
                          {m.name}
                        </span>
                      </div>
                      <p className="mt-0.5 max-w-[220px] text-[11px] leading-snug text-white/55">
                        {m.tagline}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                </div>

                {/* mini 4x4 preview */}
                <div className="mt-3 grid grid-cols-8 gap-1">
                  {Array.from({ length: 16 }).map((_, s) => {
                    const taken = placements.some(
                      (p) => p.machineId === m.id && p.slot === s,
                    );
                    return (
                      <span
                        key={s}
                        className={classNames(
                          "h-2.5 w-2.5 rounded-[3px]",
                          taken ? "opacity-90" : "opacity-25",
                        )}
                        style={{
                          background: taken
                            ? `linear-gradient(135deg, ${g0}, ${g1})`
                            : "rgba(255,255,255,0.15)",
                        }}
                      />
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-white/45">
                  <span>{occupied} cápsulas</span>
                  <span className="text-cyber-lime">{formatMXN(m.price)}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
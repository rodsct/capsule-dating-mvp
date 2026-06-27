"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { CapsuleProfile } from "@/lib/types";
import { classNames } from "@/lib/utils";

export type SlotKind = "occupied" | "empty" | "mine";

interface Props {
  slot: number;
  kind: SlotKind;
  profile?: CapsuleProfile;
  signColor: string;
  gradient: [string, string];
  onClick?: () => void;
  index?: number;
}

export function SlotCard({
  slot,
  kind,
  profile,
  signColor,
  gradient,
  onClick,
  index = 0,
}: Props) {
  if (kind === "empty") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
        className={classNames(
          "slot-empty group relative aspect-square rounded-xl border border-white/10",
          "flex flex-col items-center justify-center gap-1 p-2 text-center",
          "hover:border-white/25 transition-colors",
        )}
        aria-label={`Espacio ${slot + 1} libre — coloca tu cápsula`}
      >
        <div
          className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/40 transition-colors group-hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-white/30">
          Libre
        </span>
        <span className="text-[9px] text-white/25">$29</span>
      </motion.button>
    );
  }

  // occupied / mine
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={classNames(
        "group relative aspect-square rounded-xl border p-3 text-left",
        "flex flex-col items-center justify-between gap-1 overflow-hidden",
        kind === "mine" ? "border-cyber-lime/50" : "border-white/10",
        "hover:shadow-[0_0_20px_var(--glow)] transition-shadow",
      )}
      style={{
        background:
          `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
        ["--glow" as string]: `${signColor}55`,
      }}
      aria-label={
        kind === "mine"
          ? `Tu cápsula en el espacio ${slot + 1}`
          : `Abrir cápsula de ${profile?.firstName ?? "—"}`
      }
    >
      {/* glow strip */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: signColor, opacity: 0.85 }}
      />
      {kind === "mine" && (
        <span className="absolute right-1.5 top-1.5 z-10 rounded-full bg-cyber-lime/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-black">
          Tú
        </span>
      )}

      <div
        className="cap-orb relative grid h-12 w-12 place-items-center rounded-full text-lg"
        style={
          {
            "--cap-top": gradient[0],
            "--cap-bot": gradient[1],
            "--cap-glow": `${signColor}66`,
          } as React.CSSProperties
        }
      >
        <span className="leading-none drop-shadow">
          {kind === "mine" ? profile?.emoji ?? "🫧" : profile?.emoji ?? "🫧"}
        </span>
      </div>

      <div className="w-full text-center">
        <div className="truncate text-xs font-semibold text-white">
          {profile?.firstName ?? "—"}
        </div>
        {profile?.age ? (
          <div className="text-[10px] text-white/45">{profile.age} años</div>
        ) : null}
      </div>

      <div className="flex w-full flex-wrap justify-center gap-0.5">
        {(profile?.hobbies ?? []).slice(0, 3).map((h) => (
          <span
            key={h}
            className="max-w-full truncate rounded-full bg-white/5 px-1.5 py-0.5 text-[8px] text-white/55"
          >
            {h}
          </span>
        ))}
      </div>
    </motion.button>
  );
}
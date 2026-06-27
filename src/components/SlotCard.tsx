"use client";

import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import type { CapsuleProfile, OwnCapsule } from "@/lib/types";
import { classNames } from "@/lib/utils";
import { genderInfo } from "@/data/mock-data";

export type SlotKind = "occupied" | "empty" | "mine";

interface Props {
  slot: number;
  kind: SlotKind;
  profile?: CapsuleProfile;
  ownCapsule?: OwnCapsule | null;
  gradient: [string, string];
  index?: number;
  onClick?: () => void;
}

export function SlotCard({
  slot,
  kind,
  profile,
  ownCapsule,
  gradient,
  index = 0,
  onClick,
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
          "slot-empty group relative aspect-square rounded-xl border border-dashed",
          "flex flex-col items-center justify-center gap-1 p-2 text-center",
          "border-white/15 hover:border-cyber-lime/60 transition-colors",
        )}
        aria-label={`Espacio ${slot + 1} libre — coloca tu cápsula`}
      >
        <div
          className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/40 transition-colors group-hover:text-cyber-lime"
        >
          <Plus className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
          Libre
        </span>
        <span className="text-[9px] text-cyber-lime/80">$29 MXN</span>
      </motion.button>
    );
  }

  // occupied / mine
  const ring = profile
    ? genderInfo(profile.genderCode)?.color
    : ownCapsule
      ? genderInfo(ownCapsule.genderCode)?.color
      : "#ffffff";
  const grad = profile?.capsuleGradient ?? gradient;

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
          "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        ["--glow" as string]: `${ring}55`,
      }}
      aria-label={
        kind === "mine"
          ? `Tu cápsula en el espacio ${slot + 1}`
          : `Ver cápsula de ${profile?.firstName ?? "—"}`
      }
    >
      {/* gender color ring strip */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: ring, opacity: 0.95 }}
      />
      {kind === "mine" && (
        <span className="absolute right-1.5 top-1.5 z-10 rounded-full bg-cyber-lime/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-black">
          Tú
        </span>
      )}

      <div
        className="cap-orb relative grid h-12 w-12 place-items-center rounded-full text-lg ring-2"
        style={
          {
            "--cap-top": grad[0],
            "--cap-bot": grad[1],
            "--cap-glow": `${ring}66`,
            boxShadow: `inset 0 -4px 8px rgba(0,0,0,0.4), inset 0 3px 4px rgba(255,255,255,0.4), 0 0 12px ${ring}55`,
            borderColor: ring,
          } as React.CSSProperties
        }
      >
        <span className="leading-none drop-shadow">
          {kind === "mine" ? ownCapsule?.emoji ?? "🫧" : profile?.emoji ?? "🫧"}
        </span>
      </div>

      <div className="w-full text-center">
        <div className="truncate text-xs font-semibold text-white">
          {kind === "mine" ? ownCapsule?.firstName : profile?.firstName}
        </div>
        <div className="text-[10px] text-white/50">
          {(kind === "mine" ? ownCapsule?.age : profile?.age) ?? "—"} años
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-0.5 text-[9px] text-white/50">
        <MapPin className="h-2.5 w-2.5 shrink-0" />
        <span className="truncate">
          {kind === "mine" ? ownCapsule?.alcaldia : profile?.alcaldia}
        </span>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-0.5">
        {(kind === "mine" ? ownCapsule?.hobbies : profile?.hobbies)
          ?.slice(0, 3)
          .map((h) => (
            <span
              key={h}
              className="max-w-full truncate rounded-full bg-white/5 px-1.5 py-0.5 text-[8px] text-white/55"
            >
              {h}
            </span>
          ))}
      </div>

      <span
        className="mt-0.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-semibold"
        style={{ background: `${ring}22`, color: ring }}
      >
        {genderInfo(kind === "mine" ? ownCapsule?.genderCode ?? "amistad" : profile?.genderCode ?? "amistad")
          ?.label.split(" ")[0]}
      </span>
    </motion.button>
  );
}
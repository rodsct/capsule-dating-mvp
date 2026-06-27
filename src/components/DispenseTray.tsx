"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { classNames } from "@/lib/utils";

interface Props {
  /** When provided, a falling capsule orb is animated into the tray. */
  dropping?: {
    emoji: string;
    gradient: [string, string];
    ring: string;
  } | null;
  /** When true the tray is empty/idle (last dispensed capsule stays visible). */
  label?: string;
  /** An optional capsule already resting in the tray (after drop). */
  resting?: {
    emoji: string;
    gradient: [string, string];
    ring: string;
  } | null;
}

/**
 * The bottom dispense tray of the vending machine. Idle = dark flap; while
 * `dropping` is set a capsule orb animates from above and lands in the tray.
 */
export function DispenseTray({ dropping, label = "Recogida", resting }: Props) {
  return (
    <div className="vm-tray relative overflow-hidden rounded-xl">
      <div className="relative flex h-24 items-center justify-center">
        {/* flap shadow */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7), transparent)",
          }}
        />
        {dropping ? (
          <motion.div
            key="drop"
            initial={{ y: -260, opacity: 0, rotate: 0 }}
            animate={{ y: 6, opacity: 1, rotate: 380 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="cap-orb grid h-12 w-12 place-items-center rounded-full text-xl ring-2"
            style={
              {
                "--cap-top": dropping.gradient[0],
                "--cap-bot": dropping.gradient[1],
                "--cap-glow": `${dropping.ring}aa`,
                borderColor: dropping.ring,
              } as React.CSSProperties
            }
          >
            <span className="leading-none">{dropping.emoji}</span>
          </motion.div>
        ) : resting ? (
          <motion.div
            key="rest"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cap-orb grid h-12 w-12 place-items-center rounded-full text-xl ring-2"
            style={
              {
                "--cap-top": resting.gradient[0],
                "--cap-bot": resting.gradient[1],
                "--cap-glow": `${resting.ring}aa`,
                borderColor: resting.ring,
              } as React.CSSProperties
            }
          >
            <span className="leading-none">{resting.emoji}</span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-white/35">
            <Package className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-widest">
              {label}
            </span>
          </div>
        )}
      </div>
      {/* tray flap edge */}
      <div
        aria-hidden
        className={classNames(
          "absolute inset-x-0 top-0 h-2 rounded-t-xl",
        )}
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.05))",
        }}
      />
    </div>
  );
}
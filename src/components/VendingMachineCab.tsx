"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import type { VendingMachine, Capsule } from "@/lib/types";
import { getCapsulesForMachine, getPerson } from "@/data/mock-data";
import { classNames, rarityColor, formatMXN } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const DIMS: Record<Size, { w: number; h: number; capsule: number }> = {
  sm: { w: 200, h: 320, capsule: 22 },
  md: { w: 280, h: 460, capsule: 30 },
  lg: { w: 340, h: 560, capsule: 38 },
};

interface Props {
  machine: VendingMachine;
  size?: Size;
  href?: string;
  showProducts?: boolean;
  onSelect?: () => void;
  selected?: boolean;
  className?: string;
}

export function VendingMachineCab({
  machine,
  size = "md",
  href,
  showProducts = true,
  onSelect,
  selected = false,
  className,
}: Props) {
  const { w, h, capsule } = DIMS[size];
  const [g0, g1] = machine.gradient;

  // 14 capsules arranged 3 per shelf x 5 shelves (we cap to fit)
  const capsules = getCapsulesForMachine(machine.id);
  const rows = Math.min(5, Math.ceil(capsules.length / 3));

  const inner = (
    <MotionConfig transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <motion.div
        whileHover={onSelect || href ? { y: -6, scale: 1.02 } : undefined}
        className={classNames("relative select-none", className)}
        style={{ width: w, height: h }}
      >
        {/* base glow on the street */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full blur-xl"
          style={{
            width: w * 0.7,
            height: 18,
            background: machine.signColor,
            opacity: 0.55,
          }}
        />

        {/* shadow */}
        <div
          className="absolute -bottom-2 inset-x-3 rounded-full blur-md"
          style={{ height: 16, background: "rgba(0,0,0,0.7)" }}
        />

        {/* === MACHINE BODY === */}
        <div
          className="vm-chrome absolute inset-0 rounded-2xl"
          style={{ borderRadius: 14 }}
        >
          {/* side rails */}
          <div className="vm-chrome-side absolute left-0 top-2 bottom-2 w-2 rounded-l-md" />
          <div className="vm-chrome-side absolute right-0 top-2 bottom-2 w-2 rounded-r-md" />

          {/* top neon sign */}
          <div
            className="vm-sign absolute top-2 inset-x-3 h-12 grid grid-cols-2 overflow-hidden"
            style={
              {
                "--sign-ring": `${machine.signColor}aa`,
                "--sign-glow": `${machine.signColor}cc`,
              } as React.CSSProperties
            }
          >
            <div className="grid place-items-center text-2xl leading-none tracking-tight font-display font-bold animate-signpulse"
              style={{
                color: machine.signColor,
                ["--sign-glow" as string]: `${machine.signColor}cc`,
              }}
            >
              {machine.kanji}
            </div>
            <div className="flex flex-col items-end justify-center pr-2 text-right">
              <span
                className="text-[8px] font-bold tracking-[0.25em] leading-none"
                style={{ color: machine.signColor }}
              >
                {machine.romaji}
              </span>
              <span className="text-[7px] text-white/40 tracking-wider mt-0.5">
                {formatMXN(machine.price)}
              </span>
            </div>
          </div>

          {/* illuminated glass front */}
          <div className="vm-glass absolute top-16 inset-x-3 rounded-md overflow-hidden"
            style={{ bottom: showProducts ? 92 : 64 }}
          >
            {/* interior lighting */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120px 60px at 50% 0%, ${g0}33, transparent 70%), linear-gradient(180deg, rgba(10,10,30,0.85), rgba(5,5,15,0.95))`,
              }}
            />
            {showProducts && (
              <div className="absolute inset-1 flex flex-col justify-between py-1.5">
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r}>
                    {/* shelf strip */}
                    <div className="vm-shelf h-1.5 rounded-sm mb-1" />
                    {/* product row of capsule balls */}
                    <div className="flex items-start justify-center gap-1.5">
                      {[0, 1, 2].map((c) => {
                        const idx = r * 3 + c;
                        const cap = capsules[idx];
                        if (!cap) return <div key={c} style={{ width: capsule, height: capsule }} />;
                        const person = getPerson(cap.personId);
                        return (
                          <motion.div
                            key={cap.id}
                            initial={{ y: -4 }}
                            animate={{ y: [0, -2, 0] }}
                            transition={{
                              duration: 4 + (idx % 4),
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: idx * 0.2,
                            }}
                            className="vm-capsule relative rounded-full grid place-items-center"
                            style={
                              {
                                "--cap-top": cap.color,
                                "--cap-bot": machine.gradient[1],
                                "--cap-glow": `${rarityColor(cap.rarity)}66`,
                                width: capsule,
                                height: capsule,
                              } as React.CSSProperties
                            }
                            title={person?.name}
                          >
                            <span className="text-[8px] leading-none opacity-90">
                              {person?.emoji}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* control panel */}
          <div className="absolute left-3 right-3 h-12 flex items-center justify-between"
            style={{ bottom: 68 }}
          >
            <div className="flex flex-col items-center gap-1">
              <button
                aria-label="press button"
                className="vm-button rounded-full"
                style={
                  {
                    "--btn-hi": "#ffe9f6",
                    "--btn-lo": machine.signColor,
                    "--btn-glow": `${machine.signColor}cc`,
                    width: 22,
                    height: 22,
                  } as React.CSSProperties
                }
              />
              <span className="text-[6px] text-white/50 tracking-widest">PULSA</span>
            </div>
            {/* coin slot */}
            <div className="flex-1 mx-2 flex items-center justify-center gap-2">
              <div
                className="vm-coin-slot h-1.5 w-10 rounded-sm"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
              />
              <span className="text-[6px] text-cyber-gold/80 tracking-widest">MXN</span>
            </div>
            {/* numeric display */}
            <div className="rounded-sm bg-black/80 border border-cyber-lime/30 px-1.5 py-0.5 text-cyber-lime text-[8px] font-bold tracking-wider shadow-[0_0_8px_rgba(182,255,58,0.5)]">
              在
            </div>
          </div>

          {/* dispense bin */}
          <div className="vm-bin absolute left-3 right-3 bottom-3 h-12 rounded-md flex items-end justify-center pb-1.5 overflow-hidden">
            <span className="text-[7px] text-white/40 tracking-widest">▲ 取出口 SALIDA</span>
          </div>
        </div>

        {/* selected halo */}
        {selected && (
          <motion.div
            className="pointer-events-none absolute -inset-2 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: `0 0 24px ${machine.signColor}` }}
          />
        )}
      </motion.div>
    </MotionConfig>
  );

  if (href) {
    return (
      <Link href={href} className="block" onClick={onSelect}>
        {inner}
      </Link>
    );
  }
  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className="block text-left">
        {inner}
      </button>
    );
  }
  return inner;
}
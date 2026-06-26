"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { MACHINES } from "@/data/mock-data";
import type { VendingMachine } from "@/lib/types";
import { VendingMachineCab } from "@/components/VendingMachineCab";

export default function LobbyPage() {
  const scroller = useRef<HTMLDivElement>(null);
  const [kmMarker, setKmMarker] = useState(0);

  // advance the street "you are here" marker every few seconds for mood
  useEffect(() => {
    const id = setInterval(() => {
      setKmMarker((k) => (k + 1) % 100);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* night sky gradient + haze */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[300px] rounded-full bg-cyber-purple/30 blur-[120px]" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[260px] rounded-full bg-cyber-cyan/25 blur-[120px]" />
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto"
        >
          <h1 className="text-xl sm:text-2xl font-display font-bold neon-text-cyan">
            渋谷 自動販売機通り
          </h1>
          <p className="text-[11px] text-white/50 tracking-widest mt-0.5">
            SHIBUYA · VENDING STREET
          </p>
        </motion.div>
        <div className="pointer-events-auto flex items-center gap-2 glass rounded-full px-3 py-2 text-xs">
          <MapPin className="w-3.5 h-3.5 text-cyber-lime" />
          <span className="text-white/70">walking {kmMarker}m</span>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="scroll left"
              className="w-8 h-8 rounded-full hover:bg-white/10 grid place-items-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="scroll right"
              className="w-8 h-8 rounded-full hover:bg-white/10 grid place-items-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* the street */}
      <div className="relative h-full min-h-[calc(100vh-64px)]">
        {/* perspective floor */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 cyber-floor opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" />

        <div
          ref={scroller}
          className="absolute inset-0 overflow-x-auto no-scrollbar overflow-y-hidden"
        >
          {/* fake backdrop buildings */}
          <div className="relative flex items-end gap-6 px-10 sm:px-20 pb-2 pt-40 min-h-full">
            {MACHINES.map((m, i) => (
              <StreetSlot key={m.id} machine={m} delay={i * 0.08} />
            ))}
            {/* end-of-street lantern */}
            <div className="shrink-0 self-end pb-0 pl-2">
              <div
                className="w-16 h-16 rounded-full grid place-items-center text-2xl animate-flicker"
                style={{ background: "radial-gradient(circle, #ff2bd666, transparent 70%)" }}
              >
                🏮
              </div>
            </div>
          </div>
        </div>

        {/* mobile quick strip */}
        <div className="absolute bottom-4 inset-x-4 z-20 sm:hidden">
          <div className="glass rounded-2xl p-3 overflow-x-auto no-scrollbar">
            <div className="flex gap-2">
              {MACHINES.map((m) => (
                <Link
                  key={m.id}
                  href={`/machine/${m.id}`}
                  className="shrink-0 px-3 py-2 rounded-full text-xs font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})`,
                    color: "#05060f",
                  }}
                >
                  {m.emoji} {m.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StreetSlot({
  machine,
  delay,
}: {
  machine: VendingMachine;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative shrink-0 flex flex-col items-center pb-2"
    >
      {/* overhead sign hanging from "wire" */}
      <div className="mb-2 flex flex-col items-center">
        <div className="w-px h-6 bg-white/20" />
        <div
          className="vm-sign px-2 py-1 rounded text-[10px] font-bold tracking-widest animate-signpulse"
          style={
            {
              "--sign-ring": `${machine.signColor}99`,
              "--sign-glow": `${machine.signColor}cc`,
              color: machine.signColor,
            } as React.CSSProperties
          }
        >
          {machine.romaji}
        </div>
      </div>
      <Link href={`/machine/${machine.id}`} className="block">
        <VendingMachineCab machine={machine} size="md" />
      </Link>
      <div className="mt-3 text-center max-w-[280px]">
        <div className="font-semibold text-sm neon-text">{machine.name}</div>
        <div className="text-[11px] text-white/50 leading-snug mt-0.5">
          {machine.tagline}
        </div>
      </div>
    </motion.div>
  );
}
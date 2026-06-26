"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MACHINES } from "@/data/mock-data";
import type { MachineId, VendingMachine } from "@/lib/types";

export default function LobbyPage() {
  const [yaw, setYaw] = useState(0);
  const [podX, setPodX] = useState(0);
  const [hovered, setHovered] = useState<MachineId | null>(null);
  const [manual, setManual] = useState(false);

  // slow auto-rotate until user interacts
  useEffect(() => {
    if (manual) return;
    const id = setInterval(() => {
      setYaw((y) => y + 0.2);
    }, 60);
    return () => clearInterval(id);
  }, [manual]);

  const nudge = (delta: number) => {
    setManual(true);
    setYaw((y) => y + delta);
  };

  return (
    <div className="relative">
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-display font-bold neon-text-cyan"
        >
          The Lobby
        </motion.h1>
        <div className="pointer-events-auto flex gap-2 glass rounded-full p-1">
          <button
            onClick={() => nudge(-8)}
            className="w-9 h-9 rounded-full hover:bg-white/10 grid place-items-center text-lg"
            aria-label="rotate left"
          >
            ⟲
          </button>
          <button
            onClick={() => nudge(8)}
            className="w-9 h-9 rounded-full hover:bg-white/10 grid place-items-center text-lg"
            aria-label="rotate right"
          >
            ⟳
          </button>
          <button
            onClick={() => setManual(false)}
            className="px-3 h-9 rounded-full hover:bg-white/10 grid place-items-center text-xs"
            aria-label="auto-rotate"
          >
            AUTO
          </button>
        </div>
      </div>

      <div
        className="scene relative h-[100vh] w-full overflow-hidden"
        style={{ minHeight: "calc(100vh - 64px)" }}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const cx = (e.clientX - rect.left - rect.width / 2) / rect.width;
          setPodX(cx * 20);
        }}
      >
        {/* floor */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 cyber-grid [mask-image:linear-gradient(to_top,black,transparent)] opacity-60" />
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyber-purple/30 blur-[120px]" />

        <div
          className="world absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -42%) translateX(${podX}px) rotateX(8deg) rotateY(${yaw}deg)`,
          }}
        >
          <div className="relative" style={{ width: 0, height: 0 }}>
            {MACHINES.map((m) => (
              <MachinePod
                key={m.id}
                machine={m}
                worldYaw={yaw}
                hovered={hovered === m.id}
                onHover={setHovered}
              />
            ))}
            {/* center pedestal */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: "translate(-50%, -50%) translateZ(-2px)",
                width: 240,
                height: 240,
              }}
            >
              <div className="w-full h-full rounded-full bg-cyber-cyan/10 border border-cyber-cyan/40 shadow-neon-cyan text-xs text-white/40 grid place-items-center text-center px-4">
                Lobby center · {MACHINES.length} machines
              </div>
            </div>
          </div>
        </div>

        {/* mobile list fallback */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:hidden">
          <div className="glass rounded-2xl p-3">
            <div className="text-xs text-white/50 mb-2">Quick jump:</div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {MACHINES.map((m) => (
                <Link
                  key={m.id}
                  href={`/machine/${m.id}`}
                  className="shrink-0 px-3 py-2 rounded-full text-xs font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})`,
                    color: "#0a0b1e",
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

function MachinePod({
  machine,
  worldYaw,
  hovered,
  onHover,
}: {
  machine: VendingMachine;
  worldYaw: number;
  hovered: boolean;
  onHover: (id: MachineId | null) => void;
}) {
  // place each machine using its (x, z) offset; the world itself rotates via yaw.
  const { x, z } = machine.position;
  const translateZ = -z * 30; // forward/back depth
  const translateX = x * 60; // lateral spread

  return (
    <div
      className="machine-3d absolute left-0 top-0"
      style={{
        transform: `translate(${translateX}px, 0) translateZ(${translateZ}px)`,
      }}
      onPointerEnter={() => onHover(machine.id)}
      onPointerLeave={() => onHover(null)}
    >
      {/* billboard counter-rotation so label faces camera-ish */}
      <Link
        href={`/machine/${machine.id}`}
        className="block relative -translate-x-1/2 -translate-y-1/2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative transition-transform duration-200"
          style={{
            transform: `rotateY(${-worldYaw}deg) scale(${hovered ? 1.06 : 1})`,
          }}
        >
          <VendingMachine3D machine={machine} />
        </div>
      </Link>
    </div>
  );
}

function VendingMachine3D({
  machine,
}: {
  machine: VendingMachine;
}) {
  const [g0, g1] = machine.gradient;
  return (
    <div className="relative" style={{ width: 200, height: 300 }}>
      {/* body */}
      <div
        className="absolute inset-0 rounded-2xl border border-white/15 overflow-hidden shadow-neon"
        style={{
          background: `linear-gradient(160deg, ${g0}, ${g1})`,
          boxShadow: `0 0 28px ${machine.boxColor}66, inset 0 0 24px rgba(0,0,0,0.4)`,
        }}
      >
        {/* top sign */}
        <div className="absolute top-2 inset-x-3 h-9 rounded-md bg-black/30 backdrop-blur grid place-items-center text-xs font-bold tracking-wide">
          <span className="neon-text">{machine.name}</span>
        </div>

        {/* capsule window grid */}
        <div className="absolute top-14 inset-x-3 bottom-16 grid grid-cols-3 grid-rows-4 gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${g0}, ${g1})`,
                animation: `float ${4 + (i % 5)}s ease-in-out infinite`,
                animationDelay: `${i * 0.18}s`,
                boxShadow: `0 0 6px ${machine.boxColor}88 inset`,
              }}
            />
          ))}
        </div>

        {/* dispense slot */}
        <div className="absolute bottom-3 inset-x-3 h-10 rounded-md bg-black/40 border border-white/10 grid place-items-center text-[10px] text-white/60">
          ▽ pull a capsule ▽
        </div>
      </div>

      {/* header emoji halo */}
      <div
        className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full grid place-items-center text-2xl"
        style={{
          background: `radial-gradient(circle, ${g0}33, transparent 70%)`,
        }}
      >
        {machine.emoji}
      </div>

      {/* base glow */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-3 rounded-full blur-md"
        style={{ background: machine.boxColor }}
      />
    </div>
  );
}
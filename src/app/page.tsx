"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coins, PackageOpen } from "lucide-react";
import type { CapsuleProfile } from "@/lib/types";
import { MACHINE } from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { MachineGrid } from "@/components/MachineGrid";
import { formatMXN } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const { user, placements, ownCapsule } = useGame();
  const [showRemove, setShowRemove] = useState<{
    slot: number;
    profile?: CapsuleProfile;
  } | null>(null);

  const occupied = placements.filter((p) => p.machineId === MACHINE.id).length;
  const free = MACHINE.slots - occupied;

  const handleSlot = (
    slot: number,
    kind: "occupied" | "empty" | "mine",
    profile?: CapsuleProfile,
  ) => {
    if (kind === "occupied") {
      router.push(`/machine/cdmx/reveal?slot=${slot}`);
    } else if (kind === "empty") {
      router.push(`/place/cdmx?slot=${slot}`);
    } else if (kind === "mine") {
      setShowRemove({ slot, profile });
    }
  };

  return (
    <div className="py-2">
      <div className="mb-5 text-center">
        <h1 className="font-display text-2xl font-bold neon-text">
          {MACHINE.name}
        </h1>
        <p className="mt-1 text-xs text-white/55">
          {MACHINE.subtitle} · {MACHINE.description}
        </p>
        <div className="mt-2 inline-flex items-center gap-2 text-[11px] text-white/50">
          <span className="inline-flex items-center gap-1 rounded-full border border-cyber-lime/40 bg-white/5 px-2.5 py-0.5 font-semibold text-cyber-lime">
            {free} espacios libres
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-cyber-neon/40 bg-white/5 px-2.5 py-0.5 font-semibold text-cyber-neon">
            <Coins className="h-3 w-3" /> {formatMXN(MACHINE.price)}
          </span>
          {user && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5">
              {user.monedas} monedas
            </span>
          )}
        </div>
      </div>

      <MachineGrid
        machine={MACHINE}
        placements={placements}
        ownCapsule={ownCapsule}
        onSlotClick={handleSlot}
      />

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-white/45">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-white/30" />{" "}
          Libre— coloca tu cápsula
        </span>
        <span className="inline-flex items-center gap-1">
          <PackageOpen className="h-3 w-3" /> Toca una cápsula para abrirla
        </span>
      </div>

      {showRemove && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={() => setShowRemove(null)}
        >
          <div
            className="glass-strong w-full max-w-sm rounded-2xl p-5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg font-bold">Quitar tu cápsula</h2>
            <p className="mt-1 text-sm text-white/55">
              Esta cápsula en el espacio {showRemove.slot + 1} es tuya. Al
              quitarla liberas el slot (no se devuelven monedas).
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => setShowRemove(null)}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10"
              >
                Cancelar
              </button>
              <Link
                href="/profile/me"
                className="rounded-full bg-cyber-neon px-4 py-2 text-xs font-bold text-black"
              >
                Ir a mi perfil
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Coins, PackageOpen } from "lucide-react";
import type { MachineId } from "@/lib/types";
import { getMachine } from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { MachineGrid } from "@/components/MachineGrid";
import { formatMXN } from "@/lib/utils";
import type { CapsuleProfile } from "@/lib/types";

export default function MachinePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, placements, ownCapsule } = useGame();
  const machine = getMachine(params.id as MachineId);
  const [showRemove, setShowRemove] = useState<{
    slot: number;
    profile?: CapsuleProfile;
  } | null>(null);

  if (!machine) return notFound();

  const handleSlot = (slot: number, kind: "occupied" | "empty" | "mine", profile?: CapsuleProfile) => {
    if (kind === "occupied") {
      router.push(`/machine/${machine.id}/reveal?slot=${slot}`);
    } else if (kind === "empty") {
      router.push(`/place/${machine.id}?slot=${slot}`);
    } else if (kind === "mine") {
      setShowRemove({ slot, profile });
    }
  };

  return (
    <div className="py-2">
      <Link
        href="/lobby"
        className="mb-4 inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a la sala
      </Link>

      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="rounded px-2 py-0.5 text-xs font-bold tracking-widest"
              style={{
                background: `${machine.signColor}22`,
                color: machine.signColor,
              }}
            >
              {machine.kanji}
            </span>
            <h1
              className="font-display text-2xl font-bold"
              style={{ color: machine.signColor }}
            >
              {machine.name}
            </h1>
          </div>
          <p className="mt-1 text-sm text-white/55">{machine.tagline}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="inline-flex items-center gap-1 rounded-full border border-cyber-lime/40 bg-white/5 px-2.5 py-1 text-xs font-semibold text-cyber-lime">
            <Coins className="h-3.5 w-3.5" /> {formatMXN(machine.price)}
          </div>
          {user && (
            <div className="mt-1 text-[11px] text-white/45">
              {user.monedas} monedas
            </div>
          )}
        </div>
      </div>

      <MachineGrid
        machine={machine}
        placements={placements}
        ownCapsule={ownCapsule}
        onSlotClick={handleSlot}
      />

      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-white/45">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm border border-white/20" /> Libre
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-cyber-neon" /> Ocupada
        </span>
        <span className="inline-flex items-center gap-1">
          <PackageOpen className="h-3 w-3" /> Toca una cápsula para revelar
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
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type {
  CapsuleProfile,
  OwnCapsule,
  SlotPlacement,
  VendingMachine,
} from "@/lib/types";
import { getProfile, GENDER_CODES } from "@/data/mock-data";
import { SlotCard, type SlotKind } from "@/components/SlotCard";
import { classNames } from "@/lib/utils";

interface Props {
  machine: VendingMachine;
  placements: SlotPlacement[];
  ownCapsule: OwnCapsule | null;
  onSlotClick: (slot: number, kind: SlotKind, profile?: CapsuleProfile) => void;
}

export function MachineGrid({
  machine,
  placements,
  ownCapsule,
  onSlotClick,
}: Props) {
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="space-y-3">
      <div className="vm-glass relative grid grid-cols-3 gap-2 rounded-2xl p-3 sm:grid-cols-4 sm:gap-3 sm:p-4">
        {Array.from({ length: machine.slots }).map((_, slot) => {
          const placement = placements.find(
            (p) => p.machineId === machine.id && p.slot === slot,
          );
          const profileId = placement?.profileId;
          let kind: SlotKind = "empty";
          let profile: CapsuleProfile | undefined;
          if (profileId === "me") {
            kind = "mine" as SlotKind;
          } else if (profileId) {
            kind = "occupied" as SlotKind;
            profile = getProfile(profileId);
          }
          return (
            <SlotCard
              key={slot}
              slot={slot}
              kind={kind}
              profile={profile}
              ownCapsule={ownCapsule}
              gradient={machine.id ? ["#ff2bd6", "#9d4edd"] : ["#000", "#000"]}
              index={slot}
              onClick={() => onSlotClick(slot, kind, profile)}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="glass rounded-xl p-3">
        <button
          type="button"
          onClick={() => setShowLegend((v) => !v)}
          className="flex w-full items-center justify-between text-xs font-semibold text-white/70"
        >
          <span>¿Qué significan los colores del aro?</span>
          <ChevronDown
            className={classNames(
              "h-4 w-4 transition-transform",
              showLegend && "rotate-180",
            )}
          />
        </button>
        {showLegend && (
          <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {GENDER_CODES.map((g) => (
              <span
                key={g.code}
                className="inline-flex items-center gap-2 text-[11px] text-white/65"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/10"
                  style={{ background: g.color }}
                />
                {g.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
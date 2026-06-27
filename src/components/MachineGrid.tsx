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
  selectedSlot: number | null;
  onSlotClick: (slot: number, kind: SlotKind, profile?: CapsuleProfile) => void;
}

const SHELF_COLS = 4;

export function MachineGrid({
  machine,
  placements,
  ownCapsule,
  selectedSlot,
  onSlotClick,
}: Props) {
  const [showLegend, setShowLegend] = useState(false);

  const rows = Math.ceil(machine.slots / SHELF_COLS);

  return (
    <div className="space-y-3">
      <div className="vm-grid-bg vm-glass relative rounded-2xl p-3 sm:p-4">
        {Array.from({ length: rows }).map((_, rowIdx) => {
          const start = rowIdx * SHELF_COLS;
          const end = start + SHELF_COLS;
          return (
            <div key={rowIdx} className="relative">
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {Array.from({ length: machine.slots })
                  .slice(start, end)
                  .map((_, i) => {
                    const slot = start + i;
                    if (slot >= machine.slots) {
                      return <span key={slot} aria-hidden className="block" />;
                    }
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
                        gradient={["#ff2bd6", "#9d4edd"]}
                        index={slot}
                        selected={selectedSlot === slot}
                        onClick={() => onSlotClick(slot, kind, profile)}
                      />
                    );
                  })}
              </div>
              {/* illuminated shelf rail under each row */}
              {rowIdx < rows - 1 && (
                <div
                  aria-hidden
                  className="vm-shelf my-2 h-1.5 rounded-full"
                />
              )}
            </div>
          );
        })}

        {/* top interior light bar */}
        <div
          aria-hidden
          className="vm-light-bar pointer-events-none absolute inset-x-3 top-1 h-1.5 rounded-full"
        />
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
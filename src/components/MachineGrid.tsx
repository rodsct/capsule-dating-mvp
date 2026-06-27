"use client";

import type { CapsuleProfile, OwnCapsule, SlotPlacement, VendingMachine } from "@/lib/types";
import { getProfile } from "@/data/mock-data";
import { SlotCard, type SlotKind } from "@/components/SlotCard";
import { classNames } from "@/lib/utils";

interface Props {
  machine: VendingMachine;
  placements: SlotPlacement[];
  ownCapsule: OwnCapsule | null;
  onSlotClick: (slot: number, kind: SlotKind, profile?: CapsuleProfile) => void;
}

function ownProfile(c: OwnCapsule): CapsuleProfile {
  return {
    id: "me",
    machineId: "romance",
    firstName: c.firstName,
    age: c.age,
    emoji: c.emoji,
    hobbies: c.hobbies,
    fullName: `Yo (${c.firstName})`,
    bio: c.bio,
    loveLanguage: "—",
    lookingFor: "—",
    song: "—",
    photoGradient: ["#b6ff3a", "#0a6b3d"],
  };
}

export function MachineGrid({ machine, placements, ownCapsule, onSlotClick }: Props) {
  const [g0, g1] = machine.gradient;
  return (
    <div
      className={classNames(
        "vm-glass relative grid grid-cols-4 gap-2 rounded-2xl p-3",
        "sm:gap-3 sm:p-4",
      )}
    >
      {Array.from({ length: 16 }).map((_, slot) => {
        const placement = placements.find(
          (p) => p.machineId === machine.id && p.slot === slot,
        );
        const profileId = placement?.profileId;
        let kind: SlotKind = "empty";
        let profile: CapsuleProfile | undefined;
        if (profileId === "me") {
          kind = "mine";
          if (ownCapsule) profile = ownProfile(ownCapsule);
        } else if (profileId) {
          kind = "occupied";
          profile = getProfile(profileId);
        }
        return (
          <SlotCard
            key={slot}
            slot={slot}
            kind={kind}
            profile={profile}
            signColor={machine.signColor}
            gradient={[g0, g1]}
            index={slot}
            onClick={() => onSlotClick(slot, kind, profile)}
          />
        );
      })}
    </div>
  );
}
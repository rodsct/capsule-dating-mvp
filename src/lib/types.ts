export type MachineId =
  | "romance"
  | "amistad"
  | "aventura"
  | "conversacion"
  | "networking";

export interface VendingMachine {
  id: MachineId;
  name: string;
  /** Japanese kanji shown on the sign for a hint of gacha flavor */
  kanji: string;
  tagline: string;
  description: string;
  emoji: string;
  /** Tailwind-friendly gradient stops for the machine body */
  gradient: [string, string];
  /** hex neon accent for the sign ring/glow */
  signColor: string;
  /** price per action in MXN (buy = place) */
  price: number;
}

/**
 * A capsule profile. Public data (firstName, age, hobbies, emoji) is shown on
 * the slot before purchase. Revealed data (bio, photo, love language, song,
 * looking for) is only shown after purchase.
 */
export interface CapsuleProfile {
  id: string;
  machineId: MachineId;
  firstName: string;
  age: number;
  emoji: string;
  hobbies: string[]; // 3-5 short tags for the public slot
  /** revealed only after purchase */
  fullName: string;
  bio: string;
  loveLanguage: string;
  lookingFor: string;
  song: string;
  /** colored gradient used as the "photo" after reveal */
  photoGradient: [string, string];
}

export interface SlotPlacement {
  machineId: MachineId;
  slot: number; // 0..15
  /** demo profile id, or "me" when the slot holds the user's own capsule */
  profileId: string;
}

export interface AuthUser {
  id: string;
  username: string;
  monedas: number;
  createdAt: number;
}

export interface OwnCapsule {
  emoji: string;
  firstName: string;
  age: number;
  hobbies: string[];
  bio: string;
}

export interface PurchaseRecord {
  profileId: string;
  machineId: MachineId;
  slot: number;
  boughtAt: number;
}

export interface ChatMessage {
  id: string;
  /** true if the message was sent by the demo user (us), false if "them" */
  mine: boolean;
  text: string;
  at: number;
}
/** The single vending machine of the app: a capsule machine for CDMX. */
export type MachineId = "cdmx";

/** Identifier of the orientation / seeking group a capsule belongs to. */
export type GenderCode =
  | "mujer-busca-hombre"
  | "hombre-busca-mujer"
  | "amistad"
  | "no-binario"
  | "lgbtq"
  | "mujer-busca-mujer"
  | "hombre-busca-hombre";

export interface GenderCodeInfo {
  /** stable id stored on a profile */
  code: GenderCode;
  /** short Spanish label, e.g. "Mujer busca hombre" */
  label: string;
  /** hex color used for the ring / badge */
  color: string;
}

/** Preset gradient used as the body of a capsule orb. */
export interface CapsulePreset {
  id: string;
  name: string;
  gradient: [string, string];
}

export interface VendingMachine {
  id: MachineId;
  name: string;
  subtitle: string;
  description: string;
  /** price per action in MXN (buy = place) */
  price: number;
  /** total slots on the single machine */
  slots: number;
}

/**
 * A capsule profile. Public data is shown before purchase (firstName, age,
 * alcaldía, hobbies, emoji, genderCode). Revealed data (bio, photoUrl, love
 * language, song, lookingFor) is only shown after purchase.
 */
export interface CapsuleProfile {
  id: string;
  machineId: MachineId;
  firstName: string;
  age: number;
  emoji: string;
  alcaldia: string;
  hobbies: string[];
  genderCode: GenderCode;
  /** custom gradient chosen when the capsule was placed */
  capsuleGradient: [string, string];
  /** revealed only after purchase */
  fullName: string;
  bio: string;
  loveLanguage: string;
  lookingFor: string;
  song: string;
  /** gift photo URL the owner left (revealed after purchase) */
  photoUrl: string;
}

export interface SlotPlacement {
  machineId: MachineId;
  slot: number;
  /** demo profile id, or "me" when the slot holds the user's own capsule */
  profileId: string;
}

export interface AuthUser {
  id: string;
  username: string;
  credits: number;
  createdAt: number;
}

export interface OwnCapsule {
  emoji: string;
  firstName: string;
  age: number;
  alcaldia: string;
  hobbies: string[];
  genderCode: GenderCode;
  capsuleGradient: [string, string];
  photoUrl: string;
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
  /** true if the message was sent by the user (us), false if "them" */
  mine: boolean;
  text: string;
  at: number;
}
export type MachineId =
  | "otaku"
  | "rock"
  | "fitness"
  | "artsy"
  | "entrepreneur";

export interface VendingMachine {
  id: MachineId;
  name: string;
  /** Japanese kanji shown on the neon sign */
  kanji: string;
  /** short label under the kanji (kept as "romaji" for the visual sign) */
  romaji: string;
  tagline: string;
  description: string;
  emoji: string;
  /** Tailwind gradient stops for the machine body */
  gradient: [string, string];
  /** Neon accent color (tailwind class fragment) */
  accent: "neon" | "cyan" | "purple" | "lime" | "pink";
  boxColor: string; // hex for capsule boxes
  /** hex for the neon sign ring/glow */
  signColor: string;
  /** price in Mexican pesos (MXN) shown on the coin slot */
  price: number;
  position: { x: number; z: number }; // 3D-ish position in lobby
  rotation: number; // y rotation in lobby
}

export interface Person {
  id: string;
  name: string;
  age: number;
  pronouns: string;
  location: string;
  machineId: MachineId;
  emoji: string;
  photo: string; // url (placeholder avatar)
  bio: string;
  interests: string[];
  hints: string[]; // personality/interest hints revealed before photo
  loveLanguage: string;
  lookingFor: string;
  song: string;
}

export interface Capsule {
  id: string;
  machineId: MachineId;
  personId: string;
  color: string; // capsule body color
  rarity: "common" | "rare" | "legendary";
}

export interface AuthUser {
  id: string;
  username: string;
  credits: number;
  createdAt: number;
}

export interface MatchRecord {
  personId: string;
  openedAt: number;
}
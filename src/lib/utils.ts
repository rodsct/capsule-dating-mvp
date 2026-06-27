import type { CapsuleProfile, MachineId } from "@/lib/types";

/** Format a price in Mexican pesos (MXN), e.g. 29 -> "$29 MXN". */
export function formatMXN(price: number): string {
  return `$${price} MXN`;
}

/** Initials string from a name. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Deterministic CSS linear-gradient() string for an avatar "photo". */
export function photoGradient([a, b]: [string, string]): string {
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

const DICEBEAR_STYLES = [
  "adventurer",
  "big-smile",
  "fun-emoji",
  "lorelei",
  "micah",
  "notionists",
  "personas",
  "thumbs",
] as const;

/** Deterministic Dicebear avatar URL — used as the revealed "photo". */
export function avatarUrl(seed: string, styleIndex = 0): string {
  const style = DICEBEAR_STYLES[styleIndex % DICEBEAR_STYLES.length];
  return `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(
    seed,
  )}&backgroundType=gradientLinear&backgroundColor=ff7ad9,ffd166,00f0ff,b6ff3a,9d4edd`;
}

export function classNames(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

/** Number of slots every machine shows (4x4 grid). */
export const SLOTS_PER_MACHINE = 16;

export function machinePortrait(p: CapsuleProfile): string {
  return `${p.emoji} ${p.firstName}, ${p.age}`;
}

export function machineIdLabel(id: MachineId): string {
  switch (id) {
    case "romance":
      return "Algo serio";
    case "amistad":
      return "Amistad primero";
    case "aventura":
      return "Aventura & salidas";
    case "conversacion":
      return "Conversación profunda";
    case "networking":
      return "Networking social";
  }
}
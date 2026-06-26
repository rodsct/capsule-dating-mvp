export function classNames(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

export function pickRandom<T>(arr: T[], seed?: number): T {
  if (seed !== undefined) {
    return arr[seed % arr.length];
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

export function rarityColor(rarity: "common" | "rare" | "legendary"): string {
  switch (rarity) {
    case "legendary":
      return "#b6ff3a";
    case "rare":
      return "#00f0ff";
    default:
      return "#ff7ad9";
  }
}

export function rarityLabel(rarity: "common" | "rare" | "legendary"): string {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}

const AVATAR_STYLES = [
  "adventurer",
  "big-smile",
  "fun-emoji",
  "lorelei",
  "micah",
  "notionists",
  "personas",
  "thumbs",
  "bottts",
] as const;

/** Deterministic Dicebear avatar URL from a seed string. */
export function avatarUrl(
  seed: string,
  styleIndex = 0,
  background = "ff2bd6,00f0ff",
): string {
  const style = AVATAR_STYLES[styleIndex % AVATAR_STYLES.length];
  return `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(
    seed,
  )}&backgroundGradient=0to1&backgroundColor=${background}&radius=8`;
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
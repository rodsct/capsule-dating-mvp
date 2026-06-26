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
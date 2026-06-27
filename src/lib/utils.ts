/** Format a price in Mexican pesos (MXN), e.g. 29 -> "$29 MXN". */
export function formatMXN(price: number): string {
  return `$${price} MXN`;
}

/** Deterministic CSS linear-gradient() string for a capsule orb body. */
export function capsuleGradient([a, b]: [string, string]): string {
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

export function classNames(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
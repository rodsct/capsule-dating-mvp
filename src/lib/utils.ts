/** Format a price in Mexican pesos (MXN), e.g. 29 -> "$29 MXN". */
export function formatMXN(price: number): string {
  return `$${price} MXN`;
}

/**
 * Format a slot index (0-based) as a 2-digit vending-machine selection code.
 * e.g. slot 0 -> "01", slot 11 -> "12".
 */
export function formatSlotCode(slotIndex: number): string {
  return String(slotIndex + 1).padStart(2, "0");
}

/**
 * Parse a typed keypad string into a 0-based slot index.
 * Accepts "1".."12" (with or without leading zero). Returns null when the
 * value is empty or out of range.
 */
export function parseSlotCode(typed: string): number | null {
  const trimmed = typed.replace(/^0+(?=\d)/, "");
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isInteger(num) || num < 1 || num > 12) return null;
  return num - 1;
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
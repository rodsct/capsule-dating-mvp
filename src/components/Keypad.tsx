"use client";

import { Delete, Loader2 } from "lucide-react";
import { classNames } from "@/lib/utils";

interface Props {
  /** Called with the key pressed ("1".."9", "0", or "clear"). */
  onKey: (k: string) => void;
  /** Optional big buy handler. When `buying` is true, button shows a spinner. */
  onBuy?: () => void;
  buying?: boolean;
  buyLabel?: string;
  buyDisabled?: boolean;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

/**
 * Realistic vending-machine numeric keypad (1-9, 0, clear/erase) plus an
 * optional big "Comprar" action button rendered underneath the keypad.
 */
export function Keypad({
  onKey,
  onBuy,
  buying = false,
  buyLabel = "Comprar",
  buyDisabled = false,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {KEYS.slice(0, 9).map((k) => (
          <KeyButton key={k} k={k} onClick={() => onKey(k)} />
        ))}
        <KeyButton k="clear" onClick={() => onKey("clear")} ariaLabel="Borrar">
          <Delete className="h-4 w-4" />
        </KeyButton>
        <KeyButton k="0" onClick={() => onKey("0")} />
        {/* spacer to keep 3x4 grid balanced */}
        <span aria-hidden className="block" />
      </div>

      {onBuy && (
        <button
          type="button"
          onClick={onBuy}
          disabled={buyDisabled || buying}
          className={classNames(
            "vm-buy-btn relative w-full overflow-hidden rounded-2xl px-5 py-4 text-center font-display text-base font-extrabold tracking-tight text-black transition",
            buyDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:brightness-110 active:scale-[0.98]",
          )}
          aria-label={buyLabel}
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            {buying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Comprando…
              </>
            ) : (
              buyLabel
            )}
          </span>
        </button>
      )}
    </div>
  );
}

function KeyButton({
  k,
  onClick,
  children,
  ariaLabel,
}: {
  k: string;
  onClick: () => void;
  children?: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? `Tecla ${k}`}
      className={classNames(
        "vm-key group relative grid h-12 select-none place-items-center rounded-xl border border-black/40 font-display text-lg font-bold text-white transition active:translate-y-0.5",
        k === "clear" && "text-cyber-neon",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(255,43,214,0.35), transparent 70%)",
        }}
      />
      <span className="relative z-10">{children ?? k}</span>
    </button>
  );
}
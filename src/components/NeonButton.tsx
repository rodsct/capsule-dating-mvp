"use client";

import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/utils";

type Variant = "neon" | "cyan" | "ghost";

const styles: Record<Variant, string> = {
  neon:
    "bg-cyber-neon text-black hover:shadow-neon hover:-translate-y-0.5 active:translate-y-0",
  cyan:
    "bg-cyber-cyan text-black hover:shadow-neon-cyan hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "glass text-white hover:bg-white/10 hover:border-white/20",
};

interface NeonButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  children: ReactNode;
}

export function NeonButton({
  variant = "neon",
  href,
  children,
  className,
  onClick,
  ...rest
}: NeonButtonProps) {
  const router = useRouter();
  const cls = classNames(
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full px-6 py-3 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <button
        className={cls}
        onClick={() => router.push(href)}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={cls}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
import { Coins } from "lucide-react";

export function Credits({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-cyber-lime/40 text-cyber-lime text-xs font-semibold"
      title="Monedas para cápsulas"
    >
      <Coins className="w-3.5 h-3.5" />
      <span>{count}</span>
    </div>
  );
}
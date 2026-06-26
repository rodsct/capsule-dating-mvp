import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid place-items-center text-center py-32 px-4">
      <Ghost className="w-12 h-12 text-cyber-neon mb-4" />
      <h1 className="font-display font-bold text-3xl mb-2">
        Esta cápsula se rodó lejos
      </h1>
      <p className="text-white/60 mb-6">
        La página que buscas no está en ninguna máquina.
      </p>
      <Link
        href="/lobby"
        className="px-6 py-3 rounded-full bg-cyber-neon text-black font-semibold hover:shadow-neon transition"
      >
        Volver a la sala
      </Link>
    </div>
  );
}
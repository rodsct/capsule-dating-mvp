import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid place-items-center px-4 py-28 text-center">
      <h1 className="font-display text-2xl font-bold neon-text">
        404 — Esta cápsula no existe
      </h1>
      <p className="mt-2 text-sm text-white/55">
        La página que buscas no está en ninguna máquina.
      </p>
      <Link
        href="/lobby"
        className="mt-5 rounded-full bg-cyber-neon px-5 py-2.5 text-sm font-bold text-black"
      >
        Volver a la sala
      </Link>
    </div>
  );
}
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-white/10 bg-black/30">
      <div className="mx-auto max-w-6xl px-4 py-8 text-[11px] leading-relaxed text-white/45 space-y-2">
        <p>
          <span className="font-semibold text-white/70">Capsule Dating</span> — MVP
          de demostración para la CDMX. Datos y sesiones simulados, almacenados
          solo en tu navegador (localStorage). No se realiza cobro real.
        </p>
        <p>
          Protección de datos personales: este demo cumple los principios de la{" "}
          <span className="text-white/65">
            LFPDPPP
          </span>{" "}
          (Ley Federal de Protección de Datos Personales en Posesión de los
          Particulares). No recopilamos información personal sensible; cualquier
          dato ingresado es local y temporal.
        </p>
        <p>
          Como simulación comercial, las referencias a precios y servicios son
          ficticias y se rigen por las normas de la{" "}
          <span className="text-white/65">PROFECO</span>{" "}
          (Procuraduría Federal del Consumidor) para información al consumidor.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          <Link href="/" className="hover:text-cyber-cyan transition">
            Inicio
          </Link>
          <Link href="/lobby" className="hover:text-cyber-cyan transition">
            Sala
          </Link>
          <Link href="/profile/me" className="hover:text-cyber-cyan transition">
            Mi perfil
          </Link>
          <span>
            Hecho con neón, cápsulas y demasiado café de olla en la CDMX.
          </span>
        </div>
      </div>
    </footer>
  );
}
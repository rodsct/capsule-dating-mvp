"use client";

import { Suspense, useState } from "react";
import { useRouter, useParams, useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Coins } from "lucide-react";
import type { MachineId, OwnCapsule } from "@/lib/types";
import { getMachine } from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { formatMXN } from "@/lib/utils";

const EMOJIS = ["🌷", "🎮", "🧗", "✍️", "🚀"];

function PlaceInner() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { user, ready, placeOwn } = useGame();

  const machine = getMachine(params.id as MachineId);
  const slot = Number(search.get("slot") ?? "0");

  const [emoji, setEmoji] = useState<string>(EMOJIS[0]);
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!machine) return notFound();
  if (ready && (!user || user.monedas < machine.price)) {
    return (
      <div className="mx-auto max-w-sm py-10 text-center">
        <Coins className="mx-auto h-8 w-8 text-cyber-neon" />
        <h1 className="mt-3 font-display text-lg font-bold">
          Monedas insuficientes
        </h1>
        <p className="mt-1 text-sm text-white/55">
          Publicar tu cápsula cuesta {formatMXN(machine.price)}. Añade monedas
          demo en tu perfil.
        </p>
        <Link
          href="/profile/me"
          className="mt-4 inline-block rounded-full bg-cyber-neon px-5 py-2.5 text-sm font-bold text-black"
        >
          + monedas
        </Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (firstName.trim().length < 2) {
      setError("Escribe tu nombre.");
      return;
    }
    const ageN = Number(age);
    if (!age || Number.isNaN(ageN) || ageN < 18 || ageN > 99) {
      setError("Escribe una edad válida (18-99).");
      return;
    }
    if (bio.trim().length < 10) {
      setError("Escribe una bio de al menos 10 caracteres.");
      return;
    }
    const cap: OwnCapsule = {
      emoji,
      firstName: firstName.trim(),
      age: ageN,
      hobbies: hobbies
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean)
        .slice(0, 5),
      bio: bio.trim(),
    };
    const ok = placeOwn(machine.id, slot, cap);
    if (!ok) {
      setError("No se pudo publicar (¿monedas insuficientes?).");
      return;
    }
    router.push(`/machine/${machine.id}`);
  };

  return (
    <div className="py-2">
      <Link
        href={`/machine/${machine.id}`}
        className="mb-4 inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a {machine.name}
      </Link>

      <h1
        className="font-display text-xl font-bold"
        style={{ color: machine.signColor }}
      >
        Publicar mi cápsula — espacio {slot + 1}
      </h1>
      <p className="mt-1 text-xs text-white/55">
        Tu cápsula aparecerá en {machine.name}. Cuesta {formatMXN(machine.price)}.
      </p>

      <form
        onSubmit={submit}
        className="glass mt-4 space-y-4 rounded-2xl p-5"
      >
        <div>
          <label className="mb-1.5 block text-xs text-white/60">Emoji</label>
          <div className="flex gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`grid h-10 w-10 place-items-center rounded-xl border text-lg transition ${
                  emoji === e
                    ? "border-cyber-neon bg-cyber-neon/15"
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <Field label="Nombre">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="p. ej. Alex"
            className="cdx-input"
          />
        </Field>

        <Field label="Edad">
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputMode="numeric"
            placeholder="p. ej. 27"
            className="cdx-input"
          />
        </Field>

        <Field label="Hobbies (separados por comas)">
          <input
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            placeholder="Café, Cine, Senderismo"
            className="cdx-input"
          />
        </Field>

        <Field label="Bio corta">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Cuéntale a tu match quién eres en un par de líneas."
            className="cdx-input resize-none"
          />
        </Field>

        {error && <p className="text-sm text-cyber-neon">{error}</p>}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyber-neon px-6 py-3 text-sm font-bold text-black hover:shadow-neon"
        >
          Publicar mi cápsula — {formatMXN(machine.price)}
        </button>
      </form>

      <style jsx>{`
        :global(.cdx-input) {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 0.75rem;
          padding: 0.6rem 0.9rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        :global(.cdx-input::placeholder) {
          color: rgba(255, 255, 255, 0.35);
        }
        :global(.cdx-input:focus) {
          border-color: ${machine.signColor};
          box-shadow: 0 0 0 2px ${machine.signColor}33;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-white/60">{label}</label>
      {children}
    </div>
  );
}

export default function PlacePage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-24 text-sm text-white/50">
          Cargando…
        </div>
      }
    >
      <PlaceInner />
    </Suspense>
  );
}
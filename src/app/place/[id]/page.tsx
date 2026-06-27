"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Coins } from "lucide-react";
import type { GenderCode, OwnCapsule } from "@/lib/types";
import {
  ALCALDIAS,
  CAPSULE_PRESETS,
  GENDER_CODES,
  MACHINE,
  genderInfo,
} from "@/data/mock-data";
import { useGame } from "@/lib/auth";
import { formatMXN } from "@/lib/utils";

const EMOJIS = ["🌷", "🎮", "🧗", "✍️", "🚀", "🎧", "🌙", "☕"];

export const PHOTO_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1502082553048-f009c3712969?w=900&q=80",
  "https://images.unsplash.com/photo-1490649415897-3b2c0c8e2f81?w=900&q=80",
];

function PlaceInner() {
  const search = useSearchParams();
  const router = useRouter();
  const { user, ready, placeOwn } = useGame();

  const slot = Number(search.get("slot") ?? "0");

  const [emoji, setEmoji] = useState<string>(EMOJIS[0]);
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [alcaldia, setAlcaldia] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [genderCode, setGenderCode] = useState<GenderCode>("amistad");
  const [presetId, setPresetId] = useState<string>(CAPSULE_PRESETS[0].id);
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (ready && (!user || user.monedas < MACHINE.price)) {
    return (
      <div className="mx-auto max-w-sm py-10 text-center">
        <Coins className="mx-auto h-8 w-8 text-cyber-neon" />
        <h1 className="mt-3 font-display text-lg font-bold">
          Monedas insuficientes
        </h1>
        <p className="mt-1 text-sm text-white/55">
          Publicar tu cápsula cuesta {formatMXN(MACHINE.price)}. Añade monedas
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
    if (!alcaldia) {
      setError("Selecciona tu alcaldía.");
      return;
    }
    const hobbiesList = hobbies
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    if (hobbiesList.length < 2) {
      setError("Escribe al menos 2 gustos / intereses.");
      return;
    }
    if (!photoUrl.trim() || !/^https?:\/\//i.test(photoUrl.trim())) {
      setError("Pega una URL de imagen válida (https://…).");
      return;
    }
    if (bio.trim().length < 10) {
      setError("Escribe una bio de al menos 10 caracteres.");
      return;
    }
    const preset =
      CAPSULE_PRESETS.find((p) => p.id === presetId) ?? CAPSULE_PRESETS[0];
    const cap: OwnCapsule = {
      emoji,
      firstName: firstName.trim(),
      age: ageN,
      alcaldia,
      hobbies: hobbiesList.slice(0, 5),
      genderCode,
      capsuleGradient: preset.gradient,
      photoUrl: photoUrl.trim(),
      bio: bio.trim(),
    };
    const ok = placeOwn(MACHINE.id, slot, cap);
    if (!ok) {
      setError("No se pudo publicar (¿monedas insuficientes?).");
      return;
    }
    router.push("/");
  };

  return (
    <div className="py-2">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a la máquina
      </Link>

      <h1 className="font-display text-xl font-bold">
        Coloca tu cápsula — espacio {slot + 1}
      </h1>
      <p className="mt-1 text-xs text-white/55">
        Tu cápsula aparecerá en la máquina de la CDMX. Cuesta{" "}
        {formatMXN(MACHINE.price)}.
      </p>

      <form onSubmit={submit} className="glass mt-4 space-y-4 rounded-2xl p-5">
        <div>
          <label className="mb-1.5 block text-xs text-white/60">Emoji</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`grid h-9 w-9 place-items-center rounded-xl border text-lg transition ${
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

        <Field label="Nombre (requerido)">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="p. ej. Alex"
            className="cdx-input"
          />
        </Field>

        <Field label="Edad (requerido)">
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputMode="numeric"
            placeholder="18-99"
            className="cdx-input"
          />
        </Field>

        <Field label="Alcaldía (requerido)">
          <select
            value={alcaldia}
            onChange={(e) => setAlcaldia(e.target.value)}
            className="cdx-input"
          >
            <option value="">Elige tu alcaldía…</option>
            {ALCALDIAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Gustos / intereses (separados por comas, min. 2)">
          <input
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            placeholder="Café, Cine, Senderismo"
            className="cdx-input"
          />
        </Field>

        <Field label="Género / orientación / buscas (requerido)">
          <select
            value={genderCode}
            onChange={(e) => setGenderCode(e.target.value as GenderCode)}
            className="cdx-input"
          >
            {GENDER_CODES.map((g) => (
              <option key={g.code} value={g.code}>
                {g.label}
              </option>
            ))}
          </select>
          <span
            className="mt-1.5 inline-flex items-center gap-1.5 text-[10px]"
            style={{ color: genderInfo(genderCode)?.color }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: genderInfo(genderCode)?.color }}
            />
            Aro de tu cápsula en este color
          </span>
        </Field>

        <Field label="Color de la cápsula">
          <div className="grid grid-cols-6 gap-2">
            {CAPSULE_PRESETS.map((p) => {
              const active = p.id === presetId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPresetId(p.id)}
                  aria-label={p.name}
                  className={`aspect-square rounded-full border-2 transition ${
                    active
                      ? "border-white scale-105"
                      : "border-white/15 hover:border-white/40"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`,
                  }}
                />
              );
            })}
          </div>
        </Field>

        <Field label="Foto / regalo (URL de imagen, requerido)">
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder={PHOTO_PLACEHOLDERS[0]}
            className="cdx-input"
          />
          <p className="mt-1 text-[10px] text-white/40">
            Pega la URL de una imagen (p. ej. de Unsplash). Se revela solo cuando
            alguien compre tu cápsula.
          </p>
        </Field>

        <Field label="Bio corta (min. 10 caracteres)">
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
          Publicar mi cápsula — {formatMXN(MACHINE.price)}
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
          border-color: #ff2bd6;
          box-shadow: 0 0 0 2px rgba(255, 43, 214, 0.2);
        }
        :global(.cdx-input option) {
          color: black;
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
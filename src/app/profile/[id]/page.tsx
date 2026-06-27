"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Music2, CheckCircle2 } from "lucide-react";
import { getProfile, getMachine } from "@/data/mock-data";
import { photoGradient } from "@/lib/utils";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const profile = getProfile(params.id);
  if (!profile) return notFound();
  const machine = getMachine(profile.machineId);

  return (
    <div className="py-2 space-y-4">
      <Link
        href="/chats"
        className="inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      <div
        className="relative w-full overflow-hidden rounded-2xl border border-white/10"
        style={{
          background: photoGradient(profile.photoGradient),
          height: 240,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg/85 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="text-2xl font-display font-bold">
            {profile.emoji} {profile.fullName}
          </div>
          <div className="text-xs text-white/70">
            {profile.age} años
            {machine && ` · ${machine.name}`}
          </div>
        </div>
      </div>

      <p className="text-sm text-white/75">{profile.bio}</p>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-wider text-white/45">
          Hobbies
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.hobbies.map((h) => (
            <span key={h} className="glass rounded-full px-3 py-1 text-xs">
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Info label="Canción" value={profile.song} icon={Music2} />
        <Info label="Lenguaje del amor" value={profile.loveLanguage} icon={Heart} />
        <Info label="Busca" value={profile.lookingFor} icon={CheckCircle2} full />
      </div>

      <Link
        href={`/chat/${profile.id}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyber-cyan px-6 py-3 text-sm font-bold text-black hover:shadow-neon-cyan"
      >
        <MessageCircle className="h-4 w-4" /> Enviar mensaje
      </Link>
    </div>
  );
}

function Info({
  label,
  value,
  icon: Icon,
  full,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  full?: boolean;
}) {
  return (
    <div className={`glass rounded-xl p-3 ${full ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm text-white/90">{value}</div>
    </div>
  );
}
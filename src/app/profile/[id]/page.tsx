"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Music2,
  CheckCircle2,
  MapPin,
  ImageIcon,
} from "lucide-react";
import { getProfile, genderInfo } from "@/data/mock-data";
import { classNames } from "@/lib/utils";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const profile = getProfile(params.id);
  if (!profile) return notFound();
  const ring = genderInfo(profile.genderCode)?.color ?? "#ff2bd6";

  return (
    <div className="py-2 space-y-4">
      <Link
        href="/chats"
        className="inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a chats
      </Link>

      {/* Gift photo */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photoUrl}
          alt={`Regalo de ${profile.firstName}`}
          className="h-60 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg/90 via-cyber-bg/10 to-transparent" />
        <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white/80">
          <ImageIcon className="h-3 w-3" /> Regalo
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <div className="text-2xl font-display font-bold">
            {profile.emoji} {profile.fullName}
          </div>
          <div className="mt-0.5 inline-flex items-center gap-2 text-xs text-white/80">
            <span>{profile.age} años</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {profile.alcaldia}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: `${ring}33`, color: ring }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: ring }}
              />
              {genderInfo(profile.genderCode)?.label}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-white/80">{profile.bio}</p>

      {/* Interests */}
      <div>
        <div className="mb-2 text-[10px] uppercase tracking-wider text-white/45">
          Intereses
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
    <div className={classNames("glass rounded-xl p-3", full && "sm:col-span-2")}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm text-white/90">{value}</div>
    </div>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LobbyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return (
    <div className="grid place-items-center py-32 text-sm text-white/50">
      Cargando…
    </div>
  );
}
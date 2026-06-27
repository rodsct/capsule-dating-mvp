"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/lobby");
  }, [router]);
  return (
    <div className="grid place-items-center py-32 text-sm text-white/50">
      Cargando…
    </div>
  );
}
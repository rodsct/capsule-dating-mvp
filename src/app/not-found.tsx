import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid place-items-center text-center py-32 px-4">
      <Ghost className="w-12 h-12 text-cyber-neon mb-4" />
      <h1 className="font-display font-bold text-3xl mb-2">
        This capsule rolled away
      </h1>
      <p className="text-white/60 mb-6">
        The page you&apos;re looking for isn&apos;t in any machine.
      </p>
      <Link
        href="/lobby"
        className="px-6 py-3 rounded-full bg-cyber-neon text-black font-semibold hover:shadow-neon transition"
      >
        Back to the lobby
      </Link>
    </div>
  );
}
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { NeonButton } from "@/components/NeonButton";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/lobby";
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Enter your username.");
      return;
    }
    const u = login(username);
    if (!u) {
      setError("No account found. Register first — every username is fair game.");
      return;
    }
    router.push(next);
  };

  return (
    <div className="relative mx-auto max-w-md px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-7 scanlines"
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-cyber-neon" />
          <span className="text-xs uppercase tracking-widest text-white/40">
            Capsule Dating
          </span>
        </div>
        <h1 className="font-display font-bold text-2xl mb-1">Welcome back</h1>
        <p className="text-white/60 text-sm mb-6">
          Log in with your username. (Mock auth — stored in your browser only.)
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. neonfox"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyber-neon focus:shadow-neon transition"
            />
          </div>
          {error && <p className="text-sm text-cyber-neon">{error}</p>}
          <NeonButton type="submit" className="w-full justify-center">
            <LogIn className="w-4 h-4" /> Log in
          </NeonButton>
        </form>

        <p className="text-center text-sm text-white/50 mt-5">
          New here?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="text-cyber-cyan underline"
          >
            Create a free account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-32 text-white/50 text-sm">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Client-side wrapper exposing the Auth.js (NextAuth v5) session to all
 * components via `useSession()`. Rendered once near the root of the app.
 */
export function AppSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
import { DefaultSession } from "next-auth";

/**
 * Type augmentation so the authenticated session exposes the user `id`,
 * alongside the default `name`, `email` and `image` fields provided by
 * Auth.js (NextAuth v5).
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
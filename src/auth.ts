import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Provider priority is Google OAuth. A permissive Credentials provider is
 * kept as a username-only fallback for the MVP demo.
 *
 * Required environment variables (set them in production / Dokploy UI):
 *   AUTH_SECRET        — random secret, at least 32 chars
 *   AUTH_GOOGLE_ID     — Google OAuth client id
 *   AUTH_GOOGLE_SECRET — Google OAuth client secret
 *   NEXTAUTH_URL       — canonical app URL (https://...)
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    // During `next build` the auth module is evaluated for route collection.
    // Use a placeholder so the build completes; runtime will throw if the
    // variable is still missing.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return `placeholder-${name}`;
    }
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        "Set it in Dokploy or in a .env.local file before starting the app.",
    );
  }
  return value;
}

const GOOGLE_ID = requireEnv("AUTH_GOOGLE_ID");
const GOOGLE_SECRET = requireEnv("AUTH_GOOGLE_SECRET");
const AUTH_SECRET = requireEnv("AUTH_SECRET");

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: AUTH_SECRET,
  providers: [
    Google({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    Credentials({
      credentials: { username: {} },
      authorize: (credentials) => {
        const username =
          typeof credentials?.username === "string"
            ? credentials.username.trim()
            : "";
        if (!username) return null;
        return {
          id: `local:${username}`,
          name: username,
          email: `${username}@local`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: ({ user, account }) => {
      if (account?.provider === "google") return !!user;
      if (account?.provider === "credentials") return !!user;
      return true;
    },
    jwt: ({ token, user, account, profile }) => {
      if (user) {
        const id = (user as { id?: string }).id;
        if (typeof id === "string" && id) token.id = id;
      }
      if (account?.provider === "google") {
        const sub = (profile as unknown as { sub?: string } | undefined)?.sub;
        if (typeof sub === "string" && sub) token.id = sub;
      }
      return token;
    },
    session: ({ session, token }) => {
      const id = token.id;
      if (session.user && typeof id === "string" && id) {
        session.user.id = id;
      }
      return session;
    },
  },
});

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { AppSessionProvider } from "@/components/SessionProvider";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Capsule Dating — encuentra tu match en una máquina de cápsulas",
  description:
    "Recorre el callejón de máquinas expendedoras con perfiles. Deja $29 MXN, abre una cápsula y revela a tu match.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={spaceGrotesk.variable}>
      <body
        className={`${spaceGrotesk.className} min-h-screen text-white selection:bg-cyber-neon/60`}
      >
        <AppSessionProvider>
          <Header />
          <main className="mx-auto max-w-3xl px-4 pb-24 pt-4 sm:pb-10">
            {children}
          </main>
          <Navigation />
        </AppSessionProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CursorSpotlight } from "@/components/CursorSpotlight";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Capsule Dating — find your match in a vending machine",
  description:
    "A neon-drenched Tokyo-arcade dating playground. Wander the vending-machine street, pick a themed machine, drop a coin, crack open a capsule, reveal your match.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body
        className={`${spaceGrotesk.className} min-h-screen text-white selection:bg-cyber-neon/60`}
      >
        <CursorSpotlight />
        <Navbar />
        <main className="relative min-h-[calc(100vh-64px)]">{children}</main>
      </body>
    </html>
  );
}
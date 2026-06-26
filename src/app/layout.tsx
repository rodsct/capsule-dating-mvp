import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CursorSpotlight } from "@/components/CursorSpotlight";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Capsule Dating — encuentra tu match en una máquinas de cápsulas",
  description:
    "Una sala de citas arcade estilo callejón neón de máquinas expendedora en la CDMX. Recorre el callejón, elige una máquina temática, deja una moneda, abre una cápsula y revela tu match.",
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
        <CursorSpotlight />
        <Navbar />
        <main className="relative min-h-[calc(100vh-64px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
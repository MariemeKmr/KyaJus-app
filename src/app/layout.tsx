import type { Metadata } from "next";
import { Outfit, Shrikhand } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const shrikhand = Shrikhand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-shrikhand",
});

export const metadata: Metadata = {
  title: "KyaJus",
  description: "Vente de jus frais et packs, avec gestion des commandes et de la finance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${outfit.variable} ${shrikhand.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "the new al-khīmist — de plomb à or",
    template: "%s — the new al-khīmist",
  },
  description:
    "the new al-khīmist — les nouveaux alchimistes. une maison de seuil, invoquée au moment précis où il faut basculer. de plomb à or.",
  metadataBase: new URL("https://thenewalkhimist.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-noir text-ecru font-sans antialiased selection:bg-or/30 selection:text-ecru">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

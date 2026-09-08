import type { Metadata } from "next";
import { Amiri, Cormorant_Garamond, Fraunces, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

// Bolder display serif reserved for the "al-khīmist" wordmark lockup,
// matching the brand's official logo artwork.
const wordmark = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-wordmark",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

// Arabic calligraphic mark used by ArabicMark ("الجديد" riding the orbit path).
const arabic = Amiri({
  subsets: ["arabic"],
  weight: ["700"],
  variable: "--font-arabic",
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
    <html
      lang="fr"
      className={`${serif.variable} ${wordmark.variable} ${sans.variable} ${arabic.variable}`}
    >
      <body className="bg-noir text-ecru font-sans antialiased selection:bg-or/30 selection:text-ecru">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

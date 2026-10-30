import type { Metadata } from "next";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AmbientParticles } from "@/components/ambient-particles";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kültürel Miras Arşivi | Türkiye'nin Dijital Mirası",
  description: "Türkiye'nin tarihi, mimari ve sözlü kültür mirasını dijital ortamda belgeleyen ve koruyan topluluk platformu.",
  openGraph: {
    title: "Kültürel Miras Arşivi | Türkiye'nin Dijital Mirası",
    description: "Türkiye'nin tarihi, mimari ve sözlü kültür mirasını dijital ortamda belgeleyen ve koruyan topluluk platformu.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kültürel Miras Arşivi",
      },
    ],
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfairDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AmbientParticles />
        <div className="relative z-[2] flex min-h-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}

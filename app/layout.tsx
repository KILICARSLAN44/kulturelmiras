import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

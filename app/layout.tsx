import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LivePlayer from "@/components/layout/LivePlayer";

export const metadata: Metadata = {
  title: {
    default: "Radio HD FM - Radio Humanité et Développement | 96.00 FM",
    template: "%s | Radio HD FM",
  },
  description:
    "Radio Humanité et Développement — « La voix des communautés au cœur de l'action humanitaire, la voix des humanitaires au service des communautés ». 96.00 FM Bamako. Émissions, journaux en français, arabe et bambara.",
  keywords: ["radio mali", "humanitaire", "bamako", "96 FM", "HD FM"],
  openGraph: {
    type: "website",
    locale: "fr_ML",
    url: "https://hdfm-mali.org",
    siteName: "Radio HD FM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <LivePlayer />
      </body>
    </html>
  );
}

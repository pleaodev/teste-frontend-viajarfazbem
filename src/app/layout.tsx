import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer, ScrollToTop, LenisProvider, ThemeProvider } from "@/components/common";
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
  title: {
    template: "%s | ViajarFazBem",
    default: "ViajarFazBem - Filmes e Séries",
  },
  description: "Sua plataforma para viajar nos melhores filmes e séries. Descubra lançamentos, clássicos e muito mais.",
  keywords: ["filmes", "séries", "cinema", "streaming", "viajarfazbem"],
  authors: [{ name: "ViajarFazBem" }],
  openGraph: {
    title: "ViajarFazBem - Filmes e Séries",
    description: "Sua plataforma para viajar nos melhores filmes e séries. Descubra lançamentos, clássicos e muito mais.",
    url: "https://viajarfazbem.com",
    siteName: "ViajarFazBem",
    images: [
      {
        url: "/images/brands/logo-viajar-faz-bem-portal.svg",
        width: 800,
        height: 600,
        alt: "ViajarFazBem Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ViajarFazBem - Filmes e Séries",
    description: "Sua plataforma para viajar nos melhores filmes e séries.",
    images: ["/images/brands/logo-viajar-faz-bem-portal.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            <Header />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

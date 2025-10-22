
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: "Arcadia News - Global News from Every Corner",
  description: "Multilingual news platform covering global events from 21 countries with blockchain-powered engagement system.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Arcadia News - Global News Platform",
    description: "Discover news from around the world in multiple languages",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white antialiased`}>
        <Providers>
          <Navbar />
          <main className="relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

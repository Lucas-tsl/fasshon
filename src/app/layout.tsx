import type { Metadata } from "next";
import Link from "next/link";
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
  title: {
    default: "Boutique",
    template: "%s · Boutique",
  },
  description: "Bougies, brumes et coffrets gourmands.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 px-4 py-4 dark:border-white/10">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="font-semibold">
              Boutique
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/produits" className="hover:underline">
                Catalogue
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}

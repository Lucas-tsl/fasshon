import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CartLink } from "@/components/CartLink";

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
    default: "Fasshon",
    template: "%s · Fasshon",
  },
  description: "Concept store multi-marques — beauté, soins naturels, bien-être et senteurs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <header className="border-b border-border px-4 py-4">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Fasshon
              </Link>
              <nav className="flex gap-4 text-sm">
                <Link href="/produits" className="hover:underline">
                  Catalogue
                </Link>
                <CartLink />
              </nav>
            </div>
          </header>
          <main className="flex flex-1 flex-col">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}

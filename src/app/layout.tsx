import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CartLink } from "@/components/CartLink";
import { BrandsMenu } from "@/components/BrandsMenu";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Catalogue, stock et panier changent en continu (admin, commandes) : pas
// d'intérêt à figer quoi que ce soit en statique au build. Ça évite aussi
// d'avoir besoin de DATABASE_URL au moment du build sur Vercel.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Fasshon",
    template: "%s · Fasshon",
  },
  description: "Concept store multi-marques — beauté, soins naturels, bien-être et senteurs.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <div className="sticky top-0 z-30">
            <AnnouncementBar />
            <header className="border-b border-border bg-background/85 px-4 py-4 backdrop-blur-sm">
              <div className="mx-auto flex max-w-5xl items-center justify-between">
                <Link href="/" className="text-lg font-semibold tracking-tight">
                  Fasshon
                </Link>
                <nav className="flex items-center gap-5 text-sm">
                  <Link href="/produits" className="transition-colors hover:text-accent">
                    Catalogue
                  </Link>
                  <BrandsMenu brands={brands} />
                  <CartLink />
                </nav>
              </div>
            </header>
          </div>
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

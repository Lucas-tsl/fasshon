import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CartLink } from "@/components/CartLink";
import { BrandsMenu } from "@/components/BrandsMenu";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { AccountIcon } from "@/components/AccountIcon";
import { SearchBar } from "@/components/SearchBar";
import { MobileMenu } from "@/components/MobileMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
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
  const [brands, user] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    getCurrentUser(),
  ]);

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <div className="sticky top-0 z-30">
            <AnnouncementBar />
            <header className="border-b border-border bg-background/90 px-4 py-3 backdrop-blur-sm">
              <div className="mx-auto flex max-w-6xl items-center justify-between">
                <div className="flex items-center gap-6">
                  <MobileMenu brands={brands} />
                  <Link href="/" className="font-display text-2xl tracking-wide">
                    Fasshon
                  </Link>
                  <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                    <Link href="/produits" className="transition-colors hover:text-accent">
                      Catalogue
                    </Link>
                    <BrandsMenu brands={brands} />
                    <Link href="/blog" className="transition-colors hover:text-accent">
                      Blog
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-3">
                  <SearchBar />
                  <AccountIcon connected={!!user} />
                  <CartLink />
                </div>
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

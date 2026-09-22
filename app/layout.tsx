import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CinematicAmbientLight } from "@/components/ui/CinematicAmbientLight";
import { StoreInitializer } from "@/components/providers/StoreInitializer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_STORE_URL || "https://wealthstyle.luxury"),
  title: {
    default: "WEALTHY STYLE | Haute Luxury Accessories — Sunglasses, Shoes, Watches",
    template: "%s | WEALTHY STYLE Luxury",
  },
  description:
    "Discover WEALTHY STYLE: The premier luxury fashion maison for titanium sunglasses, handcrafted Italian leather shoes, and Swiss automatic timepieces.",
  keywords: [
    "WEALTHY STYLE",
    "WS luxury",
    "luxury sunglasses",
    "Italian shoes",
    "automatic watches",
    "mens luxury fashion",
    "womens luxury accessories",
    "polarized eyewear",
    "Goodyear welted shoes",
    "tourbillon watches",
  ],
  authors: [{ name: "WEALTHY STYLE Atelier" }],
  creator: "WEALTHY STYLE",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/icon.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wealthstyle.luxury",
    title: "WEALTHY STYLE | Haute Luxury Accessories",
    description:
      "Handcrafted sunglasses, artisanal Italian leather shoes, and Swiss automatic timepieces.",
    siteName: "WEALTHY STYLE",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "WEALTHY STYLE Luxury Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WEALTHY STYLE | Haute Luxury Accessories",
    description:
      "Handcrafted sunglasses, artisanal Italian leather shoes, and Swiss automatic timepieces.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <StoreInitializer />
          <CinematicAmbientLight />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

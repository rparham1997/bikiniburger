import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { MobileOrderButton } from "@/components/mobile-order-button";
import { Navbar } from "@/components/navbar";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "Bikini Burger | Ardmore's Number #1 Burger Spot",
    template: "%s | Bikini Burger"
  },
  description: "Fresh burgers, fries, shakes and good vibes at Bikini Burger in Ardmore, PA.",
  openGraph: {
    title: "Bikini Burger",
    description: site.tagline,
    url: site.siteUrl,
    siteName: "Bikini Burger",
    images: [
      {
        url: "/images/bikini-burger-logo.png",
        width: 1200,
        height: 1200,
        alt: "Bikini Burger logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Bikini Burger",
    description: site.tagline
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <MobileOrderButton />
        </CartProvider>
      </body>
    </html>
  );
}

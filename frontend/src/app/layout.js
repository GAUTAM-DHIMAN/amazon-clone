import { Inter } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import { CartSyncBanner } from "@/components/CartSyncBanner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Amazon Clone — Shop Online for Electronics, Fashion & More",
  description:
    "Demo e-commerce storefront built with Next.js. Shop electronics, fashion, home & kitchen, beauty and more at great prices.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#131921",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-screen overflow-x-hidden antialiased`}
        style={{
          fontFamily: "var(--font-inter), 'Amazon Ember', Arial, sans-serif",
        }}
      >
        <AuthProvider>
          <CartProvider>
            <Suspense
              fallback={
                <div className="min-h-[100px] bg-[#131921]" aria-hidden />
              }
            >
              <Navbar />
            </Suspense>

            <CartSyncBanner />

            <main className="min-h-[calc(100vh-5rem)] w-full min-w-0 pt-[90px] sm:min-h-[calc(100vh-6rem)]">
              {children}
            </main>

            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import { CartSyncBanner } from "@/components/CartSyncBanner";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amazon Clone",
  description: "Demo e-commerce storefront built with Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#131921",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden antialiased`}
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

            {/* 👇 IMPORTANT FIX FOR FIXED NAVBAR */}
            <main className="min-h-[calc(100vh-5rem)] w-full min-w-0 pb-8 pt-[90px] sm:min-h-[calc(100vh-6rem)] sm:pb-10">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

// 1. IMPORT ANALYTICS DI SINI
import { Analytics } from "@vercel/analytics/react"; // Untuk Vercel Analytics

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RYV.studio | Elevated Everyday Comfort",
  description: "A modern hijab brand that embraces elegance through simplicity.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-[#FDFBF7] text-neutral-900 antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>

        {/* 2. TARUH KOMPONEN ANALYTICS DI PALING BAWAH (SEBELUM PENUTUP BODY) */}
        
        {/* Aktifkan ini untuk Vercel Analytics */}
        <Analytics /> 

        {/* Aktifkan ini untuk Google Analytics (Ganti tulisan G-XYZ dengan ID asli lu nanti) */}
        {/* <GoogleAnalytics gaId="G-XYZ" /> */}
      </body>
    </html>
  );
}
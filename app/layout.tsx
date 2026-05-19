import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

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
          
          {/* PINDAHKAN DRAWER KE SINI (PALING BAWAH) */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
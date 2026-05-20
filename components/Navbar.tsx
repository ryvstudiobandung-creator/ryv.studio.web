"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
// 1. IMPORT useRouter
import { usePathname, useRouter } from "next/navigation"; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 2. STATE UNTUK SEARCH
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { cartItems, toggleCart } = useCart();
  const pathname = usePathname();
  const router = useRouter(); // 3. INISIALISASI ROUTER

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll(); 
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. FUNGSI UNTUK HANDLE SUBMIT SEARCH
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isHomepage = pathname === "/";
  const useWhiteText = isHomepage && !isScrolled && !isMobileMenuOpen && !isSearchOpen;
  
  const textColorClass = useWhiteText ? "text-white" : "text-neutral-900";
  const hoverColorClass = useWhiteText ? "hover:text-neutral-300" : "hover:text-neutral-500";
  const cartBadgeClass = useWhiteText ? "bg-white text-neutral-900" : "bg-neutral-900 text-white";

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled || isMobileMenuOpen || isSearchOpen // Pastikan background putih kalau search kebuka
            ? "bg-[#FDFBF7]/90 backdrop-blur-md border-neutral-200 py-3" 
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* KIRI: Navigasi Desktop (Lebih ringkas & padat) */}
          <nav className={`hidden space-x-8 text-[11px] font-semibold uppercase tracking-[0.15em] md:flex ${textColorClass}`}>
            <Link href="/shop" className={`transition-colors ${hoverColorClass}`}>Catalog</Link>
            <Link href="/contact" className={`transition-colors ${hoverColorClass}`}>Contact</Link>
          </nav>

          {/* TENGAH: Tombol Hamburger Mobile */}
          <div className={`md:hidden ${textColorClass}`}>
            <button 
              aria-label="Menu" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              )}
            </button>
          </div>

          {/* TENGAH: LOGO Utama (Klik untuk Home) */}
          <div className="flex flex-1 justify-center">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-serif text-2xl tracking-[0.1em] uppercase transition-colors ${textColorClass}`}
            >
              RYV
            </Link>
          </div>

          {/* KANAN: Ikon Utility */}
          <div className={`flex items-center space-x-5 md:space-x-6 ${(isScrolled || isSearchOpen) ? "text-neutral-900" : textColorClass}`}>
            
            {/* 5. UBAH TOMBOL SEARCH INI */}
            <button 
              aria-label="Search" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`transition-colors ${hoverColorClass}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z" />
              </svg>
            </button>
            
            <button onClick={toggleCart} className={`relative transition-colors ${hoverColorClass}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375 0 1 1-.75 0 .375 0 0 1 .75 0Zm7.5 0a.375 0 1 1-.75 0 .375 0 0 1 .75 0Z" />
              </svg>
              {totalItemsInCart > 0 && (
                <span className={`absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-medium transition-colors ${cartBadgeClass}`}>
                  {totalItemsInCart}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 6. TAMBAHAN UI SEARCH BAR DROPDOWN (DI BAWAH HEADER) */}
        <div className={`absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-neutral-200 transition-all duration-300 overflow-hidden ${isSearchOpen ? 'max-h-24 py-4 opacity-100' : 'max-h-0 py-0 opacity-0 border-transparent'}`}>
          <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search products, materials, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-900 focus:outline-none placeholder:text-neutral-400"
            />
            <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-4 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors">Close</button>
          </form>
        </div>
      </header>

      {/* LACI MENU UNTUK MOBILE (Dibuat lebih intuitif) */}
      <div 
        className={`fixed inset-0 z-40 bg-[#FDFBF7] pt-28 px-6 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col space-y-8 text-2xl font-serif tracking-wide text-neutral-900">
          {/* Menyediakan link Home eksplisit khusus pengguna smartphone */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Catalog</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
        </nav>
        
        <div className="mt-12 pt-12 border-t border-neutral-200/60 flex flex-col space-y-6">
          <Link href="/shipping" className="text-xs uppercase tracking-widest text-neutral-400">Shipping Info</Link>
          <Link href="/returns" className="text-xs uppercase tracking-widest text-neutral-400">Return Policy</Link>
        </div>
      </div>
    </>
  );
}
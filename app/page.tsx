"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Link ini masih dipertahankan buat jaga-jaga kalau nanti butuh
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Fungsi untuk scroll mulus ke bagian Bestsellers
  const scrollToBestsellers = () => {
    const section = document.getElementById("bestsellers");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
        <img
          src="https://fcxczdweabcwcbrlfkyb.supabase.co/storage/v1/object/public/products/BANNER%20(1).png"
          alt="RYV Studio Editorial Campaign"
          className="h-full w-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <span className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-200">Now Available</span>
          <h1 className="mb-6 font-serif text-4xl font-light tracking-wide sm:text-6xl md:text-7xl drop-shadow-md">Elegance in Every Drape.</h1>
          <p className="mb-8 max-w-md text-sm font-light tracking-wide text-neutral-200 drop-shadow-md">Koleksi Pashmina premium yang dirancang khusus untuk kenyamanan dan keanggunan siluet harian Anda.</p>
          
          {/* Tombol ini diubah jadi button dengan onClick */}
          <button 
            onClick={scrollToBestsellers} 
            className="border border-white bg-white/10 px-8 py-3 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-900"
          >
            Explore The Collection
          </button>
        </div>
      </section>

      {/* 2. PRODUCT LIST SECTION */}
      {/* Tambahkan id="bestsellers" di sini */}
      <section id="bestsellers" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full bg-[#FDFBF7]">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-2xl font-serif tracking-wide text-neutral-900">The Bestsellers</h2>
          <div className="mt-2 h-[1px] w-12 bg-neutral-300"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            // Simple Loading State
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-200 aspect-[3/4] rounded-sm" />
            ))
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                material={product.material}
                price={product.price}
                imageUrl={product.image_url}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
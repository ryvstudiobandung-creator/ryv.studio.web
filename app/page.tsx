"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [igFeeds, setIgFeeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Default true buat cegah Hydration Mismatch

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (data) setProducts(data);
    };

    const fetchIgFeeds = async () => {
      const { data, error } = await supabase.from('instagram_feeds').select('*').limit(4);
      if (data && !error) {
        setIgFeeds(data);
      }
    };

    Promise.all([fetchProducts(), fetchIgFeeds()]).then(() => {
      setIsLoading(false); // Setelah data dari DB turun, baru ganti state ke false
    });
  }, []);

  const scrollToBestsellers = () => {
    const section = document.getElementById("bestsellers");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getEmbedUrl = (url: any) => {
    // 1. Ganti return "" menjadi return undefined
    if (!url || typeof url !== 'string') return undefined; 
    
    try {
      const baseUrl = String(url).split('?')[ 0 ];
      const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      return `${cleanUrl}/embed/`;
    } catch (error) {
      // 2. Ganti return "" menjadi return undefined
      return undefined; 
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
          
          <button 
            onClick={scrollToBestsellers} 
            className="border border-white bg-white/10 px-8 py-3 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-900"
          >
            Explore The Collection
          </button>
        </div>
      </section>

      {/* 2. PRODUCT LIST SECTION */}
      <section id="bestsellers" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full bg-[#FDFBF7]">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-2xl font-serif tracking-wide text-neutral-900">The Bestsellers</h2>
          <div className="mt-2 h-[1px] w-12 bg-neutral-300"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
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

      {/* 3. SHOP BY CATEGORY SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full bg-[#FDFBF7]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/shop?category=Pashmina" className="group relative h-[250px] md:h-[400px] overflow-hidden rounded-sm bg-neutral-100">
            <img src="https://images.unsplash.com/photo-1589465885857-44edb59bbff2?q=80&w=800&auto=format&fit=crop" alt="Shop Pashmina" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-2">Shop</span>
              <h3 className="font-serif text-3xl tracking-wide">Pashmina</h3>
            </div>
          </Link>

          <Link href="/shop?category=Instant" className="group relative h-[250px] md:h-[400px] overflow-hidden rounded-sm bg-neutral-100">
            <img src="https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=800&auto=format&fit=crop" alt="Shop Instant" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-2">Shop</span>
              <h3 className="font-serif text-3xl tracking-wide">Instant</h3>
            </div>
          </Link>

          <Link href="/shop?category=Inner" className="group relative h-[250px] md:h-[400px] overflow-hidden rounded-sm bg-neutral-100">
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop" alt="Shop Inner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-2">Shop</span>
              <h3 className="font-serif text-3xl tracking-wide">Inner</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. BRAND PHILOSOPHY SECTION */}
      <section className="w-full bg-neutral-900 text-white py-24 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">The Promise</span>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide leading-tight">
            Elevating your everyday through mindful craftsmanship.
          </h2>
          <p className="text-sm font-light text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            Di RYV studio, kami memadukan siluet abadi dengan material premium. Setiap koleksi dirancang untuk memberikan kenyamanan maksimal tanpa mengorbankan keanggunan gaya personal Anda.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 mt-8 border-t border-white/10 text-left">
            <div>
              <div className="h-px w-8 bg-white mb-6"></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">Premium Materials</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">Kami hanya memilih kain berkualitas butik yang jatuh sempurna dan nyaman di kulit sepanjang hari.</p>
            </div>
            <div>
              <div className="h-px w-8 bg-white mb-6"></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">Refined Tailoring</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">Jahitan tepi presisi yang dikerjakan oleh tangan-tangan terampil untuk ketahanan jangka panjang.</p>
            </div>
            <div>
              <div className="h-px w-8 bg-white mb-6"></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">Timeless Design</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">Palet warna dan potongan elegan yang mudah dipadupadankan, tak lekang oleh perputaran tren.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NATIVE INSTAGRAM EMBED SECTION */}
      <section className="w-full bg-[#FDFBF7] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-3">As Seen On</span>
            <h2 className="font-serif text-3xl text-neutral-900 tracking-wide mb-4">@ryv.studio_</h2>
            <a 
              href="https://instagram.com/ryv.studio_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-medium uppercase tracking-widest text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
            >
              Follow Our Journey
            </a>
          </div>

          {/* Logic Render Berdasarkan Status Loading & Data */}
          {isLoading ? (
            // Skeleton Loading: Tampil selagi data ditarik, mencegah Hydration Error
            <div className="flex flex-wrap justify-center gap-6">
              {[ 1, 2, 3, 4 ].map((i) => (
                <div key={i} className="w-full max-w-[320px] bg-neutral-200 animate-pulse rounded-sm h-[480px]"></div>
              ))}
            </div>
          ) : igFeeds.length > 0 ? (
            // Layout Flex Auto-Center: Berapapun jumlahnya bakal ditengah
            <div className="flex flex-wrap justify-center gap-6">
              {igFeeds.map((feed) => (
                <div key={feed.id} className="w-full max-w-[320px] overflow-hidden bg-white border border-neutral-200 rounded-sm shadow-sm h-[480px] flex-shrink-0">
                  <iframe
                    src={getEmbedUrl(feed.post_url)}
                    className="w-full h-full border-0 m-0 p-0 bg-white"
                    scrolling="no"
                    allow="encrypted-media"
                  ></iframe>
                </div>
              ))}
            </div>
          ) : (
            // Fallback kalau data kosong
            <div className="w-full py-12 text-center text-neutral-400 text-sm italic">
              Belum ada postingan Instagram yang ditampilkan.
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
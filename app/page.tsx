"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [igFeeds, setIgFeeds] = useState<any[]>([]);
  
  // State baru khusus buat Hero Banner
  const [heroContent, setHeroContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
    };

    const fetchIgFeeds = async () => {
      const { data, error } = await supabase.from('instagram_feeds').select('*').limit(4);
      if (data && !error) setIgFeeds(data);
    };

    // Tarik data konfigurasi Banner dari database
    const fetchHeroContent = async () => {
      const { data, error } = await supabase.from('hero_settings').select('*').eq('id', 1).single();
      if (data && !error) setHeroContent(data);
    };

    // Jangan lupa ditambahin ke dalam Promise array ini dengan spasi [ ]
    Promise.all([ fetchProducts(), fetchIgFeeds(), fetchHeroContent() ]).then(() => setIsLoading(false));
  }, []);

  const scrollToBestsellers = () => {
    const section = document.getElementById("bestsellers");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const getEmbedUrl = (url: any) => {
    if (!url || typeof url !== 'string') return undefined;
    try {
      const baseUrl = String(url).split('?')[ 0 ];
      const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      return `${cleanUrl}/embed/`;
    } catch (error) {
      return undefined;
    }
  };

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          // Tarik gambar dari DB, kalau kosong pakai gambar bawaan
          src={heroContent?.banner_image || "https://fcxczdweabcwcbrlfkyb.supabase.co/storage/v1/object/public/products/BANNER%20(1).png"}
          alt="RYV Studio Editorial Campaign"
          className="h-full w-full object-cover object-center"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white"
        >
          {/* Tarik data teks dari DB, dengan fallback tulisan lama */}
          <span className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-200">
            {heroContent?.subtitle || "Now Available"}
          </span>
          <h1 className="mb-6 font-serif text-4xl font-light tracking-wide sm:text-6xl md:text-7xl drop-shadow-md">
            {heroContent?.title || "Elegance in Every Drape."}
          </h1>
          <p className="mb-8 max-w-md text-sm font-light tracking-wide text-neutral-200 drop-shadow-md">
            {heroContent?.description || "Koleksi Pashmina premium yang dirancang khusus untuk kenyamanan dan keanggunan siluet harian Anda."}
          </p>
          
          <button 
            onClick={scrollToBestsellers} 
            className="border border-white bg-white/10 px-8 py-3 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-900"
          >
            Explore The Collection
          </button>
        </motion.div>
      </section>

      {/* 2. PRODUCT LIST SECTION */}
      <section id="bestsellers" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full bg-[#FDFBF7]">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
          className="flex flex-col items-center mb-12 text-center"
        >
          <h2 className="text-2xl font-serif tracking-wide text-neutral-900">The Bestsellers</h2>
          <div className="mt-2 h-[1px] w-12 bg-neutral-300"></div>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-200 aspect-[3/4] rounded-sm" />
            ))
          ) : (
            products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <ProductCard 
                  id={product.id}
                  name={product.name}
                  material={product.material}
                  price={product.price}
                  imageUrl={product.image_url}
                />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full bg-[#FDFBF7]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[ "Pashmina", "Instant", "Inner" ].map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <Link href={`/shop?category=${category}`} className="group relative block h-[250px] md:h-[400px] overflow-hidden rounded-sm bg-neutral-100">
                <img 
                  src={
                    category === "Pashmina" ? "https://images.unsplash.com/photo-1589465885857-44edb59bbff2?q=80&w=800&auto=format&fit=crop" :
                    category === "Instant" ? "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=800&auto=format&fit=crop" :
                    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop"
                  } 
                  alt={`Shop ${category}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-2">Shop</span>
                  <h3 className="font-serif text-3xl tracking-wide">{category}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. BRAND PHILOSOPHY SECTION */}
      <section className="w-full bg-neutral-900 text-white py-24 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">The Promise</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide leading-tight mt-4">
              Elevating your everyday through mindful craftsmanship.
            </h2>
            <p className="text-sm font-light text-neutral-300 leading-relaxed max-w-2xl mx-auto mt-6">
              At RYV.studio, we intertwine timeless silhouettes with premium fabrics. Each collection is meticulously crafted to deliver uncompromising comfort while celebrating the grace of your personal style.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 mt-8 border-t border-white/10 text-left">
            {[
              { title: "Premium Materials", desc: "Boutique-quality fabrics chosen for their flawless drape, offering a gentle and breathable embrace against your skin from dawn to dusk." },
              { title: "Refined Tailoring", desc: "Impeccable edge stitching executed by skilled artisans, guaranteeing structural integrity and longevity for your everyday wear." },
              { title: "Timeless Design", desc: "Sophisticated color palettes and versatile cuts that effortlessly elevate your wardrobe, gracefully outlasting the cycle of fleeting trends." }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <div className="h-px w-8 bg-white mb-6"></div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">{item.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NATIVE INSTAGRAM EMBED SECTION */}
      <section className="w-full bg-[#FDFBF7] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="flex flex-col items-center justify-center text-center mb-12">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-3">As Seen On</span>
            <h2 className="font-serif text-3xl text-neutral-900 tracking-wide mb-4">@ryv.studio_</h2>
            <a href="https://instagram.com/ryv.studio" target="_blank" rel="noopener noreferrer" className="text-xs font-medium uppercase tracking-widest text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors">
              Follow Our Journey
            </a>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-wrap justify-center gap-6">
              {[ 1, 2, 3, 4 ].map((i) => (
                <div key={i} className="w-full max-w-[320px] bg-neutral-200 animate-pulse rounded-sm h-[480px]"></div>
              ))}
            </div>
          ) : igFeeds.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {igFeeds.map((feed, i) => (
                <motion.div 
                  key={feed.id} 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="w-full max-w-[320px] overflow-hidden bg-white border border-neutral-200 rounded-sm shadow-sm h-[480px] flex-shrink-0"
                >
                  <iframe
                    src={getEmbedUrl(feed.post_url) || undefined}
                    className="w-full h-full border-0 m-0 p-0 bg-white"
                    scrolling="no"
                    allow="encrypted-media"
                  ></iframe>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="w-full py-12 text-center text-neutral-400 text-sm italic">
              Belum ada postingan Instagram yang ditampilkan.
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
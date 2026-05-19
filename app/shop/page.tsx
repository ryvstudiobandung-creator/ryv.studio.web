"use client";

import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";

const CATEGORIES = ["All", "Pashmina", "Instant", "Inner"];
const MATERIALS = ["All", "Premium Ceruty", "Premium Chiffon", "Rayon Airflow", "Airy Flow"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low"];

export default function ShopPage() {
  // 1. State baru untuk nampung data dari Database
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Buat efek loading

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMaterial, setActiveMaterial] = useState("All");
  const [sortOption, setSortOption] = useState("Featured");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // 2. Fungsi untuk narik data dari API pas halaman pertama kali dibuka
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal narik data:", error);
      } finally {
        setIsLoading(false); // Matiin loading kalau udah selesai (berhasil/gagal)
      }
    };

    fetchProducts();
  }, []);

  // 3. Logika Filter (sekarang pakai state 'products' dari database)
  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === "All" || product.category === activeCategory;
    const matchMaterial = activeMaterial === "All" || product.material === activeMaterial;
    return matchCategory && matchMaterial;
  });

  // 4. Logika Sorting
  const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Price: Low to High") return a.price - b.price;
    if (sortOption === "Price: High to Low") return b.price - a.price;
    return 0; 
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20" style={{ colorScheme: 'light' }}>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center border-b border-neutral-200/60">
        <h1 className="font-serif text-4xl font-light tracking-wide text-neutral-900 mb-4">Shop The Collection</h1>
        <p className="text-sm font-light text-neutral-500 max-w-xl mx-auto">
          Temukan siluet yang menyempurnakan gaya harian Anda. Filter berdasarkan tipe atau material untuk menemukan pasangan hijab terbaikmu.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-x-12 gap-y-10">
          
          {/* KOLOM KIRI: FILTER SIDEBAR */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-900 mb-5">Category</h3>
                <ul className="space-y-3 text-sm font-light text-neutral-500">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <button 
                        onClick={() => setActiveCategory(cat)}
                        className={`transition-colors text-left w-full ${activeCategory === cat ? 'text-neutral-900 font-medium' : 'hover:text-neutral-900'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-900">Material</h3>
                  {activeMaterial !== "All" && (
                    <button onClick={() => setActiveMaterial("All")} className="text-[9px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900">Reset</button>
                  )}
                </div>
                <ul className="space-y-3 text-sm font-light text-neutral-500">
                  {MATERIALS.filter(m => m !== "All").map((mat) => (
                    <li key={mat}>
                      <button 
                        onClick={() => setActiveMaterial(mat)}
                        className={`transition-colors text-left w-full ${activeMaterial === mat ? 'text-neutral-900 font-medium' : 'hover:text-neutral-900'}`}
                      >
                        {mat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* KOLOM KANAN: PRODUCT GRID */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between relative z-10">
              <span className="text-xs text-neutral-500">
                {isLoading ? "Memuat produk..." : `${sortedAndFilteredProducts.length} ${sortedAndFilteredProducts.length === 1 ? 'Product' : 'Products'}`}
              </span>
              
              <div className="relative">
                <button 
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-900 focus:outline-none hover:text-neutral-500 transition-colors"
                >
                  <span>Sort By: {sortOption}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-3 w-3 transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-neutral-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 rounded-sm">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortOption(opt);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest transition-colors hover:bg-neutral-50 ${
                          sortOption === opt ? 'text-neutral-900 font-bold bg-neutral-50/50' : 'text-neutral-500'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tampilan saat masih Loading */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-3 xl:gap-x-8">
                {[0,1,2].map((skeleton) => (
                  <div key={skeleton} className="animate-pulse flex flex-col">
                    <div className="aspect-[3/4] w-full bg-neutral-200 rounded-sm"></div>
                    <div className="mt-4 h-3 w-3/4 bg-neutral-200 rounded-sm"></div>
                    <div className="mt-2 h-2 w-1/2 bg-neutral-200 rounded-sm"></div>
                    <div className="mt-3 h-3 w-1/4 bg-neutral-200 rounded-sm"></div>
                  </div>
                ))}
              </div>
            ) : sortedAndFilteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-3 xl:gap-x-8">
                {sortedAndFilteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    material={product.material}
                    price={product.price}
                    imageUrl={product.image_url} /* Disesuaikan dengan nama kolom di database */
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-neutral-200 rounded-sm">
                <p className="text-sm font-light text-neutral-500 mb-2">No products match your current filters.</p>
                <button 
                  onClick={() => { setActiveCategory("All"); setActiveMaterial("All"); }}
                  className="text-xs font-medium uppercase tracking-widest text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-500 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
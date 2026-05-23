"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useCart } from "../../../context/CartContext"; // IMPORT CONTEXT-NYA

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  
  // AMBIL FUNGSI ASLI DARI CONTEXT
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        setProduct(data);
        setSelectedVariant({
          name: "Default",
          image: data.image_url
        });
      }
      setIsLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.name === "Default") {
      alert("Silakan pilih warna terlebih dahulu!");
      return;
    }
    
    // FORMAT DATA SESUAI CartItem DI CartContext
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedVariant.name,
      image: selectedVariant.image,
      quantity: 1,
    });
  };

  if (isLoading) return <div className="text-center pt-40">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* GAMBAR UTAMA (Dibuat Sticky biar mewah) */}
        <div className="md:sticky md:top-32 aspect-[3/4] bg-neutral-100 overflow-hidden rounded-sm w-full mb-8 md:mb-0 relative z-0">
           <img 
              src={selectedVariant?.image || product?.image_url || "/fallback-image.jpg"} 
              className="w-full h-full object-cover transition-opacity duration-300" 
              alt={`${product?.name} - ${selectedVariant?.name}`} 
            />
        </div>

        {/* INFORMASI PRODUK */}
        <div className="flex flex-col py-4">
          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-neutral-900">{product.name}</h1>
          <p className="text-lg font-medium mb-8 text-neutral-600">Rp {product.price.toLocaleString('id-ID')}</p>
          
          <div className="mb-10">
            <h4 className="text-[10px] uppercase tracking-widest mb-4 text-neutral-900 font-semibold">
              Color: <span className="font-normal text-neutral-500">{selectedVariant?.name !== "Default" ? selectedVariant?.name : "Select a color"}</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(product?.color_variants) && product.color_variants.map((variant: any) => (
              <button 
                key={variant.name}
                onClick={() => setSelectedVariant(variant)}
                className={`px-5 py-2.5 text-[11px] uppercase tracking-wider border transition-all duration-300 ${
                  selectedVariant?.name === variant.name 
                    ? 'border-neutral-900 bg-neutral-900 text-white' 
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-900'
                }`}
              >
                {variant.name}
              </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              !selectedVariant || selectedVariant.name === "Default"
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-lg'
            }`}
          >
            {selectedVariant && selectedVariant.name !== "Default" ? "Add to Cart" : "Select a Color"}
          </button>

          {/* DESKRIPSI TAMBAHAN */}
          <div className="mt-12 space-y-6 border-t border-neutral-200 pt-8 text-sm font-light text-neutral-500 leading-relaxed">
            {/* Tampilkan paragraf dari DB, kalau kosong pakai teks default */}
            <p>
              {product.description?.paragraph || 
               `Didesain dengan material ${product.material} yang jatuh sempurna, dan mudah dibentuk. Siluet elegan untuk kenyamanan sepanjang hari.`}
            </p>
            
            <ul className="list-disc pl-5 space-y-1">
              {/* Cek apakah ada bullets di DB dan jumlahnya lebih dari 0 */}
              {product.description?.bullets && product.description.bullets.length > 0 ? (
                product.description.bullets.map((bullet: string, idx: number) => (
                  <li key={idx}>{bullet}</li>
                ))
              ) : (
                /* Fallback kalau bullets di DB kosong */
                <>
                  <li>Material: {product.material}</li>
                  <li>Finishing: Jahit tepi rapi standar butik</li>
                  <li>Warna foto mungkin sedikit berbeda karena pencahayaan</li>
                </>
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
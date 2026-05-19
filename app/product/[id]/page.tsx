"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useCart } from "../../../context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams(); // Mengambil ID dari URL
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single(); // Ambil 1 data saja yang ID-nya cocok

      if (data) setProduct(data);
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Foto Produk */}
          <div className="aspect-[3/4] bg-neutral-200 rounded-sm overflow-hidden">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info Produk */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl font-light text-neutral-900 mb-2">{product.name}</h1>
            <p className="text-lg font-medium text-neutral-900 mb-6">Rp {product.price.toLocaleString('id-ID')}</p>
            
            <div className="text-sm font-light text-neutral-600 mb-8 leading-relaxed">
              <h4 className="font-semibold text-neutral-900 uppercase tracking-widest text-[10px] mb-2">Description</h4>
              {product.description}
            </div>

            <button 
              onClick={() => addToCart({ ...product, quantity: 1, color: product.colors })}
              className="w-full bg-neutral-900 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
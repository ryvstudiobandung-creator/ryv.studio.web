import Link from "next/link";
import Image from "next/image"; // Pake ini biar loading gambar lebih cepet & efisien

export default function ProductCard({ id, name, material, price, imageUrl }: any) {
  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="aspect-[3/4] w-full bg-neutral-100 rounded-sm overflow-hidden mb-4 relative">
        <img 
          src={imageUrl || "/fallback-image.jpg"} // Fallback biar gak error kalau image kosong
          alt={name} 
          loading="lazy"
          className="w-full h-full object-cover" 
        />
      </div>
      <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide group-hover:text-neutral-500 transition-colors">{name}</h3>
      <p className="text-[10px] text-neutral-500 uppercase mt-0.5">{material}</p>
      <p className="text-xs font-bold text-neutral-900 mt-2">Rp {price.toLocaleString('id-ID')}</p>
    </Link>
  );
}
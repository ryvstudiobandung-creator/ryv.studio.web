import Link from "next/link";

export default function ProductCard({ id, name, material, price, imageUrl }: any) {
  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="aspect-[3/4] w-full bg-neutral-200 rounded-sm overflow-hidden mb-4">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide group-hover:text-neutral-500 transition-colors">{name}</h3>
      <p className="text-[10px] text-neutral-500 uppercase mt-0.5">{material}</p>
      <p className="text-xs font-bold text-neutral-900 mt-2">Rp {price.toLocaleString('id-ID')}</p>
    </Link>
  );
}
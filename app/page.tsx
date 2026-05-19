import Link from "next/link";
import ProductCard from "../components/ProductCard";

// Menggunakan placeholder image yang lebih stabil (via Placehold.co) untuk development
const DUMMY_PRODUCTS = [
  {
    id: "diora-shawl",
    name: "Diora Shawl",
    material: "Premium Chiffon",
    price: 75000,
    imageUrl: "https://placehold.co/600x800/e2e8f0/64748b?text=Diora+Shawl", 
  },
  {
    id: "callie-instant",
    name: "Callie Instant",
    material: "Airy Flow",
    price: 89000,
    imageUrl: "https://placehold.co/600x800/e2e8f0/64748b?text=Callie+Instant",
  },
  {
    id: "twilla-inner",
    name: "Twilla Inner",
    material: "Rayon Airflow",
    price: 44000,
    imageUrl: "https://placehold.co/600x800/e2e8f0/64748b?text=Twilla+Inner",
  },
  {
    id: "premium-ceruty",
    name: "Pashmina Malay",
    material: "Premium Ceruty",
    price: 65000,
    imageUrl: "https://placehold.co/600x800/e2e8f0/64748b?text=Pashmina+Malay",
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]"> {/* Pastikan background global terang */}
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
        <img
          src="https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=1964&auto=format&fit=crop"
          alt="RYV Studio Editorial Campaign"
          className="h-full w-full object-cover object-center opacity-80" // Pakai opacity alih-alih brightness agar lebih stabil
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <span className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-200">Now Available</span>
          <h1 className="mb-6 font-serif text-4xl font-light tracking-wide sm:text-6xl md:text-7xl drop-shadow-md">Elegance in Every Drape.</h1>
          <p className="mb-8 max-w-md text-sm font-light tracking-wide text-neutral-200 drop-shadow-md">Koleksi Pashmina premium yang dirancang khusus untuk kenyamanan dan keanggunan siluet harian Anda.</p>
          <Link href="/shop" className="border border-white bg-white/10 px-8 py-3 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-900">Explore The Collection</Link>
        </div>
      </section>

      {/* 2. PRODUCT LIST SECTION */}
      {/* Memaksa background putih tulang agar tidak terpengaruh dark mode browser/sistem */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full bg-[#FDFBF7]">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-2xl font-serif tracking-wide text-neutral-900">The Bestsellers</h2>
          <div className="mt-2 h-[1px] w-12 bg-neutral-300"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {DUMMY_PRODUCTS.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              material={product.material}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
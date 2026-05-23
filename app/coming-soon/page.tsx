import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      
      {/* Elemen Dekoratif Background (Opsional biar gak terlalu sepi) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-100 rounded-full blur-3xl opacity-50 -z-10"></div>

      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-6">RYV.studio Updates</span>
      
      <h1 className="font-serif text-4xl sm:text-5xl font-light text-neutral-900 mb-6 tracking-wide">
        Almost There.
      </h1>
      
      <p className="text-sm font-light text-neutral-500 max-w-md mb-10 leading-relaxed">
        Fitur ini akan segera hadir! Kami sedang bekerja keras untuk memberikan pengalaman terbaik bagi Anda. Nantikan pembaruan terbaru dari RYV.studio.
      </p>
      
      <Link 
        href="/shop" 
        className="border border-neutral-900 bg-neutral-900 text-white px-8 py-4 text-xs font-medium uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 transition-all duration-300"
      >
        Return to Catalog
      </Link>
    </div>
  );
}
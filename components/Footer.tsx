import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF8F5] border-t border-neutral-200/60 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 gap-x-8 text-left">
          
          {/* Kolom 1 */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl tracking-[0.1em] uppercase text-neutral-900">RYV.studio</h3>
            <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-xs">
              A modern hijab brand that embraces elegance through simplicity. Setiap helai dirancang khusus untuk kenyamanan dan kesempurnaan siluet harian Anda.
            </p>
          </div>

          {/* Kolom 2: Navigasi Koleksi (Diperbarui) */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Collections</h4>
            <Link href="/shop" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Shop All</Link>
            <Link href="/shop" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Pashmina</Link>
            <Link href="/shop" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Instant Shawl</Link>
            <Link href="/shop" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Inner Hijab</Link>
          </div>

          {/* Kolom 3: Layanan Pelanggan */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Customer Care</h4>
            <Link href="/shipping" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Shipping Info</Link>
            <Link href="/returns" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Return Policy</Link>
            <Link href="/contact" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Contact Us</Link>
            <Link href="/fabric-lab" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">Fabric Lab</Link>
          </div>

          {/* Kolom 4 */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Our Marketplace</h4>
            <p className="text-xs font-light text-neutral-500">Lebih nyaman bertransaksi lewat aplikasi favoritmu?</p>
            <a 
              href="https://shopee.co.id/ryv.studio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center border border-neutral-300 px-4 py-2.5 rounded-sm bg-white text-xs font-medium text-neutral-700 tracking-wider uppercase hover:border-neutral-900 hover:text-neutral-900 transition-all duration-300"
            >
              Shopee Official
            </a>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200/40 flex flex-col sm:flex-row items-center justify-between gap-y-4">
          <p className="text-[11px] font-light text-neutral-400">
            &copy; {currentYear} RYV.studio. All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-xs text-neutral-500">
            <a href="https://www.instagram.com/ryv.studio_/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">Instagram</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">TikTok</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
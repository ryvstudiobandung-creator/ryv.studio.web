export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-light tracking-wide text-neutral-900 mb-12 text-center">Return & Exchange Policy</h1>
        
        <div className="space-y-10 text-sm font-light text-neutral-600 leading-relaxed">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-4">Kebijakan Retur</h2>
            <p>RYV.studio berkomitmen menjaga kualitas setiap produk. Jika Anda menerima produk cacat atau salah kirim, kami menerima pengembalian atau penukaran dalam batas waktu <strong>3 hari</strong> sejak barang diterima berdasarkan laporan resi kurir.</p>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-4">Syarat & Ketentuan</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Produk harus dalam keadaan baru, belum dicuci, tidak wangi parfum/deterjen, dan tidak ada noda riasan.</li>
              <li>Tag merek dan kemasan orisinal harus masih terpasang sempurna.</li>
              <li>Wajib menyertakan <strong>video unboxing</strong> tanpa jeda sebagai bukti klaim.</li>
              <li>Penukaran warna atau model karena perubahan pikiran (change of mind) tidak diperkenankan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-4">Proses Klaim</h2>
            <p>Silakan hubungi tim Customer Care kami melalui halaman Contact atau WhatsApp resmi dengan melampirkan nomor pesanan dan video unboxing. Tim kami akan memandu Anda untuk proses pengiriman kembali produk ke warehouse kami.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
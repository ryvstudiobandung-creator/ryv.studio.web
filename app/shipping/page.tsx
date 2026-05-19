export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-light tracking-wide text-neutral-900 mb-12 text-center">Shipping Information</h1>
        
        <div className="space-y-10 text-sm font-light text-neutral-600 leading-relaxed">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-4">Processing Time</h2>
            <p>Semua pesanan akan diproses dan dikirim dalam waktu 1-2 hari kerja (Senin - Jumat, tidak termasuk hari libur nasional). Pesanan yang masuk setelah pukul 14:00 WIB akan diproses pada hari kerja berikutnya.</p>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-4">Domestic Shipping</h2>
            <p className="mb-4">Kami menyediakan pengiriman ke seluruh wilayah Indonesia melalui partner logistik terpercaya. Estimasi waktu pengiriman bervariasi tergantung lokasi:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Regular:</strong> 3-5 hari kerja.</li>
              <li><strong>Express:</strong> 1-2 hari kerja.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-4">Order Tracking</h2>
            <p>Setelah pesanan Anda dikirim, kami akan mengirimkan nomor resi melalui email atau WhatsApp. Anda dapat melacak status pengiriman secara berkala melalui situs web partner kurir kami.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
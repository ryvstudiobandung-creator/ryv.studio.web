"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-4xl font-light tracking-wide text-neutral-900 mb-4">Contact Us</h1>
        <p className="text-sm font-light text-neutral-500 mb-12">Punya pertanyaan seputar produk atau pesanan Anda? Tim kami siap membantu.</p>
        
        <div className="space-y-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors"
            />
          </div>
          <input 
            type="text" 
            placeholder="Order Number (Optional)" 
            className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors"
          />
          <textarea 
            placeholder="Message" 
            rows={5}
            className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors resize-none"
          ></textarea>
          
          <button 
            type="button"
            onClick={() => alert("Terima kasih! Pesan Anda telah terkirim.")}
            className="w-full bg-neutral-900 py-4 text-xs font-medium uppercase tracking-widest text-white transition-all hover:bg-neutral-800"
          >
            Send Message
          </button>
        </div>

        <div className="mt-16 pt-12 border-t border-neutral-200/60">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Direct Inquiry</p>
          <a href="mailto:hello@ryv.studio" className="text-sm font-medium text-neutral-900 hover:text-neutral-500 transition-colors">hello@ryv.studio</a>
        </div>
      </div>
    </div>
  );
}
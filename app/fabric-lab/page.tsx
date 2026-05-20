"use client";

export default function FabricLabPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-4xl font-light tracking-wide text-neutral-900 mb-6">Fabric Lab</h1>
        <p className="text-sm font-light text-neutral-500 mb-16 max-w-2xl mx-auto leading-relaxed">
          Di RYV.studio, kami percaya bahwa kenyamanan dimulai dari material yang tepat. Temukan karakteristik setiap kain yang kami gunakan untuk menyempurnakan siluet harian Anda.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-100 rounded-sm overflow-hidden">
              <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop" alt="Premium Chiffon" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-serif text-2xl text-neutral-900">Premium Chiffon</h3>
            <p className="text-sm font-light text-neutral-600 leading-relaxed">
              Kain berserat halus yang melayang ringan. Sangat mudah dibentuk (drape) dan memberikan tampilan elegan yang formal namun tetap nyaman.
            </p>
          </div>

          <div className="space-y-4">
            <div className="aspect-square bg-neutral-100 rounded-sm overflow-hidden">
              <img src="https://images.unsplash.com/photo-1605027628030-9bb6f83535e6?q=80&w=800&auto=format&fit=crop" alt="Rayon Airflow" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-serif text-2xl text-neutral-900">Rayon Airflow</h3>
            <p className="text-sm font-light text-neutral-600 leading-relaxed">
              Material ironless (bebas setrika) dengan tekstur crinkle yang khas. Sangat menyerap keringat dan ideal untuk aktivitas kasual sepanjang hari.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
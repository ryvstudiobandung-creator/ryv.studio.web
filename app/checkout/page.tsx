"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFBF7] px-4 text-center">
        <h2 className="font-serif text-2xl font-light text-neutral-900">Your cart is empty.</h2>
        <p className="mt-4 text-sm font-light text-neutral-500">Please add some items before checking out.</p>
        <Link href="/shop" className="mt-8 bg-neutral-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-white transition-all hover:bg-neutral-800">
          Back To Shop
        </Link>
      </div>
    );
  }

  return (
    // TAMBAHAN PENTING: style={{ colorScheme: 'light' }} memaksa browser berhenti pakai warna Dark Mode di input
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20" style={{ colorScheme: 'light' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-x-16 gap-y-12">
          
          {/* KOLOM KIRI: FORMULIR */}
          <div className="flex-1 space-y-12">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-8">Contact Information</h2>
              {/* Tambahan !text-neutral-900 dan placeholder:!text-neutral-400 (pakai tanda seru untuk !important) */}
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-8">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
                <input type="text" placeholder="Last Name" className="border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
              </div>
              <input type="text" placeholder="Address" className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
                <input type="text" placeholder="Postal Code" className="border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
              </div>
              <input type="tel" placeholder="Phone Number" className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-6">Shipping Method</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between border border-neutral-200 p-4 rounded-sm cursor-pointer hover:border-neutral-400 transition-colors bg-white/50">
                  <div className="flex items-center">
                    <input type="radio" name="shipping" className="h-4 w-4 accent-neutral-900" defaultChecked />
                    <span className="ml-3 text-sm font-medium !text-neutral-900">Regular Shipping (3-5 Days)</span>
                  </div>
                  <span className="text-sm font-bold !text-neutral-900">Free</span>
                </label>
                <label className="flex items-center justify-between border border-neutral-200 p-4 rounded-sm cursor-pointer hover:border-neutral-400 transition-colors bg-white/50">
                  <div className="flex items-center">
                    <input type="radio" name="shipping" className="h-4 w-4 accent-neutral-900" />
                    <span className="ml-3 text-sm font-medium !text-neutral-900">Express Shipping (1-2 Days)</span>
                  </div>
                  <span className="text-sm font-bold !text-neutral-900">Rp 25.000</span>
                </label>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: ORDER SUMMARY */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-32 bg-[#FAF8F5] p-8 border border-neutral-200 rounded-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className="h-20 w-16 bg-neutral-200 flex-shrink-0 overflow-hidden rounded-sm border border-neutral-200">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold !text-neutral-900 uppercase tracking-wide">{item.name}</h4>
                        <p className="text-[10px] !text-neutral-500 uppercase mt-1">{item.color} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold !text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-neutral-200 pt-6">
                <div className="flex justify-between text-xs font-medium !text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium !text-neutral-600">
                  <span>Shipping</span>
                  <span>Calculated in next step</span>
                </div>
                <div className="flex justify-between text-sm font-bold !text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Est.</span>
                  <span className="text-lg">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button 
                onClick={() => alert("Proceeding to payment gateway...")}
                className="w-full bg-neutral-900 mt-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-neutral-800"
              >
                Place Order
              </button>
              
              <p className="mt-4 text-[10px] !text-neutral-500 text-center leading-relaxed">
                By placing your order, you agree to RYV.studio's Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
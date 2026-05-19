"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <>
      {/* 1. OVERLAY GELAP */}
      <div 
        style={{ zIndex: 9998 }} 
        className={`fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleCart}
      />

      {/* 2. LACI KERANJANG */}
      <div 
        style={{ zIndex: 9999 }} 
        className={`fixed top-0 right-0 flex h-screen w-full max-w-sm flex-col bg-[#FDFBF7] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header Laci */}
        <div className="flex items-center justify-between border-b border-neutral-200/60 px-6 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">Your Cart</h2>
          <button onClick={toggleCart} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Isi Keranjang */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm font-light text-neutral-500 mb-6">Your cart is looking a little empty.</p>
              <button 
                onClick={toggleCart} 
                className="border-b border-neutral-900 text-xs font-medium uppercase tracking-widest text-neutral-900 pb-1 hover:text-neutral-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.color}`} className="flex space-x-4 border-b border-neutral-100 pb-4">
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-neutral-100 rounded-sm">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900">{item.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Color: {item.color}</p>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-medium text-neutral-900">{formatPrice(item.price)}</p>
                      <button onClick={() => removeFromCart(item.id, item.color)} className="text-[10px] text-neutral-400 uppercase tracking-widest hover:text-red-500 transition-colors underline underline-offset-4">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Laci */}
        {cartItems.length > 0 && (
          <div className="border-t border-neutral-200/60 bg-[#FAF8F5] px-6 py-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Subtotal</span>
              <span className="text-base font-medium text-neutral-900">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-[10px] text-neutral-400 text-center">Shipping & taxes calculated at checkout.</p>
            <Link href="/checkout" onClick={toggleCart} className="block w-full bg-neutral-900 py-4 text-center text-xs font-medium uppercase tracking-widest text-white transition-all hover:bg-neutral-800">
              Checkout Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
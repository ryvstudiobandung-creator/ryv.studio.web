"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Struktur data barang di dalam keranjang
export type CartItem = {
  id: string;
  name: string;
  price: number;
  color: string;
  image: string;
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, color: string) => void;
  toggleCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fungsi tambah barang
  const addToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      // Cek apakah barang dengan warna yang sama sudah ada
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.color === newItem.color
      );

      if (existingItemIndex > -1) {
        // Kalau sudah ada, tambah quantity-nya aja
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }
      // Kalau belum ada, masukkan sebagai barang baru
      return [...prevItems, newItem];
    });
    setIsCartOpen(true); // Otomatis buka laci keranjang saat nambah barang
  };

  // Fungsi hapus barang
  const removeFromCart = (id: string, color: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => !(item.id === id && item.color === color))
    );
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, addToCart, removeFromCart, toggleCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook biar gampang dipanggil di komponen lain
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
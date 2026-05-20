"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // GANTI PASSWORD INI SESUAI KEINGINAN LU
    if (password === "ryv123") {
      // Set cookie login (berlaku 1 hari)
      document.cookie = "ryv_admin_session=authenticated; path=/; max-age=86400";
      router.push("/admin");
    } else {
      alert("Password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-3xl mb-2 text-neutral-900">RYV.studio</h1>
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-8">Admin Portal</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none text-center tracking-widest"
          />
          <button 
            type="submit"
            className="w-full bg-neutral-900 py-4 text-xs font-medium uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
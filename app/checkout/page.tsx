"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const router = useRouter();

  // --- STATES RAJAONGKIR ---
  const [ provinces, setProvinces ] = useState<any[]>([ ]);
  const [ cities, setCities ] = useState<any[]>([ ]);
  const [ districts, setDistricts ] = useState<any[]>([ ]);
  const [ shippingOptions, setShippingOptions ] = useState<any[]>([ ]);
  
  const [ selectedProvince, setSelectedProvince ] = useState("");
  const [ selectedCity, setSelectedCity ] = useState("");
  const [ selectedDistrict, setSelectedDistrict ] = useState("");
  // DEFAULT LANGSUNG JNT
  const [ selectedCourier, setSelectedCourier ] = useState("jnt"); 
  const [ selectedShipping, setSelectedShipping ] = useState<any>(null);
  
  const [ isLoadingAddress, setIsLoadingAddress ] = useState(false);
  const [ isLoadingOngkir, setIsLoadingOngkir ] = useState(false);

  // Asumsi berat per item 200 gram
  const totalWeight = cartItems.reduce((acc, item) => acc + (200 * item.quantity), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  // 1. Ambil data Provinsi
  useEffect(() => {
    if (provinces.length > 0) return;
    const fetchProvinces = async () => {
      try {
        const res = await fetch("/api/rajaongkir/province");
        const data = await res.json();
        if (Array.isArray(data)) setProvinces(data);
      } catch (err) { console.error(err); }
    };
    fetchProvinces();
  }, [ provinces.length ]);

  // 2. Ambil data Kota
  useEffect(() => {
    if (!selectedProvince) {
      setCities([ ]); setSelectedCity(""); setSelectedDistrict(""); setDistricts([ ]); return;
    }
    const fetchCities = async () => {
      setIsLoadingAddress(true);
      try {
        const res = await fetch(`/api/rajaongkir/city/${selectedProvince}`);
        const data = await res.json();
        if (Array.isArray(data)) setCities(data);
      } catch (err) { console.error(err); } 
      finally { setIsLoadingAddress(false); }
    };
    fetchCities();
  }, [ selectedProvince ]);

  // 3. Ambil data Kecamatan
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([ ]); setSelectedDistrict(""); return;
    }
    const fetchDistricts = async () => {
      setIsLoadingAddress(true);
      try {
        const res = await fetch(`/api/rajaongkir/district/${selectedCity}`);
        const data = await res.json();
        if (Array.isArray(data)) setDistricts(data);
      } catch (err) { console.error(err); } 
      finally { setIsLoadingAddress(false); }
    };
    fetchDistricts();
  }, [ selectedCity ]);

  // 4. Hitung Ongkir otomatis (Akan jalan otomatis pas District dipilih karena Courier udah isi "jnt")
  useEffect(() => {
    if (!selectedDistrict || !selectedCourier) {
      setShippingOptions([ ]); setSelectedShipping(null); return;
    }
    const calculateShipping = async () => {
      setIsLoadingOngkir(true);
      setSelectedShipping(null);
      try {
        const res = await fetch("/api/rajaongkir/cost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destinationDistrictId: selectedDistrict,
            weight: totalWeight,
            courier: selectedCourier
          })
        });
        const data = await res.json();
        if (Array.isArray(data)) setShippingOptions(data);
      } catch (err) { console.error(err); } 
      finally { setIsLoadingOngkir(false); }
    };
    calculateShipping();
  }, [ selectedDistrict, selectedCourier ]);


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

  // --- KOMPONEN CUSTOM DROPDOWN ---
  const CustomSelect = ({ value, onChange, options, placeholder, disabled }: any) => {
    const [ isOpen, setIsOpen ] = useState(false);

    const selectedOption = options.find((opt: any) => String(opt.id) === String(value));
    const displayLabel = selectedOption 
      ? (selectedOption.name || selectedOption.type + " " + selectedOption.city_name || selectedOption.province) 
      : placeholder;

    return (
      <div className="relative w-full">
        {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}

        <div 
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full border-b border-neutral-300 bg-transparent py-3 text-sm focus:border-neutral-900 transition-colors cursor-pointer flex justify-between items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${!value ? 'text-neutral-500' : '!text-neutral-900'}`}
        >
          <span className="truncate pr-4">{displayLabel}</span>
          <motion.svg 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            className="h-4 w-4 text-neutral-400 flex-shrink-0 relative z-10" 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-neutral-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <ul className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-neutral-400 italic">No options available</li>
            ) : (
              options.map((opt: any) => {
                const label = opt.name || opt.type + " " + opt.city_name || opt.province;
                return (
                  <li 
                    key={opt.id}
                    onClick={() => {
                      onChange({ target: { value: opt.id } });
                      setIsOpen(false);
                    }}
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors ${String(value) === String(opt.id) ? 'bg-neutral-50 font-medium text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}`}
                  >
                    {label}
                  </li>
                );
              })
            )}
          </ul>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20" style={{ colorScheme: 'light' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-x-16 gap-y-12">
          
          {/* KOLOM KIRI: FORMULIR */}
          <div className="flex-1 space-y-12">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-8">Contact Information</h2>
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
              
              <input type="text" placeholder="Full Address (Street, House No, etc)" className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
              
              {/* DROPDOWN LOKASI */}
              <div className="grid grid-cols-2 gap-4">
                <CustomSelect value={selectedProvince} onChange={(e: any) => setSelectedProvince(e.target.value)} options={provinces} placeholder="Province" />
                <CustomSelect value={selectedCity} onChange={(e: any) => setSelectedCity(e.target.value)} options={cities} placeholder={isLoadingAddress ? "Loading..." : "City"} disabled={!selectedProvince || isLoadingAddress} />
              </div>

              <CustomSelect value={selectedDistrict} onChange={(e: any) => setSelectedDistrict(e.target.value)} options={districts} placeholder={isLoadingAddress ? "Loading..." : "District (Kecamatan)"} disabled={!selectedCity || isLoadingAddress} />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <input type="text" placeholder="Postal Code" className="border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
                <input type="tel" placeholder="Phone Number" className="border-b border-neutral-300 bg-transparent py-3 text-sm !text-neutral-900 placeholder:!text-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors" />
              </div>
            </div>

            <div>
              {/* <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-6">Shipping Method</h2> */}
              
              {/* PILIHAN KURIR DI-KOMEN DULU, KALI AJA MAU DIPAKE LAGI */}
              {/* <div className="grid grid-cols-3 gap-4 mb-6">
                {[ "jne", "jnt", "sicepat" ].map((courier) => (
                  <label 
                    key={courier} 
                    className={`border p-3 text-center rounded-sm cursor-pointer transition-all block uppercase text-[10px] tracking-widest font-bold ${selectedCourier === courier ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-900'}`}
                  >
                    <input 
                      type="radio" 
                      name="courier" 
                      value={courier} 
                      checked={selectedCourier === courier}
                      onChange={(e) => setSelectedCourier(e.target.value)}
                      className="sr-only" 
                    />
                    {courier}
                  </label>
                ))}
              </div>
              */}

              {/* DAFTAR HARGA ONGKIR DINAMIS */}
              <div className="space-y-3">
                {isLoadingOngkir && <p className="text-xs text-neutral-500 italic animate-pulse py-4">Calculating shipping rates for {totalWeight}g...</p>}
                
                {!isLoadingOngkir && shippingOptions.length === 0 && selectedDistrict && (
                  <p className="text-xs text-red-500 italic py-4">Layanan tidak tersedia untuk rute ini.</p>
                )}
{shippingOptions.length > 0 && shippingOptions.map((opt) => (
                  <motion.label 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    key={opt.service} 
                    className={`flex items-center justify-between border p-4 rounded-sm cursor-pointer hover:border-neutral-400 transition-colors bg-white/50 ${selectedShipping?.service === opt.service ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200'}`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="shipping_service" 
                        checked={selectedShipping?.service === opt.service}
                        onChange={() => setSelectedShipping(opt)}
                        className="h-4 w-4 accent-neutral-900" 
                      />
                      <div className="ml-4">
                        <span className="text-sm font-medium !text-neutral-900 uppercase">J&T {opt.service}</span>
                        {/* UPDATE: Langsung panggil opt.etd */}
                        <p className="text-[10px] text-neutral-500 mt-0.5">Est. Arrival: {opt.etd || "-"} Days</p>
                      </div>
                    </div>
                    {/* UPDATE: Langsung panggil opt.cost */}
                    <span className="text-sm font-bold !text-neutral-900">{formatPrice(opt.cost)}</span>
                  </motion.label>
                ))}
              </div>

            </div>
          </div>

          {/* KOLOM KANAN: ORDER SUMMARY */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-32 bg-[#FAF8F5] p-8 border border-neutral-200 rounded-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
                  <span>Shipping ({totalWeight}g)</span>
                  <span className={selectedShipping ? "!text-neutral-900 font-bold" : ""}>
                    {/* UPDATE: Langsung panggil selectedShipping.cost */}
                    {selectedShipping ? formatPrice(selectedShipping.cost) : "Calculated in next step"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold !text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Est.</span>
                  {/* UPDATE: Langsung panggil selectedShipping.cost buat ditotalin */}
                  <span className="text-lg">{formatPrice(cartTotal + (selectedShipping ? selectedShipping.cost : 0))}</span>
                </div>
              </div>

              <button 
                onClick={() => router.push("/coming-soon")}
                disabled={!selectedShipping} 
                className="w-full bg-neutral-900 mt-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed"
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
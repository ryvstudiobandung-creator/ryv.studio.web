"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Solusi Error Hydration
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const defaultForm = { id: "", name: "", category: "Pashmina", material: "", price: 0, image_url: "", color_variants: [] };
  const [formData, setFormData] = useState<any>(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, message: "", type: "success" });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const CATEGORY_OPTIONS = ["Pashmina", "Instant", "Inner"];

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ isOpen: true, message, type });
    setTimeout(() => setNotification({ isOpen: false, message: "", type: "success" }), 3000);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsMounted(true); // Memberi tahu Next.js bahwa komponen sudah aman di-render di browser
    fetchProducts();
  }, []);

  const handleLogout = () => {
    document.cookie = "ryv_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setIsEditing(true);
    setFormData({ ...product, color_variants: product.color_variants || [] });
    setIsModalOpen(true);
  };

  // FUNGSI SAKTI BUAT UPLOAD GAMBAR KE SUPABASE STORAGE
  const handleImageUpload = async (file: File) => {
    try {
      // Membersihkan spasi pada nama file asli dengan underscore (biar aman di URL)
      const safeOriginalName = file.name.replace(/\s+/g, '_');
      
      // Gabungkan waktu sekarang + nama asli file lu (contoh: 17094839-Diora_Chiffon.jpg)
      const filePath = `${Date.now()}-${safeOriginalName}`;

      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      showNotification(`Gagal upload gambar: ${error.message}`, "error");
      return null;
    }
  };

  const deleteOldImage = async (oldUrl: string) => {
    if (!oldUrl || !oldUrl.includes('supabase.co')) return;
    try {
      const fileName = oldUrl.split('/').pop();
      if (fileName) {
        const { error } = await supabase.storage.from('products').remove([fileName]);
        if (error) console.error("Gagal hapus gambar lama:", error);
      }
    } catch (error) {
      console.error("Error saat menghapus gambar:", error);
    }
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    
    const newUrl = await handleImageUpload(e.target.files[ 0 ]);
    
    if (newUrl) {
      if (formData.image_url) {
        await deleteOldImage(formData.image_url);
      }
      setFormData((prev: any) => ({ ...prev, image_url: newUrl }));
    }
    setUploadingImage(false);
  };

  const handleVariantImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    
    const newUrl = await handleImageUpload(e.target.files[ 0 ]);
    
    if (newUrl) {
      const oldUrl = formData.color_variants[index]?.image;
      
      if (oldUrl) {
        await deleteOldImage(oldUrl);
      }
      
      setFormData((prevFormData: any) => {
        const updatedVariants = prevFormData.color_variants.map((variant: any, i: number) => {
          if (i === index) {
            return { ...variant, image: newUrl };
          }
          return variant;
        });
        return { ...prevFormData, color_variants: updatedVariants };
      });
    }
    setUploadingImage(false);
  };

  const addVariant = () => {
    setFormData((prev: any) => ({
      ...prev,
      color_variants: [...prev.color_variants, { name: "", image: "" }]
    }));
  };

  const removeVariant = async (index: number) => {
    const variantToRemove = formData.color_variants[index];
    
    if (variantToRemove?.image) {
      await deleteOldImage(variantToRemove.image);
    }
    
    setFormData((prevFormData: any) => {
      const updatedVariants = prevFormData.color_variants.filter((_: any, i: number) => i !== index);
      return { ...prevFormData, color_variants: updatedVariants };
    });
  };

  const updateVariantName = (index: number, newName: string) => {
    setFormData((prevFormData: any) => {
      const updatedVariants = prevFormData.color_variants.map((variant: any, i: number) => {
        if (i === index) {
          return { ...variant, name: newName };
        }
        return variant;
      });
      return { ...prevFormData, color_variants: updatedVariants };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: formData.name,
      price: formData.price,
      category: formData.category,
      material: formData.material,
      image_url: formData.image_url,
      color_variants: formData.color_variants
    };

    if (isEditing) {
      const { error } = await supabase.from('products').update(payload).eq('id', formData.id);
      if (error) showNotification(`Gagal update: ${error.message}`, "error");
      else showNotification("Produk berhasil diupdate!", "success");
    } else {
      const newId = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { error } = await supabase.from('products').insert([{ id: newId, ...payload }]);
      if (error) showNotification(`Gagal menambah produk: ${error.message}`, "error");
      else showNotification("Produk baru berhasil ditambahkan!", "success");
    }

    setIsSaving(false);
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER ADMIN */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-neutral-900 mb-2">Product Catalog</h1>
            <p className="text-sm font-light text-neutral-500">Manage your store inventory, pricing, and images.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border-b border-transparent hover:border-neutral-900 pb-1 transition-all">Logout</button>
            <button onClick={openAddModal} className="text-xs font-medium uppercase tracking-widest bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-colors">+ Add Product</button>
          </div>
        </div>

        {/* TABEL PRODUK */}
        <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-[#FAF8F5] text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-5 font-semibold">Image</th>
                  <th className="px-6 py-5 font-semibold">Product Name</th>
                  <th className="px-6 py-5 font-semibold">Price (Rp)</th>
                  <th className="px-6 py-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-400 font-light">Loading data...</td></tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-10 bg-neutral-100 rounded-sm overflow-hidden border border-neutral-200">
                        <img src={product.image_url || "/fallback-image.jpg"} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {product.name} <br/> <span className="text-[10px] text-neutral-400 font-normal uppercase">{product.color_variants?.length || 0} Colors</span>
                    </td>
                    <td className="px-6 py-4 font-medium">{product.price.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(product)} className="text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-widest border border-neutral-200 px-4 py-2 hover:border-neutral-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL FORM TAMBAH / EDIT */}
        {isModalOpen && (
          <div className="fixed inset-0 z- flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
            <div className="bg-[#FDFBF7] rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="px-8 py-6 border-b border-neutral-200 flex justify-between items-center bg-white">
                <h3 className="font-serif text-xl text-neutral-900">{isEditing ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">✕</button>
              </div>
              
              <form onSubmit={handleSave} className="p-8 space-y-8 overflow-y-auto">
                
                {/* INFO DASAR */}
                <div className="space-y-6 border-b border-neutral-200 pb-8">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Product Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Category</label>
                      
                      {/* Kotak Input (Trigger Dropdown) */}
                      <div 
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 flex justify-between items-center cursor-pointer hover:border-neutral-900 transition-colors"
                      >
                        <span>{formData.category || "Select Category"}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-neutral-500 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Menu Dropdown Melayang */}
                      {isCategoryOpen && (
                        <>
                          {/* Invisible overlay biar dropdown nutup pas klik di luar */}
                          <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)}></div>
                          
                          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 rounded-sm overflow-hidden">
                            {CATEGORY_OPTIONS.map((cat) => (
                              <div 
                                key={cat}
                                onClick={() => {
                                  setFormData({ ...formData, category: cat });
                                  setIsCategoryOpen(false);
                                }}
                                className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                                  formData.category === cat 
                                    ? 'bg-neutral-50/80 font-medium text-neutral-900' 
                                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                                }`}
                              >
                                {cat}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Price (Rp)</label>
                      <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Material</label>
                    <input type="text" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" />
                  </div>
                  
                  {/* GAMBAR UTAMA */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-3">Main Cover Image</label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-16 bg-neutral-200 rounded-sm overflow-hidden border border-neutral-200 flex-shrink-0">
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No Img</div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMainImageChange} 
                        className="text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-200 file:text-xs file:bg-white file:text-neutral-700 hover:file:bg-neutral-50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* MANAJEMEN VARIAN WARNA */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-900">Color Variants</label>
                    <button type="button" onClick={addVariant} className="text-[10px] font-medium uppercase text-blue-600 hover:text-blue-800">+ Add Color</button>
                  </div>

                  {formData.color_variants.map((variant: any, index: number) => (
                    <div key={index} className="flex gap-4 items-start bg-white p-4 border border-neutral-200 rounded-sm relative">
                      {/* Preview Gambar Varian */}
                      <div className="h-16 w-12 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0 border border-neutral-200">
                        {variant.image ? <img src={variant.image} className="w-full h-full object-cover" /> : null}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <input 
                          type="text" 
                          placeholder="Color Name (e.g. Broken White)" 
                          value={variant.name} 
                          onChange={(e) => updateVariantName(index, e.target.value)} 
                          className="w-full border-b border-neutral-300 bg-transparent py-1 text-sm !text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900" 
                          required 
                        />
                        
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleVariantImageChange(index, e)} 
                          className="w-full text-[10px] text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:border file:border-neutral-200 file:rounded-sm file:text-[10px] file:font-medium file:bg-neutral-100 file:text-neutral-900 hover:file:bg-neutral-200 hover:file:cursor-pointer transition-colors" 
                        />
                      </div>

                      <button type="button" onClick={() => removeVariant(index)} className="text-neutral-400 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  ))}
                  {formData.color_variants.length === 0 && (
                    <p className="text-xs text-neutral-400 italic">Belum ada varian warna. Klik "Add Color" untuk menambah.</p>
                  )}
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-600 border border-neutral-200 hover:border-neutral-900 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving || uploadingImage} className="flex-1 py-4 text-xs font-semibold uppercase tracking-widest text-white bg-neutral-900 hover:bg-neutral-800 transition-colors disabled:bg-neutral-400">
                    {uploadingImage ? "Uploading..." : isSaving ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* CUSTOM NOTIFICATION MODAL */}
      {isMounted && (
        <div 
          className={`fixed top-10 left-1/2 -translate-x-1/2 z- transition-all duration-300 ${
            notification.isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
          }`}
        >
          <div className={`flex items-center space-x-3 px-6 py-4 shadow-lg border rounded-sm ${
            notification.type === 'success' 
              ? 'bg-white border-green-200 text-neutral-900' 
              : 'bg-white border-red-200 text-red-600'
          }`}>
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
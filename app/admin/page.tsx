"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // State untuk form modal (bisa Add atau Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Nilai default untuk form produk baru
  const defaultForm = { id: "", name: "", category: "Pashmina", material: "", price: 0, image_url: "", color_variants: [] };
  const [formData, setFormData] = useState<any>(defaultForm);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
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
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (isEditing) {
      // PROSES UPDATE
      const { error } = await supabase.from('products').update({
        name: formData.name,
        price: formData.price,
        category: formData.category,
        material: formData.material,
        image_url: formData.image_url
      }).eq('id', formData.id);

      if (error) alert(`Gagal update: ${error.message}`);
      else alert("Produk berhasil diupdate!");

    } else {
      // PROSES TAMBAH PRODUK BARU
      const newId = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'); // Bikin ID otomatis dari nama
      const { error } = await supabase.from('products').insert([{
        id: newId,
        name: formData.name,
        price: formData.price,
        category: formData.category,
        material: formData.material,
        image_url: formData.image_url,
        color_variants: [] // Varian warna kosong dulu secara default
      }]);

      if (error) alert(`Gagal menambah produk: ${error.message}`);
      else alert("Produk baru berhasil ditambahkan!");
    }

    setIsSaving(false);
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Admin */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-neutral-900 mb-2">Product Catalog</h1>
            <p className="text-sm font-light text-neutral-500">Manage your store inventory, pricing, and images.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border-b border-transparent hover:border-neutral-900 pb-1 transition-all">
              Logout
            </button>
            <button onClick={openAddModal} className="text-xs font-medium uppercase tracking-widest bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-colors">
              + Add Product
            </button>
          </div>
        </div>

        {/* Tabel Produk */}
        <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-[#FAF8F5] text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-5 font-semibold">Image</th>
                  <th className="px-6 py-5 font-semibold">Product Name</th>
                  <th className="px-6 py-5 font-semibold">Category</th>
                  <th className="px-6 py-5 font-semibold">Price (Rp)</th>
                  <th className="px-6 py-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-400 font-light">Loading data...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-400 font-light">Belum ada produk.</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-12 w-10 bg-neutral-100 rounded-sm overflow-hidden border border-neutral-200">
                          <img src={product.image_url || "/fallback-image.jpg"} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-900">{product.name}</td>
                      <td className="px-6 py-4 text-xs uppercase tracking-wider">{product.category}</td>
                      <td className="px-6 py-4 font-medium">{product.price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-widest border border-neutral-200 px-4 py-2 hover:border-neutral-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah / Edit Produk */}
        {isModalOpen && (
          <div className="fixed inset-0 z- flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
            <div className="bg-[#FDFBF7] rounded-sm shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="px-8 py-6 border-b border-neutral-200 flex justify-between items-center bg-white">
                <h3 className="font-serif text-xl text-neutral-900">{isEditing ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Product Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" required />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900">
                      <option value="Pashmina">Pashmina</option>
                      <option value="Instant">Instant</option>
                      <option value="Inner">Inner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Price (Rp)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" required />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Material</label>
                  <input type="text" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" placeholder="e.g. Premium Ceruty" />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Main Image URL</label>
                  <input type="url" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900" placeholder="https://..." />
                  <p className="text-[9px] text-neutral-400 mt-2">Paste link gambar dari Supabase Storage atau tempat lain.</p>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-600 border border-neutral-200 hover:border-neutral-900 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-4 text-xs font-semibold uppercase tracking-widest text-white bg-neutral-900 hover:bg-neutral-800 transition-colors disabled:bg-neutral-400">
                    {isSaving ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
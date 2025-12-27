"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import ImageUpload from "@/app/components/ImageUpload"; // Check this path!

// 1. Same Zod Schema as Add Product
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().gt(0, "Price must be > 0"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
});

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{name?: string; price?: string; quantity?: string}>({});

  // 2. Fetch existing data
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p: any) => p._id === id);
        if (product) {
          setFormData({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            image: product.image || "",
          });
        }
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 3. Validate with Zod
    const validation = productSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        price: fieldErrors.price?.[0],
        quantity: fieldErrors.quantity?.[0],
      });
      return;
    }

    // 4. Send Update (PUT)
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validation.data, _id: id }),
    });

    if (res.ok) {
      router.push("/products");
      router.refresh();
    } else {
      alert("Failed to update product");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Image Upload - Restored */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image</label>
          {formData.image ? (
            <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 overflow-hidden">
               <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
               <button 
                 type="button" 
                 onClick={() => setFormData({ ...formData, image: "" })} 
                 className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
               >
                 Remove
               </button>
            </div>
          ) : (
            <ImageUpload onUpload={(url) => setFormData({ ...formData, image: url })} />
          )}
        </div>

        {/* Inputs with FIXED colors (text-slate-900) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="General">General</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Books">Books</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
              <input 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
              <input 
                type="number" 
                value={formData.quantity} 
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">Update Product</button>
      </form>
    </div>
  );
}
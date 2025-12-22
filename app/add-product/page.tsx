"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import ImageUpload from "../components/ImageUpload";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().gt(0, "Price must be > 0"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
});

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("General"); 
  const [imageUrl, setImageUrl] = useState("");
  
  const [errors, setErrors] = useState<{name?: string; price?: string; quantity?: string}>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = productSchema.safeParse({ name, price, quantity, category, imageUrl });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        price: fieldErrors.price?.[0],
        quantity: fieldErrors.quantity?.[0],
      });
      return;
    }

    const res = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (res.ok) {
      alert("Product Created!");
      router.push("/products");
      router.refresh();
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md mt-10 transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image</label>
          {imageUrl ? (
            <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 overflow-hidden">
               <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
               <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
            </div>
          ) : (
            <ImageUpload onUpload={(url) => setImageUrl(url)} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
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
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">Save Product</button>
      </form>
    </div>
  );
}
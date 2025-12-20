"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import ImageUpload from "../components/ImageUpload"; // Import our new button

// 1. Update Schema to allow an Image URL (optional)
const productSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  imageUrl: z.string().optional(), // New field
});

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  
  // New: State to store the image link
  const [imageUrl, setImageUrl] = useState(""); 
  
  const [errors, setErrors] = useState<{name?: string; price?: string}>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const validation = productSchema.safeParse({ name, price, imageUrl });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        price: fieldErrors.price?.[0],
      });
      return;
    }

    setErrors({});

    // Send data (including the image URL!)
    const res = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (res.ok) {
      alert("Success! Product Created.");
      router.push("/products");
      router.refresh();
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* IMAGE UPLOAD SECTION */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
          
          {/* Show the button OR the uploaded image preview */}
          {imageUrl ? (
            <div className="relative w-full h-48 bg-slate-100 rounded overflow-hidden border border-slate-300">
               {/* Using standard img tag for simplicity */}
               <img 
                 src={imageUrl} 
                 alt="Preview" 
                 className="w-full h-full object-contain" 
               />
               <button
                 type="button"
                 onClick={() => setImageUrl("")} // Click to remove
                 className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
               >
                 Remove
               </button>
            </div>
          ) : (
            <ImageUpload onUpload={(url) => setImageUrl(url)} />
          )}
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
          <input 
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition"
        >
          Save Product
        </button>

      </form>
    </div>
  );
}
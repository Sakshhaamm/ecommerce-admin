"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import ImageUpload from "../../components/ImageUpload"; 

const productSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  imageUrl: z.string().optional(),
});

export default function EditProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // This holds the link
  
  const [errors, setErrors] = useState<{name?: string; price?: string}>({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const id = params.id; 

  // Fetch existing data
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const products = await res.json();
        const product = products.find((p: any) => p._id === id);
        
        if (product) {
          setName(product.name);
          setPrice(product.price);
          if (product.imageUrl) {
            setImageUrl(product.imageUrl);
          }
        } else {
          router.push("/products");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = productSchema.safeParse({ name, price, imageUrl });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        price: fieldErrors.price?.[0],
      });
      return;
    }

    const res = await fetch("http://localhost:3000/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, name, price, imageUrl }),
    });

    if (res.ok) {
      alert("Success! Product Updated.");
      router.push("/products");
      router.refresh();
    } else {
      alert("Failed to update.");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Edit Product</h1>
      
      <form onSubmit={handleUpdate} className="space-y-4">
        
        {/* IMAGE SECTION */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
          
          {/* LOGIC: If we have an image, show it. If not, show upload button. */}
          {imageUrl ? (
            <div className="relative w-full h-48 bg-slate-100 rounded overflow-hidden border border-slate-300">
               {/* PREVIEW IMAGE */}
               <img 
                 src={imageUrl} 
                 alt="Preview" 
                 className="w-full h-full object-contain" 
               />
               
               {/* REMOVE BUTTON */}
               <button
                 type="button"
                 onClick={() => setImageUrl("")} 
                 className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded shadow hover:bg-red-600"
               >
                 Change Image
               </button>
            </div>
          ) : (
            /* UPLOAD BUTTON */
            <ImageUpload 
              key="uploader" // <--- THIS KEY IS THE SECRET FIX
              onUpload={(url) => {
                setImageUrl(url); // Update the state
                // Note: The "Upload Worked" popup comes from the child, 
                // so we don't need another alert here.
              }} 
            />
          )}
        </div>

        {/* Name */}
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

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
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
          className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
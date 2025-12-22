"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import ImageUpload from "../../components/ImageUpload";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().gt(0, "Price must be > 0"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
});

export default function EditProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("General");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const id = params.id; 

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
          setQuantity(product.quantity || 0);
          setCategory(product.category || "General");
          if (product.imageUrl) setImageUrl(product.imageUrl);
        } else {
          router.push("/products");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = productSchema.safeParse({ name, price, quantity, category, imageUrl });
    
    if (!validation.success) {
      alert("Please check inputs");
      return;
    }

    const res = await fetch("http://localhost:3000/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, ...validation.data }),
    });

    if (res.ok) {
      alert("Product Updated!");
      router.push("/products");
      router.refresh();
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Edit Product</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        
        <div className="mb-4">
           <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>
           {imageUrl ? (
             <div className="relative h-48 border rounded overflow-hidden">
                <img src={imageUrl} alt="Preview" className="h-full w-full object-contain"/>
                <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Remove</button>
             </div>
           ) : (
             <ImageUpload key="uploader" onUpload={setImageUrl} />
           )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded bg-white">
            <option value="General">General</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Books">Books</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Quantity</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 border rounded" />
            </div>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700">Update Product</button>
      </form>
    </div>
  );
}
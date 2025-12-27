"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); 

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((p: any) => p._id === id);
        if (product) {
          setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity,
            description: product.description || "",
            image: product.image || "",
          });
        }
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, _id: id }),
    });

    if (res.ok) {
      router.push("/products");
      router.refresh();
    } else {
      alert("Failed to update product");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
           <label className="block mb-1">Product Name</label>
           <input
             type="text"
             value={formData.name}
             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
             className="w-full p-2 border rounded text-black"
             required
           />
        </div>
        
        {/* Price & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Stock Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
           <label className="block mb-1">Category</label>
           <input
             type="text"
             value={formData.category}
             onChange={(e) => setFormData({ ...formData, category: e.target.value })}
             className="w-full p-2 border rounded text-black"
           />
        </div>

         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
          Update Product
        </button>
      </form>
    </div>
  );
}
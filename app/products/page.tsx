"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from the browser (Avoids server crash)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete Functionality
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        // Remove from list immediately
        setProducts(products.filter((p: any) => p._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (loading) return <div className="p-10">Loading inventory...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Inventory</h1>
        <Link 
          href="/add-product" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 border-b">Product Name</th>
              <th className="p-4 border-b">Category</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Stock</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {products.map((product: any) => (
              <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4 text-green-600 font-bold">${product.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    (product.quantity || 0) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {product.quantity} in stock
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  {/* EDIT BUTTON */}
                  <Link 
                    href={`/products/edit/${product._id}`} 
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </Link>
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
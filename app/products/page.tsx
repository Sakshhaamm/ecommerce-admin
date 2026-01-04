"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p: any) => p._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="p-10">Loading inventory...</div>;

  return (
    <div className="p-6 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Inventory</h1>
        <Link
          href="/add-product"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          + Add New Product
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="p-2 border border-slate-300 dark:border-slate-600 rounded w-full md:w-1/3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="General">General</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Books">Books</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 border-b">Image</th>
              <th className="p-4 border-b">Product Name</th>
              <th className="p-4 border-b">Category</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Stock</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredProducts.map((product: any) => (
              <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="p-4">
                  {product.imageUrl || product.image ? (
                    <img src={product.imageUrl || product.image} className="w-12 h-12 object-cover rounded border border-slate-200 dark:border-slate-600" />
                  ) : (<div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-xs text-slate-500 dark:text-slate-300">No Img</div>)}
                </td>
                <td className="p-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                <td className="p-4 text-slate-700 dark:text-slate-300">{product.category}</td>
                <td className="p-4 text-green-600 font-bold">${product.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${(product.quantity || 0) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                    {product.quantity} in stock
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  {/* FIXED LINK: Points to your actual folder 'edit-product' */}
                  <Link
                    href={`/edit-product/${product._id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </Link>
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
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
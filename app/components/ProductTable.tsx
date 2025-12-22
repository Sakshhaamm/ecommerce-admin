"use client";

import { useState } from "react";
import DeleteBtn from "../products/DeleteBtn";
import { useRouter } from "next/navigation";

export default function ProductTable({ initialProducts }: { initialProducts: any[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();

  // --- SELL FUNCTION ---
  const handleSell = async (product: any) => {
    // 1. Ask user for quantity
    const qtyStr = prompt(`How many "${product.name}" are you selling? (Max: ${product.quantity})`);
    if (!qtyStr) return; // Cancelled

    const qty = parseInt(qtyStr);
    
    // 2. Validate input
    if (isNaN(qty) || qty <= 0) return alert("Please enter a valid number");
    if (qty > (product.quantity || 0)) return alert("Not enough stock available!");

    // 3. Send to API
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 4. Success!
      alert(`✅ Sold ${qty} items for $${data.sale.amount}!`);
      router.refresh(); // Reload page to update stock and charts
    } catch (error: any) {
      alert("Sale Failed: " + error.message);
    }
  };
  // ---------------------

  const filteredProducts = initialProducts
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "stock-low") return (a.quantity || 0) - (b.quantity || 0);
      return 0;
    });

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4 transition-colors">
      
      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <input 
          type="text" 
          placeholder="🔍 Search products..." 
          className="p-2 border border-slate-300 dark:border-slate-600 rounded w-full md:w-1/3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
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

          <select 
            className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort by...</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock-low">Stock: Low to High</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-700 border-b dark:border-slate-600 text-slate-700 dark:text-slate-200">
            <tr>
              <th className="p-4 font-bold">Image</th>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Price</th>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                <td className="p-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} className="w-12 h-12 object-cover rounded border border-slate-200 dark:border-slate-600"/>
                  ) : (<div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-xs text-slate-500 dark:text-slate-300">No Img</div>)}
                </td>
                
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{product.name}</td>
                
                <td className="p-4">
                  <span className="bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-2 py-1 rounded text-xs border border-slate-200 dark:border-slate-500">
                    {product.category || "General"}
                  </span>
                </td>
                
                <td className="p-4 text-slate-700 dark:text-slate-300">${product.price}</td>
                
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    (product.quantity || 0) < 5 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' 
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {product.quantity || 0}
                  </span>
                </td>
                
                <td className="p-4 flex gap-3 items-center">
                  {/* SELL BUTTON */}
                  <button 
                    onClick={() => handleSell(product)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 shadow flex items-center gap-1"
                    title="Sell Item"
                  >
                    Sell 💲
                  </button>

                  <a href={`/edit-product/${product._id}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Edit</a>
                  <DeleteBtn id={product._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
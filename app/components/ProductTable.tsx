"use client";

import { useState } from "react";
import DeleteBtn from "../products/DeleteBtn";

export default function ProductTable({ initialProducts }: { initialProducts: any[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Logic: Filter -> Sort
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
      return 0; // Default (Oldest/Newest based on DB order)
    });

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      
      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <input 
          type="text" 
          placeholder="🔍 Search products..." 
          className="p-2 border rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
          <select 
            className="p-2 border rounded" 
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
            className="p-2 border rounded"
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
      <table className="w-full text-left">
        <thead className="bg-slate-100 border-b">
          <tr>
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Value</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} className="border-b hover:bg-slate-50">
              <td className="p-4">
                {product.imageUrl ? (
                  <img src={product.imageUrl} className="w-12 h-12 object-cover rounded border"/>
                ) : (<div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">No Img</div>)}
              </td>
              <td className="p-4 font-medium">{product.name}</td>
              <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category || "General"}</span></td>
              <td className="p-4">${product.price}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  (product.quantity || 0) < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {product.quantity || 0}
                </span>
              </td>
              <td className="p-4 font-bold text-slate-700">
                ${(product.price * (product.quantity || 0)).toLocaleString()}
              </td>
              <td className="p-4 flex gap-3">
                <a href={`/edit-product/${product._id}`} className="text-blue-600 font-bold hover:underline">Edit</a>
                <DeleteBtn id={product._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredProducts.length === 0 && (
        <div className="p-8 text-center text-gray-500">No products found matching your search.</div>
      )}
    </div>
  );
}
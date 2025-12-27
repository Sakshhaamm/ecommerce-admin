"use client";

import { useState, useEffect } from "react";

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // 1. Fetch products to populate the dropdown
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    setLoading(true);

    try {
      // 2. Send the exact 'productId' the API needs
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId, // Matches the API expectation
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Sale Recorded Successfully!");
        // Refresh product list to show updated stock
        const productRes = await fetch("/api/products");
        const productData = await productRes.json();
        setProducts(productData);
        // Reset form
        setQuantity(1);
        setSelectedProductId("");
      } else {
        alert(data.error || "Sale failed");
      }
    } catch (error) {
      console.error("Error recording sale:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Helper to find selected product details for display
  const selectedProduct = products.find((p: any) => p._id === selectedProductId) as any;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Record New Sale</h1>
      
      <form onSubmit={handleSale} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-6">
        
        {/* Product Dropdown */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">Select Product</label>
          <select 
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-3 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          >
            <option value="">-- Choose a Product --</option>
            {products.map((p: any) => (
              <option key={p._id} value={p._id} disabled={p.quantity <= 0}>
                {p.name} — ${p.price} ({p.quantity} in stock)
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">Quantity Sold</label>
          <input 
            type="number" 
            min="1"
            max={selectedProduct?.quantity || 999}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-3 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        {/* Total Calculation Display */}
        {selectedProduct && (
          <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded text-center">
            <p className="text-sm text-slate-500 dark:text-slate-300">Total Sale Amount</p>
            <p className="text-2xl font-bold text-green-600">
              ${(selectedProduct.price * quantity).toFixed(2)}
            </p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !selectedProductId}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm Sale"}
        </button>
      </form>
    </div>
  );
}
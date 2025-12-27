import Link from "next/link";
import connectDB from "../lib/db";
import Product from "../lib/model/product"; // Make sure this matches your file name (Product.ts)

// 1. Force the page to always show fresh data (no caching old stock)
export const dynamic = "force-dynamic";

async function getProducts() {
  await connectDB();
  // 2. Fetch directly from DB instead of using fetch()
  const products = await Product.find({}).sort({ _id: -1 }).lean();
  
  // 3. Convert MongoDB objects to simple text (fixes "Plain Object" errors)
  return JSON.parse(JSON.stringify(products));
}

export default async function InventoryPage() {
  const products = await getProducts();

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
              <th className="p-4 border-b dark:border-slate-600">Product Name</th>
              <th className="p-4 border-b dark:border-slate-600">Category</th>
              <th className="p-4 border-b dark:border-slate-600">Price</th>
              <th className="p-4 border-b dark:border-slate-600">Stock</th>
              <th className="p-4 border-b dark:border-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No products found. Start by adding one!
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">{product.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{product.category || "General"}</td>
                  <td className="p-4 text-green-600 font-bold">${product.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      (product.quantity || 0) > 0 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {product.quantity || 0} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
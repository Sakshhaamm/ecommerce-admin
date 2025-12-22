import ProductTable from "../components/ProductTable";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Inventory</h1>
        <a href="/add-product" className="bg-blue-600 text-white px-4 py-2 rounded">+ Add New</a>
      </div>
      
      {/* Pass data to Client Component for filtering/sorting */}
      <ProductTable initialProducts={products} />
    </div>
  );
}
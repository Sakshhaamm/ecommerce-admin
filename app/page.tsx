import connectDB from "./lib/db";
import Product from "./lib/model/product";
import ProductChart from "./components/ProductChart"; // Import the Chart

async function getData() {
  await connectDB();
  
  // We need to verify these are plain objects for the chart to work properly
  const products = await Product.find({}).lean(); 
  
  const totalProducts = products.length;
  const totalValue = products.reduce((sum: number, product: any) => {
    return sum + product.price;
  }, 0);

  // We pass the raw products list to the chart
  return { products, totalProducts, totalValue };
}

export default async function Home() {
  const { products, totalProducts, totalValue } = await getData();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>

      {/* 1. The Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Value */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Inventory Value</h2>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            ${totalValue.toLocaleString()}
          </p>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Products</h2>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {totalProducts}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Pending Orders</h2>
          <p className="text-3xl font-bold text-slate-800 mt-2">5</p>
          <p className="text-xs text-gray-400 mt-1">Coming soon...</p>
        </div>
      </div>

      {/* 2. The Chart (New!) */}
      <ProductChart data={products} />
      
    </div>
  );
}
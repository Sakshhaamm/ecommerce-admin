import connectDB from "./lib/db";
import Product from "./lib/model/product";
import ProductChart from "./components/ProductChart";
import SalesChart from "./components/SalesChart";

async function getData() {
  await connectDB();
  const products = await Product.find({}).lean(); 
  
  const totalProducts = products.length;
  
  const totalValue = products.reduce((sum: number, product: any) => {
    return sum + (product.price * (product.quantity || 0));
  }, 0);

  const totalStockItems = products.reduce((sum: number, product: any) => {
    return sum + (product.quantity || 0);
  }, 0);

  return { products, totalProducts, totalValue, totalStockItems };
}

export default async function Home() {
  const { products, totalProducts, totalValue, totalStockItems } = await getData();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Inventory Value</h2>
          <p className="text-3xl font-bold text-slate-800 mt-2">${totalValue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Unique Products</h2>
          <p className="text-3xl font-bold text-slate-800 mt-2">{totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Items in Stock</h2>
          <p className="text-3xl font-bold text-slate-800 mt-2">{totalStockItems}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductChart data={products} />
        <SalesChart />
      </div>
    </div>
  );
}
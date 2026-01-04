import connectDB from "./lib/db";
import Product from "./lib/model/product";
import Sale from "./lib/model/Sale";
import ProductChart from "./components/ProductChart";
import SalesChart from "./components/SalesChart";
import CategoryPieChart from "./components/CategoryPieChart";
import TopProductsChart from "./components/TopProductsChart";
// import ThemeToggle from "./components/ThemeToggle";

// Force dynamic ensures the page always rebuilds on refresh
export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();

  const products = await Product.find({}).lean();
  const sales = await Sale.find({}).lean();

  const totalProducts = products.length;

  const totalValue = products.reduce((sum: number, product: any) => {
    return sum + (product.price * (product.quantity || 0));
  }, 0);

  const totalStockItems = products.reduce((sum: number, product: any) => {
    return sum + (product.quantity || 0);
  }, 0);

  // --- FIX 1: PIE CHART LOGIC ---
  // Now sums up actual STOCK QUANTITY, not just product count.
  const categoryMap: Record<string, number> = {};
  products.forEach((p: any) => {
    const cat = p.category || "General";
    // ADD QUANTITY instead of adding 1
    categoryMap[cat] = (categoryMap[cat] || 0) + (p.quantity || 0);
  });

  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  // --- 2. Top Products Data ---
  const salesMap: Record<string, number> = {};
  sales.forEach((s: any) => {
    salesMap[s.productName] = (salesMap[s.productName] || 0) + s.amount;
  });

  const topProductsData = Object.keys(salesMap)
    .map(key => ({ name: key, revenue: salesMap[key] }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // --- 3. Monthly Sales Data ---
  const salesMapByMonth: Record<string, number> = {};

  sales.forEach((sale: any) => {
    const date = new Date(sale.date);
    // Create a key like "2023-01" for proper sorting
    const yearMonthKey = date.toISOString().slice(0, 7);
    salesMapByMonth[yearMonthKey] = (salesMapByMonth[yearMonthKey] || 0) + sale.amount;
  });

  // Sort keys (YYYY-MM) first to ensure chronological order
  const sortedKeys = Object.keys(salesMapByMonth).sort();

  const salesChartData = sortedKeys.map(key => {
    // Convert "2023-01" -> "Jan 23"
    const [year, month] = key.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1);
    const name = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    return {
      name, // "Jan 23"
      sales: salesMapByMonth[key]
    };
  });

  return {
    products,
    totalProducts,
    totalValue,
    totalStockItems,
    categoryData,
    topProductsData,
    salesChartData
  };
}

export default async function Home() {
  const {
    products,
    totalProducts,
    totalValue,
    totalStockItems,
    categoryData,
    topProductsData,
    salesChartData
  } = await getData();

  return (
    <div className="min-h-screen pb-20 transition-colors">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
        {/* ThemeToggle removed as per request */}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Total Inventory Value</h2>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">${totalValue.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Unique Products</h2>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{totalProducts}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Total Items in Stock</h2>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{totalStockItems}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart data={salesChartData} />
        <TopProductsChart data={topProductsData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={categoryData} />
        <ProductChart data={products} />
      </div>

    </div>
  );
}
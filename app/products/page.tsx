import DeleteBtn from "./DeleteBtn";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string; // New: We tell the page that products might have images
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        <a href="/add-product" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add New
        </a>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4 font-semibold">Image</th> {/* New Header */}
              <th className="p-4 font-semibold">Product Name</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-slate-50">
                {/* NEW COLUMN: The Image */}
                <td className="p-4">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </td>
                
                <td className="p-4">{product.name}</td>
                <td className="p-4 text-green-600 font-bold">${product.price}</td>
                <td className="p-4 flex gap-4 items-center">
                  <a 
                    href={`/edit-product/${product._id}`} 
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    Edit
                  </a>
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
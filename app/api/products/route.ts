import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import Product from "../../lib/model/product";

// 1. GET Request - Fetches from Database
export async function GET() {
  await connectDB(); // Connect to the pantry
  const products = await Product.find({}); // Get everything
  return NextResponse.json(products);
}

// 2. POST Request - Saves to Database
export async function POST(request: Request) {
  await connectDB(); // Connect to the pantry
  const body = await request.json();
  
  // Create a new product in the database
  const newProduct = await Product.create(body);
  
  return NextResponse.json({ 
    success: true, 
    product: newProduct 
  });
}
// 3. DELETE Request - Removes a product by ID
export async function DELETE(request: Request) {
  await connectDB();
  
  // Get the ID from the URL (e.g., /api/products?id=12345)
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  // Delete from MongoDB
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
// 4. PUT Request - Updates a product
// 4. PUT Request - Updates a product
export async function PUT(request: Request) {
  await connectDB();

  const body = await request.json();
  // BUG FIX: We added 'imageUrl' to this list so the backend sees it!
  const { _id, name, price, imageUrl } = body; 

  // Find by ID and update with new name, price, AND IMAGE
  const updatedProduct = await Product.findByIdAndUpdate(
    _id,
    { name, price, imageUrl }, // <--- Updated to include imageUrl
    { new: true } 
  );

  return NextResponse.json({ success: true, product: updatedProduct });
}
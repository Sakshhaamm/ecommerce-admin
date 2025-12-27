import connectDB from "../../lib/db";
import Product from "../../lib/model/product";
import { NextResponse } from "next/server";

// 1. GET - Fetches all products
export async function GET() {
  await connectDB();
  const products = await Product.find({}).sort({ _id: -1 });
  return NextResponse.json(products);
}

// 2. POST - Saves a new product
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Create the product in the database
    const newProduct = await Product.create({
      name: body.productName, // Make sure these match your form fields!
      category: body.category,
      price: body.price,
      quantity: body.quantity,
      description: body.description,
      image: body.image,
    });

    return NextResponse.json({ message: "Product Created", product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ message: "Error saving product" }, { status: 500 });
  }
}

// 3. DELETE - Removes a product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    await connectDB();
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Product Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}
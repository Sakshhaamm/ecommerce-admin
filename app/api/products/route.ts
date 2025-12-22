import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import Product from "../../lib/model/product";

// 1. GET Request
export async function GET() {
  await connectDB();
  const products = await Product.find({});
  return NextResponse.json(products);
}

// 2. POST Request (Create)
export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const product = await Product.create(body);
  return NextResponse.json({ success: true, product }, { status: 201 });
}

// 3. PUT Request (Update)
export async function PUT(request: Request) {
  await connectDB();
  const body = await request.json();
  const { _id, name, price, quantity, category, imageUrl } = body;

  const updatedProduct = await Product.findByIdAndUpdate(
    _id,
    { name, price, quantity, category, imageUrl },
    { new: true }
  );

  return NextResponse.json({ success: true, product: updatedProduct });
}

// 4. DELETE Request
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
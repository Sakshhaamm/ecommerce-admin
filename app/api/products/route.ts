import connectDB from "../../lib/db";
import Product from "../../lib/model/product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const products = await Product.find({}).sort({ _id: -1 });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // This handles both "Add" (POST) and "Edit" (PUT) logic if you send an ID
    const productData = {
      name: body.name || body.productName, // Handles both naming conventions
      category: body.category,
      price: Number(body.price),
      quantity: Number(body.quantity),
      description: body.description,
      image: body.image,
    };

    const newProduct = await Product.create(productData);
    return NextResponse.json({ message: "Created", product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error saving" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;

    await Product.findByIdAndUpdate(_id, updateData);
    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting" }, { status: 500 });
  }
}
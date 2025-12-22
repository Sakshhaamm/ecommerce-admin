import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import Sale from "../../lib/model/Sale";
import Product from "../../lib/model/product";

// 1. GET ALL SALES (For the Chart)
export async function GET() {
  await connectDB();
  // Sort by date (oldest to newest) to make the chart look right
  const sales = await Sale.find({}).sort({ date: 1 }); 
  return NextResponse.json(sales);
}

// 2. RECORD A NEW SALE
export async function POST(request: Request) {
  await connectDB();
  const { productId, quantity } = await request.json();

  // A. Find the product
  const product = await Product.findById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // B. Check stock
  if ((product.quantity || 0) < quantity) {
    return NextResponse.json({ error: "Not enough stock!" }, { status: 400 });
  }

  // C. Calculate Total Amount
  const totalAmount = product.price * quantity;

  // D. Update Product Stock (Subtract sold items)
  product.quantity = (product.quantity || 0) - quantity;
  await product.save();

  // E. Create Sale Record
  const newSale = await Sale.create({
    productName: product.name,
    quantity: quantity,
    amount: totalAmount,
    date: new Date(),
  });

  return NextResponse.json({ success: true, sale: newSale });
}
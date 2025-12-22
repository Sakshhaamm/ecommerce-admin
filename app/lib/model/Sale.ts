import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// This checks if the model is already compiled to avoid errors
const Sale = mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

export default Sale;
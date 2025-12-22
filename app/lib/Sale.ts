import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true }, // Total $ for this sale
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent model overwrite error
const Sale = mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

export default Sale;
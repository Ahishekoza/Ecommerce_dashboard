import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description:{type: String},
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.models.Product ||  mongoose.model("Product", productSchema);

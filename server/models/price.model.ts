import { Schema, model } from "mongoose";

const PriceSchema = new Schema(
  {
    color: String,
    costTOB: Number,
    bottom: Number,
    actual: Number,
  },
  {
    timestamps: true,
  }
);

export const Price = model("Price", PriceSchema);

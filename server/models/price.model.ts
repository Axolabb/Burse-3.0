import { Schema, model } from "mongoose";

const PriceSchema = new Schema(
  {
    color: String,
    costTOB: Number,
    bottom: Number,
    actual: Number,
    actual1: Number,
    actualGlobal: Number,
    angle: Number,
    diagonal: Number,
  },
  {
    timestamps: true,
  }
);

export const Price = model("Price", PriceSchema);

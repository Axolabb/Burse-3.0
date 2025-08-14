import { Schema, model } from "mongoose";

const ActionSchema = new Schema(
  {
    name: String,
    text: String,
    time: String,
  }
);

export const Action = model("Action", ActionSchema);

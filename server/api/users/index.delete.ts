import { Price } from "~/server/models/price.model";

import mongoose from "mongoose";

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    await mongoose.connect("mongodb://localhost:27017/VueBit2");
    await Price.deleteOne({}, { sort: { _id: 1 } });
  } catch (e) {
    console.error(e);
  }
});

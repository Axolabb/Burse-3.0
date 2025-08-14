import { Price } from "~/server/models/price.model";
import mongoose from "mongoose";
import { readBody } from 'h3'

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event));
  try {
    await mongoose.connect("mongodb://localhost:27017/VueBit2");
    const response = await Price.find();
    if (response.length >= 50) {
      await Price.deleteOne({}, { sort: { _id: 1 } });
    }
    const price = new Price({
      color: body.color,
      costTOB: body.costTOB,
      bottom: body.bottom,
      actual: body.actual,

    });
    await price.save();
    return response
  } catch (e) {
    console.error(e);
  }
});

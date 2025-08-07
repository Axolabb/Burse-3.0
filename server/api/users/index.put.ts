import { User } from "~/server/models/user.model";
import mongoose from "mongoose";
import { readBody } from 'h3'

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, ...data } = body; // title, category, description, price, image, asNew
  try {
    await mongoose.connect("mongodb://localhost:27017/Nuxtngo");
    await User.findByIdAndUpdate(
      id,
      {
        title: data.title,
        category: data.category,
        description: data.description,
        price: data.price,
        image: data.image,
        asNew: data.asNew,
      },
      { new: true }
    );
  } catch (e) {
    console.error(e);
  }
});

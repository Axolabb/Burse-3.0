import { User } from "~/server/models/user.model";
import mongoose from "mongoose";
import { getQuery } from 'h3'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  let user;
  const { isregged } = getQuery(event);
  try {
    await mongoose.connect("mongodb://localhost:27017/VueBit2");
    user = await User.findOne({ isregged: isregged });
  } catch (e) {
    console.error(e);
  }
  return user;
});

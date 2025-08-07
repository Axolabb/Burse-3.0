import { User } from "~/server/models/user.model";
import mongoose from "mongoose";

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  let product;
  const id = getRouterParam(event, "id");
  try {
    product = await User.findById(id);
  } catch (e) {
    console.error(e);
  }
  return product;
});

import { User } from "~/server/models/user.model";
import mongoose from "mongoose";
import { readBody } from 'h3'

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {user_id, isLogged, ...otherData} = body;
  try {
    await mongoose.connect("mongodb://localhost:27017/VueBit2");
    let response = await User.findOne(otherData);
    if (response) {
      if (isLogged === true && user_id !== null) {
        await User.findByIdAndUpdate(user_id, { isregged: false }, { new: true });
      }
      await User.findByIdAndUpdate(response._id, { isregged: true }, { new: true });
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
});
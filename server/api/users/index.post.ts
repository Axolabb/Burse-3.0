import { User } from "~/server/models/user.model";
import mongoose from "mongoose";

import { defineEventHandler } from 'h3'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {



  const body = await readBody(event);
  console.log(body)
  try {
    await mongoose.connect("mongodb://localhost:27017/VueBit2");
    const user = new User({
      login: body.login,
      password: body.password,
      mail: body.mail,
      balanse: body.balanse,
      bitbalanse: body.bitbalanse,
      icon: body.icon,
      isregged: true,
      
    });
     if (body.logged) {
       await User.findByIdAndUpdate(body.user_id, { isregged: false }, { new: true });
     }
    await user.save();
  
  } catch (e) {
    console.error(e);
  }
});

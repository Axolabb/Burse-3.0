import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  login: String,
  password: String,
  mail: String,
  balanse: Number,
  bitbalanse: Number,
  icon: String,
  isregged: Boolean
}, { 
  timestamps: true 
});
  
export const User = model("User", UserSchema);
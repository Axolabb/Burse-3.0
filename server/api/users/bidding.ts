import { User } from "~/server/models/user.model";
import mongoose from "mongoose";
import { useUserStore } from '~/stores/user';
import { readBody } from 'h3'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const userStore = useUserStore(); 
    await mongoose.connect("mongodb://localhost:27017/VueBit2");
    await User.findByIdAndUpdate(userStore.user._id, body, { new: true });
    
});
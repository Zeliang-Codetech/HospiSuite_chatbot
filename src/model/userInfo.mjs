import mongoose from "mongoose";

const userInfoSchema = {
  userNumber: { type: Number },
  userName: { type: String }
}

export const userInfoDB = mongoose.model("userInfo", userInfoSchema);
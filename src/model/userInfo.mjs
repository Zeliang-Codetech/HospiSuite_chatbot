import mongoose from "mongoose";

const userInfoSchema = {
  userNumber: {type: Number}
}

export const userInfoDB = mongoose.model("userInfo", userInfoSchema);
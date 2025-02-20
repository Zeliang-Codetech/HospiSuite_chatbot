import mongoose from "mongoose";


const userInfoSchema = {
  userNumber: {
    type: Number,
    required: true,
  },
  userName: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  chatHistory: [{
    query: {
      type: String,
      trim: true,
    },
    response: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}

export const userInfoDB = mongoose.model("userInfo", userInfoSchema);
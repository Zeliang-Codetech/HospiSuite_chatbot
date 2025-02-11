import mongoose from "mongoose";


const userInfoSchema = {
  userNumber: {
    type: Number
  },
  userName: {
    type: String
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
    // timestamp:{
    //   type: Date,
    //   default: new Intl.DateTimeFormat('en-IN', {
    //     timeZone: 'Asia/Kolkata',
    //     dateStyle: 'full',
    //     timeStyle: 'medium'
    // }).format(new Date())
    // }
  }]
}

export const userInfoDB = mongoose.model("userInfo", userInfoSchema);
import { serviceType } from "../utils/constants/servicetype.mjs";
import { axiosCall } from "../utils/axiosCall.mjs";
import { configDotenv } from "dotenv";
configDotenv();

let options;

export const responseHandler = async (userNumber, userMessage) => {
  try {
    if (serviceType[userMessage]) {
      // add credentials here
      let serviceType1 = serviceType[userMessage];
      serviceType1.headers.authkey = `${process.env.AUTH_KEY}`;
      serviceType1.data.recipient_number = userNumber;
      serviceType1.data.integrated_number = `${process.env.INTEGRATED_NUMBER}`;
      console.log(`serviceType[userMessage]: ${serviceType[userMessage]}`);
      // simulating a db call

      options = serviceType[userMessage];
    }
  } catch (error) {
    console.log(error);
  }
  //    call the axios function here
  const response = await axiosCall(options, userMessage);
  console.log(response);
};

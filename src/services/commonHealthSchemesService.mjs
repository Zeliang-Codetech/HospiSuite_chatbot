import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// util
import { isOnlyEmoji, isOnlySpecialChars } from "../utils/filter_utility/filterUserName.mjs";

export const commonHealthSchemesService = async (userNumber, userName, req, res) => {

  const options = {
    method: "POST",
    url: "https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/",
    headers: {
      authkey: `${process.env.AUTH_KEY}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    data: {
      recipient_number: userNumber,
      integrated_number: `${process.env.INTEGRATED_NUMBER}`,
      content_type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: "Explore Health Schemes",
        },
        body: {
        //   text: `Explore our comprehensive health services tailored just for you! 🌟\n\n• *ABHA & CMHIS Services* \n*1.* _Register online_\n*2.* _Access health & Insurance schemes_\n*3.*_Find empaneled hospitals effortlessly_\n\n• *Online Consultation*\n_Connect with expert healthcare professionals from the comfort of your home, anytime, anywhere!_`,
        // removed online consultation explanation for now. 
        text: `Explore our comprehensive health services tailored just for you! 🌟\n\n• *ABHA & CMHIS Services* \n*1.* _Register online_\n*2.* _Access health & Insurance schemes_\n*3.* _Find empaneled hospitals effortlessly_`,
        },
        footer: {
          text: "Online consultations are just a click away!",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "id1",
                title: "ABHA Services",
              },
            },
            {
              type: "reply",
              reply: {
                id: "id2",
                title: "CMHIS Services",
              },
            },
            // {
            //   type: "reply",
            //   reply: {
            //     id: "id3",
            //     title: "Online Consultation",
            //   },
            // },
          ],
        },
      },
    },
  };

  try {
    const response = await axios.request(options);
    return {
      success: true,
      message: "Greeting message sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error sending greeting message:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error: "Failed to send greeting message",
      details: error.response ? error.response.data : error.message,
    };
  }
};

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const resendOptionsService = async (userNumber) => {

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
          text: "Your're back on track! ",
        },
        body: {
          text: "Here’s a list of our services. Let me know how I can assist you! 😊",
        },
        footer: {
          text: "Thank you for using HospiSuite",
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
            {
              type: "reply",
              reply: {
                id: "id3",
                title: "Online Consultation",
              },
            },
          ],
        },
      },
    },
  };

  try {
    const response = await axios.request(options);
    return {
      success: true,
      message: "ResendOptions message sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error sending ResendOptions message:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error: "Failed to send ResendOptions message",
      details: error.response ? error.response.data : error.message,
    };
  }
};



import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


export const cmhisServices = async (userNumber, userName, req, res) => {
  let body = ``;

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
          text: "List of CMHIS services",
        },
        body: {
          text: body,
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
                title: " CMHIS Registration",
              },
            },
            {
              type: "reply",
              reply: {
                id: "id2",
                title: "Health & Insurance",
              },
            },
            {
              type: "reply",
              reply: {
                id: "id3",
                title: "Empaneled Hospitals",
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
      message: "CMHIS service message sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error sending CMHIS service message:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error: "Failed to send CMHIS service message",
      details: error.response ? error.response.data : error.message,
    };
  }
};

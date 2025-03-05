import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const abhaPinCodeErrorResponse = async (userNumber) => {

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
          text: "Could not find Hospitals 😔 ",
        },
        body: {
          text: "Oops! I couldn't find hospital details for the pincode you provided. We currently support ABHA-empaneled hospitals only in the Northeast regions of India.\n You can try again by clicking on _ABHA hospitals_ or click the menu for more options",
        },
        footer: {
          text: "🤖 Help us improve HospiSuite!",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "id1",
                title: "ABHA Hospitals",
              },
            },
            {
              type: "reply",
              reply: {
                id: "id2",
                title: "\u2630 Menu",
              },
            },
            {
              type: "reply",
              reply: {
                id: "id3",
                title: "Improve Hospisutie!",
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
      message: "PinCode error message sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error sending pincode Error message:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error: "Failed to send pincodeError message",
      details: error.response ? error.response.data : error.message,
    };
  }
};



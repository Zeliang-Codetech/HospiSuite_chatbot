import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getAbhaHospitalLocationbyPincode = async (userNumber) => {
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
          text: "🔍 Find ABHA empaneled hospitals",
        },
        body: {
          text: "Kindly enter the 6-digit pincode for the location you wish to search \n_EG: 797112_",
        },
        footer: {
          text: "Enter only the pincode number without any special characters",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "ID_1",
                title: "\u2630 Menu",
              },
            },
               // {
            //   type: "reply",
            //   reply: {
            //     id: "id2",
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
      message: "getLocationbyPincode message sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error sending getLocationbyPincode message:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error: "Failed to send getLocationbyPincode message",
      details: error.response ? error.response.data : error.message,
    };
  }
};

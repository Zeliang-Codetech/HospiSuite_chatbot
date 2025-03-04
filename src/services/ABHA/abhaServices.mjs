import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


export const abhaServices = async (userNumber, userName, req, res) => {
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
          text: "Welcome to ABHA Services! 🏥",
        },
        body: {
          text: `Let's simplify your healthcare journey. Choose from these powerful options:\n\n*1. ABHA Registration*\n_Your digital gateway to seamless healthcare aid and support. Register now!_\n\n*2. ABHA Care (Health & Insurance)*\n_Comprehensive protection and support. Explore personalized schemes, compare benefits, and find the perfect coverage for you!_\n\n*3. Empaneled Hospitals*\n_Discover trusted healthcare partners near you. Check facilities, and access specialized medical services_`,
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
                title: "ABHA Registration",
              },
            },
            {
              type: "reply",
              reply: {
                id: "id2",
                title: "ABHA Care",
              },
            },
            {
              type: "reply",
              reply: {
                id: "id3",
                title: "ABHA Hospitals",
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
      message: "ABHA service messages sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error sending ABHA service message:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error: "Failed to send ABHA service message",
      details: error.response ? error.response.data : error.message,
    };
  }
};

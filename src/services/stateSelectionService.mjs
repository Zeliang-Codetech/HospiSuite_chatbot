import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const stateSelectionService = async (userNumber) => {
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
      type: "list",
      header: {
        type: "text",
        text: "Find ABHA empaneled hospitals",
      },
      body: {
        text: "Please select your state by tapping Select your state. 🌍✨\n\n _In this initial release for HospiSuite, our empaneled hospital services will be available exclusively for Nagaland, with plans to expand soon in the upcoming releases.. Stay tuned!_ 🚀 ",
      },
      footer: {
        text: "We appreciate your patience and support!",
      },
      action: {
        button: "Select your state",
        sections: [
          {
            title: "nagaland",
            rows: [
              {
                id: "1",
                title: "Nagaland",
                description: "Find Abha empaneled hospitals in Nagaland",
              },
              //add more states here. Max of 10
            ],
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


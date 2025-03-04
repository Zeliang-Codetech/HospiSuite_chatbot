import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const tempOnlineConsultation = async (userNumber) => {

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
          text: "Online Doctor consultation 🩺",
        },
        body: {
          text: "COMING SOON! 🚀\n\n_We are working tirelessly to integrate online doctor consultations. Soon, you’ll be able to consult a doctor from the comfort of your home with ease!_",
        },
        footer: {
          text: "We appreciate your patience and support.",
        },
        action: {
          buttons: [
            {
                type: "reply",
                reply: {
                  id: "id1",
                  title: "Health Schemes Tour",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "id2",
                  title: "Improve HospiSuite!",
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



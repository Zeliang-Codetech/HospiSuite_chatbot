import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const body =
  "Your feedback helps us improve! ✨\n\nTake a moment to share your thoughts:\n👉(https://forms.office.com/r/TVA21DMHbB)";

export const feedbackService = async (userNumber) => {
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
          text: "🤖 Help Us Improve Hospisuite!",
        },
        body: {
          text: body,
        },
        footer: {
          text: "Tap the *Menu* button to explore main options.",
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
          ],
        },
      },
    },
  };

  try {
    const response = await axios.request(options);
    return {
      success: true,
      message: "Feedback message sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error sending Feedback message:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error: "Failed to send Feedback message",
      details: error.response ? error.response.data : error.message,
    };
  }
};

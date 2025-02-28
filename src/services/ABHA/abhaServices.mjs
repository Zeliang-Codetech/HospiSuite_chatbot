import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


export const abhaServices = async (userNumber, userName, req, res) => {
    let body = `Here's what you can explore:\n\n1️⃣ ABHA Registration
    - Create your digital health ID
    - Simplify your healthcare journey
    
    2️⃣ Health Schemes
    - Learn about the different health schemes available
    - Connect with healthcare providers
    
    3️⃣ Insurance Information
    - Learn about health insurance schemes
    - Understand coverage and benefits
    
    4️⃣ Empaneled Hospitals
    - Find ABHA-approved healthcare facilities
    - Locate hospitals near you
    `;

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
          text: "List of ABHA services",
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
                title: " ABHA Registration",
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

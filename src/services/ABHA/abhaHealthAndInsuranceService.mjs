import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const body =
  "Ayushman Bharat offers key health and insurance schemes to make healthcare more accessible and affordable. The PMJAY provides health insurance coverage up to ₹5 lakh per family for secondary and tertiary care, offering cashless treatment at empaneled hospitals. The Health and Wellness Centres (AB-HWCs) focus on primary healthcare, covering maternal, child health, and chronic disease management. Together, these schemes ensure inclusive and affordable healthcare nationwide, supported by digital infrastructure.";

export const HealthAndInsuranceService = async (userNumber) => {
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
          text: "ABDM HEALTH & INSURANCE SCHEMES",
        },
        body: {
          text: body,
        },
        footer: {
          text: "Click below to read more on...",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "ID_1",
                title: "Health schemes",
              },
            },
            {
              type: "reply",
              reply: {
                id: "id2",
                title: "Insurance schemes",
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
      message: "Health scheme message sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error sending health scheme message:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error: "Failed to send health scheme message",
      details: error.response ? error.response.data : error.message,
    };
  }
};

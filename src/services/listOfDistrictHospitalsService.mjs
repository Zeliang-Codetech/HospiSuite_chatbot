import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import Hospitals_name from "../utils/hospitalList.mjs";

export const listOfDistrictHospitals = async (userNumber, district) => {
  try {
    // Get hospitals data
    const distHospitals = await Hospitals_name(district);

    // Build message body using array join instead of string concatenation
    const messageBody = distHospitals
      .map(
        (hospital) =>
          `*NAME*: ${hospital.Hospital}\n` +
          `*SPECIALTY*: ${hospital.Speciality}\n` +
          `*TYPE*: ${hospital.Type}\n` +
          `*Direction*: ${hospital.Direction}\n\n`
      )
      .join("");

    console.log(
      `retrieving list of hospitals ${JSON.stringify(distHospitals, null, 2)}`
    );

    const options = {
      method: "POST",
      url: "https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/",
      headers: {
        authkey: process.env.AUTH_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      data: {
        recipient_number: userNumber,
        integrated_number: process.env.INTEGRATED_NUMBER,
        content_type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: `ABHA empaneled hospitals under ${district.toUpperCase()} district`,
          },
          body: {
            text: messageBody,
          },
          footer: {
            text: "Tap the *Menu* button or choose a state 😊",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "ID_1",
                  title: "Select State",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "ID_2",
                  title: "☰ Menu",
                },
              },
            ],
          },
        },
      },
    };

    const response = await axios.request(options);

    return {
      success: true,
      message: `list of hospitals sent successfully for ${district}`,
      data: response.data,
    };
  } catch (error) {
    console.error(
      `unable to send list of hospitals for ${district}`,
      error.response ? error.response.data : error.message
    );

    return {
      success: false,
      error: "Failed to send hospital list",
      details: error.response ? error.response.data : error.message,
    };
  }
};

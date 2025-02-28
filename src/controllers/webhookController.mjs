import { handleUserInteraction  } from "../utils/webhookUtility/webhookUtil.mjs";
import {responseHandler} from "../services/commonResponseHandler.mjs";

export const webhookController = async (req, res) => {
  let senderNumber = req.user.sender;
  let senderName = req.body.customer_name;
  let userMessage = req.userMsg;
  let locationType = req?.locationType;
  let location = req?.location;
  let button_result = null;
  let ai_result = null;
  let query = req?.query;

// // handle user interaction
// handleUserInteraction ({
//   senderNumber, 
//   senderName, 
//   locationType, 
//   userMessage, 
//   location, 
//   query, 
//   ai_result, 
//   button_result
// });

responseHandler(senderNumber, userMessage,  req, res);

};

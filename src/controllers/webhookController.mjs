import { handleUserInteraction  } from "../utils/webhookUtility/webhookUtil.mjs";

export const webhookController = async (req, res) => {
  let senderNumber = req.user.sender;
  let senderName = req.body.customer_name;
  let userMessage = req.userMsg;
  let button_result = null;
  let ai_result = null;
  let query = req?.query;
  let pinStatus = req.user?.location;
// handle user interaction
handleUserInteraction ({
  senderNumber, 
  senderName, 
  userMessage, 
  query, 
  ai_result, 
  button_result,
  pinStatus,
});

};

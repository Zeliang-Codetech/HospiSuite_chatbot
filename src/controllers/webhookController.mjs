// services
import { greetingService } from "../services/greetingService.mjs";
import { healthSchemeService } from "../services/healthSchemesService.mjs";
import { abhaRegistrationService } from "../services/abhaRegistrationService.mjs";
import { pmJayInfoService } from "../services/pmjayInformationService.mjs";
import { resendOptionsService } from "../services/resendOptionsService.mjs";
import { hwcService } from "../services/hwcService.mjs";
import { insuranceSchemes } from "../services/insuranceSchemesService.mjs";
import { sendAiResponseService } from "../services/sendAIresponse.mjs";
import { HealthAndInsuranceService } from "../services/healthAndInsuranceService.mjs";
import { stateSelectionService } from "../services/stateSelectionService.mjs";
import { districtSelectionService } from "../services/districtSelectionService.mjs";
import { listOfDistrictHospitals } from "../services/listOfDistrictHospitalsService.mjs";
import { feedbackService } from "../services/feedbackService.mjs";
// utils
import { callGeminiFlash } from "../utils/ai_Response_flash.mjs";
import { cacheStoreChat, getChatHistory } from "../model/storeChat.mjs";

// Service router map with O(1) lookup time
const serviceRouterforButtons = {
  greeting: greetingService,
  "health schemes": healthSchemeService,
  "more about pm-jay": pmJayInfoService,
  "more on hwcs": hwcService,
  "\u2630 menu": resendOptionsService,
  "abha registration": abhaRegistrationService,
  "insurance schemes": insuranceSchemes,
  "health & insurance": HealthAndInsuranceService,
  "empaneled hospitals": stateSelectionService,
  "select state": stateSelectionService,
  "improve hospisuite!": feedbackService,
};

const serviceRouterforStateLists = {
  nagaland: districtSelectionService,
};

export const webhookController = async (req, res) => {
  let senderNumber = req.user.sender;
  let senderName = req.body.customer_name;
  let userMessage = req.userMsg;
  let locationType = req?.locationType;
  let location = req?.location;
  let result = null;
  try {
    const buttonBasedService = serviceRouterforButtons[userMessage];
    const listBasedServiceforState = serviceRouterforStateLists[location];
    // const listBasedServiceforDistrict = serviceRouterforDistrictLists[location];

    // specific commands button based
    if (buttonBasedService) {
      result = await buttonBasedService(senderNumber, senderName ?? undefined);
      console.log("Button based command processed successfully!");
    } else if (listBasedServiceforState && locationType === "state") {
      result = await listBasedServiceforState(senderNumber);
      console.log("state selection processed successfully!");
    } else if (locationType == "district") {
      result = await listOfDistrictHospitals(senderNumber, location);
      console.log("district selection processed successfully!");
    }

    // Prompting the AI
    if (req.query != "") {
      try { 
        // get the laetst 5  || [] chatHisotry for the user here 
        // get 5 chat history from redis 
        // let recentChats = await recentChat(req.user.sender);         // fetching from redis
        let userChatHistory = await getChatHistory(req.user.sender);    //fetching AI-chat history  frm DB 
        console.log(`Printing userChatHistory from controler: =>${userChatHistory},${typeof(userChatHistory)}`)
        // // send the query, the chathistory from the db and the user number to the AI service
        result = await callGeminiFlash(req.query, userChatHistory, req.user.sender);    
        // result = await callGeminiFlash(req.query);   
        console.log("Gemini Flash Response:", result);
      } catch (error) {
        console.error("Gemini-flash failed:", error);
        result = {
          success: false,
          message: "AI response failed. Please try again later.",
        };
      }
      sendAiResponseService(senderNumber, result);
    }
    // Check result status
    if (result?.success !== undefined) {
      console.log({
        message: result.success
          ? "response successful"
          : "response unsuccessful",
        details: result,
      });
    } else {
      console.log("No handler found for this message");
    }
  } catch (error) {
    console.error("Error in webhook controller:", error);
  }
};

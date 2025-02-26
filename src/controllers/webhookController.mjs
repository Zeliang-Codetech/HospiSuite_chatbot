// services
import { greetingService } from "../services/greetingService.mjs";
import { healthSchemeService } from "../services/ABHA/healthSchemesService.mjs";
import { abhaRegistrationService } from "../services/ABHA/abhaRegistrationService.mjs";
import { pmJayInfoService } from "../services/ABHA/pmjayInformationService.mjs";
import { resendOptionsService } from "../services/resendOptionsService.mjs";
import { hwcService } from "../services/ABHA/hwcService.mjs";
import { insuranceSchemes } from "../services/ABHA/insuranceSchemesService.mjs";
import { sendAiResponseService } from "../services/sendAIresponse.mjs";
import { HealthAndInsuranceService } from "../services/ABHA/healthAndInsuranceService.mjs";
import { stateSelectionService } from "../services/stateSelectionService.mjs";
import { districtSelectionService } from "../services/districtSelectionService.mjs";
import { listOfDistrictHospitals } from "../services/listOfDistrictHospitalsService.mjs";
import { feedbackService } from "../services/feedbackService.mjs";

// utils
import { callGeminiFlash } from "../utils/ai_utility/ai_Response_flash.mjs";
import { cacheStoreChat, getChatHistory } from "../model/storeChat.mjs";
import { chatContext } from "../utils/db_utility/fetchChat.mjs";


// Service router map with O(1) lookup time
const serviceRouterforButtons = {
  "greeting": greetingService,
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
  let button_result = null,
    ai_result = null;

  try {
    const buttonBasedService = serviceRouterforButtons[userMessage];
    const listBasedServiceforState = serviceRouterforStateLists[location];
    // const listBasedServiceforDistrict = serviceRouterforDistrictLists[location];

    // specific commands button based
    if (buttonBasedService) {
      console.log("Button based command processed successfully!");
      button_result = await buttonBasedService(
        senderNumber,
        senderName ?? undefined
      );
    } else if (listBasedServiceforState && locationType === "state") {
      console.log("state selection processed successfully!");

      button_result = await listBasedServiceforState(senderNumber);
    } else if (locationType == "district" && req.query === "") {
      console.log("district selection processed successfully!");
      button_result = await listOfDistrictHospitals(senderNumber, location);
    }
    if (req.query != "" && location == "" && locationType == "") {
      try {
        let userChatHistory = await chatContext(req.user.sender); //fetching AI-chat history  form redis & DB_____
        if (userChatHistory)
          console.log(
            `\n\nchat history fetched in controller of type: ${typeof userChatHistory}`
          );
        // // send the query, the chathistory from the db and the user number to the AI service
        ai_result = await callGeminiFlash(
          req.query,
          userChatHistory,
          req.user.sender
        );
        sendAiResponseService(senderNumber, ai_result);
      } catch (error) {
        console.error("Gemini-flash failed:", error);
        ai_result = {
          success: false,
          message: "AI response failed. Please try again later.",
        };
      }
    }
    // Check result status
    if (ai_result?.success !== undefined) {
      console.log({
        message: ai_result.success
          ? "response successful"
          : "response unsuccessful",
        details: ai_result,
      });
    } else {
      console.log("No handler found for this message");
    }
  } catch (error) {
    console.error("Error in webhook controller:", error);
  }
};

import { greetingService } from "../../services/greetingService.mjs";
import { healthSchemeService } from "../../services/ABHA/abhaHealthSchemesService.mjs";
import { abhaRegistrationService } from "../../services/ABHA/abhaRegistrationService.mjs";
import { pmJayInfoService } from "../../services/ABHA/abhaPmjayInformationService.mjs";
import { resendOptionsService } from "../../services/resendOptionsService.mjs";
import { hwcService } from "../../services/ABHA/abhaHwcService.mjs";
import { insuranceSchemes } from "../../services/ABHA/abhaInsuranceSchemesService.mjs";
import { sendAiResponseService } from "../../services/sendAIresponse.mjs";
import { HealthAndInsuranceService } from "../../services/ABHA/abhaHealthAndInsuranceService.mjs";
import { stateSelectionService } from "../../services/stateSelectionService.mjs";
import { districtSelectionService } from "../../services/districtSelectionService.mjs";
import { listOfDistrictHospitals } from "../../services/listOfDistrictHospitalsService.mjs";
import { feedbackService } from "../../services/feedbackService.mjs";
import { cmhisServices } from "../../services/CMHIS/cmhisServices.mjs";
import { abhaServices } from "../../services/ABHA/abhaServices.mjs";
// utils
import { callGeminiFlash } from "../ai_utility/ai_Response_flash.mjs";
import { chatContext } from "../db_utility/fetchChat.mjs";

// Service router map with O(1) lookup time
const serviceRouterforButtons = {
  "greeting": greetingService,
  "cmhis services": cmhisServices,   
  "abha services": abhaServices,
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

export async function handleUserInteraction (options = {}){
  const {
    senderNumber,
    senderName,
    locationType = '',
    location = '',
    query = '',
    userMessage
  } = options;

        try {
          let button_result = null;
          let ai_result = null;
          const buttonBasedService = serviceRouterforButtons[userMessage];
          const listBasedServiceforState = serviceRouterforStateLists[location];

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
          } else if (locationType == "district" && query === "") {
            console.log("district selection processed successfully!");
            button_result = await listOfDistrictHospitals(senderNumber, location);
          }else if (query != "" && location == "" && locationType == "") {
            try {
              let userChatHistory = await chatContext(senderNumber); //fetching AI-chat history  form redis & DB_____
              if (userChatHistory)
                console.log(
                  `\n\nchat history fetched in controller of type: ${typeof userChatHistory}`
                );
              // // send the query, the chathistory from the db and the user number to the AI service
              ai_result = await callGeminiFlash(
                query,
                userChatHistory,
                senderNumber
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
            console.log("standard response sent successfully");
          }
        } catch (error) {
          console.error("Error in webhook controller:", error);
        }
}

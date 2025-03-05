import { greetingService } from "../../services/greetingService.mjs";
import { healthSchemeService } from "../../services/ABHA/abhaHealthSchemesService.mjs";
import { abhaRegistrationService } from "../../services/ABHA/abhaRegistrationService.mjs";
import { pmJayInfoService } from "../../services/ABHA/abhaPmjayInformationService.mjs";
import { resendOptionsService } from "../../services/resendOptionsService.mjs";
import { hwcService } from "../../services/ABHA/abhaHwcService.mjs";
import { insuranceSchemes } from "../../services/ABHA/abhaInsuranceSchemesService.mjs";
import { sendAiResponseService } from "../../services/sendAIresponse.mjs";
import { HealthAndInsuranceService } from "../../services/ABHA/abhaHealthAndInsuranceService.mjs";
import { feedbackService } from "../../services/feedbackService.mjs";
import { commonHealthSchemesService } from "../../services/commonHealthSchemesService.mjs";
import { abhaServices } from "../../services/ABHA/abhaServices.mjs";  
import { tempOnlineConsultation } from "../../services/tempOnlineConsultation.mjs";
import { getAbhaHospitalLocationbyPincode } from "../../services/getLocationbyPincode.mjs";
import { abhaHospitalsByPincode } from "../../services/findAbhaHospitalsByPincode.mjs";

// utils
import { callGeminiFlash } from "../ai_utility/ai_Response_flash.mjs";
import { chatContext } from "../db_utility/fetchChat.mjs";

// Service router map with O(1) lookup time
const serviceRouterforButtons = {
  "greeting": greetingService,
  "abha health schemes": healthSchemeService,
  "more about pm-jay": pmJayInfoService,
  "more on hwcs": hwcService,
  "\u2630 menu": resendOptionsService,
  "abha registration": abhaRegistrationService,
  "abha insurance": insuranceSchemes,
  "abha care": HealthAndInsuranceService,
  "abha hospitals": getAbhaHospitalLocationbyPincode,
  "improve hospisuite!": feedbackService,
  "health schemes tour": commonHealthSchemesService, 
  "abha services": abhaServices,
  "cmhis services": abhaServices,
  "online consultation": tempOnlineConsultation,
};



export async function handleUserInteraction (options = {}){
  const {
    senderNumber,
    senderName,
    query = '',
    userMessage, 
    pinStatus,
  } = options;

        try {
          let button_result = null;
          let ai_result = null;
          const buttonBasedService = serviceRouterforButtons[userMessage];

    
  if(userMessage === "abha hospitals" && pinStatus === "awaiting pincode") {
    // abha hospitals button was just clicked by the user
    // initialise a new object with the user number as key with pincode as an empty
    // send  get location by pincode message service here 
    button_result = await buttonBasedService(senderNumber); 
  }else if (pinStatus === "captured pincode"){
    button_result = await abhaHospitalsByPincode(senderNumber, userMessage);
  }else if (buttonBasedService) {
            console.log("Button based command processed successfully!");
            button_result = await buttonBasedService(
              senderNumber,
              senderName ?? undefined
            );
          }else if (query && query != "") {
            try {
               //fetching AI-chat history  form redis & DB_____
              let userChatHistory = await chatContext(senderNumber);
              if (userChatHistory)
                // console.log(
                //   `\n\nchat history fetched in controller of type: ${typeof userChatHistory}`
                // );
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

import { abhaPinCodeErrorResponse } from "../utils/constants/errorResponses/AbhPincodeErrorUtil.mjs";
const userSessions = {}; // Temporary user session storage

export const getUserData = async (req, res, next) => {
    try {
        console.log("Incoming webhook payload:", JSON.stringify(req.body, null, 2));

        if (!req.body) throw new Error("Empty request body");

        const message = req.body.messages?.[0];
        if (!message) throw new Error("No message data found");

        let messageText = "";
        let interactiveType = "";
        let location = "";

        const senderNumber = message.from;

        // Check if user has an active session
        if (userSessions[senderNumber]) {
            location = userSessions[senderNumber]; // Restore state
        }

        if (message.type === "interactive") {
            if (message.interactive?.button_reply) {
                messageText = message.interactive.button_reply.title;
                interactiveType = "button";
                let formattedMsg = messageText.toLowerCase();
                if (formattedMsg === "abha hospitals") {
                    location = "awaiting pincode";
                    userSessions[senderNumber] = "awaiting pincode"; // Save state
                }
            } else if (message.interactive.list_reply) {
                messageText = message.interactive?.list_reply.title;
                interactiveType = "list";
            }
        } else {
            messageText = message.text?.body || "";
            // Handle regular text messages (pincode entry)
            if (userSessions[senderNumber] === "awaiting pincode") {
                const pincodeRegex = /^\d{6}$/;
                let cleanPincode = message.text?.body?.trim();
                if (pincodeRegex.test(cleanPincode)) {
                    location = "captured pincode";
                    delete userSessions[senderNumber]; // Clear session after pincode is captured
                } else {
                    location = "awaiting pincode"; // Handle invalid pincode
                    abhaPinCodeErrorResponse(senderNumber);
                }
            }
        }

        let user = {
            sender: senderNumber,
            msg: messageText,
            name: req.body.customer_name,
            timestamp: message.timestamp,
            messageId: message.id,
            messageType: message.type,
            interactiveType,
            contentType: message.type || "unknown",
            location : location,
        };

        console.log("Processed message:", user);

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in checkUser middleware:", error);
        return res.status(400).json({
            error: "Failed to process message",
            details: error.message,
        });
    }
};

import dotenv from "dotenv";
import { healthQueries, linkGuidelines } from "./ai_prompt_roles.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cacheStoreChat, chatStore } from "../model/storeChat.mjs";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	generationConfig: {
		maxOutputTokens: 180, // Ensures response stays within 1024 characters
	},
});
// let chatHistory = [];
// keywords regex i makes the words case-agnostic : white spaces can cause issues
let linkKeywords = /insurance|registration|health schemes|pmjay|hwcs|register/i;
let userPrompt;

export const callGeminiFlash = async (query, chatHistory, userNumber) => {
	let history = chatHistory.chatHistory;
	// let chatHistory = chatHistory;
	try {
		// detect what type of query it is (either health querries , ....)
		if (linkKeywords.test(query)) {
			userPrompt = linkGuidelines + query;
			console.log("query matches link keywords");
		} else {
			let chatHistoryString = history == null ? '' : history
				.map((entry) => `User: ${entry.query}\nAI: ${entry.response}`)
				.join("\n");
			userPrompt = `Chat history String:\n${chatHistoryString}\n\n Your role: ${healthQueries}\n\n userQuery: ${query}`;
			// userPrompt = `Your role: ${healthQueries}\n\n userQuery: ${query}`;
			console.log("query matches standard chat");
			console.log("Chat History:", JSON.stringify(history, null, 2));
		}

		const prompt = userPrompt;
		const result = await model.generateContent(prompt);
		// if (history.length > 5) {
		// 	history.shift();
		// }

		// udpating the chathistory array 
		// history.push({ query: query, response: result.response.text() });
		// update the laest query to the database
		//-- find sender number in DB 
		// -- set the latest query which is "query and result.response.text();"
		const chat = {
			query: query,
			response: result.response.text()
		}
		console.log('Chat=>\n', chat);
		//instead of call mongoDB calling redis here to store the chats
		// await cacheStoreChat(number,chat)
		await chatStore(userNumber, chat);		//calling db to store latest chat & query.
		await cacheStoreChat(userNumber,chat)
		return {
			success: true,
			message: result.response.text(),
		};
	} catch (error) {
		console.error("Error in promptAi:\n", error);
		return {
			success: false,
			error: "Failed to get response from AI model",
		};
	}
};

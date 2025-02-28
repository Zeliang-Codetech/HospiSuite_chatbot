import dotenv from "dotenv";
import { healthQueries, linkGuidelines } from "./ai_prompt_roles.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cacheStoreChat, chatStore } from "../../model/storeChat.mjs";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	generationConfig: {
		maxOutputTokens: 180, // Ensures response stays within 1024 characters
	},
});

// keywords regex i makes the words case-agnostic : white spaces can cause issues
let linkKeywords = /insurance|registration|health schemes|pmjay|hwcs|register/i;
let userPrompt;

export const callGeminiFlash = async (query, chatHistory, userNumber) => {
	console.log(`user chat History : ${chatHistory}`);
	let history = chatHistory;
	try {
		// detect what type of query it is (either health querries , ....)
		if (linkKeywords.test(query)) {
			userPrompt = linkGuidelines + query;
			console.log("query matches link keywords");
		} else {
			let chatHistoryString = history == null ? '' : history
				.map((entry) => `User: ${entry.query}\nAI: ${entry.response}`)
				.join("\n");
			// console.log('\n\nChecking chatHistoryString after join operation:\n',chatHistoryString);	
			userPrompt = `\n\nChat history String:\n${chatHistoryString}\n\n Your role: ${healthQueries}\n\n userQuery: ${query}`;
			// userPrompt = `Your role: ${healthQueries}\n\n userQuery: ${query}`;
			console.log("query matches standard chat");
			console.log("\n\nChat History in gemini:", JSON.stringify(history, null, 2));
		}

		const prompt = userPrompt;
		const result = await model.generateContent(prompt);
		// first get the title from the string 
		// 
		// update the laest query to the database
		//-- find sender number in DB 
		// -- set the latest query which is "query and result.response.text();"
		const chat = {
			query: query,
			response: result.response.text()
		}

		let title , message, aiResponse; 
		aiResponse = result.response.text();
		// use reqex here to extract the title 
		const titleMatch = aiResponse.match(/__([^_]+)__/);
		title = titleMatch ? titleMatch[1] : '';
		console.log(`The title : ${title}`)
		// remove the title from the message body 
		message = aiResponse.replace(/__[^_]+__\n?/, '');
		console.log(`The response ${message}`)
		console.log('Chat=>\n', chat);
		//instead of call mongoDB calling redis here to store the chats
		cacheStoreChat(userNumber,chat)
		return {
			success: true,
			title: title,
			message: message,
		};
	} catch (error) {
		console.error("Error in promptAi:\n", error);
		return {
			success: false,
			error: "Failed to get response from AI model",
		};
	}
};

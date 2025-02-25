//TO BE TESTED

import { fetchChatFromRedis, getChatHistory } from "../../model/storeChat.mjs";

/**
 * Fetches chat history for a given user number from Redis or MongoDB
 * @param {string} userNumber - The user's number to fetch chat history for
 * @returns {Promise<Array<Object>>} - Returns array of chat history objects
 */

export const chatContext = async (userNumber) => {
  try {
    //call from redis and return(if chats exist)
    let chatHistory = await fetchChatFromRedis(userNumber);

    if (chatHistory && chatHistory.length > 0) {
      console.log(`\n\n****Returned Chat history from Redis:****`);
      return chatHistory;
    }

    //fall back to mongoDb if not found in redis
    let chatData = await getChatHistory(userNumber);
    console.log(`chatData from chatContext=>${chatData}`);
    chatHistory = chatData.chatHistory; // destructuring the array from the DB response

    console.log(`\n\n****Returned Chat history from DB:****}`);
    return chatHistory;
  } catch (error) {
    console.log(`\n\nError from fetchHistory util function: \n${error}`);
    throw error;
  }
};

//TO BE TESTED

import { fetchChatFromRedis, getChatHistory, redisToMongo } from "../model/storeChat.mjs";
import { cache } from "../redis.mjs";


/**
 * Fetches chat history for a given user number from Redis or MongoDB
 * @param {string} userNumber - The user's number to fetch chat history for
 * @returns {Promise<Array<Object>>} - Returns array of chat history objects
 */


export const chatContext = async (userNumber) => {
    //call from redis and return(if chats exist)
    try {
        // console.log('a')

        let chatHistory = await fetchChatFromRedis(userNumber)

        // console.log(`b=====${chatHistory}`)
        if (chatHistory && chatHistory.length > 0){
            // console.log('c')

            console.log(`****Returned Chat history from Redis:**** \n${chatHistory}`);
            return chatHistory;
        }
        // console.log('d')

        //(if empty)call mongo and  
        let chatData = await getChatHistory(userNumber);
        // console.log('e')

        chatHistory = chatData.chatHistory;    // destructuring the array from the DB response
        if (chatHistory && chatHistory.length > 0){
            // console.log('f')
        await cache.lPush(`chatHistory:${userNumber}`, chatHistory.map(chat => JSON.stringify(chat)));
        }
        console.log(`****Returned Chat history from DB:****: \n${chatHistory}`);
        // console.log('g')
        return chatHistory
    } catch (error) {
        console.log(`Error from fetchHistory util function: \n${error}`);
        throw error;
    }
}

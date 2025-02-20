//TO BE TESTED

import { fetchChatFromRedis, getChatHistory, redisToMongo } from "../model/storeChat.mjs";
import { cache } from "../redis.mjs";
import { redis } from "../redis.mjs";

/**
 * Fetches chat history for a given user number from Redis or MongoDB
 * @param {string} userNumber - The user's number to fetch chat history for
 * @returns {Promise<Array<Object>>} - Returns array of chat history objects
 */


export const chatContext = async (userNumber) => {
    try {
        // console.log('a')
        // const client = redis.client;
        // await redis.ConnectRedis();
        // console.log('\n\nCreating redis instance in fetchChat\n');
        let chatHistory = await fetchChatFromRedis(userNumber)

        //call from redis and return(if chats exist)
        if (chatHistory && chatHistory.length > 0) {
            // console.log('c')

            console.log(`\n\n****Returned Chat history from Redis:****`);
            return chatHistory;
        }
        // console.log('d')

        //(if empty)call mongo and  
        let chatData = await getChatHistory(userNumber);
        // console.log('e')
        console.log(`chatData from chatContext=>${chatData}`)
        chatHistory = chatData.chatHistory;    // destructuring the array from the DB response
        // if (chatHistory && chatHistory.length > 0) {
        //     // console.log('f')
        //     // cache.lPush(`chatHistory:${userNumber}`, chatHistory.map(chat => JSON.stringify(chat)));
        //     // client.lPush(`chatHistory:${userNumber}`, chatHistory.map(chat => JSON.stringify(chat)));               //temporary comment
        // }
        console.log(`\n\n****Returned Chat history from DB:****}`);
        // console.log('g')
        return chatHistory
    } catch (error) {
        console.log(`\n\nError from fetchHistory util function: \n${error}`);
        throw error;
    } finally {
        // redis.CloseRedis();
        // console.log('\n\nRedis instance closed in fetchChat.\n');
    }
}

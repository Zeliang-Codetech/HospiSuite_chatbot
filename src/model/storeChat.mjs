import { userInfoDB } from "./userInfo.mjs";
import { cache } from "../redis.mjs";


//mongoDB chat store
export const chatStore = async (number, history) => {

    console.log(`CALLING chatStore(${number})\n`);
    console.log(`user details to storeChat=> ${number}\n${history}`)
    console.log("checking1 DB=>", history)
    try {
        const ai_history = await userInfoDB.updateOne(
            { userNumber: number },
            { $push: { chatHistory: history } },
            { upsert: true }
        );
        return ai_history;
        //implement db error control

    } catch (error) {
        console.log('AI-history=> ', error);
        return "\nFailed to store chat!"
    }
}


// //new mongo DB chat store integrating Redis under testing phase:-
export const chatStoreFromRedis = async (number, history) => {
    console.log(`user details to storeChat=> ${number}\n${history}`)
    console.log("checking1 DB=>", history)
    try {
        const ai_history = await userInfoDB.updateOne(
            { userNumber: number },
            { $push: { chatHistory: { $each: history } } },
            { upsert: true }
        );
        return ai_history;
        //implement db error control

    } catch (error) {
        console.log('AI-history=> ', error);
        return "\nFailed to store chat!"
    }
}



//fetch mongoDB chat history 
export const getChatHistory = async (number) => {
    console.log(`CALLING getChatHistory(${number})\n`);

    try {
        const fetchHistory = await userInfoDB.findOne(
            { userNumber: number }).select({
                '_id': 0,
                'userName': 0,
                'userNumber': 0,
                '__v': 0,
                // 'chatHistory._id': 0,
                'chatHistory': {
                    $slice: -3,
                },
            });
        // console.log(`storeChat result : ${fetchHistory}`);
        return fetchHistory;
        //implement db error control
    } catch (error) {
        console.log('fetchHistory=> ', error);
        return "\nFailed to fetch previous chats!"
    }
}


//redis chatHistory store
export const cacheStoreChat = async (number, newChat) => {
    console.log(`CALLING cacheStoreChat(${number})\n`);

    try {
        // console.log(1)
        const chat = JSON.stringify(newChat)
        const recentChat = await cache.lPush(`chatHistory:${number}`, chat);
        // console.log(2)
        // console.log(`Fetched from redis:- ${recentChat}`);      //gives the latest length
        // console.log(3)
        if (recentChat >= 1000) {         //storing redis chats mongoDB, if chat length is 10 per user 
            const allChats = await cache.lRange(`chatHistory:${number}`, 0, -1);
            console.log(`allChats from redis=> \n${allChats}\ntype of All chats from redis`)
            console.log(typeof (allChats));
            const chatObjects = allChats.map(key => JSON.parse(key));
            // console.log(`chatObjects=> \n${...chatObjects}`)
            // console.log(...chatObjects);
            // console.log(typeof (chatObjects));
            const parsedResponse = redisToMongo(allChats)
            console.log(`Type of parsed response: ${typeof (parsedResponse)}`)
            console.log("checking Prsed cache response=>", parsedResponse)
            //check the present no. of chat in the list 
            // if 10 then move them to mongoDB, keeping latest 5 chats
            // await chatStore(number, parsedResponse);
            await chatStoreFromRedis(number, parsedResponse);
            console.log(`chatStoreFromRedis:- verfy with DB if its working or not...!`)
            
            // YET TO IMPLEMENT TRIM REDIS FUNCTION CALL;
        }

    } catch (error) {
        console.log(`Error in Cache store chat: \n${error}`);
        throw new error
    }

}


//redis chat History fetch
export const fetchChatFromRedis = async (number) => {
    console.log(`CALLING fetchChatFromRedis(${number})\n`)
    try {
        // Get latest  elements from the list (0 to 3)
        const chatHistory = await cache.lRange(`chatHistory:${number}`, 0, 2);
        // If no chat history found, return empty array
        if (!chatHistory || chatHistory.length === 0) {
            return [];
        }

        // Parse each chat message back to object if they were stored as strings

        return chatHistory.map(chat => {
            try {
                // return JSON.parse(chat);
                const parsed = JSON.parse(chat);
                return {
                    query: parsed.query,
                    response: parsed.response
                }

            } catch {
                console.log(`chatHistory map error`)
                return chat; // Return if not JSON string(need to handle error)
            }
        });

    } catch (error) {
        console.error('Error fetching chat history from Redis:', error);
        return [];
    }
}


// Parse redisResponse as it is array of strings from Redis
export const redisToMongo = (redisResponse) => {
    console.log(`CALLING redisToMongo()\n`)

    return redisResponse.map(item => {
        const parsed = JSON.parse(item);
        // Return only query and response properties
        return {
            query: parsed.query,
            response: parsed.response
        };
    });
};

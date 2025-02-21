import { userInfoDB } from "./userInfo.mjs";
import { cache } from "../redis.mjs";
// import { redis } from "../redis.mjs";



//old mongoDB chat store function
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

    } catch (error) {
        console.log('AI-history=> ', error);
        return "\nFailed to store chat!"
    }
}


//new mongo DB chat store function working with Redis :-
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
                'chatHistory': {
                    $slice: -3,         //fetch only 3 chats from redis
                },
            });
        return fetchHistory;
    } catch (error) {
        console.log('fetchHistory=> ', error);
        return "\nFailed to fetch previous chats!"
    }
}


//redis chatHistory store
export const cacheStoreChat = async (number, newChat) => {
    console.log(`CALLING cacheStoreChat(${number})\n`);
    try {
        /*
        const client = redis.client;        //not yet used
        await redis.ConnectRedis();
        console.log('\n\nCreating redis instance in cacheStoreChat\n');
*/
        const chat = JSON.stringify(newChat)
        let recentChat = await cache.lPush(`chatHistory:${number}`, chat);

        console.log(`Latest redis lenght:- ${recentChat}`);      //gives the latest length

        if (recentChat >= 5) {         //checking redis chats list is full
            const allChats = await cache.lRange(`chatHistory:${number}`, 3, 4);

            console.log(`\n\nallChats from redis after its length is grtr than 5 => \n${allChats}\ntype of All chats from redis`)
            console.log(typeof (allChats));

            const parsedResponse = redisToMongo(allChats)
            console.log(`\n\nType of parsed response: ${typeof (parsedResponse)}`)
            console.log("checking Prsed cache response=>", parsedResponse)

            await chatStoreFromRedis(number, parsedResponse);                                   //calling mongoDB to store Chat
            // TRIM REDIS FUNCTIONTO KEEP LATEST 3 chats;
            await cache.lTrim(`chatHistory:${number}`, 0, 2);

        }

    } catch (error) {
        console.log(`\n\nError in Cache store chat: \n${error}`);
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

        // console.log(`shit here  ${chatHistory}`);
        return chatHistory.map(chat => {
            try {
                return JSON.parse(chat);
            } catch {
                console.log(`chatHistory map error`)
                return chat; // Return if not JSON string(need to handle error)
            }
        });

    } catch (error) {
        console.error('\n\nError fetching chat history from Redis:', error);
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

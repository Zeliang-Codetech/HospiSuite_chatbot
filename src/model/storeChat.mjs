import { userInfoDB } from "./userInfo.mjs";
import { cache, client } from "../redis.mjs";
import { redis } from "../redis.mjs";

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
const client = redis.client;
await redis.ConnectRedis();
console.log('\n\nCreating redis instance in cacheStoreChat\n');

        const chat = JSON.stringify(newChat)
        let recentChat = await cache.lPush(`chatHistory:${number}`, chat);
// let recentChat = await client.lPush(`chatHistory:${number}`, chat );
        // console.log(2)
        console.log(`Latest redis lenght:- ${recentChat}`);      //gives the latest length

        // console.log(3)
        if (recentChat >= 5) {         //checking redis chats length, if chat length is 10 per user 
            const allChats = await cache.lRange(`chatHistory:${number}`, 3, 4);               
// const allChats = await client.lRange(`ChatHistory:${number}`,2,4);            
            //selecting redis elements to shift to db. Before that keep the latest 3.
            console.log(`\n\nallChats from redis after its length is grtr than 5 => \n${allChats}\ntype of All chats from redis`)
            console.log(typeof (allChats));
            // const chatObjects = allChats.map(key => JSON.parse(key));
            // console.log(`chatObjects=> \n${...chatObjects}`)
            // console.log(...chatObjects);
            // console.log(typeof (chatObjects));
            const parsedResponse = redisToMongo(allChats)
            console.log(`\n\nType of parsed response: ${typeof (parsedResponse)}`)
            console.log("checking Prsed cache response=>", parsedResponse)
            //check the present no. of chat in the list 
            // if 10 then move them to mongoDB, keeping latest 5 chats
            // await chatStore(number, parsedResponse);
    await chatStoreFromRedis(number, parsedResponse);                                   //calling mongoDB to store Chat
            // console.log(`chatStoreFromRedis:- verfy with DB if its working or not...!`)
            // TRIM REDIS FUNCTIONTO KEEP LATEST 3 chats;
            await cache.lTrim(`chatHistory:${number}`, 0,2);
// await client.lTrim(`chathistory:${number}`,0,2);            
            // const trimmed_length = await cache.lLen(`chatHiistory:${number}`);
            // console.log(`\n\nTrimmed upto latest chat in redis. latest length: ${trimmed_length}.`)
        }

    } catch (error) {
        console.log(`\n\nError in Cache store chat: \n${error}`);
    } finally{
//         console.log('Finally block in cacheStoreChat')
// await redis.CloseRedis();
// console.log('\n\nRedis instance closed in cacheStoreChat.\n');
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
/*
        // Parse each chat message back to object if they were stored as strings
        
        // let stringToObj = JSON.parse(chatHistory);
        // first split the string by },{ 
        // process each item 
        // let toBeGivenToGemini = []
        // let redisString = JSON.stringify(chatHistory);
        // // console.log(`redis string : ${redisString}`)
        // // let cleanItems = redisString.split("},{");
        // const items = redisString.split("},{")
        // items.forEach((el, index) => {
        //     // console.log(`This is a clean Item : ${cleanItem}`)
        //         // format the string here to an array of objects here
        //         const parsedItem = JSON.parse(el);
        //         toBeGivenToGemini.push(parsedItem);
        //         // console.log(`TO BE GIVEN TO GEMINI  : ${toBeGivenToGemini}`);
        // });
*/

        // console.log(`shit here  ${chatHistory}`);
        return chatHistory.map(chat => {
            try {
                return JSON.parse(chat);
            } catch {
                console.log(`chatHistory map error`)
                return chat; // Return if not JSON string(need to handle error)
            }
        });
        // return toBeGivenToGemini;

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

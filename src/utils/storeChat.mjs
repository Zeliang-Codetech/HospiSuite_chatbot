import mongoose from "mongoose";
import { checkUser } from "./checkUser.mjs";
import { userInfoDB } from "../model/userInfo.mjs";


export const chatStore = async (number, history) => {
    console.log(`user details to storeChat=> ${number}\n${history}`)
    try {
        const ai_history = await userInfoDB.updateOne({ userNumber: number }, { $push: { chatHistory: history } }, { upsert: true });
        return ai_history;
        //implement db error control

    } catch (error) {
        console.log('AI-history=> ', error);
        return "\nFailed to store chat!"
    }
}

export const getchatHistory = async (number) => {
    try {
        const fetchHistory = await userInfoDB.findOne(
            { userNumber: number }).select({
                '_id': 0,
                'userName': 0,
                'userNumber': 0,
                '__v': 0,
                // 'chatHistory._id': 0,
                'chatHistory': {
                    $slice: -5,
                    // $eleMatch: {
                    //     _id: 0,
                    //     query: 1,
                    //     response: 1
                    // }
                },
            });
        console.log(`storeChat result : ${fetchHistory}`);
        return fetchHistory;
        //implement db error control
    } catch (error) {
        console.log('fetchHistory=> ', error);
        return "\nFailed to fetch previous chats!"
    }
}
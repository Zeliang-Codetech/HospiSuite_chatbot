import { userInfoDB } from "../model/userInfo.mjs";

export const checkUser = async (name, number) => {

    try {
        console.log(name, number);
        const update = await userInfoDB.updateOne({ userNumber: number }, { $set: { userNumber: number, userName: name } }, { upsert: true });

    } catch (error) {
        console.log(error);
    }
}


import { userInfoDB } from "./userInfo.mjs";

export const checkUser = async (name, number) => {

    try {
        console.log(name, number);
        const update = await userInfoDB.updateOne({ userNumber: number }, { $set: { userNumber: number, userName: name, } }, { upsert: true });
        const user = await userInfoDB.find({userNumber: number});
        console.log(user);
    } catch (error) {
        console.log(error);
    }
}


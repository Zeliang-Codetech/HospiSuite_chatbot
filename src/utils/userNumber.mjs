import { userInfoDB } from "../model/userInfo.mjs";

async function check_number(number) {
    try { 
        const userNumbers = await userInfoDB.exists({ userNumber: number });
        if (userNumbers) {
            // dont store
            console.log(`user Number exists : ${userNumbers}`);
             return true;
        } else {
            // store
            return false;
        }
    } catch (err) {
        console.log(`could not find user: ${err}`);
        return false;
    }
}

export default check_number; 
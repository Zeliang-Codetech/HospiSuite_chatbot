import { hospitalDB } from "../model/empanelled_hospital.mjs";

async function Hospitals_name(state, district) {
    try {
        const hospitals = await hospitalDB.find({ State: state, District: district });
        console.log(hospitals)
    } catch (error) {
        console.log(error)
    }
}

export default Hospitals_name;
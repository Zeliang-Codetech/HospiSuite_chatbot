// import { hospitalDB } from "./empanelled_hospital.mjs";
import {abhaHospitalDB} from "./abha_hospitals.mjs";

async function Hospitals_name(pincode) {
    try {
        const hospitals = await abhaHospitalDB.find({Pincode: pincode}, null, { limit: 5 }).lean();
        console.log(hospitals)
        return hospitals;
    } catch (error) {
        console.log(error);
    }
}

export default Hospitals_name;
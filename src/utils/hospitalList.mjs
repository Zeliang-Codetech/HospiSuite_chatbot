import { hospitalDB } from "../model/empanelled_hospital.mjs";

async function Hospitals_name(district) {
    try {
        const hospitals = await hospitalDB.find({ District: { $regex: district, $options: 'i' } },null,{limit:5}).lean();
        return hospitals;
    } catch (error) {
        console.log(error)
    }
}

export default Hospitals_name;
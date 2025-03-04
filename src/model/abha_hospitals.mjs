import mongoose from "mongoose";
// import mongoose from '../database.mjs'
const abhaHospitalSchema = new mongoose.Schema({
    Facility_Id: {
        type: String,
        // // required: true,
        // max: 30,
    },
    Name: {
        type: String,
    },
    District: {
        type: String,
    },
    Address: {
        type: String,
    },
    Contact: {
        type: Number,
    },
    Type: {
        // type: String,
    },
    Speciality: {
        type: String,
    },
    Direction: {
        type: String,
    },
    State:{
        type:String
    },
    Pincode:{
        type: Number
    }
});

export const abhaHospitalDB = mongoose.model("abha_hospital", abhaHospitalSchema);
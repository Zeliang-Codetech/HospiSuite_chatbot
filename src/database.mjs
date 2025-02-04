import dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGO_URI;
dotenv.config();

mongoose.connect(uri)
    .then(() => {
            console.log(`Connected to database`);
    }).catch((error) => {
        console.log(`DB Connection-state value: ${mongoose.connection.readyState}`);
        console.log(`Could not Connected to database ${error}`);
    })

export default mongoose;

import dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGO_URI;
const options = {
    serverSelectionTimeoutMS: 30000,        //How long the MongoDB Node.js driver will attempt to retry any operation before erroring out: 10 secs
    socketTimeoutMS: 10000*60,             //How long the MongoDB driver will wait before killing a socket due to inactivity after initial connection: 1 min
};

/*
Connection ready state

0 = disconnected
1 = connected
2 = connecting
3 = disconnecting
99 = uninitialized
*/

mongoose.connect(uri, options)
    .then(() => {
        console.log(`Connected to database`);
        console.log(`DB Connection-state value: ${mongoose.connection.readyState}`);

    }).catch((error) => {
        console.log(`DB Connection-state value: ${mongoose.connection.readyState}`);
        console.log(`\n\nCould not Connected to database ${error}`);
    })

export default mongoose;



   
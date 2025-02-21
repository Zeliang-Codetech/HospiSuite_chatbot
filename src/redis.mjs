import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        connectTimeout: 10000,      //quit for connecting after : 10 sec 
        idleTimeout: 10000*60,       //close idle connection after 10 mins
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                return new Error('Too many retries, giving up');
            }
            return Math.min(retries * 50, 500);
        }
    }
});

client.on('error', err => console.log('\n\nREDIS CLIENT Error:\n', err));
export const cache = await client.connect();        //currently used for redis connection

await client.set('Too', 'choco');
const result = await client.get('Too');
console.log('redisCheck',result)  // >>> bar



//connect to redis
export const ConnectRedis = async ()=>{
    try{
        if(!client.isOpen){
            await client.connect(); 
            console.log('\n\n<Connected to Redis!>');
        }
    }catch(error){
        console.log(`\n\nError in ConnectRedis:\n${error}`);
    }    
}

//close redis connection
export const CloseRedis = async () =>{
    try{
        if(client.isOpen){
            await client.quit();
            console.log('\n\n<Redis Connection Closed!>')
        } 
    }catch(error){
        console.log(`\n\nFailed to close Redis connection:\n${error}`);
    }
}

export const redis = {
    client,
    ConnectRedis,
    CloseRedis
}
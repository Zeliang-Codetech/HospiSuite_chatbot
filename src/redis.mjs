    import { createClient } from "redis";
    import dotenv from "dotenv";

    dotenv.config();
    // export const client = createClient({
    //     username: process.env.REDIS_USERNAME,
    //     password: process.env.REDIS_PASSWORD,
    //     socket: {
    //         host: process.env.REDIS_HOST,
    //         port: process.env.REDIS_PORT,
    //         connectTimeout: 10000,      //quit for connecting after : 10 sec
    //         idleTimeout: 10000*60,       //close idle connection after 10 mins
    //         reconnectStrategy: (retries) => {
    //             if (retries > 5) {
    //                 return new Error('Too many retries, giving up');
    //             }
    //             return Math.min(retries * 50, 500);
    //         }
    //     }
    // });

    // NEW CODE - Using URL format
    export const client = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${
        process.env.REDIS_HOST
    }:${process.env.REDIS_PORT || "18881"}`,

    socket: {
        connectTimeout: 10000,
        idleTimeout: 10000 * 60,
        reconnectStrategy: (retries) => {
        if (retries > 10) {
            return new Error("Redis connection failed");
        }
        return Math.min(retries * 1000, 3000);
        },
    },
    });

    client.on("error", (err) => console.log("\n\nREDIS CLIENT Error:\n", err));
    export const cache = await client.connect(); //currently used for redis connection

    await client.set("test", "successful");
    const result = await client.get("test");
    console.log("redisCheck", result); // >>> bar

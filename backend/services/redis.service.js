 import Redis from "ioredis";

 const redisClient = new Redis({
    host: process.env.Redis_HOST,
    port:  process.env.Redis_PORT,
    password:  process.env.Redis_PASSWORD,
 });


 redisClient.on('connect', () => {
    //console.log('Redis connected');
      console.log('Redis client connected successfully');
 });

 redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

 export default redisClient;
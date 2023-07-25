// const Redis = require("ioredis");

// const redis = new Redis({
//   host: "localhost",
//   port: 6379,
// });

// (async () => {
//   const result = await redis.get("foo");
//   console.log(result);
// })();

// const CacheService = require("./src/services/redis/CacheService");

// const cacheService = new CacheService();

// (async () => {
//   await cacheService.set("foo", "hallo ini bar");
// })();

// (async () => {
//   try {
//     const result = await cacheService.get("foo");
//     console.log(result);
//   } catch (error) {
//     console.log("oops, error nih", error);
//   }
// })();

const { createClient } = require("redis");

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await client.connect();
})();

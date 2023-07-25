const redis = require("redis");
const Redis = require("ioredis");

class CacheService {
  constructor() {
    // this._client = redis.createClient({
    //   socket: {
    //     host: process.env.REDIS_SERVER,
    //   },
    // });

    // this._client.on("error", (err) => console.log("Redis Client Error", err));

    // this._client.connect();
    this._client = new Redis();
  }

  async set(key, value, expirationInSecond = 3600) {
    // await this._client.set(key, value, {
    //   EX: expirationInSecond,
    // });
    await this._client.set(key, value, "EX", expirationInSecond);
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error("Cache tidak ditemukan");

    return result;
  }

  delete(key) {
    // mengembalikan jumlah nilai yang dihapus pada cache dalam bentuk promise
    return this._client.del(key);
  }
}

module.exports = CacheService;

const redis = require("redis")

const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD || undefined,
})

client.on("error", (err) => console.log("Redis Client Error", err))
client.connect().catch((err) => console.log("Redis Connection Error:", err))

module.exports = client

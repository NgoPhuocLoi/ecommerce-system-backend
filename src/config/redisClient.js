const { createClient } = require("redis");

const redisClient = createClient({
  password: "N4ctCP96SMoVtle4QD9LtWCjacDsLEXk",
  socket: {
    host: "redis-14201.c334.asia-southeast2-1.gce.redns.redis-cloud.com",
    port: 14201,
  },
}).on("error", (err) => console.log("Redis Client Error", err));

function connectRedis() {
  redisClient.connect().then(() => {
    console.log("Connected to Redis");
  });
}

module.exports = { redisClient, connectRedis };

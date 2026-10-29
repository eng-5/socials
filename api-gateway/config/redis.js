// config/redis.js
const Redis = require('ioredis');
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error('REDIS_URL is not set - check your .env file');
}

const redis = new Redis(redisUrl);

redis.on('error', (err) => console.error('Redis connection error:', err));

module.exports = redis;
// config/redis.js
const Redis = require('ioredis');

if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not set - check your .env file');
}

const redis = new Redis(process.env.REDIS_UR);

redis.on('error', (err) => console.error('Redis connection error:', err));

module.exports = redis;
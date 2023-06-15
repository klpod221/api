const kue = require('kue');
const dotenv = require('dotenv').config();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const queue = kue.createQueue({
    redis: redisUrl,
    prefix: 'q',
    jobEvents: false
});

module.exports = queue;
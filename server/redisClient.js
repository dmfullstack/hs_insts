const redis = require('redis');
const {redisHost, redisPort} = require('./config');

const redisClient = redis.createClient(redisPort, redisHost);

module.exports = redisClient;

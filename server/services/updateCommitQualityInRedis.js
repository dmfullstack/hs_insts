const redisClient = require('../redisClient').duplicate();

function updateCommitQualityInRedis(commitId, val, done) {
  redisClient.hset('commitQuality', commitId, val, done);
}

module.exports = updateCommitQualityInRedis;

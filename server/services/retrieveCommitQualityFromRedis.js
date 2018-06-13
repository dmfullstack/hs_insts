const redisClient = require('../redisClient').duplicate();
const getFormattedResponse = require('./getFormattedResponse');

function retrieveCommitQualityFromRedis(commitId, done) {
  redisClient.hget('commitQuality', commitId, (err, response) => {
    if(err) { done(err); }
    if(response === 'evaluation') { done(null, response); return; }
    if(response === null) { done(null, null); return; }
    console.log('response:', response);
    return done(null, getFormattedResponse(JSON.parse(response)));
  });
}

module.exports = retrieveCommitQualityFromRedis;

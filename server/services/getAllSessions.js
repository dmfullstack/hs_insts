const redisClient = require('../redisClient').duplicate();

function getAllSessions(done) {
  redisClient.get('currentSession', (err, sessionString) => {
    if(err) { done(err); return; }
    const currentSession = JSON.parse(sessionString);
    redisClient.lrange('sessions', 0, -1, (err, sessionsString) => {
      if(err) { done(err); return; }
      console.log('SessionsString:', sessionsString);
      const sessions = sessionsString.map(JSON.parse);
      if(currentSession) sessions.unshift(currentSession);
      done(null, sessions);
    });
  });
}

module.exports = getAllSessions;

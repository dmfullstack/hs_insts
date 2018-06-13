const amqp = require('amqplib/callback_api');
const config = require('./config');

let connection = {};

module.exports = function() {
  const amqpConfigKey = arguments.length > 0 ? arguments[0] : 'amqpURL';
  const amqpURL = config[amqpConfigKey];
  const callback = arguments[arguments.length - 1];

  if(connection[amqpURL]) { callback(null, connection[amqpURL]); return; }
  amqp.connect(amqpURL, (err, newConnection) => {
    if(err) { callback(err); return; }
    connection[amqpURL] = newConnection;
    callback(null, connection[amqpURL]);
  });
};

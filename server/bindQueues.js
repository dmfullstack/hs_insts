const async = require('async');
const getAmqpConnection = require('./getAmqpConnection');

function bindQueues(exchange, events, queues, done) {
	async.waterfall([
		getAmqpConnection,
		getAmqpChannel,
		assertExchange.bind(null, exchange),
		assertQueues.bind(null, queues),
		configureQueueBindings.bind(null, exchange, events, queues)
	], done);
}

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
  });
}

function assertQueues(queues, channel, done) {
	async.each(queues, (queue, callback) => {
		channel.assertQueue(queue, {durable: true}, callback);
	}, (err) => {
		if(err) { return done(err); }
		done(null, channel);
	});
}

function assertExchange(exchange, channel, done) {
	channel.assertExchange(exchange, 'direct', {durable: true}, (err) => {
		if(err) { return done(err); }
		done(null, channel);
	});
}

function configureQueueBindings(exchange, events, queues, channel, done) {
	async.each(events, bindEventToQueues.bind(null, exchange, channel, queues), done);
}

function bindEventToQueues(exchange, channel, queues, event, done) {
	async.each(queues, bindEventToQueue.bind(null, exchange, channel, event), done);
}

function bindEventToQueue(exchange, channel, event, queue, done) {
	channel.bindQueue(queue, exchange, event, {}, done);
}

module.exports = bindQueues;

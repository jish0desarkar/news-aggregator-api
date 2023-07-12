const redis = require('redis');
const logger = require('../libs/logger')

const client = redis.createClient({
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT || 14903
	}
});

client.connect().then(() => {
	logger.info('Connected to redis')
})


module.exports = client
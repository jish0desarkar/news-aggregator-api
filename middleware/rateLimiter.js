const redisClient = require("../services/redisService")

const tokenLimit = 10 // requests
const thresholdInSeconds = 60 // per 60 seconds

const rateLimiter = async (req, res, next) => {
	const identifier = req.ip

	const response = await redisClient.multi().incr(identifier).ttl(identifier).exec()
	const requestsTillNow = response[0]

	// If its the first request the reset will be after 60 seconds
	const resetInSeconds = requestsTillNow === 1 ? thresholdInSeconds : response[1];

	/* checking if the current request is the first request
	made by the `identifier` in 60 seconds. If so set the expiry */
	if (requestsTillNow === 1) {
		await redisClient.expire(identifier, thresholdInSeconds)
	}

	// No more requests allowed
	if (requestsTillNow > tokenLimit) {
		setResponseHeaders(res, 0, resetInSeconds)
		return res.status(429)
			.send({ error: `too many requests, retry after ${resetInSeconds} seconds` })
	}
	setResponseHeaders(res, (tokenLimit - requestsTillNow), resetInSeconds)
	next()
}

function setResponseHeaders(res, remainingRequests, ttl) {
	const headers = {
		'RateLimit-Limit': tokenLimit,
		'RateLimit-Remaining': remainingRequests,
		'RateLimit-Reset': new Date(Date.now() + ttl * 1000) // converting ttl seconds to ms,
	};

	if (remainingRequests === 0) {
		headers['Retry-After'] = ttl;
	}
	res.set(headers);
}

module.exports = {
	rateLimiter
}
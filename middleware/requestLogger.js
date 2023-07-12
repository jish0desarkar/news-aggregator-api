const logger = require("../libs/logger")

const requestLogger = (req, res, next) => {
	const httpVersion = req.httpVersion
	const ip = req.ip
	const path = req.path
	const protocol = req.protocol
	const method = req.method
	const userAgent = req.get('user-agent')
	const message = `IP: ${ip}, Path: ${path}, Protocol: ${protocol}/${httpVersion}, Method: ${method}, UserAgent: ${userAgent}`
	logger.http(message)
	next()
}

module.exports = {
	requestLogger
}
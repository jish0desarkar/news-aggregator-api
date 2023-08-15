const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize, errors, json, simple } = format

const logger = createLogger()

if (['test', 'development'].includes(process.env.NODE_ENV)) {
	logger.add(new transports.Console({
		level: 'debug',
		format: combine(
			colorize(),
			timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			errors({ stack: true }), // prints the stack trace 
			printf(({ level, message, timestamp }) => {
				return `${timestamp} ${level}: ${message}`;
			})
		)
	}))
}

if (['staging', 'production'].includes(process.env.NODE_ENV)) {
	logger.add(new transports.File({
		filename: 'server-logs.log',
		level: 'http',
		format: combine(
			timestamp(),
			errors({ stack: true }), // prints the stack trace 
			json() // JSON is recommended for log aggregators such as CloudWatch, Loggly and Datadog etc
		)
	}))

	//Logging a minimal version to the server live logs
	logger.add(new transports.Console({
		level: 'http',
		format: simple(),
	}))
}

module.exports = logger
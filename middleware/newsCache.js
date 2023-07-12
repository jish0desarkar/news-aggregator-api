const redisClient = require("../services/redisService")
const logger = require("../libs/logger")

const getNewsArticlesFromCache = (key = '') => {
	return async (req, res, next) => {
		try {
			const cachedArticles = await redisClient.get(key);
			if (cachedArticles) {
				logger.info(`cache hit for ${req.user.email}`);
				return res.status(200).json(JSON.parse(cachedArticles));
			} else {
				next();
			}
		} catch (error) {
			logger.error(error);
			next(error);
		}
	};
};

module.exports = {
	getNewsArticlesFromCache
}
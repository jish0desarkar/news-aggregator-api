// const fs = require("fs").promises
const { searchArticlesWithKeyword, searchArticlesWithPreferences } = require("../services/newsSearchService.js")
const redisClient = require("../services/redisService.js")
const { updateArticleForUser, fetchArticlesForUser } = require("../helpers/util.js")
const CACHE_TTL = 600

// Endpoint - /news
const getArticlesWithPreferences = async (req, res) => {
	const preferences = req.user.preferences
	const sources = req.user.sources
	try {
		const response = await searchArticlesWithPreferences(preferences, sources)
		if (response.length === 0) { return res.status(404).json({ message: "No articles found!" }) }
		redisClient.setEx(`${req.user.email}:prefered_articles`, CACHE_TTL, JSON.stringify({ articles: response }))
		return res.status(200).send({ articles: response })
	} catch (err) {
		return res.status(500).send({ message: err.message })
	}
}

// Endpoint - /news/search/:keyword
/**
 * The function `getArticlesWithKeyword` is an asynchronous function that searches for articles with a
 * given keyword and returns the results in the response.
 * @param req - The `req` parameter is the request object, which contains information about the
 * incoming HTTP request, such as the request headers, request parameters, request body, etc. In this
 * case, `req.params.keyword` is used to access the value of the `keyword` parameter in the URL path.
 * @param res - The "res" parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or sending an error message.
 * @returns a response object with the status code and message. If the response length is 0, it returns
 * a 404 status code with a message indicating that no articles were found. If there are articles
 * found, it returns a 200 status code with the articles in the response body. If there is an error, it
 * returns a 500 status code with the error message.
 */
const getArticlesWithKeyword = async (req, res) => {
	const keyword = req.params.keyword
	try {
		const response = await searchArticlesWithKeyword(keyword)
		if (response.length === 0) {
			return res.status(404)
				.json({ message: `No articles found with for keyword - ${keyword}!` })
		}
		redisClient.setEx(`${req.user.email}:search_${keyword}_articles`, CACHE_TTL, JSON.stringify({ articles: response.hits }))
		return res.status(200).send({ articles: response.hits })
	} catch (err) {
		return res.status(500).send({ message: err.message })
	}
}

// Endpoint - /news/:id/read
const addReadArticleForUser = async (req, res) => {
	const updatedReadArticlesResponse = updateArticleForUser(req, "read")
	return res.status(updatedReadArticlesResponse.statusCode).send({
		message: updatedReadArticlesResponse.message,
		readArticles: updatedReadArticlesResponse.articles
	})
}

// Endpoint - /news/:id/favorite
const addFavoriteArticleForUser = async (req, res) => {
	const updatedReadArticlesResponse = updateArticleForUser(req, "favorites")

	return res.status(updatedReadArticlesResponse.statusCode).send({
		message: updatedReadArticlesResponse.message,
		favoriteArticles: updatedReadArticlesResponse.articles
	})
}

// Endpoint - /news/read
const getReadArticleForUser = async (req, res) => {
	const response = fetchArticlesForUser(req, "read")
	redisClient.setEx(`${req.user.email}:read_articles`, CACHE_TTL, JSON.stringify({
		message: response.message,
		readArticles: response.articles
	}))
	return res.status(response.statusCode).send({
		message: response.message,
		readArticles: response.articles
	})
}

// Endpoint - /news/favorites
const getFavoriteArticleForUser = async (req, res) => {
	const response = fetchArticlesForUser(req, "favorites")
	redisClient.setEx(`${req.user.email}:favorite_articles`, CACHE_TTL, JSON.stringify({
		message: response.message,
		favoriteArticles: response.articles
	}))
	return res.status(response.statusCode).send({
		message: response.message,
		favoriteArticles: response.articles
	})
}


module.exports = {
	getArticlesWithPreferences,
	getArticlesWithKeyword,
	addReadArticleForUser,
	addFavoriteArticleForUser,
	getReadArticleForUser,
	getFavoriteArticleForUser
}
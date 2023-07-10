// const fs = require("fs").promises
const { searchArticlesWithKeyword, searchArticlesWithPreferences } = require("../services/newsSearchService.js")

const { updateArticleForUser, fetchArticlesForUser } = require("../helpers/util.js")

// Endpoint - /news
const getArticlesWithPreferences = async (req, res) => {
	const preferences = req.user.preferences
	const sources = req.user.sources
	const response = await searchArticlesWithPreferences(preferences, sources)
	return res.status(200).send({ articles: response })
}

// Endpoint - /news/search/:keyword
const getArticlesWithKeyword = async (req, res) => {
	const response = await searchArticlesWithKeyword(req.params.keyword)
	return res.status(200).send({ articles: response.hits })
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
	return res.status(response.statusCode).send({
		message: response.message,
		readArticles: response.articles
	})
}

// Endpoint - /news/favorites
const getFavoriteArticleForUser = async (req, res) => {
	const response = fetchArticlesForUser(req, "favorites")
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
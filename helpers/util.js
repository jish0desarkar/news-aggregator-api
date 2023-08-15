const fs = require("fs").promises
const path = require("path")
const _ = require("lodash")
require('dotenv').config

if (process.env.NODE_ENV !== "test") {
	var userFileName = 'users.json'
	var articleFileName = 'articles.json'
}
else {
	var userFileName = 'users_test.json'
	var articleFileName = 'articles_test.json'
}
const usersFilePath = path.resolve(__dirname, `../data_store/${userFileName}`)
const articlesFilePath = path.resolve(__dirname, `../data_store/${articleFileName}`)


const urlEncodePreferences = (preferences) => {
	const DELEMETER = " OR "
	return preferences.join(DELEMETER)
}

/**
 * The function updates a user's "read" or "favorites" property with a new article ID and returns the
 * updated list of articles.
 * @param req - The `req` parameter is an object that represents the HTTP request made to the server.
 * It typically contains information such as the request method, headers, URL, and user authentication
 * details.
 * @param property - The `property` parameter is a string that represents the property of the user
 * object that needs to be updated. It can have two possible values: "read" or "favorites".
 * @returns an object with the following properties:
 * - `statusCode`: The status code of the response (either 404, 200, or 500).
 * - `message`: A message describing the result of the operation.
 * - `articles`: An array containing the updated list of articles for the user.
 */
const updateArticleForUser = (req, property) => {
	if (!["read", "favorites"].includes(property)) {
		throw new Error("Invalid property")
	}
	try {
		const allUsers = require(usersFilePath)
		const articles = require(articlesFilePath)
		const userToUpdate = _.find(allUsers, { email: req.user.email })
		const articleId = req.params.id

		if (!_.find(articles, { id: articleId })) {
			return { statusCode: 404, message: "No articles found", articles: [] }
		}
		userToUpdate[property] = _.union(userToUpdate[property], [articleId])
		fs.writeFile(usersFilePath, JSON.stringify(allUsers))
		return { statusCode: 200, message: "Article added successfully", articles: userToUpdate[property] }
	} catch (error) {
		console.error(error)
		return { statusCode: 500, message: error.message, articles: [] }
	}
}

/**
 * The function fetches articles for a user based on a specified property (either "read" or
 * "favorites") and returns the corresponding articles.
 * @param req - The `req` parameter is an object that represents the HTTP request made to the server.
 * It typically contains information such as the request method, headers, and user authentication
 * details.
 * @param property - The `property` parameter is used to specify the type of articles to fetch for the
 * user. It can have two possible values: "read" or "favorites".
 * @returns The function `fetchArticlesForUser` returns an object with the following properties:
 * - `statusCode`: The status code of the response (either 200, 404, or 500).
 * - `message`: A message describing the result of the operation.
 * - `articles`: An array of articles that match the specified property.
 */
const fetchArticlesForUser = (req, property) => {
	if (!["read", "favorites"].includes(property)) {
		throw new Error("Invalid property")
	}
	try {
		const allUsers = require(usersFilePath)
		const user = _.find(allUsers, { email: req.user.email })
		const articleIds = user[property]
		if (articleIds.length === 0) return { statusCode: 404, message: "Please add articles", articles: [] }
		const articles = require(articlesFilePath)
		return {
			statusCode: 200, message: `${property} articles found`, articles: _.filter(articles, (article) => _.includes(articleIds, article.id))
		}
	} catch (error) {
		console.error(error)
		return { statusCode: 500, message: error.message, articles: [] }
	}
}


module.exports = {
	urlEncodePreferences,
	updateArticleForUser,
	fetchArticlesForUser
}
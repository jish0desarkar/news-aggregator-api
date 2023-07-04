const fs = require("fs").promises
const path = require("path")
const _ = require("lodash")

const usersFilePath = path.resolve(__dirname, "../data_store/users.json")
const articlesFilePath = path.resolve(__dirname, "../data_store/articles.json")


const urlEncodePreferences = (preferences) => {
	const DELEMETER = " OR "
	return preferences.join(DELEMETER)
}

const updateArticleForUser = (req, res, property) => {
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

const fetchArticlesForUser = (req, res, property) => {
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
			statusCode: 200, message: "Favorite articles found", articles: _.filter(articles, (article) => _.includes(articleIds, article.id))
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
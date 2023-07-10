const makeRequest = require("../helpers/makeRequest")
const _ = require("lodash")
const categories = require("../data_store/categories.json")
const { v4: uuidv4 } = require("uuid")


// NewsAPI
const fetchFromNewsAPI = async (preferences = categories) => {
	const apiKey = process.env.NEWS_API_KEY
	const headers = {
		Authorization: apiKey,
	}
	const response = await makeRequest(preferences, headers, "https://newsapi.org/v2/everything")
	const extractedArticles = _.map(response.articles, (json) => {
		const article = _.pick(json, ["author", "title", "content"])
		article.source = "newsapi"
		article.id = uuidv4()
		return article
	})

	return extractedArticles
}

// newscatcherAPI
const fetchFromNewscatcherAPI = async (preferences = categories) => {
	const apiKey = process.env.NEWSCATCHER_API_KEY
	const headers = {
		"x-api-key": apiKey,
	}
	const response = await makeRequest(preferences, headers, "https://api.newscatcherapi.com/v2/search")
	const extractedArticles = _.map(response.articles, (json) => {
		const article = _.pick(json, ["author", "title", "summary"])
		article.source = "newscatcherapi"
		article.id = uuidv4()
		return article
	})

	return extractedArticles
}


// NewsData API
const fetchFromNewsDataAPI = async (preferences = categories) => {
	const apiKey = process.env.NEWS_DATA_API_KEY
	const headers = {
		"X-ACCESS-KEY": apiKey,
	}
	const response = await makeRequest(preferences, headers, "https://newsdata.io/api/1/news")
	const extractedArticles = _.map(response.results, (json) => {
		const article = _.pick(json, ["creator", "title", "content"])
		article.id = uuidv4()
		article.source = "newsdataapi"
		return article
	})

	return extractedArticles
}


module.exports = { fetchFromNewsAPI, fetchFromNewscatcherAPI, fetchFromNewsDataAPI }
const { MeiliSearch } = require("meilisearch")
const _ = require("lodash")
require("dotenv").config()
const path = require("path")

if (process.env.NODE_ENV !== "test") {
	var articleFileName = "articles.json"
}
else {
	var articleFileName = "articles_test.json"
}
const articlesFilePath = path.resolve(__dirname, `../data_store/${articleFileName}`)

const client = new MeiliSearch({ host: "https://meilisearch-production-e6f4.up.railway.app/", apiKey: process.env.MEILI_MASTER_KEY })

const addAndIndexArticles = async () => {
	const articles = require(articlesFilePath)
	client.deleteIndex("articles")
	client.index("articles").addDocuments(articles).then((res) => {
		client.index("articles")
			.updateFilterableAttributes([
				"source",
			])
	}).catch((err) => logger.error(err))
}

const searchArticlesWithKeyword = async (keyword, sources = ["newsapi", "newsdataapi", "newscatcherapi"]) => {
	return await client.index("articles")
		.search(keyword, { filter: `source IN [${sources}]`, limit: 300, hitsPerPage: 300 })
}

const searchArticlesWithPreferences = async (preferences = [], sources = ["newsapi", "newsdataapi", "newscatcherapi"]) => {
	const articles = require(articlesFilePath)
	if (preferences === []) {
		return articles
	}
	else {
		/* The `query_params` variable is an array of objects that will be used for making multiple search
		queries to the MeiliSearch index. */
		const query_params = preferences.map((preference) => {
			return {
				q: preference,
				indexUid: "articles",
				limit: 300,
				filter: `source IN [${sources}]`
			}
		})
		const response = await client.multiSearch({ queries: query_params })
		/* The line below is using the `_.flatMap` function
		from the lodash library to flatten the nested array of hits from the MeiliSearch response. */
		const articles = _.flatMap(response.results, "hits")
		return articles
	}
}


module.exports = {
	addAndIndexArticles,
	client,
	searchArticlesWithKeyword,
	searchArticlesWithPreferences
}


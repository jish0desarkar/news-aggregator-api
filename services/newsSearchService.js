const { MeiliSearch } = require("meilisearch")
const _ = require("lodash")


const client = new MeiliSearch({ host: "https://meilisearch-production-e6f4.up.railway.app/", apiKey: process.env.MEILI_MASTER_KEY })

const addAndIndexArticles = async () => {
	const articles = require("../data_store/articles.json")
	client.deleteIndex("articles")
	client.index("articles").addDocuments(articles).then((res) => {
		console.log(res)
		client.index("articles")
			.updateFilterableAttributes([
				"source",
			])
	}).catch((err) => console.log(err))
}

const searchArticlesWithKeyword = async (keyword, sources = ["newsapi", "newsdataapi", "newscatcherapi"]) => {
	return await client.index("articles")
		.search(keyword, { filter: `source IN [${sources}]`, limit: 300, hitsPerPage: 300 })
}

const searchArticlesWithPreferences = async (preferences = [], sources = ["newsapi", "newsdataapi", "newscatcherapi"]) => {
	const articles = require("../data_store/articles.json")
	if (preferences === []) {
		return articles
	}
	else {
		const query_params = preferences.map((preference) => {
			return {
				q: preference,
				indexUid: "articles",
				limit: 300,
				filter: `source IN [${sources}]`
			}
		})
		const response = await client.multiSearch({ queries: query_params })
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


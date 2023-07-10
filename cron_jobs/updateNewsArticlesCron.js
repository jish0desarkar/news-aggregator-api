const schedule = require("node-schedule")
const _ = require("lodash")
const { fetchFromNewsAPI, fetchFromNewscatcherAPI, fetchFromNewsDataAPI } = require("../services/fetchNewsFromSources")
const fs = require("fs").promises
const path = require("path")
const articlesFilePath = path.join(__dirname, "..", "data_store", "articles.json")
const { addAndIndexArticles } = require("../services/newsSearchService")


// Cron runs every 2 hours
schedule.scheduleJob("0 */2 * * *", updateStoredArticles)

async function updateStoredArticles() {
	const response = await Promise.all([fetchFromNewsAPI(), fetchFromNewscatcherAPI(), fetchFromNewsDataAPI()])
	await fs.writeFile(articlesFilePath, JSON.stringify(_.flatten(response)))
	addAndIndexArticles()
}
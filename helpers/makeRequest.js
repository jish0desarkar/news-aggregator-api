const axios = require("axios")
const { urlEncodePreferences } = require("../helpers/util")


module.exports = async (preferences, headers, requestUrl) => {
	const searchKeywords = urlEncodePreferences(preferences)
	const params = {
		q: searchKeywords
	}
	try {
		const response = await axios.get(requestUrl, {
			headers: headers,
			params: params,
		})
		return response.data
	} catch (error) {
		return error
	}
}
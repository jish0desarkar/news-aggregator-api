const _ = require("lodash")
const schemas = require("../schemas")

module.exports = () => {
	return async (req, res, next) => {
		console.log(req.route.path)
		const route = req.route.path
		if (_.has(schemas, route)) {
			// get the required schema based on the route
			const requiredSchema = _.get(schemas, route)
			try {
				req.body = await requiredSchema.validateAsync(req.body, { abortEarly: false })
			} catch (err) {
				return res.status(422).send({ validationError: err.details })
			}
		}
		next()
	}
}


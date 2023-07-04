const Joi = require("joi")

// Login and Register validator
// Creates empty preferences, sources, read, favorites
const userSchema = Joi.object({
	email: Joi.string().min(3).required().email(),
	password: Joi.string().min(6),
	preferences: Joi.array()
		.default([])
		.forbidden(),
	sources: Joi.array()
		.default([])
		.forbidden(),
	read: Joi.array()
		.default([])
		.forbidden(),
	favorites: Joi.array()
		.default([])
		.forbidden()
})

// Preferences endpoints validator
// Restricts preferences to a predifined list only
const preferencesSchema = Joi.object({
	preferences: Joi.array().items(Joi.string().valid(...require("./data_store/categories.json")).alphanum().min(2)),
	sources: Joi.array().items(Joi.string().valid("newsapi", "newscatcherapi", "newsdataapi"))
})

module.exports = {
	"/login": userSchema,
	"/register": userSchema,
	"/preferences": preferencesSchema
}
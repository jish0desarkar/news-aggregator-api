const jwt = require("jsonwebtoken")
const _ = require("lodash")
const fs = require("fs")
require('dotenv').config

if (process.env.NODE_ENV !== 'test') {
	var userFileName = "users.json"
}
else {
	var userFileName = "users_test.json"
}
const usersFilePath = require("path").join(__dirname, "..", "data_store", `${userFileName}`)

const verifyAndsetCurrentUser = (req, res, next) => {
	const allUsers = JSON.parse(fs.readFileSync(usersFilePath))
	const accessToken = req.header("authorization") && req.header("authorization").split(" ")[1]

	if (!accessToken) return res.status(403).send({ error: "Bearer token must be provided to access this resource" })

	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
		if (err) return res.status(403).send({ error: err.message })
		// to check email exists
		req.user = _.find(allUsers, { email: payload.email })
		if (req.user === undefined) return res.status(404).send({ error: "User with this email not found" })
		if (!user.isEmailVerified) return res.status(403).send({ error: "Email not verified" })
		next()
	})
}

module.exports = { verifyAndsetCurrentUser }
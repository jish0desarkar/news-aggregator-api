require("dotenv").config()
const fs = require("fs").promises
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const path = require("path")
const _ = require("lodash")
const usersFilePath = path.join(__dirname, "..", "data_store", "users.json")
const saltRounds = 2

// endpoint - /register
const registerUser = async (req, res) => {
	const allUsers = JSON.parse(await fs.readFile(usersFilePath))
	const email = req.body.email

	if (_.find(allUsers, { email })) return res.status(409).send("user already registered")

	const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
	allUsers.push({ email: email, password: hashedPassword })
	const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET)
	await fs.writeFile(usersFilePath, JSON.stringify(allUsers))

	return res.status(200).send({ accessToken: accessToken })
}

// endpoint - /login
const loginUser = async (req, res) => {
	const allUsers = JSON.parse(await fs.readFile(usersFilePath))
	const email = req.body.email
	const user = _.find(allUsers, { email })
	if (!user) return res.status(404).send({ error: "Please register first" })

	if (await bcrypt.compare(req.body.password, user.password)) {
		const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET)
		return res.status(200).send({ accessToken })
	} else {
		return res.status(401).send({ error: "Wrong passwords" })
	}
}

// endpoint - GET /preferences
const getUserPreferences = async (req, res) => {
	return res.status(200).send({ userPreferences: req.user.preferences, userSources: req.user.sources })
}

// endpoint - PUT /preferences
const updateUserPreferences = async (req, res) => {
	const allUsers = JSON.parse(await fs.readFile(usersFilePath))

	// Get the user ref in the users.json file
	const userToUpdate = _.find(allUsers, { email: req.user.email })
	userToUpdate.preferences = req.body.preferences
	userToUpdate.sources = req.body.sources
	fs.writeFile(usersFilePath, JSON.stringify(allUsers))
	return res.status(200).json({ userPreferences: userToUpdate.preferences, userSources: userToUpdate.sources })
}
module.exports = { registerUser, loginUser, getUserPreferences, updateUserPreferences }
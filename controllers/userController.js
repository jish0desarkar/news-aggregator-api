require("dotenv").config()
const fs = require("fs").promises
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const path = require("path")
const _ = require("lodash")
const redisClient = require("../services/redisService")
const { sendEmail } = require("../services/emailService")
const crypto = require("crypto")
const logger = require("../libs/logger")
const saltRounds = 2

if (process.env.NODE_ENV !== "test") {
	var userFileName = "users.json"
}
else {
	var userFileName = "users_test.json"
}

const usersFilePath = path.join(__dirname, "..", "data_store", `${userFileName}`)

// endpoint - /register
const registerUser = async (req, res) => {
	const allUsers = JSON.parse(await fs.readFile(usersFilePath))
	const email = req.body.email
	if (_.find(allUsers, { email })) return res.status(409).send("user already registered")
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
		req.body.password = hashedPassword
		allUsers.push(req.body)
		await fs.writeFile(usersFilePath, JSON.stringify(allUsers))
		return res.status(200).send({ message: "User registered successfully" })
	} catch (err) {
		return res.status(500).send(err)
	}
}

// endpoint - /send-verification-email
const sendVerficationEmail = async (req, res) => {
	const allUsers = JSON.parse(await fs.readFile(usersFilePath))
	const email = req.body.email
	const user = _.find(allUsers, { email })

	if (!user) return res.status(404).send({ error: "Please register first" })
	if (user.isEmailVerified) return res.status(409).send({ error: "Email already verified. Please login." })

	user.emailVerificationToken = crypto.randomBytes(32).toString("hex")
	const baseUrl = process.env.BASE_URL
	const emailText = `Hi,Please verify your email address by clicking on the following link: ${baseUrl}/verify/${user.emailVerificationToken}`
	try { // Write the email verification token to the users.json file
		await sendEmail({
			to: email,
			subject: "Verify your email address",
			message: emailText
		})
		fs.writeFile(usersFilePath, JSON.stringify(allUsers))
		return res.status(200).send({ message: "Email sent successfully" })
	} catch (err) {
		logger.error(err)
		return res.status(500).send(err)
	}
}

// endpoint - /verify/:emailVerificationToken
const verifyUserEmail = async (req, res) => {
	const allUsers = JSON.parse(await fs.readFile(usersFilePath))
	const emailVerificationToken = req.params.emailVerificationToken
	const user = _.find(allUsers, { emailVerificationToken })
	if (!user) return res.status(404).send({ error: "Invalid token" })
	if (user.isEmailVerified) return res.status(409).send({ error: "Email already verified. Please login." })
	user.isEmailVerified = true
	delete user.emailVerificationToken
	await fs.writeFile(usersFilePath, JSON.stringify(allUsers))
	return res.status(200).send({ message: "Email verified successfully" })
}

// endpoint - /login
const loginUser = async (req, res) => {
	const allUsers = JSON.parse(await fs.readFile(usersFilePath))
	const email = req.body.email
	const user = _.find(allUsers, { email })

	if (!user) return res.status(404).send({ error: "Please register first" })
	if (!user.isEmailVerified) return res.status(403).send({ error: "Please verify your email" })

	if (await bcrypt.compare(req.body.password, user.password)) {
		const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET)
		return res.status(200).send({ accessToken })
	} else {
		return res.status(401).send({ error: "Wrong password" })
	}
}

// endpoint - GET /preferences
const getUserPreferences = async (req, res) => {
	return res.status(200).send({ userPreferences: req.user.preferences, userSources: req.user.sources })
}

// endpoint - PUT /preferences
const updateUserPreferences = async (req, res) => {
	const allUsers = JSON.parse(await fs.readFile(usersFilePath))
	/* Deleting the cached articles when updating the user preferences as the cache would be stale */
	redisClient.del(`${req.user.email}:prefered_articles`)
	try {
		// Get the user ref in the users.json file
		const userToUpdate = _.find(allUsers, { email: req.user.email })
		userToUpdate.preferences = req.body.preferences
		userToUpdate.sources = req.body.sources
		fs.writeFile(usersFilePath, JSON.stringify(allUsers))
		return res.status(200).json({ userPreferences: userToUpdate.preferences, userSources: userToUpdate.sources })
	} catch (err) {
		return res.status(500).send(err)
	}
}
module.exports = { registerUser, loginUser, getUserPreferences, updateUserPreferences, sendVerficationEmail, verifyUserEmail }
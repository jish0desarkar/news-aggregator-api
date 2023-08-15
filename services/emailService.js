const nodemailer = require('nodemailer')
require("dotenv").config
const logger = require("../libs/logger")

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_SENDER,
		pass: process.env.EMAIL_API_PASSWORD
	}
});

const sendEmail = async ({ to, subject, message }) => {
	const mailOptions = {
		from: process.env.EMAIL_SENDER,
		to: to,
		subject: subject,
		text: message
	};
	return await transporter.sendMail(mailOptions)
}

module.exports = {
	sendEmail
}
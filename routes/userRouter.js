const router = require("express").Router()
const { registerUser, loginUser, getUserPreferences, updateUserPreferences, sendVerficationEmail, verifyUserEmail } = require("../controllers/userController")
const schemaValidator = require("../middleware/schemaValidator")
const { verifyAndsetCurrentUser } = require("../middleware/auth")

router.post("/register", schemaValidator(), registerUser)
router.post("/login", schemaValidator(), loginUser)
router.route("/preferences")
	.get(schemaValidator(), verifyAndsetCurrentUser, getUserPreferences)
	.put(schemaValidator(), verifyAndsetCurrentUser, updateUserPreferences)
router.post('/send-verification-email', schemaValidator(), sendVerficationEmail)
router.get('/verify/:emailVerificationToken', verifyUserEmail)
// router.post("refreshToken", refreshAccessToken)

module.exports = router
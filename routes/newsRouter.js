const router = require("express").Router()
const { getArticlesWithPreferences, getArticlesWithKeyword,
	addReadArticleForUser, addFavoriteArticleForUser,
	getReadArticleForUser, getFavoriteArticleForUser } = require("../controllers/newsController")

const { verifyAndsetCurrentUser } = require("../middleware/auth")

router.get("/", verifyAndsetCurrentUser, getArticlesWithPreferences)
router.get("/search/:keyword", getArticlesWithKeyword)

router.post("/:id/read", verifyAndsetCurrentUser, addReadArticleForUser)
router.post("/:id/favorite", verifyAndsetCurrentUser, addFavoriteArticleForUser)
router.get("/favorites", verifyAndsetCurrentUser, getFavoriteArticleForUser)
router.get("/read", verifyAndsetCurrentUser, getReadArticleForUser)


module.exports = router
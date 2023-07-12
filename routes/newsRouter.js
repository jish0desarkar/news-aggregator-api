const router = require("express").Router()
const { getArticlesWithPreferences, getArticlesWithKeyword,
	addReadArticleForUser, addFavoriteArticleForUser,
	getReadArticleForUser, getFavoriteArticleForUser } = require("../controllers/newsController")
const { getNewsArticlesFromCache } = require("../middleware/newsCache")
const { verifyAndsetCurrentUser } = require("../middleware/auth")

router.get(
	"/",
	verifyAndsetCurrentUser,
	(req, res, next) => {
		getNewsArticlesFromCache(`${req.user.email}:prefered_articles`)(req, res, next);
	},
	getArticlesWithPreferences
);

router.get("/search/:keyword",
	verifyAndsetCurrentUser,
	(req, res, next) => {
		getNewsArticlesFromCache(`${req.user.email}:search_${req.params.keyword}_articles`)(req, res, next);
	},
	getArticlesWithKeyword)

router.post("/:id/read", verifyAndsetCurrentUser, addReadArticleForUser)
router.post("/:id/favorite", verifyAndsetCurrentUser, addFavoriteArticleForUser)

router.get("/favorites",
	verifyAndsetCurrentUser,
	(req, res, next) => {
		getNewsArticlesFromCache(`${req.user.email}:favorite_articles`)(req, res, next);
	},
	getFavoriteArticleForUser)

router.get("/read",
	verifyAndsetCurrentUser,
	(req, res, next) => {
		getNewsArticlesFromCache(`${req.user.email}:read_articles`)(req, res, next);
	},
	getReadArticleForUser)


module.exports = router
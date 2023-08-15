const express = require("express")
const app = express()
const port = 3000
const userRouter = require("./routes/userRouter")
const newsRouter = require("./routes/newsRouter")
require("./cron_jobs/updateNewsArticlesCron")
const logger = require("./libs/logger")
const { requestLogger } = require("./middleware/requestLogger")
const { rateLimiter } = require("./middleware/rateLimiter")
const xss = require("xss-clean")

app.listen(port, () => logger.info(`News app listening on port ${port}!`))
app.use(express.json())
app.use(requestLogger)
app.use(rateLimiter)

/* middleware helps prevent cross-site scripting (XSS) attacks by sanitizing user input and removing
any potentially malicious HTML code or JavaScript code. It ensures that any user input is safe to be
rendered in the browser, reducing the risk of XSS vulnerabilities. */
app.use(xss());

app.use("/", userRouter)
app.use("/news", newsRouter)



module.exports = app
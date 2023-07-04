const express = require("express")
const app = express()
const port = 3000
const userRouter = require("./routes/userRouter")
const newsRouter = require("./routes/newsRouter")
require("./cron_jobs/updateNewsArticlesCron")

app.listen(port, () => console.log(`News app listening on port ${port}!`))
app.use(express.json())
app.use("/", userRouter)
app.use("/news", newsRouter)
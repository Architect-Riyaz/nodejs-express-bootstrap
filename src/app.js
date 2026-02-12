import express from "express"
import router from "./routes/index.js"
import cookieParser from "cookie-parser"
import addCors from "./middleware/cors.js"
import limiter from "./middleware/rateLimit.js"
import ErrorMiddleware from "./middleware/error.js"
import bodyParser from "body-parser"
import logRequest from "./middleware/logging.js"

const app = express()

app.use(limiter)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(bodyParser.json())

app.use(logRequest)
app.use(addCors())

app.use("/", express.static("public"))
app.use("/api", router)

app.use(ErrorMiddleware)

export default app

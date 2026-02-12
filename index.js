import http from "http"
import app from "./src/app.js"
import handlePromise from "./src/middleware/handlePromise.js"
import { connectdb } from "./src/db/index.js"
import env from "./src/config/env.js"
import autoRun from "./src/scripts/index.js"

const PORT = env.PORT || 5000

const server = http.createServer(app)

const main = handlePromise(async () => {
  await connectdb()
  await autoRun()
  server.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`)
  })
})
main()

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to Unhandled Promise Rejection`)
  server.close(() => {
    process.exit(1)
  })
})

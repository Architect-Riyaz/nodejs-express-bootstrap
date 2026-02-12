import express from "express"
import userRoutes from "./users.js"
const v1Router = express.Router()

v1Router.use("/users", userRoutes)

export default v1Router

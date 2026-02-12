import mongoose from "mongoose"
import env from "../config/env.js"

console.log(env.MONGODB_URL)

export const connectdb = () =>
  mongoose.connect(env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

export const disconnectdb = () => {
  mongoose.connection.close()
}

import dotenv from "dotenv"
import { NODE_ENV_MAP } from "../constants/index.js"

if (process.env.NODE_ENV === NODE_ENV_MAP.PRODUCTION) {
  dotenv.config({ path: ".env.prod" })
} else {
  dotenv.config()
}

const env = process.env

export default env

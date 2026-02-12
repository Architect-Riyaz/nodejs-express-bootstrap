import rateLimit from "express-rate-limit"
import env from "../config/env.js"
import { NODE_ENV_MAP } from "../constants/index.js"

const limit = env.NODE_ENV === NODE_ENV_MAP.PRODUCTION ? 30 : 500

const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: limit, // limit each IP to 100 requests per windowMs
})

export default limiter
